import React, { useState } from 'react';
import { 
  AlertOctagon, AlertTriangle, CheckCircle2, Zap, Power, Sliders, 
  RotateCcw, ShieldAlert, ArrowUpRight, ArrowDownRight, Wind, Thermometer
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
    <div className="operator-mode-layout animate-fadeIn">
      {/* Top Mode Switcher matching Screenshot 2 */}
      <div style={{ marginBottom: '10px' }}>
        <ModeSwitcherBar activeMode="operator" />
      </div>

      {/* Top Banner: Immediate Action Needed */}
      <div className="operator-banner">
        <div className="operator-banner-left">
          <span className="operator-badge">OPERATOR COCKPIT</span>
          <span className="operator-sub">Active Duty: Long Thanh Terminal 1 • Shift A</span>
        </div>
        <div className="operator-banner-right">
          <div className="op-alert-chip critical">
            <AlertOctagon size={14} />
            <span>{alerts.filter(a => a.severity === 'critical').length} CRITICAL INCIDENTS</span>
          </div>
          <div className="op-alert-chip warning">
            <AlertTriangle size={14} />
            <span>{alerts.filter(a => a.severity === 'high').length} HIGH ALERTS</span>
          </div>
        </div>
      </div>

      {/* Main Grid: LEFT Floor Map, RIGHT Critical Alerts */}
      <div className="operator-main-grid">
        {/* Left: Floor Map */}
        <div className="operator-map-container">
          <div className="section-title-bar">
            <div className="flex items-center gap-2">
              <div className="live-dot-badge" />
              <span className="font-semibold text-sm">WHERE IS THE FAULT? — TERMINAL FLOOR MAP</span>
            </div>
            <span className="text-xs text-tertiary">Click any device to inspect & command</span>
          </div>
          <FloorMap 
            onSelectEquipment={handleDeviceClick} 
            height={380} 
            showControls={true}
          />
        </div>

        {/* Right: Critical Alarms Queue */}
        <div className="operator-alerts-container">
          <div className="section-title-bar">
            <div className="flex items-center gap-2">
              <AlertOctagon size={15} className="text-red" />
              <span className="font-semibold text-sm">WHAT IS WRONG? — ACTIVE ALARMS</span>
            </div>
            <span className="alert-count-badge pulse-badge">{criticalAlerts.length}</span>
          </div>

          <div className="operator-alerts-list">
            {criticalAlerts.map(alert => (
              <div 
                key={alert.id} 
                className={`operator-alert-card ${alert.severity} ${selectedEquipment.id === alert.equipment ? 'selected-alert' : ''}`}
                onClick={() => {
                  const eq = equipmentList.find(e => e.id === alert.equipment);
                  if (eq) handleDeviceClick(eq);
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className={`status-badge ${alert.severity}`} style={{ fontSize: '10px' }}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className="font-mono text-teal text-xs">{alert.equipment}</span>
                  </div>
                  <span className="text-tertiary text-xs font-mono">{alert.time}</span>
                </div>

                <div className="alert-title mt-2" style={{ fontSize: '12px', fontWeight: 600 }}>
                  {alert.message}
                </div>

                <div className="text-xs text-tertiary mt-1">
                  Location: {alert.location}
                </div>

                <div className="mt-3 flex gap-2">
                  {!alert.acknowledged ? (
                    <button 
                      className="btn btn-primary btn-sm flex-1"
                      style={{ justifyContent: 'center' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        acknowledgeAlert(alert.id);
                      }}
                    >
                      ✓ Acknowledge
                    </button>
                  ) : (
                    <span className="text-teal text-xs flex items-center gap-1">
                      <CheckCircle2 size={12} /> Acknowledged
                    </span>
                  )}
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      const eq = equipmentList.find(e => e.id === alert.equipment);
                      if (eq) handleDeviceClick(eq);
                    }}
                  >
                    Select Device
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom: Selected Equipment Quick Action Console */}
      <div className="operator-control-console">
        <div className="console-header">
          <div className="flex items-center gap-3">
            <div className="console-device-id font-mono text-base font-bold text-teal">
              {selectedEquipment.id}
            </div>
            <span className={`status-badge ${selectedEquipment.status}`}>
              <span className="status-dot-sm" />
              {selectedEquipment.status.toUpperCase()}
            </span>
            <span className="text-xs text-tertiary">
              {selectedEquipment.type} • {selectedEquipment.zone} • {selectedEquipment.floor}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-tertiary font-mono">SCADA CONTROL CHANNEL: ONLINE (BACnet)</span>
          </div>
        </div>

        <div className="console-grid">
          {/* Live Sensor Readouts */}
          <div className="console-card">
            <div className="console-card-label">CURRENT TELEMETRY</div>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {selectedEquipment.returnTemp !== null && (
                <div className="console-metric">
                  <span className="text-xs text-tertiary">Return Air</span>
                  <span className="font-mono text-lg font-bold" style={{ color: selectedEquipment.returnTemp > 26 ? 'var(--status-critical)' : 'var(--text-primary)' }}>
                    {selectedEquipment.returnTemp}°C
                  </span>
                </div>
              )}
              {selectedEquipment.supplyTemp !== null && (
                <div className="console-metric">
                  <span className="text-xs text-tertiary">Supply Air</span>
                  <span className="font-mono text-lg font-bold text-teal">
                    {selectedEquipment.supplyTemp}°C
                  </span>
                </div>
              )}
              {selectedEquipment.fanRPM !== null && (
                <div className="console-metric">
                  <span className="text-xs text-tertiary">Fan Speed</span>
                  <span className="font-mono text-lg font-bold">
                    {selectedEquipment.fanRPM} RPM
                  </span>
                </div>
              )}
              {selectedEquipment.coolingValve !== null && (
                <div className="console-metric">
                  <span className="text-xs text-tertiary">Cooling Valve</span>
                  <span className="font-mono text-lg font-bold text-teal">
                    {selectedEquipment.coolingValve}%
                  </span>
                </div>
              )}
              {selectedEquipment.power !== null && (
                <div className="console-metric">
                  <span className="text-xs text-tertiary">Active Power</span>
                  <span className="font-mono text-lg font-bold">
                    {selectedEquipment.power} kW
                  </span>
                </div>
              )}
              <div className="console-metric">
                <span className="text-xs text-tertiary">Health Score</span>
                <span className="font-mono text-lg font-bold" style={{ color: selectedEquipment.health >= 80 ? 'var(--status-operational)' : 'var(--status-critical)' }}>
                  {selectedEquipment.health}%
                </span>
              </div>
            </div>
          </div>

          {/* Quick Commands & Operator Action Buttons */}
          <div className="console-card">
            <div className="console-card-label">OPERATOR COMMAND ACTIONS</div>
            <div className="flex gap-3 mt-3 flex-wrap">
              {/* RUN / STOP TOGGLE */}
              <button 
                className={`btn ${isRunning ? 'btn-danger' : 'btn-primary'}`}
                onClick={() => toggleEquipmentPower(selectedEquipment.id)}
              >
                <Power size={14} />
                {isRunning ? 'Command Emergency STOP' : 'Command RUN (Start)'}
              </button>

              {/* AUTO / MANUAL TOGGLE */}
              <button 
                className="btn btn-secondary"
                onClick={() => setEquipmentMode(selectedEquipment.id, selectedEquipment.mode === 'Auto' ? 'Manual' : 'Auto')}
              >
                <Sliders size={14} />
                Mode: {selectedEquipment.mode === 'Auto' ? 'Switch to MANUAL' : 'Switch to AUTO'}
              </button>

              {/* RESET ALARM */}
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  alert(`Reset pulse command dispatched to PLC on ${selectedEquipment.id}`);
                }}
              >
                <RotateCcw size={14} /> Reset Fault Latch
              </button>
            </div>

            {/* SETPOINT ADJUSTMENT */}
            {selectedEquipment.setpoint !== null && (
              <div className="mt-3 pt-3 border-t border-subtle flex items-center gap-4">
                <span className="text-xs text-secondary font-mono">
                  TARGET SETPOINT: <strong className="text-primary">{selectedEquipment.setpoint}°C</strong>
                </span>
                <div className="flex gap-2">
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => adjustSetpoint(selectedEquipment.id, -0.5)}
                  >
                    -0.5°C
                  </button>
                  <button 
                    className="btn btn-secondary btn-sm"
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
