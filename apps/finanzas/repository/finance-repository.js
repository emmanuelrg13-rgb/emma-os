/* Emma OS v1.7.1 — Control Financiero Personal M2
   Archivo: finance-repository.js
   Autoría: OpenAI/ChatGPT (GPT-5.5 Thinking) para Emmanuel Rojas.
   Propósito: definir el contrato FinanceRepository y un adaptador local/memoria para pruebas.
   M2: el contrato existe; la UI de Emma OS todavía no ejecuta escrituras reales por defecto.
*/

import {
  buildAppState,
  clone,
  exportData as exportFinanceData,
  normalizeSettings,
  normalizeItem,
  normalizePayment,
  validateSettings,
  validateItemForSave,
  validatePaymentBatch,
  roundMoney
} from '../core/finance-core.js';

import { FINANCE_APP, SERVICE_CONTRACT } from '../core/finance-schema.js';


function todayText() {
  return new Date().toISOString().slice(0, 10);
}

function nowText() {
  return new Date().toISOString();
}

export class FinanceRepositoryError extends Error {
  constructor(message, details = null) {
    super(message);
    this.name = 'FinanceRepositoryError';
    this.details = details;
  }
}

export class FinanceRepository {
  constructor(meta = {}) {
    this.meta = { kind: 'abstract', version: FINANCE_APP.emmaMigrationVersion, ...meta };
  }

  async testConnection() { throw new FinanceRepositoryError('testConnection no implementado.'); }
  async getAppState() { throw new FinanceRepositoryError('getAppState no implementado.'); }
  async previewMonthlyAmount(_amount) { throw new FinanceRepositoryError('previewMonthlyAmount no implementado.'); }
  async simulateAmount(_amount) { throw new FinanceRepositoryError('simulateAmount no implementado.'); }
  async saveSettings(_payload) { throw new FinanceRepositoryError('saveSettings no implementado.'); }
  async saveItem(_payload) { throw new FinanceRepositoryError('saveItem no implementado.'); }
  async archiveItem(_id) { throw new FinanceRepositoryError('archiveItem no implementado.'); }
  async registerPaymentBatch(_payload) { throw new FinanceRepositoryError('registerPaymentBatch no implementado.'); }
  async voidPayment(_pagoId) { throw new FinanceRepositoryError('voidPayment no implementado.'); }
  async exportData() { throw new FinanceRepositoryError('exportData no implementado.'); }
  async importData(_payload, _mode = 'replace') { throw new FinanceRepositoryError('importData no implementado.'); }
}

export function getRequiredContract() {
  return SERVICE_CONTRACT.slice();
}

export function validateRepositoryContract(candidate) {
  const missing = SERVICE_CONTRACT.filter(method => typeof candidate?.[method] !== 'function');
  return { ok: missing.length === 0, missing };
}

function makePaymentId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return 'local-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
}

function confirmedPaidForItem(payments, itemId) {
  return payments
    .map(normalizePayment)
    .filter(payment => payment.estado !== 'Anulado' && Number(payment.itemId) === Number(itemId))
    .reduce((sum, payment) => roundMoney(sum + Number(payment.monto || 0)), 0);
}

function unlockMapFromAchievements(achievements = []) {
  const map = {};
  achievements.forEach(item => {
    const id = String(item.achievementId || item.id || '').trim();
    if (!id) return;
    if (item.unlockedAt) map[id] = String(item.unlockedAt);
  });
  return map;
}

export class MemoryFinanceRepository extends FinanceRepository {
  constructor(seed = {}) {
    super({ kind: 'memory', readOnly: false });
    this.settings = normalizeSettings(seed.settings || {});
    this.items = (seed.items || []).map(normalizeItem);
    this.payments = (seed.payments || []).map(normalizePayment);
    this.achievements = (seed.achievements || []).map(item => ({ ...item }));
    this.seenRequestIds = new Set();
  }

  snapshot() {
    return {
      settings: clone(this.settings),
      items: clone(this.items),
      payments: clone(this.payments),
      achievements: clone(this.achievements)
    };
  }

  async testConnection() {
    return { ok: true, adapter: 'MemoryFinanceRepository', message: 'Repositorio local de prueba disponible.', contract: validateRepositoryContract(this) };
  }

  async getAppState() {
    return buildAppState({
      ...this.snapshot(),
      achievementUnlocks: unlockMapFromAchievements(this.achievements)
    });
  }

  async previewMonthlyAmount(amount) {
    const state = await this.getAppState();
    const monthlyAmount = Number(amount) || 0;
    if (monthlyAmount <= 0) throw new FinanceRepositoryError('El aporte temporal debe ser mayor a 0.');
    return { ok: true, amount: monthlyAmount, currentPlan: buildAppState({ ...this.snapshot(), settings: { ...state.settings, monthlyCurrent: monthlyAmount } }).currentPlan };
  }

  async simulateAmount(amount) {
    const { simulateAmount } = await import('../core/finance-core.js');
    return simulateAmount(amount, this.items, this.settings);
  }

  async saveSettings(payload = {}) {
    const result = validateSettings(payload);
    if (!result.ok) throw new FinanceRepositoryError(result.errors.join(' '), result.errors);
    this.settings = result.value;
    return this.getAppState();
  }

  async saveItem(payload = {}) {
    const id = Number(payload.id) || 0;
    const existingPaid = id > 0 ? confirmedPaidForItem(this.payments, id) : 0;
    const validation = validateItemForSave(payload, existingPaid);
    if (!validation.ok) throw new FinanceRepositoryError(validation.errors.join(' '), validation.errors);

    const now = nowText();
    const normalized = validation.item;
    if (id > 0) {
      const index = this.items.findIndex(item => Number(item.id) === id);
      if (index < 0) throw new FinanceRepositoryError('No encontré el ítem indicado.');
      const createdAt = this.items[index].createdAt || todayText();
      this.items[index] = normalizeItem({ ...this.items[index], ...normalized, id, createdAt, updatedAt: now });
    } else {
      const nextId = this.items.length ? Math.max(...this.items.map(item => Number(item.id) || 0)) + 1 : 1;
      this.items.push(normalizeItem({ ...normalized, id: nextId, prioridad: normalized.prioridad || nextId, createdAt: now, updatedAt: now }));
    }
    return this.getAppState();
  }

  async archiveItem(id) {
    const itemId = Number(id) || 0;
    if (!itemId) throw new FinanceRepositoryError('ID inválido.');
    const index = this.items.findIndex(item => Number(item.id) === itemId);
    if (index < 0) throw new FinanceRepositoryError('No encontré el ítem indicado.');
    this.items[index] = normalizeItem({ ...this.items[index], estado: 'Archivado', updatedAt: nowText() });
    return this.getAppState();
  }

  async registerPaymentBatch(payload = {}) {
    const requestId = String(payload.requestId || '').trim();
    if (requestId && this.seenRequestIds.has(requestId)) {
      const state = await this.getAppState();
      return { ...state, duplicateRequestIgnored: true };
    }

    const state = await this.getAppState();
    const validation = validatePaymentBatch(payload, state.items, state.settings);
    if (!validation.ok) throw new FinanceRepositoryError(validation.errors.join(' '), validation.errors);

    const date = validation.date || todayText();
    const now = nowText();
    const byId = new Map(state.items.map(item => [Number(item.id), item]));
    (payload.payments || []).forEach(payment => {
      const item = byId.get(Number(payment.itemId));
      this.payments.push(normalizePayment({
        pagoId: makePaymentId(),
        fecha: date,
        itemId: item.id,
        nombreItem: item.nombre,
        tipo: item.tipo,
        monto: Number(payment.monto) || 0,
        mesPlan: Number(payment.mesPlan) || 1,
        nota: payment.nota || '',
        createdAt: now,
        estado: 'Confirmado'
      }));
    });
    if (requestId) this.seenRequestIds.add(requestId);
    return this.getAppState();
  }

  async voidPayment(pagoId) {
    const id = String(pagoId || '').trim();
    if (!id) throw new FinanceRepositoryError('ID de pago inválido.');
    const index = this.payments.findIndex(payment => payment.pagoId === id);
    if (index < 0) throw new FinanceRepositoryError('No encontré el pago indicado.');
    if (this.payments[index].estado !== 'Anulado') {
      this.payments[index] = normalizePayment({ ...this.payments[index], estado: 'Anulado', nota: `${this.payments[index].nota || ''}${this.payments[index].nota ? ' | ' : ''}Anulado ${nowText()}` });
    }
    return this.getAppState();
  }

  async exportData() {
    return exportFinanceData(this.snapshot());
  }

  async importData(payload = {}, mode = 'replace') {
    if (mode !== 'replace') throw new FinanceRepositoryError('M2 sólo soporta importación local en modo replace.');
    if (payload.module !== FINANCE_APP.module || payload.schemaVersion !== FINANCE_APP.schemaVersion) {
      throw new FinanceRepositoryError('Respaldo financiero incompatible.');
    }
    this.settings = normalizeSettings(payload.settings || {});
    this.items = (payload.items || []).map(normalizeItem);
    this.payments = (payload.payments || []).map(normalizePayment);
    this.achievements = (payload.achievements || []).map(item => ({ ...item }));
    return this.getAppState();
  }
}
