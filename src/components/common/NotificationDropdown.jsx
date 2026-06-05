import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { 
  Bell, 
  AlertTriangle, 
  Clock, 
  AlertCircle, 
  ChevronRight,
  ShieldAlert,
  Inbox
} from 'lucide-react';
import { isWithinDays, isOverdue, daysUntil } from '../../utils/helpers';

const NotificationDropdown = () => {
  const { entries } = useData();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const alerts = useMemo(() => {
    const items = [];
    entries.forEach(entry => {
      // Overdue
      if (isOverdue(entry.nextDueDateGO) || isOverdue(entry.nextDueDateNOGO)) {
        items.push({
          id: `overdue-${entry.id}`,
          type: 'OVERDUE',
          severity: 'critical',
          title: `Overdue: ${entry.gaugeNo}`,
          subtitle: entry.type,
          gaugeNo: entry.gaugeNo,
          icon: AlertCircle,
          color: 'text-rose-600',
          bg: 'bg-rose-50'
        });
      }
      // Due Soon (14 days)
      else if (isWithinDays(entry.nextDueDateGO, 14) || isWithinDays(entry.nextDueDateNOGO, 14)) {
        const days = Math.min(daysUntil(entry.nextDueDateGO), daysUntil(entry.nextDueDateNOGO));
        items.push({
          id: `due-${entry.id}`,
          type: 'DUE_SOON',
          severity: 'warning',
          title: `Due in ${days}d: ${entry.gaugeNo}`,
          subtitle: entry.type,
          gaugeNo: entry.gaugeNo,
          icon: Clock,
          color: 'text-amber-600',
          bg: 'bg-amber-50'
        });
      }
      // Wear Limit
      if (entry.acceptanceStatus === 'WEAR LIMIT') {
        items.push({
          id: `wear-${entry.id}`,
          type: 'WEAR_LIMIT',
          severity: 'info',
          title: `Wear Limit: ${entry.gaugeNo}`,
          subtitle: 'Maintenance Threshold reached',
          gaugeNo: entry.gaugeNo,
          icon: ShieldAlert,
          color: 'text-blue-600',
          bg: 'bg-blue-50'
        });
      }
    });
    return items.sort((a, b) => {
      const order = { critical: 0, warning: 1, info: 2 };
      return order[a.severity] - order[b.severity];
    });
  }, [entries]);

  const handleNotifyClick = (gaugeNo) => {
    setIsOpen(false);
    navigate(`/history/${gaugeNo}`);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
      >
        <Bell size={20} />
        {alerts.length > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#0a192f]">
            {alerts.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Calibration Alerts</h3>
              <span className="text-[10px] font-bold text-slate-400">{alerts.length} New</span>
            </div>

            <div className="max-h-[360px] overflow-y-auto">
              {alerts.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {alerts.map((alert) => (
                    <button
                      key={alert.id}
                      onClick={() => handleNotifyClick(alert.gaugeNo)}
                      className="w-full p-4 flex gap-3 hover:bg-slate-50 transition-colors text-left group"
                    >
                      <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${alert.bg} ${alert.color}`}>
                        <alert.icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                          {alert.title}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium truncate">
                          {alert.subtitle}
                        </p>
                      </div>
                      <ChevronRight size={14} className="mt-1 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center flex flex-col items-center">
                  <Inbox className="text-slate-200 w-12 h-12 mb-3" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">All systems clear</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">No pending alerts detected</p>
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
              <button 
                onClick={() => { setIsOpen(false); navigate('/dashboard'); }}
                className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline"
              >
                View Analytics Dashboard
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;
