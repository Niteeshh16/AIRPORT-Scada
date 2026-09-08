import React from 'react';
import { 
  Activity, AlertTriangle, CheckCircle2, Wind, Thermometer, 
  Droplets, Zap, ChevronRight, Maximize2 
} from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';

// 29-Zone Geometric Definitions for Long Thanh Terminal 1
// Matching the official SCADA schematic
const NORTH_PIER_ZONES = [
  { id: '37', x: 210, y: 32, w: 24, h: 19 },
  { id: '36', x: 210, y: 53, w: 24, h: 19 },
  { id: '35', x: 210, y: 74, w: 24, h: 19 },
  { id: '34', x: 210, y: 95, w: 24, h: 19 },
  { id: '33', x: 210, y: 116, w: 24, h: 19 },
];

const WEST_PIER_ZONES = [
  { id: '24', x: 55, y: 115, w: 26, h: 17, rot: -20 },
  { id: '23', x: 88, y: 127, w: 26, h: 17, rot: -20 },
  { id: '22', x: 121, y: 139, w: 26, h: 17, rot: -20 },
  { id: '21', x: 154, y: 151, w: 26, h: 17, rot: -20 },
];

const EAST_PIER_ZONES = [
  { id: '44', x: 365, y: 115, w: 26, h: 17, rot: 20 },
  { id: '43', x: 332, y: 127, w: 26, h: 17, rot: 20 },
  { id: '42', x: 299, y: 139, w: 26, h: 17, rot: 20 },
  { id: '41', x: 266, y: 151, w: 26, h: 17, rot: 20 },
];

const HUB_UPPER_ZONES = [
  { id: '31', x: 175, y: 152, w: 14, h: 17 },
  { id: '11', x: 188, y: 152, w: 12, h: 17 },
  { id: '12', x: 199, y: 152, w: 11, h: 17 },
  { id: '13', x: 210, y: 152, w: 12, h: 17 },
  { id: '14', x: 221, y: 152, w: 11, h: 17 },
  { id: '15', x: 232, y: 152, w: 12, h: 17 },
  { id: '32', x: 245, y: 152, w: 14, h: 17 },
];

const HUB_MIDDLE_ZONES = [
  { id: '01', x: 177, y: 182, w: 18, h: 19 },
  { id: '02', x: 196, y: 182, w: 18, h: 19 },
  { id: '03', x: 210, y: 182, w: 18, h: 19 },
  { id: '04', x: 224, y: 182, w: 18, h: 19 },
  { id: '05', x: 243, y: 182, w: 18, h: 19 },
];

const HUB_LOWER_ZONES = [
  { id: '51', x: 177, y: 212, w: 18, h: 17 },
  { id: '52', x: 196, y: 212, w: 18, h: 17 },
  { id: '53', x: 210, y: 212, w: 18, h: 17 },
  { id: '54', x: 224, y: 212, w: 18, h: 17 },
  { id: '55', x: 243, y: 212, w: 18, h: 17 },
];

export function TerminalSchematicSvg({ hasCritical = false, alertZone = '23' }) {
  return (
    <svg
      viewBox="0 0 420 250"
      width="100%"
      height="100%"
      style={{ background: '#020408', display: 'block' }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <pattern id="microGridBlueprint" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
        </pattern>
        <filter id="zoneGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <rect width="420" height="250" fill="url(#microGridBlueprint)" />

      {/* Terminal Pier Structural Contours */}
      <g stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.9" fill="none">
        {/* North Pier Spire */}
        <path d="M 198,22 L 222,22 L 222,126 L 198,126 Z" />

        {/* West Wing Pier */}
        <path d="M 42,107 L 167,152 L 161,170 L 36,125 Z" />

        {/* East Wing Pier */}
        <path d="M 378,107 L 253,152 L 259,170 L 384,125 Z" />

        {/* Concourse Core */}
        <path d="M 166,143 L 254,143 L 258,226 L 162,226 Z" stroke="rgba(255, 255, 255, 0.22)" strokeDasharray="3 2" />
        <path d="M 162,226 L 258,226" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="1.2" />
      </g>

      {/* 1. North Pier Zones (37, 36, 35, 34, 33) */}
      {NORTH_PIER_ZONES.map(z => (
        <g key={z.id}>
          <rect
            x={z.x - z.w / 2}
            y={z.y - z.h / 2}
            width={z.w}
            height={z.h}
            fill="rgba(15, 23, 42, 0.7)"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="0.75"
            rx="2"
          />
          <text
            x={z.x}
            y={z.y}
            fill="#e2e8f0"
            fontSize="9"
            fontWeight="600"
            fontFamily="'JetBrains Mono', monospace"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {z.id}
          </text>
        </g>
      ))}

      {/* 2. West Wing Pier Zones (24, 23, 22, 21) */}
      {WEST_PIER_ZONES.map(z => {
        const isFaulted = hasCritical && z.id === alertZone;
        return (
          <g key={z.id} transform={`rotate(${z.rot}, ${z.x}, ${z.y})`}>
            <rect
              x={z.x - z.w / 2}
              y={z.y - z.h / 2}
              width={z.w}
              height={z.h}
              fill={isFaulted ? 'rgba(239, 68, 68, 0.25)' : 'rgba(15, 23, 42, 0.7)'}
              stroke={isFaulted ? '#ef4444' : 'rgba(255, 255, 255, 0.2)'}
              strokeWidth={isFaulted ? '1.5' : '0.75'}
              rx="2"
              filter={isFaulted ? 'url(#zoneGlow)' : undefined}
            />
            {isFaulted ? (
              <g>
                <circle cx={z.x} cy={z.y} r="13" fill="rgba(239, 68, 68, 0.35)" className="pulse-ring-anim" />
                <circle cx={z.x} cy={z.y} r="6.5" fill="#ef4444" />
                <text
                  x={z.x}
                  y={z.y}
                  fill="#ffffff"
                  fontSize="8"
                  fontWeight="800"
                  fontFamily="'JetBrains Mono', monospace"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {z.id}
                </text>
              </g>
            ) : (
              <text
                x={z.x}
                y={z.y}
                fill="#e2e8f0"
                fontSize="9"
                fontWeight="600"
                fontFamily="'JetBrains Mono', monospace"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {z.id}
              </text>
            )}
          </g>
        );
      })}

      {/* 3. East Wing Pier Zones (44, 43, 42, 41) */}
      {EAST_PIER_ZONES.map(z => (
        <g key={z.id} transform={`rotate(${z.rot}, ${z.x}, ${z.y})`}>
          <rect
            x={z.x - z.w / 2}
            y={z.y - z.h / 2}
            width={z.w}
            height={z.h}
            fill="rgba(15, 23, 42, 0.7)"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="0.75"
            rx="2"
          />
          <text
            x={z.x}
            y={z.y}
            fill="#e2e8f0"
            fontSize="9"
            fontWeight="600"
            fontFamily="'JetBrains Mono', monospace"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {z.id}
          </text>
        </g>
      ))}

      {/* 4. Concourse Core - Upper Hub Row */}
      {HUB_UPPER_ZONES.map(z => (
        <g key={z.id}>
          <rect
            x={z.x - z.w / 2}
            y={z.y - z.h / 2}
            width={z.w}
            height={z.h}
            fill="rgba(15, 23, 42, 0.7)"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="0.75"
            rx="1.5"
          />
          <text
            x={z.x}
            y={z.y}
            fill="#e2e8f0"
            fontSize="8"
            fontWeight="600"
            fontFamily="'JetBrains Mono', monospace"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {z.id}
          </text>
        </g>
      ))}

      {/* 5. Concourse Core - Middle Hub Row */}
      {HUB_MIDDLE_ZONES.map(z => (
        <g key={z.id}>
          <rect
            x={z.x - z.w / 2}
            y={z.y - z.h / 2}
            width={z.w}
            height={z.h}
            fill="rgba(15, 23, 42, 0.7)"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="0.75"
            rx="2"
          />
          <text
            x={z.x}
            y={z.y}
            fill="#e2e8f0"
            fontSize="9"
            fontWeight="600"
            fontFamily="'JetBrains Mono', monospace"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {z.id}
          </text>
        </g>
      ))}

      {/* 6. Concourse Core - Lower Hub Row */}
      {HUB_LOWER_ZONES.map(z => (
        <g key={z.id}>
          <rect
            x={z.x - z.w / 2}
            y={z.y - z.h / 2}
            width={z.w}
            height={z.h}
            fill="rgba(15, 23, 42, 0.7)"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="0.75"
            rx="2"
          />
          <text
            x={z.x}
            y={z.y}
            fill="#e2e8f0"
            fontSize="9"
            fontWeight="600"
            fontFamily="'JetBrains Mono', monospace"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {z.id}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function MultiFloorMapGrid({ selectedFloor, onSelectFloor, fullView = true, compact = false }) {
  // Conforming to official LTIA LBMS Operational Screen 1 floor distribution & telemetry
  const floorList = [
    {
      id: 'PIT',
      code: 'PIT',
      label: 'PIT Level',
      desc: 'Sub-Basement & Utility Tunnels',
      health: 100,
      sla: '100%',
      temp: '21.8°C',
      rh: '48%',
      ahu: '14 AHU',
      fcu: '68 FCU',
      elec: '40 ACB / 18 VCB',
      faults: 0,
    },
    {
      id: 'GF',
      code: 'GF',
      label: 'Ground Floor',
      desc: 'Arrivals & Baggage Reclaim Hall',
      health: 98.4,
      sla: '98.4%',
      temp: '23.1°C',
      rh: '54%',
      ahu: '109 AHU (9 Flt)',
      fcu: '574 FCU',
      elec: '23 CRAH / 114 Fans',
      faults: 9,
    },
    {
      id: '1F',
      code: '1F',
      label: 'First Floor',
      desc: 'Departures & Passenger Gates',
      hasAlert: true,
      alertZone: '23',
      alertMsg: 'AHU-1F-04 Static Pressure Low',
      health: 94.8,
      sla: '94.8%',
      temp: '24.2°C',
      rh: '58%',
      ahu: '43 AHU (2 Flt)',
      fcu: '238 FCU',
      elec: '60 Fans / 24 VDGS',
      faults: 2,
    },
    {
      id: '2F',
      code: '2F',
      label: 'Second Floor',
      desc: 'Transfers & Airline VIP Lounges',
      health: 99.1,
      sla: '99.1%',
      temp: '22.4°C',
      rh: '51%',
      ahu: '26 AHU (1 Flt)',
      fcu: '325 FCU',
      elec: '50 Fans / 32 SACS',
      faults: 1,
    },
    {
      id: '3F',
      code: '3F',
      label: 'Third Floor',
      desc: 'Commercial & Duty-Free Gallery',
      health: 98.8,
      sla: '98.8%',
      temp: '22.9°C',
      rh: '53%',
      ahu: '31 AHU (1 Flt)',
      fcu: '236 FCU',
      elec: '48 Fans / 18 VAV',
      faults: 1,
    },
    {
      id: '4F',
      code: '4F',
      label: 'Fourth Floor',
      desc: 'HVAC Mechanical Plant & Penthouse',
      health: 100,
      sla: '100%',
      temp: '25.0°C',
      rh: '46%',
      ahu: '11 AHU',
      fcu: '86 FCU',
      elec: '22 Fans / 8 DDC',
      faults: 0,
    },
  ];

  return (
    <div className={`multi-floor-grid ${fullView ? 'full-map-view' : ''} ${compact ? 'compact' : ''}`}>
      {floorList.map(floor => {
        const isSelected = selectedFloor === floor.id;
        const hasCritical = Boolean(floor.hasAlert);
        const statusColor = hasCritical ? '#ef4444' : floor.faults > 0 ? '#f59e0b' : '#22c55e';

        return (
          <div
            key={floor.id}
            className={`floor-tile-card ${isSelected ? 'selected' : ''} ${hasCritical ? 'has-critical' : ''}`}
            onClick={() => onSelectFloor?.(floor.id)}
            title={`Click to focus on ${floor.label} (${floor.desc})`}
          >
            {/* 1. Header: Floor Code Badge, Title, Description, and Live Status */}
            <div className="floor-tile-header">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`floor-tile-badge ${hasCritical ? 'alert' : ''}`}>
                  {floor.code}
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="floor-tile-name truncate">{floor.label}</span>
                  <span className="floor-tile-desc text-3xs text-secondary truncate">{floor.desc}</span>
                </div>
              </div>

              {/* Status Pill */}
              {hasCritical ? (
                <span className="floor-alert-pill">
                  <span className="live-dot-badge red pulse-fast" style={{ width: 6, height: 6 }} />
                  <span>ZONE {floor.alertZone} FAULT</span>
                </span>
              ) : (
                <span className="floor-normal-pill">
                  <span className="live-dot-badge green" style={{ width: 5, height: 5 }} />
                  <span>{floor.sla} SLA</span>
                </span>
              )}
            </div>

            {/* 2. Interactive SVG Blueprint Diagram */}
            <div className="floor-tile-blueprint">
              <TerminalSchematicSvg hasCritical={hasCritical} alertZone={floor.alertZone || '23'} />
              
              {/* Overlay hover prompt */}
              <div className="floor-blueprint-overlay">
                <span>Click to Focus Floor</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* 3. Operational Details Bar (Equipment Inventory & Ambient IEQ) */}
            <div className="floor-tile-details">
              <div className="floor-details-row">
                <div className="floor-metric-chip" title="Air Handling Units">
                  <Wind size={11} className="text-teal" />
                  <span>{floor.ahu}</span>
                </div>
                <div className="floor-metric-chip" title="Fan Coil Units">
                  <Activity size={11} className="text-blue" />
                  <span>{floor.fcu}</span>
                </div>
                <div className="floor-metric-chip" title="Ambient Indoor Temperature">
                  <Thermometer size={11} className="text-amber" />
                  <span>{floor.temp}</span>
                </div>
                <div className="floor-metric-chip" title="Relative Humidity">
                  <Droplets size={11} className="text-cyan" />
                  <span>{floor.rh}</span>
                </div>
              </div>

              {/* Floor Footer Strip: Subsystems & Health Progress */}
              <div className="floor-details-footer">
                <span className="text-3xs font-mono text-tertiary truncate">
                  {floor.elec}
                </span>
                <span 
                  className="font-mono text-3xs font-bold"
                  style={{ color: statusColor }}
                >
                  {hasCritical ? 'FAULT' : `${floor.health}% HEALTH`}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
