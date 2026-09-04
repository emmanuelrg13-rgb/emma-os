Emma OS v1.7.4 — Finanzas M4 Paridad

Objetivo:
Validar que Finanzas nativo en Emma OS mantiene paridad con Control Financiero Personal v1.0 / snapshot v10.1-auditoria.

Instalación:
1. Exportar respaldo global desde Emma OS.
2. Subir el contenido del ZIP a la raíz del repositorio GitHub Pages.
3. Commit sugerido: Actualizar Emma OS a v1.7.4 Finanzas M4 paridad.
4. Abrir con ?v=1.7.4.
5. Entrar a Finanzas.

Validación:
1. Leer estado desde Sheets.
2. Ejecutar Pruebas M1, M2, M3 y M4.
3. Pulsar Generar reporte M4.
4. Revisar checks no negociables.
5. Exportar reporte M4 JSON.

Notas:
- No requiere cambiar Apps Script si M3 ya está funcionando.
- M4 no modifica la base de Google Sheets por sí misma.
- La Web App financiera estable debe permanecer como fallback hasta M5.
