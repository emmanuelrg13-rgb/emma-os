# Emma OS v1.8.3 — M7.1 hotfix Sync Sheets

Fecha: 2026-09-05

## Objetivo
Aplicar mejoras posteriores a M6, combinando correcciones visuales, mejoras de flujo en Pendientes y reparación del respaldo global a Google Sheets.

## Cambios incluidos

### Rutina atómica
- Se corrigió el contraste de las tarjetas de avance.
- Los datos de porcentaje, completados, pendientes y días verdes ahora usan tarjetas oscuras coherentes con Emma OS.
- Se mantiene el botón para actualizar a semana actual incorporado en M6.

### Pendientes diarios
- El campo de grupo al crear tarea ahora es una lista desplegable.
- La lista de grupos se alimenta de:
  - grupos base de Emma OS;
  - grupos ya existentes en tus tareas;
  - nuevos grupos creados desde el formulario.
- Se agregó la opción **+ Nuevo grupo…**.
- Al crear un grupo nuevo, se guarda y queda disponible para nuevas tareas.
- Al crear una tarea ahora puedes elegir:
  - Para hoy;
  - Para mañana;
  - Elegir fecha.
- Las tareas futuras no bloquean el día actual.
- Cuando llega la fecha objetivo, aparecen como tareas activas.
- Las tareas atrasadas quedan visibles como pendientes activas.

### Sync Sheets / Respaldos globales
- Se incorpora Apps Script v1.8.3 para respaldos globales.
- Se agregó botón **Diagnóstico Sheets**.
- Antes de subir respaldo, la app verifica que Apps Script pueda recibir una parte temporal.
- La subida por partes ahora muestra confirmación de partes recibidas por Sheets.
- Se agregan parámetros anti-caché a cada llamada JSONP.
- Se reduce el tamaño de cada parte para mejorar compatibilidad en navegador móvil.
- El mensaje de error ahora apunta al Apps Script v1.8.3 y a la necesidad de publicar una nueva versión.

## Nota
Para que la reparación de Sync Sheets funcione, hay que copiar el nuevo Apps Script v1.8.3, guardar y publicar una nueva versión de la implementación `/exec`.
