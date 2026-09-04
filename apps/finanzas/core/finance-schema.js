/* Emma OS v1.8.0 — Control Financiero Personal M4 paridad
   Archivo: finance-schema.js
   Autoría: OpenAI/ChatGPT (GPT-5.5 Thinking) para Emmanuel Rojas.
   Propósito: definir contrato, enums y metadatos estables del dominio financiero.
   Nota: el dominio sigue separado de la persistencia; las escrituras reales pasan por repositorio/adaptador y backend. */

export const FINANCE_APP = Object.freeze({
  module: 'control-financiero',
  release: 'v1.0',
  sourceSnapshot: 'v10.1-auditoria',
  emmaMigrationVersion: 'v1.8.0-m4-paridad',
  schemaVersion: 'finance-schema-v1',
  timezone: 'America/Santiago',
  currency: 'CLP'
});

export const SHEETS = Object.freeze({
  CONFIG: 'Config',
  ITEMS: 'Items',
  PAYMENTS: 'Pagos',
  ACHIEVEMENTS: 'Logros',
  README: 'Readme'
});

export const ITEM_HEADERS = Object.freeze([
  'id','nombre','tipo','montoTotal','pagadoPrevio','saldoPendiente','prioridad','estado','notas','createdAt','updatedAt'
]);

export const PAYMENT_HEADERS = Object.freeze([
  'pagoId','fecha','itemId','nombreItem','tipo','monto','mesPlan','nota','createdAt','estado'
]);

export const ACHIEVEMENT_HEADERS = Object.freeze([
  'achievementId','nombre','condicion','leyenda','unlockedAt','createdAt'
]);

export const READ_ME_HEADERS = Object.freeze(['Seccion','Detalle']);

export const ITEM_TYPES = Object.freeze(['Deuda','Compra','Inversión']);
export const ITEM_TYPE_ALIASES = Object.freeze({ Inversion: 'Inversión', inversion: 'Inversión', 'inversión': 'Inversión' });
export const ITEM_STATUSES = Object.freeze(['Activo','Urgente','Pausado','Pagado','Archivado']);
export const PAYMENT_STATUSES = Object.freeze(['Confirmado','Anulado']);
export const STRATEGIES = Object.freeze([
  'prioridad_manual',
  'menor_monto_primero',
  'deudas_primero',
  'urgentes_primero'
]);

export const DEFAULT_SETTINGS = Object.freeze({
  appName: 'Control Financiero Personal',
  monthlyMin: 50000,
  monthlyMax: 150000,
  monthlyCurrent: 50000,
  startDate: '2026-08-01',
  investmentUnlockDebtProgress: 0.75,
  strategy: 'prioridad_manual',
  currency: 'CLP',
  version: '10.1-auditoria'
});

export const SERVICE_CONTRACT = Object.freeze([
  'getAppState',
  'previewMonthlyAmount',
  'simulateAmount',
  'saveSettings',
  'saveItem',
  'archiveItem',
  'registerPaymentBatch',
  'voidPayment'
]);
