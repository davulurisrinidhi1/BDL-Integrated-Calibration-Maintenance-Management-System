// ── Utility helpers ──────────────────────────────────────────

/** Generate a unique ID with optional prefix */
export function generateId(prefix = 'ID') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Format a Date object or ISO string to YYYY-MM-DD */
export function formatDate(d) {
  const date = typeof d === 'string' ? new Date(d) : d;
  if (isNaN(date)) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Format a Date to a human-readable string */
export function formatDateTime(d) {
  const date = typeof d === 'string' ? new Date(d) : d;
  if (isNaN(date)) return '';
  return date.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

/** Add weeks to a date string (YYYY-MM-DD) and return YYYY-MM-DD */
export function addWeeks(dateStr, weeks) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + weeks * 7);
  return formatDate(d);
}

/** Add months to a date string */
export function addMonths(dateStr, months) {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return formatDate(d);
}

/** Check if a date is within N days from today */
export function isWithinDays(dateStr, days) {
  if (!dateStr) return false;
  const target = new Date(dateStr);
  const now = new Date();
  const diff = (target - now) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= days;
}

/** Check if a date is overdue */
export function isOverdue(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

/** Determine product type from material code */
export function getProductType(code) {
  if (!code) return 'unknown';
  return /^[0-9]+$/.test(code) ? 'standard' : 'customized';
}

/** Clamp a number between min and max */
export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/** Deep clone an object */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/** Simulate async API delay */
export function mockDelay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Generate a certificate number */
export function generateCertNumber() {
  const year = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  return `CERT-${year}-${seq}`;
}

/** Get days until a date */
export function daysUntil(dateStr) {
  if (!dateStr) return Infinity;
  const diff = (new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24);
  return Math.ceil(diff);
}
