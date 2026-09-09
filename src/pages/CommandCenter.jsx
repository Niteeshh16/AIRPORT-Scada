import React, { useState, useEffect } from 'react';
import {
  Package, Activity, Zap, Server, ShieldCheck, Volume2,
  Flame, Clock, Wind, PlaneLanding, ScanLine, DoorOpen,
  AlertTriangle, CheckCircle2, ChevronRight, ArrowRight,
  RefreshCw, Radio, Layers, Maximize2, X, Check, Eye,
  Cpu, Wrench, Shield
} from 'lucide-react';
import MultiFloorMapGrid, { FloorSchematic } from '../components/MultiFloorMapGrid';
import { useNavigate } from 'react-router-dom';

// 12 Building Subsystems matching user's exact reference image
const SUBSYSTEMS_REFERENCE = [
  {
    code: 'BHS',
    name: 'Baggage Handling',
    icon: Package,
    statusDot: '2',
    dotColor: '#ef4444',
    avail: '97%',
    availNum: 97,
    alert: 'Alert: Conveyor Belt C3 running at reduced speed',
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
    alert: 'All docking systems operational',
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
    alert: 'All monitoring systems operational',
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
    name: 'Supervisory Control',
    icon: Server,
    statusDot: '1',
    dotColor: '#ef4444',
    avail: '97%',
    availNum: 97,
    alert: 'Warning: High temperature detected in Zone 02',
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
    alert: 'Alert: Door sensor offline at Gate 7',
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
    alert: 'All announcement systems operational',
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
    alert: 'All fire detection systems operational',
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
    alert: 'Time sync accuracy at 99.8%',
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
    name: 'HVAC',
    icon: Wind,
    statusDot: '1',
    dotColor: '#f59e0b',
    avail: '94%',
    availNum: 94,
    alert: 'Warning: HVAC Unit 3 temperature deviation',
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
    alert: 'Alert: Stand 12 status sensor offline',
    time: '18s ago',
    alertSeverity: 'warn',
    assets: '3/4',
    on: 3,
    warn: 1,
    off: 0,
    total: 4,
  },
  {
    code: 'SSE',
    name: 'Security Screening',
    icon: ScanLine,
    statusDot: '2',
    dotColor: '#ef4444',
    avail: '96%',
    availNum: 96,
    alert: 'Alert: Scanner #5 requires calibration',
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
    name: 'Gate Access Control',
    icon: DoorOpen,
    statusDot: '1',
    dotColor: '#f59e0b',
    avail: '96%',
    availNum: 96,
    alert: 'Warning: Gate 15 access control delayed response',
    time: '18s ago',
    alertSeverity: 'warn',
    assets: '3/4',
    on: 3,
    warn: 1,
    off: 0,
    total: 4,
  },
];

// Recent Alerts from right sidebar
const RECENT_ALERTS_DATA = [
  {
    id: 'ALT-101',
    system: 'BHS',
    severity: 'critical',
    badge: 'Critical',
    message: 'Conveyor jam detected in sorting unit 3',
    time: '24m ago',
    dotColor: '#ef4444',
  },
  {
    id: 'ALT-102',
    system: 'BHS',
    severity: 'critical',
    badge: 'Critical',
    message: 'Baggage tag scan failure rate >5% threshold',
    time: '27m ago',
    dotColor: '#ef4444',
  },
  {
    id: 'ALT-103',
    system: 'SCADA',
    severity: 'high',
    badge: 'High',
    message: 'Lighting control fault in apron zone 5 (SCADA)',
    time: '31m ago',
    dotColor: '#f97316',
  },
  {
    id: 'ALT-104',
    system: 'LBMS',
    severity: 'medium',
    badge: 'Medium',
    message: 'Temperature deviation in Zone 2 (26.5°C, target 24°C)',
    time: '37m ago',
    dotColor: '#eab308',
  },
  {
    id: 'ALT-105',
    system: 'SCADA',
    severity: 'medium',
    badge: 'Medium',
    message: 'Power consumption spike in HDR-12 (>82% capacity)',
    time: '44m ago',
    dotColor: '#eab308',
  },
];

export default function CommandCenter({ onSelectEquipment }) {
  const navigate = useNavigate();
  const [commMode, setCommMode] = useState('AUTO');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastDataSecs, setLastDataSecs] = useState('01:42');
  const [maximizedFloor, setMaximizedFloor] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastDataSecs('00:01');
    }, 600);
  };

  return (
    <div className="command-center-root">
      
      {/* Top Level Operational KPI Cards */}
      <div className="stat-grid stat-grid-4">
        <div className="stat-card" onClick={() => navigate('/equipment')} style={{ cursor: 'pointer' }} title="View All Assets">
          <div className="stat-icon blue"><Cpu size={18} /></div>
          <div className="stat-content">
            <div className="stat-value">2,684</div>
            <div className="stat-label">Total Monitored Assets</div>
            <div className="stat-note">12 Subsystems Connected</div>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate('/alerts')} style={{ cursor: 'pointer' }} title="View Active Alarms">
          <div className="stat-icon red"><AlertTriangle size={18} /></div>
          <div className="stat-content">
            <div className="stat-value">14</div>
            <div className="stat-label">Active System Alarms</div>
            <div className="stat-note">2 Critical • 5 High</div>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate('/work-orders')} style={{ cursor: 'pointer' }} title="View Work Orders">
          <div className="stat-icon yellow"><Wrench size={18} /></div>
          <div className="stat-content">
            <div className="stat-value">7</div>
            <div className="stat-label">Open Work Orders</div>
            <div className="stat-note">3 In Progress • 4 Dispatched</div>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate('/subsystems')} style={{ cursor: 'pointer' }} title="View Subsystems Directory">
          <div className="stat-icon green"><Activity size={18} /></div>
          <div className="stat-content">
            <div className="stat-value">97.4%</div>
            <div className="stat-label">Overall Fleet Availability</div>
            <div className="stat-note">Dual Redundant BACnet/OPC-UA</div>
          </div>
        </div>
      </div>

      {/* 2-Column Responsive SCADA Layout matching user reference image */}
      <div className="command-center-workspace">
        
        {/* ========================================================
            LEFT COLUMN (76% Width): Terminal Floors + Subsystems Grid
            ======================================================== */}
        <div className="scada-primary-col">
          
          {/* 1. 6-Floor Terminal Schematics Grid (3 columns x 2 rows) */}
          <div className="scada-floors-container">
            <MultiFloorMapGrid 
              activeFloorId="1F"
              onSelectFloor={(floorId) => {
                // floor clicked
              }}
              onMaximize={(floorId) => setMaximizedFloor(floorId || '4F')}
            />
          </div>

          {/* 2. Building Subsystems Section (4 columns x 3 rows = 12 cards) */}
          <div className="scada-subsystems-section">
            <div className="scada-subsystems-header">
              <div className="flex items-center gap-2">
                <span className="scada-subsystems-title">BUILDING SUBSYSTEMS</span>
              </div>
              <span className="scada-subsystems-status-tag">11/12 operational</span>
            </div>

            <div className="scada-subsystems-cards-grid">
              {SUBSYSTEMS_REFERENCE.map(sys => {
                const Icon = sys.icon;
                const onPercent = (sys.on / sys.total) * 100;
                const warnPercent = (sys.warn / sys.total) * 100;
                const offPercent = (sys.off / sys.total) * 100;

                return (
                  <div 
                    key={sys.code}
                    className="scada-subsystem-card"
                    onClick={() => navigate(`/subsystems/${sys.code}`)}
                    title={`View ${sys.code} - ${sys.name} telemetry`}
                  >
                    {/* Top Row: Icon + Code + Name + Status Dot */}
                    <div className="subsys-card-header">
                      <div className="subsys-id-group">
                        <div className="subsys-icon-box">
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
                          style={{ backgroundColor: sys.dotColor }}
                        />
                        {sys.statusDot && (
                          <span className="subsys-indicator-count">{sys.statusDot}</span>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Avail. + Percentage + Thin Progress Bar */}
                    <div className="subsys-avail-section">
                      <div className="subsys-avail-info">
                        <span className="subsys-label">Avail.</span>
                        <span className="subsys-avail-val">{sys.avail}</span>
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

                    {/* Row 3: Alert / Operational message + Timestamp */}
                    <div className="subsys-alert-section">
                      <span className={`subsys-alert-msg ${sys.alertSeverity}`}>
                        {sys.alert}
                      </span>
                      <span className="subsys-alert-time">{sys.time}</span>
                    </div>

                    {/* Row 4: Assets + Multi-Segment Track + 3 Color Counts */}
                    <div className="subsys-assets-section">
                      <div className="subsys-assets-info">
                        <span className="subsys-label">Assets</span>
                        <span className="subsys-assets-val">{sys.assets}</span>
                      </div>

                      {/* 3-Color Segmented Track */}
                      <div className="subsys-assets-track">
                        <div className="subsys-seg seg-on" style={{ width: `${onPercent}%` }} />
                        <div className="subsys-seg seg-warn" style={{ width: `${warnPercent}%` }} />
                        <div className="subsys-seg seg-off" style={{ width: `${offPercent}%` }} />
                      </div>

                      {/* Color Coded Counters Below Bar */}
                      <div className="subsys-assets-counts">
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

        </div>

        {/* ========================================================
            RIGHT COLUMN (24% Width): SCADA Ops & Real-Time Alerts
            ======================================================== */}
        <div className="scada-secondary-col">
          
          {/* 1. Last Data Received Header */}
          <div className="scada-ops-header">
            <div className="flex items-center gap-1.5 text-secondary">
              <RefreshCw 
                size={13} 
                className={`cursor-pointer hover:text-cyan-400 transition-transform ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`}
                onClick={handleRefresh}
                title="Force Telemetry Sync"
              />
              <span className="scada-ops-header-label">Last Data Received</span>
            </div>
            <span className="scada-ops-timestamp font-mono">{lastDataSecs}</span>
          </div>

          {/* 2. Recent Alerts Panel */}
          <div className="scada-panel-card recent-alerts-panel">
            <div className="scada-panel-header">
              <div className="flex items-center gap-2">
                <span className="scada-panel-dot-red" />
                <span className="scada-panel-title">Recent Alerts</span>
                <span className="scada-panel-badge-count">14</span>
              </div>
              <button 
                onClick={() => navigate('/alerts')}
                className="scada-panel-link"
                title="View All Alerts"
              >
                <span>All</span>
                <ChevronRight size={12} />
              </button>
            </div>

            <div className="recent-alerts-list">
              {RECENT_ALERTS_DATA.map(alert => (
                <div 
                  key={alert.id}
                  className={`scada-alert-item ${alert.severity}`}
                  onClick={() => setSelectedAlert(alert)}
                >
                  <div className="scada-alert-top">
                    <div className="flex items-center gap-1.5">
                      <span className="scada-alert-dot" style={{ backgroundColor: alert.dotColor }} />
                      <span className="scada-alert-sys font-mono">{alert.system}</span>
                      <span className={`scada-alert-pill ${alert.severity}`}>{alert.badge}</span>
                    </div>
                    <span className="scada-alert-time">{alert.time}</span>
                  </div>
                  <div className="scada-alert-body">
                    {alert.message}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Comm. Channel Architecture Diagram */}
          <div className="scada-panel-card comm-channel-panel">
            <div className="scada-panel-header">
              <div className="flex items-center gap-2">
                <Radio size={13} className="text-amber-400" />
                <span className="scada-panel-title">Comm. Channel</span>
              </div>
              
              {/* Channel Mode Toggle Buttons */}
              <div className="comm-channel-toggles">
                {['AUTO', 'LMS', 'LINK', 'HBMS', 'CLEAR'].map(mode => (
                  <button
                    key={mode}
                    className={`comm-toggle-btn ${commMode === mode ? 'active' : ''}`}
                    onClick={() => setCommMode(mode)}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Node Link Diagram */}
            <div className="comm-node-diagram">
              
              {/* Left Node: ALL SUBSYSTEM */}
              <div className="comm-node-box node-subsystem">
                <div className="comm-node-icon">
                  <Layers size={14} className="text-amber-400" />
                </div>
                <div className="comm-node-num">33</div>
                <div className="comm-node-label">ALL SUBSYSTEM</div>
                <div className="comm-node-sub">12 Systems</div>
                <div className="comm-node-status operational">OPERABLE</div>
              </div>

              {/* Animated Connection Bridge */}
              <div className="comm-link-bridge">
                <div className="comm-link-line">
                  <div className="comm-link-pulse" />
                </div>
                <div className="comm-link-tag">Connected</div>
                <div className="comm-link-line">
                  <div className="comm-link-pulse reverse" />
                </div>
              </div>

              {/* Right Node: HBMS Central Platform */}
              <div className="comm-node-box node-hbms">
                <div className="comm-node-icon">
                  <Server size={14} className="text-emerald-400" />
                </div>
                <div className="comm-node-num">8</div>
                <div className="comm-node-label">HBMS</div>
                <div className="comm-node-sub">Central Platform</div>
              </div>

            </div>

            {/* Diagnostic Alert Warning */}
            <div className="comm-channel-warning">
              <AlertTriangle size={12} className="text-amber-400 shrink-0 mt-0.5" />
              <span>BHS subsystem is reporting the issue — the link and HBMS are functional.</span>
            </div>

            <div className="comm-channel-footer">
              <span>Last data refreshed 3s ago</span>
            </div>
          </div>

          {/* 4. Bottom 2x2 SCADA Metric Cards */}
          <div className="scada-kpi-grid">
            
            {/* SYS HEALTH */}
            <div className="scada-kpi-box">
              <span className="kpi-box-title">SYS HEALTH</span>
              <div className="kpi-box-val text-emerald-400">96.9%</div>
              <div className="kpi-box-subs">
                <span className="text-emerald-400">11 OK</span>
                <span className="text-zinc-500">0 down</span>
              </div>
            </div>

            {/* ALERTS */}
            <div className="scada-kpi-box">
              <span className="kpi-box-title">ALERTS</span>
              <div className="kpi-box-val text-red-400">14</div>
              <div className="kpi-box-subs">
                <span className="text-red-400">2 crit</span>
                <span className="text-amber-400">2 med</span>
              </div>
            </div>

            {/* WORK ORDERS */}
            <div className="scada-kpi-box">
              <span className="kpi-box-title">WORK ORDERS</span>
              <div className="kpi-box-val text-amber-400">5</div>
              <div className="kpi-box-subs">
                <span className="text-amber-400">2 open</span>
                <span className="text-emerald-400">1 done</span>
              </div>
            </div>

            {/* ONLINE */}
            <div className="scada-kpi-box">
              <span className="kpi-box-title">ONLINE</span>
              <div className="kpi-box-val text-sky-400">11/12</div>
              <div className="kpi-box-subs">
                <span className="text-sky-400">11 active</span>
                <span className="text-zinc-500">1 off</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================
          MODAL: Maximize Floor Terminal View with Real Requirements Telemetry
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
          MODAL: Alert Quick Inspector
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
                  {selectedAlert.badge.toUpperCase()} SEVERITY
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
                  <span className="text-amber-400 font-bold">Terminal West Pier / Concourse</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button 
                  className="btn btn-ghost btn-sm text-xs font-mono"
                  onClick={() => setSelectedAlert(null)}
                >
                  Dismiss
                </button>
                <button 
                  className="btn btn-secondary btn-sm text-xs font-mono flex items-center gap-1"
                  onClick={() => {
                    navigate(`/subsystems/${selectedAlert.system}`);
                  }}
                >
                  <Eye size={12} />
                  <span>Open Subsystem View</span>
                </button>
                <button 
                  className="btn btn-primary btn-sm text-xs font-mono flex items-center gap-1"
                  onClick={() => {
                    setSelectedAlert(null);
                  }}
                >
                  <Check size={12} />
                  <span>Acknowledge Alarm</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
