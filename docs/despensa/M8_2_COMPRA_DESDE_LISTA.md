# Emma OS v1.8.6 — M8.2 Compra desde lista

Esta versión convierte la lista de supermercado de Despensa en una lista accionable.

## Funciones nuevas

- Casilla de verificación por ítem comprado.
- Contador de envases comprados por producto.
- Botón **Guardar compra** para actualizar el stock local.
- Registro liviano `purchaseLog` dentro de `emma_os_despensa_v1`.
- Botón **Subir respaldo actualizado a Sheets** desde Despensa, reutilizando la configuración de Sync Sheets.
- Orden de lista con urgentes primero y normales después.

## Regla de stock

Al guardar compra:

```txt
stock agregado = envases comprados × packSize
stock nuevo = stock anterior + stock agregado
```

Los productos no marcados no modifican stock. Si la compra fue parcial, el faltante restante vuelve a aparecer al regenerar la lista.

## Alcance

No se toca la app original de despensa ni su Google Sheet histórica. La subida a Sheets corresponde al respaldo global de Emma OS.
