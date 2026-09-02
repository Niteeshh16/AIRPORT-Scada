import React, { useState, useEffect } from 'react';
import { AlertTriangle, AlertOctagon, X, Check, ArrowRight, Bell } from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';
import { useNavigate } from 'react-router-dom';

export default function FloatingAlerts() {
  const { alerts, acknowledgeAlert } = useLiveData();
  const navigate = useNavigate();
  const [dismissedIds, setDismissedIds] = useState(new Set());
  const [expanded, setExpanded] = useState(true);

  // Filter for unacknowledged critical and high alerts that aren't manually dismissed
  const activeFloatingAlerts = alerts
    .filter(a => (a.severity === 'critical' || a.severity === 'high') && !a.acknowledged && !dismissedIds.has(a.id))
    .slice(0, 3); // show up to top 3 floating alerts

  const handleDismiss = (id) => {
    setDismissedIds(prev => new Set([...prev, id]));
  };

  const handleAck = (id) => {
    acknowledgeAlert(id);
    handleDismiss(id);
  };

  if (activeFloatingAlerts.length === 0) {
    return (
      <div
        className="floating-alerts-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            background: 'rgba(15, 23, 42, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '6px',
          }}
        >
          <span className="font-mono text-3xs font-bold text-tertiary tracking-wider uppercase">
            LIVE ALARMS (0 ACTIVE)
          </span>
        </div>
        <div style={{
          padding: '24px',
          textAlign: 'center',
          background: 'rgba(15, 23, 42, 0.2)',
          borderRadius: '8px',
          border: '1px dashed rgba(255, 255, 255, 0.1)',
          color: 'var(--text-tertiary)',
          fontSize: '11px'
        }}>
          No critical or high alarms active.
        </div>
      </div>
    );
  }

  return (
    <div
      className="floating-alerts-container animate-slideInDown"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '100%'
      }}
    >
      {/* Top Banner Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 10px',
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '6px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div className="flex items-center gap-1.5">
          <span className="live-dot-badge critical" style={{ width: 6, height: 6 }} />
          <span className="font-mono text-3xs font-bold text-red tracking-wider uppercase">
            LIVE ALARMS ({activeFloatingAlerts.length} ACTIVE)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/alerts')}
            className="text-3xs font-mono text-teal hover:underline flex items-center gap-0.5"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            All Alerts <ArrowRight size={10} />
          </button>
        </div>
      </div>

      {/* Floating Alert Cards */}
      {activeFloatingAlerts.map(alert => {
        const isCritical = alert.severity === 'critical';
        const borderColor = isCritical ? 'var(--status-critical)' : 'var(--status-warning)';
        const bgGlow = isCritical ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 166, 35, 0.12)';

        return (
          <div
            key={alert.id}
            className="floating-alert-card animate-fadeIn"
            style={{
              background: 'linear-gradient(135deg, rgba(18, 22, 34, 0.95) 0%, rgba(12, 16, 26, 0.98) 100%)',
              backdropFilter: 'blur(12px)',
              border: `1px solid rgba(255, 255, 255, 0.12)`,
              borderLeft: `4px solid ${borderColor}`,
              borderRadius: '8px',
              padding: '10px 12px',
              boxShadow: `0 10px 30px rgba(0, 0, 0, 0.6), 0 0 15px ${bgGlow}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '4px',
                    background: isCritical ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 166, 35, 0.2)',
                    color: borderColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {isCritical ? <AlertOctagon size={13} /> : <AlertTriangle size={13} />}
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-primary">{alert.system} • {alert.equipment}</span>
                  <span className="text-3xs text-tertiary block">{alert.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <span
                  className={`status-badge ${alert.severity}`}
                  style={{ fontSize: '7.5px', padding: '1px 5px', borderRadius: '3px' }}
                >
                  {alert.severity.toUpperCase()}
                </span>
                <button
                  onClick={() => handleDismiss(alert.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-tertiary)',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Dismiss notification"
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* Message Body */}
            <p className="text-2xs text-secondary m-0 leading-snug font-sans">
              {alert.message}
            </p>

            {/* Action Footer */}
            <div className="flex justify-between items-center pt-1.5 border-t border-subtle mt-1">
              <span className="text-3xs font-mono text-tertiary">{alert.time}</span>
              <div className="flex gap-1.5">
                <button
                  className="btn btn-sm btn-ghost"
                  style={{ fontSize: '10px', padding: '2px 8px', height: '22px' }}
                  onClick={() => handleDismiss(alert.id)}
                >
                  Snooze
                </button>
                <button
                  className="btn btn-sm btn-primary"
                  style={{ fontSize: '10px', padding: '2px 8px', height: '22px', background: borderColor, borderColor }}
                  onClick={() => handleAck(alert.id)}
                >
                  <Check size={11} /> Acknowledge
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
