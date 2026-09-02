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
  { id: '37', x: 400, y: 65, w: 38, h: 28 },
  { id: '36', x: 400, y: 98, w: 40, h: 28 },
  { id: '35', x: 400, y: 131, w: 42, h: 28 },
  { id: '34', x: 400, y: 164, w: 44, h: 28 },
  { id: '33', x: 400, y: 197, w: 46, h: 28 },

  // West Pier (Wing)
  { id: '24', x: 125, y: 165, w: 46, h: 26, rot: -28 },
  { id: '23', x: 185, y: 195, w: 46, h: 26, rot: -26 },
  { id: '22', x: 245, y: 225, w: 46, h: 26, rot: -24 },
  { id: '21', x: 305, y: 255, w: 46, h: 26, rot: -22 },

  // East Pier (Wing)
  { id: '44', x: 675, y: 165, w: 46, h: 26, rot: 28 },
  { id: '43', x: 615, y: 195, w: 46, h: 26, rot: 26 },
  { id: '42', x: 555, y: 225, w: 46, h: 26, rot: 24 },
  { id: '41', x: 495, y: 255, w: 46, h: 26, rot: 22 },

  // Central Concourse Core - Upper Hub Row
  { id: '31', x: 326, y: 280, w: 26, h: 28 },
  { id: '11', x: 354, y: 280, w: 26, h: 28 },
  { id: '12', x: 377, y: 280, w: 26, h: 28 },
  { id: '13', x: 400, y: 280, w: 26, h: 28 },
  { id: '14', x: 423, y: 280, w: 26, h: 28 },
  { id: '15', x: 446, y: 280, w: 26, h: 28 },
  { id: '32', x: 474, y: 280, w: 26, h: 28 },

  // Central Concourse Core - Middle Hub Row
  { id: '01', x: 338, y: 320, w: 32, h: 32 },
  { id: '02', x: 372, y: 320, w: 32, h: 32 },
  { id: '03', x: 400, y: 320, w: 32, h: 32 },
  { id: '04', x: 428, y: 320, w: 32, h: 32 },
  { id: '05', x: 462, y: 320, w: 32, h: 32 },

  // Central Concourse Core - Lower Hub Row (Roadway)
  { id: '51', x: 338, y: 365, w: 32, h: 28 },
  { id: '52', x: 372, y: 365, w: 32, h: 28 },
  { id: '53', x: 400, y: 365, w: 32, h: 28 },
  { id: '54', x: 428, y: 365, w: 32, h: 28 },
  { id: '55', x: 462, y: 365, w: 32, h: 28 },
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

      {/* Pure Black Schematic Stage - SCADA Blueprint */}
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
            <linearGradient id="terminalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#070b14" />
            </linearGradient>
            <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(56, 189, 248, 0.15)" />
              <stop offset="100%" stopColor="rgba(14, 165, 233, 0.05)" />
            </linearGradient>
            <filter id="terminalGlow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Clean Dark Grid */}
          <rect width="800" height="460" fill="url(#cleanCadGrid)" />

          {/* Lotus Architectural Footprint with Glow */}
          <g filter="url(#terminalGlow)">
            <path
              d="
                M 365,220
                L 380,50 Q 400,35 420,50 L 435,220
                Q 500,220 730,130 Q 750,120 740,140
                Q 580,240 460,310
                Q 450,400 400,410 Q 350,400 340,310
                Q 220,240 60,140 Q 50,120 70,130
                Q 300,220 365,220 Z
              "
              fill="url(#terminalGrad)"
              stroke="rgba(56, 189, 248, 0.25)"
              strokeWidth="2"
            />
          </g>

          {/* Overlaid Lotus Petal Roof Structures */}
          <g strokeWidth="1.5" fill="none">
            {/* Outer Petals */}
            <path d="M 400,160 Q 480,210 500,300 Q 400,380 300,300 Q 320,210 400,160 Z" stroke="rgba(56, 189, 248, 0.15)" />
            {/* Inner Petals */}
            <path d="M 400,180 Q 450,220 460,290 Q 400,350 340,290 Q 350,220 400,180 Z" stroke="rgba(56, 189, 248, 0.3)" />
            {/* Core Glass Dome */}
            <ellipse cx="400" cy="270" rx="35" ry="50" fill="url(#glassGrad)" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="1" />

            {/* Pier Centerlines */}
            <path d="M 400,50 L 400,220" stroke="rgba(255, 255, 255, 0.1)" strokeDasharray="4 4" />
            <path d="M 370,230 Q 150,170 65,135" stroke="rgba(255, 255, 255, 0.1)" strokeDasharray="4 4" />
            <path d="M 430,230 Q 650,170 735,135" stroke="rgba(255, 255, 255, 0.1)" strokeDasharray="4 4" />
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
                  stroke={isFaulted ? '#f5a623' : isHovered ? '#38bdf8' : 'rgba(255, 255, 255, 0.15)'}
                  strokeWidth={isFaulted || isHovered ? '1.5' : '0.8'}
                  rx="3"
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
                    fill={isHovered ? '#38bdf8' : '#8f9fb2'}
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
