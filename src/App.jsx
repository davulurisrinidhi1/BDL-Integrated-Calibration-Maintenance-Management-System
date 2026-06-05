import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import AppLayout from './components/layout/AppLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import CalibrationEntryPage from './pages/CalibrationEntryPage.jsx';
import MaterialsPage from './pages/MaterialsPage.jsx';
import MaterialDetailPage from './pages/MaterialDetailPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import CertificatesPage from './pages/CertificatesPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import AuditLogPage from './pages/AuditLogPage.jsx';
import UserManagementPage from './pages/UserManagementPage.jsx';
import RoadmapPage from './pages/RoadmapPage.jsx';

import MachineDashboardPage from './pages/MachineDashboardPage.jsx';
import MachineTaskListPage from './pages/MachineTaskListPage.jsx';
import MachineStrategyPage from './pages/MachineStrategyPage.jsx';
import MachineSpareListPage from './pages/MachineSpareListPage.jsx';
import MachineWorkOrderPage from './pages/MachineWorkOrderPage.jsx';
import MachineMaintenanceOrdersPage from './pages/MachineMaintenanceOrdersPage.jsx';
import InstrumentTaskListPage from './pages/InstrumentTaskListPage.jsx';
import InstrumentStrategyPage from './pages/InstrumentStrategyPage.jsx';
// ── Protected Route Wrapper ───────────────────────────────────
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
       <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/calibration" element={<CalibrationEntryPage />} />
        <Route path="/materials" element={<MaterialsPage />} />
        <Route path="/materials/:code" element={<MaterialDetailPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/history/:gaugeNo" element={<HistoryPage />} />
        
        {/* Role Protected Routes */}
        <Route path="/certificates" element={
          <ProtectedRoute roles={['Admin', 'Calibration Operator']}><CertificatesPage /></ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute roles={['Admin', 'Quality Inspector']}><ReportsPage /></ProtectedRoute>
        } />
        <Route path="/audit-logs" element={
          <ProtectedRoute roles={['Admin']}><AuditLogPage /></ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute roles={['Admin']}><UserManagementPage /></ProtectedRoute>
        } />
        <Route path="/roadmap" element={<RoadmapPage />} />

        {/* Machine Maintenance Routes */}
        <Route path="/machine-dashboard" element={<ProtectedRoute roles={['Admin', 'Quality Inspector', 'Calibration Operator']}><MachineDashboardPage /></ProtectedRoute>} />
        <Route path="/machine-tasks" element={<ProtectedRoute roles={['Admin', 'Quality Inspector']}><MachineTaskListPage /></ProtectedRoute>} />
        <Route path="/machine-strategies" element={<ProtectedRoute roles={['Admin', 'Quality Inspector']}><MachineStrategyPage /></ProtectedRoute>} />
        <Route path="/machine-spares" element={<ProtectedRoute roles={['Admin', 'Quality Inspector']}><MachineSpareListPage /></ProtectedRoute>} />
        <Route path="/machine-work-orders" element={<ProtectedRoute roles={['Admin', 'Quality Inspector']}><MachineWorkOrderPage /></ProtectedRoute>} />
        <Route path="/machine-maintenance-orders" element={<ProtectedRoute roles={['Admin', 'Quality Inspector', 'Calibration Operator']}><MachineMaintenanceOrdersPage /></ProtectedRoute>} />
        
        {/* Instrument Strategy & Task Routes */}
        <Route path="/instrument-tasks" element={<ProtectedRoute roles={['Admin', 'Calibration Operator']}><InstrumentTaskListPage /></ProtectedRoute>} />
        <Route path="/instrument-strategies" element={<ProtectedRoute roles={['Admin', 'Calibration Operator']}><InstrumentStrategyPage /></ProtectedRoute>} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

