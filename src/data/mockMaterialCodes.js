export const INSTRUMENT_TYPES = [
  'Vernier Calipers',
  'Outside Micrometer',
  'TPG Gauge',
  'Double Ended Gauge',
];

// materialCode → productType: 'standard' (numeric) or 'customized' (alphanumeric)
export const MOCK_MATERIAL_CODES = [
  {
    id: 'mc1', code: 'VC001', type: 'Vernier Calipers', productType: 'customized',
    variants: ['0–150 mm', '0–300 mm', 'Digital Vernier'],
    leastCount: 0.02, standardDimenGO: 5.000, standardDimenNOGO: 5.025,
    toleranceGO: 0.005, toleranceNOGO: 0.005, wearAllowanceGO: 0.006, wearAllowanceNOGO: 0.006,
  },
  {
    id: 'mc2', code: 'VC002', type: 'Vernier Calipers', productType: 'customized',
    variants: ['0–150 mm', '0–200 mm'],
    leastCount: 0.05, standardDimenGO: 10.000, standardDimenNOGO: 10.050,
    toleranceGO: 0.008, toleranceNOGO: 0.008, wearAllowanceGO: 0.009, wearAllowanceNOGO: 0.009,
  },
  {
    id: 'mc3', code: 'OM001', type: 'Outside Micrometer', productType: 'customized',
    variants: ['0–25 mm', '25–50 mm', '50–75 mm', '75–100 mm'],
    leastCount: 0.01, standardDimenGO: 25.000, standardDimenNOGO: 25.025,
    toleranceGO: 0.004, toleranceNOGO: 0.004, wearAllowanceGO: 0.005, wearAllowanceNOGO: 0.005,
  },
  {
    id: 'mc4', code: 'OM002', type: 'Outside Micrometer', productType: 'customized',
    variants: ['0–25 mm', '25–50 mm'],
    leastCount: 0.001, standardDimenGO: 50.000, standardDimenNOGO: 50.025,
    toleranceGO: 0.003, toleranceNOGO: 0.003, wearAllowanceGO: 0.004, wearAllowanceNOGO: 0.004,
  },
  {
    id: 'mc5', code: 'TPG101', type: 'TPG Gauge', productType: 'customized',
    variants: ['M6 x 1.0', 'M8 x 1.25', 'M10 x 1.5'],
    leastCount: null, standardDimenGO: 8.376, standardDimenNOGO: 8.376,
    toleranceGO: 0.006, toleranceNOGO: 0.006, wearAllowanceGO: 0.006, wearAllowanceNOGO: 0.006,
  },
  {
    id: 'mc6', code: 'TPG102A', type: 'TPG Gauge', productType: 'customized',
    variants: ['M12 x 1.75', 'M14 x 2.0', 'M16 x 2.0'],
    leastCount: null, standardDimenGO: 12.000, standardDimenNOGO: 12.000,
    toleranceGO: 0.009, toleranceNOGO: 0.009, wearAllowanceGO: 0.010, wearAllowanceNOGO: 0.010,
  },
  {
    id: 'mc7', code: '102455', type: 'TPG Gauge', productType: 'standard',
    variants: ['M20 x 2.5', 'M24 x 3.0'],
    leastCount: null, standardDimenGO: 20.000, standardDimenNOGO: 20.000,
    toleranceGO: 0.012, toleranceNOGO: 0.012, wearAllowanceGO: 0.013, wearAllowanceNOGO: 0.013,
  },
  {
    id: 'mc8', code: 'DEG201', type: 'Double Ended Gauge', productType: 'customized',
    variants: ['H7 12mm', 'H7 15mm', 'H7 20mm'],
    leastCount: null, standardDimenGO: 12.000, standardDimenNOGO: 12.018,
    toleranceGO: 0.005, toleranceNOGO: 0.005, wearAllowanceGO: 0.006, wearAllowanceNOGO: 0.006,
  },
  {
    id: 'mc9', code: '305678', type: 'Double Ended Gauge', productType: 'standard',
    variants: ['H6 25mm', 'H6 30mm', 'H6 40mm'],
    leastCount: null, standardDimenGO: 25.000, standardDimenNOGO: 25.013,
    toleranceGO: 0.007, toleranceNOGO: 0.007, wearAllowanceGO: 0.008, wearAllowanceNOGO: 0.008,
  },
  {
    id: 'mc10', code: 'DEG202', type: 'Double Ended Gauge', productType: 'customized',
    variants: ['H8 50mm', 'H8 60mm'],
    leastCount: null, standardDimenGO: 50.000, standardDimenNOGO: 50.046,
    toleranceGO: 0.010, toleranceNOGO: 0.010, wearAllowanceGO: 0.012, wearAllowanceNOGO: 0.012,
  },
];
