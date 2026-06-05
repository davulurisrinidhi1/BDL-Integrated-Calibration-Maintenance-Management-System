import React from 'react';
import { useData } from '../../context/DataContext';
import { Clock, User, Shield, Info, ArrowRight, AlertTriangle } from 'lucide-react';
import { formatDateTime } from '../../utils/helpers.js';

const RecentActivity = () => {
  const { auditLogs } = useData();

  const getActionIcon = (action) => {
    switch (action) {
      case 'LOGIN': return <User size={14} className="text-blue-600" />;
      case 'CREATE': return <Shield size={14} className="text-emerald-600" />;
      case 'EDIT': return <Clock size={14} className="text-amber-600" />;
      case 'DELETE': return <Info size={14} className="text-rose-600" />;
      default: return <Info size={14} className="text-slate-600" />;
    }
  };

  const getActionBg = (action) => {
    switch (action) {
      case 'LOGIN': return 'bg-blue-50';
      case 'CREATE': return 'bg-emerald-50';
      case 'EDIT': return 'bg-amber-50';
      case 'DELETE': return 'bg-rose-50';
      default: return 'bg-slate-50';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Recent Activity</h3>
        <button className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1">
          VIEW ALL <ArrowRight size={12} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {auditLogs && auditLogs.length > 0 ? (
          auditLogs.slice(0, 8).map((log, idx) => (
            <div key={log.id || idx} className="flex gap-4 relative">
              {/* Timeline Line */}
              {idx !== Math.min(auditLogs.length, 8) - 1 && (
                <div className="absolute left-[15px] top-[30px] bottom-[-15px] w-[2px] bg-slate-100"></div>
              )}
              
              <div className={`mt-1 z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${getActionBg(log.action)}`}>
                {getActionIcon(log.action)}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-bold text-slate-800">{log.action}</p>
                  <span className="text-[10px] font-medium text-slate-400 uppercase">
                    {log.timestamp ? formatDateTime(log.timestamp) : 'N/A'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">{log.detail}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    {log.user}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium italic">
                    {log.role}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
            <Clock size={40} className="mb-4 opacity-20" />
            <p className="text-sm font-medium">No activity recorded yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
