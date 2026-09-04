# Modelo de datos

## Config
Formato clave/valor.

| Campo | Tipo | Funcion |
|---|---|---|
| clave | string | Identificador de configuracion |
| valor | string/number/date | Valor persistido |
| descripcion | string | Ayuda humana |

Claves esperadas: `appName`, `monthlyMin`, `monthlyMax`, `monthlyCurrent`, `startDate`, `investmentUnlockDebtProgress`, `strategy`, `currency`, `version`.

## Items

| Campo | Tipo | Regla |
|---|---|---|
| id | integer | Identificador unico |
| nombre | string | Requerido |
| tipo | enum | Deuda / Compra / Inversion |
| montoTotal | number | > 0 |
| pagadoPrevio | number | >= 0 |
| saldoPendiente | number | Derivado y persistido |
| prioridad | integer | > 0 |
| estado | enum | Activo / Urgente / Pausado / Pagado / Archivado |
| notas | string | Opcional |
| createdAt | date/datetime | Auditoria |
| updatedAt | date/datetime | Auditoria |

**Formula conceptual:**
`saldoPendiente = max(0, montoTotal - pagadoPrevio - pagosConfirmados)`

## Pagos

| Campo | Tipo | Regla |
|---|---|---|
| pagoId | UUID/string | Identificador inmutable |
| fecha | YYYY-MM-DD | Fecha financiera |
| itemId | integer | Referencia a Items |
| nombreItem | string | Snapshot del nombre |
| tipo | enum | Snapshot del tipo |
| monto | number | > 0 y <= saldo disponible |
| mesPlan | integer | Mes sugerido/origen |
| nota | string | Opcional / trazabilidad de anulacion |
| createdAt | datetime | Auditoria |
| estado | enum | Confirmado / Anulado |

**Regla clave:** un pago anulado no se borra y deja de sumar al saldo pagado.

## Logros

| Campo | Tipo | Funcion |
|---|---|---|
| achievementId | string | ID estable del logro |
| nombre | string | Nombre visible |
| condicion | string | Descripcion de la regla |
| leyenda | string | Texto narrativo |
| unlockedAt | datetime | Primera fecha de desbloqueo |
| createdAt | datetime | Auditoria |

Los logros son historicos: una vez persistidos, no deben "desbloquearse al reves" si luego cambia el plan.

## Readme
Hoja humana de dos columnas: `Seccion`, `Detalle`. No participa en calculos.

## Recomendacion para Emma OS
Agregar un campo/metadata `schemaVersion` al nuevo repositorio. La migracion inicial puede declararse como `finance-schema-v1` sin alterar los IDs existentes.
