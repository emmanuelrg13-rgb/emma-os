/* Emma OS v1.7.4 — Control Financiero Personal M3 escritura controlada
   Archivo: finance-write-ui.js
   Autoría: OpenAI/ChatGPT (GPT-5.5 Thinking) para Emmanuel Rojas.
   Propósito: renderizar formularios nativos de escritura controlada sin copiar la UI antigua.
   Seguridad: la UI exige armado manual por sesión, confirmación por acción y el backend vuelve a validar.
*/

import { money, escapeHtml, formatDate, statusClass, typeClass, STRATEGY_LABELS } from './finance-readonly-ui.js';

const ITEM_STATUSES = ['Activo', 'Urgente', 'Pausado', 'Pagado', 'Archivado'];
const ITEM_TYPES = ['Deuda', 'Compra', 'Inversión'];
const STRATEGIES = ['prioridad_manual', 'menor_monto_primero', 'deudas_primero', 'urgentes_primero'];

function todayIso() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function option(value, label, selectedValue = '') {
  const selected = String(value) === String(selectedValue) ? ' selected' : '';
  return `<option value="${escapeHtml(value)}"${selected}>${escapeHtml(label ?? value)}</option>`;
}

export function renderWritePanel(target, state, options = {}) {
  const writesArmed = !!options.writesArmed;
  const today = todayIso();
  const settings = state.settings || {};
  const activeItems = (state.items || [])
    .filter(item => item.estado !== 'Archivado' && item.estado !== 'Pagado' && Number(item.saldoPendiente) > 0)
    .sort((a,b) => Number(a.prioridad || 999) - Number(b.prioridad || 999));
  const allItems = (state.items || []).slice().sort((a,b) => Number(a.prioridad || 999) - Number(b.prioridad || 999));
  const confirmedPayments = (state.payments || [])
    .filter(payment => payment.estado !== 'Anulado')
    .sort((a,b) => String(b.fecha || '').localeCompare(String(a.fecha || '')) || String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
  const suggestedPayments = (state.currentPlan?.payments || []);
  const writeClass = writesArmed ? 'ok' : 'warn';

  target.innerHTML = `
    <section class="panel warnPanel" style="box-shadow:none">
      <div class="finance-section-head">
        <div>
          <h2>Escritura controlada</h2>
          <p>Esta etapa habilita acciones reales contra Google Sheets, pero siempre con doble protección: armado manual en Emma OS y validación del backend.</p>
        </div>
        <div class="finance-big-number"><small>Modo actual</small><strong>${writesArmed ? 'Armado' : 'Bloqueado'}</strong></div>
      </div>
      <div class="row ${writeClass}">
        <label class="checkline"><input id="enableWrites" type="checkbox" ${writesArmed ? 'checked' : ''}> Armar escritura para esta sesión</label>
        <small>Se desarma automáticamente después de cada escritura. No se guarda en GitHub ni como preferencia permanente.</small>
      </div>
      <div class="readonly-lock"><strong>Reglas activas:</strong> pagos sólo se confirman o anulan; nunca se borra historial. Ítems archivados salen de totales. Inversiones siguen bloqueadas hasta el umbral configurado.</div>
    </section>

    <section class="cols">
      <article class="panel" style="box-shadow:none">
        <h2>Registrar plan sugerido</h2>
        <p>Marca las asignaciones que realmente pagarás. La app enviará un lote atómico con requestId único para evitar doble pago.</p>
        <label>Fecha del pago
          <input id="batchDate" type="date" value="${today}">
        </label>
        <div class="finance-route-list" id="suggestedPaymentsList">
          ${suggestedPayments.length ? suggestedPayments.map((payment, index) => `
            <article class="finance-row write-select-row">
              <div class="finance-row-main">
                <input class="plan-pay-check" type="checkbox" data-index="${index}" aria-label="Seleccionar ${escapeHtml(payment.nombre)}">
                <div><strong>${escapeHtml(payment.nombre)}</strong><small>${escapeHtml(payment.tipo)} · item #${escapeHtml(payment.itemId)}</small></div>
              </div>
              <label class="amount-inline">Monto
                <input class="plan-pay-amount" id="planAmount${index}" inputmode="numeric" value="${Math.round(Number(payment.monto) || 0)}" data-index="${index}">
              </label>
            </article>`).join('') : '<article class="finance-empty">No hay asignaciones sugeridas para este mes.</article>'}
        </div>
        <label>Nota del lote
          <input id="batchNote" placeholder="Ej: pago desde Emma OS">
        </label>
        <div class="actions"><button class="btn primary" id="registerSuggestedBatch" type="button">Registrar seleccionados</button></div>
      </article>

      <article class="panel" style="box-shadow:none">
        <h2>Pago manual</h2>
        <p>Permite registrar un pago parcial a un ítem específico sin seguir necesariamente la ruta sugerida.</p>
        <label>Ítem
          <select id="manualItemId">
            ${activeItems.map(item => option(item.id, `#${item.id} · ${item.nombre} · saldo ${money(item.saldoPendiente)}`)).join('')}
          </select>
        </label>
        <label>Monto
          <input id="manualAmount" inputmode="numeric" placeholder="Ej: 10000">
        </label>
        <label>Fecha
          <input id="manualDate" type="date" value="${today}">
        </label>
        <label>Nota
          <input id="manualNote" placeholder="Ej: pago manual desde Emma OS">
        </label>
        <div class="actions"><button class="btn primary" id="registerManualPayment" type="button">Registrar pago manual</button></div>
      </article>
    </section>

    <section class="cols">
      <article class="panel" style="box-shadow:none">
        <h2>Crear o editar ítem</h2>
        <p>Respeta historial: un monto total no puede quedar por debajo de pagado previo + pagos confirmados.</p>
        <label>Editar existente o crear nuevo
          <select id="itemEditSelect">
            ${option('', 'Crear nuevo ítem')}
            ${allItems.map(item => option(item.id, `#${item.id} · ${item.nombre} · ${item.estado}`)).join('')}
          </select>
        </label>
        <div class="write-form-grid">
          <label>Nombre<input id="itemName" placeholder="Nombre del ítem"></label>
          <label>Tipo<select id="itemTypeEdit">${ITEM_TYPES.map(t => option(t, t)).join('')}</select></label>
          <label>Monto total<input id="itemTotal" inputmode="numeric" placeholder="0"></label>
          <label>Pagado previo<input id="itemPaidBefore" inputmode="numeric" placeholder="0"></label>
          <label>Prioridad<input id="itemPriority" inputmode="numeric" placeholder="1"></label>
          <label>Estado<select id="itemStatusEdit">${ITEM_STATUSES.map(s => option(s, s)).join('')}</select></label>
        </div>
        <label>Notas<input id="itemNotes" placeholder="Notas del ítem"></label>
        <div class="actions">
          <button class="btn primary" id="saveItem" type="button">Guardar ítem</button>
          <button class="btn" id="archiveItem" type="button">Archivar seleccionado</button>
          <button class="btn" id="clearItemForm" type="button">Limpiar formulario</button>
        </div>
      </article>

      <article class="panel" style="box-shadow:none">
        <h2>Ajustes financieros</h2>
        <p>Cambia aporte base, escenarios, fecha inicial, estrategia y umbral de inversiones.</p>
        <div class="write-form-grid">
          <label>Aporte mínimo<input id="settingsMin" inputmode="numeric" value="${Math.round(Number(settings.monthlyMin) || 0)}"></label>
          <label>Aporte base<input id="settingsCurrent" inputmode="numeric" value="${Math.round(Number(settings.monthlyCurrent) || 0)}"></label>
          <label>Aporte máximo<input id="settingsMax" inputmode="numeric" value="${Math.round(Number(settings.monthlyMax) || 0)}"></label>
          <label>Fecha base<input id="settingsStartDate" type="date" value="${escapeHtml(String(settings.startDate || today).slice(0,10))}"></label>
          <label>Umbral inversiones %<input id="settingsInvestmentGate" inputmode="numeric" value="${Math.round((Number(settings.investmentUnlockDebtProgress) || 0.75) * 100)}"></label>
          <label>Estrategia<select id="settingsStrategy">${STRATEGIES.map(s => option(s, STRATEGY_LABELS[s] || s, settings.strategy)).join('')}</select></label>
        </div>
        <div class="actions"><button class="btn primary" id="saveSettings" type="button">Guardar ajustes</button></div>
      </article>
    </section>

    <section class="panel" style="box-shadow:none">
      <h2>Anulación no destructiva</h2>
      <p>Selecciona un pago confirmado. La acción cambia su estado a <strong>Anulado</strong> y conserva el UUID/historial.</p>
      <div class="formGrid">
        <label>Pago confirmado
          <select id="voidPaymentId">
            ${confirmedPayments.map(payment => option(payment.pagoId, `${formatDate(payment.fecha)} · ${payment.nombreItem} · ${money(payment.monto)} · ${payment.pagoId}`)).join('')}
          </select>
        </label>
        <div class="actions" style="align-items:end"><button class="btn" id="voidPayment" type="button">Anular pago seleccionado</button></div>
      </div>
      <div class="list" style="margin-top:12px">
        ${confirmedPayments.slice(0, 5).map(payment => `<div class="row"><strong>${escapeHtml(payment.nombreItem)} · ${money(payment.monto)}</strong><small>${formatDate(payment.fecha)} · <span class="mono">${escapeHtml(payment.pagoId)}</span></small></div>`).join('') || '<div class="row warn">No hay pagos confirmados disponibles para anular.</div>'}
      </div>
    </section>
  `;
}

export function itemToFormMap(item = {}) {
  return {
    itemName: item.nombre || '',
    itemTypeEdit: item.tipo || 'Deuda',
    itemTotal: Math.round(Number(item.montoTotal) || 0),
    itemPaidBefore: Math.round(Number(item.pagadoPrevio) || 0),
    itemPriority: Math.round(Number(item.prioridad) || 1),
    itemStatusEdit: item.estado || 'Activo',
    itemNotes: item.notas || ''
  };
}
