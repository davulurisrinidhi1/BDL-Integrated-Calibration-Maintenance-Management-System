import React, { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  Gauge, 
  Search, 
  Filter, 
  ChevronRight, 
  Info,
  Layers,
  Activity,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../components/dashboard/StatCard';

const MaterialsPage = () => {
  const { materialCodes, entries } = useData();
  const [gridApi, setGridApi] = useState(null);

  const stats = useMemo(() => {
    const total = materialCodes.length;
    const standard = materialCodes.filter(m => m.productType === 'standard').length;
    const customized = materialCodes.filter(m => m.productType === 'customized').length;
    return { total, standard, customized };
  }, [materialCodes]);

  const columnDefs = useMemo(() => [
    { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', width: 70, pinned: 'left' },
    { 
      field: 'code', 
      headerName: 'Material Code', 
      width: 150, 
      cellStyle: { fontWeight: 'bold', color: '#1e3a5f' },
      cellRenderer: (params) => (
        <Link to={`/materials/${params.value}`} className="hover:text-blue-600 transition-colors">
          {params.value}
        </Link>
      )
    },
    { field: 'type', headerName: 'Instrument Type', width: 180 },
    { 
      field: 'productType', 
      headerName: 'Category', 
      width: 130,
      cellRenderer: (p) => (
        <span className={`badge ${p.value === 'standard' ? 'badge-pass' : 'badge-pending'}`}>
          {p.value.toUpperCase()}
        </span>
      )
    },
    { field: 'standardDimenGO', headerName: 'Std Dimen GO', width: 130, type: 'numericColumn' },
    { field: 'standardDimenNOGO', headerName: 'Std Dimen NOGO', width: 130, type: 'numericColumn' },
    { 
      headerName: 'Total Gauges', 
      width: 130,
      valueGetter: (params) => entries.filter(e => e.materialCode === params.data.code).length,
      type: 'numericColumn'
    },
    {
      headerName: 'View Details',
      width: 120,
      pinned: 'right',
      cellRenderer: (params) => (
        <Link 
          to={`/materials/${params.data.code}`}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg flex items-center justify-center transition-colors"
        >
          <ChevronRight size={16} />
        </Link>
      )
    }
  ], [entries]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Layers className="text-blue-600" />
            Material Code Registry
          </h1>
          <p className="text-slate-500 font-medium text-xs mt-1">
            Master repository of instrument specifications and tolerance standards.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Codes" value={stats.total} icon={Layers} colorClass="text-blue-600" bgClass="bg-blue-50" />
        <StatCard title="Standard" value={stats.standard} icon={Activity} colorClass="text-emerald-600" bgClass="bg-emerald-50" />
        <StatCard title="Customized" value={stats.customized} icon={Gauge} colorClass="text-indigo-600" bgClass="bg-indigo-50" />
      </div>

      {/* Grid Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search material registry..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
            onChange={(e) => gridApi?.setQuickFilter(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           <Info size={14} className="text-blue-500" />
           <span>Click on code to view full history</span>
        </div>
      </div>

      {/* AG Grid */}
      <div className="ag-theme-quartz h-[600px] shadow-sm border border-slate-200 rounded-xl overflow-hidden">
        <AgGridReact
          rowData={materialCodes}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={p => setGridApi(p.api)}
          pagination={true}
          paginationPageSize={15}
          animateRows={true}
          headerHeight={44}
          rowHeight={42}
        />
      </div>
    </div>
  );
};

export default MaterialsPage;
