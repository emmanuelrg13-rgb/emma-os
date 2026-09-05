# Emma OS v1.8.1 — M6 ajustes visuales web

Fecha: 2026-09-04

## Objetivo
Aplicar correcciones visuales de navegador antes de una futura M7 enfocada en móvil.

## Cambios incluidos

### 1) Pendientes diarios
- Se amplió el ancho útil de la vista.
- El tablero de prioridades pasa a una disposición más cómoda para escritorio.
- Las acciones dentro de cada pendiente ahora usan `flex-wrap`, evitando superposiciones entre botones y selectores.
- Se ajustaron gaps y paddings para una lectura más limpia.

### 2) Rutina atómica
- Se eliminó la dependencia visual de la semana fija de julio.
- Se agregó el botón **"Actualizar a semana actual"**.
- La rutina ahora guarda el `weekStart` y recalcula fechas visibles a partir de esa semana.
- Al mover la rutina a la semana actual, se reinician checks y status para evitar arrastrar datos antiguos por error.
- Se mantiene compatibilidad con exportación/importación JSON.

### 3) Finanzas
- Se limpió la cabecera para uso diario.
- Se eliminaron de la UI principal los accesos de pruebas y certificación:
  - Pruebas M1
  - Pruebas M2
  - Pruebas M3
  - Pruebas M4
  - Generar reporte M4
  - Exportar reporte M4
  - Generar certificado M5
  - Exportar certificado M5
  - Pruebas M5
  - Apps Script M3
- Se eliminaron las pestañas visibles **Paridad** y **Corte M5** del modal principal.
- Se reemplazó la tarjeta técnica de corte por una tarjeta de **Modo de carga**.
- Se corrigió el espaciado de textos en tarjetas y listas, mostrando subtítulos debajo del título para evitar texto pegado.
- En sugerencias mensuales e ítems, la metadata ahora se presenta como línea secundaria más clara.

### 4) Infraestructura de versión
- Se actualizó el shell a `v1.8.1`.
- Se actualizó la portada a `v1.8.1`.
- Se actualizó `sw.js` con un nuevo `CACHE_NAME` para forzar recarga limpia.

## Nota
Esta versión corresponde a **M6 navegador**. La validación visual en móvil queda reservada para una futura **M7** si aparecen nuevos detalles por corregir.
