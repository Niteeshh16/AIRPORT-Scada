import React, { useState } from 'react';
import { Plus, Clock, User, AlertTriangle, CheckCircle2, Circle, Wrench, X } from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';

export default function WorkOrders() {
  const { workOrders, createWorkOrder, equipmentList } = useLiveData();
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    priority: 'high',
    equipment: 'AHU-310-GF-EXT1',
    assignee: 'Thanh Nguyen',
  });

  const filtered = filter === 'all' ? workOrders : workOrders.filter(w => w.priority === filter);

  const statusIcon = (status) => {
    if (status === 'In Progress') return <Circle size={10} fill="var(--status-info)" stroke="none" />;
    if (status === 'Assigned') return <Circle size={10} fill="var(--status-warning)" stroke="none" />;
    if (status === 'Scheduled') return <Circle size={10} fill="var(--text-tertiary)" stroke="none" />;
    return <CheckCircle2 size={10} className="text-teal" />;
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    createWorkOrder(formData);
    setFormData({ title: '', priority: 'high', equipment: 'AHU-310-GF-EXT1', assignee: 'Thanh Nguyen' });
    setShowModal(false);
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Work Orders & Maintenance Dispatch</h1>
          <p className="page-subtitle">Long Thanh Terminal 1 • Corrective & Preventive Work Orders for Building Automation Assets</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={14} /> New Work Order
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        {[
          { label: 'Total Active Orders', count: workOrders.length, color: null },
          { label: 'Critical Priority', count: workOrders.filter(w => w.priority === 'critical').length, color: 'critical' },
          { label: 'In Progress (Field)', count: workOrders.filter(w => w.status === 'In Progress').length, color: 'info' },
          { label: 'Scheduled Maintenance', count: workOrders.filter(w => w.status === 'Scheduled').length, color: null },
        ].map((item, idx) => (
          <div key={idx} className="card" style={{ padding: 'var(--space-4)' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
              {item.label}
            </div>
            <div style={{ 
              fontSize: 'var(--text-2xl)', fontWeight: 700, fontFamily: 'var(--font-mono)',
              color: item.color === 'critical' ? 'var(--status-critical)' : item.color === 'info' ? 'var(--status-info)' : 'var(--text-primary)'
            }}>
              {item.count}
            </div>
          </div>
        ))}
      </div>

      {/* Priority Filters */}
      <div className="filter-chips" style={{ marginBottom: 'var(--space-4)' }}>
        {['all', 'critical', 'high', 'medium', 'low'].map(f => (
          <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? `All Orders (${workOrders.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} Priority`}
          </button>
        ))}
      </div>

      {/* Work Orders Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Work Order ID</th>
              <th>Task Description</th>
              <th>Priority</th>
              <th>Field Status</th>
              <th>Assigned Technician</th>
              <th>Target Equipment</th>
              <th>Issued</th>
              <th>SLA Due</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(wo => (
              <tr key={wo.id}>
                <td className="eq-id font-mono text-teal font-bold">{wo.id}</td>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{wo.title}</td>
                <td>
                  <span className={`status-badge ${wo.priority}`}>
                    {wo.priority.toUpperCase()}
                  </span>
                </td>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)' }}>
                    {statusIcon(wo.status)} {wo.status}
                  </span>
                </td>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)' }}>
                    <User size={12} className="text-secondary" /> {wo.assignee}
                  </span>
                </td>
                <td className="font-mono text-teal text-xs">{wo.equipment}</td>
                <td style={{ color: 'var(--text-tertiary)' }}>{wo.created}</td>
                <td style={{ 
                  color: wo.due === 'Today' ? 'var(--status-warning)' : 'var(--text-secondary)',
                  fontWeight: wo.due === 'Today' ? 600 : 400
                }}>
                  {wo.due}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for creating a new work order */}
      {showModal && (
        <div className="inspection-panel-overlay open" onClick={() => setShowModal(false)}>
          <div className="card p-6" style={{ maxWidth: 480, margin: '100px auto', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Wrench size={16} className="text-teal" /> Issue New Work Order
              </h3>
              <button className="inspection-close" onClick={() => setShowModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="mb-3">
                <label className="text-xs text-tertiary block mb-1">Work Order Title / Issue</label>
                <input 
                  className="search-input w-full"
                  placeholder="e.g. Inspect AHU-310 fan bearing vibration..."
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-tertiary block mb-1">Priority</label>
                  <select 
                    className="search-input w-full"
                    value={formData.priority}
                    onChange={e => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-tertiary block mb-1">Target Equipment</label>
                  <select 
                    className="search-input w-full"
                    value={formData.equipment}
                    onChange={e => setFormData({ ...formData, equipment: e.target.value })}
                  >
                    {equipmentList.map(e => <option key={e.id} value={e.id}>{e.id} ({e.type})</option>)}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs text-tertiary block mb-1">Assigned Field Engineer</label>
                <select 
                  className="search-input w-full"
                  value={formData.assignee}
                  onChange={e => setFormData({ ...formData, assignee: e.target.value })}
                >
                  <option value="Thanh Nguyen">Thanh Nguyen (HVAC Lead)</option>
                  <option value="Duc Pham">Duc Pham (BHS Tech)</option>
                  <option value="Huy Tran">Huy Tran (Security Tech)</option>
                  <option value="Quang Vo">Quang Vo (Chiller Engineer)</option>
                  <option value="Minh Le">Minh Le (Fire Safety)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Dispatch Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
