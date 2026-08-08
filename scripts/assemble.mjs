#!/usr/bin/env node
/**
 * Ensambla dashboard.html = template/shell.html + DATA (JSON).
 *
 * Uso:
 *   node scripts/assemble.mjs examples/data/entiendo.workspace.json -o examples/dashboard.html
 *   node scripts/assemble.mjs path/to/workspace.json -o dashboard.html --skip-validate
 *
 * Sin dependencias npm. Por defecto valida el DATA antes de escribir.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateWorkspace } from "./validate.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DEFAULT_SHELL = path.join(ROOT, "template", "shell.html");
const MARKER = "/*__ENTIENDO_DATA__*/";

function usage() {
  console.error(`Uso: node scripts/assemble.mjs <data.json> -o <dashboard.html> [opciones]

Opciones:
  -o, --out <path>     Archivo de salida (requerido)
  --shell <path>       Shell template (default: template/shell.html)
  --skip-validate      No correr validación de negocio
  -h, --help           Esta ayuda`);
}

function parseArgs(argv) {
  const out = { data: null, outPath: null, shell: DEFAULT_SHELL, skipValidate: false };
  const args = [...argv];
  while (args.length) {
    const a = args.shift();
    if (a === "-h" || a === "--help") {
      usage();
      process.exit(0);
    }
    if (a === "-o" || a === "--out") {
      out.outPath = args.shift();
      continue;
    }
    if (a === "--shell") {
      out.shell = path.resolve(args.shift());
      continue;
    }
    if (a === "--skip-validate") {
      out.skipValidate = true;
      continue;
    }
    if (a.startsWith("-")) {
      console.error(`Opción desconocida: ${a}`);
      usage();
      process.exit(2);
    }
    if (!out.data) out.data = path.resolve(a);
    else {
      console.error("Demasiados argumentos posicionales");
      usage();
      process.exit(2);
    }
  }
  return out;
}

function injectData(shellHtml, data) {
  if (!shellHtml.includes(MARKER)) {
    throw new Error(
      `El shell no contiene el marcador ${MARKER}. ¿Es template/shell.html de entiendo?`
    );
  }
  // Pretty JSON for readability / diffs; valid as JS expression
  const json = JSON.stringify(data, null, 2);
  // Replace: const DATA = /*__ENTIENDO_DATA__*/ null;
  // with:    const DATA = /*__ENTIENDO_DATA__*/ { ... };
  const pattern = /const\s+DATA\s*=\s*\/\*__ENTIENDO_DATA__\*\/\s*null\s*;?/;
  if (!pattern.test(shellHtml)) {
    // fallback: replace marker + null only
    return shellHtml.replace(`${MARKER} null`, `${MARKER} ${json}`);
  }
  return shellHtml.replace(pattern, `const DATA = ${MARKER} ${json};`);
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!opts.data || !opts.outPath) {
    usage();
    process.exit(2);
  }

  if (!fs.existsSync(opts.data)) {
    console.error(`No existe el DATA: ${opts.data}`);
    process.exit(1);
  }
  if (!fs.existsSync(opts.shell)) {
    console.error(`No existe el shell: ${opts.shell}`);
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(opts.data, "utf8"));
  } catch (err) {
    console.error(`JSON inválido en ${opts.data}: ${err.message}`);
    process.exit(1);
  }

  if (!opts.skipValidate) {
    const result = validateWorkspace(data, {
      fileLabel: path.relative(process.cwd(), opts.data) || opts.data,
    });
    for (const w of result.warnings) console.warn(`warn  ${w}`);
    if (!result.ok) {
      console.error("Validación falló; no se escribió el dashboard.");
      for (const err of result.errors) console.error(`error ${err}`);
      process.exit(1);
    }
  }

  const shell = fs.readFileSync(opts.shell, "utf8");
  let html;
  try {
    html = injectData(shell, data);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  // sanity: DATA must not still be null
  if (/const\s+DATA\s*=\s*\/\*__ENTIENDO_DATA__\*\/\s*null/.test(html)) {
    console.error("Fallo al inyectar DATA (sigue en null)");
    process.exit(1);
  }

  const outAbs = path.resolve(opts.outPath);
  fs.mkdirSync(path.dirname(outAbs), { recursive: true });
  fs.writeFileSync(outAbs, html);
  console.log(
    `assembled ${path.relative(process.cwd(), outAbs) || outAbs} ← ${path.relative(process.cwd(), opts.data)} + ${path.relative(process.cwd(), opts.shell)}`
  );
}

main();
