// Periodicity lookup tables from BDL standards

export const THREAD_GAUGE_PERIODICITY = [
  { wearAllowanceFrom: 0,      wearAllowanceTo: 0.008,  goWeeks: 6,  nogoWeeks: 12 },
  { wearAllowanceFrom: 0.008,  wearAllowanceTo: 0.0125, goWeeks: 8,  nogoWeeks: 16 },
  { wearAllowanceFrom: 0.0125, wearAllowanceTo: 0.0175, goWeeks: 12, nogoWeeks: 24 },
  { wearAllowanceFrom: 0.0175, wearAllowanceTo: 0.027,  goWeeks: 16, nogoWeeks: 32 },
  { wearAllowanceFrom: 0.027,  wearAllowanceTo: 0.033,  goWeeks: 20, nogoWeeks: 40 },
];

export const PLAIN_GAUGE_PERIODICITY = [
  { toleranceFrom: 0,    toleranceTo: 0.01,  goWeeks: 4,  nogoWeeks: 8  },
  { toleranceFrom: 0.01, toleranceTo: 0.03,  goWeeks: 6,  nogoWeeks: 12 },
  { toleranceFrom: 0.03, toleranceTo: 0.05,  goWeeks: 10, nogoWeeks: 20 },
  { toleranceFrom: 0.05, toleranceTo: 0.1,   goWeeks: 16, nogoWeeks: 32 },
  { toleranceFrom: 0.1,  toleranceTo: 0.2,   goWeeks: 24, nogoWeeks: 48 },
  { toleranceFrom: 0.2,  toleranceTo: Infinity, goWeeks: 48, nogoWeeks: 96 },
];

// Instruments (Vernier, Micrometer etc.) — based on least count
export const INSTRUMENT_PERIODICITY = {
  lowLC:  { label: 'LC < 0.01', months: 6  },
  highLC: { label: 'LC ≥ 0.01', months: 12 },
  general: { label: 'General',  months: 12 },
};
