# entiendo

> Tu carpeta de trabajo, explicada como una **app** — de lo macro a lo micro, para cualquiera (aunque no programe).

**entiendo** es un comando para [Claude Code](https://claude.com/claude-code) que lee **toda tu carpeta de trabajo**, detecta los productos que tenés adentro, y genera una **app HTML autocontenida** (un solo archivo, doble clic, sin instalar nada) que te deja decir:

> *"Mi carpeta tiene estos productos, cada uno hace esto, así se conectan, en este estado están, esto me costó en tokens, y acá están mis riesgos — y cómo se arreglan bien."*

No es un reporte que se scrollea. Es una **app que se navega**: barra lateral, vistas que se cambian, y un **lienzo de nodos interactivo** (zoom, arrastre, pan) estilo n8n/LangGraph.

---

## ✨ Qué hace

- 🔎 **Detecta varios productos** en una misma carpeta y **no mezcla** su información (tareas, riesgos y costos quedan separados por producto).
- 🗺️ **Mapa interactivo** de nodos: cómo está armado cada producto y cómo fluye el pipeline. Zoom, arrastre, pan, y *macro→micro* entrando/saliendo de cada producto.
- 📋 **Tablero de tareas** estilo Trello (Falta / A medias / Listo), con un carril por producto.
- ⚠️ **Riesgos & buenas prácticas**: cada riesgo de seguridad o de escala con el patrón *"Qué pasa → Por qué importa (al crecer) → Cómo se hace bien → links"*. Enseña, no asusta.
- 💸 **Costo en tokens**: parsea los registros de sesión de Claude Code y te muestra dónde se gastó.
- 💬 **Chat dock** que conoce el contexto de lo que estás mirando.
- 🌙 Dark mode, accesibilidad AA, lenguaje sin jerga (todo término técnico traducido a su función real).

> **Diseño centrado en el usuario no técnico.** UX fundamentada en las heurísticas de Nielsen, diseño de interacción y arquitectura de la información (overview-first de Shneiderman, progressive disclosure, vistas coordinadas).

## 🧱 Cómo está armado (template + DATA)

```
dashboard.html  =  template/shell.html  (UI fija)  +  DATA JSON  (modelo de tu carpeta)
```

- **`template/shell.html`** — la app (mapa, tareas, riesgos, costos, chat). No se regenera por proyecto.
- **`schema/workspace.schema.json`** — contrato del objeto `DATA`.
- **`scripts/validate.mjs` / `scripts/assemble.mjs`** — validar el modelo y armar el HTML.
- **`commands/entiendo.md`** — el comando: explora tu carpeta, genera **solo** el DATA, valida y ensambla.

Así cada corrida de `/entiendo` no reescribe la UI: solo actualiza el modelo.

## 🚀 Instalación

**Recomendado — clonar / plugin (incluye shell + schema):**

```bash
git clone https://github.com/jose-villegas-0/entiendo.git
# Opción A: copiar el comando
mkdir -p ~/.claude/commands
cp entiendo/commands/entiendo.md ~/.claude/commands/
# El comando buscará template/ junto al repo o lo bajará de GitHub si hace falta.
```

**Opción B — como plugin de Claude Code:** este repo incluye `.claude-plugin/plugin.json`.

**Solo el markdown** (mínimo): podés copiar `commands/entiendo.md`, pero para ensamblar bien hace falta el `template/shell.html` (el comando intenta bajarlo de este repo como respaldo).

## 🧑‍💻 Uso

Parate en cualquier carpeta de proyecto y, dentro de Claude Code, escribí:

```
/entiendo
```

El comando lee la carpeta, escribe el **DATA**, lo valida y genera `dashboard.html` en la raíz. Ejemplo: [`examples/dashboard.html`](examples/dashboard.html) (armado desde [`examples/data/entiendo.workspace.json`](examples/data/entiendo.workspace.json)).

### Desarrollo del shell / contrato

```bash
node scripts/validate.mjs examples/data/entiendo.workspace.json fixtures/minimal.workspace.json
node scripts/assemble.mjs examples/data/entiendo.workspace.json -o examples/dashboard.html
```

## 🗺️ Roadmap

- **v1 — lectura (actual):** shell fijo + DATA validado. Los botones y el chat **te muestran cómo**, no ejecutan.
- **Fase 2 — bidireccional:** puente local + [Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk). Detalle en [`docs/roadmap.md`](docs/roadmap.md).

## 🤝 Contribuir

¡Bienvenidas las contribuciones! Mirá [`CONTRIBUTING.md`](CONTRIBUTING.md). Buenos puntos de entrada: auto-layout del lienzo, mini-mapa, más detectores de riesgos, mejorar el parseo de tokens, y endurecer el schema — **antes** de la Fase 2.

## 📄 Licencia

[MIT](LICENSE) © Jose Villegas
