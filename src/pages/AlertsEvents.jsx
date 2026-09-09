import React, { useState, useMemo } from 'react';
import {
  AlertTriangle, AlertOctagon, Info, CheckCircle2, Wrench,
  MapPin, Filter, Bell, Clock, ChevronRight, Zap
} from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';

function timeAgo(ts) {
  const diff = (Date.now() - ts) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export default function AlertsEvents() {
  const { alerts, acknowledgeAlert, createWorkOrder } = useLiveData();

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
    createWorkOrder({
      title: `Corrective: ${alert.message}`,
      priority: alert.severity,
      equipment: alert.equipment,
      assignee: 'Thanh Nguyen'
    });
    acknowledgeAlert(alert.id);
  };

  const summaryCards = [
    { label: 'Critical Faults', count: counts.critical, sev: 'critical', icon: AlertOctagon, color: 'red' },
    { label: 'High Priority', count: counts.high, sev: 'high', icon: AlertTriangle, color: 'yellow' },
    { label: 'Medium Warning', count: counts.medium, sev: 'medium', icon: AlertTriangle, color: 'yellow' },
    { label: 'Advisory / Low', count: counts.low, sev: 'low', icon: Info, color: 'blue' },
    { label: 'Unacknowledged', count: counts.unack, sev: null, icon: Bell, color: counts.unack > 0 ? 'red' : 'green' },
  ];

  return (
    <div className="page animate-fadeIn">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Alarm Management & Incident Center</h1>
          <p className="page-subtitle">
            Long Thanh International Airport (LTIA) • Real-time telemetry alarm log, dispatch & acknowledgement
          </p>
        </div>
        <div className="page-actions">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', borderRadius: 'var(--r-md)',
            background: counts.unack > 0 ? 'var(--red-bg)' : 'var(--green-bg)',
            border: `1px solid ${counts.unack > 0 ? 'rgba(248,81,73,0.3)' : 'rgba(63,185,80,0.3)'}`,
            color: counts.unack > 0 ? 'var(--red)' : 'var(--green)',
            fontSize: 12, fontWeight: 600
          }}>
            {counts.unack > 0 ? <Bell size={14} /> : <CheckCircle2 size={14} />}
            <span>{counts.unack > 0 ? `${counts.unack} Unacknowledged Alarms` : 'All Alarms Cleared'}</span>
          </div>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="stat-grid stat-grid-5" style={{ marginBottom: 'var(--s5)' }}>
        {summaryCards.map((card, idx) => {
          const Icon = card.icon;
          const isActive = filterSeverity === card.sev;
          return (
            <div
              key={idx}
              className="stat-card"
              onClick={() => {
                if (card.sev) setFilterSeverity(card.sev === filterSeverity ? 'all' : card.sev);
                else setFilterAck('unack');
              }}
              style={{
                cursor: 'pointer',
                borderColor: isActive ? 'var(--accent)' : 'var(--border)'
              }}
            >
              <div className={`stat-icon ${card.color}`}>
                <Icon size={16} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{card.count}</div>
                <div className="stat-label">{card.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, marginBottom: 'var(--s4)', flexWrap: 'wrap',
        padding: '10px 14px', background: 'var(--bg-surface)',
        border: '1px solid var(--border)', borderRadius: 'var(--r-lg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Filter size={14} style={{ color: 'var(--text-3)', marginRight: 4 }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Severity:</span>
          {['all', 'critical', 'high', 'medium', 'low'].map(s => (
            <button
              key={s}
              onClick={() => setFilterSeverity(s)}
              className={`btn btn-xs ${filterSeverity === s ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: 11, textTransform: 'capitalize' }}
            >
              {s}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { id: 'all', label: 'All' },
            { id: 'unack', label: 'Unacknowledged' },
            { id: 'ack', label: 'Acknowledged' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterAck(f.id)}
              className={`btn btn-xs ${filterAck === f.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: 11 }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alarm Feed List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px 16px' }}>
            <CheckCircle2 size={32} style={{ margin: '0 auto 12px', color: 'var(--green)', opacity: 0.6 }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>No active alarms found</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>All alarms in this category are nominal or cleared</div>
          </div>
        ) : (
          filtered.map(alert => {
            const isExpanded = expandedId === alert.id;
            const badgeClass =
              alert.severity === 'critical' ? 'badge-critical' :
              alert.severity === 'high' ? 'badge-warning' :
              alert.severity === 'medium' ? 'badge-warning' : 'badge-operational';

            return (
              <div
                key={alert.id}
                className="card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  opacity: alert.acknowledged ? 0.75 : 1,
                  borderLeft: `3px solid ${alert.severity === 'critical' ? 'var(--red)' : alert.severity === 'high' ? 'var(--yellow)' : 'var(--blue)'}`
                }}
              >
                {/* Header / Summary Row */}
                <div
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 16px', cursor: 'pointer', gap: 12
                  }}
                  onClick={() => setExpandedId(isExpanded ? null : alert.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
                    <span className={`badge ${badgeClass}`}>
                      {alert.severity.toUpperCase()}
                    </span>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>{alert.message}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--mono)' }}>
                          <Zap size={11} /> {alert.equipment}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={11} /> {alert.location}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--mono)' }}>
                          <Clock size={11} /> {timeAgo(alert.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    {alert.acknowledged ? (
                      <span style={{ fontSize: 11, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle2 size={13} /> Acknowledged
                      </span>
                    ) : (
                      <>
                        <button
                          className="btn btn-secondary btn-xs"
                          onClick={e => {
                            e.stopPropagation();
                            acknowledgeAlert(alert.id);
                          }}
                        >
                          Acknowledge
                        </button>
                        <button
                          className="btn btn-primary btn-xs"
                          onClick={e => {
                            e.stopPropagation();
                            handleDispatchWO(alert);
                          }}
                        >
                          <Wrench size={11} style={{ marginRight: 3 }} /> Dispatch WO
                        </button>
                      </>
                    )}
                    <ChevronRight
                      size={14}
                      style={{
                        color: 'var(--text-3)',
                        transform: isExpanded ? 'rotate(90deg)' : 'none',
                        transition: 'transform 0.15s'
                      }}
                    />
                  </div>
                </div>

                {/* Expanded Telemetry Box */}
                {isExpanded && (
                  <div style={{
                    padding: '12px 16px 14px 16px',
                    borderTop: '1px solid var(--border)',
                    background: 'var(--bg-app)',
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: 12
                  }}>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase' }}>Subsystem</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)', fontFamily: 'var(--mono)' }}>{alert.system}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase' }}>Equipment ID</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', fontFamily: 'var(--mono)' }}>{alert.equipment}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase' }}>Location</div>
                      <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{alert.location}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase' }}>Alarm ID</div>
                      <div style={{ fontSize: 12, color: 'var(--text-2)', fontFamily: 'var(--mono)' }}>{alert.id}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase' }}>Time Recorded</div>
                      <div style={{ fontSize: 12, color: 'var(--text-2)', fontFamily: 'var(--mono)' }}>
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase' }}>Protocol Routing</div>
                      <div style={{ fontSize: 12, color: 'var(--green)', fontFamily: 'var(--mono)' }}>OPC UA • BACnet Alert</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
