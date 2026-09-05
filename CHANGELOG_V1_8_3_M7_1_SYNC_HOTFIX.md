# Emma OS v1.8.3 — M7.1 Sync Sheets hotfix

Fecha: 2026-09-05

## Objetivo
Corregir el falso error de Sync Sheets donde el respaldo sí llegaba a `EmmaOS_Backups`, pero Emma OS mostraba “Subida incompleta: llegaron 0 de N partes”.

## Diagnóstico
El cierre de subida (`saveBackupFinish`) podía ejecutarse correctamente, guardar el respaldo final y limpiar las partes temporales. Si el navegador no recibía esa respuesta a tiempo y reintentaba el cierre, el segundo intento ya no encontraba partes temporales y devolvía error.

## Cambios

### Sync Sheets
- El cierre de subida ahora es idempotente.
- Apps Script guarda un resultado técnico `finishedUpload_<uploadId>` antes de limpiar las partes temporales.
- Si el navegador reintenta el cierre de una subida ya terminada, Apps Script responde éxito en vez de “0 partes”.
- Se aumentó el tiempo de espera JSONP a 45 segundos.
- Se mantiene la subida por partes con confirmación.

### Finanzas en respaldos
- Sync Sheets ahora incluye el módulo `finanzas` con la clave `emmaos_finanzas_snapshot_v1`.
- El estado de módulos debería pasar de 5/5 a 6/6 cuando exista snapshot financiero local.

### Cache/PWA
- Cache actualizado a `emma-os-v1-8-3-cache-001` para forzar actualización en navegador/PWA.

## Validación recomendada
1. Publicar v1.8.3 en GitHub Pages.
2. Abrir con `?v=1.8.3`.
3. Copiar el Apps Script v1.8.3 desde Sync Sheets.
4. Reemplazar el script en Apps Script.
5. Guardar y publicar una nueva versión de la implementación `/exec`.
6. Probar: conexión → diagnóstico → subir respaldo → traer último respaldo.
