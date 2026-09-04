# Emma OS v1.7.1 — Finanzas M2

Fecha: 2026-09-03  
Autoría: OpenAI/ChatGPT (GPT-5.5 Thinking) para Emmanuel Rojas.

## Agregado

- Capa `FinanceRepository`.
- Adaptador local `MemoryFinanceRepository` para pruebas no destructivas.
- Adaptador `GoogleSheetsFinanceAdapter` para Apps Script mediante JSONP.
- Capa `FinanceService`.
- Backend de referencia `finance-google-sheets-api-v1-7-1.gs.txt`.
- Pantalla Finanzas M2 con configuración local de URL/clave.
- Lectura experimental de estado desde Google Sheets.
- Simulación local sobre el último estado leído.
- Pruebas M2 de repositorio.
- Documentación M2 y checklist de paridad.

## Conservado

- La app financiera v1.0 estable no se modifica.
- Google Sheets sigue siendo fuente de verdad inicial.
- No se porta CSS antiguo.
- No se embebe la Web App antigua.
- IDs de ítems, UUIDs de pagos y logros se tratan como datos a preservar.

## Restricción deliberada

- La UI M2 no ejecuta escrituras reales. Pagos, anulaciones, edición y archivo quedan para M3/M4.
