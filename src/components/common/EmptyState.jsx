import React from 'react';
import { Database } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon = Database, 
  title = "No data found", 
  description = "There are no records matching your current filters or criteria.",
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-slate-300 text-center animate-in fade-in duration-300">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
        <Icon className="text-slate-300 w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-700 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="btn btn-primary btn-sm px-6"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
