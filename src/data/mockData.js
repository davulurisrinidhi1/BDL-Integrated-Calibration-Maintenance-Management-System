import { generateId, formatDate, generateCertNumber } from '../utils/helpers.js';

const now = new Date();
const subDays = (d, days) => {
  const res = new Date(d);
  res.setDate(res.getDate() - days);
  return res.toISOString();
};

export const MOCK_USERS = [
  { id: 'u1', employeeId: 'ADMIN001', name: 'Arjun Sharma', role: 'Admin', department: 'Quality Control', status: 'Active', lastLogin: '2026-05-13 09:15', password: 'admin123' },
  { id: 'u2', employeeId: 'CAL001', name: 'Suresh Kumar', role: 'Calibration Operator', department: 'Metrology Lab', status: 'Active', lastLogin: '2026-05-13 10:30', password: 'cal123' },
  { id: 'u3', employeeId: 'QA001', name: 'Priyanka Rao', role: 'Quality Inspector', department: 'Precision Engineering', status: 'Active', lastLogin: '2026-05-12 16:45', password: 'qa123' },
  { id: 'u4', employeeId: 'BDL-112', name: 'Vikram Singh', role: 'Calibration Operator', department: 'Metrology Lab', status: 'Disabled', lastLogin: '2026-04-30 11:20', password: 'password1' }
];

export const MOCK_ENTRIES = [
  {
    id: 'CE-001', sno: 1, type: 'TPG Gauge', materialCode: 'TPG101', gaugeNo: 'BDL/TPG/788',
    calibrationDate: formatDate(subDays(now, 15)), periodicity: '26 Weeks',
    nextDueDateGO: formatDate(subDays(now, -167)), nextDueDateNOGO: formatDate(subDays(now, -167)),
    status: 'S1', cribNo: 'C01', dimenGO: 8.376, minTolGO: 0.006, wearLimGO: 0.006,
    validationResult: 'PASS', acceptanceStatus: 'ACCEPTED', certGenerated: true, certId: 'CERT-2026-001'
  },
  {
    id: 'CE-002', sno: 2, type: 'Vernier Calipers', materialCode: 'VC001', gaugeNo: 'BDL/VC/102',
    calibrationDate: formatDate(subDays(now, 5)), periodicity: '52 Weeks',
    nextDueDateGO: formatDate(subDays(now, -360)), nextDueDateNOGO: formatDate(subDays(now, -360)),
    status: 'S2', cribNo: 'C02', dimenGO: 150.00, minTolGO: 0.02, wearLimGO: 0.02,
    validationResult: 'PASS', acceptanceStatus: 'ACCEPTED', certGenerated: false
  },
  {
    id: 'CE-003', sno: 3, type: 'Outside Micrometer', materialCode: 'OM001', gaugeNo: 'BDL/OM/205',
    calibrationDate: formatDate(subDays(now, 2)), periodicity: '26 Weeks',
    nextDueDateGO: formatDate(subDays(now, -180)), nextDueDateNOGO: formatDate(subDays(now, -180)),
    status: 'S1', cribNo: 'C01', dimenGO: 25.004, minTolGO: 0.001, wearLimGO: 0.001,
    validationResult: 'FAIL', acceptanceStatus: 'REJECTED', certGenerated: false
  },
  {
    id: 'CE-004', sno: 4, type: 'Double Ended Gauge', materialCode: 'DEG201', gaugeNo: 'BDL/DEG/015',
    calibrationDate: formatDate(subDays(now, 180)), periodicity: '26 Weeks',
    nextDueDateGO: formatDate(subDays(now, 2)), nextDueDateNOGO: formatDate(subDays(now, 2)),
    status: 'S3', cribNo: 'C03', dimenGO: 12.000, minTolGO: 0.005, wearLimGO: 0.006,
    validationResult: 'PASS', acceptanceStatus: 'WEAR LIMIT', certGenerated: true, certId: 'CERT-2026-002'
  }
];

export const MOCK_AUDIT_LOGS = [
  { id: 'AL-001', action: 'LOGIN', user: 'BDL-001', role: 'Admin', detail: 'User logged into terminal successfully', timestamp: subDays(now, 0.1) },
  { id: 'AL-002', action: 'CREATE', user: 'BDL-042', role: 'Calibration Operator', detail: 'Created entry CE-003 — Outside Micrometer OM001', timestamp: subDays(now, 2) },
  { id: 'AL-003', action: 'CERT_GEN', user: 'BDL-001', role: 'Admin', detail: 'Certificate CERT-2026-001 generated for CE-001', timestamp: subDays(now, 15) },
  { id: 'AL-004', action: 'EXPORT', user: 'BDL-089', role: 'Quality Inspector', detail: 'Exported Monthly Report — EXCEL (45 records)', timestamp: subDays(now, 3) }
];
