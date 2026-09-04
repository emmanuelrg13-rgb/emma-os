# Checklist de validación — M3 escritura controlada

- [ ] Emma OS abre como v1.7.3.
- [ ] Finanzas muestra M3 escritura controlada.
- [ ] Pruebas M1 pasan.
- [ ] Pruebas M2 pasan.
- [ ] Pruebas M3 pasan en memoria local.
- [ ] Leer estado desde Sheets funciona.
- [ ] Escritura aparece bloqueada por defecto.
- [ ] Botones de escritura exigen activar modo escritura.
- [ ] Pago manual registra un pago Confirmado y conserva UUID.
- [ ] Registrar lote sugerido no duplica pago si se repite el requestId.
- [ ] Anular pago cambia estado a Anulado y no borra fila.
- [ ] Editar ítem no permite montoTotal menor que pagadoPrevio + pagos confirmados.
- [ ] Archivar ítem no lo borra y lo excluye de totales.
- [ ] Guardar ajustes conserva estrategia válida y umbral de inversiones.
- [ ] Después de cada escritura se recarga estado desde Sheets.
- [ ] Web App estable antigua sigue funcionando como fallback.
