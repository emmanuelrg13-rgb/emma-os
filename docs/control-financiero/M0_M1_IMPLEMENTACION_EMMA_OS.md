# Emma OS v1.7.1 — Control Financiero Personal M0 + M1

**Fecha:** 2026-09-03  
**Autoría de implementación:** OpenAI / ChatGPT (GPT-5.5 Thinking), a partir del paquete maestro entregado por Emmanuel Rojas.  
**Base Emma OS:** v1.6.1 estable.  
**Fuente funcional congelada:** Control Financiero Personal v1.0, snapshot técnico `v10.1-auditoria`.

## Alcance de esta versión

Esta versión **no integra todavía la base real de Google Sheets**, no registra pagos reales y no reemplaza la Web App financiera estable. Implementa solamente:

- **M0 — Congelación:** documentación de migración, esquema y manifiestos de release dentro de Emma OS.
- **M1 — FinanceCore:** motor financiero puro en JavaScript, sin UI antigua, sin `google.script.run` y sin escritura en Google Sheets.
- **Laboratorio de Finanzas:** pantalla nativa de Emma OS para ejecutar pruebas locales del núcleo con fixtures controlados.

## Principios protegidos

- No portar la Web App antigua como iframe ni como HTML embebido.
- No copiar el CSS acumulado de la app financiera antigua.
- Mantener Google Sheets como fuente de verdad para la siguiente fase M2.
- Preservar IDs de items, UUIDs de pagos e IDs/unlockedAt de logros.
- No borrar historial: los pagos anulados se conservan con estado `Anulado`.
- Calcular saldos como `montoTotal - pagadoPrevio - pagosConfirmados`.
- Excluir `Archivado` de totales.
- Excluir `Pausado` de ruta automática, sin borrar su saldo ni inventar fecha de término.
- Mantener inversiones bloqueadas hasta el umbral de avance de deuda configurado.
- Mantener fechas financieras bajo lógica de `America/Santiago` y clamp de días 29/30/31.
- No calcular intereses, comisiones ni cargos futuros.

## Archivos creados

```text
apps/finanzas/
├── index.html
├── core/
│   ├── finance-schema.js
│   ├── finance-dates.js
│   ├── finance-strategies.js
│   ├── finance-achievements.js
│   └── finance-core.js
└── tests/
    ├── finance-fixtures.js
    └── finance-core-tests.html

docs/control-financiero/
├── MIGRACION_EMMA_OS.md
├── MODELO_DATOS.md
├── REGLAS_NEGOCIO.md
├── CONTRATO_FUNCIONAL.md
├── CHECKLIST_MIGRACION_EMMA_OS.md
├── CIERRE_Y_VALIDACION_FINAL.md
├── ARQUITECTURA_ACTUAL.md
├── finance-schema-v1.json
├── RELEASE_MANIFEST_CONTROL_FINANCIERO_V1_0.json
├── SHA256SUMS_CONTROL_FINANCIERO_V1_0.txt
└── M0_M1_IMPLEMENTACION_EMMA_OS.md
```

## Archivos tocados en el shell de Emma OS

- `index.html`: tarjeta de laboratorio de Finanzas y versión visible `v1.7.1`.
- `emma-shell.js`: entrada de Finanzas en el menú lateral.
- `emma-theme.css`: acento visual del módulo financiero.
- `manifest.webmanifest`: versión/descripción.
- `sw.js`: caché actualizado para archivos M0/M1/M2.

## Archivos no tocados funcionalmente

- `apps/pendientes/`
- `apps/arrowverse/`
- `apps/rutina-atomica/`
- `apps/botiquin/`
- `apps/dale-una-oportunidad/`
- `apps/respaldo/`
- `apps/sheets-sync/`

## Criterio para avanzar a M2

M2 debe crear el contrato `FinanceRepository` y un adaptador Google Sheets que use la base actual como fuente de verdad. La UI financiera completa no debe empezar hasta que el repositorio entregue `getAppState`, `previewMonthlyAmount` y `simulateAmount` leyendo datos reales y comparables.
