import React, { useMemo, useState, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  Search, 
  Download, 
  CheckCircle2, 
  AlertTriangle,
  History,
  FileCheck,
  Zap,
  Filter,
  RefreshCw,
  Eye,
  Printer,
  ExternalLink
} from 'lucide-react';
import { generateCertificatePDF } from '../utils/certificateGenerator';
import StatCard from '../components/dashboard/StatCard';
import ExportPreviewModal from '../components/common/ExportPreviewModal';
import toast from 'react-hot-toast';

const CertificatesPage = () => {
  const { entries, generateCertificate, trackExport, getMaterial } = useData();
  const { user } = useAuth();
  const [gridApi, setGridApi] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [filterType, setFilterType] = useState('ALL');

  // Filter entries that are eligible for certificates
  const eligibleEntries = useMemo(() => {
    let filtered = entries.filter(e => e.acceptanceStatus === 'ACCEPTED' || e.acceptanceStatus === 'WEAR LIMIT');
    if (filterType === 'GENERATED') return filtered.filter(e => e.certGenerated);
    if (filterType === 'PENDING') return filtered.filter(e => !e.certGenerated);
    return filtered;
  }, [entries, filterType]);

  const stats = useMemo(() => {
    const total = eligibleEntries.length;
    const generated = eligibleEntries.filter(e => e.certGenerated).length;
    const pending = total - generated;
    return { total, generated, pending };
  }, [eligibleEntries]);

  const handleDownload = useCallback(async (data) => {
    try {
      toast.loading('Preparing SAP-BDL Certificate...', { id: 'cert' });
      
      // If cert not generated, generate it first in state
      if (!data.certGenerated) {
        await generateCertificate(data.id, user.employeeId, user.role);
      }
      
      const material = getMaterial(data.materialCode);
      await generateCertificatePDF(data, material, user);
      trackExport('PDF', 'Certificate', user.employeeId, 1);
      toast.success('Certificate Downloaded Successfully', { id: 'cert' });
    } catch (e) {
      toast.error('System Export Failure', { id: 'cert' });
      console.error(e);
    }
  }, [generateCertificate, user, trackExport]);

  const handlePreview = (entry) => {
    setSelectedEntry(entry);
    setIsPreviewOpen(true);
  };

  const handleRegenerate = async (data) => {
    if (window.confirm('Regenerate certificate serial number? This will create a new audit entry.')) {
      await generateCertificate(data.id, user.employeeId, user.role);
      toast.success('Certificate regenerated with new ID');
    }
  };

  const columnDefs = useMemo(() => [
    { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', width: 70, pinned: 'left' },
    { 
      field: 'certId', 
      headerName: 'Serial No.', 
      width: 160, 
      cellStyle: { fontWeight: 'bold', color: '#1e3a5f' },
      cellRenderer: (p) => p.value || <span className="text-slate-300 italic">Not Assigned</span>
    },
    { field: 'materialCode', headerName: 'Material Code', width: 140 },
    { field: 'gaugeNo', headerName: 'Gauge Number', width: 150 },
    { field: 'calibrationDate', headerName: 'Calibration Date', width: 140 },
    { 
      field: 'acceptanceStatus', 
      headerName: 'Status', 
      width: 140,
      cellRenderer: (p) => {
        const cls = p.value === 'ACCEPTED' ? 'badge-accepted' : 'badge-wearlimit';
        return <span className={`badge ${cls}`}>{p.value}</span>;
      }
    },
    {
      field: 'certGenerated',
      headerName: 'SAP Sync',
      width: 120,
      cellRenderer: (p) => (
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${p.value ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase">{p.value ? 'SYNCED' : 'LOCAL'}</span>
        </div>
      )
    },
    {
      headerName: 'Actions',
      width: 220,
      pinned: 'right',
      cellRenderer: (params) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handlePreview(params.data)}
            className="p-1.5 text-slate-600 hover:bg-slate-50 rounded"
            title="Preview Certificate"
          >
            <Eye size={16} />
          </button>
          <button 
            onClick={() => handleDownload(params.data)}
            className="btn btn-xs btn-primary gap-1.5"
            title="Download PDF"
          >
            <Download size={12} />
            PDF
          </button>
          <button 
            onClick={() => handleRegenerate(params.data)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Regenerate"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      )
    }
  ], [handleDownload]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="p-1.5 bg-[#0a192f] rounded-lg">
              <FileCheck className="text-blue-400 w-5 h-5" />
            </div>
            Metrology Certificate Repository
          </h1>
          <p className="text-slate-500 font-medium text-xs mt-1">
            Browse, manage, and export official calibration certificates for BDL Quality Management.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="btn btn-secondary text-[10px] tracking-widest font-black">
            <Printer size={14} />
            PRINT BATCH
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Certificates" value={stats.total} icon={FileText} colorClass="text-blue-600" bgClass="bg-blue-50" />
        <StatCard title="SAP Synchronized" value={stats.generated} icon={CheckCircle2} colorClass="text-emerald-600" bgClass="bg-emerald-50" />
        <StatCard title="Pending Generation" value={stats.pending} icon={Zap} colorClass="text-amber-600" bgClass="bg-amber-50" />
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by Gauge, Material, or Serial..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
            onChange={(e) => gridApi?.setQuickFilter(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {['ALL', 'GENERATED', 'PENDING'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-md text-[10px] font-black tracking-widest transition-all ${
                  filterType === type ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="ag-theme-quartz h-[600px] shadow-sm border border-slate-200 rounded-xl overflow-hidden">
        <AgGridReact
          rowData={eligibleEntries}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={p => setGridApi(p.api)}
          pagination={true}
          paginationPageSize={15}
          animateRows={true}
          headerHeight={44}
          rowHeight={42}
          overlayNoRowsTemplate="<div class='flex flex-col items-center p-8'><span class='text-slate-400 font-bold uppercase tracking-widest text-xs'>No Certificates Available</span></div>"
        />
      </div>

      {/* Preview Modal */}
      {selectedEntry && (
        <ExportPreviewModal 
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          onExport={(f) => f === 'pdf' ? handleDownload(selectedEntry) : null}
          data={[selectedEntry]}
          user={user}
        />
      )}
    </div>
  );
};

export default CertificatesPage;
