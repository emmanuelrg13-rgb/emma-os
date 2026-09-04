# Emma OS v1.7.1 — Finanzas M2: FinanceRepository

## Alcance

M2 introduce la capa `FinanceRepository` y el adaptador experimental `GoogleSheetsFinanceAdapter` para separar el dominio financiero de la persistencia.

La base funcional sigue siendo **Control Financiero Personal v1.0 / snapshot v10.1-auditoria**. La Google Sheet actual continúa como fuente de verdad inicial. Emma OS no copia la Web App antigua ni porta su CSS acumulado.

## Archivos creados

```text
apps/finanzas/repository/finance-repository.js
apps/finanzas/repository/google-sheets-finance-adapter.js
apps/finanzas/service/finance-service.js
apps/finanzas/backend/finance-google-sheets-api-v1-7-1.gs.txt
apps/finanzas/tests/finance-repository-tests.html
```

## Contrato implementado

El contrato conceptual definido para Finanzas queda representado por estos métodos:

- `getAppState()`
- `previewMonthlyAmount(amount)`
- `simulateAmount(amount)`
- `saveSettings(payload)`
- `saveItem(payload)`
- `archiveItem(id)`
- `registerPaymentBatch(payload)`
- `voidPayment(pagoId)`

En M2 la UI nativa de Emma OS sólo usa lectura y pruebas. Las escrituras existen en el contrato, pero quedan bloqueadas desde la pantalla para evitar cambios reales antes de M3/M4.

## Persistencia

M2 mantiene el patrón preferido:

```text
FinanceUI -> FinanceService -> FinanceCore -> FinanceRepository -> GoogleSheetsAdapter
```

`FinanceCore` sigue siendo puro. `FinanceRepository` decide cómo obtener o mutar datos. `GoogleSheetsFinanceAdapter` llama a una Web App de Apps Script publicada aparte.

## Apps Script M2

El archivo:

```text
apps/finanzas/backend/finance-google-sheets-api-v1-7-1.gs.txt
```

contiene una API independiente basada en el backend estable `v10.1-auditoria`. Debe pegarse en una implementación nueva de Apps Script, apuntando a la misma Google Sheet mediante `APP_SPREADSHEET_ID`.

No debe reemplazar la Web App estable sin tener fallback.

## Seguridad M2

- La URL `/exec` y la clave privada se guardan sólo en `localStorage` del dispositivo.
- El repositorio público no debe incluir la URL real ni la clave.
- Las acciones de escritura requieren `allowWrite=1` en el backend.
- La pantalla M2 no ofrece botones de escritura real.

## Pruebas

Pruebas locales:

```text
apps/finanzas/tests/finance-core-tests.html
apps/finanzas/tests/finance-repository-tests.html
```

Pruebas manuales con Google Sheets:

1. Publicar Apps Script M2 como Web App.
2. Guardar URL `/exec` y clave en Emma OS Finanzas.
3. Probar conexión.
4. Leer estado desde Sheets.
5. Revisar paridad ligera: saldo general, saldo deuda y primera asignación.

## No incluido en M2

- UI financiera completa.
- Registro de pagos desde Emma OS.
- Anulación de pagos desde Emma OS.
- Creación/edición real de ítems desde Emma OS.
- Corte de la Web App antigua.
- Migración de almacenamiento.

Eso queda para M3, M4 y M5.
