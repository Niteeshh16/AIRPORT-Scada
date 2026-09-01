import React from 'react';
import { useLiveData } from '../context/LiveDataContext';

// 29-Zone Geometric Definitions for Long Thanh Terminal 1
// Matching the official SCADA schematic from reference layout
const NORTH_PIER_ZONES = [
  { id: '37', x: 210, y: 32, w: 26, h: 20 },
  { id: '36', x: 210, y: 55, w: 26, h: 20 },
  { id: '35', x: 210, y: 78, w: 26, h: 20 },
  { id: '34', x: 210, y: 101, w: 26, h: 20 },
  { id: '33', x: 210, y: 124, w: 26, h: 20 },
];

const WEST_PIER_ZONES = [
  { id: '24', x: 58, y: 118, w: 28, h: 18, rot: -22 },
  { id: '23', x: 94, y: 133, w: 28, h: 18, rot: -22 },
  { id: '22', x: 130, y: 148, w: 28, h: 18, rot: -22 },
  { id: '21', x: 166, y: 163, w: 28, h: 18, rot: -22 },
];

const EAST_PIER_ZONES = [
  { id: '44', x: 362, y: 118, w: 28, h: 18, rot: 22 },
  { id: '43', x: 326, y: 133, w: 28, h: 18, rot: 22 },
  { id: '42', x: 290, y: 148, w: 28, h: 18, rot: 22 },
  { id: '41', x: 254, y: 163, w: 28, h: 18, rot: 22 },
];

const HUB_UPPER_ZONES = [
  { id: '31', x: 172, y: 154, w: 16, h: 18 },
  { id: '11', x: 188, y: 154, w: 15, h: 18 },
  { id: '12', x: 202, y: 154, w: 15, h: 18 },
  { id: '13', x: 216, y: 154, w: 15, h: 18 },
  { id: '14', x: 230, y: 154, w: 15, h: 18 },
  { id: '15', x: 244, y: 154, w: 15, h: 18 },
  { id: '32', x: 259, y: 154, w: 16, h: 18 },
];

const HUB_MIDDLE_ZONES = [
  { id: '01', x: 178, y: 188, w: 19, h: 20 },
  { id: '02', x: 198, y: 188, w: 19, h: 20 },
  { id: '03', x: 218, y: 188, w: 19, h: 20 },
  { id: '04', x: 238, y: 188, w: 19, h: 20 },
  { id: '05', x: 258, y: 188, w: 19, h: 20 },
];

const HUB_LOWER_ZONES = [
  { id: '51', x: 178, y: 220, w: 19, h: 18 },
  { id: '52', x: 198, y: 220, w: 19, h: 18 },
  { id: '53', x: 218, y: 220, w: 19, h: 18 },
  { id: '54', x: 238, y: 220, w: 19, h: 18 },
  { id: '55', x: 258, y: 220, w: 19, h: 18 },
];

export function TerminalSchematicSvg({ hasCritical = false, alertZone = '23' }) {
  return (
    <svg
      viewBox="0 0 420 260"
      width="100%"
      height="100%"
      style={{ background: '#000000', display: 'block' }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Subtle CAD grid */}
        <pattern id="microGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.015)" strokeWidth="0.5" />
        </pattern>
      </defs>

      <rect width="420" height="260" fill="url(#microGrid)" />

      {/* Main Architectural Pier Contours */}
      <g stroke="rgba(255, 255, 255, 0.28)" strokeWidth="0.9" fill="none">
        {/* North Pier Spire boundary */}
        <path d="M 197,22 L 223,22 L 223,135 L 197,135 Z" />

        {/* West Wing Pier boundary */}
        <path d="M 44,108 L 180,154 L 174,174 L 38,128 Z" />

        {/* East Wing Pier boundary */}
        <path d="M 376,108 L 240,154 L 246,174 L 382,128 Z" />

        {/* Concourse Core outer boundaries */}
        <path d="M 164,145 L 267,145 L 274,238 L 157,238 Z" stroke="rgba(255, 255, 255, 0.2)" strokeDasharray="3 2" />
        <path d="M 157,238 L 274,238" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.2" />
      </g>

      {/* 1. North Pier Zones (37, 36, 35, 34, 33) */}
      {NORTH_PIER_ZONES.map(z => (
        <g key={z.id}>
          <rect
            x={z.x - z.w / 2}
            y={z.y - z.h / 2}
            width={z.w}
            height={z.h}
            fill="rgba(15, 23, 42, 0.65)"
            stroke="rgba(255, 255, 255, 0.22)"
            strokeWidth="0.75"
          />
          <text
            x={z.x}
            y={z.y}
            fill="#ffffff"
            fontSize="9.5"
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
              fill={isFaulted ? 'rgba(245, 166, 35, 0.18)' : 'rgba(15, 23, 42, 0.65)'}
              stroke={isFaulted ? '#f5a623' : 'rgba(255, 255, 255, 0.22)'}
              strokeWidth={isFaulted ? '1.2' : '0.75'}
            />
            {isFaulted ? (
              <g>
                <circle cx={z.x} cy={z.y} r="13" fill="rgba(245, 166, 35, 0.3)" className="pulse-ring-anim" />
                <circle cx={z.x} cy={z.y} r="6.5" fill="#f5a623" />
                <text
                  x={z.x}
                  y={z.y}
                  fill="#000000"
                  fontSize="8.5"
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
                fill="#ffffff"
                fontSize="9.5"
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
            fill="rgba(15, 23, 42, 0.65)"
            stroke="rgba(255, 255, 255, 0.22)"
            strokeWidth="0.75"
          />
          <text
            x={z.x}
            y={z.y}
            fill="#ffffff"
            fontSize="9.5"
            fontWeight="600"
            fontFamily="'JetBrains Mono', monospace"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {z.id}
          </text>
        </g>
      ))}

      {/* 4. Concourse Core - Upper Hub Row (31, 11, 12, 13, 14, 15, 32) */}
      {HUB_UPPER_ZONES.map(z => (
        <g key={z.id}>
          <rect
            x={z.x - z.w / 2}
            y={z.y - z.h / 2}
            width={z.w}
            height={z.h}
            fill="rgba(15, 23, 42, 0.65)"
            stroke="rgba(255, 255, 255, 0.22)"
            strokeWidth="0.75"
          />
          <text
            x={z.x}
            y={z.y}
            fill="#ffffff"
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

      {/* 5. Concourse Core - Middle Hub Row (01, 02, 03, 04, 05) */}
      {HUB_MIDDLE_ZONES.map(z => (
        <g key={z.id}>
          <rect
            x={z.x - z.w / 2}
            y={z.y - z.h / 2}
            width={z.w}
            height={z.h}
            fill="rgba(15, 23, 42, 0.65)"
            stroke="rgba(255, 255, 255, 0.22)"
            strokeWidth="0.75"
          />
          <text
            x={z.x}
            y={z.y}
            fill="#ffffff"
            fontSize="9.5"
            fontWeight="600"
            fontFamily="'JetBrains Mono', monospace"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {z.id}
          </text>
        </g>
      ))}

      {/* 6. Concourse Core - Lower Hub Row (51, 52, 53, 54, 55) */}
      {HUB_LOWER_ZONES.map(z => (
        <g key={z.id}>
          <rect
            x={z.x - z.w / 2}
            y={z.y - z.h / 2}
            width={z.w}
            height={z.h}
            fill="rgba(15, 23, 42, 0.65)"
            stroke="rgba(255, 255, 255, 0.22)"
            strokeWidth="0.75"
          />
          <text
            x={z.x}
            y={z.y}
            fill="#ffffff"
            fontSize="9.5"
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

export default function MultiFloorMapGrid({ selectedFloor, onSelectFloor, fullView = false, compact = false }) {
  const { alerts, equipmentList } = useLiveData();

  const floorList = [
    { id: 'PIT', label: 'PIT Floor', code: 'PIT' },
    { id: 'GF', label: 'Ground Floor', code: 'GF' },
    { id: '1F', label: 'First Floor', code: '1F', hasAlert: true, alertZone: '23' },
    { id: '2F', label: 'Second Floor', code: '2F' },
    { id: '3F', label: 'Third Floor', code: '3F' },
    { id: '4F', label: 'Fourth Floor', code: '4F' },
  ];

  return (
    <div className={`multi-floor-grid ${fullView ? 'full-map-view' : ''} ${compact ? 'compact' : ''}`}>
      {floorList.map(floor => {
        const isSelected = selectedFloor === floor.id;
        const floorAlerts = alerts.filter(a => {
          const eq = equipmentList.find(e => e.id === a.equipment);
          return eq && eq.floor === floor.id;
        });
        const hasCritical = floor.hasAlert || floorAlerts.some(a => a.severity === 'critical');

        return (
          <div
            key={floor.id}
            className={`floor-tile-card ${isSelected ? 'selected' : ''} ${hasCritical ? 'has-critical' : ''}`}
            onClick={() => onSelectFloor?.(floor.id)}
          >
            {/* Tile Header matching Screenshot 1 */}
            <div className="floor-tile-header">
              <div className="flex items-center gap-1.5">
                <span className={`floor-tile-badge ${hasCritical ? 'alert' : ''}`}>{floor.code}</span>
                <span className="floor-tile-name">{floor.label}</span>
              </div>
              {hasCritical && (
                <span className="floor-alert-pill">
                  <span className="live-dot-badge amber" style={{ width: 5, height: 5 }} />
                  Zone {floor.alertZone || '23'}
                </span>
              )}
            </div>

            {/* Pure Black Background Schematic SVG */}
            <div className="floor-tile-blueprint" style={{ flex: 1, minHeight: fullView ? '240px' : '150px', background: '#000000', borderRadius: '4px', overflow: 'hidden' }}>
              <TerminalSchematicSvg hasCritical={hasCritical} alertZone={floor.alertZone || '23'} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
