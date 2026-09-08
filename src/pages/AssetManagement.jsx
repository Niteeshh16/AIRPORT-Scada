import React, { useState, useMemo } from 'react';
import { Search, Database, BarChart3, Layers, Filter } from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';

export default function AssetManagement({ onSelectEquipment }) {
  const { equipmentList, airportInfo } = useLiveData();
  const [search, setSearch] = useState('');
  const [groupBy, setGroupBy] = useState('system');

  const filtered = useMemo(() => {
    if (!search) return equipmentList;
    return equipmentList.filter(e => 
      e.id.toLowerCase().includes(search.toLowerCase()) ||
      e.zone.toLowerCase().includes(search.toLowerCase()) ||
      e.type.toLowerCase().includes(search.toLowerCase()) ||
      e.system.toLowerCase().includes(search.toLowerCase())
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

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">{airportInfo.name} — Asset Registry & Lifecycle</h1>
          <p className="page-subtitle">Complete building equipment inventory, manufacturer specs, and real-time operational telemetry</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Database size={14} className="text-teal" />
          <span className="font-mono text-sm text-teal">
            {equipmentList.length} Total Monitored Nodes
          </span>
        </div>
      </div>

      {/* KPI Cards Summary */}
      <div className="scada-grid-4" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="kpi-card teal">
          <div className="kpi-label">Total Registered Assets</div>
          <div className="kpi-value teal font-mono">{equipmentList.length}</div>
        </div>
        <div className="kpi-card teal">
          <div className="kpi-label">Operational (Healthy)</div>
          <div className="kpi-value teal font-mono">{equipmentList.filter(e => e.status === 'operational').length}</div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-label">Needs Field Attention</div>
          <div className="kpi-value amber font-mono">{equipmentList.filter(e => e.status === 'warning' || e.status === 'critical').length}</div>
        </div>
        <div className="kpi-card gray">
          <div className="kpi-label">Distinct Asset Classes</div>
          <div className="kpi-value font-mono">{new Set(equipmentList.map(e => e.type)).size}</div>
        </div>
      </div>

      {/* Grouping and Search Controls */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-5)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, maxWidth: 420 }}>
          <label className="text-xs text-tertiary block mb-1">Filter Asset Database</label>
          <div className="search-input-wrapper">
            <Search size={14} />
            <input className="search-input" placeholder="Search by ID, zone, manufacturer, subsystem..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        
        <div>
          <label className="text-xs text-tertiary block mb-1">Group Inventory By</label>
          <div className="time-range">
            {['system', 'floor', 'type', 'status'].map(g => (
              <button key={g} className={`time-range-btn ${groupBy === g ? 'active' : ''}`} onClick={() => setGroupBy(g)}>
                By {g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grouped Asset Sections */}
      {groups.map(([group, items]) => (
        <div key={group} style={{ marginBottom: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600 }}>{group}</h3>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', background: 'var(--bg-hover)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
              {items.length} units
            </span>
          </div>

          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Asset ID</th>
                  <th>Class / Type</th>
                  <th>Location Zone</th>
                  <th>Condition</th>
                  <th>Health Score</th>
                  <th>Power Draw</th>
                  <th>Bus Communication</th>
                  <th>Telemetry Age</th>
                </tr>
              </thead>
              <tbody>
                {items.map(eq => (
                  <tr key={eq.id} onClick={() => onSelectEquipment(eq)}>
                    <td className="eq-id font-mono text-teal font-bold">{eq.id}</td>
                    <td>{eq.type}</td>
                    <td>{eq.zone} ({eq.floor})</td>
                    <td>
                      <span className={`status-badge ${eq.status}`}>
                        <span className="status-dot-sm" />
                        {eq.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div className="health-bar-container" style={{ width: 40, height: 4 }}>
                          <div className={`health-bar ${eq.health >= 80 ? 'high' : eq.health >= 50 ? 'medium' : 'low'}`} style={{ width: `${eq.health}%` }} />
                        </div>
                        <span className="font-mono text-xs">{eq.health}%</span>
                      </div>
                    </td>
                    <td className="font-mono text-xs">{eq.power !== null ? `${eq.power} kW` : '—'}</td>
                    <td>
                      <span className="font-mono text-xs text-teal">{eq.comm}</span>
                    </td>
                    <td className="live-data-tick">{eq.lastUpdate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
