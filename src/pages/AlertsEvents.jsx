import React, { useState, useMemo } from 'react';
import {
  AlertTriangle, AlertOctagon, Info, CheckCircle2, Eye, Wrench,
  User, MapPin, Filter, Bell, BellOff, ChevronRight, Clock, X, Zap
} from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';

const SEV_CONFIG = {
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', label: 'CRITICAL', icon: AlertOctagon },
  high:     { color: '#f97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.3)', label: 'HIGH', icon: AlertTriangle },
  medium:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', label: 'MEDIUM', icon: AlertTriangle },
  low:      { color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.3)', label: 'LOW', icon: Info },
};

function timeAgo(ts) {
  const diff = (Date.now() - ts) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  return `${Math.floor(diff/3600)}h ago`;
}

export default function AlertsEvents() {
  const { alerts, acknowledgeAlert, resolveAlert, createWorkOrder } = useLiveData();

  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterAck, setFilterAck] = useState('unack');
  const [expandedId, setExpandedId] = useState(null);

  const counts = useMemo(() => ({
    critical: alerts.filter(a => a.severity === 'critical').length,
    high:     alerts.filter(a => a.severity === 'high').length,
    medium:   alerts.filter(a => a.severity === 'medium').length,
    low:      alerts.filter(a => a.severity === 'low').length,
    unack:    alerts.filter(a => !a.acknowledged).length,
    total:    alerts.length,
  }), [alerts]);

  const filtered = useMemo(() => alerts
    .filter(a => filterSeverity === 'all' || a.severity === filterSeverity)
    .filter(a => {
      if (filterAck === 'unack') return !a.acknowledged;
      if (filterAck === 'ack') return a.acknowledged;
      return true;
    })
    .sort((a, b) => b.timestamp - a.timestamp), [alerts, filterSeverity, filterAck]);

  const handleDispatchWO = (alert) => {
    createWorkOrder({ title: `Corrective: ${alert.message}`, priority: alert.severity, equipment: alert.equipment, assignee: 'Thanh Nguyen' });
    acknowledgeAlert(alert.id);
  };

  const summaryCards = [
    { label: 'Critical', count: counts.critical, sev: 'critical' },
    { label: 'High',     count: counts.high,     sev: 'high'     },
    { label: 'Medium',   count: counts.medium,   sev: 'medium'   },
    { label: 'Low',      count: counts.low,      sev: 'low'      },
    { label: 'Unacknowledged', count: counts.unack, sev: null, special: true },
  ];

  return (
    <div className="animate-fadeIn" style={{ padding: 'var(--space-5)' }}>

      {/* Page Header */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 4, height: 28, background: 'linear-gradient(180deg, #ef4444, #f97316)', borderRadius: 2 }} />
              <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Alarm Management & Incident Center
              </h1>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: 0, paddingLeft: 14 }}>
              LTIA Terminal 1 · Real-time alarm log, acknowledgements & field dispatch
            </p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: counts.unack > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
            border: `1px solid ${counts.unack > 0 ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
            borderRadius: 10, padding: '8px 16px',
          }}>
            {counts.unack > 0 ? <Bell size={14} color="#ef4444" /> : <CheckCircle2 size={14} color="#10b981" />}
            <span style={{ fontSize: 13, fontWeight: 700, color: counts.unack > 0 ? '#ef4444' : '#10b981' }}>
              {counts.unack > 0 ? `${counts.unack} Unacknowledged` : 'All Clear'}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        {summaryCards.map(({ label, count, sev, special }) => {
          const cfg = sev ? SEV_CONFIG[sev] : { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.3)' };
          const isActive = filterSeverity === (sev || 'all');
          return (
            <button
              key={label}
              onClick={() => setFilterSeverity(sev || (filterSeverity === 'all' ? 'all' : 'all'))}
              style={{
                background: cfg.bg, border: `1px solid ${cfg.border}`,
                borderRadius: 12, padding: '16px',
                cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.2s',
                boxShadow: isActive ? `0 0 16px ${cfg.bg}` : 'none',
                outline: 'none',
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 800, color: cfg.color, fontFamily: 'monospace', lineHeight: 1 }}>{count}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
              {special && (
                <div style={{ marginTop: 6, width: '100%', height: 2, background: `linear-gradient(90deg, ${cfg.color}, transparent)`, borderRadius: 1 }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
        marginBottom: 'var(--space-4)',
        padding: '10px 14px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 10,
      }}>
        <Filter size={13} color="rgba(255,255,255,0.4)" />
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginRight: 8 }}>SEVERITY:</span>
        {['all', 'critical', 'high', 'medium', 'low'].map(s => (
          <button
            key={s}
            onClick={() => setFilterSeverity(s)}
            style={{
              padding: '4px 12px', borderRadius: 6, fontSize: 10, fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
              border: filterSeverity === s
                ? `1px solid ${s === 'all' ? '#00d4aa' : SEV_CONFIG[s]?.color}`
                : '1px solid rgba(255,255,255,0.08)',
              background: filterSeverity === s
                ? (s === 'all' ? 'rgba(0,212,170,0.15)' : SEV_CONFIG[s]?.bg)
                : 'transparent',
              color: filterSeverity === s
                ? (s === 'all' ? '#00d4aa' : SEV_CONFIG[s]?.color)
                : 'rgba(255,255,255,0.4)',
              transition: 'all 0.15s',
            }}
          >{s}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {['all', 'unack', 'ack'].map(f => (
            <button
              key={f}
              onClick={() => setFilterAck(f)}
              style={{
                padding: '4px 12px', borderRadius: 6, fontSize: 10, fontWeight: 600,
                cursor: 'pointer',
                border: filterAck === f ? '1px solid rgba(0,212,170,0.4)' : '1px solid rgba(255,255,255,0.08)',
                background: filterAck === f ? 'rgba(0,212,170,0.12)' : 'transparent',
                color: filterAck === f ? '#00d4aa' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.15s',
              }}
            >
              {f === 'all' ? 'All Status' : f === 'unack' ? 'Unacknowledged' : 'Acknowledged'}
            </button>
          ))}
        </div>
      </div>

      {/* Alarm Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>
            <CheckCircle2 size={32} style={{ margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
            No alarms matching the selected filters
          </div>
        )}
        {filtered.map(alert => {
          const cfg = SEV_CONFIG[alert.severity] || SEV_CONFIG.low;
          const Icon = cfg.icon;
          const isExpanded = expandedId === alert.id;
          return (
            <div
              key={alert.id}
              style={{
                background: alert.acknowledged ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${alert.acknowledged ? 'rgba(255,255,255,0.06)' : cfg.border}`,
                borderLeft: `3px solid ${alert.acknowledged ? 'rgba(255,255,255,0.12)' : cfg.color}`,
                borderRadius: 10,
                overflow: 'hidden',
                transition: 'all 0.2s',
                opacity: alert.acknowledged ? 0.65 : 1,
              }}
            >
              {/* Row */}
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer' }}
                onClick={() => setExpandedId(isExpanded ? null : alert.id)}
              >
                {/* Severity Icon */}
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: cfg.bg, border: `1px solid ${cfg.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={14} color={cfg.color} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
                      padding: '2px 6px', borderRadius: 4,
                      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
                    }}>{cfg.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {alert.message}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, color: 'var(--text-tertiary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Zap size={10} />{alert.equipment}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={10} />{alert.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={10} />{timeAgo(alert.timestamp)}</span>
                  </div>
                </div>

                {/* Status + actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  {alert.acknowledged ? (
                    <span style={{ fontSize: 10, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle2 size={12} /> ACK
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={e => { e.stopPropagation(); acknowledgeAlert(alert.id); }}
                        style={{
                          padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600,
                          background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)',
                          color: '#00d4aa', cursor: 'pointer',
                        }}
                      >Acknowledge</button>
                      <button
                        onClick={e => { e.stopPropagation(); handleDispatchWO(alert); }}
                        style={{
                          padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600,
                          background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)',
                          color: '#f97316', cursor: 'pointer',
                        }}
                      >Dispatch WO</button>
                    </>
                  )}
                  <ChevronRight size={14} color="rgba(255,255,255,0.2)" style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
              </div>

              {/* Expanded Detail */}
              {isExpanded && (
                <div style={{
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  padding: '12px 16px 12px 60px',
                  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
                  background: 'rgba(0,0,0,0.2)',
                }}>
                  {[
                    ['System', alert.system],
                    ['Equipment ID', alert.equipment],
                    ['Location', alert.location],
                    ['Alarm ID', alert.id],
                    ['Timestamp', new Date(alert.timestamp).toLocaleString()],
                    ['Status', alert.acknowledged ? 'Acknowledged' : 'Active'],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{v}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
