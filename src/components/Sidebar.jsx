import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Layers, Cpu, AlertTriangle,
  TrendingUp, Wrench, Shield, FileText, Users, Activity, Globe, X,
  LogOut, Server, Building2
} from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';
import { useAuth, ROLES } from '../context/AuthContext';

const ROLE_CONFIG = {
  [ROLES.OPERATOR]: { label: 'SOC Operator', color: 'var(--blue)' },
  [ROLES.SUPERVISOR]: { label: 'Supervisor', color: 'var(--yellow)' },
  [ROLES.MANAGEMENT]: { label: 'Management', color: 'var(--green)' },
};

export default function Sidebar({ collapsed, mobileOpen, onCloseMobile, currentUser }) {
  const { alerts } = useLiveData();
  const { logout } = useAuth();

  const role = currentUser?.role;
  const roleInfo = ROLE_CONFIG[role] || { label: role || 'Operator', color: 'var(--accent)' };
  const unackAlertCount = alerts.filter(a => !a.acknowledged).length;

  const overviewNav = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/subsystems', label: 'Subsystems', icon: Building2, tag: '12' },
  ];

  const operationsNav = [
    { to: '/equipment', label: 'Equipment Explorer', icon: Cpu },
    { to: '/alerts', label: 'Alerts & Events', icon: AlertTriangle, badge: unackAlertCount },
    { to: '/work-orders', label: 'Work Orders', icon: Wrench, roles: [ROLES.SUPERVISOR, ROLES.MANAGEMENT] },
    { to: '/analytics', label: 'Analytics & Trends', icon: TrendingUp, roles: [ROLES.SUPERVISOR, ROLES.MANAGEMENT] },
    { to: '/digital-twin', label: '3D Digital Twin', icon: Globe, tag: '3D' },
  ].filter(i => !i.roles || i.roles.includes(role));

  const supervisoryNav = [
    { to: '/operator-mode', label: 'Operator Cockpit', icon: Activity, roles: [ROLES.SUPERVISOR, ROLES.MANAGEMENT] },
    { to: '/supervisor-mode', label: 'Supervisor View', icon: Layers, roles: [ROLES.MANAGEMENT] },
  ].filter(i => !i.roles || i.roles.includes(role));

  const adminNav = [
    { to: '/assets', label: 'Asset Management', icon: Shield, roles: [ROLES.SUPERVISOR, ROLES.MANAGEMENT] },
    { to: '/sop', label: 'SOP Management', icon: FileText, roles: [ROLES.SUPERVISOR, ROLES.MANAGEMENT] },
    { to: '/users', label: 'User Management', icon: Users, roles: [ROLES.MANAGEMENT] },
  ].filter(i => !i.roles || i.roles.includes(role));

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div className="sidebar-brand-text">
          <div className="sidebar-brand-name">LTIA HBMS</div>
          <div className="sidebar-brand-sub">SCADA Control System</div>
        </div>
        {mobileOpen && (
          <button
            onClick={onCloseMobile}
            style={{
              marginLeft: 'auto', background: 'transparent', border: 'none',
              color: 'var(--text-3)', cursor: 'pointer', display: 'flex', alignItems: 'center'
            }}
            title="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav List */}
      <div className="sidebar-nav">
        {/* OVERVIEW */}
        <div className="nav-section">
          <div className="nav-section-label">Overview</div>
          {overviewNav.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <div className="nav-icon"><Icon size={16} /></div>
                <span className="nav-label">{item.label}</span>
                {item.tag && <span className="nav-badge yellow" style={{ background: 'var(--bg-overlay)', color: 'var(--text-2)' }}>{item.tag}</span>}
              </NavLink>
            );
          })}
        </div>

        {/* OPERATIONS */}
        <div className="nav-section">
          <div className="nav-section-label">Operations</div>
          {operationsNav.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <div className="nav-icon"><Icon size={16} /></div>
                <span className="nav-label">{item.label}</span>
                {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
                {item.tag && <span className="nav-badge" style={{ background: 'var(--blue-bg)', color: 'var(--accent)' }}>{item.tag}</span>}
              </NavLink>
            );
          })}
        </div>

        {/* SUPERVISORY (if allowed) */}
        {supervisoryNav.length > 0 && (
          <div className="nav-section">
            <div className="nav-section-label">Supervisory</div>
            {supervisoryNav.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <div className="nav-icon"><Icon size={16} /></div>
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        )}

        {/* ADMINISTRATION (if allowed) */}
        {adminNav.length > 0 && (
          <div className="nav-section">
            <div className="nav-section-label">Administration</div>
            {adminNav.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <div className="nav-icon"><Icon size={16} /></div>
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        )}
      </div>

      {/* User & Logout Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div
            className="sidebar-avatar"
            style={{ background: roleInfo.color }}
          >
            {currentUser?.avatar || currentUser?.name?.charAt(0) || 'U'}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{currentUser?.name || 'Operator'}</div>
            <div className="sidebar-user-role" style={{ color: roleInfo.color }}>{roleInfo.label}</div>
          </div>
          <button
            onClick={logout}
            className="sidebar-logout-btn"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
