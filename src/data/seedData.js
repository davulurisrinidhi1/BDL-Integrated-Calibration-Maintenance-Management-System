/**
 * Versioned localStorage seeding — seeds mock data on first run.
 * Keys use _v1 suffix for safe future migration.
 */
import { MOCK_USERS } from './mockUsers.js';
import { MOCK_MATERIAL_CODES } from './mockMaterialCodes.js';
import { MOCK_CALIBRATION_ENTRIES } from './mockCalibrationEntries.js';
import { formatDate } from '../utils/helpers.js';

const DATA_VERSION = 'v1';
const VERSION_KEY = `bdl_dataVersion`;

function key(name) { return `${name}_${DATA_VERSION}`; }

const INITIAL_AUDIT_LOGS = [
  { id: 'AL001', action: 'LOGIN', user: 'ADMIN001', role: 'Admin', detail: 'Admin logged in', timestamp: new Date(Date.now() - 9 * 86400000).toISOString() },
  { id: 'AL002', action: 'CREATE', user: 'CAL001', role: 'Calibration Operator', detail: 'Created calibration entry CE001 — TPG Gauge TPG101', timestamp: new Date(Date.now() - 8 * 86400000).toISOString() },
  { id: 'AL003', action: 'CREATE', user: 'CAL001', role: 'Calibration Operator', detail: 'Created calibration entry CE002 — Double Ended Gauge DEG201', timestamp: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: 'AL004', action: 'CERT_GEN', user: 'CAL001', role: 'Calibration Operator', detail: 'Certificate CERT-2025-001 generated for CE001', timestamp: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: 'AL005', action: 'CREATE', user: 'CAL002', role: 'Calibration Operator', detail: 'Created calibration entry CE003 — TPG Gauge TPG102A (REJECTED)', timestamp: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 'AL006', action: 'EXPORT', user: 'ADMIN001', role: 'Admin', detail: 'Exported calibration report — Excel format', timestamp: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: 'AL007', action: 'CREATE', user: 'CAL001', role: 'Calibration Operator', detail: 'Created calibration entry CE004 — Vernier Calipers VC001', timestamp: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'AL008', action: 'CERT_GEN', user: 'CAL001', role: 'Calibration Operator', detail: 'Certificate CERT-2025-002 generated for CE004', timestamp: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'AL009', action: 'CREATE', user: 'CAL002', role: 'Calibration Operator', detail: 'Created calibration entry CE005 — Outside Micrometer OM001', timestamp: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'AL010', action: 'LOGIN', user: 'QI001', role: 'Quality Inspector', detail: 'Inspector logged in for review', timestamp: new Date(Date.now() - 1 * 86400000).toISOString() },
];

const INITIAL_CERTIFICATES = [
  { id: 'CERT-2025-001', entryId: 'CE001', materialCode: 'TPG101', gaugeNo: 'TPG101-G01', type: 'TPG Gauge', result: 'ACCEPTED', generatedBy: 'CAL001', generatedAt: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: 'CERT-2025-002', entryId: 'CE004', materialCode: 'VC001', gaugeNo: 'VC001-G01', type: 'Vernier Calipers', result: 'ACCEPTED', generatedBy: 'CAL001', generatedAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'CERT-2025-003', entryId: 'CE005', materialCode: 'OM001', gaugeNo: 'OM001-G01', type: 'Outside Micrometer', result: 'ACCEPTED', generatedBy: 'CAL002', generatedAt: new Date(Date.now() - 1 * 86400000).toISOString() },
];

const INITIAL_EXPORT_HISTORY = [
  { id: 'EX001', exportType: 'Excel', reportType: 'Calibration Entries', exportedBy: 'ADMIN001', timestamp: new Date(Date.now() - 4 * 86400000).toISOString(), recordCount: 7 },
];

const INITIAL_CALIBRATION_HISTORY = [
  { id: 'CH001', gaugeNo: 'TPG101-G01', materialCode: 'TPG101', description: 'TPG Gauge M10 x 1.5', upperTolerance: 0.006, lowerTolerance: -0.006, wearLimit: 0.006, calibrationDate: formatDate(new Date(Date.now() - 100 * 86400000)), front: 8.378, middle: 8.377, end: 8.377, result: 'ACCEPTED' },
  { id: 'CH002', gaugeNo: 'TPG101-G01', materialCode: 'TPG101', description: 'TPG Gauge M10 x 1.5', upperTolerance: 0.006, lowerTolerance: -0.006, wearLimit: 0.006, calibrationDate: formatDate(new Date(Date.now() - 10 * 86400000)), front: 8.377, middle: 8.377, end: 8.378, result: 'ACCEPTED' },
  { id: 'CH003', gaugeNo: 'DEG201-G01', materialCode: 'DEG201', description: 'Double Ended Gauge H7 12mm', upperTolerance: 0.005, lowerTolerance: -0.005, wearLimit: 0.006, calibrationDate: formatDate(new Date(Date.now() - 90 * 86400000)), front: 12.004, middle: 12.005, end: 12.004, result: 'ACCEPTED' },
  { id: 'CH004', gaugeNo: 'DEG201-G01', materialCode: 'DEG201', description: 'Double Ended Gauge H7 12mm', upperTolerance: 0.005, lowerTolerance: -0.005, wearLimit: 0.006, calibrationDate: formatDate(new Date(Date.now() - 5 * 86400000)), front: 12.007, middle: 12.009, end: 12.008, result: 'ACCEPTED' },
  { id: 'CH005', gaugeNo: 'VC001-G01', materialCode: 'VC001', description: 'Vernier Calipers 0–150 mm', upperTolerance: 0.005, lowerTolerance: -0.005, wearLimit: 0.006, calibrationDate: formatDate(new Date(Date.now() - 45 * 86400000)), front: 5.003, middle: 5.004, end: 5.003, result: 'ACCEPTED' },
  { id: 'CH006', gaugeNo: 'OM001-G01', materialCode: 'OM001', description: 'Outside Micrometer 0–25 mm', upperTolerance: 0.004, lowerTolerance: -0.004, wearLimit: 0.005, calibrationDate: formatDate(new Date(Date.now() - 120 * 86400000)), front: 25.002, middle: 25.003, end: 25.002, result: 'ACCEPTED' },
  { id: 'CH007', gaugeNo: 'TPG102A-G01', materialCode: 'TPG102A', description: 'TPG Gauge M12 x 1.75', upperTolerance: 0.009, lowerTolerance: -0.009, wearLimit: 0.010, calibrationDate: formatDate(new Date(Date.now() - 3 * 86400000)), front: 12.015, middle: 12.016, end: 12.014, result: 'REJECTED' },
];

export function seedLocalStorage() {
  const storedVersion = localStorage.getItem(VERSION_KEY);
  if (storedVersion === DATA_VERSION) return; // Already seeded

  localStorage.setItem(key('users'), JSON.stringify(MOCK_USERS));
  localStorage.setItem(key('materialCodes'), JSON.stringify(MOCK_MATERIAL_CODES));
  localStorage.setItem(key('calibrationEntries'), JSON.stringify(MOCK_CALIBRATION_ENTRIES));
  localStorage.setItem(key('auditLogs'), JSON.stringify(INITIAL_AUDIT_LOGS));
  localStorage.setItem(key('certificates'), JSON.stringify(INITIAL_CERTIFICATES));
  localStorage.setItem(key('exportHistory'), JSON.stringify(INITIAL_EXPORT_HISTORY));
  localStorage.setItem(key('calibrationHistory'), JSON.stringify(INITIAL_CALIBRATION_HISTORY));
  localStorage.setItem(VERSION_KEY, DATA_VERSION);
}
