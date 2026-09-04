# Emma OS v1.7.4 — Finanzas M4 Paridad

## Objetivo

M4 valida que el dominio financiero portado a Emma OS produzca los mismos resultados que el backend estable `v10.1-auditoria`, usando la misma Google Sheet como fuente de verdad.

La fase no cambia almacenamiento ni redefine reglas de negocio. La Web App estable se mantiene como fallback hasta el corte M5.

## Qué compara el reporte M4

- Metadatos de base funcional y zona horaria.
- Totales por categoría y general.
- Saldos por ítem.
- IDs de ítems y UUIDs de pagos.
- Pagos confirmados y pagos anulados.
- Ruta sugerida del mes.
- Primeros meses de proyección.
- Hitos de proyección.
- Gate de inversiones.
- Logros y conservación de `unlockedAt`.
- Exportabilidad del paquete financiero.

## Flujo de validación

1. Abrir Emma OS Finanzas v1.7.4.
2. Leer estado desde Google Sheets.
3. Ejecutar pruebas M1, M2 y M3.
4. Ejecutar Pruebas M4.
5. Pulsar `Generar reporte M4`.
6. Revisar que los checks no negociables estén aprobados.
7. Comparar visualmente contra la Web App estable v1.0.
8. Exportar el reporte M4 JSON.
9. Guardar captura + JSON como evidencia.

## Criterio para avanzar a M5

Se puede avanzar si:

- M1, M2, M3 y M4 pasan.
- El reporte M4 no queda bloqueado.
- Los checks no negociables pasan.
- No se detectan diferencias críticas en saldos, pagos, ruta, gate, logros o fechas.
- La Web App estable sigue disponible como respaldo.
