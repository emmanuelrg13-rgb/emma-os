Emma OS v1.5
==============

Versión preparada para GitHub Pages / PWA.

Módulos incluidos:
- Pendientes diarios
- Arrowverso
- Rutina atómica
- Botiquín
- Centro de respaldos
- Sync Sheets experimental

Cambios principales de v1.5:
- Nuevo módulo Sync Sheets.
- Configuración local de URL de Apps Script y clave de sincronización.
- Botón para probar conexión.
- Botón para subir respaldo global a Google Sheets.
- Botón para traer el último respaldo desde Google Sheets y previsualizar antes de restaurar.
- Apps Script incluido como plantilla en apps/sheets-sync/emma-os-apps-script-v1-5.gs.txt.
- Service worker actualizado a emma-os-v1-5-cache-001.

Instalación / actualización:
1. Exporta un respaldo global desde tu Emma OS actual.
2. Descomprime este ZIP.
3. Sube el contenido de la carpeta a la raíz del repositorio GitHub Pages.
4. Haz commit.
5. Abre la URL con ?v=1.5 para forzar actualización.
6. Revisa Inicio, Respaldos y Sync Sheets.

Configuración de Sync Sheets:
1. Crea una Google Sheet llamada, por ejemplo, Emma OS - Base de Datos.
2. En esa planilla, entra a Extensiones > Apps Script.
3. Pega el script incluido en el módulo Sync Sheets.
4. Cambia CAMBIA_ESTA_CLAVE por una clave privada.
5. Implementa el proyecto como Aplicación web.
6. Ejecutar como: tú mismo.
7. Acceso: cualquier usuario con el enlace.
8. Copia la URL terminada en /exec.
9. En Emma OS > Sync Sheets, pega la URL y la misma clave.
10. Prueba conexión y luego sube respaldo.

Notas de seguridad:
- No guardes tu clave privada en el repositorio público.
- La URL y la clave se guardan sólo en localStorage del dispositivo.
- localStorage sigue siendo la copia rápida local.
- Google Sheets funciona como respaldo externo experimental.
- Si la sincronización falla por permisos de Google/Apps Script, usa el Centro de respaldos manual manual de v1.5.
