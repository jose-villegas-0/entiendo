# Contribuir a entiendo

¡Gracias por querer colaborar! La barra de calidad es: *¿lo entendería una persona que no programa?*

## Cómo está armado

```
dashboard.html  =  template/shell.html  +  DATA (JSON)
```

| Path | Qué es |
|------|--------|
| `commands/entiendo.md` | Corazón del producto: instrucciones de `/entiendo` (explorar → DATA → validar → ensamblar). |
| `template/shell.html` | **Shell fijo** de la app (no regenerar por proyecto). Marcador `/*__ENTIENDO_DATA__*/`. |
| `schema/workspace.schema.json` | Contrato del modelo DATA. Ver también `schema/README.md`. |
| `scripts/validate.mjs` | Validación de negocio del DATA. |
| `scripts/assemble.mjs` | `shell + data.json → dashboard.html`. |
| `examples/data/*.json` | Modelos de ejemplo (fuente de verdad del demo). |
| `examples/dashboard.html` | Demo ensamblado — **no editar a mano**; reensamblar. |
| `fixtures/` | JSON mínimos para smoke tests. |
| `docs/roadmap.md` | Fase 2 (bidireccional). |
| `.claude-plugin/plugin.json` | Manifest del plugin. |

## Flujo de trabajo al tocar la UI

1. Editá `template/shell.html` (o el DATA de ejemplo en `examples/data/`).
2. Validá y reensamblá:

```bash
node scripts/validate.mjs examples/data/entiendo.workspace.json fixtures/minimal.workspace.json
node scripts/assemble.mjs examples/data/entiendo.workspace.json -o examples/dashboard.html
```

3. Abrí `examples/dashboard.html` en el browser.
4. Si cambiaste el contrato, actualizá `schema/`, `scripts/validate.mjs`, el comando y un fixture.

## Cómo probar un cambio del comando

1. Asegurate de tener el repo (shell + schema), no solo el `.md`.
2. Copiá `commands/entiendo.md` a `~/.claude/commands/entiendo.md` si hace falta.
3. En una carpeta de prueba (ideal **2+ productos** + herramientas internas), corré `/entiendo`.
4. Verificá: separación por producto, mapa pan/zoom, riesgos con buena práctica, sin jerga, y que el HTML siga siendo el shell (no un layout inventado).

## Principios (no negociables)

- **App, no reporte.** Se navega.
- **Usuario no técnico.** Cero jerga sin traducir.
- **Enseñar, no asustar.** Riesgo grave = qué pasa / por qué / cómo / links.
- **Separación por producto.** Nunca mezclar tareas/riesgos/costos.
- **Shell fijo + DATA validado.** La IA no reescribe la UI en cada corrida.
- **Accesibilidad AA** y `prefers-reduced-motion`.

## Buenos primeros aportes

- Auto-layout del lienzo de nodos.
- Mini-mapa / overview del grafo.
- Más detectores de riesgos (con best practice).
- Mejor parseo de tokens + fixtures de logs.
- Teclado/a11y en el mapa.
- Extender el schema/validador sin romper ejemplos.
- Fase 2 solo cuando v1 esté estable (ver `docs/roadmap.md`).

## Flujo de PR

1. Fork y rama (`feat/...` o `fix/...`).
2. Cambios chicos y enfocados; describí **qué** y **por qué**.
3. Si tocás UI, reensamblá el ejemplo y sumá captura antes/después.
4. Corré validate + assemble antes de abrir el PR.
