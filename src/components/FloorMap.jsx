import React, { useState, useMemo } from 'react';
import {
  Wind, Flame, Package, DoorOpen, ShieldCheck, ScanLine,
  Thermometer, Fan, Droplets, Clock, Volume2, PlaneLanding,
  ZoomIn, ZoomOut, Maximize2
} from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';

const equipmentIcons = {
  'AHU': Wind,
  'Chiller': Thermometer,
  'Fire Detector': Flame,
  'Fire Panel': Flame,
  'Conveyor': Package,
  'Gate': DoorOpen,
  'X-Ray Scanner': ScanLine,
  'Access Panel': ShieldCheck,
  'Exhaust Fan': Fan,
  'PA Speaker': Volume2,
  'Docking System': PlaneLanding,
  'Clock Display': Clock,
  'Pump': Droplets,
};

// 29-Zone Definitions on an 800 x 480 SCADA Viewport
const ZONE_NODES = [
  // North Pier (Spire)
  { id: '37', x: 400, y: 55, w: 46, h: 32 },
  { id: '36', x: 400, y: 92, w: 46, h: 32 },
  { id: '35', x: 400, y: 129, w: 46, h: 32 },
  { id: '34', x: 400, y: 166, w: 46, h: 32 },
  { id: '33', x: 400, y: 203, w: 46, h: 32 },

  // West Pier (Wing)
  { id: '24', x: 125, y: 195, w: 48, h: 28, rot: -22 },
  { id: '23', x: 185, y: 220, w: 48, h: 28, rot: -22 },
  { id: '22', x: 245, y: 245, w: 48, h: 28, rot: -22 },
  { id: '21', x: 305, y: 270, w: 48, h: 28, rot: -22 },

  // East Pier (Wing)
  { id: '44', x: 675, y: 195, w: 48, h: 28, rot: 22 },
  { id: '43', x: 615, y: 220, w: 48, h: 28, rot: 22 },
  { id: '42', x: 555, y: 245, w: 48, h: 28, rot: 22 },
  { id: '41', x: 495, y: 270, w: 48, h: 28, rot: 22 },

  // Central Concourse Core - Upper Hub Row
  { id: '31', x: 326, y: 256, w: 26, h: 28 },
  { id: '11', x: 354, y: 256, w: 26, h: 28 },
  { id: '12', x: 377, y: 256, w: 26, h: 28 },
  { id: '13', x: 400, y: 256, w: 26, h: 28 },
  { id: '14', x: 423, y: 256, w: 26, h: 28 },
  { id: '15', x: 446, y: 256, w: 26, h: 28 },
  { id: '32', x: 474, y: 256, w: 26, h: 28 },

  // Central Concourse Core - Middle Hub Row
  { id: '01', x: 338, y: 310, w: 32, h: 32 },
  { id: '02', x: 372, y: 310, w: 32, h: 32 },
  { id: '03', x: 400, y: 310, w: 32, h: 32 },
  { id: '04', x: 428, y: 310, w: 32, h: 32 },
  { id: '05', x: 462, y: 310, w: 32, h: 32 },

  // Central Concourse Core - Lower Hub Row (Roadway)
  { id: '51', x: 338, y: 360, w: 32, h: 28 },
  { id: '52', x: 372, y: 360, w: 32, h: 28 },
  { id: '53', x: 400, y: 360, w: 32, h: 28 },
  { id: '54', x: 428, y: 360, w: 32, h: 28 },
  { id: '55', x: 462, y: 360, w: 32, h: 28 },
];

export default function FloorMap({ onSelectEquipment, selectedFloor: externalFloor, height = 520, showControls = true }) {
  const { equipmentList, floors, selectedFloor, setSelectedFloor } = useLiveData();

  const [internalFloor, setInternalFloor] = useState('1F');
  const [hoveredEquipment, setHoveredEquipment] = useState(null);
  const [hoveredZone, setHoveredZone] = useState(null);
  const [zoom, setZoom] = useState(1);

  // Active Floor sync
  const activeFloor = externalFloor || selectedFloor || internalFloor;

  const handleFloorChange = (floorId) => {
    setInternalFloor(floorId);
    if (setSelectedFloor) {
      setSelectedFloor(floorId);
    }
  };

  // Equipment filtered strictly by active floor (no cluttered subsystem filter)
  const equipment = useMemo(() => {
    return equipmentList.filter(e => e.floor === activeFloor);
  }, [equipmentList, activeFloor]);

  const currentFloorObj = floors.find(f => f.id === activeFloor) || floors[0];

  return (
    <div className="map-container" style={{ position: 'relative', background: '#000000' }}>
      {/* Streamlined Floor Switcher Bar - Clean, Minimal & Direct */}
      <div style={{
        padding: '8px 16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        background: '#070a12'
      }}>
        {/* Floor Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-2xs text-tertiary font-mono uppercase font-bold tracking-wider">FLOOR:</span>
          <div className="floor-selector" style={{ padding: '2px', gap: '3px' }}>
            {floors.map(f => (
              <button
                key={f.id}
                className={`floor-btn ${activeFloor === f.id ? 'active' : ''}`}
                onClick={() => handleFloorChange(f.id)}
                style={{
                  padding: '4px 12px',
                  fontSize: '11px',
                  minWidth: '42px',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginLeft: '8px' }}>
            <strong className="text-teal">{currentFloorObj.name}</strong> • Altitude {currentFloorObj.altitude || '0.0m'}
          </span>
        </div>

        {/* Live Status Indicator for active floor */}
        <div className="flex items-center gap-2">
          {activeFloor === '1F' && (
            <span className="floor-alert-pill" style={{ fontSize: '10px', padding: '3px 8px' }}>
              <span className="live-dot-badge amber" style={{ width: 6, height: 6 }} />
              Zone 23 Active Alert (AHU-309)
            </span>
          )}
          <span className="text-3xs font-mono text-tertiary">
            {equipment.length} Active SCADA Nodes
          </span>
        </div>
      </div>

      {/* Pure Black Schematic Stage - CAD Blueprint permanently OFF */}
      <div style={{
        position: 'relative',
        height,
        overflow: 'hidden',
        background: '#000000',
      }}>
        {/* SVG Schematic Viewport */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 460"
          preserveAspectRatio="xMidYMid meet"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.25s ease' }}
        >
          <defs>
            {/* Subtle grid */}
            <pattern id="cleanCadGrid" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(255,255,255,0.015)" strokeWidth="0.5" />
            </pattern>
          </defs>

          {/* Clean Dark Grid */}
          <rect width="800" height="460" fill="url(#cleanCadGrid)" />

          {/* Architectural Vector Contours */}
          <g stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1" fill="none">
            {/* North Pier Corridor */}
            <path d="M 374,38 L 426,38 L 426,220 L 374,220 Z" />

            {/* West Pier Wing */}
            <path d="M 98,180 L 336,256 L 324,288 L 86,212 Z" />

            {/* East Pier Wing */}
            <path d="M 702,180 L 464,256 L 476,288 L 714,212 Z" />

            {/* Central Concourse Outer Perimeter */}
            <path d="M 310,240 L 490,240 L 496,388 L 304,388 Z" stroke="rgba(255, 255, 255, 0.2)" strokeDasharray="4 2" />
            <path d="M 304,388 L 496,388" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" />
          </g>

          {/* Render All 29 Numbered Zones */}
          {ZONE_NODES.map(z => {
            const isFaulted = activeFloor === '1F' && z.id === '23';
            const isHovered = hoveredZone === z.id;

            return (
              <g
                key={z.id}
                transform={z.rot ? `rotate(${z.rot}, ${z.x}, ${z.y})` : undefined}
                onMouseEnter={() => setHoveredZone(z.id)}
                onMouseLeave={() => setHoveredZone(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={z.x - z.w / 2}
                  y={z.y - z.h / 2}
                  width={z.w}
                  height={z.h}
                  fill={isFaulted ? 'rgba(245, 166, 35, 0.2)' : isHovered ? 'rgba(56, 189, 248, 0.2)' : 'rgba(15, 23, 42, 0.7)'}
                  stroke={isFaulted ? '#f5a623' : isHovered ? '#38bdf8' : 'rgba(255, 255, 255, 0.22)'}
                  strokeWidth={isFaulted || isHovered ? '1.5' : '0.8'}
                />

                {isFaulted ? (
                  <g>
                    <circle cx={z.x} cy={z.y} r="16" fill="rgba(245, 166, 35, 0.25)" className="pulse-ring-anim" />
                    <circle cx={z.x} cy={z.y} r="8" fill="#f5a623" />
                    <text
                      x={z.x}
                      y={z.y}
                      fill="#000000"
                      fontSize="9.5"
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
                    fill={isHovered ? '#38bdf8' : '#ffffff'}
                    fontSize="10"
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
        </svg>

        {/* Dynamic Equipment Markers for Active Floor */}
        {equipment.map((eq) => {
          const Icon = equipmentIcons[eq.type] || Wind;
          const left = `${eq.x}%`;
          const top = `${eq.y}%`;

          return (
            <div
              key={eq.id}
              className={`equipment-marker ${eq.status}`}
              style={{ left, top, transform: 'translate(-50%, -50%)', position: 'absolute', zIndex: 10, width: 22, height: 22 }}
              onClick={() => onSelectEquipment?.(eq)}
              onMouseEnter={() => setHoveredEquipment(eq)}
              onMouseLeave={() => setHoveredEquipment(null)}
              title={`${eq.id} - ${eq.status.toUpperCase()}`}
            >
              <Icon size={11} />
            </div>
          );
        })}

        {/* Zone Hover Tag */}
        {hoveredZone && (
          <div className="map-zone-hover-banner animate-fadeIn" style={{ fontSize: '11px', padding: '4px 10px', bottom: '12px', left: '16px' }}>
            <span>📍 Zone <strong>{hoveredZone}</strong> • {activeFloor === '1F' && hoveredZone === '23' ? 'CRITICAL FAULT (AHU-309)' : 'Nominal Status'}</span>
          </div>
        )}

        {/* Equipment Tooltip on Hover */}
        {hoveredEquipment && (
          <div
            className="eq-tooltip animate-fadeIn"
            style={{
              left: `${Math.min(hoveredEquipment.x + 3, 72)}%`,
              top: `${Math.max(hoveredEquipment.y - 4, 6)}%`,
              zIndex: 30,
              padding: '8px 12px'
            }}
          >
            <div className="flex justify-between items-center mb-1.5">
              <div className="eq-tooltip-name font-mono text-xs">{hoveredEquipment.id}</div>
              <span className={`status-badge ${hoveredEquipment.status}`} style={{ fontSize: '8px', padding: '1px 5px' }}>
                {hoveredEquipment.status.toUpperCase()}
              </span>
            </div>

            <div className="eq-tooltip-row text-3xs">
              <span>Subsystem</span>
              <span className="text-teal font-mono font-semibold">{hoveredEquipment.system}</span>
            </div>
            <div className="eq-tooltip-row text-3xs">
              <span>Zone Location</span>
              <span>{hoveredEquipment.zone}</span>
            </div>
            {hoveredEquipment.temp !== null && (
              <div className="eq-tooltip-row text-3xs">
                <span>Temperature</span>
                <span className="font-mono text-teal">{hoveredEquipment.temp}°C</span>
              </div>
            )}
            <div className="eq-tooltip-row text-3xs">
              <span>Health Score</span>
              <span className="font-mono font-bold" style={{ color: hoveredEquipment.health >= 80 ? 'var(--status-operational)' : 'var(--status-critical)' }}>
                {hoveredEquipment.health}%
              </span>
            </div>
          </div>
        )}

        {/* Compact Zoom Controls */}
        {showControls && (
          <div className="map-controls" style={{ bottom: '12px', right: '12px' }}>
            <button className="map-control-btn" style={{ width: 26, height: 26 }} onClick={() => setZoom(z => Math.min(z + 0.2, 2.2))} title="Zoom In">
              <ZoomIn size={13} />
            </button>
            <button className="map-control-btn" style={{ width: 26, height: 26 }} onClick={() => setZoom(z => Math.max(z - 0.2, 0.7))} title="Zoom Out">
              <ZoomOut size={13} />
            </button>
            <button className="map-control-btn" style={{ width: 26, height: 26 }} onClick={() => setZoom(1)} title="Reset Zoom">
              <Maximize2 size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
