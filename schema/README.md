# Contrato del modelo `DATA`

La app generada es:

```
dashboard.html  =  template/shell.html  +  DATA (este contrato)
```

- **Shell (fijo):** layout, CSS, design system, mapa, tablero, chat, tema.
- **DATA (variable):** lo único que genera `/entiendo` por carpeta.

## Archivos

| Archivo | Rol |
|---------|-----|
| `workspace.schema.json` | JSON Schema del objeto workspace |
| `../scripts/validate.mjs` | Validación de negocio (IDs, edges, riesgos…) |
| `../scripts/assemble.mjs` | Inyecta DATA en el shell → `dashboard.html` |
| `../examples/data/*.json` | Modelos de ejemplo |
| `../fixtures/*.json` | Fixtures mínimos para smoke tests |

## Forma mínima

```json
{
  "schemaVersion": "1.0.0",
  "nombre": "mi-carpeta",
  "resumen": "Qué es este workspace, en una frase humana.",
  "productos": [
    {
      "id": "app",
      "nombre": "Mi producto",
      "goal": "Como lo diría el dueño a un amigo.",
      "proposito": "Para qué sirve.",
      "salud": "aMedias",
      "nodos": [
        {
          "id": "n1",
          "nombre": "Pieza",
          "queHace": "Qué hace, en lenguaje simple.",
          "estado": "listo",
          "x": 40,
          "y": 120
        }
      ],
      "edges": []
    }
  ],
  "herramientasInternas": [],
  "riesgos": [],
  "tokens": null
}
```

## Enums

- **estado / salud:** `listo` · `aMedias` · `falta`
- **severidad:** `alta` · `media` · `baja`
- **tipo (riesgo):** `seguridad` · `escala` · `codigoMuerto` · `deuda`
- **edge.kind:** `done` · `future`

## Reglas de negocio (validador)

1. Al menos un producto; cada producto ≥ 1 nodo.
2. IDs únicos: productos, nodos (por producto), tareas (global), riesgos (global).
3. `edges.from` / `edges.to` deben existir en los nodos del mismo producto.
4. Toda tarea con `productoId` debe coincidir con el producto padre (no mezclar).
5. Riesgos de severidad `alta` obligan `why` + `fix` + `pasos[]` (enseñar, no asustar).
6. `tokens` es `null` o un objeto con `facturable` (o `disponible: false`).

## Validar / armar

```bash
node scripts/validate.mjs examples/data/entiendo.workspace.json fixtures/minimal.workspace.json
node scripts/assemble.mjs examples/data/entiendo.workspace.json -o examples/dashboard.html
```
