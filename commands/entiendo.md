---
description: Lee TODA la carpeta de trabajo y genera un dashboard que un humano no técnico entiende de lo macro a lo micro
---

# /entiendo — tu carpeta de trabajo, explicada para humanos

Tu misión NO es volcar datos ni rediseñar la UI. Es **entender la carpeta** y producir un
`dashboard.html` que una persona **sin conocimientos técnicos** pueda navegar de lo macro a lo micro:

> *"Mi carpeta tiene estos productos. Cada uno tiene estas piezas. Este es el goal de cada uno.
> Estas decisiones tomé. En qué estado están las tareas. Qué no sirve o me consume tokens de más.
> Y dónde tengo riesgos — y cómo se arreglan bien."*

Pensá como el mejor diseñador de producto del mundo explicándole a su mamá el sistema que
construyó su hijo: claridad brutal, cero jerga, belleza funcional, y enseñando en el camino.

## Arquitectura (no negociable)

```
dashboard.html  =  template/shell.html  (FIJO)  +  DATA  (lo único que generás)
```

| Pieza | Quién la toca | Qué es |
|-------|---------------|--------|
| **Shell** (`template/shell.html`) | Nadie en runtime. Solo se evoluciona en el repo entiendo. | App: layout, CSS, design system, mapa, tablero, chat, tema. |
| **DATA** (JSON del contrato) | **Solo esto generás vos** por cada carpeta. | Modelo del workspace: productos, nodos, tareas, riesgos, tokens. |
| **Contrato** (`schema/workspace.schema.json`) | Referencia + validación. | Forma y enums del DATA. |
| **Ensamble** (`scripts/assemble.mjs`) | Lo usás si hay Node; si no, inyectás a mano. | `shell + DATA → dashboard.html`. |

**PROHIBIDO:** reescribir CSS/JS del shell, inventar otro layout, o mezclar narrativa adentro de
estilos. Si el shell no está disponible, **traelo** (ver Paso 5); no improvises una app distinta.

**Reglas de oro:**
- Usuario **NO técnico** — cero jerga sin traducir.
- **Varios productos** posibles — nunca mezclar tareas/riesgos/tokens entre ellos.
- **Macro → micro** (Shneiderman).
- **Enseñá, no asustes** — todo riesgo grave trae best practice.

---

## Tu marco mental (ANTES de generar nada)

Aplicá estos cuerpos de conocimiento; no los menciones en el dashboard.

### 10 heurísticas de Nielsen (chequeo final)
1. Visibilidad del estado · 2. Lenguaje del mundo real · 3. Control y libertad · 4. Consistencia ·
5. Prevención de errores · 6. Reconocer en vez de recordar · 7. Flexibilidad · 8. Estético y
minimalista · 9. Ayudar a entender · 10. Ayuda contextual.

### UCD / IxD / IA / Instructional design
- Respuesta en 3 segundos: *"¿Qué es esto y funciona?"*
- Affordances claras; feedback 150–250ms; progressive disclosure; vistas coordinadas.
- Ante riesgo grave: **"Qué pasa → Por qué importa (al crecer) → Cómo se hace bien → pasos → links"**.

---

## Paso 1 — Explorar TODA la carpeta y detectar productos

Recorré SIN entrar en: `node_modules`, `.git`, `dist`, `build`, `.next`, `vendor`, `__pycache__`,
`.venv`, `target`, `coverage`.

**Árbol de decisión (multi-producto):**

| Señal | Clasificación |
|-------|----------------|
| Un solo manifest en raíz + un README/CLAUDE.md coherente | **1 producto** |
| `apps/`, `packages/`, o varios manifests en subcarpetas con README propio | **N productos** (uno por unidad coherente) |
| Solo `commands/`, `agents/`, `skills/`, scripts de apoyo | **Herramientas internas**, no productos |
| CI, `.github/`, infra compartida, configs globales | **Infra / config** |
| Repo que es el plugin *entiendo* en sí | 1 producto (`entiendo`) + herramientas (`/entiendo`) |

Clasificá cada unidad en: **Producto** | **Herramienta interna** | **Infra**.  
Si hay una sola cosa, un workspace de un producto está bien. Si hay varias, **separá todo** de acá en más.

## Paso 2 — Leer archivos clave (por producto + herramientas)

Leé si existen: `CLAUDE.md`, `README*`, `.md` de raíz y `/docs`; manifests; entrypoints
(`main.*`, `index.*`, `app.*`, `server.*`); `/commands`, `/agents`, `/prompts`, `/skills`, `/src`,
`/api`, `/lib`; MCP configs; `.env.example`; ADRs; git log reciente si ayuda.

## Paso 3 — Construir SOLO el modelo DATA

Escribí un objeto que cumpla el contrato (`schema/workspace.schema.json`, versión `1.0.0`).
**Cada producto lleva SU info; nada se mezcla.**

### Forma canónica

```json
{
  "schemaVersion": "1.0.0",
  "nombre": "nombre-del-workspace",
  "resumen": "1–2 frases humanas: qué es esta carpeta.",
  "productos": [
    {
      "id": "id-unico",
      "nombre": "Nombre legible",
      "goal": "1 frase como la diría el dueño a un amigo",
      "proposito": "Para qué sirve, en lenguaje simple",
      "salud": "listo | aMedias | falta",
      "tecnologias": ["…"],
      "decisiones": ["…"],
      "nodos": [
        {
          "id": "n1",
          "nombre": "Pieza",
          "tipo": "Entrada | Paso | Servicio | Agente | Salida | …",
          "queHace": "1 frase humana",
          "estado": "listo | aMedias | falta",
          "x": 40,
          "y": 120,
          "archivos": ["ruta"],
          "tecnologias": ["…"],
          "tareas": [
            { "id": "t1", "titulo": "…", "estado": "falta", "origen": "archivo:línea" }
          ]
        }
      ],
      "edges": [
        { "from": "n1", "to": "n2", "label": "qué viaja", "kind": "done" }
      ]
    }
  ],
  "herramientasInternas": ["…"],
  "riesgos": [
    {
      "id": "r1",
      "tipo": "seguridad | escala | codigoMuerto | deuda",
      "severidad": "alta | media | baja",
      "titulo": "…",
      "dondeEsta": "…",
      "explicacion": "Qué pasa",
      "why": "Por qué importa al crecer",
      "fix": "Cómo se hace bien",
      "pasos": ["paso 1", "paso 2"],
      "links": [{ "t": "título", "u": "https://…" }]
    }
  ],
  "tokens": null
}
```

### Dimensiones — cómo obtenerlas

- **Goals / decisiones / propósito:** docs, CLAUDE.md, ADRs, commits. Goal = 1 frase del dueño.
- **Estado** (`listo` / `aMedias` / `falta`): TODOs, stubs, tests faltantes, prompts a medias.
- **Tareas:** TODO, FIXME, HACK, "pendiente" → con `origen` archivo:línea. IDs únicos en todo el workspace.
- **Nodos + edges:** el pipeline contado como historia ("entra → procesa → sale"). Coordenadas `x,y`
  espaciadas (~300px en X). `kind: "future"` para piezas planeadas (arista punteada).
- **Tecnologías:** stack real por producto, en lenguaje amable cuando se muestre en UI.
- **Tokens:** leé `~/.claude/projects/<carpeta-encoded>/*.jsonl` (ruta absoluta con no-alfanuméricos
  → `-`). Si hay datos: objeto con al menos `facturable`, idealmente `input`, `output`, `cacheWrite`,
  `cacheRead`, `sesiones`, `turnos`, `modelo`, `insight`. Si no hay: **`tokens: null`** (el shell
  muestra estado vacío amable). Nunca inventes números.
- **Código muerto:** candidatos (stubs, huérfanos); tipo de riesgo `codigoMuerto` si aplica.
- **Riesgos:** reales (secretos, validación, N+1, sin rate limit, etc.). Severidad `alta` **obliga**
  `why` + `fix` + `pasos[]`.

### Enums (exactos)

- estado/salud: `listo` | `aMedias` | `falta`
- severidad: `alta` | `media` | `baja`
- tipo riesgo: `seguridad` | `escala` | `codigoMuerto` | `deuda`
- edge.kind: `done` | `future`

### Traducción técnico → humano (obligatoria en textos de UI)

Nunca dejes jerga cruda en `goal`, `proposito`, `queHace`, títulos de riesgo:
- "API REST" → "la forma en que el sistema pide y entrega datos"
- "autenticación" → "el control que decide quién puede entrar"
- "webhook" → "un aviso automático cuando pasa algo"
- "agente" → "un asistente automático que se encarga de una tarea"
- "deploy" → "publicar el proyecto para que la gente lo use"
- "MCP" → "un conector que le da herramientas al asistente"
- "N+1 / sin índice" → "consultas que con pocos datos van bien y al crecer se vuelven lentísimas"

### Gate de validación del DATA (antes de ensamblar)

Corrí mentalmente (y con Node si podés: `node scripts/validate.mjs <data.json>`):

1. ≥ 1 producto; cada uno ≥ 1 nodo.
2. IDs únicos: productos, nodos (por producto), tareas (global), riesgos (global).
3. Todo `edges.from` / `edges.to` existe en los nodos del **mismo** producto.
4. Ninguna tarea de un producto aparece en otro.
5. Riesgos `alta` tienen `why`, `fix`, `pasos` (≥1).
6. `tokens` es `null` o un objeto con `facturable` numérico (no inventado).
7. Textos legibles en voz alta por alguien que no programa.

Persistí el JSON temporalmente si ayuda (p.ej. `/tmp/entiendo-workspace.json`) para validar/ensamblar.

## Paso 4 — Encontrar el shell fijo

Buscá `template/shell.html` en este orden:

1. **Repo / plugin local:** relativo al plugin entiendo  
   (`…/entiendo/template/shell.html`, o junto a este comando en el checkout del repo).
2. **Este workspace** si el usuario está dentro del repo entiendo: `./template/shell.html`.
3. **Descarga de respaldo** (misma fuente que la instalación del comando):
   `https://raw.githubusercontent.com/jose-villegas-0/entiendo/main/template/shell.html`
4. Si nada funciona: avisá al usuario que instale el plugin/repo completo; **no inventes otro shell**.

El shell debe contener el marcador `/*__ENTIENDO_DATA__*/`. No lo borres ni lo renombres.

## Paso 5 — Ensamblar `dashboard.html` en la raíz del workspace

**Preferido (Node disponible):**

```bash
node /ruta/al/plugin/scripts/assemble.mjs /tmp/entiendo-workspace.json -o dashboard.html
# o, si estás en el repo entiendo:
node scripts/assemble.mjs examples/data/….json -o dashboard.html
```

`assemble.mjs` valida el DATA y escribe el HTML.

**Sin Node:** leé el shell completo, reemplazá

```js
const DATA = /*__ENTIENDO_DATA__*/ null;
```

por

```js
const DATA = /*__ENTIENDO_DATA__*/ { …tu JSON válido… };
```

(el JSON debe ser expresión JS válida: comillas dobles, sin trailing comments raros) y escribí
`dashboard.html` en la **raíz de la carpeta del usuario**.

No regeneres el shell. No copies a mano miles de líneas de CSS.

## Paso 6 — Autorevisión (gate de calidad)

- ¿Un no técnico entiende el workspace en 3 segundos (resumen + productos en sidebar)?
- ¿Productos bien detectados y **separados**?
- ¿Sin jerga cruda en textos visibles?
- ¿El mapa cuenta una historia (edges con labels útiles)?
- ¿Riesgos graves con el patrón educativo completo?
- ¿Tokens reales o `null` (vacío amable), nunca inventados?
- ¿El HTML viene del shell + DATA (marcador presente, app shell intacta)?

## Paso 7 — Abrir

```bash
open dashboard.html          # macOS
xdg-open dashboard.html      # Linux
```

## Paso 8 — Reportar al usuario

En lenguaje simple: cuántos productos (y qué es herramienta interna), goal de cada uno, pendientes
por producto, techs, riesgos más importantes con un "conviene arreglarlo bien antes de crecer", y
tokens si hubo datos. Invitá a explorar el dashboard de lo macro a lo micro.

---

## Notas para contribuidores del repo entiendo

- Evolucioná UI en `template/shell.html`, no en un dashboard ya generado.
- Evolucioná el contrato en `schema/workspace.schema.json` + `scripts/validate.mjs`.
- Ejemplo canónico: `examples/data/entiendo.workspace.json` → ensamblar a `examples/dashboard.html`.
- Smoke test:

```bash
node scripts/validate.mjs examples/data/entiendo.workspace.json fixtures/minimal.workspace.json
node scripts/assemble.mjs examples/data/entiendo.workspace.json -o examples/dashboard.html
```
