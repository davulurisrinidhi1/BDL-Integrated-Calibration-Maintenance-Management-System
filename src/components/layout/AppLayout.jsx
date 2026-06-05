import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import GlobalSearch from '../common/GlobalSearch.jsx';

export default function AppLayout() {
  const { user, loading } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f0f4f8' }}>
        <div className="skeleton" style={{ width: 200, height: 20 }} />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: 230, display: 'flex', flexDirection: 'column', minHeight: '100vh', transition: 'margin-left 0.2s' }}>
        <Topbar onSearchOpen={() => setSearchOpen(true)} />
        <main style={{ flex: 1, padding: '20px 24px', background: '#f0f4f8', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
      {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}
    </div>
  );
}
