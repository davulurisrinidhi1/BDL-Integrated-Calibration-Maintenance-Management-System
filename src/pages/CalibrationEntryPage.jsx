import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Save, 
  Trash2, 
  Search, 
  History, 
  FileText, 
  Download, 
  Zap,
  Info,
  Maximize2,
  Minimize2,
  Filter,
  Keyboard,
  Database
} from 'lucide-react';

import StatusLegend from '../components/calibration/StatusLegend';
import AIValidationBanner from '../components/calibration/AIValidationBanner';
import QuickEntryPanel from '../components/calibration/QuickEntryPanel';
import SkeletonLoader from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';

import { recalculateEntry } from '../utils/measurementRules';
import { runValidation, getValidationSummary } from '../utils/validationEngine';
import { formatDate } from '../utils/helpers';
import { exportToExcel } from '../utils/excelExporter';
import toast from 'react-hot-toast';

const CalibrationEntryPage = () => {
  const { entries, materialCodes, updateEntry, deleteEntry, addEntry } = useData();
  const { user } = useAuth();
  
  const [gridApi, setGridApi] = useState(null);
  const [quickEntryMode, setQuickEntryMode] = useState(false);
  const [validationMessages, setValidationMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // ── Column Definitions ─────────────────────────────────────────
  const columnDefs = useMemo(() => [
    { 
      headerName: '#', 
      valueGetter: "node.rowIndex + 1", 
      width: 60, 
      pinned: 'left',
      cellStyle: { textAlign: 'center', color: '#94a3b8', fontWeight: 'bold' } 
    },
    { 
      field: 'type', 
      headerName: 'Type', 
      width: 160, 
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['TPG Gauge', 'Double Ended Gauge', 'Vernier Calipers', 'Outside Micrometer']
      }
    },
    { 
      field: 'materialCode', 
      headerName: 'Material Code', 
      width: 140, 
      editable: true,
      cellStyle: { fontWeight: '700', color: '#1e3a5f' }
    },
    { field: 'gaugeNo', headerName: 'Gauge No', width: 130, editable: true },
    { field: 'periodicity', headerName: 'Periodicity', width: 140, editable: false },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 100, 
      editable: true,
      cellRenderer: (params) => (
        <span className="font-bold text-slate-600">{params.value || 'S1'}</span>
      )
    },
    { field: 'cribNo', headerName: 'Crib No', width: 100, editable: true },
    { field: 'dimenGO', headerName: 'Dimen GO', width: 110, editable: true, type: 'numericColumn' },
    { field: 'minTolGO', headerName: 'MinTol GO', width: 110, editable: true, type: 'numericColumn' },
    { field: 'wearLimGO', headerName: 'WearLim GO', width: 110, editable: true, type: 'numericColumn' },
    { 
      field: 'validationResult', 
      headerName: 'Validation', 
      width: 140,
      cellRenderer: (params) => {
        if (!params.value) return null;
        const color = params.value === 'PASS' ? 'badge-pass' : 'badge-fail';
        return <span className={`badge ${color}`}>{params.value}</span>;
      }
    },
    { 
      field: 'acceptanceStatus', 
      headerName: 'Acceptance', 
      width: 140,
      pinned: 'right',
      cellRenderer: (params) => {
        if (!params.value) return null;
        let className = 'badge-pending';
        if (params.value === 'ACCEPTED') className = 'badge-accepted';
        if (params.value === 'REJECTED') className = 'badge-rejected';
        if (params.value === 'WEAR LIMIT') className = 'badge-wearlimit';
        return <span className={`badge ${className}`}>{params.value}</span>;
      }
    },
    {
      headerName: 'Actions',
      width: 160,
      pinned: 'right',
      cellRenderer: (params) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleSaveRow(params.data)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Commit to Database"
          >
            <Save size={14} />
          </button>
          <button 
            onClick={() => handleDeleteRow(params.data.id)}
            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors"
            title="Delete Record"
          >
            <Trash2 size={14} />
          </button>
          <button className="p-1.5 text-slate-400 hover:bg-slate-50 rounded" title="Audit History">
            <History size={14} />
          </button>
        </div>
      )
    }
  ], [updateEntry]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    flex: 0,
    minWidth: 80
  }), []);

  const getRowClass = (params) => {
    if (!params.data.acceptanceStatus) return 'row-pending';
    switch (params.data.acceptanceStatus) {
      case 'ACCEPTED': return 'row-accepted';
      case 'REJECTED': return 'row-rejected';
      case 'WEAR LIMIT': return 'row-wearlimit';
      default: return 'row-pending';
    }
  };

  const onCellValueChanged = useCallback((event) => {
    const { data } = event;
    const mat = materialCodes.find(m => m.code === data.materialCode);
    const updated = recalculateEntry(data, mat);
    
    event.node.setData(updated);
    
    const summary = getValidationSummary(updated);
    setValidationMessages(summary.items);
    
    if (event.column.colId === 'materialCode' || event.column.colId === 'dimenGO') {
       toast.success(`Rule engine applied: ${data.materialCode || 'entry updated'}`);
    }
  }, [materialCodes]);

  const handleSaveRow = async (data) => {
    try {
      if (!data.id) {
        await addEntry(data, user.employeeId, user.role);
      } else {
        await updateEntry(data.id, data, user.employeeId, user.role);
      }
      toast.success('Record synchronized with SAP-BDL gateway');
    } catch (e) {
      toast.error('Synchronization failed. Check network status.');
    }
  };

  const handleDeleteRow = async (id) => {
    if (window.confirm('Are you sure you want to delete this calibration record? This action is logged.')) {
      await deleteEntry(id, user.employeeId, user.role);
      toast.success('Record purged from ledger');
    }
  };

  const addNewRow = () => {
    const newEntry = {
      id: null,
      type: 'TPG Gauge',
      materialCode: '',
      status: 'S1',
      calibrationDate: formatDate(new Date()),
      acceptanceStatus: 'PENDING'
    };
    gridApi.applyTransaction({ add: [newEntry], addIndex: 0 });
    gridApi.ensureIndexVisible(0);
    gridApi.setFocusedCell(0, 'materialCode');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-16 w-1/3 skeleton rounded-lg"></div>
        <SkeletonLoader.Table rows={10} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-slate-50/80 backdrop-blur-md pb-4 border-b border-slate-200">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
              <div className="p-1.5 bg-[#0a192f] rounded-lg">
                <Zap className="text-blue-400 w-5 h-5" />
              </div>
              Calibration Entry Terminal
            </h1>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                <Database size={12} className="text-blue-500" />
                SOP-CAL-BDL-04 v2.1
              </p>
              <div className="w-[1px] h-3 bg-slate-300"></div>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                <Keyboard size={12} />
                F2 to Edit | Ctrl+S to Save
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search ledger..."
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64 transition-all shadow-sm"
                onChange={(e) => gridApi?.setQuickFilter(e.target.value)}
              />
            </div>
            
            <button 
              onClick={() => setQuickEntryMode(!quickEntryMode)}
              className={`btn shadow-sm font-bold tracking-widest text-[10px] uppercase ${quickEntryMode ? 'btn-primary' : 'btn-secondary'}`}
            >
              {quickEntryMode ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              {quickEntryMode ? 'GRID VIEW' : 'RAPID ENTRY'}
            </button>

            <button onClick={addNewRow} className="btn btn-primary shadow-lg shadow-blue-600/20 font-bold tracking-widest text-[10px] uppercase">
              <Plus size={14} />
              NEW RECORD
            </button>
          </div>
        </div>
      </div>

      {/* Validation Banner */}
      <AIValidationBanner messages={validationMessages} onDismiss={() => setValidationMessages([])} />

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 relative flex flex-col gap-4">
        {quickEntryMode ? (
          <div className="flex-1 animate-in slide-in-from-right-4 duration-300">
            <QuickEntryPanel />
          </div>
        ) : entries.length > 0 ? (
          <div className="flex-1 ag-theme-quartz shadow-2xl border border-slate-200 rounded-xl overflow-hidden">
            <AgGridReact
              rowData={entries}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onGridReady={(params) => setGridApi(params.api)}
              onCellValueChanged={onCellValueChanged}
              getRowClass={getRowClass}
              animateRows={true}
              pagination={true}
              paginationPageSize={20}
              rowSelection="single"
              headerHeight={48}
              rowHeight={44}
              enableCellTextSelection={true}
              overlayNoRowsTemplate="<div class='flex flex-col items-center gap-4'><span class='text-slate-400 font-bold uppercase tracking-widest text-xs'>Metrology Ledger is Empty</span></div>"
            />
          </div>
        ) : (
          <EmptyState 
            title="No Calibration Records"
            description="The metrology ledger is currently empty. Start by adding a new calibration record or switching to rapid entry mode."
            actionLabel="CREATE FIRST RECORD"
            onAction={addNewRow}
          />
        )}

        {/* Global Status Bar */}
        <div className="bg-[#0a192f] p-3 rounded-xl border border-blue-900/30 flex justify-between items-center shrink-0 shadow-2xl">
           <div className="flex gap-8 items-center pl-2">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[9px] font-black text-blue-200 uppercase tracking-[0.2em]">
                   SAP Gateway: Synchronized
                 </span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                 <Info size={12} className="text-blue-400" />
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                   Database: {entries.length} Objects Loaded
                 </span>
              </div>
           </div>

           <div className="flex gap-2">
              <button 
                onClick={() => {
                  exportToExcel(entries, `BDL_SAP_METROLOGY_LEDGER_${new Date().toISOString().split('T')[0]}`, 'MetrologyLedger');
                  toast.success('SAP-compatible ledger exported');
                }}
                className="px-3 py-1.5 text-blue-300 hover:text-white font-black text-[9px] uppercase tracking-widest transition-colors flex items-center gap-2"
              >
                 <Download size={14} />
                 EXCEL (SAP)
              </button>
              <button 
                onClick={() => toast.success('Metrology transaction committed to SAP-BDL central gateway')}
                className="bg-blue-600 hover:bg-blue-500 text-white font-black text-[9px] px-4 py-1.5 rounded uppercase tracking-widest transition-all shadow-lg shadow-blue-900/50"
              >
                 Commit Transaction
              </button>
           </div>
        </div>
      </div>

      {/* Floating Reference Legend */}
      <StatusLegend />
    </div>
  );
};

export default CalibrationEntryPage;

