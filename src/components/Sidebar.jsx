import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Map, Layers, Cpu, AlertTriangle, 
  TrendingUp, Wrench, Shield, FileText, Users, Activity
} from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';

export default function Sidebar({ collapsed, onToggle }) {
  const { alerts, subsystems } = useLiveData();
  const unackAlerts = alerts.filter(a => !a.acknowledged).length;

  const mainNav = [
    { to: '/', label: 'Command Center', icon: LayoutDashboard },
    { to: '/map', label: 'Live Building Map', icon: Map },
    { to: '/subsystems', label: 'Building Subsystems', icon: Layers },
    { to: '/equipment', label: 'Equipment Explorer', icon: Cpu },
    { to: '/alerts', label: 'Alerts & Events', icon: AlertTriangle, badge: unackAlerts },
    { to: '/analytics', label: 'Analytics & Trends', icon: TrendingUp },
    { to: '/work-orders', label: 'Work Orders', icon: Wrench },
    { to: '/assets', label: 'Asset Management', icon: Shield },
    { to: '/sop', label: 'SOP Management', icon: FileText },
    { to: '/users', label: 'User Management', icon: Users },
  ];

  const sysDisplayNames = {
    'LBMS': 'HVAC & Climate',
    'BHS': 'Baggage Handling',
    'FAS': 'Fire Alarm System',
    'SACS': 'Access Control',
    'SSE': 'Security Screening',
    'AGAC': 'Gate Access Control',
    'VDGS': 'Docking Guidance',
    'CMS': 'Power Monitoring',
    'PAS': 'Public Address',
    'MCS': 'Master Clock System',
    'SCADA': 'Supervisory Control',
    'IASS': 'Aircraft Stand System',
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} style={{ overflowX: 'hidden' }}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Activity size={18} />
        </div>
        <div className="sidebar-brand">
          <span className="sidebar-brand-name font-mono">LONG THANH SCADA</span>
          <span className="sidebar-brand-sub">HBMS CONTROL ROOM</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav" style={{ overflowX: 'hidden' }}>
        <div className="sidebar-section">
          <div className="sidebar-section-title">MAIN NAVIGATION</div>
          {mainNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <div className="nav-item-icon">
                  <Icon size={16} />
                </div>
                <span className="nav-item-text">{item.label}</span>
                {item.badge > 0 && (
                  <span className="nav-item-badge critical">{item.badge}</span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Subsystems Section - Proper SCADA Hierarchy */}
        <div className="sidebar-section" style={{ marginBottom: 'var(--space-2)' }}>
          <div className="sidebar-section-title">ALL SUBSYSTEMS ({subsystems.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {subsystems.map((sys) => {
              const isCritical = sys.critical > 0;
              const displayName = sysDisplayNames[sys.id] || sys.name;
              return (
                <NavLink
                  key={sys.id}
                  to={`/subsystems/${sys.id}`}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  style={{ minHeight: '34px', padding: '4px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  title={`${sys.id} - ${sys.name}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span 
                      style={{ 
                        width: 6, 
                        height: 6, 
                        borderRadius: '50%', 
                        background: isCritical ? 'var(--status-critical)' : sys.warnings > 0 ? 'var(--status-warning)' : 'var(--status-operational)', 
                        flexShrink: 0 
                      }} 
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-mono text-xs font-bold text-primary leading-tight">{sys.id}</span>
                      <span className="text-3xs text-tertiary truncate leading-tight">{displayName}</span>
                    </div>
                  </div>

                  <span 
                    className={`status-badge ${sys.status}`} 
                    style={{ fontSize: '8px', padding: '1px 5px', flexShrink: 0 }}
                  >
                    {sys.health}%
                  </span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div style={{ padding: 'var(--space-2) var(--space-4)', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
        <div className="flex justify-between items-center text-3xs font-mono text-tertiary">
          <span>HBMS v2.4</span>
          <span className="text-teal">● ONLINE</span>
        </div>
      </div>
    </aside>
  );
}
