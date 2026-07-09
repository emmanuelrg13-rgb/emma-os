Emma OS v1.4
============

Contenido
---------
- Dashboard principal.
- Módulo Pendientes diarios.
- Módulo Arrowverso.
- Módulo Rutina atómica.
- Módulo Botiquín.
- Centro de respaldos externos.
- Exportación JSON preparada para guardar en Google Drive.
- Validación y previsualización de importaciones.
- Historial local de respaldos generados.
- Índice CSV para abrir en Excel o Google Sheets.
- Navegación lateral desplegable en lugar de barra superior fija.
- PWA básica para GitHub Pages.

Claves localStorage
-------------------
- emmaos_pendientes_v1
- emmaos_arrowverse_v1
- emmaos_rutina_atomica_v1
- emmaos_botiquin_v1
- emmaos_last_backup_at
- emmaos_last_drive_backup_at
- emmaos_backup_history_v1

Actualización recomendada
-------------------------
1. Exportar respaldo global desde Centro de respaldos.
2. Descomprimir este ZIP.
3. Subir el contenido a la raíz del repositorio de GitHub Pages.
4. Hacer commit.
5. Esperar actualización de GitHub Pages.
6. Abrir con ?v=1.4 si la PWA conserva caché antigua.
7. Importar respaldo global si algún módulo no muestra datos.

Notas
-----
El módulo Botiquín es un inventario doméstico. No registra dosis ni reemplaza indicaciones médicas. La v1.4 no sincroniza automáticamente con Drive; genera archivos JSON para guardarlos manualmente como respaldo externo.
