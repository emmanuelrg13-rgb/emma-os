# Emma OS v1.7.3 — Finanzas M3 escritura controlada

Fecha: 2026-09-04  
Base: Emma OS v1.7.2 M3 lectura validada  
Fuente funcional: Control Financiero Personal v1.0 / snapshot v10.1-auditoria

## Cambios

- Se habilita una pestaña **Escritura** dentro de Finanzas.
- Se agregan acciones controladas contra Google Sheets:
  - registrar asignaciones sugeridas del mes;
  - registrar pago manual;
  - crear/editar ítem;
  - archivar ítem;
  - guardar ajustes financieros;
  - anular pago confirmado sin borrar historial.
- Cada escritura exige:
  - estado cargado previamente;
  - armar escritura por sesión;
  - confirmación por operación;
  - adaptador `allowWrites=true`;
  - backend con `allowWrite=1`;
  - validación completa del Apps Script.
- Se agrega `finance-write-ui.js`.
- Se agregan pruebas locales no destructivas `finance-write-tests.html`.
- Se entrega Apps Script M3 `finance-google-sheets-api-v1-7-3.gs.txt`.
- Se actualiza service worker/cache a v1.7.3.

## No cambia

- No se reemplaza Google Sheets como fuente de verdad.
- No se borra historial de pagos.
- No se regeneran IDs de ítems ni UUIDs de pagos.
- No se copian CSS ni frontend antiguo.
- No se calculan intereses/comisiones futuras.

## Riesgos controlados

Las escrituras siguen protegidas por el contrato y por validación del backend. La UI sólo desbloquea acciones después de activación manual y confirmación explícita.
