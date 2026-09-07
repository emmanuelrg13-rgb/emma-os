# Emma OS v1.8.4 — M8 Despensa simple

## Objetivo
Integrar una versión nativa y simplificada de la app de despensa dentro de Emma OS.

## Alcance incluido
- Inventario actual de productos.
- Añadir productos.
- Editar productos.
- Eliminar productos.
- Ajustar stock actual.
- Validar faltantes contra stock ideal.
- Generar lista de supermercado agrupada por tienda.
- Exportar/importar JSON del módulo.
- Integración con Inicio, menú lateral, Respaldos y Sync Sheets.

## Alcance excluido
- Planificación semanal.
- Presupuesto.
- Compras reales completas.
- Historial formal de compras.
- Simulaciones reversibles.
- Análisis inteligente.
- Vencimientos por lote.
- APK/WebView.

## Clave localStorage
`emma_os_despensa_v1`

## Regla de faltante
`faltante = max(0, idealStock - currentStock)`

## Regla de envases
`envases = ceil(faltante / packSize)`

## Nota
La app antigua y su Google Sheet no se modifican. Este módulo vive dentro de Emma OS y usa almacenamiento local más respaldo global.
