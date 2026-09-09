import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Eye, Cpu, Activity, Filter } from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';

const STATUS_CFG = {
  operational: { color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' },
  warning:     { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  critical:    { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' },
  offline:     { color: '#8b92a5', bg: 'rgba(139,146,165,0.1)', border: 'rgba(139,146,165,0.2)' },
};

const QUICK_FILTERS = [
  { label: 'Critical Faults', filter: { status: 'critical' } },
  { label: 'Warnings',        filter: { status: 'warning' } },
  { label: 'HVAC (LBMS)',     filter: { system: 'LBMS' } },
  { label: 'BHS',             filter: { system: 'BHS' } },
  { label: 'Offline',         filter: { status: 'offline' } },
];

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

  const applyQuickFilter = (f) => {
    setFilterSystem(f.system || 'all');
    setFilterStatus(f.status || 'all');
    setFilterFloor(f.floor || 'all');
    setSearchQuery('');
  };

  const counts = {
    operational: equipmentList.filter(e => e.status === 'operational').length,
    warning:     equipmentList.filter(e => e.status === 'warning').length,
    critical:    equipmentList.filter(e => e.status === 'critical').length,
    offline:     equipmentList.filter(e => e.status === 'offline').length,
  };

  return (
    <div className="animate-fadeIn" style={{ padding: 'var(--space-5)' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 4, height: 28, background: 'linear-gradient(180deg, #38bdf8, #a78bfa)', borderRadius: 2 }} />
            <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Equipment Explorer & Diagnostics</h1>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: 0, paddingLeft: 14 }}>
            LTIA Terminal 1 · Search, filter and inspect all {equipmentList.length} monitored industrial assets
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 10, padding: '8px 14px' }}>
          <Cpu size={14} color="#38bdf8" />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#38bdf8', fontFamily: 'monospace' }}>{filtered.length} / {equipmentList.length} in view</span>
        </div>
      </div>

      {/* Status Summary Pills */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
        {Object.entries(counts).map(([status, count]) => {
          const cfg = STATUS_CFG[status];
          const isActive = filterStatus === status;
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(isActive ? 'all' : status)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 16px', borderRadius: 10,
                background: isActive ? cfg.bg : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isActive ? cfg.border : 'rgba(255,255,255,0.07)'}`,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.color, display: 'inline-block' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, textTransform: 'uppercase' }}>{status}</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: cfg.color, fontFamily: 'monospace' }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: 240, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 8, padding: '8px 12px' }}>
            <Search size={13} color="rgba(255,255,255,0.3)" />
            <input
              placeholder="Search by ID, zone, type..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: 12 }}
            />
          </div>

          {/* Dropdowns */}
          {[
            { label: 'Subsystem', value: filterSystem, setter: setFilterSystem, opts: [{ v: 'all', l: 'All Subsystems' }, ...subsystems.map(s => ({ v: s.id, l: `${s.id} – ${s.name}` }))] },
            { label: 'Floor', value: filterFloor, setter: setFilterFloor, opts: [{ v: 'all', l: 'All Floors' }, ...floors.map(f => ({ v: f.id, l: f.name }))] },
            { label: 'Status', value: filterStatus, setter: setFilterStatus, opts: [{ v: 'all', l: 'All Status' }, { v: 'operational', l: 'Operational' }, { v: 'warning', l: 'Warning' }, { v: 'critical', l: 'Critical' }, { v: 'offline', l: 'Offline' }] },
          ].map(({ label, value, setter, opts }) => (
            <div key={label} style={{ minWidth: 150 }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
              <select
                value={value}
                onChange={e => setter(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 8, padding: '8px 10px', color: 'white', fontSize: 12, outline: 'none' }}
              >
                {opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>
          ))}
        </div>

        {/* Quick Filters */}
        <div style={{ marginTop: 10, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <SlidersHorizontal size={11} color="rgba(255,255,255,0.3)" />
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginRight: 4 }}>QUICK FILTERS:</span>
          {QUICK_FILTERS.map((sf, i) => (
            <button key={i} onClick={() => applyQuickFilter(sf.filter)} style={{ padding: '3px 10px', borderRadius: 6, fontSize: 10, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>{sf.label}</button>
          ))}
          <button onClick={() => { setFilterSystem('all'); setFilterStatus('all'); setFilterFloor('all'); setSearchQuery(''); }} style={{ padding: '3px 10px', borderRadius: 6, fontSize: 10, cursor: 'pointer', background: 'transparent', border: '1px dashed rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.35)' }}>Reset</button>
        </div>
      </div>

      {/* Equipment Table */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {['Equipment ID', 'Type', 'System', 'Floor', 'Zone', 'Status', 'Health', 'Mode', 'Last Update', ''].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', background: 'rgba(0,0,0,0.2)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((eq, idx) => {
              const sc = STATUS_CFG[eq.status] || STATUS_CFG.offline;
              const healthColor = eq.health >= 80 ? '#10b981' : eq.health >= 50 ? '#f59e0b' : '#ef4444';
              return (
                <tr
                  key={eq.id}
                  onClick={() => onSelectEquipment(eq)}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: 11, color: '#00d4aa', fontWeight: 700 }}>{eq.id}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{eq.type}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, color: '#38bdf8', background: 'rgba(56,189,248,0.1)', padding: '2px 6px', borderRadius: 4 }}>{eq.system}</span>
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>{eq.floor}</td>
                  <td style={{ padding: '10px 14px', fontSize: 11, color: 'var(--text-tertiary)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{eq.zone}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 700, padding: '3px 7px', borderRadius: 4, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: sc.color }} />
                      {eq.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${eq.health}%`, background: healthColor, borderRadius: 2 }} />
                      </div>
                      <span style={{ fontFamily: 'monospace', fontSize: 11, color: healthColor }}>{eq.health}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{eq.mode}</td>
                  <td style={{ padding: '10px 14px', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{eq.lastUpdate}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <button
                      onClick={e => { e.stopPropagation(); onSelectEquipment(eq); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, fontSize: 10, background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.25)', color: '#38bdf8', cursor: 'pointer' }}
                    >
                      <Eye size={10} /> Inspect
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>
            No equipment matches your filters. Try adjusting your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}
