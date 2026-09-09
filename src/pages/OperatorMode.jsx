import React, { useState } from 'react';
import {
  AlertOctagon, AlertTriangle, CheckCircle2, Power, Sliders,
  RotateCcw, Wind, Thermometer, Zap, Activity
} from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';
import FloorMap from '../components/FloorMap';
import ModeSwitcherBar from '../components/ModeSwitcherBar';

export default function OperatorMode({ onSelectEquipment }) {
  const {
    equipmentList,
    alerts,
    acknowledgeAlert,
    toggleEquipmentPower,
    setEquipmentMode,
    adjustSetpoint
  } = useLiveData();

  const [selectedEqId, setSelectedEqId] = useState('AHU-310-GF-EXT1');

  const selectedEquipment = equipmentList.find(e => e.id === selectedEqId) || equipmentList[0];
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'high');

  const handleDeviceClick = (eq) => {
    setSelectedEqId(eq.id);
    onSelectEquipment?.(eq);
  };

  const isRunning = selectedEquipment.mode !== 'Stop' && selectedEquipment.status !== 'offline';

  return (
    <div className="page animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}>
      {/* Top Mode Bar */}
      <ModeSwitcherBar activeMode="operator" />

      {/* Operator Cockpit Header */}
      <div className="card" style={{
        padding: 'var(--s3) var(--s4)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="badge badge-operational" style={{ fontSize: 11, padding: '3px 8px' }}>
            OPERATOR COCKPIT
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-2)' }}>
            Active Duty: Long Thanh Terminal 1 • Shift A
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--red-bg)', border: '1px solid rgba(248,81,73,0.3)',
            padding: '3px 8px', borderRadius: 'var(--r-sm)', fontSize: 11, color: 'var(--red)', fontWeight: 600
          }}>
            <AlertOctagon size={13} />
            <span>{alerts.filter(a => a.severity === 'critical').length} CRITICAL</span>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--yellow-bg)', border: '1px solid rgba(210,153,34,0.3)',
            padding: '3px 8px', borderRadius: 'var(--r-sm)', fontSize: 11, color: 'var(--yellow)', fontWeight: 600
          }}>
            <AlertTriangle size={13} />
            <span>{alerts.filter(a => a.severity === 'high').length} HIGH ALERTS</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Floor Map, Right Critical Alarms */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: 'var(--s4)',
        alignItems: 'start'
      }}>
        {/* Left: Interactive Floor Map */}
        <div className="card" style={{ padding: 'var(--s4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--s3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>
                Terminal Floor Map & Equipment Placement
              </span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
              Click device node to target control loop
            </span>
          </div>

          <div style={{
            background: 'var(--bg-app)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-md)', overflow: 'hidden'
          }}>
            <FloorMap
              onSelectEquipment={handleDeviceClick}
              height="clamp(300px, 42vh, 480px)"
              showControls={true}
            />
          </div>
        </div>

        {/* Right: Critical Alarms Queue */}
        <div className="card" style={{ padding: 'var(--s4)', display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertOctagon size={15} style={{ color: 'var(--red)' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>
                Active Alarms Queue
              </span>
            </div>
            <span className="badge badge-critical">{criticalAlerts.length}</span>
          </div>

          <div style={{
            display: 'flex', flexDirection: 'column', gap: 8,
            maxHeight: 'calc(42vh + 40px)', overflowY: 'auto', paddingRight: 2
          }}>
            {criticalAlerts.map(alert => {
              const isSelected = selectedEquipment.id === alert.equipment;
              return (
                <div
                  key={alert.id}
                  onClick={() => {
                    const eq = equipmentList.find(e => e.id === alert.equipment);
                    if (eq) handleDeviceClick(eq);
                  }}
                  style={{
                    background: isSelected ? 'var(--bg-overlay)' : 'var(--bg-app)',
                    border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                    borderLeft: `3px solid ${alert.severity === 'critical' ? 'var(--red)' : 'var(--yellow)'}`,
                    borderRadius: 'var(--r-md)',
                    padding: 'var(--s3)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className={`badge ${alert.severity === 'critical' ? 'badge-critical' : 'badge-warning'}`} style={{ fontSize: 9 }}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: 'var(--accent)' }}>
                        {alert.equipment}
                      </span>
                    </div>
                    <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text-3)' }}>{alert.time}</span>
                  </div>

                  <div style={{ fontSize: 12, color: 'var(--text-1)', fontWeight: 500, marginBottom: 4 }}>
                    {alert.message}
                  </div>

                  <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 8 }}>
                    Location: {alert.location}
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    {!alert.acknowledged ? (
                      <button
                        className="btn btn-primary btn-xs"
                        style={{ flex: 1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          acknowledgeAlert(alert.id);
                        }}
                      >
                        ✓ Acknowledge
                      </button>
                    ) : (
                      <span style={{ fontSize: 11, color: 'var(--green)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle2 size={12} /> Acknowledged
                      </span>
                    )}
                    <button
                      className="btn btn-secondary btn-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        const eq = equipmentList.find(e => e.id === alert.equipment);
                        if (eq) handleDeviceClick(eq);
                      }}
                    >
                      Target Device
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom: Selected Device Console */}
      <div className="card" style={{ padding: 'var(--s4)' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingBottom: 'var(--s3)', borderBottom: '1px solid var(--border)',
          marginBottom: 'var(--s3)', flexWrap: 'wrap', gap: 8
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--accent)' }}>
              {selectedEquipment.id}
            </span>
            <span className={`badge ${selectedEquipment.status === 'operational' ? 'badge-operational' : 'badge-warning'}`}>
              {selectedEquipment.status.toUpperCase()}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
              {selectedEquipment.type} • {selectedEquipment.zone} • {selectedEquipment.floor}
            </span>
          </div>
          <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--green)' }}>
            SCADA BACNET REDUNDANT LINK: NOMINAL
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--s4)'
        }}>
          {/* Telemetry Metrics */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 8 }}>
              Live Telemetry Readouts
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {selectedEquipment.returnTemp !== null && (
                <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 8 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-3)' }}>Return Air</div>
                  <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--mono)', color: selectedEquipment.returnTemp > 26 ? 'var(--red)' : 'var(--text-1)' }}>
                    {selectedEquipment.returnTemp}°C
                  </div>
                </div>
              )}
              {selectedEquipment.supplyTemp !== null && (
                <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 8 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-3)' }}>Supply Air</div>
                  <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--accent)' }}>
                    {selectedEquipment.supplyTemp}°C
                  </div>
                </div>
              )}
              {selectedEquipment.fanRPM !== null && (
                <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 8 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-3)' }}>Fan RPM</div>
                  <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--text-1)' }}>
                    {selectedEquipment.fanRPM}
                  </div>
                </div>
              )}
              {selectedEquipment.coolingValve !== null && (
                <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 8 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-3)' }}>Cooling Valve</div>
                  <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--yellow)' }}>
                    {selectedEquipment.coolingValve}%
                  </div>
                </div>
              )}
              {selectedEquipment.power !== null && (
                <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 8 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-3)' }}>Active Power</div>
                  <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--text-1)' }}>
                    {selectedEquipment.power} kW
                  </div>
                </div>
              )}
              <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 8 }}>
                <div style={{ fontSize: 10, color: 'var(--text-3)' }}>Health Score</div>
                <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--mono)', color: selectedEquipment.health >= 80 ? 'var(--green)' : 'var(--red)' }}>
                  {selectedEquipment.health}%
                </div>
              </div>
            </div>
          </div>

          {/* Operator Commands */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 8 }}>
              Operator Dispatch Commands
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              <button
                className={`btn ${isRunning ? 'btn-danger' : 'btn-primary'}`}
                onClick={() => toggleEquipmentPower(selectedEquipment.id)}
              >
                <Power size={14} />
                {isRunning ? 'Emergency STOP' : 'Start Device'}
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setEquipmentMode(selectedEquipment.id, selectedEquipment.mode === 'Auto' ? 'Manual' : 'Auto')}
              >
                <Sliders size={14} />
                Mode: {selectedEquipment.mode}
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => alert(`Reset fault command sent to ${selectedEquipment.id}`)}
              >
                <RotateCcw size={14} />
                Reset Fault Latch
              </button>
            </div>

            {selectedEquipment.setpoint !== null && selectedEquipment.setpoint !== undefined && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 12px', background: 'var(--bg-app)', border: '1px solid var(--border)',
                borderRadius: 'var(--r-md)'
              }}>
                <span style={{ fontSize: 12, color: 'var(--text-2)' }}>
                  Setpoint: <strong style={{ color: 'var(--accent)', fontFamily: 'var(--mono)' }}>{selectedEquipment.setpoint}°C</strong>
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    className="btn btn-secondary btn-xs"
                    onClick={() => adjustSetpoint(selectedEquipment.id, -0.5)}
                  >
                    -0.5°C
                  </button>
                  <button
                    className="btn btn-secondary btn-xs"
                    onClick={() => adjustSetpoint(selectedEquipment.id, +0.5)}
                  >
                    +0.5°C
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
