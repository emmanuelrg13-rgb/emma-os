# M3 — Escritura controlada en Emma OS

M3 escritura controlada habilita acciones reales dentro del módulo Finanzas sin abandonar la arquitectura objetivo:

FinanceUI -> FinanceService -> FinanceCore -> FinanceRepository -> GoogleSheetsAdapter

## Acciones habilitadas

- Registrar lote de pagos sugeridos.
- Registrar pago manual parcial.
- Crear o editar ítems.
- Archivar ítems.
- Guardar ajustes.
- Anular pagos sin borrar historial.

## Protecciones

- El usuario debe armar escritura por sesión.
- Cada operación solicita confirmación visible.
- El cliente usa `allowWrites=true` sólo para la operación.
- El endpoint exige `allowWrite=1`.
- Apps Script valida saldos, estados, gate de inversiones e idempotencia.
- Después de cada escritura se recarga estado desde repositorio.

## Invariantes conservados

- Pagos: Confirmado/Anulado; nunca borrar historial.
- Saldo: montoTotal - pagadoPrevio - pagosConfirmados.
- Pausado sale de ruta pero conserva saldo.
- Archivado se excluye de totales.
- Inversiones bloqueadas hasta el umbral configurado.
- No se calculan intereses futuros.
