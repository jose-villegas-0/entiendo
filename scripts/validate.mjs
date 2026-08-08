#!/usr/bin/env node
/**
 * Valida un modelo DATA (workspace JSON) contra schema/workspace.schema.json
 * + reglas de negocio de entiendo (IDs únicos, edges, riesgos graves, etc.).
 *
 * Uso:
 *   node scripts/validate.mjs examples/data/entiendo.workspace.json
 *   node scripts/validate.mjs fixtures/*.json
 *
 * Exit 0 = ok · Exit 1 = errores · Sin dependencias npm.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SCHEMA_PATH = path.join(ROOT, "schema", "workspace.schema.json");

const ESTADOS = new Set(["listo", "aMedias", "falta"]);
const SEVERIDADES = new Set(["alta", "media", "baja"]);
const TIPOS_RIESGO = new Set(["seguridad", "escala", "codigoMuerto", "deuda"]);
const EDGE_KINDS = new Set(["done", "future"]);

function loadJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    return { __error: `No se pudo leer/parsear JSON: ${e.message}` };
  }
}

function isObj(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

/**
 * Validación de negocio (más estricta / útil que el schema solo).
 * Devuelve array de strings de error.
 */
export function validateWorkspace(data, { fileLabel = "DATA" } = {}) {
  const errors = [];
  const warn = [];
  const e = (msg) => errors.push(`${fileLabel}: ${msg}`);
  const w = (msg) => warn.push(`${fileLabel}: ${msg}`);

  if (data?.__error) {
    e(data.__error);
    return { ok: false, errors, warnings: warn };
  }
  if (!isObj(data)) {
    e("debe ser un objeto");
    return { ok: false, errors, warnings: warn };
  }

  // --- required top-level ---
  for (const k of ["nombre", "resumen", "productos", "herramientasInternas", "riesgos"]) {
    if (!(k in data)) e(`falta campo requerido "${k}"`);
  }
  if (!("tokens" in data)) e('falta campo requerido "tokens" (usar null si no hay datos)');

  if (typeof data.nombre !== "string" || !data.nombre.trim()) e("nombre debe ser string no vacío");
  if (typeof data.resumen !== "string" || !data.resumen.trim()) e("resumen debe ser string no vacío");

  if (!Array.isArray(data.productos) || data.productos.length < 1) {
    e("productos debe ser un array con al menos 1 producto");
  }
  if (!Array.isArray(data.herramientasInternas)) e("herramientasInternas debe ser un array");
  if (!Array.isArray(data.riesgos)) e("riesgos debe ser un array");

  if (data.schemaVersion != null && !/^\d+\.\d+\.\d+$/.test(String(data.schemaVersion))) {
    e('schemaVersion debe ser semver "X.Y.Z" si se incluye');
  }

  // --- tokens ---
  if (data.tokens !== null && data.tokens !== undefined) {
    if (!isObj(data.tokens)) {
      e("tokens debe ser objeto o null");
    } else if (data.tokens.disponible === false) {
      // empty-friendly ok
    } else if (typeof data.tokens.facturable !== "number" || data.tokens.facturable < 0) {
      e("tokens.facturable debe ser number >= 0 (o tokens: null / disponible:false)");
    }
  }

  const productIds = new Set();
  const allTaskIds = new Set();
  const allRiskIds = new Set();

  (data.productos || []).forEach((p, pi) => {
    const pp = `productos[${pi}]`;
    if (!isObj(p)) {
      e(`${pp} debe ser objeto`);
      return;
    }
    for (const k of ["id", "nombre", "goal", "proposito", "salud", "nodos"]) {
      if (p[k] === undefined || p[k] === null || p[k] === "") e(`${pp}.${k} es requerido`);
    }
    if (p.id) {
      if (productIds.has(p.id)) e(`id de producto duplicado: "${p.id}"`);
      productIds.add(p.id);
    }
    if (p.salud && !ESTADOS.has(p.salud)) e(`${pp}.salud inválido "${p.salud}" (listo|aMedias|falta)`);
    if (!Array.isArray(p.nodos) || p.nodos.length < 1) e(`${pp}.nodos debe tener al menos 1 nodo`);

    const nodeIds = new Set();
    (p.nodos || []).forEach((n, ni) => {
      const nn = `${pp}.nodos[${ni}]`;
      if (!isObj(n)) {
        e(`${nn} debe ser objeto`);
        return;
      }
      for (const k of ["id", "nombre", "queHace", "estado", "x", "y"]) {
        if (n[k] === undefined || n[k] === null || n[k] === "") e(`${nn}.${k} es requerido`);
      }
      if (n.id) {
        if (nodeIds.has(n.id)) e(`${pp}: id de nodo duplicado "${n.id}"`);
        nodeIds.add(n.id);
      }
      if (n.estado && !ESTADOS.has(n.estado)) e(`${nn}.estado inválido "${n.estado}"`);
      if (typeof n.x !== "number" || typeof n.y !== "number") e(`${nn}.x e y deben ser numbers`);

      (n.tareas || []).forEach((t, ti) => {
        const tt = `${nn}.tareas[${ti}]`;
        if (!isObj(t)) {
          e(`${tt} debe ser objeto`);
          return;
        }
        if (!t.id || !t.titulo || !t.estado) e(`${tt} requiere id, titulo, estado`);
        if (t.estado && !ESTADOS.has(t.estado)) e(`${tt}.estado inválido`);
        if (t.id) {
          if (allTaskIds.has(t.id)) e(`id de tarea duplicado en el workspace: "${t.id}"`);
          allTaskIds.add(t.id);
        }
        if (t.productoId && p.id && t.productoId !== p.id) {
          e(`${tt}.productoId "${t.productoId}" no coincide con producto padre "${p.id}" (no mezclar productos)`);
        }
      });
    });

    (p.edges || []).forEach((ed, ei) => {
      const ee = `${pp}.edges[${ei}]`;
      if (!isObj(ed) || !ed.from || !ed.to) {
        e(`${ee} requiere from y to`);
        return;
      }
      if (!nodeIds.has(ed.from)) e(`${ee}.from "${ed.from}" no existe en nodos de "${p.id}"`);
      if (!nodeIds.has(ed.to)) e(`${ee}.to "${ed.to}" no existe en nodos de "${p.id}"`);
      if (ed.kind && !EDGE_KINDS.has(ed.kind)) e(`${ee}.kind inválido (done|future)`);
    });

    // jerga cruda frecuente en goal/proposito (aviso, no error duro)
    const jargon = /\b(API REST|endpoint|webhook|deploy|N\+1|MCP)\b/;
    if (jargon.test(p.goal || "") || jargon.test(p.proposito || "")) {
      w(`${pp}: goal/proposito parece tener jerga sin traducir — revisá reglas de traducción`);
    }
  });

  (data.riesgos || []).forEach((r, ri) => {
    const rr = `riesgos[${ri}]`;
    if (!isObj(r)) {
      e(`${rr} debe ser objeto`);
      return;
    }
    for (const k of ["id", "tipo", "severidad", "titulo", "dondeEsta", "explicacion", "why", "fix", "pasos"]) {
      if (r[k] === undefined || r[k] === null || r[k] === "") e(`${rr}.${k} es requerido`);
    }
    if (r.id) {
      if (allRiskIds.has(r.id)) e(`id de riesgo duplicado: "${r.id}"`);
      allRiskIds.add(r.id);
    }
    if (r.tipo && !TIPOS_RIESGO.has(r.tipo)) e(`${rr}.tipo inválido`);
    if (r.severidad && !SEVERIDADES.has(r.severidad)) e(`${rr}.severidad inválida`);
    if (!Array.isArray(r.pasos) || r.pasos.length < 1) e(`${rr}.pasos debe tener al menos 1 paso`);
    if (r.links && !Array.isArray(r.links)) e(`${rr}.links debe ser array`);
    // riesgos graves deben enseñar
    if (r.severidad === "alta") {
      if (!r.why || !r.fix || !Array.isArray(r.pasos) || r.pasos.length < 1) {
        e(`${rr}: riesgo alta severidad debe traer why + fix + pasos (enseñar, no asustar)`);
      }
    }
  });

  return { ok: errors.length === 0, errors, warnings: warn };
}

function main() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith("-"));
  if (!args.length) {
    console.error("Uso: node scripts/validate.mjs <archivo.workspace.json> [...]");
    process.exit(2);
  }

  // schema presence check (documental; la validación fuerte es de negocio)
  if (!fs.existsSync(SCHEMA_PATH)) {
    console.warn(`aviso: no se encontró ${path.relative(ROOT, SCHEMA_PATH)}`);
  }

  let failed = false;
  for (const arg of args) {
    const file = path.resolve(arg);
    const label = path.relative(process.cwd(), file) || file;
    const data = loadJson(file);
    const result = validateWorkspace(data, { fileLabel: label });
    if (result.warnings.length) {
      for (const w of result.warnings) console.warn(`  warn  ${w}`);
    }
    if (result.ok) {
      console.log(`ok     ${label}`);
    } else {
      failed = true;
      console.error(`FAIL   ${label}`);
      for (const err of result.errors) console.error(`  error ${err}`);
    }
  }
  process.exit(failed ? 1 : 0);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) main();
