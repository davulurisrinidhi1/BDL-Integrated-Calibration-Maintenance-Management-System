import React, { useMemo, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { useData } from '../context/DataContext';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Calendar, 
  Download, 
  History,
  FileText,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  Activity
} from 'lucide-react';
import { formatDate } from '../utils/helpers';
import StatCard from '../components/dashboard/StatCard';
import toast from 'react-hot-toast';

const HistoryPage = () => {
  const { gaugeNo: urlGaugeNo } = useParams();
  const decodedGaugeNo = urlGaugeNo ? decodeURIComponent(urlGaugeNo) : null;
  const navigate = useNavigate();
  const { calibrationHistory } = useData();
  const [gridApi, setGridApi] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  // ── Stats ────────────────────────────────────────────────────
  const stats = useMemo(() => {
    return {
      total: calibrationHistory.length,
      accepted: calibrationHistory.filter(h => h.result === 'ACCEPTED').length,
      rejected: calibrationHistory.filter(h => h.result === 'REJECTED').length,
      wearLimit: calibrationHistory.filter(h => h.result === 'WEAR LIMIT').length
    };
  }, [calibrationHistory]);

  const columnDefs = useMemo(() => [
    { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', width: 70, pinned: 'left' },
    { 
      field: 'gaugeNo', 
      headerName: 'Gauge No', 
      width: 150, 
      cellStyle: { fontWeight: 'bold', color: '#1e3a5f' } 
    },
    { field: 'materialCode', headerName: 'Material Code', width: 140 },
    { field: 'description', headerName: 'Description', width: 220 },
    { 
      field: 'upperTolerance', 
      headerName: 'Upper Tol (+)', 
      width: 110, 
      type: 'numericColumn',
      valueFormatter: p => p.value?.toFixed(3) || '-'
    },
    { 
      field: 'lowerTolerance', 
      headerName: 'Lower Tol (-)', 
      width: 110, 
      type: 'numericColumn',
      valueFormatter: p => p.value?.toFixed(3) || '-'
    },
    { 
      field: 'wearLimit', 
      headerName: 'Wear Limit', 
      width: 100, 
      type: 'numericColumn',
      valueFormatter: p => p.value?.toFixed(3) || '-'
    },
    { 
      field: 'calibrationDate', 
      headerName: 'Calib. Date', 
      width: 130, 
      valueFormatter: p => formatDate(p.value) 
    },
    { field: 'front', headerName: 'Front (mm)', width: 100, type: 'numericColumn', valueFormatter: p => p.value?.toFixed(3) || '-' },
    { field: 'middle', headerName: 'Middle (mm)', width: 100, type: 'numericColumn', valueFormatter: p => p.value?.toFixed(3) || '-' },
    { field: 'end', headerName: 'End (mm)', width: 100, type: 'numericColumn', valueFormatter: p => p.value?.toFixed(3) || '-' },
    { 
      field: 'result', 
      headerName: 'Result', 
      width: 120,
      pinned: 'right',
      cellRenderer: (p) => {
        const cls = p.value === 'ACCEPTED' ? 'badge-accepted' : p.value === 'REJECTED' ? 'badge-rejected' : 'badge-wearlimit';
        return <span className={`badge ${cls}`}>{p.value}</span>;
      }
    },
    {
      headerName: 'Actions',
      width: 100,
      pinned: 'right',
      cellRenderer: () => (
        <button className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-blue-600 rounded transition-colors">
          <FileText size={16} />
        </button>
      )
    }
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  const onFilterChange = (val) => {
    setStatusFilter(val);
    if (val === 'ALL') {
      gridApi.setColumnFilterModel('result', null);
    } else {
      gridApi.setColumnFilterModel('result', { filterType: 'text', type: 'equals', filter: val });
    }
    gridApi.onFilterChanged();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="p-1.5 bg-[#0a192f] rounded-lg">
              <History className="text-blue-400 w-5 h-5" />
            </div>
            Traceability Ledger
          </h1>
          <p className="text-slate-500 font-medium text-xs mt-1">
            Historical calibration records and metrology audit sequence.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="btn btn-secondary text-[10px] tracking-widest font-black" onClick={() => toast.success('Historical archive report generated')}>
            <Download size={14} />
            EXPORT LEDGER
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Records" value={stats.total} icon={History} colorClass="text-blue-600" bgClass="bg-blue-50" />
        <StatCard title="Accepted" value={stats.accepted} icon={ShieldCheck} colorClass="text-emerald-600" bgClass="bg-emerald-50" />
        <StatCard title="Rejected" value={stats.rejected} icon={AlertTriangle} colorClass="text-rose-600" bgClass="bg-rose-50" />
        <StatCard title="Wear Limits" value={stats.wearLimit} icon={Activity} colorClass="text-amber-600" bgClass="bg-amber-50" />
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by Gauge No or Material Code..."
            defaultValue={decodedGaugeNo || ''}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
            onChange={(e) => gridApi?.setQuickFilter(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status:</span>
          <select 
            value={statusFilter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10"
          >
            <option value="ALL">ALL RESULTS</option>
            <option value="ACCEPTED">ACCEPTED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="WEAR LIMIT">WEAR LIMIT</option>
          </select>
        </div>
      </div>

      {/* AG Grid */}
      <div className="ag-theme-quartz h-[500px] shadow-sm border border-slate-200 rounded-xl overflow-hidden">
        <AgGridReact
          rowData={calibrationHistory}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={p => {
            setGridApi(p.api);
            if (decodedGaugeNo) p.api.setQuickFilter(decodedGaugeNo);
          }}
          pagination={true}
          paginationPageSize={15}
          animateRows={true}
          headerHeight={44}
          rowHeight={42}
          overlayNoRowsTemplate="<div class='flex flex-col items-center p-8'><span class='text-slate-400 font-bold uppercase tracking-widest text-xs'>No Traceability Records</span></div>"
        />
      </div>
    </div>
  );
};

export default HistoryPage;
