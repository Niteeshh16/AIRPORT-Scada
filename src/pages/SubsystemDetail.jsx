import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Search, ArrowLeft, Power, Sliders, Shield, Cpu, Activity,
  ChevronRight, CheckCircle2, AlertTriangle, RefreshCw
} from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';
import SCADASchematic from '../components/SCADASchematic';

export default function SubsystemDetail({ onSelectEquipment }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { subsystems, equipmentList, toggleEquipmentPower, setEquipmentMode, adjustSetpoint } = useLiveData();

  const [searchQuery, setSearchQuery] = useState('');
  const [floorFilter, setFloorFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedEqId, setSelectedEqId] = useState(null);

  const sysCode = id?.toUpperCase() || 'LBMS';
  const currentSubsystem = subsystems.find(s => s.id === sysCode) || {
    id: sysCode,
    name: 'Building Subsystem',
    protocol: 'OPC UA',
    total: 100,
    operational: 98,
    health: 98,
    status: 'operational',
    desc: 'Real-time SCADA subsystem telemetry and node controls',
  };

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
    <div className="page animate-fadeIn">
      {/* Top Header & Back Navigation */}
      <div className="page-header" style={{ marginBottom: 'var(--s4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/subsystems')}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 className="page-title" style={{ fontFamily: 'var(--mono)' }}>
                {currentSubsystem.id} — {currentSubsystem.name}
              </h1>
              <span className={`badge ${currentSubsystem.status === 'operational' ? 'badge-operational' : 'badge-warning'}`}>
                {currentSubsystem.health}% SLA
              </span>
              <span style={{
                fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text-3)',
                background: 'var(--bg-overlay)', padding: '2px 6px', borderRadius: 'var(--r-sm)'
              }}>
                {currentSubsystem.protocol}
              </span>
            </div>
            <p className="page-subtitle">
              {currentSubsystem.total} Total System Assets • {subsystemEquipment.length} Filtered Nodes
            </p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="page-actions" style={{ gap: 8 }}>
          <div style={{ position: 'relative', width: 180 }}>
            <Search size={13} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
            <input
              placeholder="Search ID/Zone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 28, height: 32, fontSize: 12 }}
            />
          </div>

          <select
            value={floorFilter}
            onChange={e => setFloorFilter(e.target.value)}
            style={{ width: 110, height: 32, fontSize: 12 }}
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
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ width: 120, height: 32, fontSize: 12 }}
          >
            <option value="ALL">All Statuses</option>
            <option value="operational">Operational</option>
            <option value="warning">Warning</option>
            <option value="critical">Fault</option>
          </select>
        </div>
      </div>

      {/* Main 2-Column View: Equipment List + Device Inspector */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: 'var(--s4)',
        alignItems: 'start'
      }}>
        {/* Left Column: Equipment Cards */}
        <div className="card" style={{ padding: 'var(--s4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--s3)' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Subsystem Equipment Nodes ({subsystemEquipment.length})
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
              Click device to inspect telemetry & controls
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 'var(--s3)',
            maxHeight: 'calc(100vh - 240px)',
            overflowY: 'auto',
            paddingRight: 4
          }}>
            {subsystemEquipment.map(eq => {
              const isSelected = selectedDevice?.id === eq.id;
              const isRunning = eq.mode !== 'Stop' && eq.status !== 'offline';
              const statusClass =
                eq.status === 'operational' ? 'badge-operational' :
                eq.status === 'warning' ? 'badge-warning' :
                eq.status === 'critical' ? 'badge-critical' : 'badge-offline';

              return (
                <div
                  key={eq.id}
                  onClick={() => {
                    setSelectedEqId(eq.id);
                    onSelectEquipment?.(eq);
                  }}
                  style={{
                    background: isSelected ? 'var(--bg-overlay)' : 'var(--bg-app)',
                    border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 'var(--r-md)',
                    padding: 'var(--s3)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', fontFamily: 'var(--mono)' }}>
                        {eq.id}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-3)' }}>
                        {eq.type} • {eq.floor} • {eq.zone}
                      </div>
                    </div>
                    <span className={`badge ${statusClass}`} style={{ fontSize: 9 }}>
                      {eq.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Parameter chips */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                    {eq.temp !== undefined && eq.temp !== null && (
                      <div style={{ background: 'var(--bg-surface)', padding: '3px 6px', borderRadius: 'var(--r-sm)', fontSize: 10 }}>
                        <span style={{ color: 'var(--text-3)' }}>Temp: </span>
                        <span style={{ color: 'var(--text-1)', fontWeight: 600, fontFamily: 'var(--mono)' }}>{eq.temp}°C</span>
                      </div>
                    )}
                    {eq.fanRPM !== undefined && eq.fanRPM !== null && (
                      <div style={{ background: 'var(--bg-surface)', padding: '3px 6px', borderRadius: 'var(--r-sm)', fontSize: 10 }}>
                        <span style={{ color: 'var(--text-3)' }}>Fan: </span>
                        <span style={{ color: 'var(--text-1)', fontWeight: 600, fontFamily: 'var(--mono)' }}>{eq.fanRPM} RPM</span>
                      </div>
                    )}
                    {eq.voltage !== undefined && eq.voltage !== null && (
                      <div style={{ background: 'var(--bg-surface)', padding: '3px 6px', borderRadius: 'var(--r-sm)', fontSize: 10 }}>
                        <span style={{ color: 'var(--text-3)' }}>Volt: </span>
                        <span style={{ color: 'var(--text-1)', fontWeight: 600, fontFamily: 'var(--mono)' }}>{eq.voltage}V</span>
                      </div>
                    )}
                    {eq.power !== undefined && eq.power !== null && (
                      <div style={{ background: 'var(--bg-surface)', padding: '3px 6px', borderRadius: 'var(--r-sm)', fontSize: 10 }}>
                        <span style={{ color: 'var(--text-3)' }}>Pwr: </span>
                        <span style={{ color: 'var(--text-1)', fontWeight: 600, fontFamily: 'var(--mono)' }}>{eq.power} kW</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 6 }}>
                    <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>
                      Mode: <span style={{ color: 'var(--text-2)' }}>{eq.mode}</span>
                    </span>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        className={`btn btn-xs ${isRunning ? 'btn-danger' : 'btn-primary'}`}
                        style={{ padding: '2px 6px', fontSize: 10 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleEquipmentPower(eq.id);
                        }}
                      >
                        <Power size={9} style={{ marginRight: 2 }} /> {isRunning ? 'Stop' : 'Run'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Device Inspector */}
        {selectedDevice && (
          <div className="card" style={{ padding: 'var(--s4)', display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', fontFamily: 'var(--mono)' }}>
                  {selectedDevice.id}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                  {selectedDevice.type} • {selectedDevice.floor} • {selectedDevice.zone}
                </div>
              </div>
              <span className={`badge ${selectedDevice.status === 'operational' ? 'badge-operational' : 'badge-warning'}`}>
                {selectedDevice.status.toUpperCase()}
              </span>
            </div>

            {/* Schematic */}
            <div style={{
              background: 'var(--bg-app)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-md)', padding: 'var(--s3)', overflow: 'hidden'
            }}>
              <SCADASchematic equipment={selectedDevice} />
            </div>

            {/* Setpoint Slider if applicable */}
            {selectedDevice.setpoint !== undefined && selectedDevice.setpoint !== null && (
              <div style={{
                background: 'var(--bg-app)', border: '1px solid var(--border)',
                borderRadius: 'var(--r-md)', padding: 'var(--s3)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-2)' }}>Temperature Setpoint</span>
                  <span style={{ color: 'var(--accent)', fontWeight: 700, fontFamily: 'var(--mono)' }}>
                    {selectedDevice.setpoint}°C
                  </span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="28"
                  step="0.5"
                  value={selectedDevice.setpoint}
                  onChange={(e) => adjustSetpoint(selectedDevice.id, parseFloat(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-3)', marginTop: 4 }}>
                  <span>18°C</span>
                  <span>24°C (Target)</span>
                  <span>28°C</span>
                </div>
              </div>
            )}

            {/* Control Modes */}
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                className={`btn btn-sm ${selectedDevice.mode === 'Auto' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1 }}
                onClick={() => setEquipmentMode(selectedDevice.id, 'Auto')}
              >
                AUTO
              </button>
              <button
                className={`btn btn-sm ${selectedDevice.mode === 'Manual' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1 }}
                onClick={() => setEquipmentMode(selectedDevice.id, 'Manual')}
              >
                MANUAL
              </button>
            </div>

            {/* Telemetry Points */}
            <div style={{
              background: 'var(--bg-app)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-md)', padding: 'var(--s3)',
              display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-3)' }}>Health Score</span>
                <span style={{ color: 'var(--green)', fontWeight: 600, fontFamily: 'var(--mono)' }}>{selectedDevice.health}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-3)' }}>Protocol</span>
                <span style={{ color: 'var(--text-1)', fontFamily: 'var(--mono)' }}>{currentSubsystem.protocol}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-3)' }}>Control Loop</span>
                <span style={{ color: 'var(--accent)' }}>Supervisory (AVEVA UOC)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-3)' }}>Last Ping</span>
                <span style={{ color: 'var(--text-2)', fontFamily: 'var(--mono)' }}>{selectedDevice.lastUpdate || 'Just now'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
