# Reporte M8.1 — Migración inventario original

Fuente: `Inventario_Domestico_Inteligente_v1.xlsx`

## Resultado

- Productos totales: 36
- Productos activos: 36
- Lotes totales: 48
- Lotes disponibles: 46
- Agotados: 6
- Bajo mínimo: 2
- Suficientes: 28
- Ítems sugeridos para lista de supermercado: 16
- Total estimado de lista: $27.340 CLP

## Regla aplicada

Se migró la estructura completa de productos hacia el modelo simplificado de Emma OS.

El `currentStock` se obtuvo desde `Stock_disponible`. validado contra la suma de `Stock_Lotes` disponibles.

La lista de supermercado se calculó con:

```txt
faltante = max(0. idealStock - currentStock)
envases = ceil(faltante / packSize)
subtotal = envases * referencePrice
```

## Alcance

No se migraron compras reales. simulaciones. presupuesto. planificación semanal ni análisis avanzado.
