import React, { useState } from 'react';
import { Plus, Clock, User, AlertTriangle, CheckCircle2, Circle, Wrench, X, Calendar, Zap } from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';

const PRIORITY_CFG = {
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' },
  high:     { color: '#f97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.3)' },
  medium:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  low:      { color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.3)' },
};

const STATUS_CFG = {
  'In Progress': { color: '#38bdf8', label: 'IN PROGRESS' },
  'Assigned':    { color: '#f59e0b', label: 'ASSIGNED' },
  'Scheduled':   { color: '#8b92a5', label: 'SCHEDULED' },
  'Completed':   { color: '#10b981', label: 'COMPLETED' },
};

export default function WorkOrders() {
  const { workOrders, createWorkOrder, equipmentList } = useLiveData();
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '', priority: 'high', equipment: 'AHU-310-GF-EXT1', assignee: 'Thanh Nguyen',
  });

  const filtered = filter === 'all' ? workOrders : workOrders.filter(w => w.priority === filter);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    createWorkOrder(formData);
    setFormData({ title: '', priority: 'high', equipment: 'AHU-310-GF-EXT1', assignee: 'Thanh Nguyen' });
    setShowModal(false);
  };

  const kpis = [
    { label: 'Total Active', value: workOrders.length, color: '#00d4aa', icon: Wrench },
    { label: 'Critical Priority', value: workOrders.filter(w => w.priority === 'critical').length, color: '#ef4444', icon: AlertTriangle },
    { label: 'In Progress', value: workOrders.filter(w => w.status === 'In Progress').length, color: '#38bdf8', icon: Circle },
    { label: 'Scheduled', value: workOrders.filter(w => w.status === 'Scheduled').length, color: '#f59e0b', icon: Calendar },
  ];

  return (
    <div className="animate-fadeIn" style={{ padding: 'var(--space-5)' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-5)', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 4, height: 28, background: 'linear-gradient(180deg, #00d4aa, #0ea5e9)', borderRadius: 2 }} />
            <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Work Orders & Maintenance Dispatch</h1>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: 0, paddingLeft: 14 }}>
            LTIA Terminal 1 · Corrective & Preventive Maintenance for Building Automation Assets
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 10,
            background: 'linear-gradient(135deg, #00d4aa, #0891b2)',
            border: 'none', color: 'white', fontWeight: 700, fontSize: 13,
            cursor: 'pointer', boxShadow: '0 0 16px rgba(0,212,170,0.3)',
          }}
        >
          <Plus size={15} /> New Work Order
        </button>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        {kpis.map(({ label, value, color, icon: Icon }) => (
          <div key={label} style={{
            padding: '20px', borderRadius: 12,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10, flexShrink: 0,
              background: `${color}18`, border: `1px solid ${color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={18} color={color} />
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, color, fontFamily: 'monospace', lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 'var(--space-4)' }}>
        {['all', 'critical', 'high', 'medium', 'low'].map(f => {
          const cfg = f !== 'all' ? PRIORITY_CFG[f] : null;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                textTransform: 'capitalize', cursor: 'pointer', letterSpacing: '0.04em',
                border: filter === f
                  ? `1px solid ${cfg ? cfg.color : '#00d4aa'}`
                  : '1px solid rgba(255,255,255,0.08)',
                background: filter === f
                  ? (cfg ? cfg.bg : 'rgba(0,212,170,0.12)')
                  : 'transparent',
                color: filter === f
                  ? (cfg ? cfg.color : '#00d4aa')
                  : 'rgba(255,255,255,0.4)',
                transition: 'all 0.15s',
              }}
            >
              {f === 'all' ? `All (${workOrders.length})` : `${f} (${workOrders.filter(w => w.priority === f).length})`}
            </button>
          );
        })}
      </div>

      {/* Work Orders Table */}
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12, overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {['WO ID', 'Description', 'Priority', 'Status', 'Assignee', 'Equipment', 'Issued', 'Due'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', background: 'rgba(0,0,0,0.2)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((wo, idx) => {
              const pc = PRIORITY_CFG[wo.priority] || PRIORITY_CFG.low;
              const sc = STATUS_CFG[wo.status] || STATUS_CFG['Assigned'];
              return (
                <tr
                  key={wo.id}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
                >
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 11, color: '#00d4aa', fontWeight: 700 }}>{wo.id}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: 500, maxWidth: 260 }}>{wo.title}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontSize: 9, padding: '3px 8px', borderRadius: 4, fontWeight: 800, letterSpacing: '0.06em',
                      background: pc.bg, color: pc.color, border: `1px solid ${pc.border}`,
                    }}>{wo.priority.toUpperCase()}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 10, display: 'flex', alignItems: 'center', gap: 5, color: sc.color }}>
                      <Circle size={7} fill={sc.color} stroke="none" />
                      {sc.label}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-secondary)' }}>
                      <User size={11} />
                      {wo.assignee}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 11, color: '#38bdf8' }}>{wo.equipment}</td>
                  <td style={{ padding: '12px 16px', fontSize: 11, color: 'var(--text-tertiary)' }}>{wo.created}</td>
                  <td style={{ padding: '12px 16px', fontSize: 11, color: wo.due === 'Today' ? '#f59e0b' : 'var(--text-secondary)', fontWeight: wo.due === 'Today' ? 700 : 400 }}>{wo.due}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* New WO Modal */}
      {showModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{ width: '100%', maxWidth: 480, background: '#0f1621', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: 28, boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Wrench size={16} color="#00d4aa" />
                </div>
                <h3 style={{ fontWeight: 800, fontSize: 15, color: 'white', margin: 0 }}>Issue New Work Order</h3>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Work Order Title / Issue Description', key: 'title', type: 'text', placeholder: 'e.g. Inspect AHU-310 fan bearing vibration...' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
                  <input
                    type={type} placeholder={placeholder} value={formData[key]} required
                    onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: 'white', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              ))}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Priority', key: 'priority', opts: ['critical','high','medium','low'] },
                  { label: 'Assignee', key: 'assignee', opts: ['Thanh Nguyen','Duc Pham','Huy Tran','Quang Vo','Minh Le'] },
                ].map(({ label, key, opts }) => (
                  <div key={key}>
                    <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
                    <select
                      value={formData[key]} onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: 'white', fontSize: 13, outline: 'none' }}
                    >
                      {opts.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: 8, background: 'linear-gradient(135deg, #00d4aa, #0891b2)', border: 'none', color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Dispatch Work Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
