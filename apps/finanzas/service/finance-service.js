/* Emma OS v1.7.3 — Control Financiero Personal M3 escritura controlada
   Archivo: finance-service.js
   Propósito: capa de aplicación entre FinanceUI, FinanceCore y FinanceRepository. M3 escritura controlada habilita mutaciones sólo con adaptadores allowWrites.
*/

import { buildAppState, previewMonthlyAmount as corePreviewMonthlyAmount, simulateAmount as coreSimulateAmount, validateImportData } from '../core/finance-core.js';
import { FINANCE_APP } from '../core/finance-schema.js';
import { MemoryFinanceRepository, validateRepositoryContract } from '../repository/finance-repository.js';
import { GoogleSheetsFinanceAdapter } from '../repository/google-sheets-finance-adapter.js';

export const FINANCE_STORAGE_KEYS = Object.freeze({
  connection: 'emmaos_finanzas_google_sheets_config_v1',
  lastRead: 'emmaos_finanzas_last_read_v1',
  lastRepositoryTest: 'emmaos_finanzas_repo_test_v1'
});

function hasLocalStorage() {
  try { return typeof localStorage !== 'undefined'; } catch (_error) { return false; }
}

export function loadFinanceConnection() {
  try {
    if (!hasLocalStorage()) return {};
    return JSON.parse(localStorage.getItem(FINANCE_STORAGE_KEYS.connection) || '{}');
  } catch (_error) {
    return {};
  }
}

export function saveFinanceConnection(config = {}) {
  const clean = {
    scriptUrl: String(config.scriptUrl || '').trim(),
    secret: String(config.secret || '').trim(),
    savedAt: new Date().toISOString()
  };
  if (hasLocalStorage()) localStorage.setItem(FINANCE_STORAGE_KEYS.connection, JSON.stringify(clean));
  return clean;
}

export function clearFinanceConnection() {
  if (hasLocalStorage()) localStorage.removeItem(FINANCE_STORAGE_KEYS.connection);
}

export class FinanceService {
  constructor(repository) {
    this.repository = repository;
    this.contract = validateRepositoryContract(repository);
  }

  async testConnection() {
    const result = await this.repository.testConnection();
    if (hasLocalStorage()) localStorage.setItem(FINANCE_STORAGE_KEYS.lastRepositoryTest, JSON.stringify({ at: new Date().toISOString(), ok: !!result.ok, result }));
    return result;
  }

  async getAppState() {
    const raw = await this.repository.getAppState();
    const normalized = this.normalizeState(raw);
    if (hasLocalStorage()) localStorage.setItem(FINANCE_STORAGE_KEYS.lastRead, JSON.stringify({ at: new Date().toISOString(), sourceVersion: raw.version || '', totals: normalized.coreState?.totals || raw.totals || null }));
    return normalized;
  }

  normalizeState(raw = {}) {
    const settings = raw.settings || {};
    const items = raw.items || [];
    const payments = raw.payments || [];
    const achievements = raw.achievements || [];
    const achievementUnlocks = {};
    achievements.forEach(item => {
      const id = item.achievementId || item.id;
      if (id && item.unlockedAt) achievementUnlocks[id] = item.unlockedAt;
    });
    const coreState = buildAppState({ settings, items, payments, achievementUnlocks });
    return {
      ok: raw.ok !== false,
      sourceState: raw,
      coreState,
      parityLite: compareLite(raw, coreState),
      repository: this.repository.meta,
      financeApp: FINANCE_APP
    };
  }

  async previewMonthlyAmount(amount) {
    const raw = await this.repository.previewMonthlyAmount(amount);
    return raw;
  }

  async simulateAmount(amount) {
    const raw = await this.repository.simulateAmount(amount);
    return raw;
  }

  previewFromState(amount, normalizedState) {
    return corePreviewMonthlyAmount(amount, normalizedState.coreState.items, normalizedState.coreState.settings);
  }

  simulateFromState(amount, normalizedState) {
    return coreSimulateAmount(amount, normalizedState.coreState.items, normalizedState.coreState.settings);
  }

  async saveSettings(payload = {}) {
    const raw = await this.repository.saveSettings(payload);
    return this.normalizeState(raw);
  }

  async saveItem(payload = {}) {
    const raw = await this.repository.saveItem(payload);
    return this.normalizeState(raw);
  }

  async archiveItem(id) {
    const raw = await this.repository.archiveItem(id);
    return this.normalizeState(raw);
  }

  async registerPaymentBatch(payload = {}) {
    const raw = await this.repository.registerPaymentBatch(payload);
    const normalized = this.normalizeState(raw);
    normalized.duplicateRequestIgnored = !!raw.duplicateRequestIgnored;
    return normalized;
  }

  async voidPayment(pagoId) {
    const raw = await this.repository.voidPayment(pagoId);
    return this.normalizeState(raw);
  }

  async exportData() {
    return this.repository.exportData();
  }

  validateImportData(payload) {
    return validateImportData(payload);
  }
}

export function createMemoryFinanceService(seed = {}) {
  return new FinanceService(new MemoryFinanceRepository(seed));
}

export function createGoogleSheetsFinanceService(config = {}) {
  return new FinanceService(new GoogleSheetsFinanceAdapter(config));
}

export function createGoogleSheetsFinanceServiceFromStorage() {
  const config = loadFinanceConnection();
  return createGoogleSheetsFinanceService(config);
}

function compareMoney(a, b) {
  return Math.round((Number(a) || 0) * 100) === Math.round((Number(b) || 0) * 100);
}

function compareLite(raw, coreState) {
  const checks = [];
  if (raw?.totals?.General && coreState?.totals?.General) {
    checks.push({
      id: 'totales_general_pending',
      label: 'Saldo general pendiente coincide',
      ok: compareMoney(raw.totals.General.pending, coreState.totals.General.pending),
      source: raw.totals.General.pending,
      core: coreState.totals.General.pending
    });
    checks.push({
      id: 'totales_deuda_pending',
      label: 'Saldo deuda pendiente coincide',
      ok: compareMoney(raw.totals.Deuda?.pending, coreState.totals.Deuda?.pending),
      source: raw.totals.Deuda?.pending,
      core: coreState.totals.Deuda?.pending
    });
  }
  if (raw?.currentPlan?.payments && coreState?.currentPlan?.payments) {
    const sourceFirst = raw.currentPlan.payments[0] || null;
    const coreFirst = coreState.currentPlan.payments[0] || null;
    checks.push({
      id: 'primera_asignacion',
      label: 'Primera asignación coincide',
      ok: String(sourceFirst?.itemId || '') === String(coreFirst?.itemId || ''),
      source: sourceFirst?.itemId || null,
      core: coreFirst?.itemId || null
    });
  }
  return {
    total: checks.length,
    passed: checks.filter(x => x.ok).length,
    checks,
    status: checks.length ? (checks.every(x => x.ok) ? 'ok' : 'review') : 'sin-comparación'
  };
}
