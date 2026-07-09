Emma OS v1.5.1

Parche de Sync Sheets para reducir errores CORS/Failed to fetch con Apps Script.

Cambios principales:
- Sync Sheets ahora usa JSONP para Probar conexión y Traer último respaldo.
- Subir respaldo usa POST silencioso no-cors y luego verifica leyendo el último respaldo.
- Apps Script v1.5.1 incluye doGet + doPost + handler compartido.
- Mantiene las mismas claves localStorage; no debería borrar tus datos.

Actualización:
1. Exporta respaldo global desde Emma OS actual.
2. Sube el contenido de este ZIP a la raíz del repo.
3. Commit sugerido: Actualizar Emma OS a v1.5.1 Sync Sheets patch.
4. Abre con ?v=1.5.1.
5. En Sync Sheets, copia el nuevo Apps Script v1.5.1.
6. En Apps Script, reemplaza el código anterior, guarda y crea una nueva implementación o actualiza la existente.
7. Copia la URL /exec más reciente en Emma OS.
8. Prueba conexión.

Importante:
- Ejecutar como: tú mismo.
- Acceso: cualquier usuario con el enlace.
- Usa la URL terminada en /exec, no /dev.
