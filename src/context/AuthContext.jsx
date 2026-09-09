import React, { createContext, useContext, useState, useCallback } from 'react';

// ─── Role Definitions (FRS FR-07: SOC Operators, Supervisors, Management) ───────
export const ROLES = {
  OPERATOR: 'SOC Operator',
  SUPERVISOR: 'Supervisor',
  MANAGEMENT: 'Management',
};

// ─── Route access per role (role → list of allowed route prefixes) ────────────
export const ROLE_ACCESS = {
  [ROLES.OPERATOR]: [
    '/', '/command-center', '/alerts', '/subsystems', '/equipment',
    '/digital-twin',
  ],
  [ROLES.SUPERVISOR]: [
    '/', '/command-center', '/alerts', '/subsystems', '/equipment',
    '/operator-mode', '/operator', '/analytics', '/work-orders',
    '/assets', '/sop', '/digital-twin',
  ],
  [ROLES.MANAGEMENT]: [
    '/', '/command-center', '/alerts', '/subsystems', '/equipment',
    '/operator-mode', '/operator', '/supervisor-mode', '/supervisor',
    '/analytics', '/work-orders', '/assets', '/sop', '/users',
    '/digital-twin',
  ],
};

// ─── Demo Users (matching USERS in mockData.js) ───────────────────────────────
export const DEMO_USERS = [
  {
    id: 'USR-04',
    name: 'Minh Le',
    role: ROLES.OPERATOR,
    email: 'minh.le@ltia.gov.vn',
    department: 'Aviation Security — SOC',
    avatar: 'ML',
    shift: 'Day Shift (06:00–18:00)',
    clearance: 'Level 2 — Operational',
  },
  {
    id: 'USR-02',
    name: 'Thanh Nguyen',
    role: ROLES.SUPERVISOR,
    email: 'thanh.nguyen@ltia.gov.vn',
    department: 'Facilities & MEP — HVAC Lead',
    avatar: 'TN',
    shift: 'Day Shift (06:00–18:00)',
    clearance: 'Level 3 — Supervisory',
  },
  {
    id: 'USR-01',
    name: 'Arjun Sharma',
    role: ROLES.MANAGEMENT,
    email: 'arjun.sharma@ltia.gov.vn',
    department: 'HBMS Systems Engineering',
    avatar: 'AS',
    shift: 'All Hours',
    clearance: 'Level 5 — Full Admin',
  },
];

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback((user) => {
    setCurrentUser(user);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const canAccess = useCallback((path) => {
    if (!currentUser) return false;
    const allowedPaths = ROLE_ACCESS[currentUser.role] || [];
    return allowedPaths.some(allowed =>
      path === allowed || path.startsWith(allowed + '/') ||
      (allowed === '/' && path === '/')
    );
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, canAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
