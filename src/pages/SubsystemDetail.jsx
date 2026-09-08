import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Search, ArrowLeft, Filter, AlertTriangle, CheckCircle2, 
  RotateCcw, Sliders, Power, Layers, Thermometer, Wind, Gauge,
  Clock, ShieldCheck, Zap
} from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';
import SCADASchematic from '../components/SCADASchematic';

export default function SubsystemDetail({ onSelectEquipment }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { subsystems, equipmentList, alerts, toggleEquipmentPower, setEquipmentMode, adjustSetpoint } = useLiveData();

  const [searchQuery, setSearchQuery] = useState('');
  const [floorFilter, setFloorFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedEqId, setSelectedEqId] = useState(null);

  const sysCode = id?.toUpperCase() || 'LBMS';
  const currentSubsystem = subsystems.find(s => s.id === sysCode) || {
    id: sysCode,
    name: 'Building Subsystem',
    protocol: 'OPC UA',
    integrationType: 'Industrial Telemetry',
    total: 100,
    operational: 98,
    health: 98,
    status: 'operational',
    desc: 'Real-time SCADA subsystem telemetry and node controls',
  };

  // Filter equipment for this subsystem
  const subsystemEquipment = useMemo(() => {
    return equipmentList.filter(e => {
      if (e.system !== sysCode && sysCode !== 'ALL') return false;
      if (floorFilter !== 'ALL' && e.floor !== floorFilter) return false;
      if (statusFilter !== 'ALL' && e.status !== statusFilter) return false;
      if (searchQuery && !e.id.toLowerCase().includes(searchQuery.toLowerCase()) && !e.zone?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [equipmentList, sysCode, floorFilter, statusFilter, searchQuery]);

  const selectedDevice = equipmentList.find(e => e.id === selectedEqId) || subsystemEquipment[0];

  return (
    <div className="subsystem-detail animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* 1. Header & Quick Navigation */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/subsystems')}
          >
            <ArrowLeft size={14} /> Back to Subsystems
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold font-mono text-primary m-0">{currentSubsystem.id} — {currentSubsystem.name}</h2>
              <span className={`status-badge ${currentSubsystem.health >= 90 ? 'operational' : 'warning'}`}>
                {currentSubsystem.health}% SLA
              </span>
              <span className="text-3xs font-mono text-teal bg-elevated px-2 py-0.5 rounded border border-subtle">
                {currentSubsystem.protocol}
              </span>
            </div>
            <span className="text-2xs text-secondary">
              {currentSubsystem.total.toLocaleString()} Total System Assets ({subsystemEquipment.length} Sample Telemetry Nodes Filtered) • Mode: Read-Only Supervisory
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="search-input-wrapper" style={{ width: 180 }}>
            <Search size={13} />
            <input 
              className="search-input"
              placeholder="Search ID or Zone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ height: 30, fontSize: '11px' }}
            />
          </div>

          <select 
            className="search-input"
            style={{ height: 30, fontSize: '11px', padding: '2px 8px' }}
            value={floorFilter}
            onChange={e => setFloorFilter(e.target.value)}
          >
            <option value="ALL">All Floors</option>
            <option value="GF">Ground Floor</option>
            <option value="1F">First Floor</option>
            <option value="2F">Second Floor</option>
            <option value="3F">Third Floor</option>
            <option value="4F">Fourth Floor</option>
            <option value="PIT">PIT Level</option>
          </select>

          <select 
            className="search-input"
            style={{ height: 30, fontSize: '11px', padding: '2px 8px' }}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="operational">Operational</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      {/* 2. Main 2-Column Layout: Equipment Cards Grid + Detailed Inspector */}
      <div className="scada-split-2-1">
        {/* Equipment Cards (2 Columns Wide) */}
        <div className="card p-3">
          <div className="card-header py-1 px-2 mb-2 flex justify-between items-center">
            <span className="card-title text-xs font-mono font-bold uppercase">Subsystem Equipment Fleet</span>
            <span className="text-2xs text-tertiary font-mono">{subsystemEquipment.length} active nodes</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px', maxHeight: 'clamp(420px, 62vh, 700px)', overflowY: 'auto', padding: '2px' }}>
            {subsystemEquipment.map(eq => {
              const isSelected = selectedDevice?.id === eq.id;
              const isRunning = eq.mode !== 'Stop' && eq.status !== 'offline';
              return (
                <div 
                  key={eq.id}
                  className="card p-3"
                  onClick={() => {
                    setSelectedEqId(eq.id);
                    onSelectEquipment?.(eq);
                  }}
                  style={{ 
                    cursor: 'pointer',
                    background: isSelected ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                    border: isSelected ? '1px solid var(--accent-teal)' : '1px solid var(--border-subtle)',
                    borderLeft: eq.status === 'critical' ? '4px solid var(--status-critical)' : eq.status === 'warning' ? '4px solid var(--status-warning)' : '4px solid var(--status-operational)',
                    transition: 'all 0.15s',
                    borderRadius: '8px'
                  }}
                >
                  {/* Equipment Header */}
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-bold text-primary">{eq.id}</span>
                      <span className="text-3xs text-secondary mt-0.5">{eq.type} • {eq.floor} • {eq.zone}</span>
                    </div>
                    <span className={`status-badge ${eq.status}`} style={{ fontSize: '8px', padding: '1px 5px' }}>
                      {eq.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Telemetry Metrics Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginBottom: '8px' }}>
                    {eq.temp !== null && eq.temp !== undefined && (
                      <div className="param-box">
                        <span className="param-label">Temp</span>
                        <span className="param-val font-mono text-teal">{eq.temp}°C</span>
                      </div>
                    )}
                    {eq.fanRPM !== null && eq.fanRPM !== undefined && (
                      <div className="param-box">
                        <span className="param-label">Fan Speed</span>
                        <span className="param-val font-mono">{eq.fanRPM} RPM</span>
                      </div>
                    )}
                    {eq.coolingValve !== null && eq.coolingValve !== undefined && (
                      <div className="param-box">
                        <span className="param-label">Cooling Valve</span>
                        <span className="param-val font-mono text-amber">{eq.coolingValve}%</span>
                      </div>
                    )}
                    {eq.voltage !== null && eq.voltage !== undefined && (
                      <div className="param-box">
                        <span className="param-label">Voltage</span>
                        <span className="param-val font-mono text-cyan">{eq.voltage} V</span>
                      </div>
                    )}
                    {eq.powerFactor !== null && eq.powerFactor !== undefined && (
                      <div className="param-box">
                        <span className="param-label">cos φ</span>
                        <span className="param-val font-mono text-teal">{eq.powerFactor}</span>
                      </div>
                    )}
                    {eq.shutterState && (
                      <div className="param-box">
                        <span className="param-label">Shutter</span>
                        <span className={`param-val font-mono ${eq.shutterState === 'Closed' ? 'text-red' : 'text-teal'}`}>{eq.shutterState}</span>
                      </div>
                    )}
                    {eq.power !== null && eq.power !== undefined && (
                      <div className="param-box">
                        <span className="param-label">Power</span>
                        <span className="param-val font-mono">{eq.power} kW</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Control Footer */}
                  <div className="pt-2 border-t border-subtle flex justify-between items-center">
                    <span className="text-3xs font-mono text-tertiary">Mode: <strong className="text-secondary">{eq.mode}</strong></span>
                    <div className="flex gap-1.5">
                      <button 
                        className={`btn btn-sm ${isRunning ? 'btn-danger' : 'btn-primary'}`}
                        style={{ padding: '2px 8px', fontSize: '10px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleEquipmentPower(eq.id);
                        }}
                      >
                        <Power size={10} /> {isRunning ? 'Stop' : 'Run'}
                      </button>
                      <button 
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '2px 8px', fontSize: '10px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEquipment?.(eq);
                        }}
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device Live Inspector (1 Column Wide) */}
        {selectedDevice && (
          <div className="card p-3 flex flex-col gap-3">
            <div className="card-header py-1 px-2 mb-1 flex justify-between items-center">
              <span className="card-title text-xs font-mono font-bold uppercase">Device Inspector & Schematic</span>
              <span className={`status-badge ${selectedDevice.status}`}>
                {selectedDevice.status.toUpperCase()}
              </span>
            </div>

            {/* Industrial SCADA Schematic Diagram */}
            <SCADASchematic equipment={selectedDevice} />

            <div className="flex flex-col gap-3">
              <div className="p-2.5 bg-elevated rounded border border-subtle">
                <div className="font-mono text-sm font-bold text-primary">{selectedDevice.id}</div>
                <div className="text-2xs text-secondary">{selectedDevice.type} • {selectedDevice.system} Subsystem ({currentSubsystem.protocol})</div>
                <div className="text-3xs text-tertiary mt-1">Location: {selectedDevice.floor} — {selectedDevice.zone}</div>
              </div>

              {/* Setpoint Slider if applicable */}
              {selectedDevice.setpoint !== undefined && selectedDevice.setpoint !== null && (
                <div className="p-2.5 bg-elevated rounded border border-subtle">
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-tertiary">Temperature Setpoint</span>
                    <span className="text-teal font-bold">{selectedDevice.setpoint}°C</span>
                  </div>
                  <input 
                    type="range" 
                    min="18" 
                    max="28" 
                    step="0.5"
                    value={selectedDevice.setpoint}
                    onChange={(e) => adjustSetpoint(selectedDevice.id, parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-3xs text-tertiary font-mono mt-1">
                    <span>18°C</span>
                    <span>24°C (Nominal)</span>
                    <span>28°C</span>
                  </div>
                </div>
              )}

              {/* Mode Switcher */}
              <div className="flex gap-2">
                <button 
                  className={`btn btn-sm flex-1 ${selectedDevice.mode === 'Auto' || selectedDevice.mode === 'Closed' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setEquipmentMode(selectedDevice.id, 'Auto')}
                >
                  AUTO
                </button>
                <button 
                  className={`btn btn-sm flex-1 ${selectedDevice.mode === 'Manual' || selectedDevice.mode === 'Open' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setEquipmentMode(selectedDevice.id, 'Manual')}
                >
                  MANUAL
                </button>
              </div>

              {/* Live Telemetry Table */}
              <div className="flex flex-col gap-1.5 text-2xs font-mono">
                <div className="flex justify-between py-1 border-b border-subtle">
                  <span className="text-tertiary">Health Score</span>
                  <span className="text-teal font-bold">{selectedDevice.health}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-subtle">
                  <span className="text-tertiary">Communication</span>
                  <span className="text-teal">{selectedDevice.comm || currentSubsystem.protocol}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-subtle">
                  <span className="text-tertiary">Supervisory Mode</span>
                  <span className="text-secondary">Read-Only (AVEVA UOC)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-subtle">
                  <span className="text-tertiary">Last Update</span>
                  <span className="text-secondary">{selectedDevice.lastUpdate}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
