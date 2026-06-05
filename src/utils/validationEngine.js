/**
 * AI Validation Engine - Rule-based intelligent validation assistant
 * 12 rules for calibration entry validation
 */

import { requiresBothGoNogo, measurementConsistency, checkWearLimitProximity, isGauge } from './measurementRules.js';

export function runValidation(entry) {
  const w = [];
  if (!entry) return w;

  // Rule 1: Missing required values
  if (!entry.type) w.push({ type: 'error', message: 'Instrument/Gauge type is required.', field: 'type' });
  if (!entry.materialCode) w.push({ type: 'error', message: 'Material code is required.', field: 'materialCode' });
  if (entry.status == null || entry.status === '') w.push({ type: 'warn', message: 'Status code not assigned.', field: 'status' });
  if (entry.cribNo == null || entry.cribNo === '') w.push({ type: 'warn', message: 'Crib number not assigned.', field: 'cribNo' });

  // Rule 2: GO/NOGO for Double Ended Gauge
  if (requiresBothGoNogo(entry.type)) {
    if (!entry.dimenGO && entry.dimenGO !== 0) w.push({ type: 'error', message: 'GO dimension required for Double Ended Gauge.', field: 'dimenGO' });
    if (!entry.dimenNOGO && entry.dimenNOGO !== 0) w.push({ type: 'error', message: 'NOGO dimension required for Double Ended Gauge.', field: 'dimenNOGO' });
    if (!entry.minTolGO && entry.minTolGO !== 0) w.push({ type: 'error', message: 'GO tolerance required for Double Ended Gauge.', field: 'minTolGO' });
    if (!entry.minTolNOGO && entry.minTolNOGO !== 0) w.push({ type: 'error', message: 'NOGO tolerance required for Double Ended Gauge.', field: 'minTolNOGO' });
  }

  const ms = [entry.frontMeasurement, entry.middleMeasurement, entry.endMeasurement].filter(m => m != null);

  // Rule 3: Tolerance violation
  if (entry.dimenGO != null && entry.minTolGO != null && ms.length > 0) {
    for (const m of ms) {
      const diff = Math.abs(m - entry.dimenGO);
      if (diff > entry.minTolGO) {
        w.push({ type: 'error', message: `Measurement ${m.toFixed(4)} exceeds GO tolerance (±${entry.minTolGO}). Deviation: ${diff.toFixed(4)}`, field: 'measurement' });
        break;
      }
    }
  }

  // Rule 4: Abnormal pattern
  if (ms.length >= 2) {
    const avg = ms.reduce((s, v) => s + v, 0) / ms.length;
    for (const m of ms) {
      if (Math.abs(m - avg) > 0.01) {
        w.push({ type: 'warn', message: 'Possible abnormal calibration pattern detected. Reading deviates significantly from average.', field: 'measurement' });
        break;
      }
    }
  }

  // Rule 5: Inconsistent readings
  if (entry.frontMeasurement != null && entry.middleMeasurement != null && entry.endMeasurement != null) {
    const { consistent, maxDeviation } = measurementConsistency(entry.frontMeasurement, entry.middleMeasurement, entry.endMeasurement);
    if (!consistent) w.push({ type: 'warn', message: `Front/middle/end inconsistent. Max deviation: ${maxDeviation.toFixed(4)} mm.`, field: 'measurement' });
  }

  // Rule 6: Wear limit proximity
  if (entry.dimenGO != null && entry.wearLimGO > 0 && ms.length > 0) {
    for (const m of ms) {
      const { nearWearLimit, percentage } = checkWearLimitProximity(m, entry.dimenGO, entry.wearLimGO);
      if (nearWearLimit) { w.push({ type: 'warn', message: `Gauge approaching wear limit (${percentage.toFixed(1)}%). Consider replacement.`, field: 'wearLimGO' }); break; }
    }
  }

  // Rule 7: Typing mistakes
  if (entry.dimenGO > 0 && ms.length > 0) {
    for (const m of ms) {
      const ratio = m / entry.dimenGO;
      if (ratio > 2 || ratio < 0.5) { w.push({ type: 'error', message: `Suspicious value ${m}. Possible typing error — far from standard ${entry.dimenGO}.`, field: 'measurement' }); break; }
    }
  }

  // Rule 8: Invalid periodicity
  if (isGauge(entry.type) && (!entry.periodicityGO || !entry.periodicityNOGO)) {
    w.push({ type: 'info', message: 'Periodicity not auto-calculated. Ensure tolerance and wear limit values.', field: 'periodicity' });
  }

  // Rule 9: Measurement jumps from previous
  if (entry._previousMeasurement != null && ms.length > 0) {
    const currentAvg = ms.reduce((s, v) => s + v, 0) / ms.length;
    const jump = Math.abs(currentAvg - entry._previousMeasurement);
    if (jump > 0.02) w.push({ type: 'warn', message: `Significant measurement jump from previous (Δ${jump.toFixed(4)} mm).`, field: 'measurement' });
  }

  // Rule 10: Incomplete submission
  if (ms.length > 0 && ms.length < 3) w.push({ type: 'info', message: `${ms.length}/3 measurements entered. Complete all readings.`, field: 'measurement' });
  if (ms.length === 0 && entry.type) w.push({ type: 'info', message: 'No measurements entered yet.', field: 'measurement' });

  // Rule 11: High tolerance
  if (entry.minTolGO > 0.05) w.push({ type: 'warn', message: `GO tolerance ${entry.minTolGO} unusually high.`, field: 'minTolGO' });

  // Rule 12: Wear limit exceeds tolerance
  if (entry.wearLimGO > 0 && entry.minTolGO > 0 && entry.wearLimGO > entry.minTolGO) {
    w.push({ type: 'warn', message: 'Wear limit exceeds tolerance — immediate attention needed.', field: 'wearLimGO' });
  }

  return w;
}

export function hasBlockingErrors(entry) {
  return runValidation(entry).some(w => w.type === 'error');
}

export function getValidationSummary(entry) {
  const items = runValidation(entry);
  return { errors: items.filter(w => w.type === 'error').length, warnings: items.filter(w => w.type === 'warn').length, info: items.filter(w => w.type === 'info').length, total: items.length, items };
}
