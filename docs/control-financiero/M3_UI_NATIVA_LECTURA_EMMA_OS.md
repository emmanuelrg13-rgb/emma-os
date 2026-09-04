# Emma OS v1.7.2 — Finanzas M3 parcial: UI nativa de lectura

## Objetivo

Recrear las pantallas financieras principales dentro de Emma OS usando componentes nativos del sistema visual actual, sin embeber la Web App antigua y sin copiar su CSS acumulado.

## Alcance incluido

- Pantalla `apps/finanzas/index.html` reconstruida como módulo nativo de Emma OS.
- Vistas de lectura:
  - Este mes
  - Ruta
  - Items
  - Simulador
  - Logros
  - Historial
  - Ajustes
  - Paridad
- Nuevo módulo UI: `apps/finanzas/ui/finance-readonly-ui.js`.
- Lectura desde Google Sheets usando el `GoogleSheetsFinanceAdapter` validado en M2.
- Demo local no destructiva usando `MemoryFinanceRepository`.
- Simulador sin persistencia.

## Límites deliberados

M3 parcial no habilita escritura real:

- No registra pagos.
- No anula pagos.
- No crea ni edita ítems.
- No archiva ítems.
- No guarda ajustes en Google Sheets.

Las escrituras quedan para una etapa posterior con validación de paridad y backend/repository protegidos.

## Criterios de validación

- Pruebas M1 siguen en verde.
- Pruebas M2 siguen en verde.
- `Leer estado desde Sheets` carga datos reales.
- Las vistas renderizan sin modificar la base.
- Paridad ligera mantiene saldos y primera asignación coincidentes.
- La Web App financiera estable sigue intacta como fallback.
