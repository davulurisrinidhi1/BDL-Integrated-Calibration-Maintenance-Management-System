import React from 'react';
import { 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X, 
  Zap,
  CheckCircle2
} from 'lucide-react';

const AIValidationBanner = ({ messages = [], onDismiss }) => {
  if (!messages || messages.length === 0) return null;

  const getSeverityStyles = (type) => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          text: 'text-rose-800',
          icon: <AlertCircle className="text-rose-600 shrink-0" size={18} />,
          badge: 'bg-rose-600'
        };
      case 'warn':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-800',
          icon: <AlertTriangle className="text-amber-600 shrink-0" size={18} />,
          badge: 'bg-amber-600'
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: <Info className="text-blue-600 shrink-0" size={18} />,
          badge: 'bg-blue-600'
        };
    }
  };

  return (
    <div className="space-y-3 mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="text-indigo-600 fill-indigo-600" size={14} />
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">AI Validation Engine Analysis</h3>
      </div>
      
      {messages.map((msg, idx) => {
        const styles = getSeverityStyles(msg.type);
        return (
          <div 
            key={idx}
            className={`${styles.bg} ${styles.border} border p-3 rounded-lg flex gap-3 items-start relative group shadow-sm`}
          >
            {styles.icon}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-[9px] text-white font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${styles.badge}`}>
                  {msg.type}
                </span>
                {msg.field && (
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                     Field: {msg.field}
                   </span>
                )}
              </div>
              <p className={`text-sm font-semibold leading-tight ${styles.text}`}>
                {msg.message}
              </p>
            </div>
            {onDismiss && (
              <button 
                onClick={() => onDismiss(idx)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/50 rounded"
              >
                <X size={14} className="text-slate-400" />
              </button>
            )}
          </div>
        );
      })}

      {messages.every(m => m.type !== 'error') && messages.length > 0 && (
         <div className="flex items-center gap-2 px-1">
            <CheckCircle2 size={12} className="text-emerald-500" />
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
               Entry is valid for submission with warnings
            </p>
         </div>
      )}
    </div>
  );
};

export default AIValidationBanner;
