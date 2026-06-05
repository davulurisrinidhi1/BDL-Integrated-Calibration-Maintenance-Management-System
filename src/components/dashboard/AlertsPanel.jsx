import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { 
  AlertTriangle, 
  Clock, 
  AlertCircle, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { isWithinDays, isOverdue, daysUntil } from '../../utils/helpers.js';

const AlertsPanel = () => {
  const { entries } = useData();

  const alerts = useMemo(() => {
    const items = [];

    entries.forEach(entry => {
      // Overdue Check
      if (isOverdue(entry.nextDueDateGO) || isOverdue(entry.nextDueDateNOGO)) {
        items.push({
          id: `overdue-${entry.id}`,
          type: 'OVERDUE',
          severity: 'CRITICAL',
          title: `Calibration Overdue: ${entry.gaugeNo}`,
          subtitle: `${entry.type} — ${entry.materialCode}`,
          date: entry.nextDueDateGO || entry.nextDueDateNOGO,
          entryId: entry.id
        });
      }
      // Due Soon Check (Next 14 days)
      else if (isWithinDays(entry.nextDueDateGO, 14) || isWithinDays(entry.nextDueDateNOGO, 14)) {
        const days = Math.min(daysUntil(entry.nextDueDateGO), daysUntil(entry.nextDueDateNOGO));
        items.push({
          id: `due-${entry.id}`,
          type: 'DUE_SOON',
          severity: 'WARNING',
          title: `Due in ${days} days: ${entry.gaugeNo}`,
          subtitle: `${entry.type} — ${entry.materialCode}`,
          date: entry.nextDueDateGO || entry.nextDueDateNOGO,
          entryId: entry.id
        });
      }

      // Wear Limit Warning
      if (entry.acceptanceStatus === 'WEAR LIMIT') {
        items.push({
          id: `wear-${entry.id}`,
          type: 'WEAR_LIMIT',
          severity: 'INFO',
          title: `Wear Limit Warning: ${entry.gaugeNo}`,
          subtitle: `Approach maintenance threshold`,
          date: entry.calibrationDate,
          entryId: entry.id
        });
      }
    });

    return items.sort((a, b) => {
      const severityMap = { CRITICAL: 0, WARNING: 1, INFO: 2 };
      return severityMap[a.severity] - severityMap[b.severity];
    });
  }, [entries]);

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-rose-50 border-rose-100 text-rose-700 icon-rose-600';
      case 'WARNING': return 'bg-amber-50 border-amber-100 text-amber-700 icon-amber-600';
      case 'INFO': return 'bg-blue-50 border-blue-100 text-blue-700 icon-blue-600';
      default: return 'bg-slate-50 border-slate-100 text-slate-700 icon-slate-600';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'OVERDUE': return <AlertCircle size={16} />;
      case 'DUE_SOON': return <Clock size={16} />;
      case 'WEAR_LIMIT': return <ShieldAlert size={16} />;
      default: return <AlertTriangle size={16} />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
      <div className="p-6 border-b border-slate-100">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">System Alerts</h3>
          <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {alerts.filter(a => a.severity === 'CRITICAL').length} CRITICAL
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div 
              key={alert.id}
              className={`p-3 rounded-lg border flex gap-3 items-start transition-all hover:shadow-sm cursor-pointer group ${getSeverityStyles(alert.severity)}`}
            >
              <div className="mt-0.5 shrink-0">
                {getIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold leading-none mb-1 truncate">{alert.title}</p>
                <p className="text-[10px] opacity-80 font-medium truncate">{alert.subtitle}</p>
              </div>
              <ChevronRight size={14} className="mt-1 opacity-20 group-hover:opacity-100 transition-opacity" />
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
               <AlertTriangle size={24} className="opacity-20" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider">No Active Alerts</p>
            <p className="text-[10px] font-medium mt-1">System status: Normal</p>
          </div>
        )}
      </div>
      
      {alerts.length > 0 && (
        <div className="p-3 border-t border-slate-50 bg-slate-50/50 text-center">
          <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">
            Manage All Alerts
          </button>
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;
