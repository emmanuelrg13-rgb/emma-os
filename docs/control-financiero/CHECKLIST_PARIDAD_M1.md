# Checklist de paridad M1 — FinanceCore

Este checklist valida el motor puro antes de conectar Google Sheets.

## Invariantes del núcleo

- [x] `saldoPendiente = max(0, montoTotal - pagadoPrevio - pagosConfirmados)`.
- [x] Pagos `Anulado` no rebajan saldo, pero permanecen en historial.
- [x] Items `Archivado` no participan en totales ni ruta.
- [x] Items `Pausado` conservan saldo, pero salen de la ruta automática.
- [x] `Pagado` exige saldo cero en validación de item.
- [x] No se asignan pagos a inversiones si el gate de deuda no está desbloqueado.
- [x] Estrategias disponibles: `prioridad_manual`, `menor_monto_primero`, `deudas_primero`, `urgentes_primero`.
- [x] Proyecciones tienen horizonte máximo de 480 meses.
- [x] Fechas 29/30/31 usan clamp al sumar meses.
- [x] No se calculan intereses ni cargos futuros.

## Pendiente para M2/M4

- [ ] Comparar salida de `getAppState` contra la Web App v1.0 con datos reales.
- [ ] Comparar primera asignación de las cuatro estrategias contra Apps Script estable.
- [ ] Verificar logros con `unlockedAt` real desde hoja `Logros`.
- [ ] Verificar pagos/anulaciones reales con UUIDs históricos.
- [ ] Validar idempotencia en backend/repositorio.
