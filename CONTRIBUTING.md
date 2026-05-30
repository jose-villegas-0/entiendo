# Contribuir a entiendo

¡Gracias por querer colaborar! Este proyecto busca que **cualquiera** entienda su carpeta de trabajo, así que la barra de calidad es: *¿lo entendería una persona que no programa?*

## Cómo está armado

- `commands/entiendo.md` — **el corazón del proyecto.** Es el comando de Claude Code: las instrucciones que, al ejecutarse, leen la carpeta y generan la app. La mayor parte del trabajo vive acá.
- `examples/dashboard.html` — un ejemplo de app generada (sirve de referencia visual).
- `docs/roadmap.md` — la visión y el diseño de la Fase 2 (bidireccional).
- `.claude-plugin/plugin.json` — manifest para instalar como plugin.

> No hay build ni dependencias: la app generada es un único HTML con todo embebido.

## Cómo probar un cambio

1. Copiá tu versión del comando a `~/.claude/commands/entiendo.md`.
2. Parate en una carpeta de prueba (idealmente con **2+ productos** + alguna herramienta interna).
3. Corré `/entiendo` en Claude Code y abrí el `dashboard.html` generado.
4. Verificá: que detecte y **separe** los productos, que el lienzo tenga pan/zoom/arrastre, que los riesgos traigan su buena práctica, y que **no haya jerga sin traducir**.

## Principios que cuidamos (no negociables)

- **App, no reporte.** Se navega; no se scrollea una página de secciones.
- **Usuario no técnico.** Cero jerga; cada término técnico se traduce a su función real.
- **Enseñar, no asustar.** Todo riesgo grave viene con "cómo se hace bien" + links.
- **Separación por producto.** Nunca mezclar tareas/riesgos/costos entre productos.
- **Un solo archivo, sin dependencias.** Debe abrir con doble clic, offline.
- **Accesibilidad AA** y `prefers-reduced-motion` respetado.

## Buenos primeros aportes

- Mejorar el auto-layout del lienzo de nodos (hoy es simple).
- Agregar un mini-mapa / overview del grafo.
- Más detectores de riesgos de seguridad y de escala (con su best practice).
- Mejorar el parseo de tokens (streaming, totales precalculados).
- Arrancar la **Fase 2** (ver `docs/roadmap.md`).

## Flujo de PR

1. Hacé un fork y una rama (`feat/...` o `fix/...`).
2. Cambios chicos y enfocados; describí **qué** y **por qué**.
3. Si tocás la UX, sumá una captura del antes/después.
4. Abrí el PR. ¡Gracias! 🙌
