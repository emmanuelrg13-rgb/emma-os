# Documento de migracion - Control Financiero Personal -> Emma OS

## Objetivo
Convertir Control Financiero Personal en un **modulo nativo de Emma OS**, preservando datos y reglas ya validadas, pero reemplazando el frontend aislado de Apps Script por la navegacion, componentes y experiencia visual propias de Emma OS.

## Principio principal
**No migrar la app como un bloque HTML embebido. Migrar el dominio.**

La version Apps Script queda congelada como referencia funcional. Emma OS debe reutilizar las reglas y el modelo, no copiar ciegamente el CSS ni el shell historico.

## Arquitectura objetivo sugerida

```text
Emma OS
|
+-- Core / Router / UI compartida
|
+-- Modulos
|   `-- Control Financiero
|       |-- ui/
|       |-- finance-core.js
|       |-- finance-service.js
|       `-- finance-repository.js
|
`-- Datos
    |-- manifest.json
    `-- control-financiero/
        |-- configuracion
        |-- items
        |-- pagos
        `-- logros
```

La representacion fisica de `Datos` puede ser una carpeta de Drive, uno o mas Google Sheets, JSON sincronizado o una base mas estructurada. Lo importante es que el modulo acceda a ella a traves de un repositorio estable.

## Estrategia de base de datos recomendada
Para la primera migracion, **mantener el Google Sheet actual como fuente de verdad**. Tiene dos ventajas:
1. no requiere migrar datos durante el primer cambio de interfaz;
2. el archivo puede moverse mas adelante a una carpeta de bases de datos de Emma OS en Google Drive sin cambiar su ID.

A medio plazo, crear una carpeta conceptual como:

```text
Emma OS/
`-- Bases de datos/
    |-- Control Financiero Personal (Google Sheet actual)
    |-- Botiquin ...
    |-- Rutinas ...
    `-- otros modulos ...
```

No se recomienda un unico spreadsheet gigante para todas las apps. Un archivo por dominio reduce acoplamiento, facilita respaldos y permite migraciones independientes. Un `manifest` comun puede registrar nombre del modulo, version de esquema, ubicacion e identificador.

## Fases propuestas

### Fase M0 - Congelacion
- Mantener la Web App v1.0 como fallback.
- Guardar este paquete maestro.
- No agregar funcionalidades nuevas a la version aislada.

### Fase M1 - Extraer FinanceCore
Mover a JavaScript puro las funciones que no necesitan Sheets:
- `buildTotals_`;
- `buildMonthPlan_`;
- `buildProjection_`;
- `allocateMonth_`;
- `getNextEligibleItem_`;
- calculos de progreso;
- gate de inversiones;
- milestones;
- evaluacion de logros;
- fechas mensuales.

**Criterio de exito:** las mismas entradas producen los mismos resultados en Apps Script y Emma OS.

### Fase M2 - Crear FinanceRepository
Definir operaciones de datos independientes del proveedor:
- getSettings / saveSettings;
- getItems / saveItem / archiveItem;
- getPayments / registerPaymentBatch / voidPayment;
- getAchievements / persistAchievementUnlocks.

Primera implementacion: `GoogleSheetsFinanceRepository`.

### Fase M3 - Modulo nativo de UI
Crear las pantallas con componentes de Emma OS:
- Este mes;
- Ruta;
- Items;
- Simulador;
- Logros;
- Historial;
- Ajustes.

Mantener identidad azul/gris como rasgo del modulo si encaja con el sistema de temas, pero **no portar `Styles.html` literalmente**.

### Fase M4 - Compatibilidad y paridad
Ejecutar ambos sistemas en paralelo con la misma base. Comparar:
- totales;
- saldo por item;
- siguiente item de cada estrategia;
- proyecciones y fechas;
- hitos;
- bloqueo de inversiones;
- logros;
- historial/anulaciones.

### Fase M5 - Corte
Cuando la paridad sea completa:
- Emma OS pasa a ser interfaz principal;
- Web App queda en modo respaldo durante un periodo prudente;
- luego puede archivarse sin borrar la base.

### Fase M6 - Evolucion de almacenamiento
Solo despues de estabilizar el modulo nativo evaluar:
- cache offline con IndexedDB;
- sincronizacion de cambios;
- exportacion JSON;
- repositorio Drive comun;
- reemplazo de Apps Script por una API mas general.

## Riesgos a evitar
- Copiar los overrides acumulados de CSS de la app antigua.
- Cambiar UI y base de datos en la misma fase.
- Regenerar IDs de items, pagos o logros.
- Borrar pagos Anulados durante una "limpieza".
- Perder `unlockedAt` de logros.
- Tratar Pausado como saldo inexistente.
- Permitir inversiones antes del gate desde el backend.
- Usar fechas UTC para movimientos chilenos.
- Recalcular proyecciones con `Date.setMonth()` sin clamp de fin de mes.
- Añadir intereses implicitamente sin disponer de reglas por producto.

## Datos que deben conservarse sin transformacion destructiva
- IDs de Items.
- UUID de Pagos.
- estado Confirmado/Anulado.
- fechas financieras.
- `pagadoPrevio`.
- notas.
- prioridades y estados.
- claves de estrategia.
- IDs y `unlockedAt` de Logros.
- umbral de inversiones.

## Recomendacion sobre la integracion con el sistema de respaldos de Emma OS
El modulo deberia exponer dos operaciones genericas al nucleo:
- `exportData()` -> paquete serializable versionado;
- `importData(payload, mode)` -> restauracion validada.

Ejemplo conceptual:
```json
{
  "module": "control-financiero",
  "schemaVersion": "finance-schema-v1",
  "exportedAt": "2026-08-31T...-04:00",
  "settings": {},
  "items": [],
  "payments": [],
  "achievements": []
}
```

Esto permitiria que el Centro de respaldos de Emma OS trate Finanzas igual que otros modulos sin conocer sus tablas internas.

## Definicion de terminado para la migracion
La migracion se considera completa cuando:
1. todas las pantallas viven dentro de Emma OS;
2. los calculos coinciden con la v1.0 estable;
3. se puede leer y escribir la base sin la antigua UI;
4. pagos/anulaciones son seguros e idempotentes;
5. respaldos incluyen todos los datos del modulo;
6. la Web App puede archivarse sin perder ninguna capacidad critica.
