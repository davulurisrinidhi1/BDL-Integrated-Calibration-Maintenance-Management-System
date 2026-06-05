import React, { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Settings2, ShieldAlert, Archive, ClipboardList, TrendingUp, Search, PenTool, Calendar, Zap, ChevronRight, AlertTriangle, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const MachineDashboardPage = () => {
  const { machineAssets, machineTasks, machineSpares, machineWorkOrders, maintenanceOrders, machineStrategies, selectedMachineCode, setSelectedMachineCode, selectedMachine } = useData();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState(selectedMachineCode || '');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      toast.error('Please enter an Equipment Code');
      return;
    }
    const found = machineAssets.find(m => m.code.toLowerCase() === searchInput.trim().toLowerCase());
    if (found) {
      setSelectedMachineCode(found.code);
      toast.success(`Context locked to ${found.code}`);
    } else {
      toast.error('Machine not found in registry');
    }
  };

  const stats = useMemo(() => {
    if (!selectedMachineCode) return null;
    const filteredSpares = machineSpares.filter(s => s.code === selectedMachineCode);
    const criticalSpares = filteredSpares.filter(s => s.quantity <= (s.threshold || 5));
    return {
      totalTasks: machineTasks.filter(t => t.code === selectedMachineCode).length,
      totalSpares: filteredSpares.length,
      criticalSpares: criticalSpares.length,
      openWorkOrders: machineWorkOrders.filter(w => w.code === selectedMachineCode && w.systemStatus !== 'TECO' && w.systemStatus !== 'CLSD').length,
      pendingMaintenance: maintenanceOrders.filter(m => m.code === selectedMachineCode && m.status !== 'Completed').length,
      smStrategies: (machineStrategies || []).filter(s => s.code === selectedMachineCode && s.type === 'SM').length,
      pmStrategies: (machineStrategies || []).filter(s => s.code === selectedMachineCode && s.type === 'PM').length,
    };
  }, [selectedMachineCode, machineTasks, machineSpares, machineWorkOrders, maintenanceOrders, machineStrategies]);

  // Upcoming maintenance
  const nextActivity = useMemo(() => {
    if (!selectedMachineCode) return null;
    const upcoming = maintenanceOrders
      .filter(m => m.code === selectedMachineCode && m.status !== 'Completed' && m.plannedDate)
      .sort((a, b) => new Date(a.plannedDate) - new Date(b.plannedDate));
    return upcoming[0] || null;
  }, [selectedMachineCode, maintenanceOrders]);

  if (!selectedMachine) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-lg text-center">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <LayoutDashboard size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Machine Operations Center</h1>
          <p className="text-slate-500 font-medium text-sm mb-8">Enter an Equipment Code to load the operational context.</p>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="e.g. AC-COMP-001"
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl text-base font-bold focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all"
                autoFocus
              />
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/30">
              Load Machine Context
            </button>
          </form>
          
          <div className="mt-8 text-left p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Available Prototype Codes:</p>
            <div className="flex gap-2 flex-wrap">
              {machineAssets.map(m => (
                <button key={m.code} onClick={() => { setSearchInput(m.code); setSelectedMachineCode(m.code); toast.success(`Context locked to ${m.code}`); }} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-600 hover:border-indigo-400">
                  {m.code}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1 animate-in fade-in duration-500">
      {/* Machine Header */}
      <div className="flex justify-between items-start bg-slate-900 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-indigo-500/30 text-indigo-200 text-[10px] font-black uppercase tracking-widest rounded border border-indigo-400/30">Active Context</span>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-widest rounded border border-emerald-500/30">{selectedMachine.status}</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">{selectedMachine.code}</h1>
          <p className="text-slate-300 font-medium mt-1 text-lg">{selectedMachine.description}</p>
          
          {/* Equipment Code | Type | STC | Group header */}
          <div className="flex gap-6 mt-6">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Equipment Code</p>
              <p className="font-semibold text-slate-200">{selectedMachine.code}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Type</p>
              <p className="font-semibold text-slate-200">{selectedMachine.type}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">STC</p>
              <p className="font-semibold text-slate-200">{selectedMachine.stc || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Group</p>
              <p className="font-semibold text-slate-200">{selectedMachine.group || 'N/A'}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => { setSelectedMachineCode(''); setSearchInput(''); }}
          className="relative z-10 text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 transition-colors"
        >
          Change Machine
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-3xl font-black text-slate-800">{stats.openWorkOrders}</div>
          <div className="text-[10px] font-bold text-rose-500 uppercase tracking-widest flex items-center gap-1 mt-1"><PenTool size={12}/> Open Work Orders</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-3xl font-black text-slate-800">{stats.pendingMaintenance}</div>
          <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1 mt-1"><Calendar size={12}/> Pending PM/SM</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-3xl font-black text-slate-800">{stats.totalSpares}</div>
          <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-1 mt-1"><Archive size={12}/> Tracked Spares</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-3xl font-black text-slate-800">{stats.totalTasks}</div>
          <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1 mt-1"><ClipboardList size={12}/> Defined Tasks</div>
        </div>
      </div>

      {/* Alerts & Next Activity Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Maintenance Alerts */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2"><AlertTriangle size={14} className="text-amber-500" /> Maintenance Alerts</h3>
          <div className="space-y-2">
            {stats.criticalSpares > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                <span className="text-slate-700 font-medium">{stats.criticalSpares} spare(s) below minimum threshold</span>
              </div>
            )}
            {stats.openWorkOrders > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                <span className="text-slate-700 font-medium">{stats.openWorkOrders} open work order(s) pending action</span>
              </div>
            )}
            {stats.pendingMaintenance > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="text-slate-700 font-medium">{stats.pendingMaintenance} scheduled maintenance order(s)</span>
              </div>
            )}
            {stats.criticalSpares === 0 && stats.openWorkOrders === 0 && stats.pendingMaintenance === 0 && (
              <p className="text-sm text-emerald-600 font-medium">✓ No active alerts for this machine</p>
            )}
          </div>
        </div>

        {/* Next Scheduled Activity */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2"><Activity size={14} className="text-blue-500" /> Next Scheduled Activity</h3>
          {nextActivity ? (
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-800">{nextActivity.description}</p>
              <p className="text-xs text-slate-500">Order: {nextActivity.orderNumber}</p>
              <p className="text-xs text-slate-500">Planned: {nextActivity.plannedDate}</p>
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${nextActivity.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' : nextActivity.status === 'In Progress' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                {nextActivity.status}
              </span>
            </div>
          ) : (
            <p className="text-sm text-slate-500 font-medium">No upcoming activities scheduled</p>
          )}
        </div>
      </div>

      {/* Maintenance Overview */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2"><TrendingUp size={14} className="text-indigo-500" /> Maintenance Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-emerald-50 rounded-lg">
            <div className="text-2xl font-black text-emerald-700">{stats.smStrategies}</div>
            <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">SM Strategies</div>
          </div>
          <div className="text-center p-3 bg-indigo-50 rounded-lg">
            <div className="text-2xl font-black text-indigo-700">{stats.pmStrategies}</div>
            <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">PM Strategies</div>
          </div>
          <div className="text-center p-3 bg-amber-50 rounded-lg">
            <div className="text-2xl font-black text-amber-700">{stats.totalSpares}</div>
            <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Spare Parts</div>
          </div>
          <div className="text-center p-3 bg-rose-50 rounded-lg">
            <div className="text-2xl font-black text-rose-700">{stats.criticalSpares}</div>
            <div className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">Critical Spares</div>
          </div>
        </div>
      </div>

      {/* Module Navigation */}
      <h2 className="text-lg font-black text-slate-800 pt-4">Module Navigation</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { path: '/machine-tasks', label: 'Task List', desc: 'Manage predefined operations', icon: ClipboardList, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { path: '/machine-strategies', label: 'Strategies', desc: 'SM and PM definitions', icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { path: '/machine-spares', label: 'Spares Inventory', desc: 'Track available parts', icon: Archive, color: 'text-amber-600', bg: 'bg-amber-50' },
          { path: '/machine-work-orders', label: 'Work Orders', desc: 'Execution and tracking', icon: PenTool, color: 'text-rose-600', bg: 'bg-rose-50' },
          { path: '/machine-maintenance-orders', label: 'Maintenance Orders', desc: 'Schedule and completion', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((nav, i) => (
          <div 
            key={i} 
            onClick={() => navigate(nav.path)}
            className="group bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-4 hover:border-indigo-200"
          >
            <div className={`p-3 rounded-xl ${nav.bg} ${nav.color}`}>
              <nav.icon size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{nav.label}</h3>
              <p className="text-xs text-slate-500 font-medium">{nav.desc}</p>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-indigo-500 transition-colors" size={20} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MachineDashboardPage;
