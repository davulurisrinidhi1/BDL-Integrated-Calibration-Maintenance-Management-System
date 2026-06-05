/**
 * ── CENTRALIZED MEASUREMENT RULE ENGINE ──────────────────────────
 *
 * ALL calibration calculations originate from this single module.
 * Designed for future Spring Boot migration and SAP integration.
 *
 * NO component should duplicate this logic.
 */

import {
  THREAD_GAUGE_PERIODICITY,
  PLAIN_GAUGE_PERIODICITY,
  INSTRUMENT_PERIODICITY,
} from '../data/periodicityTables.js';

// ── Instrument classification ──────────────────────────────────
export const GAUGE_TYPES = ['TPG Gauge', 'Double Ended Gauge'];
export const INSTRUMENT_TYPES_LIST = ['Vernier Calipers', 'Outside Micrometer'];

export function isGauge(type) {
  return GAUGE_TYPES.includes(type);
}

export function isInstrument(type) {
  return INSTRUMENT_TYPES_LIST.includes(type);
}

export function isThreadGauge(type) {
  return type === 'TPG Gauge';
}

export function isPlainGauge(type) {
  return type === 'Double Ended Gauge';
}

// ── Periodicity calculation ────────────────────────────────────
/**
 * Calculate calibration periodicity based on type and tolerance/wear values.
 * @returns {{ goWeeks: number, nogoWeeks: number, label: string }}
 */
export function calculatePeriodicity(type, toleranceGO, wearAllowanceGO, leastCount) {
  if (isThreadGauge(type)) {
    const wa = wearAllowanceGO || 0;
    for (const row of THREAD_GAUGE_PERIODICITY) {
      if (wa >= row.wearAllowanceFrom && wa < row.wearAllowanceTo) {
        return {
          goWeeks: row.goWeeks,
          nogoWeeks: row.nogoWeeks,
          label: `GO: ${row.goWeeks} wks | NOGO: ${row.nogoWeeks} wks`,
        };
      }
    }
    // Default for thread gauges outside range
    return { goWeeks: 20, nogoWeeks: 40, label: 'GO: 20 wks | NOGO: 40 wks' };
  }

  if (isPlainGauge(type)) {
    const tol = toleranceGO || 0;
    for (const row of PLAIN_GAUGE_PERIODICITY) {
      if (tol >= row.toleranceFrom && tol < row.toleranceTo) {
        return {
          goWeeks: row.goWeeks,
          nogoWeeks: row.nogoWeeks,
          label: `GO: ${row.goWeeks} wks | NOGO: ${row.nogoWeeks} wks`,
        };
      }
    }
    return { goWeeks: 48, nogoWeeks: 96, label: 'GO: 48 wks | NOGO: 96 wks' };
  }

  // Instruments — use least count
  if (isInstrument(type)) {
    if (leastCount != null && leastCount < 0.01) {
      return {
        goWeeks: INSTRUMENT_PERIODICITY.lowLC.months * 4.33,
        nogoWeeks: INSTRUMENT_PERIODICITY.lowLC.months * 4.33,
        label: `${INSTRUMENT_PERIODICITY.lowLC.months} months`,
      };
    }
    return {
      goWeeks: INSTRUMENT_PERIODICITY.highLC.months * 4.33,
      nogoWeeks: INSTRUMENT_PERIODICITY.highLC.months * 4.33,
      label: `${INSTRUMENT_PERIODICITY.highLC.months} months`,
    };
  }

  return { goWeeks: 26, nogoWeeks: 26, label: '6 months' };
}

// ── Tolerance validation ───────────────────────────────────────
/**
 * Check if a measured value is within tolerance of the standard dimension.
 * @returns {'WITHIN_TOLERANCE' | 'OUT_OF_TOLERANCE'}
 */
export function checkTolerance(measured, standard, tolerance) {
  if (measured == null || standard == null || tolerance == null) return null;
  const diff = Math.abs(measured - standard);
  return diff <= tolerance ? 'WITHIN_TOLERANCE' : 'OUT_OF_TOLERANCE';
}

// ── Validation result calculation ──────────────────────────────
/**
 * Calculate validation result from measurements and standard values.
 * @returns {'PASS' | 'FAIL' | 'WITHIN TOLERANCE' | 'OUT OF TOLERANCE'}
 */
export function calculateValidationResult(entry) {
  const { dimenGO, minTolGO, dimenNOGO, minTolNOGO, frontMeasurement, middleMeasurement, endMeasurement, type } = entry;

  if (frontMeasurement == null && middleMeasurement == null && endMeasurement == null) {
    return null;
  }

  const measurements = [frontMeasurement, middleMeasurement, endMeasurement].filter(m => m != null);
  if (measurements.length === 0) return null;

  // Check each measurement against GO dimension and tolerance
  const goTolerance = minTolGO || 0;
  const nogoTolerance = minTolNOGO || 0;

  let allWithinGO = true;
  let allWithinNOGO = true;

  for (const m of measurements) {
    if (dimenGO != null) {
      const diffGO = Math.abs(m - dimenGO);
      if (diffGO > goTolerance) allWithinGO = false;
    }
    if (dimenNOGO != null) {
      const diffNOGO = Math.abs(m - dimenNOGO);
      if (diffNOGO > nogoTolerance) allWithinNOGO = false;
    }
  }

  if (allWithinGO) return 'PASS';
  if (!allWithinGO && !allWithinNOGO) return 'FAIL';
  return 'WITHIN TOLERANCE';
}

// ── Acceptance status calculation ──────────────────────────────
/**
 * Calculate acceptance status.
 * @returns {'ACCEPTED' | 'REJECTED' | 'WEAR LIMIT'}
 */
export function calculateAcceptanceStatus(entry) {
  const { dimenGO, minTolGO, wearLimGO, frontMeasurement, middleMeasurement, endMeasurement, type } = entry;

  if (frontMeasurement == null && middleMeasurement == null && endMeasurement == null) {
    return null;
  }

  const measurements = [frontMeasurement, middleMeasurement, endMeasurement].filter(m => m != null);
  if (measurements.length === 0) return null;

  const goTolerance = minTolGO || 0;
  const wearLimit = wearLimGO || 0;

  for (const m of measurements) {
    const diff = Math.abs(m - (dimenGO || 0));

    // Check if measurement exceeds tolerance → REJECTED
    if (diff > goTolerance) {
      return 'REJECTED';
    }
  }

  // Check wear limit condition
  if (wearLimit > 0) {
    for (const m of measurements) {
      const diff = Math.abs(m - (dimenGO || 0));
      // If measurement is within tolerance but approaching wear limit
      if (diff >= wearLimit * 0.85) {
        return 'WEAR LIMIT';
      }
    }
  }

  return 'ACCEPTED';
}

// ── GO/NOGO validation for Double Ended Gauge ──────────────────
/**
 * Validate that Double Ended Gauge has both GO and NOGO values.
 * @returns {boolean}
 */
export function requiresBothGoNogo(type) {
  return type === 'Double Ended Gauge';
}

export function validateGoNogo(entry) {
  if (!requiresBothGoNogo(entry.type)) return true;
  return (
    entry.dimenGO != null && entry.dimenGO !== '' &&
    entry.dimenNOGO != null && entry.dimenNOGO !== '' &&
    entry.minTolGO != null && entry.minTolGO !== '' &&
    entry.minTolNOGO != null && entry.minTolNOGO !== ''
  );
}

// ── Measurement consistency check ──────────────────────────────
/**
 * Check if front/middle/end measurements are consistent.
 * Returns the max deviation between any two readings.
 */
export function measurementConsistency(front, middle, end) {
  const vals = [front, middle, end].filter(v => v != null);
  if (vals.length < 2) return { consistent: true, maxDeviation: 0 };
  const max = Math.max(...vals);
  const min = Math.min(...vals);
  const deviation = max - min;
  // More than 0.005 difference is suspicious
  return { consistent: deviation <= 0.005, maxDeviation: deviation };
}

// ── Wear limit proximity check ─────────────────────────────────
/**
 * Check how close the current measurement is to the wear limit.
 * @returns {{ nearWearLimit: boolean, percentage: number }}
 */
export function checkWearLimitProximity(measured, standard, wearLimit) {
  if (measured == null || standard == null || wearLimit == null || wearLimit === 0) {
    return { nearWearLimit: false, percentage: 0 };
  }
  const diff = Math.abs(measured - standard);
  const percentage = (diff / wearLimit) * 100;
  return { nearWearLimit: percentage >= 80, percentage };
}

// ── Full entry recalculation ───────────────────────────────────
/**
 * Recalculate all computed fields for an entry.
 * Used after any field edit to keep everything consistent.
 */
export function recalculateEntry(entry, materialData) {
  const updated = { ...entry };

  // Auto-populate from material data if available
  if (materialData) {
    if (updated.dimenGO == null || updated.dimenGO === '') updated.dimenGO = materialData.standardDimenGO;
    if (updated.dimenNOGO == null || updated.dimenNOGO === '') updated.dimenNOGO = materialData.standardDimenNOGO;
    if (updated.minTolGO == null || updated.minTolGO === '') updated.minTolGO = materialData.toleranceGO;
    if (updated.minTolNOGO == null || updated.minTolNOGO === '') updated.minTolNOGO = materialData.toleranceNOGO;
    if (updated.wearLimGO == null || updated.wearLimGO === '') updated.wearLimGO = materialData.wearAllowanceGO;
    if (updated.wearLimNOGO == null || updated.wearLimNOGO === '') updated.wearLimNOGO = materialData.wearAllowanceNOGO;
  }

  // Recalculate periodicity
  const periodicity = calculatePeriodicity(
    updated.type,
    updated.minTolGO,
    updated.wearLimGO,
    materialData?.leastCount
  );
  updated.periodicity = periodicity.label;
  updated.periodicityGO = Math.round(periodicity.goWeeks);
  updated.periodicityNOGO = Math.round(periodicity.nogoWeeks);

  // Recalculate validation result
  updated.validationResult = calculateValidationResult(updated) || updated.validationResult;

  // Recalculate acceptance status
  updated.acceptanceStatus = calculateAcceptanceStatus(updated) || updated.acceptanceStatus;

  return updated;
}
