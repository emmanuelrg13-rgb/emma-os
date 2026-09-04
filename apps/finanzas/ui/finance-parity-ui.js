/* Emma OS v1.8.0 — Control Financiero Personal M4 paridad
   Archivo: finance-parity-ui.js
   Autoría: OpenAI/ChatGPT (GPT-5.5 Thinking) para Emmanuel Rojas.
   Propósito: generar un reporte de paridad entre el estado fuente de Apps Script v10.1-auditoria
   y el FinanceCore nativo de Emma OS, sin escribir en Google Sheets.
*/

import { money, escapeHtml, formatDate } from './finance-readonly-ui.js';

const TZ = 'America/Santiago';
const MONEY_EPSILON = 0.5;
const SECTION_LABELS = {
  metadata: 'Base y metadatos',
  totals: 'Totales y saldos',
  items: 'Ítems',
  payments: 'Pagos e historial',
  route: 'Ruta y estrategias',
  projection: 'Proyecciones e hitos',
  investments: 'Gate de inversiones',
  achievements: 'Logros',
  dates: 'Fechas críticas',
  backup: 'Exportación y respaldo'
};

function n(value){
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}
function cents(value){ return Math.round(n(value) * 100); }
function sameMoney(a,b){ return Math.abs(n(a) - n(b)) <= MONEY_EPSILON; }
function sameText(a,b){ return String(a ?? '') === String(b ?? ''); }
function pct(value){ return `${Math.round(n(value) * 100)}%`; }
function compact(value){
  if (value === undefined || value === null || value === '') return '—';
  if (typeof value === 'number') return Number.isInteger(value) ? String(value) : String(Math.round(value * 100) / 100);
  return String(value);
}
function totalOriginal(obj){ return obj?.total ?? obj?.original ?? 0; }
function planTotal(obj){ return obj?.total ?? obj?.usedAmount ?? obj?.totalPaid ?? obj?.paid ?? 0; }
function typeTotalBag(totals, type){
  if (type === 'Inversión') return totals?.Inversion || totals?.['Inversión'] || {};
  return totals?.[type] || {};
}
function byId(list, key='id'){
  const map = new Map();
  (list || []).forEach(item => {
    const id = String(item?.[key] ?? '').trim();
    if (id) map.set(id, item);
  });
  return map;
}
function duplicateIds(list, key){
  const seen = new Set();
  const dup = [];
  (list || []).forEach(item => {
    const id = String(item?.[key] ?? '').trim();
    if (!id) return;
    if (seen.has(id)) dup.push(id); else seen.add(id);
  });
  return dup;
}
function signaturePayment(payment){
  return [payment?.itemId, Math.round(n(payment?.monto)), payment?.tipo, payment?.nombre || payment?.nombreItem].map(v => String(v ?? '')).join('|');
}
function signatureMonth(month){
  return [month?.month, month?.date, Math.round(n(month?.paid)), Math.round(n(month?.remaining)), (month?.payments || []).map(signaturePayment).join('~')].join('::');
}
function normalizeAchievements(list){
  return (list || []).map(item => ({
    id: String(item.achievementId || item.id || '').trim(),
    unlocked: !!item.unlocked,
    unlockedAt: String(item.unlockedAt || '').trim(),
    nombre: item.nombre || item.name || ''
  })).filter(item => item.id);
}
function add(checks, section, id, label, ok, source, core, severity='must', note=''){
  checks.push({ section, id, label, ok: !!ok, source, core, severity, note });
}
function compareMoneyCheck(checks, section, id, label, source, core, severity='must'){
  add(checks, section, id, label, sameMoney(source, core), Math.round(n(source)), Math.round(n(core)), severity);
}
function compareTextCheck(checks, section, id, label, source, core, severity='must'){
  add(checks, section, id, label, sameText(source, core), compact(source), compact(core), severity);
}

export function buildParityReport(normalized = {}){
  const source = normalized.sourceState || {};
  const core = normalized.coreState || {};
  const checks = [];
  const sourceItems = source.items || [];
  const coreItems = core.items || [];
  const sourcePayments = source.payments || [];
  const corePayments = core.payments || [];
  const sourceItemsById = byId(sourceItems, 'id');
  const coreItemsById = byId(coreItems, 'id');
  const sourcePaymentIds = duplicateIds(sourcePayments, 'pagoId');
  const corePaymentIds = duplicateIds(corePayments, 'pagoId');

  add(checks, 'metadata', 'source-ok', 'Estado fuente responde OK', source.ok !== false, source.ok !== false, true);
  const sourceSnapshot = String(source.version || source.sourceSnapshot || '10.1-auditoria').replace(/^v/i, '');
  compareTextCheck(checks, 'metadata', 'snapshot', 'Snapshot funcional conservado', sourceSnapshot, '10.1-auditoria');
  compareTextCheck(checks, 'metadata', 'timezone', 'Zona horaria financiera', source.timezone || TZ, TZ);
  add(checks, 'metadata', 'sheet-read', 'Lectura proviene del repositorio financiero', !!normalized.repository?.kind, normalized.repository?.kind || '—', 'google-sheets-apps-script/memory', 'must');

  add(checks, 'items', 'item-count', 'Cantidad de ítems coincide', sourceItems.length === coreItems.length, sourceItems.length, coreItems.length);
  add(checks, 'payments', 'payment-count', 'Cantidad de pagos coincide', sourcePayments.length === corePayments.length, sourcePayments.length, corePayments.length);
  add(checks, 'achievements', 'achievement-count', 'Cantidad de logros coincide', (source.achievements || []).length === (core.achievements || []).length, (source.achievements || []).length, (core.achievements || []).length, 'review');
  add(checks, 'items', 'no-duplicate-item-ids', 'IDs de ítems sin duplicados', duplicateIds(sourceItems, 'id').length === 0 && duplicateIds(coreItems, 'id').length === 0, duplicateIds(sourceItems, 'id').join(', ') || 'sin duplicados', duplicateIds(coreItems, 'id').join(', ') || 'sin duplicados');
  add(checks, 'payments', 'no-duplicate-payment-ids', 'UUIDs de pagos sin duplicados', sourcePaymentIds.length === 0 && corePaymentIds.length === 0, sourcePaymentIds.join(', ') || 'sin duplicados', corePaymentIds.join(', ') || 'sin duplicados');

  ['General','Deuda','Compra','Inversión'].forEach(type => {
    const sid = type.toLowerCase().replace('ó','o');
    const sBag = typeTotalBag(source.totals, type);
    const cBag = typeTotalBag(core.totals, type);
    compareMoneyCheck(checks, 'totals', `total-${sid}`, `${type}: monto total coincide`, totalOriginal(sBag), totalOriginal(cBag));
    compareMoneyCheck(checks, 'totals', `paid-${sid}`, `${type}: pagado coincide`, sBag.paid, cBag.paid);
    compareMoneyCheck(checks, 'totals', `pending-${sid}`, `${type}: saldo pendiente coincide`, sBag.pending, cBag.pending);
    add(checks, 'totals', `progress-${sid}`, `${type}: avance coincide`, Math.abs(n(sBag.progress)-n(cBag.progress)) < 0.0001, pct(sBag.progress), pct(cBag.progress), 'review');
  });

  sourceItemsById.forEach((sItem, id) => {
    const cItem = coreItemsById.get(id);
    add(checks, 'items', `item-${id}-exists`, `Ítem #${id} existe en Core`, !!cItem, sItem?.nombre || id, cItem?.nombre || 'faltante');
    if (!cItem) return;
    compareTextCheck(checks, 'items', `item-${id}-name`, `Ítem #${id}: nombre conserva`, sItem.nombre, cItem.nombre, 'review');
    compareTextCheck(checks, 'items', `item-${id}-type`, `Ítem #${id}: tipo conserva`, sItem.tipo, cItem.tipo);
    compareTextCheck(checks, 'items', `item-${id}-status`, `Ítem #${id}: estado conserva`, sItem.estado, cItem.estado);
    compareMoneyCheck(checks, 'items', `item-${id}-balance`, `Ítem #${id}: saldo pendiente coincide`, sItem.saldoPendiente, cItem.saldoPendiente);
  });

  const sourceAnulados = sourcePayments.filter(p => p.estado === 'Anulado').length;
  const coreAnulados = corePayments.filter(p => p.estado === 'Anulado').length;
  add(checks, 'payments', 'voided-preserved', 'Pagos anulados se conservan', sourceAnulados === coreAnulados, sourceAnulados, coreAnulados);
  compareMoneyCheck(checks, 'payments', 'confirmed-sum', 'Suma de pagos confirmados coincide', sourcePayments.filter(p => p.estado !== 'Anulado').reduce((a,p)=>a+n(p.monto),0), corePayments.filter(p => p.estado !== 'Anulado').reduce((a,p)=>a+n(p.monto),0));

  compareMoneyCheck(checks, 'route', 'current-plan-total', 'Plan del mes: total asignado coincide', planTotal(source.currentPlan), planTotal(core.currentPlan), 'review');
  const sourceFirst = source.currentPlan?.payments?.[0] || null;
  const coreFirst = core.currentPlan?.payments?.[0] || null;
  add(checks, 'route', 'first-payment', 'Primera asignación coincide', String(sourceFirst?.itemId || '') === String(coreFirst?.itemId || ''), sourceFirst?.itemId || '—', coreFirst?.itemId || '—');
  add(checks, 'route', 'route-signature', 'Ruta sugerida del mes coincide', JSON.stringify((source.currentPlan?.payments || []).map(signaturePayment)) === JSON.stringify((core.currentPlan?.payments || []).map(signaturePayment)), (source.currentPlan?.payments || []).map(signaturePayment).join('\n') || 'sin ruta', (core.currentPlan?.payments || []).map(signaturePayment).join('\n') || 'sin ruta', 'review');

  compareTextCheck(checks, 'projection', 'projection-months', 'Proyección: meses totales coinciden', source.projection?.totalMonths, core.projection?.totalMonths);
  compareTextCheck(checks, 'projection', 'projection-finish', 'Proyección: fecha final coincide', source.projection?.finishDate, core.projection?.finishDate);
  compareTextCheck(checks, 'projection', 'projection-complete', 'Proyección: ruta completa coincide', source.projection?.routeComplete, core.projection?.routeComplete, 'review');
  add(checks, 'projection', 'first-six-months', 'Primeros 6 meses de ruta coinciden', JSON.stringify((source.projection?.months || []).slice(0,6).map(signatureMonth)) === JSON.stringify((core.projection?.months || []).slice(0,6).map(signatureMonth)), (source.projection?.months || []).slice(0,6).map(signatureMonth).join('\n') || 'sin meses', (core.projection?.months || []).slice(0,6).map(signatureMonth).join('\n') || 'sin meses', 'review');
  ['investmentsUnlocked','debtFree','purchasesComplete','planComplete'].forEach(goal => {
    compareTextCheck(checks, 'projection', `goal-${goal}-reached`, `Hito ${goal}: estado coincide`, source.projection?.goals?.[goal]?.reached, core.projection?.goals?.[goal]?.reached, 'review');
    compareTextCheck(checks, 'projection', `goal-${goal}-date`, `Hito ${goal}: fecha coincide`, source.projection?.goals?.[goal]?.date, core.projection?.goals?.[goal]?.date, 'review');
  });

  compareTextCheck(checks, 'investments', 'gate-unlocked', 'Gate inversiones: estado coincide', source.investmentGate?.unlocked, core.investmentGate?.unlocked);
  compareMoneyCheck(checks, 'investments', 'gate-missing', 'Gate inversiones: monto faltante coincide', source.investmentGate?.missingAmount, core.investmentGate?.missingAmount, 'review');
  const pausedInRoute = (core.currentPlan?.payments || []).some(p => {
    const item = coreItemsById.get(String(p.itemId));
    return item?.estado === 'Pausado';
  });
  add(checks, 'route', 'paused-out-route', 'Ítems pausados salen de ruta automática', !pausedInRoute, pausedInRoute ? 'hay pausados en ruta' : 'sin pausados en ruta', 'sin pausados en ruta');

  const sAchievements = byId(normalizeAchievements(source.achievements), 'id');
  const cAchievements = byId(normalizeAchievements(core.achievements), 'id');
  sAchievements.forEach((s, id) => {
    const c = cAchievements.get(id);
    add(checks, 'achievements', `achievement-${id}-exists`, `Logro ${id}: existe`, !!c, s.nombre || id, c?.nombre || 'faltante', 'review');
    if (!c) return;
    compareTextCheck(checks, 'achievements', `achievement-${id}-unlocked`, `Logro ${id}: desbloqueo coincide`, s.unlocked, c.unlocked, 'review');
    if (s.unlocked || c.unlocked) compareTextCheck(checks, 'achievements', `achievement-${id}-unlockedAt`, `Logro ${id}: unlockedAt conserva`, s.unlockedAt, c.unlockedAt, 'must');
  });

  const exportShapeOk = !!core.settings && Array.isArray(core.items) && Array.isArray(core.payments) && Array.isArray(core.achievements);
  add(checks, 'backup', 'export-shape', 'Datos financieros exportables en paquete autocontenido', exportShapeOk, 'settings/items/payments/achievements', exportShapeOk ? 'ok' : 'incompleto', 'review');
  add(checks, 'dates', 'no-utc-warning', 'Revisión manual: fechas deben verse como America/Santiago', (source.timezone || TZ) === TZ, source.timezone || TZ, TZ, 'review', 'Validar visualmente casos 29/30/31 en pruebas M1.');

  const must = checks.filter(c => c.severity === 'must');
  const review = checks.filter(c => c.severity !== 'must');
  return {
    module: 'control-financiero',
    schemaVersion: 'finance-parity-report-v1',
    emmaVersion: 'v1.8.0',
    phase: 'M4 Paridad',
    generatedAt: new Date().toISOString(),
    repository: normalized.repository || {},
    sourceSnapshot: String(source.version || source.sourceSnapshot || '10.1-auditoria').replace(/^v/i, ''),
    summary: {
      total: checks.length,
      passed: checks.filter(c => c.ok).length,
      failed: checks.filter(c => !c.ok).length,
      mustTotal: must.length,
      mustPassed: must.filter(c => c.ok).length,
      reviewTotal: review.length,
      reviewPassed: review.filter(c => c.ok).length,
      status: must.every(c => c.ok) ? (review.every(c => c.ok) ? 'aprobado' : 'aprobado-con-observaciones') : 'bloqueado'
    },
    checks
  };
}

function groupChecks(checks){
  return checks.reduce((acc, check) => {
    (acc[check.section] ||= []).push(check);
    return acc;
  }, {});
}

export function renderParityReport(target, report){
  if (!target) return;
  if (!report) {
    target.innerHTML = '<article class="finance-empty">Genera el reporte M4 después de leer estado desde Sheets.</article>';
    return;
  }
  const statusClass = report.summary.status === 'bloqueado' ? 'err' : (report.summary.status === 'aprobado' ? 'ok' : 'warn');
  const groups = groupChecks(report.checks || []);
  target.innerHTML = `
    <section class="panel ${statusClass === 'ok' ? '' : 'warnPanel'}" style="box-shadow:none">
      <div class="finance-section-head">
        <div>
          <h2>Reporte M4 de paridad</h2>
          <p>Compara el estado fuente devuelto por Apps Script v10.1-auditoria contra el FinanceCore nativo de Emma OS. No escribe datos.</p>
        </div>
        <div class="finance-big-number"><small>Estado</small><strong>${escapeHtml(report.summary.status)}</strong></div>
      </div>
      <div class="finance-kpi-grid compact">
        <div class="finance-kpi ${statusClass}"><span>Checks aprobados</span><strong>${report.summary.passed}/${report.summary.total}</strong></div>
        <div class="finance-kpi ${report.summary.mustPassed===report.summary.mustTotal?'good':'warn'}"><span>No negociables</span><strong>${report.summary.mustPassed}/${report.summary.mustTotal}</strong></div>
        <div class="finance-kpi"><span>Revisión</span><strong>${report.summary.reviewPassed}/${report.summary.reviewTotal}</strong></div>
        <div class="finance-kpi"><span>Snapshot</span><strong>${escapeHtml(report.sourceSnapshot)}</strong></div>
      </div>
      <p class="finance-note compact">Generado: ${formatDate(report.generatedAt)} · Repositorio: ${escapeHtml(report.repository?.kind || '—')}</p>
    </section>
    ${Object.entries(groups).map(([section, checks]) => `
      <section class="panel" style="box-shadow:none">
        <h3>${escapeHtml(SECTION_LABELS[section] || section)}</h3>
        <div class="list">
          ${checks.map(check => `<article class="row ${check.ok?'ok':'err'}">
            <strong>${check.ok?'✓':'✕'} ${escapeHtml(check.label)}</strong>
            <small>Fuente: ${escapeHtml(compact(check.source))} · Core: ${escapeHtml(compact(check.core))}${check.severity==='must'?' · no negociable':' · revisión'}</small>
            ${check.note ? `<small>${escapeHtml(check.note)}</small>` : ''}
          </article>`).join('')}
        </div>
      </section>`).join('')}
  `;
}

export function downloadParityReport(report){
  if (!report) throw new Error('No hay reporte M4 generado.');
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  a.href = url;
  a.download = `emma_os_finanzas_m4_paridad_${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function renderParityChecklist(target){
  if (!target) return;
  const items = [
    'Leer estado desde Google Sheets.',
    'Generar reporte M4.',
    'Verificar no negociables en verde.',
    'Comparar visualmente con la Web App estable v1.0.',
    'Exportar JSON del reporte M4.',
    'Guardar captura + JSON como evidencia antes del corte M5.'
  ];
  target.innerHTML = `<div class="list">${items.map((text, i) => `<div class="row"><strong>${i+1}. ${escapeHtml(text)}</strong></div>`).join('')}</div>`;
}
