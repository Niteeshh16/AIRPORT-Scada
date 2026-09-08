import React, { useState } from 'react';
import {
  Activity, AlertTriangle, CheckCircle2, Zap, Server,
  Layers, ArrowRight, ShieldCheck, Clock, Wind, Flame,
  Package, DoorOpen, ScanLine, Thermometer, Fan, Globe, ArrowLeft, Maximize2
} from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';
import FloorMap from '../components/FloorMap';
import MultiFloorMapGrid from '../components/MultiFloorMapGrid';
import { useNavigate } from 'react-router-dom';

const sysIcons = {
  'LBMS': Wind,
  'BHS': Package,
  'FAS': Flame,
  'SACS': ShieldCheck,
  'SSE': ScanLine,
  'AGAC': DoorOpen,
  'VDGS': Activity,
  'CMS': Zap,
  'PAS': Activity,
  'MCS': Clock,
  'SCADA': Server,
  'IASS': Activity,
};

const ALL_FLOORS = ['PIT', 'GF', '1F', '2F', '3F', '4F'];

export default function CommandCenter({ onSelectEquipment }) {
  const { subsystems, alerts, workOrders, equipmentList, selectedFloor, setSelectedFloor } = useLiveData();
  const navigate = useNavigate();

  // Mode to toggle between All Floors at once (default) and Single Floor Focus
  const [mapViewMode, setMapViewMode] = useState('all'); // 'all' | 'single'

  // Core SCADA metrics
  const totalEquipment = equipmentList.length;
  const operationalCount = equipmentList.filter(e => e.status === 'operational').length;
  const warningCount = equipmentList.filter(e => e.status === 'warning').length;
  const criticalCount = equipmentList.filter(e => e.status === 'critical').length;
  const totalPower = equipmentList.reduce((acc, curr) => acc + (curr.power || 0), 0).toFixed(1);

  return (
    <div className="command-center animate-fadeIn scada-command-center-layout full-screen-mode">
      
      {/* 1. Sleek, Compact SCADA Metric Bar Across Full Width */}
      <div className="scada-kpi-grid">
        {/* System Health */}
        <div className="card scada-kpi-card" style={{ borderLeft: '3px solid var(--accent-teal)' }}>
          <div className="flex items-center justify-between">
            <span className="text-3xs font-mono font-bold text-tertiary uppercase tracking-wider">System Health</span>
            <div className="kpi-icon-pill teal">
              <ShieldCheck size={14} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-mono text-xl font-bold text-teal">98.4%</span>
            <span className="text-3xs text-secondary font-mono">● All DDCs Online</span>
          </div>
        </div>

        {/* Monitored Fleet */}
        <div className="card scada-kpi-card" style={{ borderLeft: '3px solid var(--accent-blue)' }}>
          <div className="flex items-center justify-between">
            <span className="text-3xs font-mono font-bold text-tertiary uppercase tracking-wider">Monitored Fleet</span>
            <div className="kpi-icon-pill blue">
              <Server size={14} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-mono text-xl font-bold text-primary">
              {subsystems.reduce((acc, s) => acc + s.total, 0).toLocaleString()}
            </span>
            <span className="text-3xs text-secondary font-mono">
              <strong className="text-teal">13 Subsystems</strong> • 3,476 Online
            </span>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="card scada-kpi-card" style={{ borderLeft: '3px solid var(--status-critical)' }}>
          <div className="flex items-center justify-between">
            <span className="text-3xs font-mono font-bold text-tertiary uppercase tracking-wider">Active Alerts</span>
            <div className="kpi-icon-pill red">
              <AlertTriangle size={14} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-mono text-xl font-bold text-red">{alerts.length}</span>
            <span className="text-3xs text-secondary font-mono">
              {alerts.filter(a => a.severity === 'critical').length} Critical • {alerts.filter(a => a.severity === 'high').length} High
            </span>
          </div>
        </div>

        {/* Substation Incomer Load */}
        <div className="card scada-kpi-card" style={{ borderLeft: '3px solid var(--status-warning)' }}>
          <div className="flex items-center justify-between">
            <span className="text-3xs font-mono font-bold text-tertiary uppercase tracking-wider">Grid Incomer Load</span>
            <div className="kpi-icon-pill amber">
              <Zap size={14} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-mono text-xl font-bold text-amber">24.8 MVA</span>
            <span className="text-3xs text-secondary font-mono">32.5 MVA Cap • cos φ 0.98</span>
          </div>
        </div>
      </div>

      {/* 2. Full-Screen Terminal 1 Spatial Blueprint Stage */}
      <div className="card scada-blueprint-card" style={{ width: '100%', overflow: 'hidden' }}>
        
        {/* Blueprint Control Toolbar */}
        <div className="scada-blueprint-toolbar">
          {/* Left: Title and Live Status */}
          <div className="flex items-center gap-2 min-w-0">
            <Layers size={16} className="text-teal shrink-0" />
            <span className="font-mono text-xs uppercase font-bold tracking-wide text-primary truncate">
              TERMINAL 1 SPATIAL BLUEPRINT — {mapViewMode === 'all' ? 'ALL 6 FLOORS COMPLETE OVERVIEW' : `SINGLE FLOOR FOCUS (${selectedFloor})`}
            </span>
            <span className="live-dot-badge green shrink-0" title="Live Continuous Telemetry Stream" />
          </div>

          {/* Center / Right Controls: Floor Switcher Tabs & View Mode */}
          <div className="flex items-center gap-2.5 flex-wrap">
            
            {/* Quick Floor Selector Tabs */}
            <div className="floor-quick-tabs">
              <button
                className={`floor-tab-btn ${mapViewMode === 'all' ? 'active' : ''}`}
                onClick={() => setMapViewMode('all')}
                title="Display all 6 terminal levels at once"
              >
                ALL FLOORS
              </button>
              {ALL_FLOORS.map(floorId => (
                <button
                  key={floorId}
                  className={`floor-tab-btn ${mapViewMode === 'single' && selectedFloor === floorId ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedFloor(floorId);
                    setMapViewMode('single');
                  }}
                  title={`Focus on ${floorId} level`}
                >
                  {floorId}
                </button>
              ))}
            </div>

            {/* Back to All Floors quick button when in single view */}
            {mapViewMode === 'single' && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setMapViewMode('all')}
                style={{ fontSize: '11px', padding: '3px 10px', height: 26, display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <ArrowLeft size={12} />
                <span>All 6 Floors</span>
              </button>
            )}

            {/* 3D Digital Twin shortcut */}
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate('/digital-twin')}
              style={{
                fontSize: '11px',
                padding: '3px 10px',
                height: 26,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                color: '#38bdf8',
                fontWeight: 700,
                letterSpacing: '0.4px',
                borderRadius: '6px'
              }}
            >
              <Globe size={13} />
              <span>3D Twin →</span>
            </button>
          </div>
        </div>

        {/* Blueprint Content Stage: All 6 Floors filling the screen or Single Focus */}
        <div className="scada-blueprint-body">
          {mapViewMode === 'all' ? (
            <div className="p-3 bg-black w-full">
              <MultiFloorMapGrid
                selectedFloor={selectedFloor}
                onSelectFloor={(floorId) => {
                  setSelectedFloor(floorId);
                  setMapViewMode('single');
                }}
                fullView={true}
              />
            </div>
          ) : (
            <FloorMap
              height="clamp(440px, 60vh, 720px)"
              onSelectEquipment={onSelectEquipment}
              selectedFloor={selectedFloor}
              showControls={true}
            />
          )}
        </div>
      </div>

      {/* 3. Building Subsystems Fleet Grid (13 Subsystems Full Width) */}
      <div className="card p-3.5" style={{ width: '100%' }}>
        <div className="card-header py-1 px-2 mb-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="card-title font-mono text-xs uppercase font-bold text-primary">
              Building Subsystems Directory (13 Subsystems)
            </span>
            <span className="live-dot-badge" style={{ width: 6, height: 6 }} />
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/subsystems')}
            style={{ fontSize: '10px', padding: '3px 10px', height: 24 }}
          >
            All Subsystems Directory →
          </button>
        </div>

        <div className="scada-subsystems-grid">
          {subsystems.map(sys => {
            const isCritical = sys.critical > 0;
            const isWarning = sys.warnings > 0 && !isCritical;
            const statusColor = isCritical ? 'var(--status-critical)' : isWarning ? 'var(--status-warning)' : 'var(--status-operational)';

            return (
              <div
                key={sys.id}
                className="subsystem-card"
                onClick={() => navigate(`/subsystems/${sys.id}`)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'linear-gradient(145deg, #10141e 0%, #0a0e16 100%)',
                  border: `1px solid rgba(255, 255, 255, 0.08)`,
                  borderLeft: `3.5px solid ${statusColor}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '84px'
                }}
                title={`Click to view ${sys.name} SCADA details`}
              >
                {/* Card Top: Code + Status Badge */}
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-xs font-bold text-primary tracking-wide">{sys.id}</span>
                  <span
                    className={`status-badge ${sys.status}`}
                    style={{ fontSize: '7.5px', padding: '1px 5px', borderRadius: '4px' }}
                  >
                    {sys.status.toUpperCase()}
                  </span>
                </div>

                {/* Card Title */}
                <div className="text-3xs text-secondary truncate font-medium mb-2">{sys.name}</div>

                {/* Card Bottom: SLA Percentage & Progress Bar */}
                <div>
                  <div className="flex justify-between items-center text-3xs font-mono mb-1">
                    <span className="font-bold" style={{ color: statusColor }}>{sys.health}% SLA</span>
                    <span className="text-tertiary">{sys.operational}/{sys.total}</span>
                  </div>

                  {/* Progress Fill Bar */}
                  <div style={{ height: '3px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${sys.health}%`,
                        background: statusColor,
                        borderRadius: '2px',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
