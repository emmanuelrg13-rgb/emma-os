# Emma OS v1.8.5 — M8.1 Despensa migración inventario original

Fecha: 2026-09-06

## Objetivo
Traer a Emma OS el inventario original exportado desde `Inventario_Domestico_Inteligente_v1.xlsx`. manteniendo la versión simple de Despensa.

## Resultado de migración
- Productos migrados: 36
- Productos activos: 36
- Lotes leídos: 48
- Lotes disponibles usados para validar stock: 46
- Productos agotados: 6
- Productos bajo mínimo: 2
- Productos suficientes: 28
- Sugerencias en lista de supermercado: 16
- Total estimado inicial de lista: $27.340 CLP

## Cambios
- Se agregó botón **Cargar inventario original** en `apps/despensa/`.
- Se incorporó el inventario original migrado como constante interna del módulo.
- Se guardó una copia JSON en `docs/despensa/INVENTARIO_ORIGINAL_MIGRADO_M8_1.json`.
- Se agregó reporte técnico en `docs/despensa/REPORTE_MIGRACION_INVENTARIO_ORIGINAL_M8_1.md`.
- Se actualizó versión y caché PWA a `v1.8.5`.

## Alcance
No se migran compras reales. simulaciones. presupuesto. planificación semanal ni análisis avanzado.
