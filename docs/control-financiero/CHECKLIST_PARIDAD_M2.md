# Checklist de paridad M2 — Finanzas

## Pruebas automáticas locales

- [ ] `finance-core-tests.html` pasa completo.
- [ ] `finance-repository-tests.html` pasa completo.
- [ ] `MemoryFinanceRepository` expone los 8 métodos del contrato.
- [ ] `registerPaymentBatch` local conserva idempotencia por `requestId`.
- [ ] `voidPayment` local anula sin borrar historial.
- [ ] `exportData` local incluye `schemaVersion = finance-schema-v1`.

## Pruebas con Google Sheets

- [ ] Apps Script M2 publicado como Web App `/exec`.
- [ ] `APP_SPREADSHEET_ID` apunta a la planilla correcta.
- [ ] `EMMA_OS_FINANCE_API_SECRET` fue cambiado.
- [ ] Emma OS guarda URL/clave sólo localmente.
- [ ] Botón `Probar conexión Sheets` responde OK.
- [ ] Botón `Leer estado desde Sheets` carga estado.
- [ ] Cantidad de ítems coincide con la app estable.
- [ ] Cantidad de pagos coincide con la app estable.
- [ ] Saldo general pendiente coincide.
- [ ] Saldo deuda pendiente coincide.
- [ ] Primera asignación mensual coincide.

## Límites M2

- [ ] No registrar pagos reales desde Emma OS.
- [ ] No anular pagos reales desde Emma OS.
- [ ] No editar ítems reales desde Emma OS.
- [ ] No modificar la estructura de la Google Sheet.
- [ ] No archivar la Web App antigua.

## Avance a M3 permitido sólo si

- [ ] M2 lee correctamente la fuente real.
- [ ] No hay diferencias críticas en paridad ligera.
- [ ] El usuario conserva fallback de la app estable.
