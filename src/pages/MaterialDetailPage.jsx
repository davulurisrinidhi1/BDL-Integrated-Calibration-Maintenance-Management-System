import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  ArrowLeft, 
  Search, 
  History as HistoryIcon, 
  FileText, 
  Calendar,
  Layers,
  Info,
  ChevronRight,
  Filter
} from 'lucide-react';
import { formatDate } from '../utils/helpers';

const MaterialDetailPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { entries, getMaterial } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  // ── Data Fetching ──────────────────────────────────────────
  const material = useMemo(() => getMaterial(code), [code, getMaterial]);
  
  const relatedEntries = useMemo(() => {
    return entries.filter(e => e.materialCode === code);
  }, [entries, code]);

  const filteredEntries = useMemo(() => {
    if (!searchTerm) return relatedEntries;
    return relatedEntries.filter(e => 
      e.gaugeNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.cribNo?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [relatedEntries, searchTerm]);

  if (!material) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-slate-400">
        <Layers size={64} className="mb-4 opacity-20" />
        <h2 className="text-xl font-bold text-slate-600">Material Not Found</h2>
        <p className="mt-2">The requested material code "{code}" does not exist in the system.</p>
        <button 
          onClick={() => navigate(-1)}
          className="mt-6 flex items-center gap-2 text-blue-600 font-bold hover:underline"
        >
          <ArrowLeft size={16} /> GO BACK
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="mt-1 p-2 hover:bg-white rounded-lg transition-colors shadow-sm border border-transparent hover:border-slate-200"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{material.code}</h1>
              <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
                {material.type}
              </span>
            </div>
            <p className="text-slate-500 font-medium text-sm mt-1">{material.description}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
             <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Tolerance GO</div>
                <div className="text-sm font-bold text-slate-900">± {material.toleranceGO || 'N/A'}</div>
             </div>
             <div className="w-[1px] h-8 bg-slate-100"></div>
             <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Wear Limit</div>
                <div className="text-sm font-bold text-slate-900">{material.wearAllowanceGO || 'N/A'}</div>
             </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Active Gauges</div>
          <div className="text-2xl font-bold text-slate-900">{relatedEntries.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Standard Periodicity</div>
          <div className="text-2xl font-bold text-blue-600">{relatedEntries[0]?.periodicity || '6 Months'}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Needs Attention</div>
          <div className="text-2xl font-bold text-rose-600">
            {relatedEntries.filter(e => e.acceptanceStatus === 'REJECTED' || e.acceptanceStatus === 'WEAR LIMIT').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Inventory Value</div>
          <div className="text-2xl font-bold text-slate-900">₹ {(relatedEntries.length * 4500).toLocaleString()}</div>
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
            <Layers size={16} className="text-blue-600" />
            Gauge Inventory
          </h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search Gauge No..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 w-48 transition-all"
              />
            </div>
            <button className="p-2 hover:bg-white rounded border border-slate-200 text-slate-500">
              <Filter size={14} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/50 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4 w-16 text-center">S.No</th>
                <th className="px-6 py-4">Gauge Number</th>
                <th className="px-6 py-4">Last Calibration</th>
                <th className="px-6 py-4">Next Due Date</th>
                <th className="px-6 py-4">Tool Crib No</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Traceability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEntries.map((entry, idx) => (
                <tr key={entry.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4 text-center text-slate-400 font-bold text-xs">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{entry.gaugeNo}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-medium">{entry.type}</div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-600">
                    {formatDate(entry.calibrationDate)}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <div className="font-bold text-slate-800">{formatDate(entry.nextDueDateGO)}</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">
                      {new Date(entry.nextDueDateGO) < new Date() ? 'OVERDUE' : 'SCHEDULED'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                      {entry.cribNo || 'C01'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${
                      entry.acceptanceStatus === 'ACCEPTED' ? 'badge-accepted' : 
                      entry.acceptanceStatus === 'REJECTED' ? 'badge-rejected' : 
                      'badge-wearlimit'
                    }`}>
                      {entry.acceptanceStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      to={`/history/${encodeURIComponent(entry.gaugeNo)}`}
                      className="inline-flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-widest hover:underline"
                    >
                      <HistoryIcon size={12} />
                      HISTORY
                      <ChevronRight size={10} />
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400 italic text-sm">
                    No gauges found for this material code.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
           <div className="flex gap-4 items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                 <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                 <span>S1: In-Service</span>
              </div>
              <div className="flex items-center gap-1.5">
                 <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                 <span>S2: Quarantined</span>
              </div>
           </div>
           <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1">
              <FileText size={12} />
              EXPORT MATERIAL REPORT
           </button>
        </div>
      </div>
    </div>
  );
};

export default MaterialDetailPage;
