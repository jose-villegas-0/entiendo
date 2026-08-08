# Roadmap

## v1 — Lectura (actual)

Una **app HTML** que lee toda la carpeta y la explica de lo macro a lo micro, para un usuario no técnico.

### Arquitectura template + DATA (v1.1)

```
dashboard.html  =  template/shell.html  (UI fija)  +  DATA JSON  (por carpeta)
```

- El comando **solo genera DATA** conforme a `schema/workspace.schema.json`.
- `scripts/validate.mjs` y `scripts/assemble.mjs` garantizan contrato y ensamble reproducible.
- La IA **no reescribe** CSS/JS del shell en cada corrida → dashboards consistentes y menos tokens.

### Capacidades de lectura

- Detección de **múltiples productos** + herramientas internas, sin mezclar información.
- **Lienzo de nodos interactivo** (zoom, arrastre, pan) — macro→micro entrando a cada producto.
- Vistas: 🗺️ Mapa · 📋 Tareas (Trello, carril por producto) · ⚠️ Riesgos & buenas prácticas · 💸 Costos (tokens).
- Drawer de detalle, chat dock cross-vista, dark mode, accesibilidad AA.
- **Capa de acción educativa:** los botones "Arreglar / Ajustar / Explicar" y el chat
  **muestran la buena práctica**. Todavía **no ejecutan**.

## Fase 2 — Bidireccional

Que la app deje de "mostrar cómo" y pase a **hacer**: tocás un botón y Claude trabaja sobre tu
código de verdad, viendo el resultado en vivo.

**Arquitectura:**

```
  dashboard.html  ──(HTTP / WebSocket)──>  puente local (Node)
        ▲                                        │
        │                                        ▼
        └────── actualiza en vivo ──────  Claude Agent SDK (query / canUseTool)
                                                 │
                                                 ▼
                                          edita tu código real
```

- **Motor:** [Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk) (`@anthropic-ai/claude-agent-sdk`),
  con `query()` para correr a Claude headless y `canUseTool` como **gate de confirmación por diff**.
- **Tiempo real:** WebSocket transmite el progreso (texto, tool-use, diffs) al navegador.
- **Acciones v2:** resolver TODO, agregar tests, explicar pieza, refactorizar, chat que ejecuta.
- **Auth:** créditos de suscripción del Agent SDK (disponibles desde 2026-06-15) con fallback a `ANTHROPIC_API_KEY`.
- **Seguridad (obligatoria):** escuchar solo en `127.0.0.1`, token de sesión, `permissionMode:"default"`
  (sin auto-edición), mostrar el diff y pedir *Aplicar / Rechazar* antes de tocar archivos,
  tope de gasto por acción (`maxBudgetUsd`).

## Más adelante (ideas)

- Auto-actualización: separar los datos mecánicos (gratis, vía script/hook) de la narrativa (IA, bajo demanda).
- Mini-mapa y mejor auto-layout del grafo.
- Histórico de tokens y tendencia de costos.
- Export del mapa a imagen / PDF.
