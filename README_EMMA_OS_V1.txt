Emma OS v1
==========

Contenido
---------
- index.html: portada principal / dashboard.
- apps/pendientes/: checklist diario v7 integrado.
- apps/arrowverse/: checklist cronológico del Arrowverso.
- apps/rutina-atomica/: rutina atómica Semana 0.
- manifest.webmanifest + sw.js + icons/: soporte PWA instalable.

Cómo subir a GitHub Pages
-------------------------
1. Crea un repositorio público, por ejemplo: emma-os.
2. Sube el CONTENIDO de esta carpeta a la raíz del repositorio.
   Debes ver index.html directamente en la raíz, no dentro de otra carpeta.
3. En GitHub: Settings > Pages.
4. Source: Deploy from a branch.
5. Branch: main / root.
6. Espera la URL de GitHub Pages.

Cómo instalar en Android
------------------------
1. Abre la URL de GitHub Pages en Chrome.
2. Menú de tres puntos.
3. Instalar app o Agregar a pantalla principal.

Datos y respaldos
-----------------
Los datos quedan en el localStorage del navegador/dispositivo.
No se suben automáticamente a GitHub.

Claves usadas:
- emmaos_pendientes_v1
- emmaos_arrowverse_v1
- emmaos_rutina_atomica_v1

Recomendación: exporta JSON desde cada módulo cuando quieras respaldar o migrar dispositivo.
