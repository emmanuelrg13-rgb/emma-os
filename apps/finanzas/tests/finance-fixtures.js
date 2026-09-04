/* Emma OS v1.7.2 — Control Financiero Personal M1/M2/M3 lectura
   Fixtures locales. No representan la base real del usuario. */

export const settings = {
  monthlyMin: 50000,
  monthlyMax: 150000,
  monthlyCurrent: 100000,
  startDate: '2026-01-31',
  investmentUnlockDebtProgress: 0.75,
  strategy: 'prioridad_manual',
  currency: 'CLP'
};

export const items = [
  { id: 1, nombre: 'Deuda pequeña', tipo: 'Deuda', montoTotal: 100000, pagadoPrevio: 10000, saldoPendiente: 90000, prioridad: 2, estado: 'Activo', notas: '' },
  { id: 2, nombre: 'Deuda urgente', tipo: 'Deuda', montoTotal: 300000, pagadoPrevio: 0, saldoPendiente: 300000, prioridad: 1, estado: 'Urgente', notas: '' },
  { id: 3, nombre: 'Compra pausada', tipo: 'Compra', montoTotal: 50000, pagadoPrevio: 0, saldoPendiente: 50000, prioridad: 3, estado: 'Pausado', notas: '' },
  { id: 4, nombre: 'Compra archivada', tipo: 'Compra', montoTotal: 999999, pagadoPrevio: 0, saldoPendiente: 999999, prioridad: 4, estado: 'Archivado', notas: '' },
  { id: 5, nombre: 'Inversión bloqueada', tipo: 'Inversión', montoTotal: 200000, pagadoPrevio: 0, saldoPendiente: 200000, prioridad: 5, estado: 'Activo', notas: '' }
];

export const payments = [
  { pagoId: 'pay-001', fecha: '2026-01-10', itemId: 1, nombreItem: 'Deuda pequeña', tipo: 'Deuda', monto: 20000, mesPlan: 1, nota: '', createdAt: '2026-01-10 10:00:00', estado: 'Confirmado' },
  { pagoId: 'pay-002', fecha: '2026-01-11', itemId: 1, nombreItem: 'Deuda pequeña', tipo: 'Deuda', monto: 50000, mesPlan: 1, nota: 'Anulado para probar historial', createdAt: '2026-01-11 10:00:00', estado: 'Anulado' }
];
