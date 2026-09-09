import React, { useState, useMemo } from 'react';
import { Search, Cpu, Activity, Filter, Eye, AlertTriangle } from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';

export default function EquipmentExplorer({ onSelectEquipment }) {
  const { equipmentList, subsystems, floors } = useLiveData();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterSystem, setFilterSystem] = useState('all');
  const [filterFloor, setFilterFloor] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = useMemo(() => equipmentList.filter(eq => {
    const q = searchQuery.toLowerCase();
    if (q && !eq.id.toLowerCase().includes(q) && !eq.zone.toLowerCase().includes(q) && !eq.type.toLowerCase().includes(q)) return false;
    if (filterSystem !== 'all' && eq.system !== filterSystem) return false;
    if (filterFloor !== 'all' && eq.floor !== filterFloor) return false;
    if (filterStatus !== 'all' && eq.status !== filterStatus) return false;
    return true;
  }), [equipmentList, searchQuery, filterSystem, filterFloor, filterStatus]);

  const counts = {
    operational: equipmentList.filter(e => e.status === 'operational').length,
    warning:     equipmentList.filter(e => e.status === 'warning').length,
    critical:    equipmentList.filter(e => e.status === 'critical').length,
    offline:     equipmentList.filter(e => e.status === 'offline').length,
  };

  return (
    <div className="page animate-fadeIn">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Equipment Explorer & Device Diagnostics</h1>
          <p className="page-subtitle">
            Long Thanh International Airport (LTIA) • Search, filter and inspect {equipmentList.length} monitored industrial field assets
          </p>
        </div>
        <div className="page-actions">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            padding: '6px 12px', borderRadius: 'var(--r-md)', fontSize: 12, color: 'var(--accent)'
          }}>
            <Cpu size={13} />
            <span style={{ fontFamily: 'var(--mono)', fontWeight: 700 }}>{filtered.length} / {equipmentList.length} Visible</span>
          </div>
        </div>
      </div>

      {/* Status Filter Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--s3)', marginBottom: 'var(--s4)' }}>
        {[
          { key: 'operational', label: 'Operational Nodes', count: counts.operational, color: 'var(--green)', bg: 'var(--green-bg)' },
          { key: 'warning', label: 'Warning Anomalies', count: counts.warning, color: 'var(--yellow)', bg: 'var(--yellow-bg)' },
          { key: 'critical', label: 'Critical Faults', count: counts.critical, color: 'var(--red)', bg: 'var(--red-bg)' },
          { key: 'offline', label: 'Offline / Disconnected', count: counts.offline, color: 'var(--text-3)', bg: 'var(--bg-overlay)' },
        ].map(item => {
          const isActive = filterStatus === item.key;
          return (
            <div
              key={item.key}
              className="card"
              onClick={() => setFilterStatus(isActive ? 'all' : item.key)}
              style={{
                padding: 'var(--s3) var(--s4)',
                cursor: 'pointer',
                borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                background: isActive ? 'var(--bg-overlay)' : 'var(--bg-surface)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--mono)', color: item.color, marginTop: 2 }}>
                  {item.count}
                </div>
              </div>
              <span style={{
                width: 10, height: 10, borderRadius: '50%',
                background: item.color, boxShadow: `0 0 8px ${item.color}`
              }} />
            </div>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: 'var(--s3) var(--s4)', marginBottom: 'var(--s4)' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
            <input
              placeholder="Search by ID, Zone, Type..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 32 }}
            />
          </div>

          {/* Subsystem Select */}
          <div style={{ width: 180 }}>
            <select value={filterSystem} onChange={e => setFilterSystem(e.target.value)}>
              <option value="all">All Subsystems</option>
              {subsystems.map(s => (
                <option key={s.id} value={s.id}>{s.id} - {s.name}</option>
              ))}
            </select>
          </div>

          {/* Floor Select */}
          <div style={{ width: 140 }}>
            <select value={filterFloor} onChange={e => setFilterFloor(e.target.value)}>
              <option value="all">All Floors</option>
              {floors.map(f => (
                <option key={f.id} value={f.id}>{f.id} ({f.label})</option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {(filterSystem !== 'all' || filterFloor !== 'all' || filterStatus !== 'all' || searchQuery) && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setFilterSystem('all');
                setFilterFloor('all');
                setFilterStatus('all');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Equipment Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Equipment ID</th>
                <th>Type / Description</th>
                <th>Subsystem</th>
                <th>Location</th>
                <th>Health Score</th>
                <th>Mode</th>
                <th>Live Telemetry</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 100).map(eq => {
                const statusBadge =
                  eq.status === 'operational' ? 'badge-operational' :
                  eq.status === 'warning' ? 'badge-warning' :
                  eq.status === 'critical' ? 'badge-critical' : 'badge-offline';

                const healthColor =
                  eq.health >= 90 ? 'var(--green)' :
                  eq.health >= 75 ? 'var(--yellow)' : 'var(--red)';

                return (
                  <tr key={eq.id}>
                    <td style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--accent)' }}>
                      {eq.id}
                    </td>
                    <td style={{ fontWeight: 500, color: 'var(--text-1)' }}>
                      {eq.type}
                    </td>
                    <td style={{ fontFamily: 'var(--mono)', color: 'var(--text-2)' }}>
                      {eq.system}
                    </td>
                    <td style={{ color: 'var(--text-2)' }}>
                      {eq.floor} • {eq.zone}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: healthColor, width: 34 }}>
                          {eq.health}%
                        </span>
                        <div style={{ width: 44, height: 4, background: 'var(--bg-overlay)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ width: `${eq.health}%`, height: '100%', background: healthColor, borderRadius: 2 }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-2)' }}>
                      {eq.mode || 'Auto'}
                    </td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>
                      {eq.temp !== null && eq.temp !== undefined ? (
                        <span style={{ color: 'var(--accent)' }}>{eq.temp}°C </span>
                      ) : null}
                      {eq.fanRPM !== null && eq.fanRPM !== undefined ? (
                        <span style={{ color: 'var(--text-2)' }}>{eq.fanRPM} RPM </span>
                      ) : null}
                      {eq.power !== null && eq.power !== undefined ? (
                        <span style={{ color: 'var(--text-3)' }}>{eq.power} kW</span>
                      ) : null}
                    </td>
                    <td>
                      <span className={`badge ${statusBadge}`}>
                        {eq.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-xs"
                        onClick={() => onSelectEquipment?.(eq)}
                        style={{ fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 3 }}
                      >
                        <Eye size={11} /> Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
