import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Sun, Moon, LogOut, ChevronDown, Search } from 'lucide-react';
import NotificationDropdown from '../common/NotificationDropdown';
import ConfirmDialog from '../common/ConfirmDialog';

export default function Topbar({ onSearchOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menus on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Keyboard shortcut Ctrl+K for search
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); onSearchOpen?.(); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onSearchOpen]);

  const toggleDark = () => {
    setDarkMode(d => !d);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    setIsLogoutConfirmOpen(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/login');
    setIsLogoutConfirmOpen(false);
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Left — Search bar trigger */}
      <button
        onClick={onSearchOpen}
        className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer text-slate-400 text-xs min-w-[240px] hover:border-slate-300 transition-colors"
      >
        <Search size={14} />
        <span className="font-medium">Search records or material... </span>
        <kbd className="ml-auto bg-slate-200 px-1.5 py-0.5 rounded text-[10px] text-slate-500 font-bold">CTRL+K</kbd>
      </button>

      {/* Right — Actions */}
      <div className="flex items-center gap-4">
        {/* Dark mode toggle */}
        <button 
          onClick={toggleDark} 
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors" 
          title="Toggle theme"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notification bell */}
        <NotificationDropdown />

        {/* User menu */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 px-2 py-1.5 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#0a192f] flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
            </div>
            <div className="text-left hidden md:block">
              <div className="font-bold text-slate-900 text-[11px] leading-tight">{user?.name}</div>
              <div className="text-slate-400 text-[9px] font-bold uppercase tracking-tighter">{user?.role}</div>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-2xl z-[100] animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
              <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Employee ID</div>
                <div className="text-xs font-bold text-slate-800">{user?.employeeId}</div>
                <div className="text-[9px] text-slate-400 font-medium mt-1">{user?.department}</div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full p-4 flex items-center gap-3 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
              >
                <LogOut size={16} />
                <span>Logout System</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog 
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={confirmLogout}
        title="Logout Confirmation"
        description="Are you sure you want to terminate the current session? Unsaved progress in the quick entry panel may be lost."
        confirmLabel="Logout"
        isDanger={true}
      />
    </header>
  );
}
