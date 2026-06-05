import React from 'react';
import { Info, HelpCircle } from 'lucide-react';

const STATUS_MAPPINGS = [
  { code: 'S1', label: 'In-Service', color: 'bg-emerald-500' },
  { code: 'S2', label: 'Quarantined', color: 'bg-rose-500' },
  { code: 'S3', label: 'Repaired', color: 'bg-blue-500' },
  { code: 'S4', label: 'New Instrument', color: 'bg-indigo-500' },
  { code: 'S5', label: 'Withdrawn', color: 'bg-slate-500' },
];

const CRIB_MAPPINGS = [
  { code: 'C01', label: 'Main Metrology Lab' },
  { code: 'C02', label: 'Assembly Line A Crib' },
  { code: 'C03', label: 'Machining Shop Crib' },
  { code: 'C04', label: 'Final QC Station' },
];

const StatusLegend = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-32 right-0 z-50 bg-[#0a192f] text-white p-2 rounded-l-lg shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2 border border-r-0 border-blue-900"
        title="View System Codes"
      >
        <HelpCircle size={16} />
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
          Codes
        </span>
      </button>

      <div className={`fixed top-24 right-0 z-40 w-64 h-[calc(100vh-8rem)] bg-white/95 backdrop-blur-md border-l border-y border-slate-200 rounded-l-xl shadow-2xl p-4 transition-transform duration-300 overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <HelpCircle className="text-blue-600 w-4 h-4" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">System Codes</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Status Codes */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Status Codes</h4>
            <div className="grid grid-cols-1 gap-2">
              {STATUS_MAPPINGS.map((status) => (
                <div key={status.code} className="flex items-center gap-2 group cursor-default">
                  <span className={`w-2 h-2 rounded-full ${status.color}`}></span>
                  <span className="text-[11px] font-bold text-slate-700 w-6">{status.code}</span>
                  <span className="text-[11px] text-slate-500 font-medium group-hover:text-slate-800 transition-colors">
                    {status.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Crib Numbers */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Crib Locations</h4>
            <div className="grid grid-cols-1 gap-2">
              {CRIB_MAPPINGS.map((crib) => (
                <div key={crib.code} className="flex items-center gap-2 group cursor-default">
                  <span className="text-[11px] font-bold text-slate-700 w-8">{crib.code}</span>
                  <span className="text-[11px] text-slate-500 font-medium group-hover:text-slate-800 transition-colors">
                    {crib.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-slate-100 flex items-start gap-2">
          <Info className="w-3 h-3 text-blue-400 shrink-0 mt-0.5" />
          <p className="text-[9px] leading-relaxed text-slate-400 font-medium">
            Use codes during entry for faster throughput. These mappings are standardized for SAP-BDL compatibility.
          </p>
        </div>
      </div>
    </>
  );
};

export default StatusLegend;
