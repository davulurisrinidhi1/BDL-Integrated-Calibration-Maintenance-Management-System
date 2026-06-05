// Crib number master data
export const CRIB_CODES = {
  101: 'Assembly Division',
  102: 'Quality Division',
  103: 'Machine Shop',
  104: 'Tool Storage',
  105: 'Production Line',
};

export const CRIB_LIST = Object.entries(CRIB_CODES).map(([k, v]) => ({
  value: Number(k), label: `${k} — ${v}`,
}));
