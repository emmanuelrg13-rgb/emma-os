# Arquitectura actual - Control Financiero Personal v1.0

## Vista general

```text
[Usuario / navegador]
        |
        v
[Index.html + Styles.html + App.html]
        |
        | google.script.run
        v
[Code.gs - Apps Script]
        |
        v
[Google Sheets]
  |- Config
  |- Items
  |- Pagos
  |- Logros
  `- Readme
```

## Capas actuales

### 1. Presentacion
`Index.html` define el shell, la cabecera, la navegacion inferior, el area principal y el modal.  
`Styles.html` contiene el tema azul/gris, reglas responsive y temas claro/oscuro.  
`App.html` contiene estado de interfaz, enrutamiento y renderizado de vistas.

Vistas principales:
- Este mes.
- Ruta completa.
- Items.
- Ajustes.
- Simulador.
- Logros.
- Historial.

### 2. Comunicacion
El cliente invoca funciones de Apps Script mediante `google.script.run`. No existe una API HTTP publica separada.

### 3. Dominio y servicios
`Code.gs` concentra:
- lectura/escritura de Sheets;
- validaciones;
- calculo de saldos;
- asignacion mensual;
- estrategias de pago;
- proyecciones;
- simulador;
- desbloqueo de inversiones;
- logros;
- concurrencia e idempotencia;
- manejo de fechas.

### 4. Persistencia
Google Sheets es la fuente de verdad. El saldo guardado en `Items` se mantiene sincronizado despues de mutaciones, pero al construir el estado la app tambien recalcula el saldo a partir de `montoTotal`, `pagadoPrevio` y pagos confirmados.

### 5. Preferencias locales
El tema visual se almacena localmente en el navegador. No pertenece al dominio financiero ni a Google Sheets.

## Restricciones tecnicas actuales
- El frontend depende de `google.script.run`, por lo que no puede trasladarse sin cambios a una PWA externa.
- El ID de la hoja esta acoplado en `Code.gs`.
- La logica de negocio y el acceso a datos viven en el mismo archivo.
- `Styles.html` contiene capas de overrides historicos; no conviene portarlo literalmente a Emma OS.

## Activos que si deben preservarse
- Modelo de datos.
- Reglas de negocio.
- Metodos de servicio.
- Algoritmo de proyeccion.
- Algoritmo de estrategias.
- Reglas de logros.
- Semantica de estados y trazabilidad.
- Correcciones de fechas y concurrencia.
