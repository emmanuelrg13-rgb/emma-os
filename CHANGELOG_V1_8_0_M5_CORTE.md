# Emma OS v1.8.0 — Finanzas M5 Corte Controlado

## Cambios

- Finanzas pasa de M4 paridad a M5 corte controlado.
- Emma OS queda como interfaz principal del Control Financiero Personal.
- Se agrega pestaña `Corte M5`.
- Se agrega generación/exportación de certificado M5.
- Se agrega `finance-cutover-ui.js`.
- Se agrega prueba local `finance-cutover-tests.html`.
- El Centro de respaldos incluye snapshot financiero local sin clave privada.
- `FinanceService` guarda `emmaos_finanzas_snapshot_v1` al leer estado desde Sheets.
- Service worker actualizado a cache `v1.8.0`.

## No cambia

- Google Sheets sigue siendo fuente de verdad inicial.
- La Web App antigua no se elimina; queda como respaldo temporal.
- No se cambia la estructura de la base.
- No se agrega migración de almacenamiento.
