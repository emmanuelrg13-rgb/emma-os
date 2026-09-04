# Emma OS v1.7.2 — Finanzas M3 parcial lectura

## Cambios

- Se agrega UI nativa de lectura para Control Financiero Personal.
- Se crean vistas: Este mes, Ruta, Items, Simulador, Logros, Historial, Ajustes y Paridad.
- Se agrega `apps/finanzas/ui/finance-readonly-ui.js` como capa visual nativa del módulo.
- Se mantiene `FinanceService -> FinanceCore -> FinanceRepository -> GoogleSheetsFinanceAdapter`.
- Se actualizan versión visible, manifest y service worker.

## Seguridad

- Sin iframe de la Web App antigua.
- Sin CSS acumulado antiguo.
- Sin escrituras desde la UI M3 parcial.
- Google Sheets sigue siendo fuente de verdad inicial.

## Próxima etapa sugerida

M3 escritura controlada o v1.7.3: habilitar, probar y validar una operación de escritura a la vez.
