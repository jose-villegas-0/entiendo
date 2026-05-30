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

## 🚀 Instalación

**Opción A — copiar el comando (lo más rápido):**

```bash
mkdir -p ~/.claude/commands
curl -fsSL https://raw.githubusercontent.com/jose-villegas-0/entiendo/main/commands/entiendo.md \
  -o ~/.claude/commands/entiendo.md
```

O cloná el repo y copiá `commands/entiendo.md` a `~/.claude/commands/`.

**Opción B — como plugin de Claude Code:** este repo incluye `.claude-plugin/plugin.json`, así que podés instalarlo desde un marketplace/repo de plugins.

## 🧑‍💻 Uso

Parate en cualquier carpeta de proyecto y, dentro de Claude Code, escribí:

```
/entiendo
```

El comando lee la carpeta, sintetiza el modelo y genera `dashboard.html` en la raíz, abriéndolo en tu browser. Mirá un ejemplo generado en [`examples/dashboard.html`](examples/dashboard.html).

## 🗺️ Roadmap

- **v1 — lectura (actual):** la app que entiende y explica tu carpeta. Los botones "Arreglar / Ajustar / Explicar" y el chat **te muestran cómo** (best practices), todavía no ejecutan.
- **Fase 2 — bidireccional:** un puente local en Node + el [Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk) hace que esos mismos controles **ejecuten de verdad** sobre el código (resolver TODOs, agregar tests, refactorizar), con confirmación por diff. Detalle en [`docs/roadmap.md`](docs/roadmap.md).

## 🤝 Contribuir

¡Bienvenidas las contribuciones! Mirá [`CONTRIBUTING.md`](CONTRIBUTING.md). Ideas con buen punto de entrada: mejorar el auto-layout del lienzo, un mini-mapa, más detectores de riesgos, y arrancar la Fase 2.

## 📄 Licencia

[MIT](LICENSE) © Jose Villegas
