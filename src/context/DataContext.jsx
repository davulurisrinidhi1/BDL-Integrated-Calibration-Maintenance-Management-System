import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { generateId, formatDate, addWeeks, addMonths, mockDelay, generateCertNumber } from '../utils/helpers.js';
import { recalculateEntry } from '../utils/measurementRules.js';
import { MOCK_MATERIAL_CODES } from '../data/mockMaterialCodes.js';
import { MOCK_USERS, MOCK_ENTRIES, MOCK_AUDIT_LOGS } from '../data/mockData.js';
import { MOCK_MACHINE_ASSETS, MOCK_MACHINE_TASKS, MOCK_MACHINE_STRATEGIES, MOCK_MACHINE_SPARES, MOCK_MACHINE_WORK_ORDERS, MOCK_MAINTENANCE_ORDERS } from '../data/machineMockData.js';
import { MOCK_INSTRUMENT_TASKS, MOCK_INSTRUMENT_STRATEGIES } from '../data/instrumentMockData.js';

const DataContext = createContext(null);
const V = 'v3'; // Bumped to invalidate stale localStorage cache with old field names
const k = (n) => `${n}_${V}`;

function load(name, defaultValue = []) {
  try { 
    const item = localStorage.getItem(k(name));
    return item ? JSON.parse(item) : defaultValue; 
  } catch { 
    return defaultValue; 
  }
}
function save(name, data) { localStorage.setItem(k(name), JSON.stringify(data)); }

export function DataProvider({ children }) {
  const [entries, setEntries] = useState(() => load('calibrationEntries', MOCK_ENTRIES));
  const [materialCodes] = useState(() => load('materialCodes', MOCK_MATERIAL_CODES));
  const [auditLogs, setAuditLogs] = useState(() => load('auditLogs', MOCK_AUDIT_LOGS));
  const [certificates, setCertificates] = useState(() => load('certificates'));
  const [exportHistory, setExportHistory] = useState(() => load('exportHistory'));
  const [calibrationHistory, setCalibrationHistory] = useState(() => load('calibrationHistory'));
  const [users, setUsers] = useState(() => load('users', MOCK_USERS));

  // Machine Module States
  const [machineAssets, setMachineAssets] = useState(() => load('machineAssets', MOCK_MACHINE_ASSETS));
  const [machineTasks, setMachineTasks] = useState(() => load('machineTasks', MOCK_MACHINE_TASKS));
  const [machineStrategies, setMachineStrategies] = useState(() => load('machineStrategies', MOCK_MACHINE_STRATEGIES));
  const [machineSpares, setMachineSpares] = useState(() => load('machineSpares', MOCK_MACHINE_SPARES));
  const [machineWorkOrders, setMachineWorkOrders] = useState(() => load('machineWorkOrders', MOCK_MACHINE_WORK_ORDERS));
  const [maintenanceOrders, setMaintenanceOrders] = useState(() => load('maintenanceOrders', MOCK_MAINTENANCE_ORDERS));

  // Instrument Strategies & Tasks
  const [instrumentTasks, setInstrumentTasks] = useState(() => load('instrumentTasks', MOCK_INSTRUMENT_TASKS));
  const [instrumentStrategies, setInstrumentStrategies] = useState(() => load('instrumentStrategies', MOCK_INSTRUMENT_STRATEGIES));

  // Machine Module Session State — persisted to localStorage for hydration safety
  const [selectedMachineCode, setSelectedMachineCode] = useState(
    () => localStorage.getItem('selectedMachineCode') || ''
  );

  // Persist selectedMachineCode to localStorage on every change
  useEffect(() => {
    localStorage.setItem('selectedMachineCode', selectedMachineCode || '');
  }, [selectedMachineCode]);

  // Derived machine object from the current selection
  const selectedMachine = useMemo(() => {
    if (!selectedMachineCode) return null;
    return machineAssets.find(m => m.code === selectedMachineCode) || null;
  }, [selectedMachineCode, machineAssets]);

  // Generic updater function for the new lists (simplified for brevity)
  const updateDataSet = useCallback((name, setter, data) => {
    setter(data);
    save(name, data);
  }, []);

  const getMaterial = useCallback((code) => {
    return (materialCodes.length ? materialCodes : MOCK_MATERIAL_CODES).find(m => m.code === code);
  }, [materialCodes]);

  const addAuditLog = useCallback((action, userId, role, detail, oldVal, newVal) => {
    const log = { id: generateId('AL'), action, user: userId || 'SYSTEM', role: role || 'System', detail, oldValue: oldVal || null, newValue: newVal || null, timestamp: new Date().toISOString() };
    setAuditLogs(prev => { const next = [log, ...prev]; save('auditLogs', next); return next; });
  }, []);

  // ── Calibration entries CRUD ──────────────────────────────
  const addEntry = useCallback(async (entry, userId, role) => {
    await mockDelay(250);
    const mat = getMaterial(entry.materialCode);
    const newEntry = recalculateEntry({
      ...entry,
      id: generateId('CE'),
      sno: entries.length + 1,
      calibrationDate: entry.calibrationDate || formatDate(new Date()),
      createdBy: userId,
      createdAt: new Date().toISOString(),
      certGenerated: false,
      certId: null,
    }, mat);
    
    setEntries(prev => { const next = [...prev, newEntry]; save('calibrationEntries', next); return next; });
    addAuditLog('CREATE', userId, role, `Created entry ${newEntry.id} — ${newEntry.type} ${newEntry.materialCode}`);
    
    const histItem = {
      id: generateId('CH'), gaugeNo: newEntry.gaugeNo, materialCode: newEntry.materialCode,
      description: `${newEntry.type} ${newEntry.variant || ''}`, upperTolerance: newEntry.minTolGO,
      lowerTolerance: -(newEntry.minTolGO || 0), wearLimit: newEntry.wearLimGO,
      calibrationDate: newEntry.calibrationDate, front: newEntry.frontMeasurement,
      middle: newEntry.middleMeasurement, end: newEntry.endMeasurement,
      result: newEntry.acceptanceStatus,
    };
    setCalibrationHistory(prev => { const next = [...prev, histItem]; save('calibrationHistory', next); return next; });
    return newEntry;
  }, [entries, getMaterial, addAuditLog]);

  const updateEntry = useCallback(async (id, updates, userId, role) => {
    await mockDelay(200);
    setEntries(prev => {
      const idx = prev.findIndex(e => e.id === id);
      if (idx === -1) return prev;
      const old = prev[idx];
      const mat = getMaterial(updates.materialCode || old.materialCode);
      const updated = recalculateEntry({ ...old, ...updates }, mat);
      const next = [...prev]; next[idx] = updated;
      save('calibrationEntries', next);
      addAuditLog('EDIT', userId, role, `Edited ${id}`, JSON.stringify(old), JSON.stringify(updated));
      return next;
    });
  }, [getMaterial, addAuditLog]);

  const deleteEntry = useCallback(async (id, userId, role) => {
    await mockDelay(200);
    setEntries(prev => {
      const entry = prev.find(e => e.id === id);
      const next = prev.filter(e => e.id !== id).map((e, i) => ({ ...e, sno: i + 1 }));
      save('calibrationEntries', next);
      if (entry) addAuditLog('DELETE', userId, role, `Deleted ${id} — ${entry.type} ${entry.materialCode}`);
      return next;
    });
  }, [addAuditLog]);

  const generateCertificate = useCallback(async (entryId, userId, role) => {
    await mockDelay(300);
    const entry = entries.find(e => e.id === entryId);
    if (!entry) return null;
    const certId = generateCertNumber();
    const cert = {
      id: certId, entryId, materialCode: entry.materialCode, gaugeNo: entry.gaugeNo,
      type: entry.type, result: entry.acceptanceStatus, generatedBy: userId,
      generatedAt: new Date().toISOString(),
    };
    setCertificates(prev => { const next = [...prev, cert]; save('certificates', next); return next; });
    setEntries(prev => {
      const next = prev.map(e => e.id === entryId ? { ...e, certGenerated: true, certId } : e);
      save('calibrationEntries', next);
      return next;
    });
    addAuditLog('CERT_GEN', userId, role, `Certificate ${certId} generated for ${entryId}`);
    return cert;
  }, [entries, addAuditLog]);

  const trackExport = useCallback((exportType, reportType, userId, recordCount) => {
    const exp = { id: generateId('EX'), exportType, reportType, exportedBy: userId, timestamp: new Date().toISOString(), recordCount };
    setExportHistory(prev => { const next = [exp, ...prev]; save('exportHistory', next); return next; });
    addAuditLog('EXPORT', userId, '', `Exported ${reportType} — ${exportType} (${recordCount} records)`);
  }, [addAuditLog]);

  const addUser = useCallback((userData) => {
    const newUser = { ...userData, id: generateId('U') };
    setUsers(prev => { const next = [...prev, newUser]; save('users', next); return next; });
    return newUser;
  }, []);

  const updateUser = useCallback((id, updates) => {
    setUsers(prev => {
      const next = prev.map(u => u.id === id ? { ...u, ...updates } : u);
      save('users', next);
      return next;
    });
  }, []);

  const value = {
    entries, materialCodes: materialCodes.length ? materialCodes : MOCK_MATERIAL_CODES,
    auditLogs, certificates, exportHistory, calibrationHistory, users,
    getMaterial, addEntry, updateEntry, deleteEntry,
    generateCertificate, trackExport, addAuditLog,
    addUser, updateUser,
    // New Machine and Instrument states
    machineAssets, setMachineAssets: (data) => updateDataSet('machineAssets', setMachineAssets, data),
    machineTasks, setMachineTasks: (data) => updateDataSet('machineTasks', setMachineTasks, data),
    machineStrategies, setMachineStrategies: (data) => updateDataSet('machineStrategies', setMachineStrategies, data),
    machineSpares, setMachineSpares: (data) => updateDataSet('machineSpares', setMachineSpares, data),
    machineWorkOrders, setMachineWorkOrders: (data) => updateDataSet('machineWorkOrders', setMachineWorkOrders, data),
    maintenanceOrders, setMaintenanceOrders: (data) => updateDataSet('maintenanceOrders', setMaintenanceOrders, data),
    instrumentTasks, setInstrumentTasks: (data) => updateDataSet('instrumentTasks', setInstrumentTasks, data),
    instrumentStrategies, setInstrumentStrategies: (data) => updateDataSet('instrumentStrategies', setInstrumentStrategies, data),
    
    // Machine Selection Context
    selectedMachineCode, setSelectedMachineCode, selectedMachine
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

