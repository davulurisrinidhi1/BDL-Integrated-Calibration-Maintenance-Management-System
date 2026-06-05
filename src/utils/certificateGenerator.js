import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDateTime, formatDate } from './helpers.js';

/**
 * Generates a professional calibration certificate for BDL.
 * @param {Object} entry - Calibration entry data
 * @param {Object} material - Material/Standard details
 * @param {Object} user - Inspector details
 */
export const generateCertificatePDF = (entry, material, user) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  const safeToFixed = (val, decimals = 4) => (val != null && !isNaN(val) && val !== '') ? Number(val).toFixed(decimals) : 'N/A';
  const safeAvg = (f, m, e) => {
    const vals = [f, m, e].filter(v => v != null && !isNaN(v) && v !== '').map(Number);
    if (vals.length === 0) return 'N/A';
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(4);
  };

  // ── 1. Header Section ──────────────────────────────────────────
  // Header Box
  doc.setDrawColor(10, 25, 47); // Navy Blue
  doc.setLineWidth(0.5);
  doc.rect(margin, margin, pageWidth - (margin * 2), 35);

  // Logo / Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(10, 25, 47);
  doc.text('BHARAT DYNAMICS LIMITED', margin + 5, margin + 15);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('A Government of India Enterprise | Ministry of Defence', margin + 5, margin + 22);
  doc.text('METROLOGY LABORATORY & QUALITY ASSURANCE TERMINAL', margin + 5, margin + 27);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('CALIBRATION CERTIFICATE', pageWidth - margin - 5, margin + 15, { align: 'right' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Cert No: ${entry.certId || 'CERT-PENDING'}`, pageWidth - margin - 5, margin + 25, { align: 'right' });

  // ── 2. Instrument Details ──────────────────────────────────────
  let y = margin + 45;
  
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text('INSTRUMENT / GAUGE SPECIFICATIONS', margin, y);
  doc.setLineWidth(0.3);
  doc.line(margin, y + 2, pageWidth - margin, y + 2);
  
  y += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Nomenclature:', margin);
  doc.setFont('helvetica', 'normal');
  doc.text(entry.type || 'N/A', margin + 35, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Material Code:', margin + 90);
  doc.setFont('helvetica', 'normal');
  doc.text(entry.materialCode || 'N/A', margin + 120, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Gauge Number:', margin);
  doc.setFont('helvetica', 'normal');
  doc.text(entry.gaugeNo || 'N/A', margin + 35, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Department:', margin + 90);
  doc.setFont('helvetica', 'normal');
  doc.text(user?.department || 'Quality Assurance', margin + 120, y);

  // ── 3. Calibration Standards ───────────────────────────────────
  y += 15;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('CALIBRATION STANDARDS & TOLERANCES', margin, y);
  doc.line(margin, y + 2, pageWidth - margin, y + 2);

  y += 10;
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Parameter', 'Standard Value', 'Tolerance (±)', 'Wear Allowance']],
    body: [
      ['GO Dimension', safeToFixed(entry.dimenGO), safeToFixed(entry.minTolGO), safeToFixed(entry.wearLimGO)],
      ['NOGO Dimension', safeToFixed(entry.dimenNOGO), safeToFixed(entry.minTolNOGO), safeToFixed(entry.wearLimNOGO)],
    ],
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 95], fontSize: 9 },
    styles: { fontSize: 9, cellPadding: 3 }
  });

  // ── 4. Measured Values ─────────────────────────────────────────
  y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : y + 30;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('MEASURED VALUES & VALIDATION', margin, y);
  doc.line(margin, y + 2, pageWidth - margin, y + 2);

  y += 10;
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Reading Type', 'Front (mm)', 'Middle (mm)', 'End (mm)', 'Avg. Value']],
    body: [
      ['Primary Measurements', safeToFixed(entry.frontMeasurement), safeToFixed(entry.middleMeasurement), safeToFixed(entry.endMeasurement), safeAvg(entry.frontMeasurement, entry.middleMeasurement, entry.endMeasurement)],
    ],
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 95], fontSize: 9 },
    styles: { fontSize: 9, cellPadding: 3 }
  });

  // ── 5. Final Result & Validity ────────────────────────────────
  y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : y + 30;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('FINAL VERIFICATION', margin, y);
  doc.line(margin, y + 2, pageWidth - margin, y + 2);

  y += 10;
  doc.setFontSize(10);
  doc.text('Acceptance Status:', margin);
  
  const status = entry.acceptanceStatus || 'PENDING';
  if (status === 'ACCEPTED') {
    doc.setTextColor(21, 128, 61); // Green
  } else if (status === 'REJECTED') {
    doc.setTextColor(185, 28, 28); // Red
  } else {
    doc.setTextColor(180, 83, 9); // Amber
  }
  doc.setFont('helvetica', 'bold');
  doc.text(status, margin + 40, y);
  
  doc.setTextColor(0);
  doc.text('Calibration Date:', margin + 90);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDate(entry.calibrationDate), margin + 130, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Validation Result:', margin);
  doc.setFont('helvetica', 'normal');
  doc.text(entry.validationResult || 'PASS', margin + 40, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Next Due Date:', margin + 90);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDate(entry.nextDueDateGO), margin + 130, y);

  // ── 6. Signatures & QR ─────────────────────────────────────────
  y = pageHeight - 50;
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + 50, y);
  doc.line(pageWidth - margin - 50, y, pageWidth - margin, y);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Inspector Signature', margin + 10, y + 5);
  doc.text('Authorized Signatory', pageWidth - margin - 40, y + 5);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${user?.name || 'N/A'}`, margin + 10, y + 10);
  doc.text(`Emp ID: ${user?.employeeId || 'N/A'}`, margin + 10, y + 14);

  // QR Placeholder (Rectangle)
  doc.rect(pageWidth / 2 - 10, y - 5, 20, 20);
  doc.setFontSize(6);
  doc.text('QR CODE', pageWidth / 2, y + 6, { align: 'center' });
  doc.text('SECURE TRACE', pageWidth / 2, y + 10, { align: 'center' });

  // ── Footer ─────────────────────────────────────────────────────
  doc.setFontSize(7);
  doc.setTextColor(150);
  doc.text(`Generated on: ${formatDateTime(new Date())} | BDL-SMART-CALIB-SYSTEM-V1.0`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  doc.text('This is a computer generated certificate and does not require physical stamp unless specified by QC department.', pageWidth / 2, pageHeight - 7, { align: 'center' });

  // Download
  doc.save(`BDL_Certificate_${entry.gaugeNo}_${formatDate(new Date())}.pdf`);
};
