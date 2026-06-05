import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  FileJson, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  User,
  Settings
} from 'lucide-react';
import { formatDateTime } from '../../utils/helpers';

const ExportPreviewModal = ({ 
  isOpen, 
  onClose, 
  onExport, 
  data = [], 
  title = "Calibration Data Export",
  user = null
}) => {
  const [exportFormat, setExportFormat] = useState('excel');
  
  if (!isOpen) return null;

  const formats = [
    { id: 'excel', label: 'Excel (.xlsx)', icon: FileSpreadsheet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'csv', label: 'CSV (.csv)', icon: FileJson, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'pdf', label: 'PDF Summary (.pdf)', icon: FileText, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const handleExportClick = () => {
    onExport(exportFormat);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#0a192f] p-6 flex justify-between items-center text-white">
          <div>
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <Download className="text-blue-400" />
              Export Preview
            </h2>
            <p className="text-blue-300 text-[10px] font-bold uppercase tracking-widest mt-1">
              Secure Data Transmission Terminal
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
             <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2 text-slate-400">
                   <Clock size={14} />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Timestamp</span>
                </div>
                <div className="text-xs font-bold text-slate-800">{formatDateTime(new Date())}</div>
             </div>
             
             <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2 text-slate-400">
                   <CheckCircle2 size={14} />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Records</span>
                </div>
                <div className="text-xs font-bold text-slate-800">{data.length} Entries Ready</div>
             </div>

             <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2 text-slate-400">
                   <User size={14} />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Operator</span>
                </div>
                <div className="text-xs font-bold text-slate-800">{user?.employeeId || 'ADMIN-01'}</div>
             </div>
          </div>

          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Select Export Format</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {formats.map((format) => (
              <button
                key={format.id}
                onClick={() => setExportFormat(format.id)}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                  exportFormat === format.id 
                    ? 'border-blue-600 bg-blue-50/50 shadow-md ring-4 ring-blue-50' 
                    : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                }`}
              >
                <div className={`p-3 rounded-lg ${format.bg} ${format.color}`}>
                  <format.icon size={24} />
                </div>
                <span className="text-xs font-bold text-slate-700">{format.label}</span>
              </button>
            ))}
          </div>

          {/* Validation Status */}
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 mb-8">
             <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
                <CheckCircle2 className="text-white" size={18} />
             </div>
             <div>
                <div className="text-xs font-bold text-emerald-800">SAP Compatibility Verified</div>
                <div className="text-[10px] text-emerald-600 font-medium">All data structures match Bharat Dynamics Limited ERP requirements.</div>
             </div>
          </div>

          {/* Table Preview (Summary) */}
          <div className="border border-slate-200 rounded-lg overflow-hidden mb-8">
            <table className="w-full text-left text-[10px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2 font-bold text-slate-500 uppercase">Material</th>
                  <th className="px-4 py-2 font-bold text-slate-500 uppercase">Gauge No</th>
                  <th className="px-4 py-2 font-bold text-slate-500 uppercase">Result</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 3).map((item, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-2 font-medium">{item.materialCode}</td>
                    <td className="px-4 py-2 font-medium">{item.gaugeNo}</td>
                    <td className="px-4 py-2">
                       <span className={`px-2 py-0.5 rounded-full font-bold ${
                         item.acceptanceStatus === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                       }`}>
                         {item.acceptanceStatus}
                       </span>
                    </td>
                  </tr>
                ))}
                {data.length > 3 && (
                  <tr>
                    <td colSpan="3" className="px-4 py-2 text-center text-slate-400 font-medium bg-slate-50/50 italic">
                      + {data.length - 3} more records...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleExportClick}
            className="bg-[#0a192f] hover:bg-slate-800 text-white font-bold px-8 py-2.5 rounded-lg shadow-lg shadow-blue-900/10 flex items-center gap-2 text-xs uppercase tracking-widest transition-all active:scale-[0.98]"
          >
            <Download size={16} />
            Initialize Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportPreviewModal;
