/* Emma OS v1.8.1 — Control Financiero Personal M6 ajustes visuales web
   Archivo: finance-readonly-ui.js
   Autoría: OpenAI/ChatGPT (GPT-5.5 Thinking) para Emmanuel Rojas.
   Propósito: renderizar la UI nativa de lectura del dominio financiero dentro de Emma OS.
   Alcance M3: lectura nativa estable y escritura controlada desde una pestaña separada.
*/

export const TYPE_LABELS = Object.freeze({ Deuda: 'Deudas', Compra: 'Compras', 'Inversión': 'Inversiones' });
export const STRATEGY_LABELS = Object.freeze({
  prioridad_manual: 'Prioridad manual',
  menor_monto_primero: 'Menor monto primero',
  deudas_primero: 'Deudas primero',
  urgentes_primero: 'Urgentes primero'
});

export function money(value) {
  return '$' + Math.round(Number(value) || 0).toLocaleString('es-CL');
}

export function percent(value) {
  const num = Number(value) || 0;
  return Math.round(num * 100) + '%';
}

export function safeText(value, fallback = '—') {
  const text = String(value ?? '').trim();
  return text || fallback;
}

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
}

export function formatDate(value) {
  const text = String(value || '').trim();
  if (!text) return '—';
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
    const [y,m,d] = text.slice(0,10).split('-');
    return `${d}-${m}-${y}`;
  }
  return text;
}

export function statusClass(value) {
  const raw = String(value || '').toLowerCase();
  if (raw.includes('urgente')) return 'danger';
  if (raw.includes('pausado')) return 'pause';
  if (raw.includes('pagado')) return 'done';
  if (raw.includes('archivado')) return 'muted';
  return 'active';
}

export function typeClass(value) {
  const raw = String(value || '').toLowerCase();
  if (raw.includes('deuda')) return 'debt';
  if (raw.includes('compra')) return 'buy';
  if (raw.includes('invers')) return 'invest';
  return 'neutral';
}

export function bar(width, label = '') {
  const safe = Math.max(0, Math.min(100, Math.round(Number(width) || 0)));
  return `<div class="finance-bar" aria-label="${escapeHtml(label || safe + '%')}"><span style="width:${safe}%"></span></div>`;
}

export function renderKpi(target, cards = []) {
  target.innerHTML = cards.map(card => `
    <article class="finance-kpi ${card.tone || ''}">
      <small>${escapeHtml(card.label)}</small>
      <strong>${escapeHtml(card.value)}</strong>
      ${card.detail ? `<span>${escapeHtml(card.detail)}</span>` : ''}
      ${card.progress != null ? bar(card.progress, card.label) : ''}
    </article>`).join('');
}

export function buildKpis(state) {
  const totals = state.totals || {};
  const general = totals.General || {};
  const deuda = totals.Deuda || {};
  const compra = totals.Compra || {};
  const inversion = totals.Inversion || {};
  const gate = state.investmentGate || {};
  const plan = state.currentPlan || {};
  return [
    { label:'Saldo general pendiente', value: money(general.pending), detail:`${state.items?.length || 0} ítems · ${state.payments?.length || 0} pagos`, progress: (general.progress || 0) * 100 },
    { label:'Deudas pendientes', value: money(deuda.pending), detail:`avance ${percent(deuda.progress)}`, progress: (deuda.progress || 0) * 100 },
    { label:'Compras pendientes', value: money(compra.pending), detail:`avance ${percent(compra.progress)}`, progress: (compra.progress || 0) * 100 },
    { label:'Inversiones pendientes', value: money(inversion.pending), detail: gate.unlocked ? 'gate desbloqueado' : `faltan ${money(gate.remainingToUnlock)}`, progress: (inversion.progress || 0) * 100 },
    { label:'Aporte mensual base', value: money(state.settings?.monthlyCurrent), detail: STRATEGY_LABELS[state.settings?.strategy] || safeText(state.settings?.strategy) },
    { label:'Plan de este mes', value: money(plan.total), detail:`${plan.payments?.length || 0} asignaciones sugeridas` },
    { label:'Ruta estimada', value: state.projection?.routeComplete ? `${state.projection.totalMonths} meses` : 'Ruta bloqueada', detail: state.projection?.finishDate ? `cierre ${formatDate(state.projection.finishDate)}` : safeText(state.projection?.message, 'revisar pendientes pausados') },
    { label:'Logros', value:`${state.achievementSummary?.unlocked || 0}/${state.achievementSummary?.total || 0}`, detail:'con IDs/unlockedAt preservados' }
  ];
}

export function renderThisMonth(target, state) {
  const plan = state.currentPlan || { payments: [] };
  const payments = plan.payments || [];
  target.innerHTML = `
    <div class="finance-section-head">
      <div><h2>Este mes</h2><p>Asignación sugerida usando el aporte mensual base y la estrategia activa. Para registrar, usa la pestaña Escritura.</p></div>
      <div class="finance-big-number"><small>Total sugerido</small><strong>${money(plan.total)}</strong></div>
    </div>
    <div class="finance-route-list">
      ${payments.length ? payments.map((payment, index) => `
        <article class="finance-row">
          <div class="finance-row-main">
            <span class="finance-step">${index + 1}</span>
            <div><strong>${escapeHtml(payment.nombre)}</strong><small>${escapeHtml(payment.tipo)} - ítem #${escapeHtml(payment.itemId)}</small></div>
          </div>
          <div class="finance-amount">${money(payment.monto)}</div>
        </article>`).join('') : '<article class="finance-empty">No hay pagos sugeridos para este mes.</article>'}
    </div>
    <p class="finance-note">Las proyecciones usan saldos registrados actualmente y no calculan intereses, comisiones ni cargos futuros.</p>`;
}

export function renderRoute(target, state) {
  const projection = state.projection || { months: [] };
  const months = projection.months || [];
  const goals = projection.goals || {};
  const goalList = Object.values(goals);
  target.innerHTML = `
    <div class="finance-section-head">
      <div><h2>Ruta</h2><p>Primeros meses de la ruta calculada por FinanceCore. Ítems pausados salen de la ruta automática, pero su saldo sigue existiendo.</p></div>
      <div class="finance-big-number"><small>Resultado</small><strong>${projection.routeComplete ? formatDate(projection.finishDate) : 'Incompleta'}</strong></div>
    </div>
    <div class="finance-goals">
      ${goalList.map(goal => `<article class="finance-mini ${goal.reached ? 'ok' : 'warn'}"><strong>${escapeHtml(goal.name || goal.label)}</strong><small>${goal.reached ? `mes ${goal.month} · ${formatDate(goal.date)}` : 'pendiente'}</small></article>`).join('')}
    </div>
    <div class="finance-route-list">
      ${months.slice(0, 24).map(month => `
        <article class="finance-month">
          <div class="finance-month-head"><strong>Mes ${month.monthNumber} · ${formatDate(month.date)}</strong><span>${money(month.total)}</span></div>
          <div class="finance-month-payments">
            ${(month.payments || []).map(p => `<span>${escapeHtml(p.nombre)} · ${money(p.monto)}</span>`).join('') || '<span>Sin asignaciones</span>'}
          </div>
          <small>Saldo restante: ${money(month.remainingAfterMonth)}</small>
        </article>`).join('') || '<article class="finance-empty">No se pudo construir una ruta con los datos actuales.</article>'}
    </div>
    ${months.length > 24 ? `<p class="finance-note">Mostrando los primeros 24 meses de ${months.length}. La ruta completa sigue calculada en el núcleo.</p>` : ''}
    ${projection.message ? `<p class="finance-note warning">${escapeHtml(projection.message)}</p>` : ''}`;
}

export function renderItems(target, state, filters = {}) {
  const query = String(filters.query || '').trim().toLowerCase();
  const type = String(filters.type || 'todos');
  const status = String(filters.status || 'todos');
  const items = (state.items || []).filter(item => {
    const text = `${item.id} ${item.nombre} ${item.tipo} ${item.estado} ${item.notas}`.toLowerCase();
    if (query && !text.includes(query)) return false;
    if (type !== 'todos' && item.tipo !== type) return false;
    if (status !== 'todos' && item.estado !== status) return false;
    return true;
  }).sort((a,b) => Number(a.prioridad || 999) - Number(b.prioridad || 999));
  target.innerHTML = `
    <div class="finance-items-list">
      ${items.map(item => {
        const progress = Number(item.montoTotal) > 0 ? (Number(item.pagadoTotal || 0) / Number(item.montoTotal)) * 100 : 100;
        return `<article class="finance-item-card ${typeClass(item.tipo)}">
          <div class="finance-item-top">
            <div><strong>${escapeHtml(item.nombre)}</strong><small>Ítem #${escapeHtml(item.id)} - prioridad ${escapeHtml(item.prioridad)}</small></div>
            <div><span class="pill ${typeClass(item.tipo)}">${escapeHtml(item.tipo)}</span><span class="pill ${statusClass(item.estado)}">${escapeHtml(item.estado)}</span></div>
          </div>
          ${bar(progress, item.nombre)}
          <div class="finance-money-grid"><span>Total <b>${money(item.montoTotal)}</b></span><span>Pagado <b>${money(item.pagadoTotal)}</b></span><span>Saldo <b>${money(item.saldoPendiente)}</b></span></div>
          ${item.notas ? `<p class="finance-note compact">${escapeHtml(item.notas)}</p>` : ''}
        </article>`;
      }).join('') || '<article class="finance-empty">No hay ítems para este filtro.</article>'}
    </div>`;
}

export function renderSimulator(target, result) {
  if (!result) {
    target.innerHTML = '<article class="finance-empty">Ingresa un monto y pulsa “Simular”. No se persiste ningún cambio.</article>';
    return;
  }
  const delta = result.deltaMonths == null ? '—' : (result.deltaMonths > 0 ? `+${result.deltaMonths}` : String(result.deltaMonths));
  target.innerHTML = `
    <div class="finance-kpi-grid compact">
      <article class="finance-kpi"><small>Monto simulado</small><strong>${money(result.amount)}</strong><span>base ${money(result.baseAmount)}</span></article>
      <article class="finance-kpi"><small>Meses base</small><strong>${result.baseMonths || '—'}</strong><span>${formatDate(result.baseFinishDate)}</span></article>
      <article class="finance-kpi"><small>Meses simulados</small><strong>${result.simulatedMonths || '—'}</strong><span>${formatDate(result.simulatedFinishDate)}</span></article>
      <article class="finance-kpi"><small>Diferencia</small><strong>${delta}</strong><span>meses frente al plan base</span></article>
    </div>
    <div class="finance-route-list">
      ${(result.firstMonths || []).map(month => `<article class="finance-month"><div class="finance-month-head"><strong>Mes ${month.monthNumber} · ${formatDate(month.date)}</strong><span>${money(month.total)}</span></div><small>Saldo restante: ${money(month.remainingAfterMonth)}</small></article>`).join('') || '<article class="finance-empty">La simulación no generó meses.</article>'}
    </div>
    ${result.message ? `<p class="finance-note warning">${escapeHtml(result.message)}</p>` : ''}`;
}

export function renderAchievements(target, state) {
  const achievements = state.achievements || [];
  target.innerHTML = `
    <div class="finance-achievements">
      ${achievements.map(item => `<article class="finance-achievement ${item.unlocked ? 'unlocked' : ''}">
        <span class="finance-ach-icon">${escapeHtml(item.icon || '★')}</span>
        <div><strong>${escapeHtml(item.nombre)}</strong><small>${escapeHtml(item.condicion)}</small>${item.unlocked ? `<em>Desbloqueado: ${formatDate(item.unlockedAt)}</em>` : '<em>Pendiente</em>'}<p>${escapeHtml(item.leyenda)}</p></div>
      </article>`).join('') || '<article class="finance-empty">No hay logros cargados.</article>'}
    </div>`;
}

export function renderHistory(target, state, filters = {}) {
  const query = String(filters.query || '').trim().toLowerCase();
  const status = String(filters.status || 'todos');
  const payments = (state.payments || []).filter(payment => {
    const text = `${payment.pagoId} ${payment.fecha} ${payment.itemId} ${payment.nombreItem} ${payment.tipo} ${payment.monto} ${payment.estado} ${payment.nota}`.toLowerCase();
    if (query && !text.includes(query)) return false;
    if (status !== 'todos' && payment.estado !== status) return false;
    return true;
  }).sort((a,b) => String(b.fecha || '').localeCompare(String(a.fecha || '')) || String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
  target.innerHTML = `
    <div class="finance-history-list">
      ${payments.map(payment => `<article class="finance-row ${payment.estado === 'Anulado' ? 'is-void' : ''}">
        <div class="finance-row-main">
          <span class="finance-step">${payment.estado === 'Anulado' ? '×' : '✓'}</span>
          <div><strong>${escapeHtml(payment.nombreItem)}</strong><small>${formatDate(payment.fecha)} · ${escapeHtml(payment.tipo)} · mes plan ${escapeHtml(payment.mesPlan)}</small><small class="mono">${escapeHtml(payment.pagoId)}</small></div>
        </div>
        <div><span class="pill ${payment.estado === 'Anulado' ? 'muted' : 'done'}">${escapeHtml(payment.estado)}</span><div class="finance-amount">${money(payment.monto)}</div></div>
      </article>`).join('') || '<article class="finance-empty">No hay pagos para este filtro.</article>'}
    </div>`;
}

export function renderSettings(target, state, sourceMeta = {}) {
  const settings = state.settings || {};
  const gate = state.investmentGate || {};
  target.innerHTML = `
    <div class="finance-kpi-grid compact">
      <article class="finance-kpi"><small>Estrategia</small><strong>${escapeHtml(STRATEGY_LABELS[settings.strategy] || safeText(settings.strategy))}</strong><span>${escapeHtml(settings.strategy)}</span></article>
      <article class="finance-kpi"><small>Aporte mínimo</small><strong>${money(settings.monthlyMin)}</strong><span>configuración</span></article>
      <article class="finance-kpi"><small>Aporte base</small><strong>${money(settings.monthlyCurrent)}</strong><span>usado por la ruta</span></article>
      <article class="finance-kpi"><small>Aporte máximo</small><strong>${money(settings.monthlyMax)}</strong><span>escenario alto</span></article>
      <article class="finance-kpi"><small>Fecha base</small><strong>${formatDate(settings.startDate)}</strong><span>America/Santiago</span></article>
      <article class="finance-kpi"><small>Umbral inversiones</small><strong>${percent(settings.investmentUnlockDebtProgress)}</strong><span>${gate.unlocked ? 'desbloqueado' : `faltan ${money(gate.remainingToUnlock)}`}</span></article>
      <article class="finance-kpi"><small>Repositorio</small><strong>${escapeHtml(sourceMeta.kind || '—')}</strong><span>${sourceMeta.readOnly === false ? 'lectura/escritura contrato' : 'sólo lectura UI'}</span></article>
      <article class="finance-kpi"><small>Snapshot fuente</small><strong>v10.1</strong><span>auditoría estable</span></article>
    </div>
    <p class="finance-note">Estos ajustes se muestran aquí en lectura. Para modificarlos, usa la pestaña Escritura controlada.</p>`;
}
