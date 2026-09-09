import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Layers, Cpu, AlertTriangle,
  TrendingUp, Wrench, Shield, FileText, Users, Activity, Globe, X,
  Package, Zap, Server, ShieldCheck, Volume2, Flame, Clock, Wind,
  PlaneLanding, ScanLine, DoorOpen, LogOut
} from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';
import { useAuth, ROLES } from '../context/AuthContext';

// Subsystems list
const SIDEBAR_SUBSYSTEMS = [
  { code: 'BHS', name: 'Baggage Handling', icon: Package, badge: 2, badgeColor: '#ef4444' },
  { code: 'VDGS', name: 'Visual Docking Guidance', icon: Activity, badge: 2, badgeColor: '#ef4444' },
  { code: 'CMS', name: 'Central Monitoring (Elec.)', icon: Zap, badge: 2, badgeColor: '#ef4444' },
  { code: 'SCADA', name: 'Supervisory Control', icon: Server, badge: 1, badgeColor: '#ef4444' },
  { code: 'SACS', name: 'Security & Access Control', icon: ShieldCheck, badge: 2, badgeColor: '#ef4444' },
  { code: 'PAS', name: 'Public Address System', icon: Volume2, dot: '#10b981' },
  { code: 'FAS', name: 'Fire Alarm System', icon: Flame, dot: '#10b981' },
  { code: 'MCS', name: 'Master Clock System', icon: Clock, dot: '#10b981' },
  { code: 'LBMS', name: 'HVAC', icon: Wind, badge: 1, badgeColor: '#f59e0b' },
  { code: 'IASS', name: 'Aircraft Stand System', icon: PlaneLanding, badge: 1, badgeColor: '#f59e0b' },
  { code: 'SSE', name: 'Security Screening', icon: ScanLine, badge: 2, badgeColor: '#ef4444' },
  { code: 'AGAC', name: 'Gate Access Control', icon: DoorOpen, badge: 1, badgeColor: '#f59e0b' },
];

const ROLE_BADGE_COLOR = {
  [ROLES.OPERATOR]: { bg: '#0ea5e9', label: 'OPERATOR' },
  [ROLES.SUPERVISOR]: { bg: '#f59e0b', label: 'SUPERVISOR' },
  [ROLES.MANAGEMENT]: { bg: '#00d4aa', label: 'MANAGEMENT' },
};

export default function Sidebar({ collapsed, mobileOpen, onCloseMobile, onToggle, currentUser }) {
  const { alerts } = useLiveData();
  const { logout, canAccess } = useAuth();
  const location = useLocation();

  const role = currentUser?.role;
  const roleBadge = ROLE_BADGE_COLOR[role] || { bg: '#8b92a5', label: role };

  // Operations nav — filtered by role
  const allOperationsNav = [
    { to: '/analytics', label: 'Analytics', icon: TrendingUp, roles: [ROLES.SUPERVISOR, ROLES.MANAGEMENT] },
    { to: '/equipment', label: 'Asset List', icon: Shield },
    { to: '/work-orders', label: 'Work Orders', icon: Wrench, roles: [ROLES.SUPERVISOR, ROLES.MANAGEMENT] },
    { to: '/digital-twin', label: '3D Digital Twin', icon: Globe, tag: '3D' },
  ];

  const allManagementNav = [
    { to: '/alerts', label: 'Alerts', icon: AlertTriangle, badge: alerts.filter(a => !a.acknowledged).length },
    { to: '/sop', label: 'SOP Management', icon: FileText, roles: [ROLES.SUPERVISOR, ROLES.MANAGEMENT] },
    { to: '/users', label: 'User Management', icon: Users, roles: [ROLES.MANAGEMENT] },
  ];

  const operationsNav = allOperationsNav.filter(i => !i.roles || i.roles.includes(role));
  const managementNav = allManagementNav.filter(i => !i.roles || i.roles.includes(role));

  // Operator Cockpit & Supervisor Mode in Operations if allowed
  const modeNav = [
    { to: '/operator-mode', label: 'Operator Cockpit', icon: Activity, roles: [ROLES.SUPERVISOR, ROLES.MANAGEMENT] },
    { to: '/supervisor-mode', label: 'Supervisor View', icon: Layers, roles: [ROLES.MANAGEMENT] },
  ].filter(i => !i.roles || i.roles.includes(role));

  return (
    <aside className={`scada-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      
      {/* Brand Header */}
      <div className="scada-sidebar-brand-box">
        <div className="flex items-center gap-3 min-w-0">
          <div className="scada-lotus-logo">
            <svg viewBox="0 0 36 36" width="28" height="28" fill="none">
              <path d="M18 4 C18 12 12 18 12 24 C12 29 15 32 18 32 C21 32 24 29 24 24 C24 18 18 12 18 4 Z" fill="url(#lotusGradCenter)" />
              <path d="M12 14 C8 17 6 22 7 27 C8 30 11 32 14 30 C12 26 13 20 18 18 C15 15 13 14 12 14 Z" fill="url(#lotusGradLeft)" opacity="0.85" />
              <path d="M24 14 C28 17 30 22 29 27 C28 30 25 32 22 30 C24 26 23 20 18 18 C21 15 23 14 24 14 Z" fill="url(#lotusGradRight)" opacity="0.85" />
              <defs>
                <linearGradient id="lotusGradCenter" x1="18" y1="4" x2="18" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#93c5fd" />
                  <stop offset="1" stopColor="#1d4ed8" />
                </linearGradient>
                <linearGradient id="lotusGradLeft" x1="6" y1="14" x2="18" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#67e8f9" />
                  <stop offset="1" stopColor="#0284c7" />
                </linearGradient>
                <linearGradient id="lotusGradRight" x1="30" y1="14" x2="18" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#67e8f9" />
                  <stop offset="1" stopColor="#0284c7" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="scada-brand-text min-w-0">
            <span className="scada-brand-title font-mono">HBMS</span>
            <span className="scada-brand-sub truncate">Long Thanh Airport</span>
          </div>
        </div>

        {mobileOpen && (
          <button
            className="btn btn-ghost btn-sm p-1 text-zinc-400 hover:text-white"
            onClick={onCloseMobile}
            title="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav Scroll Container */}
      <div className="scada-sidebar-scroll">

        {/* OVERVIEW */}
        <div className="scada-nav-group">
          <div className="scada-nav-section-label">OVERVIEW</div>
          <NavLink to="/" end className={({ isActive }) => `scada-nav-link ${isActive ? 'active' : ''}`}>
            <div className="scada-nav-icon"><LayoutDashboard size={15} /></div>
            <span className="scada-nav-text">Dashboard</span>
          </NavLink>
        </div>

        {/* BUILDING SUBSYSTEMS */}
        <div className="scada-nav-group">
          <div className="scada-nav-section-label">BUILDING SUBSYSTEMS</div>
          <div className="scada-subsys-nav-list">
            {SIDEBAR_SUBSYSTEMS.map(sys => {
              const Icon = sys.icon;
              const isActive = location.pathname === `/subsystems/${sys.code}`;
              return (
                <NavLink
                  key={sys.code}
                  to={`/subsystems/${sys.code}`}
                  className={`scada-subsys-nav-item ${isActive ? 'active' : ''}`}
                >
                  <div className="scada-subsys-nav-left">
                    <div className="scada-subsys-nav-icon"><Icon size={14} /></div>
                    <div className="scada-subsys-nav-labels">
                      <span className="scada-subsys-nav-code">{sys.code}</span>
                      <span className="scada-subsys-nav-name">{sys.name}</span>
                    </div>
                  </div>
                  <div className="scada-subsys-nav-right">
                    {sys.badge ? (
                      <span className="scada-subsys-nav-badge" style={{ backgroundColor: sys.badgeColor }}>{sys.badge}</span>
                    ) : (
                      <span className="scada-subsys-nav-dot" style={{ backgroundColor: sys.dot }} />
                    )}
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* OPERATIONS */}
        <div className="scada-nav-group">
          <div className="scada-nav-section-label">OPERATIONS</div>
          {operationsNav.map(item => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `scada-nav-link ${isActive ? 'active' : ''}`}>
                <div className="scada-nav-icon"><Icon size={15} /></div>
                <span className="scada-nav-text">{item.label}</span>
                {item.tag && <span className="scada-nav-tag">{item.tag}</span>}
              </NavLink>
            );
          })}
        </div>

        {/* COCKPIT (Supervisor+ only) */}
        {modeNav.length > 0 && (
          <div className="scada-nav-group">
            <div className="scada-nav-section-label">COCKPIT</div>
            {modeNav.map(item => {
              const Icon = item.icon;
              return (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => `scada-nav-link ${isActive ? 'active' : ''}`}>
                  <div className="scada-nav-icon"><Icon size={15} /></div>
                  <span className="scada-nav-text">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        )}

        {/* MANAGEMENT */}
        <div className="scada-nav-group">
          <div className="scada-nav-section-label">MANAGEMENT</div>
          {managementNav.map(item => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `scada-nav-link ${isActive ? 'active' : ''}`}>
                <div className="scada-nav-icon"><Icon size={15} /></div>
                <span className="scada-nav-text">{item.label}</span>
                {item.badge > 0 && <span className="scada-nav-badge-red">{item.badge}</span>}
              </NavLink>
            );
          })}
        </div>

      </div>

      {/* User Footer */}
      <div className="scada-sidebar-footer">
        <div className="scada-footer-profile">
          <div className="scada-footer-avatar" style={{ background: `linear-gradient(135deg, ${roleBadge.bg}, #0ea5e9)` }}>
            {currentUser?.avatar || currentUser?.name?.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="scada-footer-user-info">
            <span className="scada-footer-user-name">{currentUser?.name}</span>
            <span className="scada-footer-user-role" style={{ color: roleBadge.bg }}>{roleBadge.label}</span>
          </div>
        </div>

        <div className="scada-footer-meta" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <div className="scada-status-online-dot">
            <span className="ping-dot" />
            <span>ONLINE</span>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 6, padding: '3px 8px', cursor: 'pointer',
              color: '#ef4444', fontSize: 10, fontFamily: 'monospace',
              letterSpacing: '0.05em', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
          >
            <LogOut size={10} />
            LOGOUT
          </button>
        </div>
      </div>

    </aside>
  );
}
