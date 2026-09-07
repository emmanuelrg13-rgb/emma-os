# Handoff — Migración de Despensa a Emma OS

Fecha de handoff: 2026-09-05  
Destino: Emma OS, módulo nativo simplificado  
Módulo sugerido: `Despensa` o `Inventario doméstico`

## 0. Contexto rápido de lo que se construyó

Se construyó una app llamada **Despensa / Inventario y compras**, primero como PWA/Google Apps Script conectada a Google Sheets y luego empaquetada como APK WebView funcional para Android.

Último estado validado en julio de 2026:

- Apps Script estable: **MVP 1.7 — Auditoría pre-APK**.
- Hoja base: `Inventario_Domestico_Inteligente_v1`.
- Backend: Google Apps Script leyendo/escribiendo en Google Sheets.
- APK WebView instalada y funcional en el teléfono.
- Auditoría pre-APK llegó a `errors: []` y luego a `warnings: []` tras definir supermercado preferido para el aceite.

Hitos que sí quedaron funcionando:

1. Inventario de productos.
2. Stock por lotes.
3. Movimientos de entrada/salida.
4. Lista de compras.
5. Añadir productos.
6. Registrar stock.
7. Compra manual.
8. Presupuesto semanal.
9. Compra real.
10. Simulaciones reversibles.
11. Historial de compras.
12. Vencimientos.
13. Análisis inteligente.
14. Filtro por supermercado.
15. Cancelación segura en formularios.
16. Auditoría pre-APK.
17. APK WebView funcional.

Para Emma OS se quiere migrar **sólo el núcleo doméstico simple**, no toda la app.

## 1. Resumen funcional de la app actual

La app actual administra un inventario doméstico con productos, stock, faltantes y lista de compras. Su versión completa permite planificar una semana, generar necesidades de rutina, estimar presupuesto, registrar compras reales, simular compras reversibles, controlar vencimientos, analizar gasto y auditar la estructura antes de empaquetar APK.

Flujo completo actual:

1. El usuario mantiene un catálogo de productos.
2. Cada producto tiene unidad base, unidad de compra, contenido por envase, stock mínimo, stock ideal, precio referencial y supermercado preferido.
3. El stock se guarda como lotes, no sólo como número plano.
4. Los movimientos registran entradas, compras, reposiciones, consumos y ajustes.
5. La app calcula faltantes comparando stock disponible contra objetivo de stock.
6. La lista de compras se genera con envases necesarios, cantidad resultante y subtotal estimado.
7. Las compras reales actualizan stock, lotes, movimientos y estado de la lista.
8. Las simulaciones imitan compras, pero pueden revertirse si no hubo consumo posterior.
9. La auditoría revisa integridad entre productos, lotes, movimientos, compras y detalles.

Para Emma OS, el flujo recomendado debe ser más simple:

1. Ver inventario actual.
2. Añadir, editar y eliminar productos.
3. Validar faltantes.
4. Generar lista de supermercado.
5. Guardar todo dentro del sistema de estado/respaldo de Emma OS.

## 2. Estructura de datos actual

La app actual usa este modelo principal en JavaScript:

```js
{
  metadata: {},
  settings: {},
  products: [],
  lots: [],
  movements: [],
  needs: [],
  shoppingList: [],
  purchases: [],
  purchaseDetails: []
}
```

### `products`

Catálogo de productos. Es la colección central para la migración.

Campos actuales:

- `id`
- `name`
- `category`
- `subcategory`
- `brandPreferred`
- `baseUnit`
- `purchaseUnit`
- `packSize`
- `replenishment`
- `minStock`
- `idealStock`
- `reserveStock`
- `referencePrice`
- `preferredSupermarket`
- `controlsExpiry`
- `expiryAlertDays`
- `barcode`
- `imageUrl`
- `locationId`
- `notes`
- `active`

En Google Sheets corresponde a la pestaña `Productos`.

### `lots`

Stock separado por lote. Útil para vencimientos y trazabilidad, pero para Emma OS simplificado puede compactarse a `currentStock` dentro de cada producto.

Campos actuales:

- `id`
- `productId`
- `locationId`
- `quantity`
- `status`
- `createdAt`
- `updatedAt`
- `expiryDate`
- `purchaseDetailId`
- `notes`

En Google Sheets corresponde a `Stock_Lotes`.

### `movements`

Historial de cambios de stock. Para Emma OS simplificado puede descartarse o reducirse a un log liviano opcional.

Campos actuales:

- `id`
- `productId`
- `lotId`
- `type`
- `quantity`
- `direction`
- `baseUnit`
- `stockBefore`
- `stockAfter`
- `origin`
- `reason`
- `notes`
- `createdAt`

En Google Sheets corresponde a `Movimientos`.

### `shoppingList`

Lista de supermercado generada o manual. Para Emma OS sí conviene conservar una versión simplificada.

Campos actuales:

- `id`
- `cycle`
- `productId`
- `stockAvailable`
- `routineNeed`
- `targetStock`
- `missingBase`
- `packages`
- `resultQuantity`
- `unitPrice`
- `subtotal`
- `reason`
- `manualOrigin`
- `priority`
- `status`
- `generatedAt`
- `purchasedAt`

En Google Sheets corresponde a `Lista_Compras`.

### `needs`

Necesidades por planificación semanal. No migrar a Emma OS simplificado.

### `purchases` y `purchaseDetails`

Compras registradas, simulaciones y detalle por compra. No migrar al primer módulo simplificado de Emma OS, salvo que más adelante se quiera registrar compras reales.

### `settings`

Configuración general. Para Emma OS sólo conservar listas simples:

- categorías;
- unidades base;
- unidades de compra;
- supermercados;
- prioridades opcionales.

## 3. Claves de `localStorage` usadas

La app actual usa estas claves:

```txt
despensa_mvp_v2
despensa_target_cycle
despensa_apk_checklist_v1
```

### `despensa_mvp_v2`

Guarda el estado completo en modo vista previa/local. En Apps Script real, la fuente principal era Google Sheets, pero esta clave existe como fallback local.

### `despensa_target_cycle`

Guarda el ciclo de compra seleccionado, por ejemplo `2026-W28`.

### `despensa_apk_checklist_v1`

Guarda el checklist manual de auditoría pre-APK.

Para Emma OS se recomienda no reutilizar estas claves directamente. Mejor usar una clave propia y versionada, por ejemplo:

```txt
emma_os_despensa_v1
```

O integrarlo dentro del estado global de Emma OS:

```js
state.modules.despensa
```

## 4. Ejemplo de JSON real del inventario

El archivo `INVENTARIO_EJEMPLO_REAL.json` incluido en este paquete contiene un ejemplo parcial basado en productos reales de la hoja viva.

Ejemplo reducido:

```json
{
  "products": [
    {
      "id": "PRD-0004",
      "name": "Aceite",
      "category": "Alimentos",
      "baseUnit": "L",
      "purchaseUnit": "Unidad",
      "packSize": 1,
      "minStock": 2,
      "idealStock": 9,
      "reserveStock": 1,
      "referencePrice": 1890,
      "preferredSupermarket": "Unimarc",
      "currentStock": 5,
      "stockStatus": "Suficiente",
      "active": true
    },
    {
      "id": "PRD-0007",
      "name": "Trutro de pollo deshuesado",
      "category": "Alimentos",
      "subcategory": "Proteínas",
      "baseUnit": "kg",
      "purchaseUnit": "Bandeja",
      "packSize": 0.75,
      "minStock": 0.25,
      "idealStock": 0.75,
      "reserveStock": 0,
      "referencePrice": 4690,
      "preferredSupermarket": "Líder",
      "currentStock": 0,
      "stockStatus": "Agotado",
      "active": true
    }
  ]
}
```

## 5. Reglas importantes del inventario y faltantes

### Regla de stock disponible

En la app completa, el stock visible de un producto se obtiene sumando lotes disponibles del producto:

```js
stockDisponible = suma(lots.quantity donde lot.productId === product.id && lot.status === "Disponible")
```

En Emma OS simplificado se recomienda usar directamente:

```js
product.currentStock
```

### Regla de faltante

El faltante se calcula contra el stock objetivo:

```js
objetivo = idealStock
faltanteBase = max(0, objetivo - currentStock)
```

También puede considerarse la reserva:

```js
objetivo = idealStock + reserveStock
faltanteBase = max(0, objetivo - currentStock)
```

Recomendación para Emma OS: usar `idealStock` como objetivo principal y dejar `reserveStock` como opcional.

### Regla de envases a comprar

La compra se expresa en unidades de compra, no siempre en unidad base. Ejemplo: huevos se miden en `Unidad`, pero se compran por `Bandeja` de 30.

```js
envases = ceil(faltanteBase / packSize)
cantidadResultante = envases * packSize
subtotal = envases * referencePrice
```

### Regla de estado de stock

Estados simples recomendados:

```js
if currentStock <= 0 => "Agotado"
else if currentStock < minStock => "Bajo mínimo"
else => "Suficiente"
```

### Regla de lista de supermercado

Generar lista sólo con productos activos cuyo faltante sea mayor a 0:

```js
products
  .filter(product => product.active)
  .map(validar faltante)
  .filter(item => item.missingBase > 0)
```

Luego agrupar por supermercado preferido:

```js
listaPorSupermercado[product.preferredSupermarket || "Sin tienda"]
```

## 6. Campos mínimos que debería tener cada producto

Para Emma OS simplificado, cada producto debería tener como mínimo:

```ts
type DespensaProduct = {
  id: string;
  name: string;
  category: string;
  baseUnit: string;
  purchaseUnit: string;
  packSize: number;
  currentStock: number;
  minStock: number;
  idealStock: number;
  referencePrice: number;
  preferredSupermarket: string;
  active: boolean;
  notes?: string;
  updatedAt?: string;
};
```

Campos opcionales útiles:

```ts
subcategory?: string;
brandPreferred?: string;
reserveStock?: number;
location?: string;
imageUrl?: string;
barcode?: string;
controlsExpiry?: boolean;
expiryAlertDays?: number;
```

## 7. Qué funciones sí se deben conservar

Conservar la lógica, no necesariamente los nombres exactos:

### Estado y normalización

- `normalizeState(data)`
- carga/guardado de estado, adaptado al sistema de Emma OS
- generación de IDs tipo `PRD-0001`

### Inventario

- cálculo de stock por producto;
- estado de stock;
- tarjetas/listado de productos;
- agregar producto;
- editar producto;
- desactivar/eliminar producto;
- ajuste manual de stock.

Funciones relacionadas en el código actual:

- `productStock(productId)`
- `productStatus(product)`
- `renderInventory()`
- `renderDetail()`
- `openProductDialog()`
- `saveProduct()`
- `openStockDialog()`
- `saveStock()`

### Faltantes y lista de compras

- cálculo de faltantes;
- cálculo de envases necesarios;
- subtotal estimado;
- prioridad simple;
- generación de lista;
- filtro/agrupación por supermercado.

Funciones relacionadas actuales:

- `buildAutomaticShoppingItem()`
- `generateShoppingList()`
- `shoppingItemStore()`
- `storeMatchesFilter()`
- `shoppingStoreOptions()`
- `renderShopping()`

### Utilidades

- `uid(prefix, list)`
- formateo de moneda CLP;
- formateo de números;
- escape HTML;
- toast/mensajes de confirmación.

## 8. Qué funciones se deben descartar para Emma OS

Descartar del primer módulo simplificado:

### Planificación semanal de comidas/rutina

- `needs`
- `routineNeedForCycle()`
- `parseRoutineText()`
- `renderPlanning()`
- `savePlanningImport()`
- ciclos semanales `2026-Wxx`

### Presupuestos

- `weeklyBudget`
- `cycleBudget()`
- `saveBudget()`
- presupuesto sugerido
- margen recomendado

### Compras reales completas

- `purchases`
- `purchaseDetails`
- `savePurchase()`
- historial de compras
- medio de pago
- total real

### Simulaciones reversibles

- `isSimulation`
- `simulationDeletionCheck()`
- `deleteSimulation()`
- gasto simulado

### Análisis inteligente

- tendencias mensuales;
- comparación histórica de precios;
- supermercado históricamente más conveniente;
- consumo real por movimientos;
- alertas de aumento de precio.

### APK / auditoría pre-APK

- checklist pre-APK;
- exportación de auditoría;
- controles específicos de WebView.

### Vencimientos avanzados

Puede dejarse para una versión posterior. Para el primer módulo simplificado, no portar lotes ni vencimientos por lote.

## 9. Riesgos de migración

### Riesgo 1: sobredimensionar el módulo

La app original creció mucho. Portarla completa a Emma OS puede contaminar el sistema con presupuesto, compras, análisis y planificación que el usuario explícitamente no quiere migrar ahora.

Mitigación: crear un módulo simple con `products` y `shoppingList` solamente.

### Riesgo 2: perder equivalencias de compra

Algunos productos no se compran en la misma unidad en la que se consumen. Ejemplos:

- huevos: unidad base `Unidad`, compra `Bandeja`, packSize `30`;
- gelatina: unidad base `Porción`, compra `Sobre`, packSize `5`;
- plátano: unidad base `Unidad`, compra `Kilo`, packSize provisional `6`.

Mitigación: conservar siempre `baseUnit`, `purchaseUnit` y `packSize`.

### Riesgo 3: eliminar historial útil por accidente

Emma OS simplificado no necesita movimientos ni compras, pero el inventario actual sí tiene datos históricos. No migrar esos datos como lógica activa, pero conservar los archivos originales en este paquete.

### Riesgo 4: IDs duplicados

La app actual usa IDs tipo `PRD-0001`. Emma OS debe tener un generador propio que revise los productos existentes antes de crear uno nuevo.

### Riesgo 5: supermercados vacíos

La lista por supermercado depende de `preferredSupermarket`. Si falta, el producto debe caer en grupo `Sin tienda`, no romper el filtro.

### Riesgo 6: integración visual con Emma OS

La app original tiene UI propia. Copiarla tal cual puede chocar con Emma OS. Conviene reutilizar reglas y estructura, pero rediseñar los componentes con la estética global de Emma OS.

## 10. Recomendación para integrarlo como módulo nativo de Emma OS

### Arquitectura recomendada

Crear un módulo nuevo dentro de Emma OS:

```txt
/modules/despensa
```

Con estado:

```js
state.modules.despensa = {
  version: 1,
  products: [],
  shoppingList: [],
  settings: {
    categories: ["Alimentos", "Limpieza", "Higiene personal", "Botiquín", "Hogar", "Otros"],
    baseUnits: ["Unidad", "kg", "g", "L", "ml", "Porción", "Paquete"],
    purchaseUnits: ["Unidad", "Bandeja", "Bolsa", "Botella", "Caja", "Paquete", "Lata", "Frasco", "Kilo", "Malla", "Sobre"],
    supermarkets: ["Líder", "Unimarc", "Jumbo", "Santa Isabel", "Otro"]
  },
  updatedAt: ""
};
```

### Pantallas sugeridas

Sólo cuatro pantallas:

1. **Inventario**  
   Ver productos, stock actual y estado.

2. **Producto**  
   Crear/editar/eliminar o desactivar.

3. **Faltantes**  
   Validar qué falta según stock ideal.

4. **Lista supermercado**  
   Lista agrupada por tienda con cantidades y subtotal referencial.

### Flujo recomendado

```txt
Inventario → Validar faltantes → Generar lista → Comprar manualmente → Actualizar stock
```

No registrar compras formales todavía. Al volver del supermercado, el usuario actualiza stock manualmente.

### Modelo simplificado recomendado

```js
const despensaProduct = {
  id: "PRD-0001",
  name: "Aceite",
  category: "Alimentos",
  subcategory: "",
  baseUnit: "L",
  purchaseUnit: "Unidad",
  packSize: 1,
  currentStock: 5,
  minStock: 2,
  idealStock: 9,
  reserveStock: 1,
  referencePrice: 1890,
  preferredSupermarket: "Unimarc",
  active: true,
  notes: "",
  updatedAt: "2026-09-05T23:49:00.000Z"
};
```

### Pseudocódigo central

```js
function getStockStatus(product) {
  if (product.currentStock <= 0) return "Agotado";
  if (product.currentStock < product.minStock) return "Bajo mínimo";
  return "Suficiente";
}

function getMissing(product) {
  const target = Number(product.idealStock || 0);
  const current = Number(product.currentStock || 0);
  const missingBase = Math.max(0, target - current);
  const packSize = Math.max(1, Number(product.packSize || 1));
  const packages = Math.ceil(missingBase / packSize);
  const resultQuantity = packages * packSize;
  return {
    productId: product.id,
    name: product.name,
    missingBase,
    packages,
    resultQuantity,
    purchaseUnit: product.purchaseUnit,
    baseUnit: product.baseUnit,
    unitPrice: Number(product.referencePrice || 0),
    subtotal: packages * Number(product.referencePrice || 0),
    preferredSupermarket: product.preferredSupermarket || "Sin tienda"
  };
}

function generateShoppingList(products) {
  return products
    .filter(product => product.active !== false)
    .map(getMissing)
    .filter(item => item.missingBase > 0);
}
```

## 11. Archivos fuente relevantes incluidos

Este paquete incluye:

- `apps_script/latest_mvp_1_7/`: última versión estable extraída.
- `apps_script/version_history/`: paquetes zip de pasos anteriores.
- `apk/android_webview/`: proyectos APK WebView generados.
- `reportes/`: reportes de auditoría pre-APK.
- `referencias/`: capturas y reporte Gradle usados durante depuración.
- `emma_os_migration/INVENTARIO_EJEMPLO_REAL.json`: ejemplo parcial de inventario real.

## 12. Decisión final para Emma OS

Migrar sólo este núcleo:

```txt
Productos + stock simple + faltantes + lista de supermercado
```

No migrar todavía:

```txt
Compras reales + simulaciones + presupuesto + planificación + análisis + APK
```

La versión nativa de Emma OS debe sentirse como una sección interna del sistema, no como una app externa embebida.
