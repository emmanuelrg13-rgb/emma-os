Emma OS v1.7.1 — Finanzas M0/M1/M2

Base: Emma OS v1.6.1 estable.
Fecha: 2026-09-03.
Autoría de implementación: OpenAI/ChatGPT (GPT-5.5 Thinking).

Esta versión inicia la migración nativa de Control Financiero Personal v1.0 sin reemplazar todavía la Web App financiera estable.

Incluye:
- Documentación de congelación M0 en docs/control-financiero/.
- Copia de esquema, contrato, reglas, checklist y manifiestos del paquete maestro.
- Nuevo módulo apps/finanzas/ como laboratorio nativo.
- FinanceCore en JavaScript puro: saldos, totales, estrategias, proyección, gate, hitos, logros y validadores básicos.
- Tests locales no destructivos en apps/finanzas/tests/finance-core-tests.html.
- Entrada de Finanzas en home y menú lateral.
- Service worker actualizado a v1.7.1.

No incluye todavía:
- Lectura desde Google Sheets real.
- Escritura de pagos reales.
- Anulación real de pagos.
- UI financiera final.
- Corte desde la Web App antigua.

Flujo de actualización:
1. Exportar respaldo global de Emma OS v1.6.1.
2. Subir el contenido de este ZIP a la raíz del repo GitHub Pages.
3. Commit sugerido: Actualizar Emma OS a v1.7.1 Finanzas M0-M1-M2.
4. Abrir con ?v=1.7.0.
5. Entrar a Finanzas y ejecutar pruebas M1.
