import React from 'react';


const StatCard = ({ title, value, icon: Icon, trend, colorClass = "text-blue-600", bgClass = "bg-blue-50" }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
          
          {trend && (
            <div className={`mt-2 flex items-center text-xs font-bold ${trend.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
              <span>{trend.positive ? '+' : '-'}{trend.value}%</span>
              <span className="text-slate-400 ml-1 font-medium">vs last month</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-lg ${bgClass} ${colorClass}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
