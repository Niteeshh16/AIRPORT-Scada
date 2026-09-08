import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, AlertOctagon, Info, CheckCircle2, Eye, Wrench, 
  User, MapPin, Filter, Trash2, Plus
} from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';

export default function AlertsEvents() {
  const { alerts, acknowledgeAlert, resolveAlert, createWorkOrder, equipmentList } = useLiveData();

  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterAck, setFilterAck] = useState('all');
  const [search, setSearch] = useState('');

  const counts = useMemo(() => {
    return {
      critical: alerts.filter(a => a.severity === 'critical').length,
      high: alerts.filter(a => a.severity === 'high').length,
      medium: alerts.filter(a => a.severity === 'medium').length,
      low: alerts.filter(a => a.severity === 'low').length,
      total: alerts.length,
    };
  }, [alerts]);

  const filtered = useMemo(() => {
    return alerts
      .filter(a => filterSeverity === 'all' || a.severity === filterSeverity)
      .filter(a => {
        if (filterAck === 'unack') return !a.acknowledged;
        if (filterAck === 'ack') return a.acknowledged;
        return true;
      })
      .filter(a => {
        if (!search) return true;
        return a.message.toLowerCase().includes(search.toLowerCase()) || 
               a.equipment.toLowerCase().includes(search.toLowerCase()) ||
               a.location.toLowerCase().includes(search.toLowerCase()) ||
               a.system.toLowerCase().includes(search.toLowerCase());
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [alerts, filterSeverity, filterAck, search]);

  const severityIcon = (sev) => {
    if (sev === 'critical') return <AlertOctagon size={14} />;
    if (sev === 'high') return <AlertTriangle size={14} />;
    return <Info size={14} />;
  };

  const handleDispatchWO = (alert) => {
    createWorkOrder({
      title: `Corrective Maintenance: ${alert.message}`,
      priority: alert.severity,
      equipment: alert.equipment,
      assignee: 'Thanh Nguyen',
    });
    acknowledgeAlert(alert.id);
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">SCADA Alarm Management & Incident Center</h1>
          <p className="page-subtitle">Long Thanh Terminal 1 • Real-time event log, alarm acknowledgments, and field technician dispatch</p>
        </div>
      </div>

      {/* Alarm Level Summary Cards */}
      <div className="scada-grid-5" style={{ marginBottom: 'var(--space-5)' }}>
        {[
          { label: 'Critical Alarms', count: counts.critical, color: 'critical', sev: 'critical' },
          { label: 'High Priority', count: counts.high, color: 'warning', sev: 'high' },
          { label: 'Medium Priority', count: counts.medium, color: 'info', sev: 'medium' },
          { label: 'Low / Advisory', count: counts.low, color: 'info', sev: 'low' },
          { label: 'Total Active', count: counts.total, color: null, sev: 'all' },
        ].map((item, idx) => (
          <div 
            key={idx}
            className="card"
            style={{ 
              padding: 'var(--space-4)', 
              cursor: 'pointer',
              borderColor: filterSeverity === item.sev ? 'var(--accent-teal)' : undefined,
              background: filterSeverity === item.sev ? 'var(--bg-elevated)' : undefined,
            }}
            onClick={() => setFilterSeverity(item.sev)}
          >
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
              {item.label}
            </div>
            <div style={{ 
              fontSize: 'var(--text-2xl)', fontWeight: 700, fontFamily: 'var(--font-mono)',
              color: item.color === 'critical' ? 'var(--status-critical)' : 
                     item.color === 'warning' ? 'var(--status-warning)' : 
                     item.color === 'info' ? 'var(--status-info)' : 'var(--text-primary)'
            }}>
              {item.count}
            </div>
          </div>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="filter-chips">
          <button className={`filter-chip ${filterAck === 'all' ? 'active' : ''}`} onClick={() => setFilterAck('all')}>All ({alerts.length})</button>
          <button className={`filter-chip ${filterAck === 'unack' ? 'active' : ''}`} onClick={() => setFilterAck('unack')}>Unacknowledged ({alerts.filter(a => !a.acknowledged).length})</button>
          <button className={`filter-chip ${filterAck === 'ack' ? 'active' : ''}`} onClick={() => setFilterAck('ack')}>Acknowledged ({alerts.filter(a => a.acknowledged).length})</button>
        </div>

        <div style={{ minWidth: 260, flex: 1, maxWidth: 360 }}>
          <input 
            className="search-input" 
            placeholder="Search alarms by message, location, device..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginLeft: 'auto', fontFamily: 'var(--font-mono)' }}>
          {filtered.length} active alarms
        </span>
      </div>

      {/* Timeline Alarm List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {filtered.map((alert, idx) => (
          <div 
            key={alert.id} 
            className={`alert-item ${alert.severity} alert-animate`}
            style={{ animationDelay: `${idx * 40}ms` }}
          >
            <div className={`alert-severity-icon ${alert.severity}`}>
              {severityIcon(alert.severity)}
            </div>

            <div className="alert-content" style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: '4px' }}>
                <span className={`status-badge ${alert.severity}`} style={{ padding: '0 6px', fontSize: '10px' }}>
                  {alert.severity.toUpperCase()}
                </span>
                <span className="font-mono text-teal font-semibold" style={{ fontSize: 'var(--text-xs)' }}>{alert.system}</span>
                <span className="text-tertiary font-mono" style={{ fontSize: '11px' }}>{alert.id}</span>
              </div>
              
              <div className="alert-title">{alert.message}</div>
              
              <div className="alert-meta" style={{ marginTop: '4px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <MapPin size={11} /> {alert.location}
                </span>
                <span className="font-mono text-teal">{alert.equipment}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
              <span className="alert-time font-mono">{alert.time}</span>
              
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                {!alert.acknowledged ? (
                  <button 
                    className="btn btn-primary btn-sm" 
                    style={{ fontSize: '11px', padding: '3px 10px' }}
                    onClick={() => acknowledgeAlert(alert.id)}
                  >
                    ✓ Acknowledge
                  </button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--accent-teal)' }}>
                    <CheckCircle2 size={12} /> {alert.assignee || 'Acknowledged'}
                  </div>
                )}

                <button 
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11px', padding: '3px 8px' }}
                  onClick={() => handleDispatchWO(alert)}
                  title="Dispatch Work Order"
                >
                  <Wrench size={12} /> Work Order
                </button>

                <button 
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: '11px', padding: '3px 6px' }}
                  onClick={() => resolveAlert(alert.id)}
                  title="Clear / Resolve Alarm"
                >
                  <Trash2 size={12} className="text-tertiary" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="card p-8 text-center text-secondary">
            <CheckCircle2 size={32} className="mx-auto text-teal mb-2" />
            <p className="font-semibold text-primary">No Active Alarms in Current Filter</p>
            <p className="text-xs text-tertiary mt-1">All airport building subsystems operating within normal parameters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
