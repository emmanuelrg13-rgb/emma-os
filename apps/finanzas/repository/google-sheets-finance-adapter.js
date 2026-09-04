/* Emma OS v1.7.2 — Control Financiero Personal M2/M3 lectura
   Archivo: google-sheets-finance-adapter.js
   Propósito: adaptador de persistencia hacia una Web App de Google Apps Script.
   Nota de seguridad: en M2 la UI usa este adaptador para lectura/pruebas. Las escrituras quedan detrás
   del contrato y requieren habilitación explícita en el backend/endpoint.
*/

import { FinanceRepository, FinanceRepositoryError, validateRepositoryContract } from './finance-repository.js';
import { FINANCE_APP } from '../core/finance-schema.js';

const DEFAULT_TIMEOUT_MS = 25000;

function normalizeScriptUrl(url) {
  const clean = String(url || '').trim();
  if (!clean) return '';
  return clean.replace(/\/dev(\?|$)/, '/exec$1');
}

function safeJson(value) {
  try { return JSON.stringify(value || {}); } catch (_error) { return '{}'; }
}

export class GoogleSheetsFinanceAdapter extends FinanceRepository {
  constructor({ scriptUrl = '', secret = '', timeoutMs = DEFAULT_TIMEOUT_MS, allowWrites = false } = {}) {
    super({ kind: 'google-sheets-apps-script', readOnly: !allowWrites, schemaVersion: FINANCE_APP.schemaVersion });
    this.scriptUrl = normalizeScriptUrl(scriptUrl);
    this.secret = String(secret || '').trim();
    this.timeoutMs = Number(timeoutMs) || DEFAULT_TIMEOUT_MS;
    this.allowWrites = !!allowWrites;
  }

  assertReady() {
    if (!this.scriptUrl) throw new FinanceRepositoryError('Falta la URL /exec de Apps Script.');
    if (!this.scriptUrl.includes('/exec')) throw new FinanceRepositoryError('La URL debe ser la implementación /exec, no /dev.');
    if (!this.secret) throw new FinanceRepositoryError('Falta la clave privada del endpoint financiero.');
  }

  async call(action, payload = {}, { write = false } = {}) {
    this.assertReady();
    if (write && !this.allowWrites) {
      throw new FinanceRepositoryError('Escrituras desactivadas en el adaptador M2. Se habilitarán en M3/M4 tras pruebas de paridad.');
    }
    const response = await this.jsonp(action, payload, { write });
    if (!response || response.ok === false) {
      throw new FinanceRepositoryError(response?.error || `La acción ${action} falló.`, response);
    }
    return response;
  }

  jsonp(action, payload = {}, { write = false } = {}) {
    this.assertReady();
    return new Promise((resolve, reject) => {
      const callback = `emmaFinanceM2_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const script = document.createElement('script');
      const timer = setTimeout(() => {
        cleanup();
        reject(new FinanceRepositoryError(`Tiempo agotado esperando respuesta de ${action}.`));
      }, this.timeoutMs);

      const cleanup = () => {
        clearTimeout(timer);
        try { delete window[callback]; } catch (_e) { window[callback] = undefined; }
        if (script.parentNode) script.parentNode.removeChild(script);
      };

      window[callback] = data => { cleanup(); resolve(data); };
      script.onerror = () => { cleanup(); reject(new FinanceRepositoryError(`No se pudo cargar Apps Script para ${action}. Revisa URL, permisos y conexión.`)); };

      const params = new URLSearchParams();
      params.set('action', action);
      params.set('secret', this.secret);
      params.set('callback', callback);
      params.set('client', 'emma-os-finanzas-m2');
      params.set('module', FINANCE_APP.module);
      if (write) params.set('allowWrite', '1');
      params.set('payload', safeJson(payload));

      script.src = `${this.scriptUrl}${this.scriptUrl.includes('?') ? '&' : '?'}${params.toString()}`;
      document.head.appendChild(script);
    });
  }

  async testConnection() {
    const result = await this.call('test');
    return { ...result, adapter: this.meta.kind, contract: validateRepositoryContract(this) };
  }

  async getAppState() { return this.call('getAppState'); }
  async previewMonthlyAmount(amount) { return this.call('previewMonthlyAmount', { amount }); }
  async simulateAmount(amount) { return this.call('simulateAmount', { amount }); }
  async saveSettings(payload) { return this.call('saveSettings', payload, { write: true }); }
  async saveItem(payload) { return this.call('saveItem', payload, { write: true }); }
  async archiveItem(id) { return this.call('archiveItem', { id }, { write: true }); }
  async registerPaymentBatch(payload) { return this.call('registerPaymentBatch', payload, { write: true }); }
  async voidPayment(pagoId) { return this.call('voidPayment', { pagoId }, { write: true }); }
  async exportData() { return this.call('exportData'); }
  async importData(payload, mode = 'replace') { return this.call('importData', { payload, mode }, { write: true }); }
}

export function createGoogleSheetsFinanceAdapter(config = {}) {
  return new GoogleSheetsFinanceAdapter(config);
}
