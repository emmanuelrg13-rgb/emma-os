Emma OS v1.8.0 — Finanzas M3 escritura controlada

Esta versión continúa la migración nativa del Control Financiero Personal v1.0.

Cómo probar:
1. Exportar respaldo global desde Emma OS.
2. Subir el contenido del ZIP al repositorio GitHub Pages.
3. Abrir con ?v=1.7.4.
4. Entrar a Finanzas.
5. Leer estado desde Sheets.
6. Ejecutar Pruebas M1, M2 y M3.
7. En pestaña Escritura, armar escritura para la sesión antes de registrar acciones reales.

Notas:
- Google Sheets sigue siendo fuente de verdad.
- El Apps Script M2 validado puede seguir funcionando si conserva el mismo contrato y permite allowWrite=1.
- Se incluye Apps Script M3 actualizado sólo para mantener trazabilidad/versionado.
- Después de cada escritura, la app desarma el modo escritura y recarga estado.
