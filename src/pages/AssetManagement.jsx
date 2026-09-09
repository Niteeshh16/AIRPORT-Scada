import React, { useState, useMemo } from 'react';
import { Search, Database, BarChart3, Layers, Filter, Cpu, Activity } from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';

const STATUS_CFG = {
  operational: { color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' },
  warning:     { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  critical:    { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' },
  offline:     { color: '#8b92a5', bg: 'rgba(139,146,165,0.1)', border: 'rgba(139,146,165,0.2)' },
};

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
    { label: 'Total Assets', value: equipmentList.length, color: '#00d4aa' },
    { label: 'Operational', value: equipmentList.filter(e => e.status === 'operational').length, color: '#10b981' },
    { label: 'Needs Attention', value: equipmentList.filter(e => e.status === 'warning' || e.status === 'critical').length, color: '#f59e0b' },
    { label: 'Asset Classes', value: new Set(equipmentList.map(e => e.type)).size, color: '#38bdf8' },
  ];

  return (
    <div className="animate-fadeIn" style={{ padding: 'var(--space-5)' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-5)', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 4, height: 28, background: 'linear-gradient(180deg, #38bdf8, #00d4aa)', borderRadius: 2 }} />
            <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Asset Registry & Lifecycle</h1>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: 0, paddingLeft: 14 }}>
            {airportInfo.name} · Complete building equipment inventory & real-time operational telemetry
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)', borderRadius: 10, padding: '8px 14px' }}>
          <Database size={14} color="#00d4aa" />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#00d4aa', fontFamily: 'monospace' }}>{equipmentList.length} Monitored Nodes</span>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        {kpis.map(({ label, value, color }) => (
          <div key={label} style={{ padding: '20px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: 'monospace', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, maxWidth: 380, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, padding: '8px 14px' }}>
          <Search size={14} color="rgba(255,255,255,0.3)" />
          <input
            placeholder="Search by ID, zone, type, subsystem..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: 13 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', alignSelf: 'center', marginRight: 4 }}>Group by:</span>
          {['system', 'floor', 'type', 'status'].map(g => (
            <button
              key={g}
              onClick={() => setGroupBy(g)}
              style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                cursor: 'pointer', textTransform: 'capitalize',
                border: groupBy === g ? '1px solid rgba(0,212,170,0.4)' : '1px solid rgba(255,255,255,0.08)',
                background: groupBy === g ? 'rgba(0,212,170,0.12)' : 'transparent',
                color: groupBy === g ? '#00d4aa' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.15s',
              }}
            >{g}</button>
          ))}
        </div>
      </div>

      {/* Grouped Asset Tables */}
      {groups.map(([group, items]) => (
        <div key={group} style={{ marginBottom: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 3, height: 18, background: 'linear-gradient(180deg, #00d4aa, #0ea5e9)', borderRadius: 2 }} />
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', margin: 0 }}>{group}</h3>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace' }}>{items.length} units</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Asset ID', 'Type', 'Location', 'Status', 'Health', 'Power', 'Protocol', 'Last Update'].map(h => (
                    <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', background: 'rgba(0,0,0,0.2)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((eq, idx) => {
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
                      <td style={{ padding: '10px 14px', color: 'var(--text-tertiary)', fontSize: 11 }}>{eq.zone} ({eq.floor})</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: sc.color, display: 'inline-block' }} />
                          {eq.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 44, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${eq.health}%`, background: healthColor, borderRadius: 2 }} />
                          </div>
                          <span style={{ fontFamily: 'monospace', fontSize: 11, color: healthColor }}>{eq.health}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: 11, color: 'var(--text-tertiary)' }}>{eq.power !== null ? `${eq.power} kW` : '—'}</td>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: 11, color: '#38bdf8' }}>{eq.comm}</td>
                      <td style={{ padding: '10px 14px', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{eq.lastUpdate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
