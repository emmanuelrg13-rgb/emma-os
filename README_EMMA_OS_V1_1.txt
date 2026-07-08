Emma OS v1.1
============

Contenido
---------
- index.html: portada principal / dashboard.
- apps/pendientes/: checklist diario integrado.
- apps/arrowverse/: checklist cronológico del Arrowverso.
- apps/rutina-atomica/: rutina atómica Semana 0.
- apps/respaldo/: centro de respaldos global.
- manifest.webmanifest + sw.js + icons/: soporte PWA instalable.

Novedades v1.1
--------------
- Centro de respaldos global.
- Exportación de todo Emma OS en un solo JSON.
- Importación de respaldo global.
- Estado de módulos con datos.
- Protocolo de actualización integrado en la portada y en el centro de respaldos.
- Identificación clara de versión: Emma OS v1.1.

Cómo actualizar en GitHub Pages
-------------------------------
1. Abre tu Emma OS actual.
2. Entra a Centro de respaldos.
3. Pulsa Exportar respaldo global y guarda el JSON.
4. En GitHub, sube el CONTENIDO de esta carpeta a la raíz del repositorio, reemplazando archivos anteriores.
5. Haz Commit changes.
6. Espera unos minutos y abre tu URL de GitHub Pages.
7. Prueba los módulos en computador y teléfono.
8. Si algún dato no aparece, importa el respaldo global desde Centro de respaldos.

Cómo subir por primera vez a GitHub Pages
-----------------------------------------
1. Crea un repositorio público, por ejemplo: emma-os.
2. Sube el CONTENIDO de esta carpeta a la raíz del repositorio.
   Debes ver index.html directamente en la raíz, no dentro de otra carpeta.
3. En GitHub: Settings > Pages.
4. Source: Deploy from a branch.
5. Branch: main / root.
6. Espera la URL de GitHub Pages.

Datos y respaldos
-----------------
Los datos quedan en el localStorage del navegador/dispositivo.
No se suben automáticamente a GitHub.

Claves usadas:
- emmaos_pendientes_v1
- emmaos_arrowverse_v1
- emmaos_rutina_atomica_v1
- emmaos_last_backup_at
- emmaos_last_import_at

Roadmap acordado
----------------
- v1.1: base estable, versión y centro de respaldos.
- v1.2: estandarización visual del sistema completo.
- v1.3: primer módulo nuevo usando el estándar visual.
