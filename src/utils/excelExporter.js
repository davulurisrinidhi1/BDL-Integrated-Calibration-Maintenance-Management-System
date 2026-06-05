import * as XLSX from 'xlsx';
import { formatDate } from './helpers.js';

/**
 * SAP-ready Excel export utility for BDL Calibration System.
 * @param {Array} data - Array of objects to export
 * @param {string} fileName - Base name for the exported file
 * @param {string} sheetName - Name of the Excel sheet
 */
export const exportToExcel = (data, fileName = 'BDL_Calibration_Report', sheetName = 'CalibrationData') => {
  if (!data || data.length === 0) return;

  // ── 1. Transformation for SAP Format ──────────────────────────
  const transformed = data.map((item, index) => ({
    'S.No': index + 1,
    'Material Code': item.materialCode || '',
    'Gauge Number': item.gaugeNo || '',
    'Description': item.description || item.type || '',
    'Status': item.status || 'S1',
    'Crib Number': item.cribNo || '',
    'Calib. Date': formatDate(item.calibrationDate),
    'Next Due Date': formatDate(item.nextDueDateGO),
    'Dimen GO': item.dimenGO || 0,
    'MinTol GO': item.minTolGO || 0,
    'WearLim GO': item.wearLimGO || 0,
    'Measured Front': item.frontMeasurement || 0,
    'Measured Mid': item.middleMeasurement || 0,
    'Measured End': item.endMeasurement || 0,
    'Validation': item.validationResult || 'PASS',
    'Acceptance': item.acceptanceStatus || 'ACCEPTED',
    'Export Timestamp': new Date().toISOString()
  }));

  // ── 2. Create Workbook & Worksheet ────────────────────────────
  const ws = XLSX.utils.json_to_sheet(transformed);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // ── 3. Style Column Widths (Standard widths for SAP upload) ───
  const wscols = [
    { wch: 6 },  // S.No
    { wch: 15 }, // Material Code
    { wch: 15 }, // Gauge Number
    { wch: 25 }, // Description
    { wch: 8 },  // Status
    { wch: 12 }, // Crib Number
    { wch: 12 }, // Calib Date
    { wch: 12 }, // Next Due
    { wch: 10 }, // Dimen GO
    { wch: 10 }, // MinTol GO
    { wch: 10 }, // WearLim GO
    { wch: 12 }, // Measured F
    { wch: 12 }, // Measured M
    { wch: 12 }, // Measured E
    { wch: 12 }, // Validation
    { wch: 12 }, // Acceptance
    { wch: 25 }, // Timestamp
  ];
  ws['!cols'] = wscols;

  // ── 4. Trigger Download ───────────────────────────────────────
  const dateStr = formatDate(new Date());
  XLSX.writeFile(wb, `${fileName}_${dateStr}.xlsx`);
};

/**
 * Export specific groups (e.g. by material code) to a multi-sheet workbook.
 */
export const exportGroupedToExcel = (groupedData, fileName = 'BDL_Grouped_Report') => {
  const wb = XLSX.utils.book_new();

  Object.entries(groupedData).forEach(([groupName, data]) => {
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, groupName.substring(0, 31)); // Excel limit 31 chars
  });

  const dateStr = formatDate(new Date());
  XLSX.writeFile(wb, `${fileName}_${dateStr}.xlsx`);
};
