---
description: Lee TODA la carpeta de trabajo y genera un dashboard que un humano no técnico entiende de lo macro a lo micro
---

# /entiendo — tu carpeta de trabajo, explicada para humanos

Tu misión NO es volcar datos. Es construir una **capa de inteligencia visual sobre toda la
carpeta de trabajo** para que una persona **sin conocimientos técnicos** entienda, de lo macro
a lo micro:

> *"Mi carpeta tiene estos productos. Cada uno tiene estos agentes/servicios. Este es el goal
> de cada uno. Estas decisiones tomé. Estos archivos y tecnologías hay. En qué estado están las
> tareas. Qué no sirve o me consume tokens de más. Y dónde tengo riesgos de seguridad o de
> escala — y cómo se arreglan bien."*

Pensá como el mejor diseñador de producto del mundo explicándole a su mamá el sistema que
construyó su hijo: claridad brutal, cero jerga, belleza funcional, y enseñando en el camino.

**Reglas de oro que atraviesan TODO:**
- El usuario es **NO técnico**. Diseñá para SU modelo mental, no para el del programador.
- **La carpeta puede tener VARIOS productos** + herramientas/agentes internos. NO mezcles la
  información entre ellos. Separación coherente según la estructura de carpetas.
- Es de lo **macro a lo micro**: overview primero, después zoom, después detalle (Shneiderman).
- **Enseñá, no asustes.** Ante cada riesgo, mostrá la best practice y por qué importa al crecer.

---

## Tu marco mental (entrenate en esto ANTES de generar nada)

Aplicá estos cuerpos de conocimiento; no los menciones en el dashboard.

### 10 heurísticas de Nielsen (chequealas al final, una por una)
1. **Visibilidad del estado** — siempre se sabe dónde se está, qué significa cada color/badge. Leyenda visible.
2. **Lenguaje del mundo real** — cero jerga. Traducí TODO término técnico a su función real.
3. **Control y libertad** — expandir/colapsar, volver, cerrar; navegar entre vistas sin trabarse.
4. **Consistencia** — mismos colores/íconos/significados en todo el documento.
5. **Prevención de errores** — navegación a prueba de clics; nada rompe la vista.
6. **Reconocer en vez de recordar** — todo lo necesario visible o a un clic.
7. **Flexibilidad y eficiencia** — resumen ejecutivo arriba + detalle abajo (progressive disclosure).
8. **Estético y minimalista** — solo lo que aporta; aire generoso.
9. **Ayudar a entender** — cada sección con una micro-intro de 1 frase: qué estás mirando y por qué importa.
10. **Ayuda y documentación** — tooltips/notas para cualquier término inevitable; links a best practices.

### Diseño Centrado en el Usuario (UCD)
Empezá por su pregunta real: *"¿Qué es esto y funciona?"* — respondela en los primeros 3 segundos.
Traducí cada concepto técnico a su impacto en el mundo real (ver reglas de traducción abajo).

### Diseño de Interacción (IxD)
Affordances claras (lo accionable se ve accionable), feedback inmediato (hover, transiciones
150–250ms), microinteracciones que comunican (resaltar conexiones al hover, vistas que se filtran
entre sí). Nada de movimiento gratuito.

### Arquitectura de la Información (IA)
Jerarquía en pirámide invertida, chunking (5–7 ítems), progressive disclosure, etiquetas que un
niño entendería, navegación sticky (findability), y **vistas coordinadas**: seleccionar algo en
una vista filtra las demás.

### Instructional design (porque el usuario aprende mientras navega)
Mucha gente programa sin buenas prácticas y se rompe al escalar. Cuando muestres un riesgo grave
(seguridad/escala), seguí SIEMPRE este patrón:
**"Qué pasa" → "Por qué importa (sobre todo si crece el uso)" → "Cómo se hace bien" → links de contexto.**

---

## Paso 1 — Explorar TODA la carpeta y detectar múltiples productos
Recorré la carpeta SIN entrar en `node_modules`, `.git`, `dist`, `build`, `.next`, `vendor`,
`__pycache__`, `.venv`, `target`, `coverage`.

**Detectá cuántos productos/proyectos hay** (no asumas uno solo). Señales:
- Varios manifests (`package.json`, `pyproject.toml`, `requirements.txt`, `go.mod`, `Cargo.toml`).
- Varias raíces `.git` o submódulos.
- Subcarpetas top-level con su propio README/CLAUDE.md y estructura coherente.

**Clasificá cada cosa** en una de tres categorías (esta separación es el corazón del producto):
- **Producto** — lo que se está construyendo, de cara al usuario final.
- **Herramienta / agente interno** — comandos, skills, agentes, scripts, MCPs que apoyan el
  trabajo pero NO son el producto.
- **Infra / config** — CI, configs, infra compartida.

Si hay una sola cosa, está bien: un workspace de un producto. Si hay varias, mantené TODO
separado por producto de acá en adelante (tareas, riesgos, tokens, archivos).

## Paso 2 — Leer archivos clave (por cada producto y para las herramientas internas)
Leé en profundidad si existen: `CLAUDE.md`, `README*`, todo `.md` de raíz y `/docs`; manifests
de dependencias; puntos de entrada (`main.*`, `index.*`, `app.*`, `server.*`) y rutas/handlers;
carpetas `/commands`, `/agents`, `/prompts`, `/skills`, `/src`, `/api`, `/lib`; configs de MCP
(`.mcp.json`, `mcp_config.json`, `claude_desktop_config.json`); `.env.example` para integraciones;
ADRs/decisiones si hay; historial de git si aplica.

## Paso 3 — Construir el modelo del workspace (separado por producto)
Armá internamente este modelo. **Cada producto lleva SU propia info; nada se mezcla.**

```
workspace { nombre, resumen(1 frase), productos[], herramientasInternas[], tokens, riesgos[] }
producto  { id, nombre, goal(1 frase como la diría el dueño), proposito, servicios[], agentes[],
            decisiones[], tecnologias[], tareas[], archivos[], tokens, salud, riesgos[] }
nodo (servicio/agente) { id, nombre, queHace(humano, 1 frase), estado(listo|aMedias|falta),
            conexiones[(origen→destino, quéViaja)], archivos[], tareas[], tokens, riesgos[] }
tarea  { id, titulo, estado(falta|aMedias|listo), productoId, origen(archivo:línea) }
riesgo { id, tipo(seguridad|escala|codigoMuerto|deuda), severidad(alta|media|baja), dondeEsta,
            explicacionSimple, bestPractice{ queEs, comoSeArreglaBien, pasos[], links[] },
            accionSugerida }
tokens { total, porProducto{}, porSesion[], malasDecisiones[] }
```

### Cómo obtener cada dimensión
- **Goals / decisiones / propósito / narrativa**: inferí de docs, CLAUDE.md, ADRs, comentarios,
  commits. El `goal` es 1 frase como la diría el dueño a un amigo.
- **Estado** (listo / a medias / falta): inferí de TODOs, funciones vacías, stubs, prompts sin
  terminar, archivos esqueleto, tests faltantes.
- **Tareas / pendientes**: TODO, FIXME, HACK, "pendiente", comentarios sin resolver → cada uno con
  su `productoId` y `origen` (archivo:línea). **Nunca mezcles tareas de productos distintos.**
- **Tecnologías**: stack por producto (lenguajes, frameworks, librerías, servicios, MCPs).
- **Consumo de tokens**: intentá leer los logs de sesión de Claude Code en
  `~/.claude/projects/<carpeta-encoded>/*.jsonl` (la carpeta es la ruta absoluta con los
  caracteres no alfanuméricos reemplazados por `-`). Ahí hay `usage`/costo por turno. Sumá el
  gasto, atribuilo por sesión y, si podés, por producto; marcá "malas decisiones caras" (sesiones
  que churnean mucho sin aterrizar cambios). **Best-effort**: si no hay logs o el formato no
  coincide, dejá el panel con un estado vacío amable ("Todavía no hay datos de uso para mostrar").
- **Código muerto / que no sirve**: heurística (stubs, funciones vacías, archivos huérfanos,
  imports rotos, duplicados) + tu juicio. Marcalo como **"candidato"** (puede haber falsos
  positivos) para no asustar.
- **Debilidades / seguridad / escala**: detectá riesgos reales — secretos hardcodeados, falta de
  validación de entrada, inyección, N+1 queries, falta de paginación/índices, sin rate limit, sin
  manejo de errores, secretos en el repo, etc. Cada riesgo grave DEBE traer su `bestPractice`.

### Reglas de traducción técnico → humano (OBLIGATORIO)
Nunca dejes un término crudo; traducí y, si hace falta, dejá el término técnico chico entre
paréntesis. Estándar esperado:
- "API REST" → "la forma en que el sistema pide y entrega datos a otros sistemas"
- "base de datos" → "donde se guarda y recuerda toda la información"
- "autenticación" → "el control que decide quién puede entrar"
- "endpoint `/users`" → "la puerta por donde se piden los usuarios"
- "webhook" → "un aviso automático cuando pasa algo"
- "agente" → "un asistente automático que se encarga de una tarea"
- "deploy" → "publicar el proyecto para que la gente lo use"
- "MCP" → "un conector que le da herramientas/superpoderes al asistente"
- "N+1 / sin índice" → "consultas que funcionan con pocos datos pero se vuelven lentísimas al crecer"
Cada pieza debe poder leerse en voz alta y entenderse sin saber programar.

## Paso 4 — Es una APP que se navega, NO un reporte que se scrollea
Esto es lo más importante de toda la experiencia. El resultado NO puede ser una página de
secciones apiladas. Tiene que sentirse como una **aplicación**: un shell fijo (que ocupa toda
la pantalla, sin scroll de página) con **barra lateral** + **un área principal que cambia de
vista**, no que se baja con la rueda.

**Layout de app (obligatorio):**
- **Barra superior (topbar)**: marca + **breadcrumb** (Workspace › Producto › …) + toggle de tema.
- **Barra lateral (sidebar)**: un conmutador de **vistas** (Mapa / Tareas / Riesgos / Costos) y
  abajo la lista de **productos** (clic = enfocar ese producto). Es la navegación principal.
- **Área principal**: muestra UNA vista a la vez (se conmuta, no se scrollea entre ellas). Las
  vistas que tengan mucho contenido scrollean internamente, no la página entera.
- **Panel lateral de detalle (drawer)**: se desliza desde la derecha al seleccionar una pieza.
- **Chat dock** flotante y **persistente entre vistas** (vive fuera de las vistas).

**Las vistas (todas leen el MISMO modelo; seleccionar filtra el resto — macro→micro):**
1. **🗺️ Mapa — la vista estrella, un LIENZO de nodos interactivo** (estilo n8n / LangGraph),
   NO una grilla de cards. Debe tener de verdad:
   - **Pan** (arrastrar el fondo), **zoom** (rueda + botones +/− y "encajar/fit").
   - **Nodos arrastrables**; **aristas** (flechas/curvas SVG) que se recalculan al mover nodos.
   - **Hover** sobre un nodo: resalta sus conexiones y atenúa el resto.
   - **Macro→micro**: en el nivel workspace los nodos son los productos; **doble clic entra** a
     un producto y muestra sus servicios/agentes como sub-grafo; el breadcrumb permite volver.
     Si hay un solo producto, entrá directo a su grafo (un nodo suelto se ve pobre).
   - Leyenda de colores visible; aristas "futuras" punteadas.
2. **📋 Tareas** (estilo Trello) — columnas **Falta / A medias / Listo**, con un **carril
   (swimlane) por producto**. Nunca mezclar tareas entre productos.
3. **⚠️ Riesgos & Best Practices** — lista priorizada por severidad; cada riesgo con
   **"Qué pasa" → "Por qué importa (al crecer)" → "Cómo se hace bien" → pasos → links**. El
   corazón educativo del producto.
4. **💸 Costos (tokens)** — dónde se quemaron, por producto y por sesión, y "malas decisiones
   caras". Si no hay datos, estado vacío amable.

El **detalle** de cualquier pieza (visión, qué hace, archivos, tecnologías, decisiones, tokens,
estado, riesgos + botones de acción + chat) vive en el **drawer**, no en una sección aparte.

## Paso 5 — Generar `dashboard.html`
Creá UN solo archivo `dashboard.html` autocontenido en la raíz de la carpeta:
**HTML + CSS + JS embebidos, SIN dependencias externas** (funciona offline con doble clic). Poné
el modelo del workspace como un objeto JS al inicio y renderizá de forma declarativa a partir de él.

**Estructura técnica del app shell (vanilla JS, sin librerías):**
- `body{overflow:hidden}` + layout `grid` a `100vh` (topbar / sidebar / main). Nada de scroll de página.
- Conmutador de vistas: cada vista es un `section.view`; solo la activa se muestra (`display`).
- Lienzo: un contenedor `.canvas` con un `.world` interno al que se le aplica
  `transform: translate(x,y) scale(k)`. Pan = `pointerdown/move` sobre el fondo; zoom = `wheel`
  centrado en el cursor + botones; "fit" calcula el encuadre de todos los nodos. Nodos
  arrastrables con `pointer events` (actualizando sus coords y redibujando aristas). Aristas en
  una capa `<svg>` dentro de `.world`, con paths bezier y `vector-effect:non-scaling-stroke`.
- Drawer derecho con `transform:translateX(105%)` ↔ `0`. Chat dock `position:fixed`.
- Respetar `prefers-reduced-motion`; foco visible; navegable por teclado; contraste AA.

### Sistema visual (top-of-the-line, no genérico)
- **Dark mode por defecto** con toggle a light que persista (localStorage).
- Paleta: fondo profundo neutro (no negro puro, ej. `#0e0f13`), superficies elevadas con borde
  translúcido y sutil gradiente, 1 acento con carácter. Evitá el look "bootstrap genérico".
- **Colores semánticos consistentes** (siempre color + ícono + texto, nunca solo color):
  verde = listo, ámbar = a medias, rojo/coral = falta/riesgo alto.
- **Tipografía**: system font stack moderno, jerarquía marcada (hero con `clamp()`, cuerpo ≥16px,
  interlineado 1.5–1.7, máx ~70 caracteres por línea).
- **Espaciado**: escala 4/8px, aire generoso, cards con padding amplio, radios 12–16px, sombras suaves.

### Interacción y movimiento (IxD)
- Aparición escalonada de cards al cargar (fade+slide, stagger ~40ms), respetando `prefers-reduced-motion`.
- Hover en nodos: elevar + resaltar conexiones, atenuar el resto.
- Selección coordinada: clic en un producto/nodo filtra tablero, detalle y riesgos a ese contexto.
- Zoom del mapa: workspace → producto → servicio, con "volver" siempre visible.
- Transiciones suaves 150–250ms; estados de foco visibles (teclado).

### Accesibilidad (parte de la calidad)
Contraste AA; significado nunca solo por color; HTML semántico (`header`, `nav`, `main`, `section`,
`h1–h3`); navegable por teclado; `aria-label` donde haga falta; `prefers-reduced-motion` respetado.

### Capa UX lista para bidireccionalidad (en v1 EDUCA, no ejecuta)
La versión que "hace cosas" llega después; la UX queda lista ahora para no rediseñar nada.
- **Botones de acción** en lenguaje no técnico, presentes en el detalle de cada nodo, en cada
  tarea y en cada riesgo: **"Arreglar esto"**, **"Ajustar esto"**, **"Mejorar esto"**,
  **"Explicámelo"**. En v1 abren un panel con la **best practice + pasos + links** (rotulá sutil
  "Te muestro cómo"). Diseñalos para que en Fase 2 pasen de "te muestro cómo" a "lo hago".
- **Chat dock cross-pantalla** — una barra/burbuja persistente, fija, que viaja con el usuario por
  TODAS las vistas y **muestra el contexto de lo que está mirando** ("Estás viendo: Producto X →
  Servicio Y"). En v1 responde desde el modelo ya embebido (respuestas guiadas, sin LLM): puede
  contestar "¿dónde están mis riesgos?", "¿qué falta en el producto X?", "¿qué me consume tokens?"
  filtrando los datos embebidos, y ofrece accesos rápidos ("Arreglar esto") que abren la best
  practice. Dejá claro y elegante que la conversación real con Claude llega pronto.
- Affordances claras: todo lo accionable se ve accionable y enlaza a su contexto/best practice.

### El mapa y el pipeline — hacelos memorables
El mapa cuenta cómo funciona cada producto como una historia: "Entra esto → acá se procesa → se
consulta aquello → sale esto". Numerá los pasos, poné íconos, flechas claras. Si hay ramas o
agentes, mostralo. Si el flujo no es evidente, inferí el más probable y marcálo como inferido.

## Paso 6 — Autorevisión (gate de calidad, antes de abrir)
Recorré mentalmente y corregí lo que falle:
- ¿Un no técnico entiende qué es el workspace en 3 segundos?
- ¿Los productos están bien detectados y **separados** (tareas/tokens/riesgos sin mezclar)?
- ¿Hay jerga sin traducir? ¿La leyenda de colores está visible y es consistente?
- ¿El mapa se lee como una historia y se puede ir de macro a micro?
- ¿Cada riesgo grave trae "qué pasa / por qué importa / cómo se hace bien / links"?
- ¿El panel de tokens muestra datos o degrada elegante?
- ¿Los botones de acción y el chat dock están presentes, son cross-pantalla y reflejan el contexto?
- ¿Funcionan toggle de tema, nav sticky, teclado, reduced-motion?

## Paso 7 — Abrir
Ejecutá `open dashboard.html` (Mac) o `xdg-open dashboard.html` (Linux).

## Paso 8 — Reportar
Contale al usuario, en lenguaje simple: cuántos productos encontraste (y cuáles son herramientas
internas), el goal de cada uno, cuántas tareas/pendientes hay por producto, las tecnologías, los
riesgos más importantes (con un "esto conviene arreglarlo bien antes de crecer"), y qué tanto se
está gastando en tokens si hay datos. Cerralo invitándolo a abrir el dashboard para explorar de
lo macro a lo micro.
