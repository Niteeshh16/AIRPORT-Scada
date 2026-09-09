import React, { useState, useRef, useEffect } from 'react';
import {
  Bell, Menu, Check, ArrowRight, ShieldCheck, Activity
} from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';
import { useNavigate } from 'react-router-dom';

export default function Header({ currentTime, moduleName, onToggleSidebar, currentUser }) {
  const { alerts, acknowledgeAlert } = useLiveData();
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const timeStr = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);
  const totalUnack = unacknowledgedAlerts.length;

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
      {/* Left: Menu toggle + Breadcrumb */}
      <div className="header-left">
        <button
          className="header-menu-btn"
          onClick={onToggleSidebar}
          title="Toggle Navigation"
        >
          <Menu size={17} />
        </button>

        <div className="header-breadcrumb">
          <span className="header-breadcrumb-root">LTIA HBMS</span>
          <span className="header-breadcrumb-sep">/</span>
          <span className="header-breadcrumb-current">{moduleName}</span>
        </div>
      </div>

      {/* Right: Network status + Clock + Notifications + User */}
      <div className="header-right">
        {/* Network & Protocol Status */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '3px 9px', borderRadius: 'var(--r-md)',
          background: 'var(--green-bg)', border: '1px solid rgba(63,185,80,0.2)',
          fontSize: 11, fontWeight: 500, color: 'var(--green)'
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: 'var(--green)',
            boxShadow: '0 0 6px var(--green)'
          }} />
          <span className="hidden sm:inline" style={{ letterSpacing: '0.02em' }}>ONLINE</span>
        </div>

        {/* Live Clock */}
        <div className="header-time">
          {timeStr}
        </div>

        <div className="header-divider" />

        {/* Notification Bell & Dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            className={`header-icon-btn ${notifDropdownOpen ? 'active' : ''}`}
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            title="System Alarms & Notifications"
          >
            <Bell size={16} />
            {totalUnack > 0 && (
              <span className="header-notif-badge">
                {totalUnack > 9 ? '9+' : totalUnack}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifDropdownOpen && (
            <div className="notif-dropdown">
              <div className="notif-dropdown-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Bell size={14} style={{ color: 'var(--red)' }} />
                  <span>Active Alarms ({totalUnack})</span>
                </div>
                {totalUnack > 0 && (
                  <button
                    onClick={handleAckAll}
                    style={{
                      background: 'none', border: 'none', color: 'var(--accent)',
                      fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3
                    }}
                  >
                    <Check size={11} /> Ack All
                  </button>
                )}
              </div>

              <div className="notif-dropdown-body">
                {unacknowledgedAlerts.length === 0 ? (
                  <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
                    All alarms cleared and acknowledged.
                  </div>
                ) : (
                  unacknowledgedAlerts.slice(0, 5).map(alert => (
                    <div key={alert.id} className="notif-item">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span className={`badge ${alert.severity === 'critical' ? 'badge-critical' : 'badge-warning'}`} style={{ fontSize: 10 }}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>{alert.time}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-1)', fontWeight: 500, marginBottom: 2 }}>
                        {alert.equipment}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.4 }}>
                        {alert.message}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '2px 8px', fontSize: 11 }}
                        >
                          <Check size={11} style={{ marginRight: 3 }} /> Acknowledge
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="notif-dropdown-footer">
                <button
                  onClick={() => {
                    setNotifDropdownOpen(false);
                    navigate('/alerts');
                  }}
                  style={{
                    background: 'none', border: 'none', color: 'var(--accent)',
                    fontSize: 12, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4
                  }}
                >
                  View All Alarms <ArrowRight size={12} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Pill */}
        <div className="header-user" onClick={() => navigate('/users')} title="Account Profile">
          <div className="header-avatar">
            {currentUser?.avatar || currentUser?.name?.charAt(0) || 'U'}
          </div>
          <div className="header-user-info hidden md:block">
            <div className="header-user-name">{currentUser?.name || 'Operator'}</div>
            <div className="header-user-role">{currentUser?.role || 'SOC'}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
