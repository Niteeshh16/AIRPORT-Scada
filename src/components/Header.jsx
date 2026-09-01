import React from 'react';
import {
  Bell, Menu, Terminal, Sun, Moon, Shield, Wifi,
  Layers, Clock, RefreshCw
} from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';

export default function Header({ currentTime, moduleName, onToggleSidebar }) {
  const { alerts, opsPanelOpen, setOpsPanelOpen } = useLiveData();

  const timeStr = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });
  const dateStr = currentTime.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  });

  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.acknowledged);

  return (
    <header className="app-header">
      {/* Left: Hamburger + Title + Breadcrumb */}
      <div className="header-left">
        <button
          className="header-hamburger"
          onClick={onToggleSidebar}
          title="Toggle Navigation"
        >
          <Menu size={18} />
        </button>

        <span className="header-airport-name font-mono">LONG THANH HBMS</span>
        <div className="header-divider" />
        <span className="header-module-name font-mono">{moduleName}</span>
      </div>

      {/* Right: Protocol status + Clock + Ops Desk + Profile */}
      <div className="header-right">
        {/* Network & Protocol Status */}
        <div className="header-status live">
          <span className="status-dot" />
          <span>BACnet/IP • OPC-UA ONLINE</span>
        </div>

        {/* Live Clock */}
        <div className="header-clock font-mono">
          <span>{timeStr}</span>
        </div>

        {/* Ops Desk Toggle Button */}
        <button
          className="header-icon-btn"
          onClick={() => setOpsPanelOpen(!opsPanelOpen)}
          title="Toggle Operations Desk & Logs"
          style={{ background: opsPanelOpen ? 'var(--bg-active)' : 'transparent', color: opsPanelOpen ? 'var(--accent-teal)' : 'inherit' }}
        >
          <Terminal size={17} />
          {criticalAlerts.length > 0 && (
            <span className="notification-badge">
              {criticalAlerts.length}
            </span>
          )}
        </button>

        {/* Profile User Avatar */}
        <div className="header-user">
          <div className="header-avatar">
            A
          </div>
          <div className="header-user-info">
            <span className="header-user-name">Arjun S.</span>
            <span className="header-user-role">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
