# Emma OS v1.8.0 — Finanzas M4 Paridad

## Cambios

- Se agrega generación de reporte M4 de paridad.
- Se agrega `apps/finanzas/ui/finance-parity-ui.js`.
- Se agrega `apps/finanzas/tests/finance-parity-tests.html`.
- Se actualiza la vista Finanzas a fase M4.
- Se agrega exportación JSON del reporte M4.
- Se conserva la escritura controlada de M3 sin ampliarla.
- No se modifica Google Sheets ni la Web App estable.
- Service worker/cache actualizado a `emma-os-v1-7-4-cache-001`.

## Alcance

M4 compara la salida de Apps Script v10.1-auditoria contra FinanceCore nativo de Emma OS usando el estado leído desde la base real. El objetivo es generar evidencia antes del corte M5.

## No cambia

- No se elimina la app estable.
- No se cambia la estructura de Google Sheets.
- No se migran datos a otra base.
- No se inventan intereses, comisiones ni fechas de término.
