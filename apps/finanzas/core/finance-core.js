/* Emma OS v1.7.4 — Control Financiero Personal M1/M2/M3 lectura
   Archivo: finance-core.js
   Autoría: OpenAI/ChatGPT (GPT-5.5 Thinking) para Emmanuel Rojas.
   Propósito: portar el dominio financiero a funciones puras reutilizables.
   Límites M1: sin UI antigua, sin google.script.run, sin Google Sheets, sin escritura real.
*/

import { DEFAULT_SETTINGS, FINANCE_APP, ITEM_STATUSES, ITEM_TYPES, PAYMENT_STATUSES } from './finance-schema.js';
import { ACHIEVEMENT_DEFINITIONS } from './finance-achievements.js';
import { addMonthsText, captureGoal, cleanText, goalState, isValidIsoDate, normalizeDateText } from './finance-dates.js';
import { normalizeStrategy, sortCandidatesForStrategy } from './finance-strategies.js';

export { FINANCE_APP } from './finance-schema.js';
export { addMonthsText, isValidIsoDate, normalizeDateText } from './finance-dates.js';
export { ACHIEVEMENT_DEFINITIONS } from './finance-achievements.js';

export function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function roundMoney(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

export function normalizeType(value) {
  const raw = cleanText(value).toLowerCase();
  if (raw === 'deuda') return 'Deuda';
  if (raw === 'compra') return 'Compra';
  if (raw === 'inversion' || raw === 'inversión') return 'Inversión';
  return 'Deuda';
}

export function normalizeStatus(value) {
  const raw = cleanText(value).toLowerCase();
  if (raw === 'activo') return 'Activo';
  if (raw === 'pausado') return 'Pausado';
  if (raw === 'urgente') return 'Urgente';
  if (raw === 'pagado') return 'Pagado';
  if (raw === 'archivado') return 'Archivado';
  return 'Activo';
}

export function normalizePaymentStatus(value) {
  const raw = cleanText(value).toLowerCase();
  return raw === 'anulado' ? 'Anulado' : 'Confirmado';
}

export function normalizeSettings(payload = {}) {
  const settings = { ...DEFAULT_SETTINGS, ...payload };
  return {
    appName: 'Control Financiero Personal',
    monthlyMin: Number(settings.monthlyMin) || DEFAULT_SETTINGS.monthlyMin,
    monthlyMax: Number(settings.monthlyMax) || DEFAULT_SETTINGS.monthlyMax,
    monthlyCurrent: Number(settings.monthlyCurrent) || DEFAULT_SETTINGS.monthlyCurrent,
    startDate: normalizeDateText(settings.startDate || DEFAULT_SETTINGS.startDate),
    investmentUnlockDebtProgress: Number(settings.investmentUnlockDebtProgress) || DEFAULT_SETTINGS.investmentUnlockDebtProgress,
    strategy: normalizeStrategy(settings.strategy || DEFAULT_SETTINGS.strategy),
    currency: cleanText(settings.currency || DEFAULT_SETTINGS.currency),
    version: settings.version || DEFAULT_SETTINGS.version
  };
}

export function validateSettings(settings) {
  const normalized = normalizeSettings(settings);
  const errors = [];
  if (normalized.monthlyMin <= 0) errors.push('El aporte mínimo debe ser mayor a 0.');
  if (normalized.monthlyMax <= 0) errors.push('El aporte máximo debe ser mayor a 0.');
  if (normalized.monthlyCurrent <= 0) errors.push('El aporte mensual base debe ser mayor a 0.');
  if (normalized.monthlyMin > normalized.monthlyMax) errors.push('El aporte mínimo no puede ser mayor al aporte máximo.');
  if (!isValidIsoDate(normalized.startDate)) errors.push('La fecha base del plan no es válida.');
  if (!Number.isFinite(normalized.investmentUnlockDebtProgress) || normalized.investmentUnlockDebtProgress <= 0 || normalized.investmentUnlockDebtProgress > 1) {
    errors.push('El porcentaje de desbloqueo de inversiones debe estar entre 1% y 100%.');
  }
  return { ok: errors.length === 0, errors, value: normalized };
}

export function normalizeItem(item = {}) {
  return {
    id: Number(item.id) || 0,
    nombre: cleanText(item.nombre),
    tipo: normalizeType(item.tipo),
    montoTotal: Number(item.montoTotal) || 0,
    pagadoPrevio: Number(item.pagadoPrevio) || 0,
    saldoPendiente: Number(item.saldoPendiente) || 0,
    prioridad: Number(item.prioridad) || 999,
    estado: normalizeStatus(item.estado),
    notas: cleanText(item.notas),
    createdAt: normalizeDateText(item.createdAt),
    updatedAt: normalizeDateText(item.updatedAt),
    pagadoLog: Number(item.pagadoLog) || 0,
    pagadoTotal: Number(item.pagadoTotal) || 0,
    estadoCalculado: normalizeStatus(item.estadoCalculado || item.estado)
  };
}

export function normalizePayment(payment = {}) {
  return {
    pagoId: cleanText(payment.pagoId),
    fecha: normalizeDateText(payment.fecha),
    itemId: Number(payment.itemId) || 0,
    nombreItem: cleanText(payment.nombreItem || payment.nombre),
    tipo: normalizeType(payment.tipo),
    monto: Number(payment.monto) || 0,
    mesPlan: Number(payment.mesPlan) || 0,
    nota: cleanText(payment.nota),
    createdAt: cleanText(payment.createdAt),
    estado: normalizePaymentStatus(payment.estado)
  };
}

export function isConfirmedPayment(payment) {
  return normalizePaymentStatus(payment?.estado) !== 'Anulado';
}

export function hydrateItemsWithPayments(items = [], payments = []) {
  const normalizedItems = items.map(normalizeItem);
  const normalizedPayments = payments.map(normalizePayment);
  const paidByItem = new Map();

  normalizedPayments.forEach(payment => {
    if (!isConfirmedPayment(payment)) return;
    paidByItem.set(payment.itemId, roundMoney((paidByItem.get(payment.itemId) || 0) + (Number(payment.monto) || 0)));
  });

  return normalizedItems.map(item => {
    const log = paidByItem.get(item.id) || 0;
    const pagadoTotal = roundMoney((item.pagadoPrevio || 0) + log);
    const saldoPendiente = Math.max(0, roundMoney((item.montoTotal || 0) - pagadoTotal));
    return {
      ...item,
      pagadoLog: log,
      pagadoTotal,
      saldoPendiente,
      estadoCalculado: saldoPendiente <= 0 && item.estado === 'Activo' ? 'Pagado' : item.estado
    };
  });
}

export function baseTotal() {
  return { original: 0, paid: 0, pending: 0, progress: 0 };
}

export function buildTotals(items = []) {
  const totals = { Deuda: baseTotal(), Compra: baseTotal(), Inversion: baseTotal(), General: baseTotal() };

  items.map(normalizeItem).forEach(item => {
    if (item.estado === 'Archivado') return;
    const key = item.tipo === 'Inversión' ? 'Inversion' : item.tipo;
    if (!totals[key]) return;

    const original = Number(item.montoTotal) || 0;
    const paid = Math.min(original, Number(item.pagadoTotal) || 0);
    const pending = Math.max(0, original - paid);

    totals[key].original += original;
    totals[key].paid += paid;
    totals[key].pending += pending;
    totals.General.original += original;
    totals.General.paid += paid;
    totals.General.pending += pending;
  });

  Object.keys(totals).forEach(key => {
    totals[key].original = roundMoney(totals[key].original);
    totals[key].paid = roundMoney(totals[key].paid);
    totals[key].pending = roundMoney(totals[key].pending);
    totals[key].progress = totals[key].original > 0 ? totals[key].paid / totals[key].original : 1;
  });

  return totals;
}

export function calcTypeProgressFromItems(items = [], typeName) {
  let original = 0;
  let pending = 0;
  items.map(normalizeItem).forEach(item => {
    if (item.estado === 'Archivado') return;
    if (item.tipo !== typeName) return;
    original += Number(item.montoTotal) || 0;
    pending += Number(item.saldoPendiente) || 0;
  });
  return original > 0 ? (original - pending) / original : 1;
}

export function calcTypePendingFromItems(items = [], typeName) {
  return items.map(normalizeItem).reduce((sum, item) => {
    if (item.estado === 'Archivado') return sum;
    if (item.tipo !== typeName) return sum;
    return sum + (Number(item.saldoPendiente) || 0);
  }, 0);
}

export function getTotalPending(items = []) {
  return items.map(normalizeItem).reduce((sum, item) => item.estado === 'Archivado' ? sum : sum + (Number(item.saldoPendiente) || 0), 0);
}

export function buildInvestmentGate(totals, settings = {}) {
  const normalizedSettings = normalizeSettings(settings);
  const debt = totals?.Deuda || baseTotal();
  const target = Number(normalizedSettings.investmentUnlockDebtProgress) || 0.75;
  const current = Number(debt.progress) || 0;
  const targetPaid = roundMoney((Number(debt.original) || 0) * target);
  const remainingToUnlock = Math.max(0, roundMoney(targetPaid - (Number(debt.paid) || 0)));
  const unlocked = (Number(debt.original) || 0) <= 0 || current >= target || (Number(debt.pending) || 0) <= 0;
  return {
    targetProgress: target,
    debtProgress: current,
    progressToTarget: target > 0 ? Math.min(1, current / target) : 1,
    unlocked,
    remainingToUnlock: unlocked ? 0 : remainingToUnlock,
    targetPaid,
    debtPaid: Number(debt.paid) || 0,
    debtOriginal: Number(debt.original) || 0
  };
}

export function getNextEligibleItem(items = [], settings = {}) {
  const normalizedSettings = normalizeSettings(settings);
  const hydrated = items.map(normalizeItem);
  const debtProgress = calcTypeProgressFromItems(hydrated, 'Deuda');
  const debtPending = calcTypePendingFromItems(hydrated, 'Deuda');
  const unlock = Number(normalizedSettings.investmentUnlockDebtProgress || 0.75);
  const investmentUnlocked = debtProgress >= unlock || debtPending <= 0;

  const candidates = hydrated.filter(item => {
    const status = normalizeStatus(item.estado);
    if (status !== 'Activo' && status !== 'Urgente') return false;
    if ((Number(item.saldoPendiente) || 0) <= 0) return false;
    if (item.tipo === 'Inversión' && !investmentUnlocked) return false;
    return true;
  });

  const sorted = sortCandidatesForStrategy(candidates, normalizedSettings.strategy);
  return sorted.length ? sorted[0] : null;
}

export function allocateMonth(simItems = [], budget = 0, settings = {}) {
  let remainingBudget = Number(budget) || 0;
  const working = simItems;
  const payments = [];
  let guard = 0;

  while (remainingBudget > 0 && guard < 300) {
    guard++;
    const nextItem = getNextEligibleItem(working, settings);
    if (!nextItem) break;

    const index = working.findIndex(item => Number(item.id) === Number(nextItem.id));
    if (index < 0) break;

    const amount = Math.min(remainingBudget, Number(working[index].saldoPendiente) || 0);
    if (amount <= 0) break;

    working[index].saldoPendiente = roundMoney(working[index].saldoPendiente - amount);
    working[index].pagadoTotal = roundMoney((working[index].pagadoTotal || 0) + amount);
    remainingBudget = roundMoney(remainingBudget - amount);

    payments.push({ itemId: working[index].id, nombre: working[index].nombre, tipo: working[index].tipo, monto: amount });
  }

  return payments;
}

export function buildMonthPlan(items = [], monthlyAmount = 0, monthNumber = 1, settings = {}) {
  const normalizedSettings = normalizeSettings(settings);
  const simItems = clone(items).map(normalizeItem);
  const payments = allocateMonth(simItems, Number(monthlyAmount) || 0, normalizedSettings);
  return {
    monthNumber: Number(monthNumber) || 1,
    monthlyAmount: Number(monthlyAmount) || 0,
    total: roundMoney(payments.reduce((sum, payment) => sum + payment.monto, 0)),
    payments
  };
}

export function buildProjection(items = [], settings = {}) {
  const normalizedSettings = normalizeSettings(settings);
  const simItems = clone(items).map(normalizeItem);
  const monthlyAmount = Number(normalizedSettings.monthlyCurrent) || 0;
  const maxMonths = 480;
  const months = [];
  const initialTotals = buildTotals(simItems);
  const unlockTarget = Number(normalizedSettings.investmentUnlockDebtProgress) || 0.75;

  const goals = {
    investmentsUnlocked: goalState('Inversiones desbloqueadas', initialTotals.Deuda.progress >= unlockTarget || initialTotals.Deuda.pending <= 0, 0, normalizedSettings.startDate),
    debtFree: goalState('Libre de deudas', initialTotals.Deuda.pending <= 0, 0, normalizedSettings.startDate),
    purchasesComplete: goalState('Compras completas', initialTotals.Compra.pending <= 0, 0, normalizedSettings.startDate),
    planComplete: goalState('Plan completo', initialTotals.General.pending <= 0, 0, normalizedSettings.startDate)
  };

  if (monthlyAmount <= 0) {
    return { months: [], totalMonths: 0, finishDate: '', routeComplete: false, blockedPending: initialTotals.General.pending, goals, message: 'Define un aporte mensual mayor a 0.' };
  }

  let stoppedByUnavailableItems = false;
  for (let m = 1; m <= maxMonths; m++) {
    const payments = allocateMonth(simItems, monthlyAmount, normalizedSettings);
    const total = roundMoney(payments.reduce((sum, payment) => sum + payment.monto, 0));

    if (total <= 0) {
      stoppedByUnavailableItems = getTotalPending(simItems) > 0;
      break;
    }

    const monthDate = addMonthsText(normalizedSettings.startDate, m - 1);
    const monthTotals = buildTotals(simItems);

    captureGoal(goals.investmentsUnlocked, monthTotals.Deuda.progress >= unlockTarget || monthTotals.Deuda.pending <= 0, m, monthDate);
    captureGoal(goals.debtFree, monthTotals.Deuda.pending <= 0, m, monthDate);
    captureGoal(goals.purchasesComplete, monthTotals.Compra.pending <= 0, m, monthDate);
    captureGoal(goals.planComplete, monthTotals.General.pending <= 0, m, monthDate);

    months.push({
      monthNumber: m,
      date: monthDate,
      payments,
      total,
      remainingAfterMonth: monthTotals.General.pending,
      debtPendingAfterMonth: monthTotals.Deuda.pending,
      purchasePendingAfterMonth: monthTotals.Compra.pending,
      investmentPendingAfterMonth: monthTotals.Inversion.pending
    });

    if (monthTotals.General.pending <= 0) break;
  }

  const remaining = roundMoney(getTotalPending(simItems));
  const routeComplete = remaining <= 0;
  const hitLimit = months.length >= maxMonths && !routeComplete;
  let message = '';
  if (hitLimit) message = `La proyección superó el límite de ${maxMonths} meses.`;
  else if (stoppedByUnavailableItems) message = 'La ruta se detuvo porque quedan saldos en ítems Pausados o fuera de la ruta activa.';

  return {
    months,
    totalMonths: months.length,
    finishDate: routeComplete && months.length ? months[months.length - 1].date : '',
    routeComplete,
    blockedPending: routeComplete ? 0 : remaining,
    goals,
    message
  };
}

export function buildScenarios(items = [], settings = {}) {
  const normalizedSettings = normalizeSettings(settings);
  const minSettings = { ...normalizedSettings, monthlyCurrent: Number(normalizedSettings.monthlyMin) || 0 };
  const maxSettings = { ...normalizedSettings, monthlyCurrent: Number(normalizedSettings.monthlyMax) || 0 };
  return {
    min: scenarioFromProjection(minSettings.monthlyCurrent, buildProjection(items, minSettings)),
    max: scenarioFromProjection(maxSettings.monthlyCurrent, buildProjection(items, maxSettings))
  };
}

export function buildDebtMilestones(debtProgress = 0, settings = {}) {
  const normalizedSettings = normalizeSettings(settings);
  const progress = Math.max(0, Math.min(1, Number(debtProgress) || 0));
  const thresholds = [0.10, 0.25, 0.50, Number(normalizedSettings.investmentUnlockDebtProgress) || 0.75, 1.00];
  const seen = new Set();
  const milestones = [];

  thresholds.forEach(value => {
    const rounded = Math.round(value * 100);
    if (seen.has(rounded)) return;
    seen.add(rounded);
    milestones.push({ percent: rounded, reached: progress + 0.0000001 >= value });
  });

  const next = milestones.find(item => !item.reached) || null;
  return { currentPercent: Math.round(progress * 100), points: milestones, nextPercent: next ? next.percent : null };
}

export function computeAchievements(items = [], payments = [], totals = null, settings = {}, existingUnlocks = {}) {
  const normalizedSettings = normalizeSettings(settings);
  const normalizedPayments = payments.map(normalizePayment);
  const hydratedItems = items.map(normalizeItem);
  const sourceTotals = totals || buildTotals(hydratedItems);
  const confirmed = normalizedPayments.filter(isConfirmedPayment);
  const distinctMonths = {};
  const monthlyTotals = {};

  confirmed.forEach(payment => {
    const dateText = normalizeDateText(payment.fecha);
    const monthKey = dateText && dateText.length >= 7 ? dateText.substring(0, 7) : '';
    if (!monthKey) return;
    distinctMonths[monthKey] = true;
    monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + (Number(payment.monto) || 0);
  });

  const baseMonthly = Number(normalizedSettings.monthlyCurrent) || 0;
  const monthValues = Object.values(monthlyTotals);
  const debtProgress = Number(sourceTotals?.Deuda?.progress) || 0;
  const unlockTarget = Number(normalizedSettings.investmentUnlockDebtProgress) || 0.75;
  const debtOriginal = Number(sourceTotals?.Deuda?.original) || 0;
  const debtPending = Number(sourceTotals?.Deuda?.pending) || 0;

  const anyCompleted = hydratedItems.some(item => item.estado !== 'Archivado' && (item.tipo === 'Deuda' || item.tipo === 'Compra') && Number(item.montoTotal) > 0 && Number(item.saldoPendiente) <= 0);
  const purchaseCompleted = hydratedItems.some(item => item.estado !== 'Archivado' && item.tipo === 'Compra' && Number(item.montoTotal) > 0 && Number(item.saldoPendiente) <= 0);
  const investmentPaid = hydratedItems.some(item => item.estado !== 'Archivado' && item.tipo === 'Inversión' && Number(item.pagadoTotal || 0) > 0);

  const conditions = {
    primer_golpe: confirmed.length >= 1,
    piedra_pequena: anyCompleted,
    no_era_fase: Object.keys(distinctMonths).length >= 3,
    jefe_barra_vida: debtProgress >= 0.25,
    mitad_dragon: debtProgress >= 0.50,
    puerta_se_abre: debtProgress >= unlockTarget || (debtOriginal > 0 && debtPending <= 0),
    deuda_derrotada: debtOriginal > 0 && debtPending <= 0,
    compra_sin_culpa: purchaseCompleted,
    modo_resistencia: baseMonthly > 0 && monthValues.some(total => total > 0 && total < baseMonthly),
    mes_no_te_gano: baseMonthly > 0 && monthValues.some(total => total >= baseMonthly),
    contraataque: baseMonthly > 0 && monthValues.some(total => total >= baseMonthly * 1.5),
    otro_lado: investmentPaid
  };

  return ACHIEVEMENT_DEFINITIONS.map(def => {
    const existing = existingUnlocks[def.id] || existingUnlocks[def.achievementId];
    return {
      id: def.id,
      achievementId: def.id,
      icon: def.icon,
      nombre: def.nombre,
      condicion: def.condicion,
      leyenda: def.leyenda,
      unlocked: !!existing || !!conditions[def.id],
      unlockedAt: existing ? String(existing.unlockedAt || existing) : ''
    };
  });
}

export function validateItemForSave(payload = {}, existingConfirmedPaid = 0) {
  const item = normalizeItem(payload);
  const errors = [];
  if (!item.nombre) errors.push('Debes ingresar un nombre.');
  if (item.montoTotal <= 0) errors.push('El monto total debe ser mayor a 0.');
  if (item.pagadoPrevio < 0) errors.push('El pagado previo no puede ser negativo.');
  if (item.prioridad <= 0) errors.push('La prioridad debe ser mayor a 0.');
  if (!ITEM_TYPES.includes(item.tipo)) errors.push('Tipo de ítem inválido.');
  if (!ITEM_STATUSES.includes(item.estado)) errors.push('Estado de ítem inválido.');

  const confirmedLog = roundMoney(existingConfirmedPaid);
  const totalAlreadyPaid = roundMoney(item.pagadoPrevio + confirmedLog);
  if (item.pagadoPrevio > item.montoTotal) errors.push('El pagado previo no puede superar el monto total.');
  if (confirmedLog > item.montoTotal) errors.push('El nuevo monto total es menor que los pagos confirmados del historial.');
  if (totalAlreadyPaid > item.montoTotal) errors.push('Pagado previo + historial confirmado superan el monto total del ítem.');

  const currentBalance = Math.max(0, roundMoney(item.montoTotal - totalAlreadyPaid));
  if (item.estado === 'Pagado' && currentBalance > 0) errors.push('No puedes marcar un ítem como Pagado mientras conserve saldo pendiente.');

  return { ok: errors.length === 0, errors, item: { ...item, saldoPendiente: currentBalance, estado: currentBalance <= 0 ? 'Pagado' : item.estado } };
}

export function validatePaymentBatch({ payments = [], fecha = '', requestId = '' } = {}, items = [], settings = {}) {
  const normalizedSettings = normalizeSettings(settings);
  const normalizedItems = items.map(normalizeItem);
  const selected = payments.map(payment => ({ ...payment, itemId: Number(payment.itemId), monto: Number(payment.monto) || 0 }));
  const errors = [];

  if (!selected.length) errors.push('No seleccionaste pagos para registrar.');
  const date = normalizeDateText(fecha);
  if (date && !isValidIsoDate(date)) errors.push('La fecha del pago no es válida.');

  const totals = buildTotals(normalizedItems);
  const investmentGate = buildInvestmentGate(totals, normalizedSettings);
  const itemMap = new Map(normalizedItems.map(item => [Number(item.id), item]));
  const totalsByItemInBatch = new Map();

  selected.forEach(payment => {
    if (!payment.itemId) errors.push('Uno de los pagos no tiene ítem válido.');
    if (payment.monto <= 0) errors.push('Uno de los montos no es válido.');
    totalsByItemInBatch.set(payment.itemId, roundMoney((totalsByItemInBatch.get(payment.itemId) || 0) + payment.monto));
  });

  totalsByItemInBatch.forEach((amount, itemId) => {
    const item = itemMap.get(itemId);
    if (!item) { errors.push('No encontré uno de los ítems seleccionados.'); return; }
    const status = normalizeStatus(item.estado);
    if (status === 'Archivado') errors.push('No puedes registrar pagos en un ítem archivado.');
    if (status === 'Pagado' || Number(item.saldoPendiente) <= 0) errors.push(`El ítem "${item.nombre}" ya no tiene saldo pendiente.`);
    if (item.tipo === 'Inversión' && !investmentGate.unlocked) errors.push(`Las inversiones aún están bloqueadas. Debes alcanzar el ${Math.round(investmentGate.targetProgress * 100)}% de avance en deudas antes de registrar aportes de inversión.`);
    if (amount > Number(item.saldoPendiente || 0)) errors.push(`El pago para "${item.nombre}" supera su saldo pendiente.`);
  });

  return { ok: errors.length === 0, errors, requestId: cleanText(requestId), date: date || null };
}

export function previewMonthlyAmount(amount, items = [], settings = {}) {
  const monthlyAmount = Number(amount) || 0;
  if (monthlyAmount <= 0) throw new Error('El aporte temporal debe ser mayor a 0.');
  return { ok: true, amount: monthlyAmount, currentPlan: buildMonthPlan(items, monthlyAmount, 1, settings) };
}

export function simulateAmount(amount, items = [], settings = {}) {
  const monthlyAmount = Number(amount) || 0;
  if (monthlyAmount <= 0) throw new Error('El monto a simular debe ser mayor a 0.');
  const normalizedSettings = normalizeSettings(settings);
  const baseProjection = buildProjection(items, normalizedSettings);
  const simulatedSettings = { ...normalizedSettings, monthlyCurrent: monthlyAmount };
  const simulatedProjection = buildProjection(items, simulatedSettings);
  return {
    ok: true,
    amount: monthlyAmount,
    baseAmount: Number(normalizedSettings.monthlyCurrent) || 0,
    baseMonths: Number(baseProjection.totalMonths) || 0,
    baseFinishDate: baseProjection.finishDate || '',
    simulatedMonths: Number(simulatedProjection.totalMonths) || 0,
    simulatedFinishDate: simulatedProjection.finishDate || '',
    deltaMonths: projectionDeltaMonths(simulatedProjection, baseProjection),
    debtDeltaMonths: goalDeltaMonths(simulatedProjection.goals.debtFree, baseProjection.goals.debtFree),
    baseGoals: baseProjection.goals,
    simulatedGoals: simulatedProjection.goals,
    routeComplete: simulatedProjection.routeComplete,
    blockedPending: simulatedProjection.blockedPending,
    firstMonths: simulatedProjection.months.slice(0, 6),
    message: simulatedProjection.message || ''
  };
}

export function buildAppState({ settings = {}, items = [], payments = [], achievementUnlocks = {} } = {}) {
  const normalizedSettings = normalizeSettings(settings);
  const normalizedPayments = payments.map(normalizePayment);
  const hydratedItems = hydrateItemsWithPayments(items, normalizedPayments);
  const totals = buildTotals(hydratedItems);
  const currentPlan = buildMonthPlan(hydratedItems, normalizedSettings.monthlyCurrent, 1, normalizedSettings);
  const projection = buildProjection(hydratedItems, normalizedSettings);
  const scenarios = buildScenarios(hydratedItems, normalizedSettings);
  const investmentGate = buildInvestmentGate(totals, normalizedSettings);
  const milestones = buildDebtMilestones(totals.Deuda.progress, normalizedSettings);
  const achievements = computeAchievements(hydratedItems, normalizedPayments, totals, normalizedSettings, achievementUnlocks);

  return {
    ok: true,
    settings: normalizedSettings,
    items: hydratedItems,
    payments: normalizedPayments,
    totals,
    currentPlan,
    projection,
    scenarios,
    investmentGate,
    milestones,
    achievements,
    achievementSummary: { unlocked: achievements.filter(x => x.unlocked).length, total: achievements.length },
    version: FINANCE_APP.sourceSnapshot,
    migrationVersion: FINANCE_APP.emmaMigrationVersion
  };
}

export function exportData({ settings = {}, items = [], payments = [], achievements = [] } = {}) {
  return {
    module: FINANCE_APP.module,
    schemaVersion: FINANCE_APP.schemaVersion,
    exportedAt: new Date().toISOString(),
    settings: normalizeSettings(settings),
    items: items.map(normalizeItem),
    payments: payments.map(normalizePayment),
    achievements: achievements.map(item => ({ ...item, achievementId: item.achievementId || item.id }))
  };
}

export function validateImportData(payload = {}) {
  const errors = [];
  if (payload.module !== FINANCE_APP.module) errors.push('El módulo del respaldo no corresponde a control-financiero.');
  if (payload.schemaVersion !== FINANCE_APP.schemaVersion) errors.push('Versión de esquema incompatible.');

  const seenItems = new Set();
  const itemIds = new Set();
  (payload.items || []).forEach(item => {
    const id = Number(item.id);
    if (!id) errors.push('Existe un ítem sin ID válido.');
    if (seenItems.has(id)) errors.push(`ID de ítem duplicado: ${id}.`);
    seenItems.add(id); itemIds.add(id);
    if ((Number(item.montoTotal) || 0) < 0 || (Number(item.pagadoPrevio) || 0) < 0) errors.push(`Montos negativos en ítem ${id}.`);
    if (!ITEM_STATUSES.includes(normalizeStatus(item.estado))) errors.push(`Estado inválido en ítem ${id}.`);
  });

  const seenPayments = new Set();
  (payload.payments || []).forEach(payment => {
    const pagoId = cleanText(payment.pagoId);
    if (!pagoId) errors.push('Existe un pago sin UUID/pagoId.');
    if (seenPayments.has(pagoId)) errors.push(`pagoId duplicado: ${pagoId}.`);
    seenPayments.add(pagoId);
    if (!itemIds.has(Number(payment.itemId))) errors.push(`Pago ${pagoId} referencia itemId inexistente.`);
    if ((Number(payment.monto) || 0) < 0) errors.push(`Monto negativo en pago ${pagoId}.`);
    if (!PAYMENT_STATUSES.includes(normalizePaymentStatus(payment.estado))) errors.push(`Estado inválido en pago ${pagoId}.`);
  });

  return { ok: errors.length === 0, errors };
}

function projectionDeltaMonths(candidate, base) {
  if (candidate.routeComplete && base.routeComplete) return Number(candidate.totalMonths || 0) - Number(base.totalMonths || 0);
  return null;
}

function goalDeltaMonths(candidateGoal, baseGoal) {
  if (!candidateGoal || !baseGoal || !candidateGoal.reached || !baseGoal.reached) return null;
  return Number(candidateGoal.month || 0) - Number(baseGoal.month || 0);
}

function scenarioFromProjection(amount, projection) {
  return {
    amount: Number(amount) || 0,
    months: projection.totalMonths,
    finishDate: projection.finishDate,
    routeComplete: projection.routeComplete,
    blockedPending: projection.blockedPending,
    goals: clone(projection.goals)
  };
}
