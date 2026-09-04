# Checklist de migracion a Emma OS

## Preparacion
- [ ] Paquete v1.0 guardado fuera del proyecto de desarrollo.
- [ ] Base actual respaldada.
- [ ] Version de esquema inicial definida.
- [ ] IDs existentes documentados como inmutables.

## FinanceCore
- [ ] Totales portados y testeados.
- [ ] Estrategias portadas y testeadas.
- [ ] Proyeccion portada y testeada.
- [ ] Fechas 29/30/31 testeadas.
- [ ] Gate de inversiones portado.
- [ ] Milestones portados.
- [ ] Reglas de logros portadas.

## Persistencia
- [ ] `FinanceRepository` definido.
- [ ] Adaptador a Google Sheets funcional.
- [ ] Escrituras atomicas o protegidas.
- [ ] Idempotencia de pagos preservada.
- [ ] Anulacion no destructiva preservada.
- [ ] `America/Santiago` preservado.

## UI nativa
- [ ] Este mes.
- [ ] Ruta completa.
- [ ] Items y edicion.
- [ ] Ajustes.
- [ ] Simulador.
- [ ] Logros.
- [ ] Historial y filtros.
- [ ] Tema integrado con Emma OS.

## Respaldo
- [ ] `exportData()`.
- [ ] `importData()`.
- [ ] Validacion de schemaVersion.
- [ ] Restauracion de pagos Anulados.
- [ ] Restauracion de unlockedAt de logros.

## Paridad
- [ ] Totales iguales entre v1.0 y Emma OS.
- [ ] Saldos por item iguales.
- [ ] Primera asignacion igual para las 4 estrategias.
- [ ] Hitos de proyeccion iguales.
- [ ] Simulador equivalente.
- [ ] Bloqueo de inversiones equivalente.
- [ ] Logros equivalentes.

## Cierre
- [ ] Emma OS usado como interfaz principal.
- [ ] Web App mantenida temporalmente como fallback.
- [ ] Periodo de observacion completado.
- [ ] Web App archivada, no borrada.
