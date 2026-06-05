import React, { useState, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, LineChart, Line
} from 'recharts';
import { 
  FileSpreadsheet, 
  FileText, 
  Search, 
  Filter, 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Download,
  Calendar,
  Layers
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import ChartCard from '../components/dashboard/ChartCard';
import ExportPreviewModal from '../components/common/ExportPreviewModal';
import { exportToExcel } from '../utils/excelExporter';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

const ReportsPage = () => {
  const { entries } = useData();
  const { user } = useAuth();
  const [gridApi, setGridApi] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [reportType, setReportType] = useState('ALL');

  // ── Statistics ────────────────────────────────────────────────
  const stats = useMemo(() => {
    const accepted = entries.filter(e => e.acceptanceStatus === 'ACCEPTED').length;
    const rejected = entries.filter(e => e.acceptanceStatus === 'REJECTED').length;
    const wearLimit = entries.filter(e => e.acceptanceStatus === 'WEAR LIMIT').length;
    return { accepted, rejected, wearLimit, total: entries.length };
  }, [entries]);

  // ── Chart Data ────────────────────────────────────────────────
  const qualityData = useMemo(() => [
    { name: 'Accepted', value: stats.accepted, color: '#10b981' },
    { name: 'Rejected', value: stats.rejected, color: '#f43f5e' },
    { name: 'Wear Limit', value: stats.wearLimit, color: '#f59e0b' }
  ], [stats]);

  const monthlyTrend = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = months.map(m => ({ name: m, count: 0 }));
    entries.forEach(e => {
      const mIdx = new Date(e.calibrationDate).getMonth();
      data[mIdx].count++;
    });
    return data;
  }, [entries]);

  // ── AG Grid Configuration ─────────────────────────────────────
  const columnDefs = useMemo(() => [
    { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', width: 70, pinned: 'left' },
    { field: 'materialCode', headerName: 'Material Code', width: 150, filter: 'agTextColumnFilter' },
    { field: 'gaugeNo', headerName: 'Gauge Number', width: 150, filter: 'agTextColumnFilter' },
    { field: 'type', headerName: 'Type', width: 160, filter: 'agSetColumnFilter' },
    { field: 'calibrationDate', headerName: 'Calib. Date', width: 130, valueFormatter: p => formatDate(p.value) },
    { field: 'nextDueDateGO', headerName: 'Next Due', width: 130, valueFormatter: p => formatDate(p.value) },
    { 
      field: 'acceptanceStatus', 
      headerName: 'Status', 
      width: 140,
      cellRenderer: (p) => {
        const cls = p.value === 'ACCEPTED' ? 'badge-accepted' : p.value === 'REJECTED' ? 'badge-rejected' : 'badge-wearlimit';
        return <span className={`badge ${cls}`}>{p.value}</span>;
      }
    },
    { field: 'cribNo', headerName: 'Crib', width: 100 },
    { field: 'validationResult', headerName: 'Result', width: 120 }
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  const onExport = (format) => {
    if (format === 'excel') {
      exportToExcel(entries, `BDL_Metrology_Report_${new Date().toISOString().split('T')[0]}`, 'Reports');
      toast.success('SAP-compatible Excel report generated');
    } else {
      toast.error('PDF Export coming soon in next update');
    }
  };

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <BarChart3 className="text-blue-600" />
            Calibration Reports Center
          </h1>
          <p className="text-slate-500 font-medium text-xs mt-1">
            Aggregate data analysis and enterprise-grade reporting for BDL Quality Management.
          </p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="btn btn-primary shadow-lg shadow-blue-600/20"
          >
            <Download size={16} />
            GENERATE EXPORT
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Records" value={stats.total} icon={Layers} colorClass="text-blue-600" bgClass="bg-blue-50" />
        <StatCard title="Accepted" value={stats.accepted} icon={CheckCircle2} colorClass="text-emerald-600" bgClass="bg-emerald-50" />
        <StatCard title="Rejected" value={stats.rejected} icon={XCircle} colorClass="text-rose-600" bgClass="bg-rose-50" />
        <StatCard title="Wear Limits" value={stats.wearLimit} icon={AlertTriangle} colorClass="text-amber-600" bgClass="bg-amber-50" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ChartCard title="Quality Distribution" height="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={qualityData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {qualityData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <div className="lg:col-span-2">
          <ChartCard title="Annual Calibration Trend" height="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Report Type:</span>
          <select 
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10"
          >
            <option value="ALL">ALL CALIBRATIONS</option>
            <option value="ACCEPTED">ACCEPTED ONLY</option>
            <option value="REJECTED">REJECTED ONLY</option>
            <option value="DUE">DUE FOR CALIBRATION</option>
          </select>
        </div>
        
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input 
            type="text" 
            placeholder="Filter data..."
            className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
            onChange={(e) => gridApi?.setQuickFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Grid Container */}
      <div className="ag-theme-quartz h-[400px] shadow-sm border border-slate-200 rounded-xl overflow-hidden">
        <AgGridReact
          rowData={entries}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={p => setGridApi(p.api)}
          pagination={true}
          paginationPageSize={10}
          animateRows={true}
          headerHeight={44}
          rowHeight={42}
        />
      </div>

      {/* Export Modal */}
      <ExportPreviewModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={onExport}
        data={entries}
        user={user}
      />
    </div>
  );
};

export default ReportsPage;
