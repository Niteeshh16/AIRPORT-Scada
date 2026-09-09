import React, { useState } from 'react';
import {
  Plus, Clock, User, AlertTriangle, CheckCircle2,
  Circle, Wrench, X, Calendar, Zap, AlertOctagon
} from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';

const STATUS_CONFIG = {
  'In Progress': { badge: 'badge-warning', label: 'IN PROGRESS' },
  'Assigned':    { badge: 'badge-operational', label: 'ASSIGNED' },
  'Scheduled':   { badge: 'badge-offline', label: 'SCHEDULED' },
  'Completed':   { badge: 'badge-operational', label: 'COMPLETED' },
};

export default function WorkOrders() {
  const { workOrders, createWorkOrder } = useLiveData();
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
    { label: 'Total Active Orders', value: workOrders.length, color: 'blue', icon: Wrench },
    { label: 'Critical Priority', value: workOrders.filter(w => w.priority === 'critical').length, color: 'red', icon: AlertOctagon },
    { label: 'In Progress Dispatch', value: workOrders.filter(w => w.status === 'In Progress').length, color: 'yellow', icon: Circle },
    { label: 'Scheduled Maintenance', value: workOrders.filter(w => w.status === 'Scheduled').length, color: 'green', icon: Calendar },
  ];

  return (
    <div className="page animate-fadeIn">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Work Orders & Corrective Dispatch</h1>
          <p className="page-subtitle">
            Long Thanh International Airport (LTIA) • Maintenance ticketing for building automation and electrical field devices
          </p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <Plus size={14} /> New Work Order
          </button>
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

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 'var(--s4)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--s3)' }}>
        {['all', 'critical', 'high', 'medium', 'low'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: 12, textTransform: 'capitalize' }}
          >
            {f === 'all' ? `All Orders (${workOrders.length})` : `${f} (${workOrders.filter(w => w.priority === f).length})`}
          </button>
        ))}
      </div>

      {/* Work Orders Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>WO ID</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assignee</th>
                <th>Target Equipment</th>
                <th>Issued</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(wo => {
                const priorityBadge =
                  wo.priority === 'critical' ? 'badge-critical' :
                  wo.priority === 'high' ? 'badge-warning' :
                  wo.priority === 'medium' ? 'badge-warning' : 'badge-operational';

                const statusInfo = STATUS_CONFIG[wo.status] || { badge: 'badge-offline', label: wo.status };

                return (
                  <tr key={wo.id}>
                    <td style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--accent)' }}>
                      {wo.id}
                    </td>
                    <td style={{ fontWeight: 500, color: 'var(--text-1)', maxWidth: 300 }}>
                      {wo.title}
                    </td>
                    <td>
                      <span className={`badge ${priorityBadge}`}>
                        {wo.priority.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${statusInfo.badge}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--text-2)' }}>
                        <User size={12} style={{ color: 'var(--text-3)' }} />
                        {wo.assignee}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--mono)', color: 'var(--accent)' }}>
                      {wo.equipment}
                    </td>
                    <td style={{ color: 'var(--text-3)', fontFamily: 'var(--mono)', fontSize: 11 }}>
                      {wo.created}
                    </td>
                    <td style={{
                      fontWeight: wo.due === 'Today' ? 700 : 400,
                      color: wo.due === 'Today' ? 'var(--yellow)' : 'var(--text-2)'
                    }}>
                      {wo.due}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New WO Modal */}
      {showModal && (
        <div className="scada-modal-overlay animate-fadeIn" onClick={() => setShowModal(false)}>
          <div className="scada-modal-dialog alert-inspector-dialog" onClick={e => e.stopPropagation()}>
            <div className="scada-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Wrench size={16} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>
                  Issue New Corrective Work Order
                </span>
              </div>
              <button className="scada-modal-close-btn" onClick={() => setShowModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ padding: 'var(--s5)', display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
                  Issue Title & Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Inspect AHU-310 fan bearing vibration and check belt tension..."
                  value={formData.title}
                  required
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
                    Priority
                  </label>
                  <select
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
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
                    Assigned Technician
                  </label>
                  <select
                    value={formData.assignee}
                    onChange={e => setFormData({ ...formData, assignee: e.target.value })}
                  >
                    <option value="Thanh Nguyen">Thanh Nguyen (Lead Tech)</option>
                    <option value="Duc Pham">Duc Pham (HVAC)</option>
                    <option value="Huy Tran">Huy Tran (Electrical)</option>
                    <option value="Quang Vo">Quang Vo (Fire/Plumbing)</option>
                    <option value="Minh Le">Minh Le (SOC Operator)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
                  Target Equipment Node
                </label>
                <input
                  type="text"
                  value={formData.equipment}
                  onChange={e => setFormData({ ...formData, equipment: e.target.value })}
                  placeholder="Equipment ID (e.g. AHU-310-GF-EXT1)"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Dispatch Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
