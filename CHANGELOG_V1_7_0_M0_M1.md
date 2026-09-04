# Changelog — Emma OS v1.7.1 M0/M1/M2

## Agregado

- Módulo `apps/finanzas/` en estado laboratorio.
- Núcleo financiero puro en `apps/finanzas/core/`.
- Tests no destructivos del núcleo en `apps/finanzas/tests/finance-core-tests.html`.
- Documentación de migración en `docs/control-financiero/`.
- Tarjeta Finanzas en el inicio.
- Entrada Finanzas en el menú lateral.
- Acento visual de módulo financiero.
- Cache PWA `emma-os-v1-7-0-cache-001`.

## Protecciones

- La base Google Sheets real no se modifica.
- La Web App v1.0 estable no se reemplaza.
- No se copió CSS antiguo.
- No se usó `google.script.run`.
- No se registran pagos reales en esta fase.

## Siguiente fase sugerida

M2: crear `FinanceRepository`, adaptador Google Sheets y contrato de lectura/escritura compatible con la fuente real.
