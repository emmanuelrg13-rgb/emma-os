# Emma OS v1.8.0 — Finanzas M5 Corte Controlado

## Objetivo

M5 marca el corte operativo: Emma OS pasa a ser la interfaz principal del Control Financiero Personal, manteniendo Google Sheets como fuente de verdad inicial y la Web App antigua como respaldo temporal.

## Evidencia requerida

- Reporte M4 generado desde `google-sheets-apps-script`, no desde memoria/demo.
- Estado M4 aprobado, sin fallos.
- Checks no negociables aprobados.
- Estado financiero leído desde la base real.
- Certificado M5 exportado y guardado junto al reporte M4.

## Alcance

- La UI nativa de Emma OS queda como ruta principal para lectura y escritura controlada.
- Google Sheets sigue siendo la base de verdad.
- La Web App antigua no se elimina en esta fase.
- No se migra almacenamiento en M5.

## Fuera de alcance

- Correcciones visuales profundas.
- Rediseño de vistas.
- Cambio de Google Sheets a IndexedDB/API/otra base.
- Eliminación de la Web App estable antigua.
