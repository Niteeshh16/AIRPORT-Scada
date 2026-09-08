import React, { useState, useRef, useEffect } from 'react';
import {
  Bell, Menu, Terminal, Sun, Moon, Shield, Wifi,
  Layers, Clock, RefreshCw, AlertTriangle, AlertOctagon, Check, ArrowRight, X
} from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';
import { useNavigate } from 'react-router-dom';

export default function Header({ currentTime, moduleName, onToggleSidebar }) {
  const { alerts, acknowledgeAlert } = useLiveData();
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const timeStr = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);
  const criticalCount = unacknowledgedAlerts.filter(a => a.severity === 'critical').length;
  const totalUnack = unacknowledgedAlerts.length;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setNotifDropdownOpen(false);
      }
    }
    if (notifDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notifDropdownOpen]);

  const handleAckAll = () => {
    unacknowledgedAlerts.forEach(a => acknowledgeAlert(a.id));
  };

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

      {/* Right: Protocol status + Clock + Notifications Bell + Profile */}
      <div className="header-right" style={{ position: 'relative' }}>
        {/* Network & Protocol Status */}
        <div className="header-status live">
          <span className="status-dot" />
          <span>BACnet/IP • OPC-UA ONLINE</span>
        </div>

        {/* Live Clock */}
        <div className="header-clock font-mono">
          <span>{timeStr}</span>
        </div>

        {/* Top Notifications Bell Button & Dropdown Anchor */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            className={`header-icon-btn ${notifDropdownOpen ? 'active' : ''}`}
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            title="System Alarms & Notifications"
            style={{
              position: 'relative',
              background: notifDropdownOpen ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              color: notifDropdownOpen ? '#38bdf8' : totalUnack > 0 ? '#f87171' : 'inherit'
            }}
          >
            <Bell size={17} className={criticalCount > 0 ? 'pulse-fast' : ''} />
            {totalUnack > 0 && (
              <span className={`notification-badge ${criticalCount > 0 ? 'critical' : ''}`}>
                {totalUnack}
              </span>
            )}
          </button>

          {/* Top Notifications Dropdown Panel */}
          {notifDropdownOpen && (
            <div className="top-notif-dropdown animate-fadeIn">
              <div className="top-notif-dropdown-header">
                <div className="flex items-center gap-2">
                  <Bell size={14} className="text-teal" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                    ACTIVE ALARMS ({totalUnack})
                  </span>
                </div>
                {totalUnack > 0 && (
                  <button
                    onClick={handleAckAll}
                    className="text-3xs font-mono text-teal hover:underline flex items-center gap-1"
                  >
                    <Check size={11} />
                    <span>Ack All</span>
                  </button>
                )}
              </div>

              <div className="top-notif-dropdown-body">
                {unacknowledgedAlerts.length === 0 ? (
                  <div className="p-4 text-center text-tertiary text-xs">
                    All alarms cleared and acknowledged.
                  </div>
                ) : (
                  unacknowledgedAlerts.slice(0, 6).map(alert => (
                    <div
                      key={alert.id}
                      className={`top-notif-dropdown-item ${alert.severity}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className={`status-badge ${alert.severity}`} style={{ fontSize: '8px', padding: '1px 5px' }}>
                            {alert.severity.toUpperCase()}
                          </span>
                          <span className="font-mono text-xs font-bold text-teal truncate">
                            {alert.equipment}
                          </span>
                        </div>
                        <span className="text-3xs font-mono text-tertiary shrink-0">{alert.time}</span>
                      </div>

                      <div className="text-2xs text-secondary mt-1 line-clamp-2">
                        {alert.message}
                      </div>

                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="btn btn-secondary btn-xs"
                          style={{ fontSize: '10px', padding: '2px 8px', height: 22 }}
                        >
                          <Check size={11} />
                          <span>Acknowledge</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="top-notif-dropdown-footer">
                <button
                  onClick={() => {
                    setNotifDropdownOpen(false);
                    navigate('/alerts');
                  }}
                  className="w-full text-center text-xs font-mono text-teal hover:underline flex items-center justify-center gap-1.5 py-1"
                >
                  <span>Open Alarm Management Center</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          )}
        </div>

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
