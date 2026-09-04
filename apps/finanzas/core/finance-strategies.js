/* Emma OS v1.7.4 — Control Financiero Personal M1/M2/M3 lectura
   Archivo: finance-strategies.js
   Propósito: ordenar ítems elegibles sin tocar persistencia. */

import { STRATEGIES } from './finance-schema.js';

export function normalizeStrategy(value) {
  const raw = String(value == null ? '' : value).trim().toLowerCase();
  return STRATEGIES.includes(raw) ? raw : 'prioridad_manual';
}

export function typeRank(type) {
  if (type === 'Deuda') return 1;
  if (type === 'Compra') return 2;
  if (type === 'Inversión') return 3;
  return 9;
}

export function sortCandidatesForStrategy(candidates, strategy) {
  const selected = normalizeStrategy(strategy);
  return [...candidates].sort((a, b) => {
    const urgentA = a.estado === 'Urgente' ? 0 : 1;
    const urgentB = b.estado === 'Urgente' ? 0 : 1;

    if (selected === 'urgentes_primero' && urgentA !== urgentB) return urgentA - urgentB;

    if (selected === 'deudas_primero') {
      const typeA = typeRank(a.tipo);
      const typeB = typeRank(b.tipo);
      if (typeA !== typeB) return typeA - typeB;
    }

    if (selected === 'menor_monto_primero') {
      const sa = Number(a.saldoPendiente) || Number(a.montoTotal) || 0;
      const sb = Number(b.saldoPendiente) || Number(b.montoTotal) || 0;
      if (sa !== sb) return sa - sb;
    }

    const pa = Number(a.prioridad) || 999;
    const pb = Number(b.prioridad) || 999;
    if (pa !== pb) return pa - pb;

    const ma = Number(a.montoTotal) || 0;
    const mb = Number(b.montoTotal) || 0;
    if (ma !== mb) return ma - mb;

    return Number(a.id) - Number(b.id);
  });
}
