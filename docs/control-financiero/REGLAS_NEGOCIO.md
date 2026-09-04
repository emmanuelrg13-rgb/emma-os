# Reglas de negocio - contrato que Emma OS debe conservar

## Items y saldos
1. Los items Archivados se excluyen de totales y proyeccion.
2. `montoTotal` nunca puede ser menor que `pagadoPrevio + pagos confirmados`.
3. Un item no puede guardarse como Pagado mientras conserve saldo.
4. Si una anulacion devuelve saldo a un item Pagado, vuelve a Activo salvo que este Archivado.
5. Pausado conserva su saldo, pero queda fuera de la ruta automatica.
6. Si existen saldos fuera de la ruta, la proyeccion debe quedar incompleta y sin fecha final ficticia.

## Pagos
1. No se aceptan montos <= 0.
2. El lote no puede superar el saldo de ningun item.
3. No se paga un item Archivado o ya Pagado.
4. Los pagos se registran como Confirmado.
5. La anulacion cambia el estado a Anulado y conserva el registro.
6. Los lotes deben ser idempotentes para evitar doble toque/doble solicitud.
7. Las mutaciones concurrentes deben serializarse o resolverse de forma transaccional.

## Inversiones
1. Permanecen bloqueadas mientras el avance de deuda sea menor al umbral configurado.
2. Se desbloquean si `debtProgress >= investmentUnlockDebtProgress` o si ya no queda deuda pendiente.
3. El bloqueo se aplica tanto en interfaz como en backend.

## Estrategias
- `prioridad_manual`: prioridad numerica; desempate por monto e ID.
- `menor_monto_primero`: menor saldo pendiente; luego prioridad.
- `deudas_primero`: Deuda -> Compra -> Inversion; luego prioridad.
- `urgentes_primero`: estado Urgente antes que otros; luego prioridad normal.

Solo Activo y Urgente participan en la asignacion automatica.

## Proyeccion
- Presupuesto mensual fijo para cada simulacion.
- Horizonte de seguridad: 480 meses.
- Debe conservar correctamente dias 29, 30 y 31 al avanzar meses.
- Hitos independientes: inversiones desbloqueadas, libre de deudas, compras completas, plan completo.
- No se calculan intereses ni cargos futuros.

## Logros
Preservar los IDs, no solo los textos:
`primer_golpe`, `piedra_pequena`, `no_era_fase`, `jefe_barra_vida`, `mitad_dragon`, `puerta_se_abre`, `deuda_derrotada`, `compra_sin_culpa`, `modo_resistencia`, `mes_no_te_gano`, `contraataque`, `otro_lado`.

## Zona horaria
Todas las fechas financieras y de auditoria deben interpretarse en `America/Santiago`.
