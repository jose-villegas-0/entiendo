# entiendo

Plugin para Claude Code que lee **toda tu carpeta de trabajo** y genera un dashboard HTML que
te la explica de lo **macro a lo micro**, pensado para un **usuario no técnico**.

No es un dashboard genérico de datos: es una **capa de inteligencia visual** que te deja decir
*"Mi carpeta tiene estos productos, cada uno hace esto, está en este estado, me cuesta estos
tokens, y acá están mis riesgos — y cómo se arreglan bien."*

## Arquitectura (template + DATA)

```
dashboard.html  =  template/shell.html  (fijo)  +  DATA JSON  (generado por /entiendo)
```

| Path | Rol |
|------|-----|
| `commands/entiendo.md` | Instrucciones del comando: explorar → modelar → validar → ensamblar |
| `template/shell.html` | App shell fija (UI, CSS, JS). Marcador `/*__ENTIENDO_DATA__*/` |
| `schema/workspace.schema.json` | Contrato del objeto DATA |
| `scripts/validate.mjs` | Validación de negocio del DATA |
| `scripts/assemble.mjs` | Inyecta DATA en el shell → HTML final |
| `examples/data/*.json` | Modelos de ejemplo |
| `examples/dashboard.html` | Ejemplo ensamblado (no editar a mano: reensamblar) |
| `fixtures/` | Fixtures mínimos para smoke tests |

**Regla:** la IA solo genera DATA. El shell se versiona en el repo; no se reescribe en cada corrida.

## El comando `/entiendo`

1. Recorre TODA la carpeta (sin `node_modules`, `.git`, `dist`, `build`, etc.).
2. Detecta **múltiples productos** vs herramientas internas vs infra (sin mezclar info).
3. Lee archivos clave y construye un **DATA** conforme al schema.
4. Valida (IDs, edges, riesgos graves, tokens honestos).
5. Ensambla `dashboard.html` = shell + DATA y lo abre en el browser.

## Qué entiende de cada producto

- **Goal** (1 frase del dueño) y propósito.
- **Piezas** (nodos + edges): pipeline legible.
- **Estado** listo / a medias / falta.
- **Tareas** por producto (nunca mezcladas).
- **Tecnologías**, **decisiones**, **código muerto** (candidato).
- **Tokens** desde logs de Claude Code (best-effort; si no hay → `null`).
- **Riesgos** con best practice: qué pasa → por qué importa → cómo se hace bien → links.

## Las vistas del dashboard (shell)

1. **Mapa** — lienzo de nodos (pan/zoom/drill-in).
2. **Tareas** — Trello con carril por producto.
3. **Riesgos & Best Practices** — corazón educativo.
4. **Costos (tokens)** — o estado vacío amable.
5. **Drawer de detalle** + **chat dock** (respuestas desde DATA embebido).

## Principios de diseño (no negociables)

- Usuario no técnico; instructional design ante riesgos.
- Dark mode por defecto, AA, `prefers-reduced-motion`.
- UX: Nielsen, UCD, overview-first de Shneiderman, progressive disclosure.

## Fase 2 (bidireccional)

Botones y chat ya están en el shell en modo "te muestro cómo". Fase 2: puente local + Agent SDK.
Ver `docs/roadmap.md`.

## Desarrollo local

```bash
node scripts/validate.mjs examples/data/entiendo.workspace.json fixtures/minimal.workspace.json
node scripts/assemble.mjs examples/data/entiendo.workspace.json -o examples/dashboard.html
```
