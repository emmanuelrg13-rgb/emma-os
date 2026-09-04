# Contrato funcional recomendado para la migracion

La forma mas segura de portar la app es conservar primero el **contrato de servicios** aunque cambie la implementacion.

## Lecturas

### `getAppState()`
Debe entregar como minimo:
- settings;
- items hidratados con pagos;
- payments;
- totals;
- currentPlan;
- projection;
- scenarios;
- investmentGate;
- milestones;
- achievements;
- newlyUnlocked;
- achievementSummary.

### `previewMonthlyAmount(amount)`
Calcula el mes actual con un aporte temporal sin persistirlo.

### `simulateAmount(amount)`
Compara una proyeccion candidata con la base sin modificar datos.

## Escrituras

### `saveSettings(payload)`
Valida min/max/base, fecha, umbral y estrategia.

### `saveItem(payload)`
Crea o edita un item respetando historial pagado y estados.

### `archiveItem(id)`
Archivado logico; no borrar fisicamente.

### `registerPaymentBatch(payload)`
Entrada recomendada:
```json
{
  "requestId": "uuid-idempotente",
  "fecha": "YYYY-MM-DD",
  "payments": [
    {"itemId": 1, "monto": 10000, "mesPlan": 1, "nota": "opcional"}
  ]
}
```
Debe validar todos los movimientos antes de escribir cualquiera.

### `voidPayment(pagoId)`
Anulacion idempotente con trazabilidad.

## Capa recomendada en Emma OS

```text
FinanceUI
   |
FinanceService
   |
FinanceCore  <--- funciones puras: totales, rutas, estrategias, logros
   |
FinanceRepository
   |-----------------------------|
GoogleSheetsAdapter        Local/OfflineAdapter
(inicial)                   (opcional)
```

La UI no deberia saber si los datos provienen de Sheets, Drive, IndexedDB o una futura API.
