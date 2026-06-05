import React, { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { useData } from '../context/DataContext';
import { 
  Shield, 
  Search, 
  Download, 
  Filter, 
  History,
  User,
  Clock,
  Activity
} from 'lucide-react';
import { formatDateTime } from '../utils/helpers';
import { exportToExcel } from '../utils/excelExporter';
import toast from 'react-hot-toast';

const AuditLogPage = () => {
  const { auditLogs } = useData();
  const [gridApi, setGridApi] = useState(null);
  const [filterType, setFilterType] = useState('ALL');

  const columnDefs = useMemo(() => [
    { 
      field: 'timestamp', 
      headerName: 'Timestamp', 
      width: 200, 
      pinned: 'left',
      valueFormatter: p => formatDateTime(p.value),
      sort: 'desc'
    },
    { 
      field: 'user', 
      headerName: 'User ID', 
      width: 140,
      cellRenderer: p => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
            <User size={12} className="text-slate-500" />
          </div>
          <span className="font-bold text-slate-700">{p.value}</span>
        </div>
      )
    },
    { 
      field: 'action', 
      headerName: 'Action', 
      width: 150,
      cellRenderer: p => {
        let cls = 'bg-slate-100 text-slate-700';
        if (p.value === 'DELETE') cls = 'bg-rose-100 text-rose-700';
        if (p.value === 'CREATE') cls = 'bg-emerald-100 text-emerald-700';
        if (p.value === 'EDIT') cls = 'bg-blue-100 text-blue-700';
        if (p.value === 'CERT_GEN') cls = 'bg-indigo-100 text-indigo-700';
        return <span className={`badge ${cls}`}>{p.value}</span>;
      }
    },
    { field: 'detail', headerName: 'Detail', flex: 1, minWidth: 300 },
    { 
      field: 'role', 
      headerName: 'Role', 
      width: 150,
      cellRenderer: p => (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.value}</span>
      )
    }
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true
  }), []);

  const handleExport = () => {
    exportToExcel(auditLogs, 'BDL_Audit_Logs', 'Logs');
    toast.success('Audit logs exported successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Shield className="text-blue-600" />
            System Audit Trail
          </h1>
          <p className="text-slate-500 font-medium text-xs mt-1">
            End-to-end traceability of all system interactions and data mutations.
          </p>
        </div>

        <button 
          onClick={handleExport}
          className="btn btn-primary shadow-lg shadow-blue-200"
        >
          <Download size={16} />
          EXPORT LOGS
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-slate-400" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter Action:</span>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10"
          >
            <option value="ALL">ALL ACTIONS</option>
            <option value="CREATE">CREATE</option>
            <option value="EDIT">EDIT</option>
            <option value="DELETE">DELETE</option>
            <option value="CERT_GEN">CERT GEN</option>
            <option value="EXPORT">EXPORT</option>
          </select>
        </div>
        
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input 
            type="text" 
            placeholder="Search logs by user or detail..."
            className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
            onChange={(e) => gridApi?.setQuickFilter(e.target.value)}
          />
        </div>

        <div className="ml-auto text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
           <Clock size={12} />
           <span>Retention Period: 365 Days</span>
        </div>
      </div>

      {/* Grid */}
      <div className="ag-theme-quartz h-[600px] shadow-sm border border-slate-200 rounded-xl overflow-hidden">
        <AgGridReact
          rowData={auditLogs}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={p => setGridApi(p.api)}
          pagination={true}
          paginationPageSize={20}
          animateRows={true}
          headerHeight={44}
          rowHeight={42}
        />
      </div>
    </div>
  );
};

export default AuditLogPage;
