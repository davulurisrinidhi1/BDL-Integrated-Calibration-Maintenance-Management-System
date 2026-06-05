import React from 'react';

const ChartCard = ({ title, children, height = "h-80" }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">{title}</h3>
        <div className="flex gap-2">
          {/* Mock filters or actions */}
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <div className="w-2 h-2 rounded-full bg-slate-200"></div>
        </div>
      </div>
      
      <div className={`w-full ${height}`}>
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
