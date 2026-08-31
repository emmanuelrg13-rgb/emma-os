# Emma OS v1.6.1 — Estabilización post v1.6.0

**Fecha:** 2026-08-29  
**Implementación:** OpenAI · ChatGPT (GPT-5.5 Thinking)

## Objetivo

Esta versión no agrega módulos nuevos. Su función es estabilizar la base oficial **v1.6.0** después de la integración de **Dale una oportunidad**.

## Cambios principales

- Versión visible actualizada a **v1.6.1** en Inicio, módulos, Respaldos, Sync Sheets, manifest y shell lateral.
- Service Worker actualizado a `emma-os-v1-6-1-cache-001`.
- Estrategia de caché ajustada a **network-first** para que GitHub Pages y la app instalada tomen antes los cambios nuevos, reduciendo el problema de quedarse pegado en una versión vieja.
- El uso offline se mantiene: si no hay conexión, Emma OS cae al contenido guardado en caché.
- Archivo de Apps Script alineado a v1.6.1 para mantener etiquetas/versiones consistentes.
- Documentación de actualización renovada desde la base v1.6.0.

## Módulos integrados

- Pendientes diarios
- Arrowverso
- Rutina atómica
- Dale una oportunidad
- Botiquín
- Centro de respaldos
- Sync Sheets

## Claves de datos preservadas

No se cambian claves de `localStorage`, por lo que los datos existentes se conservan:

- `emmaos_pendientes_v1`
- `emmaos_arrowverse_v1`
- `emmaos_rutina_atomica_v1`
- `emmaos_dale_una_oportunidad_v1`
- `emmaos_botiquin_v1`
- `emmaos_sheets_sync_config_v1`

