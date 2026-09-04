# Handoff listo para pegar en el chat de Emma OS

Quiero integrar como modulo nativo de Emma OS una app ya cerrada llamada **Control Financiero Personal v1.0**. Adjunto el documento de migracion y, si hace falta, el paquete maestro.

La version estable no debe redisenarse como una Web App embebida. El objetivo es **portar el dominio a la arquitectura nativa de Emma OS** conservando exactamente sus reglas de negocio y datos.

Puntos no negociables:
- La fuente funcional de referencia es el snapshot `v10.1-auditoria`, declarado release v1.0 estable despues de pasar prueba integral final.
- Base actual: Google Sheets con `Config`, `Items`, `Pagos`, `Logros`, `Readme`.
- Zona horaria: `America/Santiago`.
- Pagos: Confirmado/Anulado; nunca borrar historial.
- Saldos: `montoTotal - pagadoPrevio - pagosConfirmados`.
- Estados: Activo, Urgente, Pausado, Pagado, Archivado.
- Pausado sale de la ruta pero su saldo sigue existiendo; no inventar fecha de termino.
- Inversiones bloqueadas hasta el umbral de avance de deuda configurado (75% por defecto), con validacion tambien en backend/repositorio.
- Estrategias: prioridad_manual, menor_monto_primero, deudas_primero, urgentes_primero.
- Mantener IDs de items, UUIDs de pagos e IDs/unlockedAt de logros.
- Preservar proteccion contra doble pago e idempotencia.
- Las proyecciones no calculan intereses/comisiones futuras.
- No portar literalmente el CSS acumulado de la app antigua; reconstruir la UI con componentes nativos de Emma OS.

Arquitectura de migracion preferida:
`FinanceUI -> FinanceService -> FinanceCore -> FinanceRepository -> adaptadores de persistencia`.

Quiero hacerlo por etapas y mantener el Google Sheet actual como fuente de verdad inicialmente, para separar la migracion de interfaz de una futura migracion de almacenamiento. Antes de escribir codigo, revisa el documento adjunto y propón la ruta M0-M6, identificando que archivos/modulos de Emma OS debemos tocar y cuales no.
