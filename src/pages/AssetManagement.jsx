import React, { useState, useMemo } from 'react';
import { Search, Database, Cpu, Activity, Shield, AlertTriangle, ChevronRight } from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';

export default function AssetManagement({ onSelectEquipment }) {
  const { equipmentList, airportInfo } = useLiveData();
  const [search, setSearch] = useState('');
  const [groupBy, setGroupBy] = useState('system');

  const filtered = useMemo(() => {
    if (!search) return equipmentList;
    const q = search.toLowerCase();
    return equipmentList.filter(e =>
      e.id.toLowerCase().includes(q) || e.zone.toLowerCase().includes(q) ||
      e.type.toLowerCase().includes(q) || e.system.toLowerCase().includes(q)
    );
  }, [equipmentList, search]);

  const groups = useMemo(() => {
    const map = {};
    filtered.forEach(eq => {
      const key = groupBy === 'system' ? eq.system :
                  groupBy === 'floor' ? eq.floor :
                  groupBy === 'type' ? eq.type : eq.status.toUpperCase();
      if (!map[key]) map[key] = [];
      map[key].push(eq);
    });
    return Object.entries(map).sort((a, b) => b[1].length - a[1].length);
  }, [filtered, groupBy]);

  const kpis = [
    { label: 'Total Tracked Assets', value: equipmentList.length, color: 'blue', icon: Database },
    { label: 'Operational Nodes', value: equipmentList.filter(e => e.status === 'operational').length, color: 'green', icon: Activity },
    { label: 'Requires Attention', value: equipmentList.filter(e => e.status === 'warning' || e.status === 'critical').length, color: 'yellow', icon: AlertTriangle },
    { label: 'Unique Asset Classes', value: new Set(equipmentList.map(e => e.type)).size, color: 'purple', icon: Cpu },
  ];

  return (
    <div className="page animate-fadeIn">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Asset Registry & Lifecycle Management</h1>
          <p className="page-subtitle">
            Long Thanh International Airport (LTIA) • Complete building equipment inventory & operational telemetry
          </p>
        </div>
        <div className="page-actions">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            padding: '6px 12px', borderRadius: 'var(--r-md)', fontSize: 12, color: 'var(--accent)'
          }}>
            <Database size={13} />
            <span style={{ fontFamily: 'var(--mono)', fontWeight: 700 }}>{equipmentList.length} Total Monitored Nodes</span>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="stat-grid stat-grid-4" style={{ marginBottom: 'var(--s5)' }}>
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="stat-card">
              <div className={`stat-icon ${kpi.color}`}>
                <Icon size={16} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{kpi.value}</div>
                <div className="stat-label">{kpi.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, marginBottom: 'var(--s4)', flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', width: 320 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
          <input
            placeholder="Search by ID, zone, type, subsystem..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 32 }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Group by:</span>
          {['system', 'floor', 'type', 'status'].map(g => (
            <button
              key={g}
              onClick={() => setGroupBy(g)}
              className={`btn btn-xs ${groupBy === g ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: 11, textTransform: 'capitalize' }}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Grouped Assets Accordions / Tables */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}>
        {groups.map(([groupName, items]) => (
          <div key={groupName} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{
              padding: 'var(--s3) var(--s4)', borderBottom: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'var(--bg-overlay)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', fontFamily: 'var(--mono)' }}>
                  {groupName}
                </span>
                <span className="badge badge-operational">
                  {items.length} Units
                </span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
                Avg Health: {(items.reduce((a, b) => a + (b.health || 95), 0) / items.length).toFixed(0)}%
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Equipment ID</th>
                    <th>Type / Family</th>
                    <th>Location / Zone</th>
                    <th>Subsystem</th>
                    <th>Health Score</th>
                    <th>Mode</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(eq => {
                    const statusBadge =
                      eq.status === 'operational' ? 'badge-operational' :
                      eq.status === 'warning' ? 'badge-warning' :
                      eq.status === 'critical' ? 'badge-critical' : 'badge-offline';

                    const healthColor =
                      (eq.health || 95) >= 95 ? 'var(--green)' :
                      (eq.health || 95) >= 85 ? 'var(--yellow)' : 'var(--red)';

                    return (
                      <tr key={eq.id}>
                        <td style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--accent)' }}>
                          {eq.id}
                        </td>
                        <td style={{ fontWeight: 500, color: 'var(--text-1)' }}>
                          {eq.type}
                        </td>
                        <td style={{ color: 'var(--text-2)' }}>
                          {eq.floor} • {eq.zone}
                        </td>
                        <td style={{ fontFamily: 'var(--mono)', color: 'var(--text-3)' }}>
                          {eq.system}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: healthColor, width: 36 }}>
                              {eq.health || 95}%
                            </span>
                            <div style={{ width: 48, height: 4, background: 'var(--bg-overlay)', borderRadius: 2, overflow: 'hidden' }}>
                              <div style={{ width: `${eq.health || 95}%`, height: '100%', background: healthColor, borderRadius: 2 }} />
                            </div>
                          </div>
                        </td>
                        <td style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-2)' }}>
                          {eq.mode || 'Auto'}
                        </td>
                        <td>
                          <span className={`badge ${statusBadge}`}>
                            {eq.status.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-ghost btn-xs"
                            onClick={() => onSelectEquipment?.(eq)}
                            style={{ fontSize: 11 }}
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
