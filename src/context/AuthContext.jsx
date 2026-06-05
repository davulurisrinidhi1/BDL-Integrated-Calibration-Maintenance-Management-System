import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MOCK_USERS } from '../data/mockData.js';

const AuthContext = createContext(null);

const ROLE_PERMISSIONS = {
  Admin: {
    canCreate: true, canEdit: true, canDelete: true, canExport: true,
    canGenerateCert: true, canApprove: true, canManageUsers: true,
    canViewAudit: true, canViewReports: true, canViewHistory: true,
  },
  'Calibration Operator': {
    canCreate: true, canEdit: 'own', canDelete: false, canExport: true,
    canGenerateCert: true, canApprove: false, canManageUsers: false,
    canViewAudit: false, canViewReports: false, canViewHistory: true,
  },
  'Quality Inspector': {
    canCreate: false, canEdit: false, canDelete: false, canExport: true,
    canGenerateCert: false, canApprove: true, canManageUsers: false,
    canViewAudit: false, canViewReports: true, canViewHistory: true,
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('bdl_session_v2');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const login = useCallback((employeeId, password) => {
    let users = JSON.parse(localStorage.getItem('users_v2') || 'null');
    if (!users || users.length === 0) users = MOCK_USERS;

    const found = users.find(u => u.employeeId === employeeId && u.password === password);
    if (!found) return { success: false, error: 'Invalid Employee ID or Password' };
    const session = { ...found, loginTime: new Date().toISOString() };
    delete session.password;
    setUser(session);
    localStorage.setItem('bdl_session_v2', JSON.stringify(session));

    // Audit log
    const logs = JSON.parse(localStorage.getItem('auditLogs_v2') || '[]');
    logs.unshift({
      id: `AL-${Date.now()}`, action: 'LOGIN', user: found.employeeId,
      role: found.role, detail: `${found.name} logged in`, timestamp: new Date().toISOString(),
    });
    localStorage.setItem('auditLogs_v2', JSON.stringify(logs));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    if (user) {
      const logs = JSON.parse(localStorage.getItem('auditLogs_v2') || '[]');
      logs.unshift({
        id: `AL-${Date.now()}`, action: 'LOGOUT', user: user.employeeId,
        role: user.role, detail: `${user.name} logged out`, timestamp: new Date().toISOString(),
      });
      localStorage.setItem('auditLogs_v2', JSON.stringify(logs));
    }
    setUser(null);
    localStorage.removeItem('bdl_session_v2');
  }, [user]);

  const hasPermission = useCallback((perm) => {
    if (!user) return false;
    const perms = ROLE_PERMISSIONS[user.role];
    if (!perms) return false;
    return perms[perm] === true || perms[perm] === 'own';
  }, [user]);

  const canEditEntry = useCallback((entry) => {
    if (!user) return false;
    const perms = ROLE_PERMISSIONS[user.role];
    if (perms.canEdit === true) return true;
    if (perms.canEdit === 'own') return entry.createdBy === user.employeeId;
    return false;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasPermission, canEditEntry, ROLE_PERMISSIONS }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
