Emma OS v1.6.0 — Dale una oportunidad
Fecha: 2026-08-28
Implementación: OpenAI · ChatGPT (GPT-5.6 Sol)

NOVEDAD PRINCIPAL
- Nuevo módulo: apps/dale-una-oportunidad/
- Gym parte en 4/28.
- Los retos nuevos se crean en 1.
- La meta global empieza en 28 y puede subir con el botón “Cumplí años” o editarse manualmente.
- Los contadores siguen creciendo por encima de la meta.
- Los hitos muestran frases motivacionales/divertidas.
- Las metas anteriores completadas se conservan al cambiar la regla.

INTEGRACIÓN EMMA OS
- El módulo aparece en Inicio y en el menú lateral.
- Clave localStorage: emmaos_dale_una_oportunidad_v1
- Centro de respaldos incluye el nuevo módulo.
- Sync Sheets incluye el nuevo módulo.
- Service Worker/PWA incluye el módulo para uso offline.

PUBLICAR EN GITHUB PAGES
Emma OS es estático: no hay que compilar con npm.
1. Antes de actualizar, exporta un respaldo global desde Emma OS v1.5.4 si tienes datos importantes.
2. Descomprime este ZIP.
3. Reemplaza en tu repositorio los archivos de Emma OS por TODO el contenido de esta carpeta, respetando las rutas.
4. Commit sugerido: “Emma OS v1.6.0 - Dale una oportunidad”.
5. Push a la rama que usa GitHub Pages.
6. Cuando GitHub Pages publique el commit, abre Emma OS y entra a “Dale una oportunidad”.
7. Verifica que aparezca Gym en 4/28 y que +1 cambie a 5/28.
8. Crea un reto de prueba y confirma que nace en 1/28.
9. Prueba Respaldos y Sync Sheets para confirmar que listan 5 módulos con datos posibles.
10. Si la PWA instalada muestra una versión antigua, ciérrala y vuelve a abrirla; el nuevo Service Worker usa un cache distinto para v1.6.0.

APPS SCRIPT
La lógica de Apps Script ya era genérica por moduleId. La copia incluida se renombró a v1.6.0 y mantiene compatibilidad con el nuevo módulo. Si tu Sync Sheets v1.5.4 ya funciona, Emma OS seguirá enviando el nuevo módulo como parte del respaldo global; puedes actualizar el script a la copia v1.6.0 para mantener las etiquetas/versiones alineadas.
