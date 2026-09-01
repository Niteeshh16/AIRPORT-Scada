import React, { useState, useEffect } from 'react';
import { 
  X, AlertTriangle, Activity, Gauge, Zap, Wrench, Clock, 
  ThermometerSun, Wind, Fan, BarChart3, ArrowUpRight, Power, 
  Sliders, RotateCcw, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';
import { ResponsiveContainer, Area, AreaChart } from 'recharts';
import SCADASchematic from './SCADASchematic';

export default function InspectionPanel({ equipment, onClose }) {
  const { 
    equipmentList, 
    alerts, 
    workOrders, 
    toggleEquipmentPower, 
    setEquipmentMode, 
    adjustSetpoint, 
    acknowledgeAlert,
    createWorkOrder 
  } = useLiveData();

  const [sparkData, setSparkData] = useState([]);
  const [woSuccessMsg, setWoSuccessMsg] = useState(null);

  // Synchronize with latest live equipment state
  const liveEq = equipmentList.find(e => e.id === equipment?.id) || equipment;

  // Initialize and update dynamic sparkline data
  useEffect(() => {
    if (liveEq) {
      const baseVal = liveEq._temp || liveEq.temp || 24;
      const initialData = Array.from({ length: 25 }, (_, i) => ({
        v: +(baseVal + Math.sin(i / 3) * 1.5 + (Math.random() - 0.5) * 0.8).toFixed(1)
      }));
      setSparkData(initialData);
    }
  }, [liveEq?.id]);

  // Update sparkline on live metric fluctuations
  useEffect(() => {
    if (liveEq && sparkData.length > 0) {
      setSparkData(prev => {
        const lastVal = liveEq.temp !== null ? liveEq.temp : prev[prev.length - 1].v;
        return [...prev.slice(1), { v: +(lastVal + (Math.random() - 0.5) * 0.3).toFixed(1) }];
      });
    }
  }, [liveEq?.temp]);

  if (!equipment || !liveEq) return null;

  const relatedAlerts = alerts.filter(a => a.equipment === liveEq.id);
  const relatedWOs = workOrders.filter(w => w.equipment === liveEq.id);
  const isRunning = liveEq.mode !== 'Stop' && liveEq.status !== 'offline';

  const statusClass = liveEq.status === 'critical' ? 'critical' : 
                      liveEq.status === 'warning' ? 'warning' : 
                      liveEq.status === 'offline' ? 'offline' : 'operational';

  const handleCreateQuickWO = () => {
    createWorkOrder({
      title: `Emergency inspection for ${liveEq.id}`,
      priority: liveEq.status === 'critical' ? 'critical' : 'high',
      equipment: liveEq.id,
      assignee: 'Thanh Nguyen',
    });
    setWoSuccessMsg('Work order dispatched to field technician');
    setTimeout(() => setWoSuccessMsg(null), 3000);
  };

  return (
    <>
      <div 
        className={`inspection-panel-overlay ${equipment ? 'open' : ''}`}
        onClick={onClose}
      />
      <div className={`inspection-panel ${equipment ? 'open' : ''}`}>
        {/* Header */}
        <div className="inspection-header">
          <div>
            <div className="inspection-title">{liveEq.id}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <span className={`status-badge ${statusClass}`}>
                <span className="status-dot-sm" />
                {liveEq.status === 'critical' ? 'CRITICAL FAULT' : 
                 liveEq.status === 'warning' ? 'WARNING' :
                 liveEq.status === 'offline' ? 'OFFLINE' : 'OPERATIONAL'}
              </span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                {liveEq.type} • {liveEq.floor}
              </span>
            </div>
          </div>
          <button className="inspection-close" onClick={onClose} title="Close (Esc)">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="inspection-body">
          {/* Engineering Visual Schematic Diagram */}
          <div className="mb-4">
            <SCADASchematic equipment={liveEq} />
          </div>

          {/* Quick Operator Commands */}
          <div className="inspection-section">
            <div className="inspection-section-title">COMMAND & CONTROL</div>
            <div className="flex gap-2 flex-wrap mb-3">
              <button 
                className={`btn btn-sm ${isRunning ? 'btn-danger' : 'btn-primary'}`}
                onClick={() => toggleEquipmentPower(liveEq.id)}
              >
                <Power size={13} /> {isRunning ? 'Command STOP' : 'Command RUN'}
              </button>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setEquipmentMode(liveEq.id, liveEq.mode === 'Auto' ? 'Manual' : 'Auto')}
              >
                <Sliders size={13} /> Mode: {liveEq.mode}
              </button>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => alert(`Reset fault signal sent to ${liveEq.id}`)}
              >
                <RotateCcw size={13} /> Reset Latches
              </button>
            </div>

            {/* Setpoint control if available */}
            {liveEq.setpoint !== null && (
              <div className="metric-row" style={{ padding: '6px 0' }}>
                <span className="metric-label">Setpoint Target</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-teal">{liveEq.setpoint}°C</span>
                  <button className="btn btn-secondary btn-sm" style={{ padding: '1px 6px', fontSize: '10px' }} onClick={() => adjustSetpoint(liveEq.id, -0.5)}>-</button>
                  <button className="btn btn-secondary btn-sm" style={{ padding: '1px 6px', fontSize: '10px' }} onClick={() => adjustSetpoint(liveEq.id, +0.5)}>+</button>
                </div>
              </div>
            )}
          </div>

          {/* Equipment Status */}
          <div className="inspection-section">
            <div className="inspection-section-title">EQUIPMENT STATUS</div>
            <div className="metric-row">
              <span className="metric-label">Operating State</span>
              <span className="metric-value font-mono" style={{ color: isRunning ? 'var(--status-operational)' : 'var(--status-critical)' }}>
                {isRunning ? '▶ RUNNING' : '■ STOPPED'}
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Control Mode</span>
              <span className="metric-value font-mono">{liveEq.mode}</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Bus Communication</span>
              <span className="metric-value font-mono" style={{ color: liveEq.comm === 'Online' ? 'var(--status-operational)' : 'var(--status-critical)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="live-dot-badge" style={{ width: 6, height: 6, background: liveEq.comm === 'Online' ? 'var(--status-operational)' : 'var(--status-critical)' }} />
                {liveEq.comm}
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Health Score</span>
              <span className="metric-value font-mono" style={{ color: liveEq.health >= 80 ? 'var(--status-operational)' : liveEq.health >= 50 ? 'var(--status-warning)' : 'var(--status-critical)' }}>
                {liveEq.health}%
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Airport Location</span>
              <span className="metric-value font-mono text-xs">{liveEq.zone}</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Last Telemetry Packet</span>
              <span className="metric-value live-data-tick">{liveEq.lastUpdate}</span>
            </div>
          </div>

          {/* Live Metrics */}
          {(liveEq.temp !== null || liveEq.power !== null) && (
            <div className="inspection-section">
              <div className="inspection-section-title flex items-center justify-between">
                <span>LIVE SENSOR SIGNALS</span>
                <span className="live-dot-badge" style={{ width: 6, height: 6 }} />
              </div>
              
              {liveEq.returnTemp !== null && (
                <div className="metric-row">
                  <span className="metric-label flex items-center gap-1">
                    <ThermometerSun size={13} className="text-secondary" /> Return Air Temp
                  </span>
                  <span className="metric-value font-mono" style={{ color: liveEq.returnTemp > 26 ? 'var(--status-critical)' : 'var(--text-primary)' }}>
                    {liveEq.returnTemp}°C
                    {liveEq.returnTemp > 26 && <ArrowUpRight size={12} className="text-red inline ml-1" />}
                  </span>
                </div>
              )}
              {liveEq.supplyTemp !== null && (
                <div className="metric-row">
                  <span className="metric-label flex items-center gap-1">
                    <ThermometerSun size={13} className="text-secondary" /> Supply Air Temp
                  </span>
                  <span className="metric-value font-mono text-teal">{liveEq.supplyTemp}°C</span>
                </div>
              )}
              {liveEq.fanRPM !== null && (
                <div className="metric-row">
                  <span className="metric-label flex items-center gap-1">
                    <Fan size={13} className="text-secondary" /> Fan Speed
                  </span>
                  <span className="metric-value font-mono">{liveEq.fanRPM} RPM</span>
                </div>
              )}
              {liveEq.airPressure !== null && (
                <div className="metric-row">
                  <span className="metric-label flex items-center gap-1">
                    <Wind size={13} className="text-secondary" /> Static Pressure
                  </span>
                  <span className="metric-value font-mono">{liveEq.airPressure} Pa</span>
                </div>
              )}
              {liveEq.coolingValve !== null && (
                <div className="metric-row">
                  <span className="metric-label flex items-center gap-1">
                    <Gauge size={13} className="text-secondary" /> Cooling Valve Modulation
                  </span>
                  <span className="metric-value font-mono text-teal">{liveEq.coolingValve}%</span>
                </div>
              )}
              {liveEq.power !== null && (
                <div className="metric-row">
                  <span className="metric-label flex items-center gap-1">
                    <Zap size={13} className="text-secondary" /> Power Demand
                  </span>
                  <span className="metric-value font-mono">{liveEq.power} kW</span>
                </div>
              )}
            </div>
          )}

          {/* Trend Sparkline */}
          {sparkData.length > 0 && liveEq.temp !== null && (
            <div className="inspection-section">
              <div className="inspection-section-title">24-HOUR TELEMETRY SPARKLINE</div>
              <div style={{ height: 85, marginBottom: 'var(--space-2)' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparkData}>
                    <defs>
                      <linearGradient id="inspSpark" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c997" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22c997" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="v" 
                      stroke="#22c997" 
                      strokeWidth={1.5} 
                      fill="url(#inspSpark)"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Active Alarms */}
          {relatedAlerts.length > 0 && (
            <div className="inspection-section">
              <div className="inspection-section-title">ACTIVE ALARMS ({relatedAlerts.length})</div>
              {relatedAlerts.map(alert => (
                <div key={alert.id} className={`alert-item ${alert.severity}`} style={{ marginBottom: '6px' }}>
                  <div className={`alert-severity-icon ${alert.severity}`}>
                    <AlertTriangle size={14} />
                  </div>
                  <div className="alert-content">
                    <div className="alert-title font-semibold text-xs">{alert.message}</div>
                    <div className="alert-meta text-xs">
                      <span>{alert.time}</span>
                      {alert.acknowledged ? (
                        <span className="text-teal font-mono">✓ Ack ({alert.assignee})</span>
                      ) : (
                        <button 
                          className="btn btn-primary btn-sm" 
                          style={{ padding: '1px 6px', fontSize: '9px' }}
                          onClick={() => acknowledgeAlert(alert.id)}
                        >
                          Ack
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Related Work Orders */}
          {relatedWOs.length > 0 && (
            <div className="inspection-section">
              <div className="inspection-section-title">LINKED WORK ORDERS ({relatedWOs.length})</div>
              {relatedWOs.map(wo => (
                <div key={wo.id} className="work-order-card">
                  <div className="flex justify-between items-center">
                    <span className="work-order-id">{wo.id}</span>
                    <span className={`status-badge ${wo.priority}`}>{wo.priority}</span>
                  </div>
                  <div className="work-order-title text-xs mt-1 font-semibold">{wo.title}</div>
                  <div className="work-order-meta text-xs">
                    <span>{wo.status}</span>
                    <span>→ {wo.assignee}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Button & Work Order Dispatch */}
          <div className="inspection-section">
            {woSuccessMsg && (
              <div className="mb-2 p-2 rounded text-xs bg-emerald-950 text-teal border border-teal flex items-center gap-2">
                <CheckCircle2 size={13} /> {woSuccessMsg}
              </div>
            )}
            <div className="flex gap-2">
              <button className="btn btn-primary btn-sm flex-1" onClick={handleCreateQuickWO}>
                <Wrench size={13} /> Dispatch Work Order
              </button>
              <button className="btn btn-secondary btn-sm" onClick={onClose}>
                Close Panel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
