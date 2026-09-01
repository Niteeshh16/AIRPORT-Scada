import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, Eye, Power } from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';

const savedFilters = [
  { label: 'Critical Faults', filter: { status: 'critical' } },
  { label: 'Warning Status', filter: { status: 'warning' } },
  { label: 'HVAC Equipment (LBMS)', filter: { system: 'LBMS' } },
  { label: 'Baggage Handling (BHS)', filter: { system: 'BHS' } },
  { label: 'Offline Devices', filter: { status: 'offline' } },
];

export default function EquipmentExplorer({ onSelectEquipment }) {
  const { equipmentList, subsystems, floors } = useLiveData();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSystem, setFilterSystem] = useState('all');
  const [filterFloor, setFilterFloor] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = useMemo(() => {
    return equipmentList.filter(eq => {
      if (searchQuery && !eq.id.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !eq.zone.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !eq.type.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filterSystem !== 'all' && eq.system !== filterSystem) return false;
      if (filterFloor !== 'all' && eq.floor !== filterFloor) return false;
      if (filterStatus !== 'all' && eq.status !== filterStatus) return false;
      return true;
    });
  }, [equipmentList, searchQuery, filterSystem, filterFloor, filterStatus]);

  const applyQuickFilter = (filter) => {
    setFilterSystem(filter.system || 'all');
    setFilterStatus(filter.status || 'all');
    setFilterFloor(filter.floor || 'all');
    setSearchQuery('');
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Equipment Explorer & Diagnostics</h1>
          <p className="page-subtitle">Long Thanh Terminal 1 • Search, filter, and command all monitored industrial assets</p>
        </div>
        <div className="font-mono text-sm text-teal">
          {filtered.length} of {equipmentList.length} assets active in filter
        </div>
      </div>

      {/* Search and Filters Card */}
      <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="card-body">
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            {/* Search query input */}
            <div style={{ flex: 1, minWidth: 260 }}>
              <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', display: 'block', marginBottom: 'var(--space-1)' }}>
                Search by Device ID, Location Zone, or Asset Class
              </label>
              <div className="search-input-wrapper">
                <Search size={14} />
                <input
                  className="search-input"
                  type="text"
                  placeholder="e.g. AHU-310, Conveyor, Terminal 2 East, Chiller..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* System filter */}
            <div style={{ minWidth: 150 }}>
              <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', display: 'block', marginBottom: 'var(--space-1)' }}>
                Subsystem
              </label>
              <select 
                className="search-input" 
                value={filterSystem}
                onChange={(e) => setFilterSystem(e.target.value)}
              >
                <option value="all">All Subsystems</option>
                {subsystems.map(s => <option key={s.id} value={s.id}>{s.id} - {s.name}</option>)}
              </select>
            </div>

            {/* Floor filter */}
            <div style={{ minWidth: 120 }}>
              <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', display: 'block', marginBottom: 'var(--space-1)' }}>
                Floor Level
              </label>
              <select 
                className="search-input"
                value={filterFloor}
                onChange={(e) => setFilterFloor(e.target.value)}
              >
                <option value="all">All Floors</option>
                {floors.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>

            {/* Status filter */}
            <div style={{ minWidth: 130 }}>
              <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', display: 'block', marginBottom: 'var(--space-1)' }}>
                Status Condition
              </label>
              <select 
                className="search-input"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="operational">Operational</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical Fault</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>

          {/* Quick Filter Chips */}
          <div style={{ marginTop: 'var(--space-3)', display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
            <SlidersHorizontal size={12} className="text-tertiary" />
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginRight: 'var(--space-1)' }}>Saved Quick Filters:</span>
            {savedFilters.map((sf, i) => (
              <button key={i} className="filter-chip" onClick={() => applyQuickFilter(sf.filter)}>
                {sf.label}
              </button>
            ))}
            <button 
              className="filter-chip" 
              style={{ borderStyle: 'dashed' }}
              onClick={() => { setFilterSystem('all'); setFilterStatus('all'); setFilterFloor('all'); setSearchQuery(''); }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Equipment ID</th>
              <th>Asset Type</th>
              <th>System</th>
              <th>Floor</th>
              <th>Zone / Terminal</th>
              <th>Condition</th>
              <th>Health Index</th>
              <th>Mode</th>
              <th>Telemetry Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(eq => (
              <tr key={eq.id} onClick={() => onSelectEquipment(eq)}>
                <td className="eq-id font-mono text-teal font-bold">{eq.id}</td>
                <td>{eq.type}</td>
                <td>
                  <span className="font-mono text-xs text-teal font-semibold">{eq.system}</span>
                </td>
                <td>{eq.floor}</td>
                <td style={{ maxWidth: 200 }} className="truncate">{eq.zone}</td>
                <td>
                  <span className={`status-badge ${eq.status}`}>
                    <span className="status-dot-sm" />
                    {eq.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div className="health-bar-container" style={{ width: 45, height: 4 }}>
                      <div className={`health-bar ${eq.health >= 80 ? 'high' : eq.health >= 50 ? 'medium' : 'low'}`} style={{ width: `${eq.health}%` }} />
                    </div>
                    <span className="font-mono text-xs">{eq.health}%</span>
                  </div>
                </td>
                <td>
                  <span className="font-mono text-xs">{eq.mode}</span>
                </td>
                <td className="live-data-tick">{eq.lastUpdate}</td>
                <td>
                  <button 
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '2px 8px', fontSize: '11px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEquipment(eq);
                    }}
                  >
                    <Eye size={12} /> Inspect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--text-tertiary)' }}>
          No equipment matches your search query or filter criteria.
        </div>
      )}
    </div>
  );
}
