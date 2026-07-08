Emma OS v1.2
============

Contenido
---------
- index.html: portada principal / dashboard.
- emma-theme.css: estándar visual global de Emma OS.
- apps/pendientes/: checklist diario integrado.
- apps/arrowverse/: checklist cronológico del Arrowverso.
- apps/rutina-atomica/: rutina atómica Semana 0.
- apps/respaldo/: centro de respaldos global.
- manifest.webmanifest + sw.js + icons/: soporte PWA instalable.

Novedades v1.2
--------------
- Estándar visual global para todos los módulos.
- Barra superior común de Emma OS en portada y apps.
- Navegación persistente entre Inicio, Pendientes, Arrowverso, Rutina y Respaldos.
- Paleta unificada tomada desde la portada: fondo azul oscuro, cian, verde, violeta, amarillo y rosa.
- Cada módulo mantiene un acento propio sin romper la identidad general.
- Tarjetas, botones, inputs, paneles, barras de progreso y estados más consistentes.
- Service worker actualizado a cache v1.2 para forzar renovación de recursos.

Datos y compatibilidad
----------------------
La v1.2 mantiene las mismas claves de localStorage:
- emmaos_pendientes_v1
- emmaos_arrowverse_v1
- emmaos_rutina_atomica_v1

Esto significa que los datos existentes deberían seguir apareciendo al actualizar.
Aun así, antes de subir una versión nueva conviene exportar respaldo global desde el Centro de respaldos.

Cómo actualizar en GitHub Pages
-------------------------------
1. Abre Emma OS v1.1.
2. Entra a Centro de respaldos.
3. Exporta respaldo global y guarda el JSON.
4. Descomprime este ZIP.
5. En GitHub, sube el CONTENIDO de esta carpeta a la raíz del repositorio, reemplazando archivos anteriores.
6. Haz Commit changes.
7. Espera unos minutos.
8. Abre tu URL de GitHub Pages y prueba portada + módulos.
9. En teléfono, cierra y reabre la app instalada. Si ves la versión anterior, usa actualizar o espera a que el service worker renueve cache.

Roadmap
-------
- v1.1: base estable + respaldos.
- v1.2: estandarización visual completa.
- v1.3: añadir nuevo módulo usando el estándar visual.
