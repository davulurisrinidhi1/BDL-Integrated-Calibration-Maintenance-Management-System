import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  LayoutDashboard, 
  ClipboardList, 
  FileText, 
  History, 
  BarChart3,
  Users, 
  Shield, 
  Map, 
  ChevronLeft, 
  ChevronRight, 
  Gauge, 
  LogOut,
  Settings2,
  Archive,
  PenTool,
  Calendar,
  Zap
} from 'lucide-react';
import ConfirmDialog from '../common/ConfirmDialog';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Calibration Operator', 'Quality Inspector'] },
  { path: '/calibration', label: 'Calibration Entry', icon: ClipboardList, roles: ['Admin', 'Calibration Operator'] },
  { path: '/materials', label: 'Material Codes', icon: Gauge, roles: ['Admin', 'Calibration Operator', 'Quality Inspector'] },
  { path: '/history', label: 'History & Traceability', icon: History, roles: ['Admin', 'Calibration Operator', 'Quality Inspector'] },
  { path: '/certificates', label: 'Certificates', icon: FileText, roles: ['Admin', 'Calibration Operator'] },
  { path: '/reports', label: 'Reports & Analytics', icon: BarChart3, roles: ['Admin', 'Quality Inspector'] },
  { path: '/audit-logs', label: 'System Audit Log', icon: Shield, roles: ['Admin'] },
  { path: '/users', label: 'User Management', icon: Users, roles: ['Admin'] },
  { path: '/roadmap', label: 'Vision Roadmap', icon: Map, roles: ['Admin', 'Calibration Operator', 'Quality Inspector'] },
  
  // Machine Maintenance Section
  { path: '/machine-dashboard', label: 'Machine Dashboard', icon: Settings2, roles: ['Admin', 'Quality Inspector', 'Calibration Operator'] },
  { path: '/machine-tasks', label: 'Machine Tasks', icon: ClipboardList, roles: ['Admin', 'Quality Inspector'] },
  { path: '/machine-strategies', label: 'Machine Strategies', icon: Zap, roles: ['Admin', 'Quality Inspector'] },
  { path: '/machine-spares', label: 'Machine Spares', icon: Archive, roles: ['Admin', 'Quality Inspector'] },
  { path: '/machine-work-orders', label: 'Machine Work Orders', icon: PenTool, roles: ['Admin', 'Quality Inspector'] },
  { path: '/machine-maintenance-orders', label: 'Maintenance Orders', icon: Calendar, roles: ['Admin', 'Quality Inspector', 'Calibration Operator'] },
  
  // Instrument Strategies Section
  { path: '/instrument-tasks', label: 'Instrument Tasks', icon: ClipboardList, roles: ['Admin', 'Calibration Operator'] },
  { path: '/instrument-strategies', label: 'Instrument Strategies', icon: Zap, roles: ['Admin', 'Calibration Operator'] },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const filtered = NAV_ITEMS.filter(item => item.roles.includes(user?.role));

  const handleLogout = () => {
    setIsLogoutConfirmOpen(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/login');
    setIsLogoutConfirmOpen(false);
  };

  return (
    <aside 
      className={`fixed left-0 top-0 bottom-0 z-50 flex flex-col border-r border-[#1e3a5f] bg-gradient-to-b from-[#0f172a] to-[#1e293b] transition-all duration-300 ${collapsed ? 'w-16' : 'w-[240px]'}`}
    >
      {/* Brand */}
      <div className={`flex items-center gap-3 min-h-[56px] border-b border-white/5 ${collapsed ? 'px-3 justify-center' : 'px-4'}`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center font-black text-white text-xs shrink-0">
          BDL
        </div>
        {!collapsed && (
          <div className="animate-in fade-in duration-300">
            <div className="text-white font-bold text-xs tracking-tight">Smart Calibration</div>
            <div className="text-slate-500 text-[9px] font-bold uppercase tracking-widest leading-none">Enterprise Terminal</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-hide">
        {filtered.map(item => {
          const Icon = item.icon;
          const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                active ? 'bg-blue-600/20 text-white border-l-2 border-blue-500' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border-l-2 border-transparent'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className={active ? 'text-blue-400' : 'group-hover:text-slate-200'} />
              {!collapsed && <span className="text-[12.5px] font-semibold truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-2 border-t border-white/5 space-y-1">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} />
          {!collapsed && <span className="text-[12.5px] font-semibold">Sign Out</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:bg-white/5 transition-all ${collapsed ? 'justify-center' : 'justify-between'}`}
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <>
              <span className="text-[10px] font-bold uppercase tracking-widest">Collapse</span>
              <ChevronLeft size={16} />
            </>
          )}
        </button>
      </div>

      <ConfirmDialog 
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={confirmLogout}
        title="Confirm Sign Out"
        description="Are you sure you want to end your current session? You will need to re-authenticate to access the terminal."
        confirmLabel="Sign Out"
        isDanger={true}
      />
    </aside>
  );
}

