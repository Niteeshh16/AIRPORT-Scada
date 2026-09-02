import React from 'react';
import { useLiveData } from '../context/LiveDataContext';

// 29-Zone Geometric Definitions for Long Thanh Terminal 1
// Matching the official SCADA schematic from user reference Image 1
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
      style={{ background: '#000000', display: 'block' }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <pattern id="microGrid2" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.015)" strokeWidth="0.5" />
        </pattern>
      </defs>

      <rect width="420" height="250" fill="url(#microGrid2)" />

      {/* Main Architectural Pier Contours */}
      <g stroke="rgba(255, 255, 255, 0.28)" strokeWidth="0.85" fill="none">
        {/* North Pier Spire corridor */}
        <path d="M 198,22 L 222,22 L 222,126 L 198,126 Z" />

        {/* West Wing Pier corridor */}
        <path d="M 42,107 L 167,152 L 161,170 L 36,125 Z" />

        {/* East Wing Pier corridor */}
        <path d="M 378,107 L 253,152 L 259,170 L 384,125 Z" />

        {/* Concourse Core boundaries */}
        <path d="M 166,143 L 254,143 L 258,226 L 162,226 Z" stroke="rgba(255, 255, 255, 0.2)" strokeDasharray="3 2" />
        <path d="M 162,226 L 258,226" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1.2" />
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
              fill={isFaulted ? 'rgba(245, 166, 35, 0.2)' : 'rgba(15, 23, 42, 0.65)'}
              stroke={isFaulted ? '#f5a623' : 'rgba(255, 255, 255, 0.22)'}
              strokeWidth={isFaulted ? '1.4' : '0.75'}
            />
            {isFaulted ? (
              <g>
                <circle cx={z.x} cy={z.y} r="12" fill="rgba(245, 166, 35, 0.3)" className="pulse-ring-anim" />
                <circle cx={z.x} cy={z.y} r="6" fill="#f5a623" />
                <text
                  x={z.x}
                  y={z.y}
                  fill="#000000"
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
                fill="#ffffff"
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

export default function MultiFloorMapGrid({ selectedFloor, onSelectFloor, fullView = false, compact = false }) {
  // Only First Floor (1F) has the active Zone 23 thermal alert matching Screenshot 1
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
        const hasCritical = Boolean(floor.hasAlert);

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
