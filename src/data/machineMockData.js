import { generateId, formatDate } from '../utils/helpers.js';

const now = new Date();
const subDays = (d, days) => {
  const res = new Date(d);
  res.setDate(res.getDate() - days);
  return res.toISOString();
};

export const MOCK_MACHINE_ASSETS = [
  { id: 'M-001', code: 'AC-COMP-001', type: 'AC Compressor', description: 'Main Assembly Compressor 1', department: 'Production', status: 'Active', periodicity: '3 Months (SM), 1 Year (PM)', group: 'COMP-GRP', stc: 'MECH', lastActivity: formatDate(subDays(now, 10)), nextDueDate: formatDate(subDays(now, -80)) },
  { id: 'M-002', code: 'CENTRAL-AC-002', type: 'Central AC', description: 'Central HVAC Unit A', department: 'Facility', status: 'Active', periodicity: '3 Months (SM), 1 Year (PM)', group: 'AIR-GRP', stc: 'HVAC', lastActivity: formatDate(subDays(now, 45)), nextDueDate: formatDate(subDays(now, -45)) }
];

export const MOCK_MACHINE_TASKS = [
  // AC Compressor Tasks
  { id: 'MT-001', code: 'AC-COMP-001', ctr: 'TL-001', description: 'Air Filter Cleaning', pht: '2 HRS', det: 'Shutdown', strategy: 'SM', engineer: 'Ravi Kumar', frequency: 'Monthly', status: 'Active' },
  { id: 'MT-002', code: 'AC-COMP-001', ctr: 'TL-002', description: 'Pressure Valve Inspection', pht: '1.5 HRS', det: 'Running', strategy: 'PM', engineer: 'Suresh Patel', frequency: 'Quarterly', status: 'Scheduled' },
  { id: 'MT-003', code: 'AC-COMP-001', ctr: 'TL-003', description: 'Compressor Oil Level Check', pht: '1 HR', det: 'Shutdown', strategy: 'SM', engineer: 'Srikanth', frequency: 'Daily', status: 'Completed' },
  { id: 'MT-004', code: 'AC-COMP-001', ctr: 'TL-004', description: 'Motor Bearing Inspection', pht: '3 HRS', det: 'Shutdown', strategy: 'PM', engineer: 'Naresh', frequency: 'Quarterly', status: 'Active' },
  { id: 'MT-005', code: 'AC-COMP-001', ctr: 'TL-005', description: 'Air Pressure Validation', pht: '2 HRS', det: 'Running', strategy: 'SM', engineer: 'Kiran', frequency: 'Weekly', status: 'Completed' },
  { id: 'MT-006', code: 'AC-COMP-001', ctr: 'TL-006', description: 'Cooling Line Leakage Check', pht: '5 HRS', det: 'Shutdown', strategy: 'PM', engineer: 'Mahesh', frequency: 'Monthly', status: 'Pending' },
  { id: 'MT-007', code: 'AC-COMP-001', ctr: 'TL-007', description: 'Safety Sensor Verification', pht: '1 HR', det: 'Running', strategy: 'SM', engineer: 'Praveen', frequency: 'Weekly', status: 'Active' },
  { id: 'MT-008', code: 'AC-COMP-001', ctr: 'TL-008', description: 'Compressor Housing Inspection', pht: '2 HRS', det: 'Shutdown', strategy: 'PM', engineer: 'Ajay', frequency: '6 Months', status: 'Scheduled' },
  
  // Central AC Tasks
  { id: 'MT-101', code: 'CENTRAL-AC-002', ctr: 'TL-101', description: 'Cooling Coil Cleaning', pht: '3 HRS', det: 'Shutdown', strategy: 'PM', engineer: 'Amit Verma', frequency: 'Quarterly', status: 'Active' },
  { id: 'MT-102', code: 'CENTRAL-AC-002', ctr: 'TL-102', description: 'Refrigerant Level Check', pht: '2 HRS', det: 'Running', strategy: 'PM', engineer: 'Suresh', frequency: 'Quarterly', status: 'Pending' },
  { id: 'MT-103', code: 'CENTRAL-AC-002', ctr: 'TL-103', description: 'HVAC Filter Replacement', pht: '2 HRS', det: 'Shutdown', strategy: 'SM', engineer: 'Vivek', frequency: 'Monthly', status: 'Completed' },
  { id: 'MT-104', code: 'CENTRAL-AC-002', ctr: 'TL-104', description: 'Fan Motor Inspection', pht: '4 HRS', det: 'Shutdown', strategy: 'PM', engineer: 'Manoj', frequency: '6 Months', status: 'Active' },
  { id: 'MT-105', code: 'CENTRAL-AC-002', ctr: 'TL-105', description: 'Thermostat Calibration', pht: '1 HR', det: 'Running', strategy: 'SM', engineer: 'Deepak', frequency: 'Quarterly', status: 'Scheduled' },
  { id: 'MT-106', code: 'CENTRAL-AC-002', ctr: 'TL-106', description: 'Condenser Pressure Validation', pht: '3 HRS', det: 'Shutdown', strategy: 'PM', engineer: 'Ashok', frequency: 'Monthly', status: 'Pending' },
  { id: 'MT-107', code: 'CENTRAL-AC-002', ctr: 'TL-107', description: 'Duct Airflow Verification', pht: '2 HRS', det: 'Running', strategy: 'SM', engineer: 'Harish', frequency: 'Weekly', status: 'Active' },
  { id: 'MT-108', code: 'CENTRAL-AC-002', ctr: 'TL-108', description: 'R410A Refrigerant Inspection', pht: '5 HRS', det: 'Shutdown', strategy: 'PM', engineer: 'Ramesh', frequency: 'Yearly', status: 'Scheduled' }
];

export const MOCK_MACHINE_STRATEGIES = [
  // AC Compressor SM Strategies
  { id: 'MS-001', code: 'AC-COMP-001', type: 'SM', action: 'Filter Cleaning', frequency: 'Weekly', responsible: 'Maintenance Team', status: 'Active' },
  { id: 'MS-002', code: 'AC-COMP-001', type: 'SM', action: 'Air Pressure Check', frequency: 'Daily', responsible: 'Operator', status: 'Active' },
  { id: 'MS-003', code: 'AC-COMP-001', type: 'SM', action: 'Compressor Inspection', frequency: 'Monthly', responsible: 'Engineer', status: 'Pending' },
  
  // AC Compressor PM Strategies
  { id: 'MS-004', code: 'AC-COMP-001', type: 'PM', action: 'Motor Inspection', frequency: '6 Months', responsible: 'Maintenance Engineer', status: 'Scheduled' },
  { id: 'MS-005', code: 'AC-COMP-001', type: 'PM', action: 'Cooling Verification', frequency: '1 Year', responsible: 'HVAC Team', status: 'Pending' },
  { id: 'MS-006', code: 'AC-COMP-001', type: 'PM', action: 'Annual Performance Check', frequency: '1 Year', responsible: 'Quality Team', status: 'Scheduled' },
  
  // Central AC SM Strategies
  { id: 'MS-007', code: 'CENTRAL-AC-002', type: 'SM', action: 'Cooling Coil Cleaning', frequency: 'Weekly', responsible: 'HVAC Team', status: 'Active' },
  { id: 'MS-008', code: 'CENTRAL-AC-002', type: 'SM', action: 'Duct Pressure Validation', frequency: 'Daily', responsible: 'Operator', status: 'Completed' },
  
  // Central AC PM Strategies
  { id: 'MS-009', code: 'CENTRAL-AC-002', type: 'PM', action: 'Thermostat Calibration', frequency: 'Quarterly', responsible: 'HVAC Engineer', status: 'Scheduled' },
  { id: 'MS-010', code: 'CENTRAL-AC-002', type: 'PM', action: 'HVAC Filter Replacement', frequency: 'Yearly', responsible: 'Maintenance Lead', status: 'Planned' }
];

export const MOCK_MACHINE_SPARES = [
  // AC Compressor Spares
  { id: 'MSP-001', code: 'AC-COMP-001', partName: 'Air Filter', quantity: 12, threshold: 5, status: 'Available', vendor: 'Atlas Industrial', lastUpdated: '2026-06-03' },
  { id: 'MSP-002', code: 'AC-COMP-001', partName: 'Compressor Valve', quantity: 3, threshold: 2, status: 'Low Stock', vendor: 'Valve Tech', lastUpdated: '2026-06-01' },
  { id: 'MSP-003', code: 'AC-COMP-001', partName: 'Lubrication Oil Kit', quantity: 8, threshold: 4, status: 'Available', vendor: 'Shell Industrial', lastUpdated: '2026-05-30' },
  
  // Central AC Spares
  { id: 'MSP-004', code: 'CENTRAL-AC-002', partName: 'Cooling Fan Replacement', quantity: 5, threshold: 3, status: 'Available', vendor: 'HVAC Components', lastUpdated: '2026-05-30' },
  { id: 'MSP-005', code: 'CENTRAL-AC-002', partName: 'R410A Gas Refill', quantity: 4, threshold: 2, status: 'Available', vendor: 'CoolAir Solutions', lastUpdated: '2026-06-02' },
  { id: 'MSP-006', code: 'CENTRAL-AC-002', partName: 'Control Relay', quantity: 2, threshold: 3, status: 'Critical', vendor: 'ElectroTech', lastUpdated: '2026-05-28' }
];

export const MOCK_MACHINE_WORK_ORDERS = [
  // AC Compressor Work Orders
  { id: 'MWO-001', code: 'AC-COMP-001', order: 'ORD-501', systemStatus: 'CRTD', act: '0010', sop: 'SOP-01', workCtr: 'WC-01', plant: 'PL-1', co: 'C01', stTextK: 'Started', operationText: 'Compressor repair', longText: 'Fix broken seals on compressor 1', actualWork: '2', work: '3', un: 'H', duration: '3', cKey: 'CK1', actType: 'Mech', recipient: 'Eng1', unloadingPoint: 'Dock 2' },
  { id: 'MWO-002', code: 'AC-COMP-001', order: 'ORD-502', systemStatus: 'REL', act: '0020', sop: 'SOP-02', workCtr: 'WC-01', plant: 'PL-1', co: 'C01', stTextK: 'Released', operationText: 'Pressure recalibration', longText: 'Recalibrate pressure sensors', actualWork: '1', work: '2', un: 'H', duration: '2', cKey: 'CK1', actType: 'Mech', recipient: 'Eng2', unloadingPoint: 'Dock 2' },
  { id: 'MWO-003', code: 'AC-COMP-001', order: 'ORD-503', systemStatus: 'TECO', act: '0030', sop: 'SOP-03', workCtr: 'WC-01', plant: 'PL-1', co: 'C01', stTextK: 'Completed', operationText: 'Motor inspection', longText: 'Annual motor inspection', actualWork: '4', work: '4', un: 'H', duration: '4', cKey: 'CK1', actType: 'Elec', recipient: 'Eng3', unloadingPoint: 'Dock 2' },
  { id: 'MWO-004', code: 'AC-COMP-001', order: 'ORD-504', systemStatus: 'CRTD', act: '0040', sop: 'SOP-04', workCtr: 'WC-01', plant: 'PL-1', co: 'C01', stTextK: 'Pending', operationText: 'Oil kit change', longText: 'Change lubrication oil kit', actualWork: '0', work: '2', un: 'H', duration: '2', cKey: 'CK1', actType: 'Mech', recipient: 'Eng1', unloadingPoint: 'Dock 2' },

  // Central AC Work Orders
  { id: 'MWO-005', code: 'CENTRAL-AC-002', order: 'ORD-601', systemStatus: 'CRTD', act: '0010', sop: 'SOP-04', workCtr: 'WC-02', plant: 'PL-2', co: 'C01', stTextK: 'Started', operationText: 'Cooling system maintenance', longText: 'Flush cooling system', actualWork: '3', work: '5', un: 'H', duration: '5', cKey: 'CK2', actType: 'HVAC', recipient: 'Tech1', unloadingPoint: 'Roof 1' },
  { id: 'MWO-006', code: 'CENTRAL-AC-002', order: 'ORD-602', systemStatus: 'REL', act: '0020', sop: 'SOP-05', workCtr: 'WC-02', plant: 'PL-2', co: 'C01', stTextK: 'Released', operationText: 'HVAC servicing', longText: 'Perform regular HVAC servicing', actualWork: '2', work: '4', un: 'H', duration: '4', cKey: 'CK2', actType: 'HVAC', recipient: 'Tech2', unloadingPoint: 'Roof 1' },
  { id: 'MWO-007', code: 'CENTRAL-AC-002', order: 'ORD-603', systemStatus: 'TECO', act: '0030', sop: 'SOP-06', workCtr: 'WC-02', plant: 'PL-2', co: 'C01', stTextK: 'Completed', operationText: 'Condenser Inspection', longText: 'Inspect external condenser for damage', actualWork: '1', work: '2', un: 'H', duration: '2', cKey: 'CK2', actType: 'HVAC', recipient: 'Tech3', unloadingPoint: 'Roof 1' },
  { id: 'MWO-008', code: 'CENTRAL-AC-002', order: 'ORD-604', systemStatus: 'REL', act: '0040', sop: 'SOP-07', workCtr: 'WC-02', plant: 'PL-2', co: 'C01', stTextK: 'Released', operationText: 'Duct validation', longText: 'Validate duct pressure', actualWork: '3', work: '3', un: 'H', duration: '3', cKey: 'CK2', actType: 'HVAC', recipient: 'Tech1', unloadingPoint: 'Roof 1' }
];

export const MOCK_MAINTENANCE_ORDERS = [
  // AC Compressor SM Orders
  { id: 'MO-001', code: 'AC-COMP-001', orderNumber: 'SM-ORD-001', type: 'SM', description: 'Air filter cleaning', plannedDate: '2026-06-05', completedDate: '', engineer: 'Ravi Kumar', remarks: '', status: 'Scheduled' },
  { id: 'MO-002', code: 'AC-COMP-001', orderNumber: 'SM-ORD-002', type: 'SM', description: 'Air pressure monitoring', plannedDate: '2026-06-02', completedDate: '2026-06-02', engineer: 'Anil Rao', remarks: 'Pressure normal', status: 'Completed' },
  { id: 'MO-003', code: 'AC-COMP-001', orderNumber: 'SM-ORD-003', type: 'SM', description: 'Compressor oil level check', plannedDate: '2026-06-04', completedDate: '', engineer: 'Srikanth', remarks: '', status: 'Scheduled' },
  
  // AC Compressor PM Orders
  { id: 'MO-004', code: 'AC-COMP-001', orderNumber: 'PM-ORD-001', type: 'PM', description: 'Motor inspection', plannedDate: '2026-07-01', completedDate: '', engineer: 'Anand Rao', remarks: '', status: 'Scheduled' },
  { id: 'MO-005', code: 'AC-COMP-001', orderNumber: 'PM-ORD-002', type: 'PM', description: 'Cooling verification', plannedDate: '2027-01-15', completedDate: '', engineer: 'Suresh Babu', remarks: '', status: 'Scheduled' },
  { id: 'MO-006', code: 'AC-COMP-001', orderNumber: 'PM-ORD-003', type: 'PM', description: 'Annual performance check', plannedDate: '2027-06-01', completedDate: '', engineer: 'Anil Rao', remarks: '', status: 'Scheduled' },

  // Central AC SM Orders
  { id: 'MO-007', code: 'CENTRAL-AC-002', orderNumber: 'SM-ORD-101', type: 'SM', description: 'Cooling coil cleaning', plannedDate: '2026-06-04', completedDate: '', engineer: 'Priya Sharma', remarks: '', status: 'Scheduled' },
  { id: 'MO-008', code: 'CENTRAL-AC-002', orderNumber: 'SM-ORD-102', type: 'SM', description: 'Duct pressure validation', plannedDate: '2026-06-03', completedDate: '2026-06-03', engineer: 'Priya Sharma', remarks: '', status: 'Completed' },
  { id: 'MO-009', code: 'CENTRAL-AC-002', orderNumber: 'SM-ORD-103', type: 'SM', description: 'Refrigerant check', plannedDate: '2026-06-06', completedDate: '', engineer: 'Arjun Patel', remarks: '', status: 'Scheduled' },
  
  // Central AC PM Orders
  { id: 'MO-010', code: 'CENTRAL-AC-002', orderNumber: 'PM-ORD-101', type: 'PM', description: 'Thermostat calibration', plannedDate: '2026-08-01', completedDate: '', engineer: 'Neeraj Singh', remarks: '', status: 'Scheduled' },
  { id: 'MO-011', code: 'CENTRAL-AC-002', orderNumber: 'PM-ORD-102', type: 'PM', description: 'HVAC filter replacement', plannedDate: '2026-09-15', completedDate: '', engineer: 'Arjun Patel', remarks: '', status: 'Scheduled' },
  { id: 'MO-012', code: 'CENTRAL-AC-002', orderNumber: 'PM-ORD-103', type: 'PM', description: 'Fan motor inspection', plannedDate: '2027-02-10', completedDate: '', engineer: 'Neeraj Singh', remarks: '', status: 'Scheduled' }
];
