import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1">
        <div className="h-3 w-24 skeleton"></div>
        <div className="h-8 w-16 skeleton"></div>
      </div>
      <div className="w-10 h-10 rounded-lg skeleton"></div>
    </div>
    <div className="h-3 w-32 skeleton"></div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
    <div className="h-12 bg-slate-50 border-b border-slate-200 flex items-center px-6 gap-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`h-3 skeleton ${i === 0 ? 'w-10' : 'flex-1'}`}></div>
      ))}
    </div>
    <div className="divide-y divide-slate-100">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="h-14 flex items-center px-6 gap-4">
          {[...Array(5)].map((__, j) => (
            <div key={j} className={`h-3 skeleton ${j === 0 ? 'w-10' : 'flex-1'}`}></div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 h-80 flex flex-col">
    <div className="flex justify-between items-center mb-8">
      <div className="h-4 w-40 skeleton"></div>
      <div className="flex gap-2">
        <div className="h-2 w-2 rounded-full skeleton"></div>
        <div className="h-2 w-2 rounded-full skeleton"></div>
      </div>
    </div>
    <div className="flex-1 flex items-end gap-2 px-2 pb-4">
      {[...Array(12)].map((_, i) => (
        <div 
          key={i} 
          className="flex-1 skeleton" 
          style={{ height: `${Math.random() * 60 + 20}%` }}
        ></div>
      ))}
    </div>
    <div className="h-2 w-full skeleton mt-4"></div>
  </div>
);

const SkeletonLoader = {
  Card: CardSkeleton,
  Table: TableSkeleton,
  Chart: ChartSkeleton
};

export default SkeletonLoader;
