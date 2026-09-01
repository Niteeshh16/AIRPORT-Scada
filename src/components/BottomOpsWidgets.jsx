import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Plus, ArrowRight, Activity, Wrench, Terminal, CheckCircle2, Clock } from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';
import { useNavigate } from 'react-router-dom';

export default function BottomOpsWidgets() {
  const { equipmentList, workOrders, scadaLogs } = useLiveData();
  const navigate = useNavigate();

  const operationalCount = equipmentList.filter(e => e.status === 'operational').length;
  const warningCount = equipmentList.filter(e => e.status === 'warning').length;
  const criticalCount = equipmentList.filter(e => e.status === 'critical').length;

  const pieData = [
    { name: 'Operational', value: operationalCount, color: '#22c997' },
    { name: 'Warning', value: warningCount, color: '#f5a623' },
    { name: 'Critical', value: criticalCount, color: '#ef4444' },
  ];

  return (
    <div className="bottom-ops-tri-grid">
      {/* Widget 1: COMPONENTS SUMMARY */}
      <div className="card bottom-ops-card">
        <div className="card-header flex justify-between items-center py-2 px-3">
          <span className="card-title text-xs font-mono font-bold uppercase flex items-center gap-2">
            <Activity size={14} className="text-teal" /> COMPONENTS
          </span>
          <span className="text-xs font-mono text-tertiary">34 / 34 OK</span>
        </div>

        <div className="card-body p-3">
          <div className="flex gap-3 items-center">
            {/* Donut Chart */}
            <div style={{ width: 80, height: 75 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={pieData} 
                    innerRadius={22} 
                    outerRadius={35} 
                    paddingAngle={3} 
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1a1e28', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Component Hierarchy List */}
            <div className="flex-1 text-xs">
              <div className="component-row">
                <span className="dot teal" />
                <span className="truncate">AHU Units — Terminal 1 (T1-A01-001)</span>
                <span className="font-mono ml-auto">3</span>
              </div>
              <div className="component-row">
                <span className="dot teal" />
                <span className="truncate">AHU Units — Terminal 2 (T2-A01-001)</span>
                <span className="font-mono ml-auto">2</span>
              </div>
              <div className="component-row">
                <span className="dot amber" />
                <span className="truncate">AHU Units — Pier B (B-A01-001)</span>
                <span className="font-mono ml-auto">1</span>
              </div>
              <div className="component-row">
                <span className="dot teal" />
                <span className="truncate">DDC Panels (P01-P43)</span>
                <span className="font-mono ml-auto">2</span>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-subtle flex justify-center">
            <button className="text-xs text-teal font-medium hover:underline flex items-center gap-1" onClick={() => navigate('/assets')}>
              View all (14) →
            </button>
          </div>
        </div>
      </div>

      {/* Widget 2: WORK ORDERS */}
      <div className="card bottom-ops-card">
        <div className="card-header flex justify-between items-center py-2 px-3">
          <span className="card-title text-xs font-mono font-bold uppercase flex items-center gap-2">
            <Wrench size={14} className="text-teal" /> WORK ORDERS
          </span>
          <button className="text-xs text-teal hover:underline" onClick={() => navigate('/work-orders')}>View all</button>
        </div>

        <div className="card-body p-3 flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            {workOrders.slice(0, 3).map(wo => (
              <div key={wo.id} className="bottom-wo-item" onClick={() => navigate('/work-orders')}>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-teal font-bold">{wo.id}</span>
                  <span className={`status-badge ${wo.priority}`} style={{ fontSize: '9px', padding: '1px 5px' }}>
                    {wo.status}
                  </span>
                </div>
                <div className="text-xs text-primary font-medium truncate mt-0.5">{wo.title}</div>
                <div className="text-2xs text-tertiary flex justify-between mt-0.5">
                  <span>Tech: {wo.assignee}</span>
                  <span className="text-amber">Due: {wo.due}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 pt-2 border-t border-subtle flex justify-center">
            <button className="btn btn-ghost btn-sm text-xs text-teal" onClick={() => navigate('/work-orders')}>
              <Plus size={12} /> + New Work Order
            </button>
          </div>
        </div>
      </div>

      {/* Widget 3: SYSTEM & EVENT LOGS */}
      <div className="card bottom-ops-card">
        <div className="card-header flex justify-between items-center py-2 px-3">
          <span className="card-title text-xs font-mono font-bold uppercase flex items-center gap-2">
            <Terminal size={14} className="text-teal" /> SYSTEM & EVENT LOGS
          </span>
          <span className="live-dot-badge" style={{ width: 6, height: 6 }} />
        </div>

        <div className="card-body p-3 font-mono text-2xs overflow-y-auto" style={{ maxHeight: 155 }}>
          {scadaLogs.slice(0, 5).map(log => (
            <div key={log.id} className="bottom-log-row">
              <span className={`log-dot ${log.level}`} />
              <span className="log-msg text-primary flex-1">{log.msg}</span>
              <span className="log-time text-tertiary">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
