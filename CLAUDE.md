# entiendo

Plugin para Claude Code que lee **toda tu carpeta de trabajo** y genera un dashboard HTML que
te la explica de lo **macro a lo micro**, pensado para un **usuario no técnico**.

No es un dashboard genérico de datos: es una **capa de inteligencia visual** que te deja decir
*"Mi carpeta tiene estos productos, cada uno hace esto, está en este estado, me cuesta estos
tokens, y acá están mis riesgos — y cómo se arreglan bien."*

## El comando `/entiendo`

Cuando se invoca desde cualquier carpeta:

1. Recorre TODA la carpeta (sin abrir `node_modules`, `.git`, `dist`, `build`, etc.).
2. **Detecta múltiples productos** y los separa de las **herramientas/agentes internos** y de la
   infra/config. La información de cada producto NO se mezcla con la de los demás.
3. Lee los archivos clave de cada producto: CLAUDE.md, README, manifests (package.json,
   requirements.txt, pyproject.toml…), puntos de entrada, `/commands`, `/agents`, `/prompts`,
   `/skills`, configs de MCP, docs y ADRs.
4. Construye un modelo del workspace, separado por producto, con todas las dimensiones (abajo).
5. Genera un `dashboard.html` autocontenido (sin dependencias, doble clic) y lo abre en el browser.

## Qué entiende de cada producto

- **Goal** (1 frase, como lo diría el dueño) y propósito.
- **Piezas**: servicios y agentes, qué hace cada uno y cómo se conectan (el pipeline).
- **Estado**: qué está listo / a medias / falta.
- **Tareas**: TODOs y pendientes, **separados por producto** (nunca mezclados).
- **Tecnologías**: el stack de cada producto.
- **Decisiones** tomadas (inferidas de docs, ADRs, commits).
- **Código muerto / que no sirve**: stubs, funciones vacías, huérfanos (marcado como "candidato").
- **Consumo de tokens**: parseando los logs de sesión de Claude Code
  (`~/.claude/projects/<carpeta>/*.jsonl`); marca dónde se gastó de más. Best-effort con
  degradación elegante si no hay datos.
- **Riesgos** de seguridad y de escala, cada uno con su **best practice**: qué pasa, por qué
  importa al crecer, cómo se hace bien, y links de contexto.

## Las 6 vistas del dashboard (coordinadas, macro → micro)

Seleccionar un producto o nodo en una vista filtra las demás (overview → zoom → detalle).

1. **📊 Cabecera ejecutiva** — el workspace de un vistazo.
2. **🗺️ Mapa** (estilo n8n/LangGraph) — productos → servicios/agentes y sus conexiones; zoomeable.
3. **📋 Tablero** (estilo Trello) — tareas en Falta / A medias / Listo, con un carril por producto.
4. **🔍 Detalle** — al clickear un nodo: visión, archivos, tech, decisiones, tokens, salud, riesgos.
5. **⚠️ Riesgos & Best Practices** — el corazón educativo: enseña a arreglar bien, no asusta.
6. **💸 Costo de tokens** — dónde se quemaron y las "malas decisiones caras".

## Principios de diseño (no negociables)

- **Usuario no técnico**: cero jerga; todo término técnico se traduce a su función en el mundo real.
- **Instructional design**: ante un riesgo grave → "Qué pasa → Por qué importa (al crecer) → Cómo
  se hace bien → links". Enseñar, no asustar.
- UX fundamentada en heurísticas de Nielsen, diseño centrado en el usuario, diseño de interacción
  y arquitectura de la información (overview-first de Shneiderman, progressive disclosure, vistas
  coordinadas).
- Dark mode por defecto, colores semánticos con ícono+texto, accesibilidad AA, `prefers-reduced-motion`.

## Capa UX lista para bidireccionalidad (Fase 2)

El dashboard ya trae los controles para operar el proyecto, diseñados para "encenderse" después:

- **Botones de acción** en lenguaje simple ("Arreglar esto", "Ajustar esto", "Explicámelo").
- **Chat dock cross-pantalla** que conoce el contexto de lo que estás mirando.

**En la v1 (lectura) estos controles EDUCAN**: abren la best practice + pasos + links y responden
desde el modelo embebido. No ejecutan.

**Fase 2 (bidireccional, ya diseñada):** un puente local en Node + el **Claude Agent SDK**
(`query()` + `canUseTool` con gate de confirmación por diff, WebSocket para streaming en vivo) hace
que esos mismos botones y el chat **ejecuten de verdad** sobre el código (resolver TODO, agregar
tests, explicar, refactorizar). Auth por créditos de suscripción Agent SDK (disp. 15-jun-2026) con
fallback a `ANTHROPIC_API_KEY`. Seguridad: localhost-only, token de sesión, sin auto-edición,
límite de gasto por acción.

## Estructura

- `~/.claude/commands/entiendo.md` — el comando generador (las instrucciones de cómo construir el
  dashboard). Es el entregable central; el `dashboard.html` se produce al ejecutarlo en cada carpeta.
