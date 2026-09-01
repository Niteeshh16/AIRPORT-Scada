import React, { useState } from 'react';
import { 
  AlertTriangle, Radio, Activity, Wrench, ChevronRight, ChevronLeft, 
  CheckCircle2, Wifi, ArrowRight, ShieldCheck, Terminal, Server
} from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';
import { useNavigate } from 'react-router-dom';

export default function OpsPanel() {
  const { 
    opsPanelOpen, 
    setOpsPanelOpen, 
    alerts, 
    workOrders, 
    scadaMetrics, 
    scadaLogs, 
    acknowledgeAlert 
  } = useLiveData();

  const [activeTab, setActiveTab] = useState('alerts'); // 'alerts' | 'events' | 'orders' | 'comms'
  const navigate = useNavigate();

  const recentAlerts = alerts.slice(0, 5);

  return (
    <aside className={`ops-panel ${!opsPanelOpen ? 'collapsed' : ''}`}>
      <div className="ops-panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="live-dot-badge" />
          <span className="ops-panel-title font-mono">SCADA OPS DESK</span>
        </div>
        <button 
          className="header-icon-btn" 
          style={{ width: 28, height: 28 }}
          onClick={() => setOpsPanelOpen(!opsPanelOpen)}
          title={opsPanelOpen ? 'Collapse Ops Panel' : 'Expand Ops Panel'}
        >
          {opsPanelOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {opsPanelOpen && (
        <>
          {/* Quick Sub-navigation tabs */}
          <div className="ops-tabs">
            <button 
              className={`ops-tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
              onClick={() => setActiveTab('alerts')}
            >
              Alerts ({alerts.filter(a => !a.acknowledged).length})
            </button>
            <button 
              className={`ops-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              Live Feed
            </button>
            <button 
              className={`ops-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              Work Orders
            </button>
            <button 
              className={`ops-tab-btn ${activeTab === 'comms' ? 'active' : ''}`}
              onClick={() => setActiveTab('comms')}
            >
              Networks
            </button>
          </div>

          <div className="ops-panel-body">
            {/* TAB 1: RECENT ALERTS */}
            {activeTab === 'alerts' && (
              <div className="ops-panel-section">
                <div className="ops-panel-section-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>CRITICAL & HIGH ALARMS</span>
                  <span className="text-teal font-mono">{alerts.length} Active</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {recentAlerts.map(alert => (
                    <div key={alert.id} className={`alert-item ${alert.severity}`} style={{ padding: '8px 10px' }}>
                      <div className="alert-content">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span className={`status-badge ${alert.severity}`} style={{ fontSize: '9px', padding: '1px 5px' }}>
                            {alert.severity.toUpperCase()}
                          </span>
                          <span className="text-tertiary" style={{ fontSize: '10px' }}>{alert.time}</span>
                        </div>
                        <div className="alert-title" style={{ fontSize: '11px', marginTop: '4px', lineHeight: 1.3 }}>
                          {alert.message}
                        </div>
                        <div className="alert-meta" style={{ marginTop: '4px', fontSize: '10px' }}>
                          <span className="font-mono text-teal">{alert.equipment}</span>
                        </div>

                        {!alert.acknowledged ? (
                          <div style={{ marginTop: '6px', display: 'flex', gap: '6px' }}>
                            <button 
                              className="btn btn-primary btn-sm" 
                              style={{ padding: '2px 8px', fontSize: '10px', width: '100%', justifyContent: 'center' }}
                              onClick={() => acknowledgeAlert(alert.id)}
                            >
                              ✓ Acknowledge
                            </button>
                          </div>
                        ) : (
                          <div style={{ marginTop: '4px', fontSize: '10px', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={11} /> Acknowledged
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  className="btn btn-ghost btn-sm w-full mt-3" 
                  style={{ justifyContent: 'center', width: '100%', fontSize: '11px' }}
                  onClick={() => navigate('/alerts')}
                >
                  View All {alerts.length} Alerts <ArrowRight size={12} />
                </button>
              </div>
            )}

            {/* TAB 2: LIVE SCADA STREAM EVENT FEED */}
            {activeTab === 'events' && (
              <div className="ops-panel-section">
                <div className="ops-panel-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>TELEMETRY STREAM</span>
                  <span className="live-data-tick text-teal" style={{ fontSize: '9px' }}>STREAMING</span>
                </div>

                <div className="scada-log-terminal">
                  {scadaLogs.map(log => (
                    <div key={log.id} className="scada-log-line">
                      <span className="log-time font-mono">{log.time}</span>
                      <span className={`log-protocol ${log.level}`}>{log.protocol}</span>
                      <span className="log-device font-mono">{log.device}:</span>
                      <span className="log-msg">{log.msg}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: WORK ORDERS */}
            {activeTab === 'orders' && (
              <div className="ops-panel-section">
                <div className="ops-panel-section-title">
                  <span>DISPATCHED WORK ORDERS</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {workOrders.map(wo => (
                    <div key={wo.id} className="work-order-card" style={{ padding: '8px 10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="work-order-id">{wo.id}</span>
                        <span className={`status-badge ${wo.priority}`} style={{ fontSize: '9px', padding: '1px 5px' }}>
                          {wo.priority}
                        </span>
                      </div>
                      <div className="work-order-title" style={{ fontSize: '11px', marginTop: '2px' }}>{wo.title}</div>
                      <div className="work-order-meta" style={{ fontSize: '10px', marginTop: '4px' }}>
                        <span>→ {wo.assignee}</span>
                        <span className="font-mono">{wo.equipment}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  className="btn btn-ghost btn-sm w-full mt-3" 
                  style={{ justifyContent: 'center', width: '100%', fontSize: '11px' }}
                  onClick={() => navigate('/work-orders')}
                >
                  Manage Work Orders <ArrowRight size={12} />
                </button>
              </div>
            )}

            {/* TAB 4: PROTOCOLS & NETWORK HEALTH */}
            {activeTab === 'comms' && (
              <div className="ops-panel-section">
                <div className="ops-panel-section-title">
                  <span>SCADA PROTOCOLS & BUS HEALTH</span>
                </div>

                <div className="comm-status-card">
                  <div className="comm-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Server size={13} className="text-teal" />
                      <span className="comm-protocol-name">BACnet / IP Gateway</span>
                    </div>
                    <span className="font-mono text-teal">{scadaMetrics.latency} ms</span>
                  </div>
                  <div className="comm-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Activity size={13} className="text-teal" />
                      <span className="comm-protocol-name">Modbus TCP PLC Bus</span>
                    </div>
                    <span className="font-mono text-teal">{scadaMetrics.modbusLatency} ms</span>
                  </div>
                  <div className="comm-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Radio size={13} className="text-teal" />
                      <span className="comm-protocol-name">OPC-UA Central Hub</span>
                    </div>
                    <span className="font-mono text-teal">{scadaMetrics.opcLatency} ms</span>
                  </div>
                  <div className="comm-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Wifi size={13} className="text-teal" />
                      <span className="comm-protocol-name">MQTT IoT Stand Broker</span>
                    </div>
                    <span className="font-mono text-teal">{scadaMetrics.mqttLatency} ms</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="metric-row">
                    <span className="metric-label">Packet Throughput</span>
                    <span className="metric-value text-teal font-mono">{scadaMetrics.packetRate} pkts/sec</span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">Nodes Connected</span>
                    <span className="metric-value font-mono">{scadaMetrics.onlineNodes} / {scadaMetrics.activeNodes}</span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">Buffer Capacity</span>
                    <span className="metric-value font-mono">{scadaMetrics.bufferUsage}%</span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">Sync Cycle</span>
                    <span className="metric-value font-mono text-secondary">{scadaMetrics.lastSync}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  );
}
