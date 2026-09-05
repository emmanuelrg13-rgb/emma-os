Emma OS v1.8.3 — M7.1 Sync Sheets hotfix
=========================================

Esta versión corrige un falso negativo del respaldo en Google Sheets.

Qué corrige:
- Si el respaldo llegaba a la hoja pero el navegador no recibía la respuesta final, Emma OS podía reintentar el cierre y mostrar “0 partes” aunque el respaldo estuviera guardado.
- El cierre de subida ahora es idempotente: reintentar una subida ya finalizada devuelve OK.
- Sync Sheets ahora incluye Finanzas como módulo respaldable si existe `emmaos_finanzas_snapshot_v1`.

Después de subir esta versión a GitHub Pages:
1. Abre Emma OS con ?v=1.8.3.
2. Entra a Sync Sheets.
3. Copia o descarga el Apps Script v1.8.3.
4. Reemplaza el código en Apps Script.
5. Mantén tu misma clave privada.
6. Guarda y publica una nueva versión de la implementación.
7. Usa la URL /exec en Emma OS.
8. Ejecuta: Probar conexión → Diagnóstico Sheets → Subir respaldo a Sheets → Traer último respaldo.
