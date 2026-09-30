import React, { useState } from 'react';
import {
  Package, Activity, Zap, Server, ShieldCheck, Volume2,
  Flame, Clock, Wind, PlaneLanding, ScanLine, DoorOpen,
  AlertTriangle, ChevronRight, ArrowRight,
  Maximize2, X, Check, Eye,
  Cpu, Wrench,
  ExternalLink
} from 'lucide-react';
import MultiFloorMapGrid, { FloorSchematic } from '../components/MultiFloorMapGrid';
import { useNavigate } from 'react-router-dom';
import { useLiveData } from '../context/LiveDataContext';

// 12 Building Subsystems conforming to LTIA reference architecture
const SUBSYSTEMS_REFERENCE = [
  {
    code: 'BHS',
    name: 'Baggage Handling System',
    icon: Package,
    statusDot: '2',
    dotColor: '#ef4444',
    avail: '97%',
    availNum: 97,
    alert: 'Alert: Conveyor jam detected - Motor overload trip; SHTR-BHS-FS01 closed',
    time: '18s ago',
    alertSeverity: 'warn',
    assets: '4/5',
    on: 4,
    warn: 1,
    off: 0,
    total: 5,
  },
  {
    code: 'VDGS',
    name: 'Visual Docking Guidance',
    icon: Activity,
    statusDot: '2',
    dotColor: '#10b981',
    avail: '97%',
    availNum: 97,
    alert: 'All 55 docking guidance heads operational',
    time: '18s ago',
    alertSeverity: 'ok',
    assets: '3/5',
    on: 3,
    warn: 1,
    off: 1,
    total: 5,
  },
  {
    code: 'CMS',
    name: 'Central Monitoring (Elec.)',
    icon: Zap,
    statusDot: '2',
    dotColor: '#10b981',
    avail: '96%',
    availNum: 96,
    alert: 'All 33 VCB / 100 ACB switchgear nominal',
    time: '18s ago',
    alertSeverity: 'ok',
    assets: '3/4',
    on: 3,
    warn: 1,
    off: 0,
    total: 4,
  },
  {
    code: 'SCADA',
    name: 'Supervisory Control & Data',
    icon: Server,
    statusDot: '1',
    dotColor: '#ef4444',
    avail: '97%',
    availNum: 97,
    alert: 'Warning: Winding temp warning in Substation SS-1 Transformer B',
    time: '18s ago',
    alertSeverity: 'warn',
    assets: '1706/1730',
    on: 1706,
    warn: 7,
    off: 17,
    total: 1730,
  },
  {
    code: 'SACS',
    name: 'Security & Access Control',
    icon: ShieldCheck,
    statusDot: '2',
    dotColor: '#ef4444',
    avail: '90%',
    availNum: 90,
    alert: 'Alert: Tamper switch contact open - Door Forced Open at Portal Alpha',
    time: '18s ago',
    alertSeverity: 'crit',
    assets: '3/5',
    on: 3,
    warn: 1,
    off: 1,
    total: 5,
  },
  {
    code: 'PAS',
    name: 'Public Address System',
    icon: Volume2,
    statusDot: '',
    dotColor: '#10b981',
    avail: '98%',
    availNum: 98,
    alert: 'All terminal concourse acoustic zones synchronized',
    time: '18s ago',
    alertSeverity: 'ok',
    assets: '4/4',
    on: 4,
    warn: 0,
    off: 0,
    total: 4,
  },
  {
    code: 'FAS',
    name: 'Fire Alarm System',
    icon: Flame,
    statusDot: '',
    dotColor: '#10b981',
    avail: '99%',
    availNum: 99,
    alert: 'Master BACnet loop healthy • 0 smoke alarms active',
    time: '18s ago',
    alertSeverity: 'ok',
    assets: '4/4',
    on: 4,
    warn: 0,
    off: 0,
    total: 4,
  },
  {
    code: 'MCS',
    name: 'Master Clock System',
    icon: Clock,
    statusDot: '',
    dotColor: '#10b981',
    avail: '99.5%',
    availNum: 99.5,
    alert: 'NTP GPS master time sync accuracy at 99.8%',
    time: '18s ago',
    alertSeverity: 'ok',
    assets: '4/4',
    on: 4,
    warn: 0,
    off: 0,
    total: 4,
  },
  {
    code: 'LBMS',
    name: 'HVAC & Building Mgmt',
    icon: Wind,
    statusDot: '1',
    dotColor: '#f59e0b',
    avail: '94%',
    availNum: 94,
    alert: 'Warning: AHU-GF-001 high return air temperature (28.6°C > 26.0°C)',
    time: '18s ago',
    alertSeverity: 'warn',
    assets: '3/5',
    on: 3,
    warn: 1,
    off: 1,
    total: 5,
  },
  {
    code: 'IASS',
    name: 'Aircraft Stand System',
    icon: PlaneLanding,
    statusDot: '1',
    dotColor: '#f59e0b',
    avail: '95%',
    availNum: 95,
    alert: 'Stand 12 ground power telemetry operational',
    time: '18s ago',
    alertSeverity: 'ok',
    assets: '3/4',
    on: 3,
    warn: 1,
    off: 0,
    total: 4,
  },
  {
    code: 'SSE',
    name: 'Security Screening Equipment',
    icon: ScanLine,
    statusDot: '2',
    dotColor: '#ef4444',
    avail: '96%',
    availNum: 96,
    alert: 'Alert: Customs Baggage Scanner 2 Dual-View CT calibration required',
    time: '18s ago',
    alertSeverity: 'warn',
    assets: '3/5',
    on: 3,
    warn: 1,
    off: 1,
    total: 5,
  },
  {
    code: 'AGAC',
    name: 'Airport Gate Access Control',
    icon: DoorOpen,
    statusDot: '1',
    dotColor: '#f59e0b',
    avail: '96%',
    availNum: 96,
    alert: 'Gate 15 passenger passage telemetry nominal',
    time: '18s ago',
    alertSeverity: 'ok',
    assets: '3/4',
    on: 3,
    warn: 1,
    off: 0,
    total: 4,
  },
];

export default function CommandCenter({ onSelectEquipment }) {
  const navigate = useNavigate();
  const {
    alerts,
    acknowledgeAlert,
    subsystems: liveSubsystems,
    scadaMetrics,
    workOrders,
    equipmentList,
    selectedFloor,
    setSelectedFloor
  } = useLiveData();

  const [maximizedFloor, setMaximizedFloor] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [subsystemFilter, setSubsystemFilter] = useState('all'); // 'all' | 'attention' | 'operational'

  // Dynamic calculations
  const unackAlerts = alerts.filter(a => !a.acknowledged);
  const criticalAlerts = unackAlerts.filter(a => a.severity === 'critical');
  const highAlerts = unackAlerts.filter(a => a.severity === 'high');
  const activeWOs = workOrders.filter(w => w.status !== 'completed');
  const inProgressWOs = activeWOs.filter(w => w.status === 'in_progress');
  const dispatchedWOs = activeWOs.filter(w => w.status === 'assigned' || w.status === 'pending');

  const avgAvail = (
    liveSubsystems.reduce((acc, s) => acc + (s.health || 97), 0) / (liveSubsystems.length || 1)
  ).toFixed(1);

  const getSubsystemAlertCount = (code) => {
    return unackAlerts.filter(a => a.system === code).length;
  };

  // Filtered subsystems list
  const filteredSubsystems = SUBSYSTEMS_REFERENCE.filter(sys => {
    const alertCount = getSubsystemAlertCount(sys.code);
    const hasIssues = alertCount > 0 || sys.availNum < 97;
    if (subsystemFilter === 'attention') return hasIssues;
    if (subsystemFilter === 'operational') return !hasIssues;
    return true;
  });

  return (
    <div className="command-center-root">
      
      {/* ========================================================
          1. TOP OPERATIONAL KPI STRIP (Full Width)
          ======================================================== */}
      <div className="stat-grid stat-grid-4">
        
        {/* Monitored Assets */}
        <div 
          className="stat-card stat-card-interactive" 
          onClick={() => navigate('/equipment')} 
          title="Open Equipment Explorer"
        >
          <div className="stat-icon blue">
            <Cpu size={18} />
          </div>
          <div className="stat-content">
            <div className="stat-value font-mono">
              2,684
              <span className="stat-value-sub">/{scadaMetrics.activeNodes}</span>
            </div>
            <div className="stat-label">Total Monitored Assets</div>
            <div className="stat-note flex items-center justify-between">
              <span>12 Subsystems Connected</span>
              <span className="text-emerald-400 font-mono font-bold">98.1% Online</span>
            </div>
          </div>
          <div className="stat-card-glow blue" />
        </div>

        {/* Active Alarms */}
        <div 
          className={`stat-card stat-card-interactive ${criticalAlerts.length > 0 ? 'stat-card-alert' : ''}`}
          onClick={() => navigate('/alerts')} 
          title="Open Central Alarms Directory"
        >
          <div className="stat-icon red">
            <AlertTriangle size={18} />
          </div>
          <div className="stat-content">
            <div className="stat-value font-mono text-red-400 flex items-center gap-2">
              {unackAlerts.length}
              {criticalAlerts.length > 0 && (
                <span className="alarm-pulse-tag">
                  {criticalAlerts.length} CRIT
                </span>
              )}
            </div>
            <div className="stat-label">Active System Alarms</div>
            <div className="stat-note flex items-center justify-between">
              <span>{criticalAlerts.length} Critical • {highAlerts.length} High</span>
              <span className="text-red-400 font-mono">Action Required</span>
            </div>
          </div>
          <div className="stat-card-glow red" />
        </div>

        {/* Open Work Orders */}
        <div 
          className="stat-card stat-card-interactive" 
          onClick={() => navigate('/work-orders')} 
          title="View Maintenance Work Orders"
        >
          <div className="stat-icon yellow">
            <Wrench size={18} />
          </div>
          <div className="stat-content">
            <div className="stat-value font-mono text-amber-400">
              {activeWOs.length}
            </div>
            <div className="stat-label">Open Work Orders</div>
            <div className="stat-note flex items-center justify-between">
              <span>{inProgressWOs.length} In Progress • {dispatchedWOs.length} Dispatched</span>
              <span className="text-amber-400 font-mono">SLA Active</span>
            </div>
          </div>
          <div className="stat-card-glow yellow" />
        </div>

        {/* Overall Fleet Availability */}
        <div 
          className="stat-card stat-card-interactive" 
          onClick={() => navigate('/subsystems')} 
          title="View Subsystems Directory"
        >
          <div className="stat-icon green">
            <Activity size={18} />
          </div>
          <div className="stat-content">
            <div className="stat-value font-mono text-emerald-400">
              {avgAvail}%
            </div>
            <div className="stat-label">Overall Fleet Availability</div>
            <div className="stat-note flex items-center justify-between">
              <span>Dual Redundant BACnet/OPC-UA</span>
              <span className="text-emerald-400 font-mono">Target ≥95%</span>
            </div>
          </div>
          <div className="stat-card-glow green" />
        </div>

      </div>

      {/* ========================================================
          2. EXPANSIVE FULL-WIDTH SPATIAL FLOOR MAP (Center Stage)
          ======================================================== */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', width: '100%', border: '1px solid var(--border)' }}>
        


        {/* All 6 Floors Grid by Default */}
        <div style={{ background: '#05070c', width: '100%', padding: '16px' }}>
          <MultiFloorMapGrid
            activeFloorId={selectedFloor || '1F'}
            onSelectFloor={(floorId) => {
              if (setSelectedFloor) setSelectedFloor(floorId);
              setMaximizedFloor(floorId);
            }}
            onMaximize={(floorId) => setMaximizedFloor(floorId || '4F')}
          />
        </div>
      </div>

      {/* ========================================================
          3. FULL-WIDTH 12 BUILDING SUBSYSTEMS DIRECTORY
          ======================================================== */}
      <div className="card" style={{ padding: 'var(--s4)', width: '100%' }}>
        
        {/* Header */}
        <div className="scada-subsystems-header">
          <div className="flex items-center gap-3">
            <span className="scada-subsystems-title">BUILDING SUBSYSTEMS DIRECTORY</span>
            <span className="badge badge-operational text-3xs font-mono">
              {liveSubsystems.filter(s => s.status === 'operational').length}/12 OPERATIONAL
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Tabs */}
            <div className="subsys-filter-tabs">
              {[
                { id: 'all', label: `All (12)` },
                { id: 'attention', label: `Attention (${criticalAlerts.length + highAlerts.length})` },
                { id: 'operational', label: `Nominal (9)` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSubsystemFilter(tab.id)}
                  className={`subsys-filter-btn ${subsystemFilter === tab.id ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => navigate('/subsystems')}
              className="btn btn-secondary btn-sm font-mono text-xs flex items-center gap-1.5"
              style={{ height: '28px', padding: '0 10px' }}
            >
              <span>Subsystems Directory</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* 12 Subsystems Cards Grid (4 Columns x 3 Rows, Spacious Full Width) */}
        <div className="scada-subsystems-cards-grid">
          {filteredSubsystems.map(sys => {
            const Icon = sys.icon;
            const alertCount = getSubsystemAlertCount(sys.code);
            const hasCritical = alerts.some(a => a.system === sys.code && a.severity === 'critical' && !a.acknowledged);
            const hasWarning = alertCount > 0 && !hasCritical;

            const onPercent = (sys.on / sys.total) * 100;
            const warnPercent = (sys.warn / sys.total) * 100;
            const offPercent = (sys.off / sys.total) * 100;

            return (
              <div 
                key={sys.code}
                className={`scada-subsystem-card ${hasCritical ? 'has-critical-alarm' : hasWarning ? 'has-warning-alarm' : ''}`}
                onClick={() => navigate(`/subsystems/${sys.code}`)}
                title={`View ${sys.code} - ${sys.name} SCADA telemetry`}
              >
                {/* Top Row: Icon + Code + Name + Status Dot */}
                <div className="subsys-card-header">
                  <div className="subsys-id-group">
                    <div className={`subsys-icon-box ${hasCritical ? 'crit' : hasWarning ? 'warn' : ''}`}>
                      <Icon size={14} />
                    </div>
                    <div className="subsys-naming">
                      <span className="subsys-code">{sys.code}</span>
                      <span className="subsys-full-name">{sys.name}</span>
                    </div>
                  </div>

                  {/* Dot with count */}
                  <div className="subsys-badge-group">
                    <span 
                      className="subsys-indicator-dot" 
                      style={{ backgroundColor: hasCritical ? '#ef4444' : hasWarning ? '#f59e0b' : '#10b981' }}
                    />
                    {(alertCount > 0 || sys.statusDot) && (
                      <span className={`subsys-indicator-count ${hasCritical ? 'text-red-400' : ''}`}>
                        {alertCount > 0 ? alertCount : sys.statusDot}
                      </span>
                    )}
                  </div>
                </div>

                {/* Row 2: Avail. + Percentage + Thin Progress Bar */}
                <div className="subsys-avail-section">
                  <div className="subsys-avail-info">
                    <span className="subsys-label">Availability</span>
                    <span className="subsys-avail-val font-mono">{sys.avail}</span>
                  </div>
                  <div className="subsys-avail-track">
                    <div 
                      className="subsys-avail-fill" 
                      style={{ 
                        width: sys.avail,
                        backgroundColor: sys.availNum >= 97 ? '#10b981' : sys.availNum >= 94 ? '#22c55e' : '#f59e0b'
                      }}
                    />
                  </div>
                </div>

                {/* Row 3: Alert / Operational message */}
                <div className="subsys-alert-section">
                  <span className={`subsys-alert-msg ${hasCritical ? 'crit' : hasWarning ? 'warn' : 'ok'}`} title={sys.alert}>
                    {hasCritical 
                      ? `Alert: ${alerts.find(a => a.system === sys.code && a.severity === 'critical')?.message || sys.alert}`
                      : sys.alert
                    }
                  </span>
                  <span className="subsys-alert-time">{sys.time}</span>
                </div>

                {/* Row 4: Assets + Multi-Segment Track + 3 Color Counts */}
                <div className="subsys-assets-section">
                  <div className="subsys-assets-info">
                    <span className="subsys-label">Assets Monitored</span>
                    <span className="subsys-assets-val font-mono">{sys.assets}</span>
                  </div>

                  {/* 3-Color Segmented Track */}
                  <div className="subsys-assets-track">
                    <div className="subsys-seg seg-on" style={{ width: `${onPercent}%` }} />
                    <div className="subsys-seg seg-warn" style={{ width: `${warnPercent}%` }} />
                    <div className="subsys-seg seg-off" style={{ width: `${offPercent}%` }} />
                  </div>

                  {/* Color Coded Counters Below Bar */}
                  <div className="subsys-assets-counts font-mono">
                    <span className="count-on">{sys.on} on</span>
                    <span className="count-warn">{sys.warn} warn</span>
                    <span className="count-off">{sys.off} off</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          MODAL: Maximize Floor Terminal View with Real Telemetry
          ======================================================== */}
      {maximizedFloor && (() => {
        const floorData = {
          'PIT': {
            name: 'Basement & Central Utility Tunnel',
            devices: 168, working: 165, fault: 3,
            items: [
              { label: 'AHU Units', val: '14 units (14 OK)', state: 'ok' },
              { label: 'FCU Fan Coils', val: '68 units (66 OK, 2 Alert)', state: 'warn' },
              { label: 'CRAH Precision', val: '6 units (6 OK)', state: 'ok' },
              { label: 'Chilled Water Pumps', val: '16 SCWP Pumps', state: 'ok' },
              { label: 'Fire Suppression', val: '37 Nitrogen Cylinders, 9 Hydrant Pumps', state: 'ok' },
              { label: 'Power SCADA', val: '18 VCB, 6 TR, 40 ACB, 4 UPS', state: 'ok' }
            ]
          },
          'GF': {
            name: 'Ground Floor (Baggage Handling & Apron Hub)',
            devices: 918, working: 881, fault: 37,
            items: [
              { label: 'AHU (Air Handling)', val: '109 units (100 Working, 9 Fault)', state: 'crit' },
              { label: 'FCU Fan Coils', val: '574 units (552 Working, 22 Alert)', state: 'warn' },
              { label: 'CRAH Precision', val: '23 units (20 Working, 3 Fault)', state: 'crit' },
              { label: 'Ventilation Fans', val: '116 units (111 EAF, 27 FAF, 13 KEF, 27 LPF, 18 SEF)', state: 'warn' },
              { label: 'Fire Protection', val: '102 FM-200 Cylinders, 9 Pumps', state: 'ok' },
              { label: 'Electrical SCADA', val: '15 VCB, 6 TR, 60 ACB, 4 UPS', state: 'ok' }
            ]
          },
          '1F': {
            name: 'First Floor (Departures Concourse & Gates 11-24)',
            devices: 442, working: 434, fault: 8,
            items: [
              { label: 'AHU (Air Handling)', val: '43 units (40 Working, 3 Fault)', state: 'crit' },
              { label: 'FCU Fan Coils', val: '238 units (230 Working, 8 Alert)', state: 'warn' },
              { label: 'VAV Terminal Boxes', val: '45 VAV Boxes (Zone Climatization)', state: 'ok' },
              { label: 'Smoke & Exhaust Fans', val: '88 units (26 EAF, 34 KEF, 2 LPF, 11 SEF, 15 TEF)', state: 'ok' },
              { label: 'Fire Fighting', val: '50 FM-200 Clean Agent Cylinders', state: 'ok' },
              { label: 'Hydraulic Services', val: '15 DW-WM Water Flow Meters', state: 'ok' }
            ]
          },
          '2F': {
            name: 'Second Floor (Retail Atrium & Commercial Concessions)',
            devices: 423, working: 421, fault: 2,
            items: [
              { label: 'AHU (Air Handling)', val: '26 units (25 Working, 1 Fault)', state: 'warn' },
              { label: 'FCU Fan Coils', val: '325 units (312 Working, 13 Alert)', state: 'warn' },
              { label: 'VAV Terminal Boxes', val: '41 VAV Boxes (Auto Dampers)', state: 'ok' },
              { label: 'Exhaust & Smoke', val: '55 units (5 EAF, 2 KEF, 24 SEF, 4 TEF)', state: 'ok' },
              { label: 'Fire Fighting', val: '18 FM-200 Cylinders', state: 'ok' },
              { label: 'Hydraulic Services', val: '4 DW-WM Water Meters', state: 'ok' }
            ]
          },
          '3F': {
            name: 'Third Floor (Airline Lounges & Administration)',
            devices: 377, working: 376, fault: 1,
            items: [
              { label: 'AHU (Air Handling)', val: '31 units (31 Working, 0 Fault)', state: 'ok' },
              { label: 'FCU Fan Coils', val: '230 units (228 Working, 2 Alert)', state: 'ok' },
              { label: 'Ventilation Fans', val: '55 units (9 EAF, 12 KEF, 6 LPF, 17 SEF, 4 SPF, 7 TEF)', state: 'ok' },
              { label: 'Fire Fighting', val: '35 FM-200 Clean Agent Cylinders', state: 'ok' },
              { label: 'Hydraulic Services', val: '21 DW-WM Water Flow Meters', state: 'ok' },
              { label: 'HVAC Air Units', val: '2 PAU Primary Air, 3 MAU Make-up Air', state: 'ok' }
            ]
          },
          '4F': {
            name: 'Fourth Floor (ATC Tower & Fire Command Center)',
            devices: 53, working: 53, fault: 0,
            items: [
              { label: 'AHU (Air Handling)', val: '23 units (23 Working, 0 Fault)', state: 'ok' },
              { label: 'Fans Network', val: '24 units (4 KEF, 10 SEF, 10 TEF)', state: 'ok' },
              { label: 'Fire Command FM200', val: '6 Dedicated FM-200 Suppression Units', state: 'ok' },
              { label: 'Status Readiness', val: '100% Critical Operational Uptime', state: 'ok' }
            ]
          }
        }[maximizedFloor] || { name: 'Terminal Level', devices: 29, working: 28, fault: 1, items: [] };

        return (
          <div className="scada-modal-overlay animate-fadeIn" onClick={() => setMaximizedFloor(null)}>
            <div className="scada-modal-dialog" onClick={e => e.stopPropagation()}>
              <div className="scada-modal-header">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Maximize2 size={16} className="text-cyan-400" />
                    <span className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                      {maximizedFloor} — {floorData.name}
                    </span>
                  </div>

                  {/* Quick Floor Switcher Pills */}
                  <div className="flex items-center gap-1 bg-black/40 p-1 rounded border border-zinc-800">
                    {['PIT', 'GF', '1F', '2F', '3F', '4F'].map(fId => (
                      <button
                        key={fId}
                        className={`px-2 py-0.5 text-3xs font-mono font-bold rounded transition-colors ${maximizedFloor === fId ? 'bg-sky-500 text-white' : 'text-zinc-400 hover:text-white'}`}
                        onClick={() => setMaximizedFloor(fId)}
                      >
                        {fId}
                      </button>
                    ))}
                  </div>

                  {maximizedFloor === '1F' && (
                    <span className="scada-alert-pill critical animate-pulse">Zone 23 Fault</span>
                  )}
                </div>

                <button 
                  className="scada-modal-close-btn"
                  onClick={() => setMaximizedFloor(null)}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="scada-modal-body">
                <div className="scada-modal-schematic-wrap">
                  <FloorSchematic 
                    hasAlert={maximizedFloor === '1F'} 
                    alertZone="23"
                    onZoneClick={(zid) => console.log('Inspect zone', zid)}
                    compact={false}
                  />
                </div>

                {/* Requirements Inventory Telemetry directly from Operational screen.xlsx */}
                <div className="p-3 bg-zinc-950 border-t border-zinc-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-3xs font-bold text-zinc-400 uppercase">
                        OPERATIONAL SCREEN INVENTORY (LTIA FRS/ICD)
                      </span>
                      <span className="text-3xs font-mono text-emerald-400 font-bold">
                        {floorData.working} Working
                      </span>
                      {floorData.fault > 0 && (
                        <span className="text-3xs font-mono text-red-400 font-bold">
                          • {floorData.fault} Fault / Alert
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-3xs text-zinc-500">
                      Total Tracked Points: {floorData.devices}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {floorData.items.map((item, idx) => (
                      <div key={idx} className="p-2 bg-zinc-900/60 rounded border border-zinc-800/80 flex flex-col">
                        <span className="text-3xs text-zinc-400 font-mono font-semibold truncate">{item.label}</span>
                        <span className={`text-2xs font-mono font-bold truncate ${item.state === 'crit' ? 'text-red-400' : item.state === 'warn' ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {item.val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="scada-modal-details-bar">
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-zinc-400">Total Pier Zones: <strong className="text-white">29</strong></span>
                    <span className="text-zinc-400">Boarding Gates: <strong className="text-emerald-400">55 Gates</strong></span>
                    <span className="text-zinc-400">Integration: <strong className="text-cyan-400">AVEVA UOC / BACnet / OPC UA</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      className="btn btn-secondary btn-sm font-mono text-xs flex items-center gap-1.5"
                      onClick={() => navigate('/digital-twin')}
                    >
                      <span>3D Digital Twin</span>
                      <ArrowRight size={12} />
                    </button>
                    <button 
                      className="btn btn-primary btn-sm font-mono text-xs flex items-center gap-1.5"
                      onClick={() => navigate('/subsystems')}
                    >
                      <span>All Subsystems</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================
          MODAL: Alert Quick Inspector with Real Telemetry & Actions
          ======================================================== */}
      {selectedAlert && (
        <div className="scada-modal-overlay animate-fadeIn" onClick={() => setSelectedAlert(null)}>
          <div className="scada-modal-dialog alert-inspector-dialog" onClick={e => e.stopPropagation()}>
            <div className="scada-modal-header">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-400" />
                <span className="font-mono text-sm font-bold text-white uppercase">
                  ALERT TELEMETRY — {selectedAlert.id} ({selectedAlert.system})
                </span>
              </div>
              <button className="scada-modal-close-btn" onClick={() => setSelectedAlert(null)}>
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <span className={`scada-alert-pill ${selectedAlert.severity}`}>
                  {(selectedAlert.badge || selectedAlert.severity).toUpperCase()} SEVERITY
                </span>
                <span className="font-mono text-xs text-zinc-400">{selectedAlert.time}</span>
              </div>

              <div>
                <span className="text-xs text-zinc-400 uppercase font-mono block mb-1">Alert Description</span>
                <p className="text-sm font-medium text-white bg-zinc-900/80 p-3 rounded border border-zinc-800">
                  {selectedAlert.message}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 bg-zinc-900/60 rounded border border-zinc-800/80">
                  <span className="text-zinc-500 block text-3xs mb-1">CORRELATED SYSTEM</span>
                  <span className="text-cyan-400 font-bold">{selectedAlert.system} SCADA Node</span>
                </div>
                <div className="p-3 bg-zinc-900/60 rounded border border-zinc-800/80">
                  <span className="text-zinc-500 block text-3xs mb-1">IMPACT ZONE</span>
                  <span className="text-amber-400 font-bold">{selectedAlert.location || 'Terminal Concourse Pier'}</span>
                </div>
              </div>

              {/* Recommended SOP Step */}
              <div className="p-3 bg-zinc-950/80 rounded border border-zinc-800 text-xs font-mono">
                <span className="text-zinc-400 block text-3xs uppercase font-bold mb-1 text-cyan-400">
                  RECOMMENDED SOP ESCALATION (SOP-01/04)
                </span>
                <p className="text-zinc-300 m-0 text-3xs leading-relaxed">
                  Acknowledge BACnet/OPC-UA alarm event. Command automated CCTV preset pan to zone coordinates. Verify secondary redundant feed before field dispatch.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button 
                  className="btn btn-ghost btn-sm text-xs font-mono"
                  onClick={() => setSelectedAlert(null)}
                >
                  Close
                </button>
                
                {/* Inspect Equipment Action */}
                <button
                  className="btn btn-secondary btn-sm text-xs font-mono flex items-center gap-1.5"
                  onClick={() => {
                    const eq = equipmentList?.find(
                      item => item.id === selectedAlert.equipment || item.name === selectedAlert.equipment
                    );
                    setSelectedAlert(null);
                    if (eq && onSelectEquipment) {
                      onSelectEquipment(eq);
                    } else if (onSelectEquipment) {
                      onSelectEquipment({
                        id: selectedAlert.equipment || 'EQ-NODE',
                        name: `${selectedAlert.system} - ${selectedAlert.subsystem || 'Asset'}`,
                        system: selectedAlert.system,
                        floor: selectedAlert.location?.split(',')?.pop()?.trim() || 'GF',
                        location: selectedAlert.location,
                        status: selectedAlert.severity === 'critical' ? 'critical' : 'warning',
                        temp: 28.4,
                        health: 48,
                        mode: 'manual'
                      });
                    }
                  }}
                >
                  <Eye size={12} />
                  <span>Inspect Asset Telemetry</span>
                </button>

                {/* Subsystem Navigation */}
                <button 
                  className="btn btn-secondary btn-sm text-xs font-mono flex items-center gap-1"
                  onClick={() => {
                    setSelectedAlert(null);
                    navigate(`/subsystems/${selectedAlert.system}`);
                  }}
                >
                  <ExternalLink size={12} />
                  <span>Subsystem View</span>
                </button>

                {/* Live Acknowledge */}
                {!selectedAlert.acknowledged && (
                  <button 
                    className="btn btn-primary btn-sm text-xs font-mono flex items-center gap-1"
                    onClick={() => {
                      acknowledgeAlert(selectedAlert.id);
                      setSelectedAlert(null);
                    }}
                  >
                    <Check size={12} />
                    <span>Acknowledge Alarm</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
