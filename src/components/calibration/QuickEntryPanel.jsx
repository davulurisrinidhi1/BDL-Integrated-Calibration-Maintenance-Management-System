import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  Trash2, 
  Save, 
  Keyboard, 
  AlertCircle,
  CheckCircle2,
  Zap,
  Info
} from 'lucide-react';
import { recalculateEntry } from '../../utils/measurementRules';
import { runValidation } from '../../utils/validationEngine';
import toast from 'react-hot-toast';

const QuickEntryPanel = () => {
  const { materialCodes, addEntry } = useData();
  const { user } = useAuth();
  const [rows, setRows] = useState([createEmptyRow()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lastInputRef = useRef(null);

  function createEmptyRow() {
    return {
      tempId: Date.now() + Math.random(),
      type: 'TPG Gauge',
      materialCode: '',
      gaugeNo: '',
      frontMeasurement: '',
      middleMeasurement: '',
      endMeasurement: '',
      status: 'S1',
      cribNo: 'C01',
      validation: { errors: 0, items: [] }
    };
  }

  const addRow = useCallback(() => {
    setRows(prev => [...prev, createEmptyRow()]);
  }, []);

  const removeRow = (id) => {
    if (rows.length === 1) {
      setRows([createEmptyRow()]);
      return;
    }
    setRows(prev => prev.filter(r => r.tempId !== id));
  };

  const updateRow = (id, field, value) => {
    setRows(prev => prev.map(row => {
      if (row.tempId !== id) return row;
      
      let updatedRow = { ...row, [field]: value };
      
      // If material code changed, lookup and recalculate
      if (field === 'materialCode' || field === 'type' || field.includes('Measurement')) {
        const mat = materialCodes.find(m => m.code === updatedRow.materialCode);
        updatedRow = recalculateEntry(updatedRow, mat);
        
        // Convert string measurements to numbers for logic
        if (field.includes('Measurement')) {
           updatedRow[field] = value === '' ? '' : parseFloat(value);
        }
      }

      // Run validation
      const validationItems = runValidation(updatedRow);
      updatedRow.validation = {
        errors: validationItems.filter(v => v.type === 'error').length,
        items: validationItems
      };

      return updatedRow;
    }));
  };

  const handleSubmit = async () => {
    const invalidRows = rows.filter(r => r.validation.errors > 0 || !r.materialCode);
    if (invalidRows.length > 0) {
      toast.error(`Please fix errors in ${invalidRows.length} row(s) before submitting.`);
      return;
    }

    setIsSubmitting(true);
    try {
      for (const row of rows) {
        await addEntry(row, user.employeeId, user.role);
      }
      toast.success(`Successfully saved ${rows.length} calibration records.`);
      setRows([createEmptyRow()]);
    } catch (error) {
      toast.error('Failed to save entries. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Keyboard Navigation
  const handleKeyDown = (e, rowIndex, field) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    } else if (e.key === 'Enter' && rowIndex === rows.length - 1 && field === 'endMeasurement') {
      addRow();
      // Small timeout to allow DOM to update before focusing
      setTimeout(() => {
        if (lastInputRef.current) lastInputRef.current.focus();
      }, 50);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#0a192f] p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-lg shadow-blue-900/50">
            <Zap className="text-white w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Rapid Entry Terminal</h3>
            <p className="text-[10px] text-blue-300 font-bold uppercase tracking-wider opacity-70">Operator Mode: Active</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-slate-400 text-[10px] font-bold">
            <Keyboard size={14} />
            <span>CTRL + ENTER TO SUBMIT</span>
          </div>
          <button 
            onClick={addRow}
            className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-3 py-1.5 rounded flex items-center gap-2 transition-colors"
          >
            <Plus size={14} /> ADD ROW
          </button>
        </div>
      </div>

      {/* Spreadsheet UI */}
      <div className="flex-1 overflow-auto bg-slate-50">
        <table className="w-full border-collapse text-[11px]">
          <thead className="sticky top-0 bg-slate-100 z-10 border-b border-slate-200">
            <tr className="text-slate-500 font-bold uppercase tracking-tighter text-left">
              <th className="p-3 w-10 text-center border-r border-slate-200">#</th>
              <th className="p-3 w-40 border-r border-slate-200">Type</th>
              <th className="p-3 w-32 border-r border-slate-200">Material Code</th>
              <th className="p-3 w-32 border-r border-slate-200">Gauge No</th>
              <th className="p-3 w-20 border-r border-slate-200">Front</th>
              <th className="p-3 w-20 border-r border-slate-200">Middle</th>
              <th className="p-3 w-20 border-r border-slate-200">End</th>
              <th className="p-3 w-24 border-r border-slate-200">Status</th>
              <th className="p-3 w-24 border-r border-slate-200">Crib</th>
              <th className="p-3 w-32 border-r border-slate-200">Result</th>
              <th className="p-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.tempId} className="bg-white border-b border-slate-100 hover:bg-blue-50/30 transition-colors group">
                <td className="p-2 text-center text-slate-400 font-bold border-r border-slate-100">{idx + 1}</td>
                
                <td className="p-1 border-r border-slate-100">
                  <select 
                    value={row.type}
                    onChange={(e) => updateRow(row.tempId, 'type', e.target.value)}
                    className="w-full p-1.5 bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded font-bold text-slate-800"
                  >
                    <option>TPG Gauge</option>
                    <option>Double Ended Gauge</option>
                    <option>Vernier Calipers</option>
                    <option>Outside Micrometer</option>
                  </select>
                </td>

                <td className="p-1 border-r border-slate-100">
                  <input 
                    type="text"
                    value={row.materialCode}
                    onChange={(e) => updateRow(row.tempId, 'materialCode', e.target.value)}
                    placeholder="Search..."
                    className="w-full p-1.5 bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded font-bold text-slate-800 placeholder-slate-300 uppercase"
                  />
                </td>

                <td className="p-1 border-r border-slate-100">
                  <input 
                    type="text"
                    value={row.gaugeNo}
                    onChange={(e) => updateRow(row.tempId, 'gaugeNo', e.target.value)}
                    placeholder="G01..."
                    className="w-full p-1.5 bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded font-bold text-slate-800 placeholder-slate-300"
                  />
                </td>

                <td className="p-1 border-r border-slate-100">
                  <input 
                    type="number"
                    step="0.001"
                    value={row.frontMeasurement}
                    onChange={(e) => updateRow(row.tempId, 'frontMeasurement', e.target.value)}
                    className="w-full p-1.5 bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded font-bold text-slate-800 text-right"
                  />
                </td>

                <td className="p-1 border-r border-slate-100">
                  <input 
                    type="number"
                    step="0.001"
                    value={row.middleMeasurement}
                    onChange={(e) => updateRow(row.tempId, 'middleMeasurement', e.target.value)}
                    className="w-full p-1.5 bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded font-bold text-slate-800 text-right"
                  />
                </td>

                <td className="p-1 border-r border-slate-100">
                  <input 
                    type="number"
                    step="0.001"
                    ref={idx === rows.length - 1 ? lastInputRef : null}
                    value={row.endMeasurement}
                    onChange={(e) => updateRow(row.tempId, 'endMeasurement', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, idx, 'endMeasurement')}
                    className="w-full p-1.5 bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded font-bold text-slate-800 text-right"
                  />
                </td>

                <td className="p-1 border-r border-slate-100">
                  <select 
                    value={row.status}
                    onChange={(e) => updateRow(row.tempId, 'status', e.target.value)}
                    className="w-full p-1.5 bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded font-bold text-slate-700"
                  >
                    <option value="S1">S1 (In-Service)</option>
                    <option value="S2">S2 (Quarantine)</option>
                    <option value="S3">S3 (Repair)</option>
                  </select>
                </td>

                <td className="p-1 border-r border-slate-100">
                  <input 
                    type="text"
                    value={row.cribNo}
                    onChange={(e) => updateRow(row.tempId, 'cribNo', e.target.value)}
                    className="w-full p-1.5 bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded font-bold text-slate-700"
                  />
                </td>

                <td className="p-1 border-r border-slate-100">
                  <div className="flex items-center justify-between px-2">
                    <span className={`font-black text-[9px] px-1.5 py-0.5 rounded uppercase tracking-tighter ${
                      row.acceptanceStatus === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' : 
                      row.acceptanceStatus === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                      row.acceptanceStatus === 'WEAR LIMIT' ? 'bg-amber-100 text-amber-700' :
                      'text-slate-300'
                    }`}>
                      {row.acceptanceStatus || 'PENDING'}
                    </span>
                    
                    {row.validation.errors > 0 && (
                      <div className="group/err relative">
                        <AlertCircle size={14} className="text-rose-500 cursor-help" />
                        <div className="absolute right-0 bottom-full mb-2 hidden group-hover/err:block w-48 bg-slate-900 text-white p-2 rounded text-[9px] z-20 shadow-xl">
                          {row.validation.items.filter(i => i.type === 'error').map((err, i) => (
                            <div key={i} className="mb-1 last:mb-0 border-b border-slate-800 pb-1 last:border-0 last:pb-0">• {err.message}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </td>

                <td className="p-1 text-center">
                  <button 
                    onClick={() => removeRow(row.tempId)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-rose-600 transition-all rounded hover:bg-rose-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Controls */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              {rows.filter(r => r.acceptanceStatus === 'ACCEPTED').length} ACCEPTED
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle size={14} className="text-rose-500" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              {rows.filter(r => r.validation.errors > 0).length} ERRORS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setRows([createEmptyRow()])}
            className="px-4 py-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:text-slate-800"
          >
            Reset Form
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#0a192f] hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded shadow-lg shadow-blue-900/10 flex items-center gap-2 text-[10px] uppercase tracking-widest disabled:opacity-50 transition-all"
          >
            {isSubmitting ? (
               <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
               <Save size={14} />
            )}
            {isSubmitting ? 'Processing...' : 'Commit Entries'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickEntryPanel;
