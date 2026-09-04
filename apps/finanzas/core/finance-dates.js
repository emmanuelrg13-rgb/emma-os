/* Emma OS v1.7.2 — Control Financiero Personal M1/M2/M3 lectura
   Archivo: finance-dates.js
   Propósito: aislar fechas financieras sin usar Date.setMonth(), manteniendo clamp 29/30/31. */

export function cleanText(value) {
  return String(value == null ? '' : value).trim();
}

export function normalizeDateText(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    // Sólo para fixtures locales. La conversión real de zona horaria queda en M2/backend.
    return value.toISOString().slice(0, 10);
  }
  const text = cleanText(value);
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return iso ? `${iso[1]}-${iso[2]}-${iso[3]}` : text;
}

export function daysInMonth(year, month) {
  if (month === 2) {
    const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    return leap ? 29 : 28;
  }
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

export function parseIsoDateParts(value) {
  const match = cleanText(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > daysInMonth(year, month)) return null;
  return { year, month, day };
}

export function isValidIsoDate(value) {
  return !!parseIsoDateParts(value);
}

export function addMonthsText(dateText, monthsToAdd, fallback = '2026-08-01') {
  const base = parseIsoDateParts(normalizeDateText(dateText)) || parseIsoDateParts(fallback);
  const offset = Number(monthsToAdd) || 0;
  const monthIndex = (base.month - 1) + offset;
  const targetYear = base.year + Math.floor(monthIndex / 12);
  const targetMonthZero = ((monthIndex % 12) + 12) % 12;
  const targetMonth = targetMonthZero + 1;
  const targetDay = Math.min(base.day, daysInMonth(targetYear, targetMonth));
  return [
    String(targetYear).padStart(4, '0'),
    String(targetMonth).padStart(2, '0'),
    String(targetDay).padStart(2, '0')
  ].join('-');
}

export function goalState(label, reached, month, date) {
  return {
    label,
    reached: !!reached,
    month: reached ? Number(month) || 0 : null,
    date: reached ? normalizeDateText(date) : ''
  };
}

export function captureGoal(goal, condition, month, date) {
  if (!goal.reached && condition) {
    goal.reached = true;
    goal.month = Number(month) || 0;
    goal.date = normalizeDateText(date);
  }
}
