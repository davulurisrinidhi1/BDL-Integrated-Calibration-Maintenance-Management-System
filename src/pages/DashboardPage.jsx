import React, { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts';
import { 
  LayoutDashboard, 
  Settings2, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Layers,
  Thermometer
} from 'lucide-react';

import StatCard from '../components/dashboard/StatCard';
import ChartCard from '../components/dashboard/ChartCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import AlertsPanel from '../components/dashboard/AlertsPanel';
import { isOverdue, isWithinDays, formatDate } from '../utils/helpers';

const DashboardPage = () => {
  const { entries, materialCodes, auditLogs, machineAssets } = useData();
  const [masterGridApi, setMasterGridApi] = useState(null);
  const [dueGridApi, setDueGridApi] = useState(null);

  // ── Statistics Calculations ────────────────────────────────────
  const stats = useMemo(() => {
    const totalGauges = entries.filter(e => e?.type?.includes('Gauge')).length;
    const totalInstruments = entries.filter(e => e?.type && !e.type.includes('Gauge')).length;
    const accepted = entries.filter(e => e.acceptanceStatus === 'ACCEPTED').length;
    const rejected = entries.filter(e => e.acceptanceStatus === 'REJECTED').length;
    const wearLimit = entries.filter(e => e.acceptanceStatus === 'WEAR LIMIT').length;
    const dueSoon = entries.filter(e => isWithinDays(e.nextDueDateGO, 14) || isWithinDays(e.nextDueDateNOGO, 14)).length;
    const overdue = entries.filter(e => isOverdue(e.nextDueDateGO) || isOverdue(e.nextDueDateNOGO)).length;

    return {
      totalInstruments,
      totalGauges,
      due: dueSoon + overdue,
      accepted,
      rejected,
      wearLimit
    };
  }, [entries]);

  // Aggregation for Master List
  const masterList = useMemo(() => {
    const instGauges = entries.map(e => ({
      assetCode: e.gaugeNo,
      assetType: e.type,
      description: e.description || `${e.type} - ${e.materialCode}`,
      department: 'Quality/Metrology',
      status: e.status,
      periodicity: e.periodicity,
      lastActivity: e.calibrationDate,
      nextDueDate: e.nextDueDateGO
    }));
    const machines = (machineAssets || []).map(m => ({
      assetCode: m.code,
      assetType: m.type,
      description: m.description,
      department: m.department,
      status: m.status,
      periodicity: m.periodicity,
      lastActivity: m.lastActivity,
      nextDueDate: m.nextDueDate
    }));
    return [...instGauges, ...machines];
  }, [entries, machineAssets]);

  // Aggregation for Due List
  const dueList = useMemo(() => {
    return masterList.map(item => {
      let badgeStatus = 'Green';
      if (isOverdue(item.nextDueDate)) badgeStatus = 'Red';
      else if (isWithinDays(item.nextDueDate, 14)) badgeStatus = 'Yellow';
      
      return {
        codeNumber: item.assetCode,
        assetType: item.assetType,
        activityType: item.assetType.includes('Compressor') || item.assetType.includes('AC') ? 'Maintenance' : 'Calibration',
        periodicity: item.periodicity,
        lastDate: item.lastActivity,
        dueDate: item.nextDueDate,
        status: badgeStatus,
        nextScheduledDate: item.nextDueDate,
        postponementReason: ''
      };
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [masterList]);

  const masterColDefs = useMemo(() => [
    { field: 'assetCode', headerName: 'Asset Code', width: 150 },
    { field: 'assetType', headerName: 'Asset Type', width: 150 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'department', headerName: 'Department', width: 150 },
    { field: 'status', headerName: 'Status', width: 100 },
    { field: 'periodicity', headerName: 'Periodicity', width: 150 },
    { field: 'lastActivity', headerName: 'Last Activity', width: 130 },
    { field: 'nextDueDate', headerName: 'Next Due Date', width: 130 }
  ], []);

  const dueColDefs = useMemo(() => [
    { field: 'codeNumber', headerName: 'Code Number', width: 140 },
    { field: 'assetType', headerName: 'Asset Type', width: 140 },
    { field: 'activityType', headerName: 'Activity Type', width: 120 },
    { field: 'periodicity', headerName: 'Periodicity', width: 150 },
    { field: 'lastDate', headerName: 'Last Date', width: 120 },
    { field: 'dueDate', headerName: 'Due Date', width: 120 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      cellRenderer: (params) => {
        if (!params.value) return null;
        const colorMap = {
          'Green': { dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700', label: 'On Track' },
          'Yellow': { dot: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700', label: 'Due Soon' },
          'Red': { dot: 'bg-rose-500', badge: 'bg-rose-100 text-rose-700', label: 'Overdue' }
        };
        const style = colorMap[params.value] || { dot: 'bg-slate-500', badge: 'bg-slate-100 text-slate-700', label: params.value };
        return (
          <div className="flex items-center gap-1.5 h-full">
            <div className={`w-2.5 h-2.5 rounded-full ${style.dot} shadow-sm`} />
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${style.badge}`}>
              {style.label}
            </span>
          </div>
        );
      }
    },
    { field: 'nextScheduledDate', headerName: 'Next Scheduled', width: 140 },
    { field: 'postponementReason', headerName: 'Postponement Reason', flex: 1, editable: true }
  ], []);

  // ── Chart Data Aggregation ─────────────────────────────────────
  
  // 1. Monthly Trend (Mocked months for better visualization if data is sparse)
  const monthlyTrendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const last6Months = [];
    
    for (let i = 5; i >= 0; i--) {
      const mIdx = (currentMonth - i + 12) % 12;
      last6Months.push({ name: months[mIdx], count: 0 });
    }

    entries.forEach(e => {
      const date = new Date(e.calibrationDate);
      const monthName = months[date.getMonth()];
      const found = last6Months.find(m => m.name === monthName);
      if (found) found.count++;
    });

    return last6Months;
  }, [entries]);

  // 2. Acceptance vs Rejection
  const statusDistribution = useMemo(() => [
    { name: 'Accepted', value: stats.accepted, color: '#10b981' },
    { name: 'Rejected', value: stats.rejected, color: '#f43f5e' },
    { name: 'Wear Limit', value: stats.wearLimit, color: '#f59e0b' }
  ], [stats]);

  // 3. Instrument Type Distribution
  const typeDistribution = useMemo(() => {
    const counts = {};
    entries.forEach(e => {
      counts[e.type] = (counts[e.type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [entries]);

  const COLORS = ['#0a192f', '#3b82f6', '#64748b', '#94a3b8'];

  return (
    <div className="space-y-8 p-1">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <LayoutDashboard className="text-blue-600" />
            Control Dashboard
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Enterprise Calibration & Metrology Management Overview
          </p>
        </div>
        
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold text-slate-700 flex items-center gap-2 hover:bg-slate-50 transition-all">
            <Calendar size={16} />
            LAST 30 DAYS
          </button>
          <button className="bg-[#0a192f] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-blue-900/20">
            <Settings2 size={16} />
            CONFIGURE
          </button>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard 
          title="Total Instruments" 
          value={stats.totalInstruments} 
          icon={Thermometer} 
          colorClass="text-blue-600"
          bgClass="bg-blue-50"
        />
        <StatCard 
          title="Total Gauges" 
          value={stats.totalGauges} 
          icon={Layers} 
          colorClass="text-indigo-600"
          bgClass="bg-indigo-50"
        />
        <StatCard 
          title="Due / Overdue" 
          value={stats.due} 
          icon={Calendar} 
          colorClass="text-rose-600"
          bgClass="bg-rose-50"
          trend={{ value: 12, positive: false }}
        />
        <StatCard 
          title="Accepted" 
          value={stats.accepted} 
          icon={CheckCircle2} 
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50"
        />
        <StatCard 
          title="Rejected" 
          value={stats.rejected} 
          icon={XCircle} 
          colorClass="text-rose-500"
          bgClass="bg-rose-50"
        />
        <StatCard 
          title="Wear Limit" 
          value={stats.wearLimit} 
          icon={AlertTriangle} 
          colorClass="text-amber-500"
          bgClass="bg-amber-50"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Calibration Throughput (Last 6 Months)">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrendData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorCount)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Instrument Classification">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={typeDistribution} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false}
                tick={{fill: '#475569', fontSize: 11, fontWeight: 700}}
                width={120}
              />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                {typeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Bottom Grid: Panels & Secondary Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quality Distribution Pie */}
        <div className="lg:col-span-1">
          <ChartCard title="Quality Status Distribution" height="h-full">
            <div className="flex flex-col items-center justify-center h-full">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold text-slate-800">
                  {Math.round((stats.accepted / (entries.length || 1)) * 100)}%
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  First-Pass Yield
                </div>
              </div>
            </div>
          </ChartCard>
        </div>

        {/* System Panels */}
        <div className="lg:col-span-1 min-h-[500px]">
          <AlertsPanel />
        </div>
        
        <div className="lg:col-span-1 min-h-[500px]">
          <RecentActivity />
        </div>
      </div>

      {/* Aggregated Machine & Calibration Master Lists */}
      <div className="grid grid-cols-1 gap-8 mt-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[400px]">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Layers size={20} className="text-blue-600" />
            Unified Master List (Machines + Instruments)
          </h2>
          <div className="flex-1 ag-theme-quartz border border-slate-200 rounded-xl overflow-hidden">
            <AgGridReact
              rowData={masterList}
              columnDefs={masterColDefs}
              defaultColDef={{ sortable: true, filter: true, resizable: true }}
              onGridReady={(params) => setMasterGridApi(params.api)}
              rowHeight={40}
              headerHeight={44}
              pagination={true}
              paginationPageSize={10}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[400px]">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-rose-500" />
            Unified Due List
          </h2>
          <div className="flex-1 ag-theme-quartz border border-slate-200 rounded-xl overflow-hidden">
            <AgGridReact
              rowData={dueList}
              columnDefs={dueColDefs}
              defaultColDef={{ sortable: true, filter: true, resizable: true }}
              onGridReady={(params) => setDueGridApi(params.api)}
              rowHeight={40}
              headerHeight={44}
              pagination={true}
              paginationPageSize={10}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
