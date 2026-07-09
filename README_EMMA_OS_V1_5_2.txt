Emma OS v1.5.2

Parche de Sync Sheets.

Cambios:
- Mantiene JSONP para Probar conexión y Traer último respaldo.
- Cambia la subida a Google Sheets desde fetch/no-cors a formulario POST oculto, más compatible con Chrome Android y Apps Script.
- Apps Script v1.5.2 ahora acepta payload de formulario, posts simples y JSON antiguo.
- Muestra estado visible durante la subida y desactiva temporalmente el botón para evitar dobles envíos.

Actualización:
1. Exporta respaldo global desde Emma OS antes de cambiar versión.
2. Sube el contenido de esta carpeta a la raíz del repo.
3. Commit sugerido: Actualizar Emma OS a v1.5.2 Sync upload patch.
4. Abre con ?v=1.5.2.
5. En Sync Sheets, copia el nuevo Apps Script v1.5.2.
6. Pega ese código en Apps Script, manteniendo tu misma clave privada.
7. Guarda y crea una nueva implementación, o edita la implementación existente como nueva versión.
8. Prueba conexión y luego Subir respaldo a Sheets.

Notas:
- La URL y clave de sincronización quedan sólo en localStorage del dispositivo.
- localStorage sigue siendo la copia rápida; Google Sheets funciona como respaldo externo.
