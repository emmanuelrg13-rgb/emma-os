Emma OS v1.5.4

Parche de sincronización Google Sheets.

Cambios principales:
- Reemplaza la subida POST/iframe por subida por partes vía JSONP.
- El botón "Subir respaldo a Sheets" ahora muestra progreso visible.
- Apps Script v1.5.4 recibe partes temporales en la hoja EmmaOS_UploadChunks, arma el respaldo y luego guarda en EmmaOS_Backups.
- Mantiene conexión, traer último respaldo, previsualización y restauración.
- Mantiene respaldo manual como plan B.

Actualización:
1. Exporta respaldo global desde tu Emma OS actual.
2. Sube el contenido de esta carpeta a la raíz del repo emma-os.
3. Commit sugerido: Actualizar Emma OS a v1.5.4 Sync chunked upload.
4. Abre la app con ?v=1.5.4.
5. En Sync Sheets, copia el Apps Script v1.5.4.
6. Reemplaza el código de Apps Script anterior por el nuevo y conserva tu clave.
7. Guarda y crea una nueva implementación, o actualiza la implementación existente como nueva versión.
8. Prueba conexión.
9. Prueba Subir respaldo a Sheets.

Nota:
La hoja EmmaOS_UploadChunks es temporal. Si una subida falla a medio camino, pueden quedar filas temporales ahí; se pueden borrar sin afectar los respaldos ya guardados en EmmaOS_Backups.


Patch v1.5.4: añade estado visible junto al botón de subida, cambia texto del botón durante la subida y desplaza al panel de operación para evitar que parezca que no sucede nada en móvil.
