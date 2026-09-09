import React, { useState } from 'react';
import { Maximize2, AlertCircle } from 'lucide-react';

// Exact 29-Zone Geometric Schematic from the Reference Image
const NORTH_PIER_ZONES = [
  { id: '37', x: 210, y: 32, w: 22, h: 15 },
  { id: '36', x: 210, y: 51, w: 22, h: 15 },
  { id: '35', x: 210, y: 70, w: 22, h: 15 },
  { id: '34', x: 210, y: 89, w: 22, h: 15 },
  { id: '33', x: 210, y: 108, w: 22, h: 15 },
];

const WEST_PIER_ZONES = [
  { id: '24', x: 64, y: 106, w: 24, h: 15, rot: -23 },
  { id: '23', x: 96, y: 119, w: 24, h: 15, rot: -23 },
  { id: '22', x: 128, y: 132, w: 24, h: 15, rot: -23 },
  { id: '21', x: 160, y: 145, w: 24, h: 15, rot: -23 },
];

const EAST_PIER_ZONES = [
  { id: '44', x: 356, y: 106, w: 24, h: 15, rot: 23 },
  { id: '43', x: 324, y: 119, w: 24, h: 15, rot: 23 },
  { id: '42', x: 292, y: 132, w: 24, h: 15, rot: 23 },
  { id: '41', x: 260, y: 145, w: 24, h: 15, rot: 23 },
];

const HUB_UPPER_ZONES = [
  { id: '31', x: 176, y: 148, w: 14, h: 15 },
  { id: '11', x: 189, y: 148, w: 11, h: 15 },
  { id: '12', x: 200, y: 148, w: 10, h: 15 },
  { id: '13', x: 210, y: 148, w: 10, h: 15 },
  { id: '14', x: 220, y: 148, w: 10, h: 15 },
  { id: '15', x: 231, y: 148, w: 11, h: 15 },
  { id: '32', x: 244, y: 148, w: 14, h: 15 },
];

const HUB_MIDDLE_ZONES = [
  { id: '01', x: 177, y: 174, w: 18, h: 17 },
  { id: '02', x: 195, y: 174, w: 18, h: 17 },
  { id: '03', x: 210, y: 174, w: 18, h: 17 },
  { id: '04', x: 225, y: 174, w: 18, h: 17 },
  { id: '05', x: 243, y: 174, w: 18, h: 17 },
];

const HUB_LOWER_ZONES = [
  { id: '51', x: 177, y: 198, w: 18, h: 15 },
  { id: '52', x: 195, y: 198, w: 18, h: 15 },
  { id: '53', x: 210, y: 198, w: 18, h: 15 },
  { id: '54', x: 225, y: 198, w: 18, h: 15 },
  { id: '55', x: 243, y: 198, w: 18, h: 15 },
];

export function FloorSchematic({ hasAlert = false, alertZone = '23', onZoneClick }) {
  return (
    <svg
      viewBox="40 18 340 200"
      width="100%"
      height="100%"
      className="terminal-schematic-svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="radarPulse" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background fill */}
      <rect x="40" y="18" width="340" height="200" fill="#04060a" />

      {/* Terminal Pier Architectural Spine Outline */}
      <g stroke="rgba(255, 255, 255, 0.16)" strokeWidth="0.8" fill="none">
        {/* North Pier Corridor */}
        <path d="M 197,20 L 223,20 L 223,120 L 197,120 Z" />
        {/* West Pier Wing */}
        <path d="M 50,98 L 168,144 L 162,162 L 44,116 Z" />
        {/* East Pier Wing */}
        <path d="M 370,98 L 252,144 L 258,162 L 376,116 Z" />
        {/* Central Terminal Concourse Outline */}
        <path d="M 166,138 L 254,138 L 256,212 L 164,212 Z" strokeDasharray="3 2" />
        <path d="M 164,212 L 256,212" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1" />
      </g>

      {/* 1. North Pier Zones */}
      {NORTH_PIER_ZONES.map(z => (
        <g 
          key={z.id} 
          className="schematic-zone-node"
          onClick={(e) => { e.stopPropagation(); onZoneClick?.(z.id); }}
        >
          <rect
            x={z.x - z.w / 2}
            y={z.y - z.h / 2}
            width={z.w}
            height={z.h}
            fill="#0b0f19"
            stroke="rgba(255, 255, 255, 0.22)"
            strokeWidth="0.75"
            rx="1.5"
          />
          <text
            x={z.x}
            y={z.y}
            fill="#e2e8f0"
            fontSize="8.5"
            fontWeight="600"
            fontFamily="'JetBrains Mono', monospace"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {z.id}
          </text>
        </g>
      ))}

      {/* 2. West Wing Pier Zones */}
      {WEST_PIER_ZONES.map(z => {
        const isFaulted = hasAlert && z.id === alertZone;
        return (
          <g 
            key={z.id} 
            transform={`rotate(${z.rot}, ${z.x}, ${z.y})`}
            className={`schematic-zone-node ${isFaulted ? 'zone-faulted' : ''}`}
            onClick={(e) => { e.stopPropagation(); onZoneClick?.(z.id); }}
          >
            <rect
              x={z.x - z.w / 2}
              y={z.y - z.h / 2}
              width={z.w}
              height={z.h}
              fill={isFaulted ? 'rgba(234, 88, 12, 0.4)' : '#0b0f19'}
              stroke={isFaulted ? '#f97316' : 'rgba(255, 255, 255, 0.22)'}
              strokeWidth={isFaulted ? '1.5' : '0.75'}
              rx="1.5"
            />
            {isFaulted ? (
              <g>
                <circle cx={z.x} cy={z.y} r="14" fill="rgba(249, 115, 22, 0.25)" className="scada-ping-pulse" />
                <circle cx={z.x} cy={z.y} r="6.5" fill="#f97316" filter="url(#radarPulse)" />
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
                fontSize="8.5"
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

      {/* 3. East Wing Pier Zones */}
      {EAST_PIER_ZONES.map(z => (
        <g 
          key={z.id} 
          transform={`rotate(${z.rot}, ${z.x}, ${z.y})`}
          className="schematic-zone-node"
          onClick={(e) => { e.stopPropagation(); onZoneClick?.(z.id); }}
        >
          <rect
            x={z.x - z.w / 2}
            y={z.y - z.h / 2}
            width={z.w}
            height={z.h}
            fill="#0b0f19"
            stroke="rgba(255, 255, 255, 0.22)"
            strokeWidth="0.75"
            rx="1.5"
          />
          <text
            x={z.x}
            y={z.y}
            fill="#e2e8f0"
            fontSize="8.5"
            fontWeight="600"
            fontFamily="'JetBrains Mono', monospace"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {z.id}
          </text>
        </g>
      ))}

      {/* 4. Concourse Hub Upper Row */}
      {HUB_UPPER_ZONES.map(z => (
        <g 
          key={z.id} 
          className="schematic-zone-node"
          onClick={(e) => { e.stopPropagation(); onZoneClick?.(z.id); }}
        >
          <rect
            x={z.x - z.w / 2}
            y={z.y - z.h / 2}
            width={z.w}
            height={z.h}
            fill="#0b0f19"
            stroke="rgba(255, 255, 255, 0.22)"
            strokeWidth="0.75"
            rx="1.5"
          />
          <text
            x={z.x}
            y={z.y}
            fill="#e2e8f0"
            fontSize="7.5"
            fontWeight="600"
            fontFamily="'JetBrains Mono', monospace"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {z.id}
          </text>
        </g>
      ))}

      {/* 5. Concourse Hub Middle Row */}
      {HUB_MIDDLE_ZONES.map(z => (
        <g 
          key={z.id} 
          className="schematic-zone-node"
          onClick={(e) => { e.stopPropagation(); onZoneClick?.(z.id); }}
        >
          <rect
            x={z.x - z.w / 2}
            y={z.y - z.h / 2}
            width={z.w}
            height={z.h}
            fill="#0b0f19"
            stroke="rgba(255, 255, 255, 0.22)"
            strokeWidth="0.75"
            rx="1.5"
          />
          <text
            x={z.x}
            y={z.y}
            fill="#e2e8f0"
            fontSize="8.5"
            fontWeight="600"
            fontFamily="'JetBrains Mono', monospace"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {z.id}
          </text>
        </g>
      ))}

      {/* 6. Concourse Hub Lower Row */}
      {HUB_LOWER_ZONES.map(z => (
        <g 
          key={z.id} 
          className="schematic-zone-node"
          onClick={(e) => { e.stopPropagation(); onZoneClick?.(z.id); }}
        >
          <rect
            x={z.x - z.w / 2}
            y={z.y - z.h / 2}
            width={z.w}
            height={z.h}
            fill="#0b0f19"
            stroke="rgba(255, 255, 255, 0.22)"
            strokeWidth="0.75"
            rx="1.5"
          />
          <text
            x={z.x}
            y={z.y}
            fill="#e2e8f0"
            fontSize="8.5"
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

export default function MultiFloorMapGrid({ onSelectFloor, onMaximize, activeFloorId = '1F' }) {
  const [selectedFloor, setSelectedFloor] = useState(activeFloorId);

  // Exact 6 terminal levels from the reference image
  const floors = [
    { id: 'PIT', code: 'PIT', label: 'PIT Floor', hasAlert: false },
    { id: 'GF', code: 'GF', label: 'Ground Floor', hasAlert: false },
    { id: '1F', code: '1F', label: 'First Floor', hasAlert: true, alertZone: '23' },
    { id: '2F', code: '2F', label: 'Second Floor', hasAlert: false },
    { id: '3F', code: '3F', label: 'Third Floor', hasAlert: false },
    { id: '4F', code: '4F', label: 'Fourth Floor', hasAlert: false, showMaximize: true },
  ];

  const handleCardClick = (floor) => {
    setSelectedFloor(floor.id);
    onSelectFloor?.(floor.id);
  };

  return (
    <div className="scada-floors-grid">
      {floors.map(floor => {
        const isSelected = selectedFloor === floor.id;
        return (
          <div
            key={floor.id}
            className={`scada-floor-card ${floor.hasAlert ? 'floor-alert' : ''} ${isSelected ? 'floor-selected' : ''}`}
            onClick={() => handleCardClick(floor)}
          >
            {/* Floor Badge Header */}
            <div className="scada-floor-header">
              <span className={`scada-floor-badge ${floor.hasAlert ? 'badge-alert' : ''}`}>
                <span className="scada-floor-code">{floor.code}</span>
                <span className="scada-floor-name">{floor.label}</span>
              </span>

              {floor.hasAlert && (
                <div className="scada-alert-zone-pill">
                  <span className="pulse-dot-sm" />
                  <span>Zone {floor.alertZone}</span>
                </div>
              )}
            </div>

            {/* Schematic SVG Container */}
            <div className="scada-floor-svg-wrap">
              <FloorSchematic 
                hasAlert={floor.hasAlert} 
                alertZone={floor.alertZone}
                onZoneClick={(zoneId) => {
                  handleCardClick(floor);
                }}
              />
            </div>

            {/* Maximize Button on Fourth Floor as in user image */}
            {floor.showMaximize && (
              <button
                className="scada-maximize-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onMaximize?.(floor.id);
                }}
                title="Maximize Map View"
              >
                <Maximize2 size={13} />
                <span>Maximize</span>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
