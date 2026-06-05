// Status code master data
export const STATUS_CODES = {
  1: 'Calibration Lab',
  2: 'Tool Room',
  3: 'Production',
  4: 'Inspection',
  5: 'Rejected',
  6: 'Under Maintenance',
};

export const STATUS_COLORS = {
  1: { bg: '#dbeafe', text: '#1e40af' },
  2: { bg: '#f1f5f9', text: '#475569' },
  3: { bg: '#dcfce7', text: '#15803d' },
  4: { bg: '#fef3c7', text: '#92400e' },
  5: { bg: '#fee2e2', text: '#b91c1c' },
  6: { bg: '#f3e8ff', text: '#7e22ce' },
};

export const STATUS_LIST = Object.entries(STATUS_CODES).map(([k, v]) => ({
  value: Number(k), label: `${k} — ${v}`,
}));
