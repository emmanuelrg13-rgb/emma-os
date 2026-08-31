Emma OS v1.6.1 — Estabilización post v1.6.0
Fecha: 2026-08-29
Implementación: OpenAI · ChatGPT (GPT-5.5 Thinking)

OBJETIVO
- Esta versión parte desde Emma OS v1.6.0, publicada en GitHub Pages.
- No retrocede a v1.5.4.
- No agrega módulos nuevos.
- Estabiliza la integración de “Dale una oportunidad” y mejora la actualización de caché/PWA.

CAMBIOS
- Versión visible actualizada a v1.6.1.
- Módulo “Dale una oportunidad” se mantiene integrado en Inicio, menú lateral, Respaldos y Sync Sheets.
- Service Worker usa nueva caché: emma-os-v1-6-1-cache-001.
- La estrategia de carga pasa a network-first para recursos del mismo origen, con respaldo offline desde caché.
- Se conserva localStorage tal cual; no cambia ninguna clave de datos.

PUBLICAR EN GITHUB PAGES
1. Abre Emma OS v1.6.0 y exporta un respaldo global.
2. Descomprime este ZIP.
3. Sube TODO el contenido a la raíz del repositorio de GitHub Pages, reemplazando archivos existentes.
4. Commit sugerido: “Actualizar Emma OS a v1.6.1 estabilización”.
5. Abre la URL con ?v=1.6.1.
6. Revisa Inicio, menú lateral, Dale una oportunidad, Respaldos y Sync Sheets.
7. En el teléfono, si la app instalada no actualiza de inmediato, abre primero la URL en Chrome con ?v=1.6.1 y luego vuelve a la app instalada.

NOTA SOBRE DATOS
- Esta actualización no borra datos locales.
- Aun así, mantener un respaldo global antes de subir una versión nueva sigue siendo la regla segura.
