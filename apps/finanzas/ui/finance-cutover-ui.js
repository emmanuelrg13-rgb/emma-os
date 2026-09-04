/* Emma OS v1.8.0 — Control Financiero Personal M5 corte controlado
   Archivo: finance-cutover-ui.js
   Propósito: validar y documentar el corte donde Emma OS pasa a ser la interfaz principal.
*/

import { money, escapeHtml, formatDate } from './finance-readonly-ui.js';

function okLine(id, label, ok, note = '', severity = 'must') {
  return { id, label, ok: !!ok, note, severity };
}

export function buildCutoverReport(normalizedState, parityReport) {
  const repository = normalizedState?.repository || {};
  const coreState = normalizedState?.coreState || {};
  const summary = parityReport?.summary || {};
  const checks = [
    okLine('repository-google-sheets', 'Repositorio real es Google Sheets / Apps Script', repository.kind === 'google-sheets-apps-script', `Repositorio: ${repository.kind || '—'}`),
    okLine('snapshot-ok', 'Snapshot funcional v10.1-auditoria conservado', (parityReport?.sourceSnapshot || coreState.version) === '10.1-auditoria', `Snapshot: ${parityReport?.sourceSnapshot || coreState.version || '—'}`),
    okLine('m4-approved', 'Reporte M4 aprobado', summary.status === 'aprobado', `Estado M4: ${summary.status || '—'}`),
    okLine('m4-no-failures', 'Reporte M4 sin fallos', Number(summary.failed) === 0, `Fallos: ${summary.failed ?? '—'}`),
    okLine('m4-must-complete', 'Checks no negociables aprobados', Number(summary.mustPassed) === Number(summary.mustTotal) && Number(summary.mustTotal) > 0, `${summary.mustPassed ?? '—'}/${summary.mustTotal ?? '—'}`),
    okLine('items-present', 'Ítems reales disponibles', Array.isArray(coreState.items) && coreState.items.length > 0, `${coreState.items?.length || 0} ítems`, 'review'),
    okLine('achievements-present', 'Logros conservados', Array.isArray(coreState.achievements) && coreState.achievements.length >= 12, `${coreState.achievements?.length || 0} logros`, 'review'),
    okLine('finance-backup-shape', 'Datos financieros exportables como paquete autocontenido', !!coreState.settings && Array.isArray(coreState.items) && Array.isArray(coreState.payments) && Array.isArray(coreState.achievements), 'settings/items/payments/achievements', 'review'),
    okLine('old-app-fallback', 'Web App antigua queda como respaldo temporal', true, 'Validación operativa/manual: no eliminar la Web App estable durante M5.', 'review')
  ];
  const must = checks.filter(x => x.severity === 'must');
  const review = checks.filter(x => x.severity !== 'must');
  const status = must.every(x => x.ok) ? 'aprobado' : 'bloqueado';
  return {
    module: 'control-financiero',
    schemaVersion: 'finance-cutover-report-v1',
    emmaVersion: 'v1.8.0',
    phase: 'M5 Corte Controlado',
    cutoverAt: new Date().toISOString(),
    repository,
    sourceSnapshot: parityReport?.sourceSnapshot || coreState.version || '10.1-auditoria',
    status,
    summary: {
      total: checks.length,
      passed: checks.filter(x => x.ok).length,
      failed: checks.filter(x => !x.ok).length,
      mustTotal: must.length,
      mustPassed: must.filter(x => x.ok).length,
      reviewTotal: review.length,
      reviewPassed: review.filter(x => x.ok).length,
      m4: summary
    },
    totals: coreState.totals || null,
    itemCount: coreState.items?.length || 0,
    paymentCount: coreState.payments?.length || 0,
    achievementCount: coreState.achievements?.length || 0,
    firstSuggestedPayment: coreState.currentPlan?.payments?.[0] || null,
    checks
  };
}

export function renderCutoverReport(target, report) {
  if (!target) return;
  if (!report) {
    target.innerHTML = '<article class="finance-empty">Carga estado desde Sheets, genera/reutiliza reporte M4 y pulsa “Generar certificado M5”.</article>';
    return;
  }
  const statusClass = report.status === 'aprobado' ? 'good' : 'warn';
  target.innerHTML = `
    <div class="finance-section-head">
      <div>
        <h2>Certificado M5 de corte controlado</h2>
        <p class="finance-note">Emma OS queda habilitado como interfaz principal de Finanzas. La Web App antigua debe conservarse temporalmente como respaldo.</p>
      </div>
      <div class="finance-big-number"><small>Estado</small><strong>${escapeHtml(report.status)}</strong></div>
    </div>
    <div class="finance-kpi-grid compact">
      <div class="finance-kpi ${statusClass}"><span>Checks</span><strong>${report.summary.passed}/${report.summary.total}</strong></div>
      <div class="finance-kpi ${report.summary.mustPassed===report.summary.mustTotal?'good':'warn'}"><span>No negociables</span><strong>${report.summary.mustPassed}/${report.summary.mustTotal}</strong></div>
      <div class="finance-kpi"><span>Ítems</span><strong>${report.itemCount}</strong></div>
      <div class="finance-kpi"><span>Saldo pendiente</span><strong>${money(report.totals?.General?.pending || 0)}</strong></div>
    </div>
    <p class="finance-note compact">Corte: ${formatDate(report.cutoverAt)} · Repositorio: ${escapeHtml(report.repository?.kind || '—')} · Snapshot: ${escapeHtml(report.sourceSnapshot)}</p>
    <div class="list" style="margin-top:14px">
      ${report.checks.map(c => `<div class="row ${c.ok?'ok':'err'}"><strong>${c.ok?'✓':'✗'} ${escapeHtml(c.label)}</strong><small>${escapeHtml(c.note || '')} · ${escapeHtml(c.severity)}</small></div>`).join('')}
    </div>`;
}

export function downloadCutoverReport(report) {
  if (!report) throw new Error('No hay certificado M5 generado.');
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `emma_os_finanzas_m5_corte_${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function renderCutoverChecklist(target) {
  if (!target) return;
  const items = [
    'Leer estado desde Google Sheets, no demo local.',
    'Generar reporte M4 y verificar estado aprobado.',
    'Generar certificado M5.',
    'Guardar certificado M5 junto al reporte M4.',
    'Usar Emma OS como interfaz principal.',
    'Mantener Web App antigua como respaldo temporal.',
    'No modificar almacenamiento hasta M6/evolución.'
  ];
  target.innerHTML = items.map((text, i) => `<label class="checkline"><input type="checkbox" ${i < 3 ? 'checked' : ''}> <span>${escapeHtml(text)}</span></label>`).join('');
}
