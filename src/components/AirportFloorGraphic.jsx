import React, { useState } from 'react';
import {
  Wind, Flame, Package, DoorOpen, ShieldCheck, ScanLine,
  Thermometer, Fan, Droplets, Clock, Volume2, PlaneLanding
} from 'lucide-react';

// Exact 29 SCADA Zone Nodes aligned to the 2.5D Isometric Terminal (1000 x 560 coordinate space)
export const ISOMETRIC_ZONES = [
  // North Pier - Concourse B (B1-B10)
  { id: '37', x: 500, y: 72,  w: 36, h: 24, pier: 'North' },
  { id: '36', x: 500, y: 104, w: 36, h: 24, pier: 'North' },
  { id: '35', x: 500, y: 136, w: 38, h: 24, pier: 'North' },
  { id: '34', x: 500, y: 168, w: 38, h: 24, pier: 'North' },
  { id: '33', x: 500, y: 200, w: 40, h: 24, pier: 'North' },

  // West Pier - Concourse A (A1-A8) [Rotated ~ -22.5 deg]
  { id: '24', x: 175, y: 155, w: 42, h: 24, rot: -22.5, pier: 'West' },
  { id: '23', x: 245, y: 185, w: 42, h: 24, rot: -22.5, pier: 'West' }, // Faulted zone on 1F
  { id: '22', x: 315, y: 215, w: 42, h: 24, rot: -22.5, pier: 'West' },
  { id: '21', x: 380, y: 242, w: 42, h: 24, rot: -22.5, pier: 'West' },

  // East Pier - Concourse C (C1-C8) [Rotated ~ +22.5 deg]
  { id: '44', x: 825, y: 155, w: 42, h: 24, rot: 22.5, pier: 'East' },
  { id: '43', x: 755, y: 185, w: 42, h: 24, rot: 22.5, pier: 'East' },
  { id: '42', x: 685, y: 215, w: 42, h: 24, rot: 22.5, pier: 'East' },
  { id: '41', x: 620, y: 242, w: 42, h: 24, rot: 22.5, pier: 'East' },

  // Central Hub - Upper Transition Row
  { id: '31', x: 422, y: 262, w: 24, h: 22, pier: 'Hub' },
  { id: '11', x: 448, y: 262, w: 24, h: 22, pier: 'Hub' },
  { id: '12', x: 474, y: 262, w: 24, h: 22, pier: 'Hub' },
  { id: '13', x: 500, y: 262, w: 24, h: 22, pier: 'Hub' },
  { id: '14', x: 526, y: 262, w: 24, h: 22, pier: 'Hub' },
  { id: '15', x: 552, y: 262, w: 24, h: 22, pier: 'Hub' },
  { id: '32', x: 578, y: 262, w: 24, h: 22, pier: 'Hub' },

  // Central Hub - Middle Row (Main Departure Hall)
  { id: '01', x: 410, y: 312, w: 32, h: 26, pier: 'Hub' },
  { id: '02', x: 455, y: 312, w: 32, h: 26, pier: 'Hub' },
  { id: '03', x: 500, y: 312, w: 34, h: 26, pier: 'Hub' },
  { id: '04', x: 545, y: 312, w: 32, h: 26, pier: 'Hub' },
  { id: '05', x: 590, y: 312, w: 32, h: 26, pier: 'Hub' },

  // Central Hub - Lower Row (Security Check & Forecourt)
  { id: '51', x: 422, y: 374, w: 30, h: 24, pier: 'Hub' },
  { id: '52', x: 461, y: 374, w: 30, h: 24, pier: 'Hub' },
  { id: '53', x: 500, y: 374, w: 32, h: 24, pier: 'Hub' },
  { id: '54', x: 539, y: 374, w: 30, h: 24, pier: 'Hub' },
  { id: '55', x: 578, y: 374, w: 30, h: 24, pier: 'Hub' },
];

/**
 * Airplane SVG Icon component for parked aircraft at jet bridges (Dark SCADA Theme)
 */
function ParkedAirplane({ x, y, angle = 0, scale = 1 }) {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${angle}) scale(${scale})`}>
      {/* Drop shadow on dark tarmac */}
      <ellipse cx="2" cy="10" rx="20" ry="6" fill="rgba(0, 0, 0, 0.7)" />
      {/* Delta Wings */}
      <path
        d="M -20,6 L 0,-2 L 20,6 L 16,10 L 0,4 L -16,10 Z"
        fill="#1e293b"
        stroke="#475569"
        strokeWidth="0.8"
      />
      {/* Wingtip Navigation Lights */}
      <circle cx="-19" cy="7" r="1.5" fill="#ef4444" /> {/* Port (Red) */}
      <circle cx="19" cy="7" r="1.5" fill="#10b981" />  {/* Starboard (Green) */}
      {/* Jet Engines */}
      <rect x="-11" y="2" width="3.5" height="7" rx="1.5" fill="#334155" stroke="#475569" strokeWidth="0.5" />
      <rect x="7.5" y="2" width="3.5" height="7" rx="1.5" fill="#334155" stroke="#475569" strokeWidth="0.5" />
      {/* Fuselage */}
      <path
        d="M 0,-16 C 3,-16 4,-8 4,14 C 4,18 2,21 0,21 C -2,21 -4,18 -4,14 C -4,-8 -3,-16 0,-16 Z"
        fill="#334155"
        stroke="#64748b"
        strokeWidth="0.8"
      />
      {/* Cockpit windshield glow */}
      <path d="M -2.2,-11 Q 0,-13 2.2,-11 Q 1.5,-9 -1.5,-9 Z" fill="#38bdf8" />
      {/* Tail fin & stabilizers */}
      <path d="M -9,16 L 0,13 L 9,16 L 7,18 L 0,16 L -7,18 Z" fill="#1e293b" />
      <polygon points="0,10 1.5,19 -1.5,19" fill="#0284c7" />
    </g>
  );
}

/**
 * Jet Bridge extending from concourse wall to airplane door
 */
function JetBridge({ x1, y1, x2, y2 }) {
  return (
    <g>
      <circle cx={x1} cy={y1} r="2.8" fill="#1e293b" stroke="#38bdf8" strokeWidth="0.8" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0ea5e9" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx={x2} cy={y2} r="2.2" fill="#38bdf8" />
    </g>
  );
}

/**
 * High-fidelity 2.5D Isometric Airport Terminal SCADA Graphic (Dark SCADA Theme)
 */
export default function AirportFloorGraphic({
  hasAlert = false,
  alertZone = '23',
  onZoneClick,
  compact = false,
  equipment = [],
  onSelectEquipment,
  showZones = true,
  showLabels = true,
  activeFloor = '1F'
}) {
  const [hoveredZone, setHoveredZone] = useState(null);
  const [hoveredEq, setHoveredEq] = useState(null);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#060a12' }}>
      <svg
        viewBox="60 30 880 495"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block', width: '100%', height: '100%' }}
      >
        <defs>
          {/* Dark SCADA Background Gradients */}
          <linearGradient id="scadaTarmacGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#060a12" />
            <stop offset="50%" stopColor="#09101c" />
            <stop offset="100%" stopColor="#05080f" />
          </linearGradient>

          {/* Luminous Concourse Floor */}
          <linearGradient id="scadaFloorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0d1c2d" />
            <stop offset="50%" stopColor="#11253e" />
            <stop offset="100%" stopColor="#0a1726" />
          </linearGradient>

          {/* Central Departure Hall Glow */}
          <radialGradient id="scadaHallGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(14, 165, 233, 0.22)" />
            <stop offset="60%" stopColor="rgba(0, 212, 170, 0.10)" />
            <stop offset="100%" stopColor="#0a1726" />
          </radialGradient>

          {/* 3D Architectural Wall Rim */}
          <linearGradient id="scadaWallRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1b3352" />
            <stop offset="50%" stopColor="#132740" />
            <stop offset="100%" stopColor="#0b1726" />
          </linearGradient>

          {/* Roadways Viaduct */}
          <linearGradient id="scadaRoadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#162032" />
            <stop offset="100%" stopColor="#0e1522" />
          </linearGradient>

          {/* Dark Pine Garden Landscaping */}
          <linearGradient id="scadaLawnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#064e3b" />
            <stop offset="100%" stopColor="#022c22" />
          </linearGradient>

          {/* Drop Shadows & Glows */}
          <filter id="shadow3D" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="16" stdDeviation="14" floodColor="#000000" floodOpacity="0.7" />
          </filter>

          <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="radarPingAlert" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Subtle Grid Pattern for Floor Tiles */}
          <pattern id="cadGridDark" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(56, 189, 248, 0.03)" strokeWidth="0.6" />
          </pattern>
        </defs>

        {/* 1. Tarmac & Apron Background Canvas */}
        <rect width="1000" height="560" fill="url(#scadaTarmacGrad)" />
        <rect width="1000" height="560" fill="url(#cadGridDark)" />

        {/* Subtle CAD Taxiway Markings in Dark Cyber Theme */}
        <g stroke="rgba(56, 189, 248, 0.15)" strokeWidth="1" strokeDasharray="6 4" fill="none">
          <path d="M 50,50 L 950,50" />
          <path d="M 50,90 Q 500,15 950,90" />
          <circle cx="500" cy="50" r="16" stroke="rgba(245, 158, 11, 0.3)" strokeDasharray="none" />
        </g>

        {/* 2. Forecourt Infrastructure (Roadway Viaducts & Green Lawns at Bottom) */}
        <g id="forecourt">
          {/* Deep Emerald Landscaped Berms */}
          <path
            d="M 280,440 Q 500,430 720,440 Q 770,510 680,540 Q 500,555 320,540 Q 230,510 280,440 Z"
            fill="url(#scadaLawnGrad)"
            stroke="#059669"
            strokeWidth="1.2"
            filter="url(#shadow3D)"
          />

          {/* Landscaping tree clusters */}
          {[
            { cx: 330, cy: 465, r: 8 }, { cx: 355, cy: 475, r: 11 }, { cx: 380, cy: 460, r: 7 },
            { cx: 620, cy: 460, r: 7 }, { cx: 645, cy: 475, r: 11 }, { cx: 670, cy: 465, r: 8 },
            { cx: 310, cy: 505, r: 9 }, { cx: 690, cy: 505, r: 9 },
          ].map((t, idx) => (
            <g key={idx}>
              <circle cx={t.cx + 2} cy={t.cy + 3} r={t.r} fill="rgba(0, 0, 0, 0.5)" />
              <circle cx={t.cx} cy={t.cy} r={t.r} fill="#047857" />
              <circle cx={t.cx - 2} cy={t.cy - 2} r={t.r * 0.6} fill="#10b981" opacity="0.6" />
            </g>
          ))}

          {/* Elevated Double Roadway Flyovers */}
          <path
            d="M 210,430 Q 500,410 790,430 L 780,448 Q 500,428 220,448 Z"
            fill="url(#scadaRoadGrad)"
            stroke="#334155"
            strokeWidth="1"
          />
          <path
            d="M 215,439 Q 500,419 785,439"
            stroke="rgba(56, 189, 248, 0.4)"
            strokeWidth="1"
            strokeDasharray="8 6"
            fill="none"
          />

          <path
            d="M 180,480 Q 500,450 820,480 L 810,498 Q 500,468 190,498 Z"
            fill="url(#scadaRoadGrad)"
            stroke="#334155"
            strokeWidth="1"
          />
          <path
            d="M 185,489 Q 500,459 815,489"
            stroke="rgba(56, 189, 248, 0.4)"
            strokeWidth="1"
            strokeDasharray="8 6"
            fill="none"
          />

          {/* APM (Automated People Mover) / Rail Transit Link in Center */}
          <g transform="translate(500, 480)">
            <rect x="-24" y="-35" width="48" height="95" rx="6" fill="#020617" stroke="#0284c7" strokeWidth="1" />
            <rect x="-18" y="-30" width="16" height="85" rx="4" fill="#0f172a" stroke="#0ea5e9" strokeWidth="0.8" />
            <rect x="2" y="-30" width="16" height="85" rx="4" fill="#0f172a" stroke="#0ea5e9" strokeWidth="0.8" />
            <line x1="-10" y1="-30" x2="-10" y2="55" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="10" y1="-30" x2="10" y2="55" stroke="#38bdf8" strokeWidth="1.5" />
            <path d="M 0,-15 L 5, -6 L -5, -6 Z" fill="#38bdf8" />
          </g>
        </g>

        {/* 3. Parked Passenger Aircraft at Jet Bridges */}
        <g id="parked-aircraft">
          {/* North Pier B - Left & Right Gates */}
          <ParkedAirplane x={430} y={65} angle={115} scale={0.88} />
          <JetBridge x1={465} y1={68} x2={433} y2={65} />

          <ParkedAirplane x={570} y={65} angle={-115} scale={0.88} />
          <JetBridge x1={535} y1={68} x2={567} y2={65} />

          <ParkedAirplane x={430} y={130} angle={105} scale={0.92} />
          <JetBridge x1={465} y1={132} x2={433} y2={130} />

          <ParkedAirplane x={570} y={130} angle={-105} scale={0.92} />
          <JetBridge x1={535} y1={132} x2={567} y2={130} />

          <ParkedAirplane x={425} y={195} angle={95} scale={0.95} />
          <JetBridge x1={465} y1={196} x2={428} y2={195} />

          <ParkedAirplane x={575} y={195} angle={-95} scale={0.95} />
          <JetBridge x1={535} y1={196} x2={572} y2={195} />

          {/* West Pier A (A1-A8) - Upper & Lower Gates */}
          <ParkedAirplane x={135} y={85} angle={15} scale={0.9} />
          <JetBridge x1={155} y1={130} x2={135} y2={93} />

          <ParkedAirplane x={215} y={115} angle={15} scale={0.9} />
          <JetBridge x1={230} y1={160} x2={215} y2={123} />

          <ParkedAirplane x={295} y={145} angle={15} scale={0.92} />
          <JetBridge x1={305} y1={190} x2={295} y2={153} />

          <ParkedAirplane x={105} y={195} angle={-155} scale={0.9} />
          <JetBridge x1={140} y1={165} x2={110} y2={190} />

          <ParkedAirplane x={185} y={225} angle={-155} scale={0.92} />
          <JetBridge x1={215} y1={195} x2={190} y2={220} />

          <ParkedAirplane x={265} y={255} angle={-155} scale={0.95} />
          <JetBridge x1={290} y1={225} x2={270} y2={250} />

          {/* East Pier C (C1-C8) - Upper & Lower Gates */}
          <ParkedAirplane x={865} y={85} angle={-15} scale={0.9} />
          <JetBridge x1={845} y1={130} x2={865} y2={93} />

          <ParkedAirplane x={785} y={115} angle={-15} scale={0.9} />
          <JetBridge x1={770} y1={160} x2={785} y2={123} />

          <ParkedAirplane x={705} y={145} angle={-15} scale={0.92} />
          <JetBridge x1={695} y1={190} x2={705} y2={153} />

          <ParkedAirplane x={895} y={195} angle={155} scale={0.9} />
          <JetBridge x1={860} y1={165} x2={890} y2={190} />

          <ParkedAirplane x={815} y={225} angle={155} scale={0.92} />
          <JetBridge x1={785} y1={195} x2={810} y2={220} />

          <ParkedAirplane x={735} y={255} angle={155} scale={0.95} />
          <JetBridge x1={710} y1={225} x2={730} y2={250} />
        </g>

        {/* 4. Terminal Building 3D Extruded Architectural Perimeter */}
        <g id="terminal-structure" filter="url(#shadow3D)">
          {/* Base Wall Rim with 3D Depth bevel */}
          <path
            d="
              M 462,40
              L 538,40
              L 538,220
              L 610,220
              L 895,105
              L 935,120
              L 720,295
              L 675,340
              L 630,425
              L 580,430
              L 580,442
              L 420,442
              L 420,430
              L 370,425
              L 325,340
              L 280,295
              L 65,120
              L 105,105
              L 390,220
              L 462,220
              Z
            "
            fill="url(#scadaWallRim)"
            stroke="#0ea5e9"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Concourse Floor Plan (Dark Cyber Luminous Slate) */}
          <path
            d="
              M 466,44
              L 534,44
              L 534,222
              L 608,222
              L 893,109
              L 931,123
              L 716,293
              L 671,338
              L 626,421
              L 576,426
              L 576,438
              L 424,438
              L 424,426
              L 374,421
              L 329,338
              L 284,293
              L 69,123
              L 107,109
              L 392,222
              L 466,222
              Z
            "
            fill="url(#scadaFloorGrad)"
            stroke="rgba(56, 189, 248, 0.45)"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* Central Main Terminal / Departure Hall Sunlit Atrium */}
          <path
            d="
              M 390,240
              Q 500,225 610,240
              L 660,335
              L 620,410
              L 380,410
              L 340,335
              Z
            "
            fill="url(#scadaHallGlow)"
            stroke="#38bdf8"
            strokeWidth="1.8"
          />

          {/* Skylight Architectural Geometry on Departure Hall */}
          <g stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1" fill="none">
            <ellipse cx="500" cy="320" rx="95" ry="55" strokeDasharray="3 3" />
            <ellipse cx="500" cy="320" rx="60" ry="35" stroke="#00d4aa" strokeWidth="1.2" />
            <line x1="500" y1="265" x2="500" y2="375" />
            <line x1="405" y1="320" x2="595" y2="320" />
          </g>

          {/* Travelator Moving Walkways down concourses */}
          {/* Concourse B Center Travelator */}
          <rect x="496" y="65" width="8" height="150" rx="3" fill="#081526" stroke="#0ea5e9" strokeWidth="0.8" />
          <line x1="500" y1="70" x2="500" y2="210" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6 3" />

          {/* Concourse A Travelator (Angled) */}
          <g transform="translate(250, 185) rotate(-22.5)">
            <rect x="-110" y="-4" width="220" height="8" rx="3" fill="#081526" stroke="#0ea5e9" strokeWidth="0.8" />
            <line x1="-105" y1="0" x2="105" y2="0" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6 3" />
          </g>

          {/* Concourse C Travelator (Angled) */}
          <g transform="translate(750, 185) rotate(22.5)">
            <rect x="-110" y="-4" width="220" height="8" rx="3" fill="#081526" stroke="#0ea5e9" strokeWidth="0.8" />
            <line x1="-105" y1="0" x2="105" y2="0" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6 3" />
          </g>

          {/* Security Checkpoint Zone Barrier at Lower Hall */}
          <rect x="440" y="388" width="120" height="42" rx="4" fill="#0b1626" stroke="#0284c7" strokeWidth="1.2" />
          <g transform="translate(500, 400)">
            <rect x="-11" y="-8" width="22" height="16" rx="3" fill="#0284c7" />
            <path d="M -5,-3 L 0,-7 L 5,-3 L 5,3 L 0,6 L -5,3 Z" fill="#ffffff" />
            <text
              x="0"
              y="22"
              fill="#cbd5e1"
              fontSize="9.5"
              fontWeight="800"
              fontFamily="Inter, sans-serif"
              textAnchor="middle"
            >
              Security Check
            </text>
          </g>

          {/* Central Departure Hall Title Label */}
          {showLabels && (
            <text
              x="500"
              y="348"
              fill="#38bdf8"
              fontSize="16"
              fontWeight="900"
              fontFamily="Inter, sans-serif"
              letterSpacing="0.12em"
              textAnchor="middle"
              style={{ pointerEvents: 'none', filter: 'drop-shadow(0 0 6px rgba(56,189,248,0.4))' }}
            >
              DEPARTURE HALL
            </text>
          )}

          {/* Pier Concourse Badges & Labels */}
          {showLabels && (
            <g fontFamily="Inter, sans-serif" fontWeight="800">
              {/* Concourse A */}
              <text x="210" y="65" fill="#7dd3fc" fontSize={compact ? 13 : 16} letterSpacing="0.08em" textAnchor="middle">
                A1 - A8
              </text>
              {/* Concourse B (Centered above Concourse B) */}
              <text x="500" y="38" fill="#7dd3fc" fontSize={compact ? 13 : 16} letterSpacing="0.08em" textAnchor="middle">
                B1 - B10
              </text>
              {/* Concourse C */}
              <text x="790" y="65" fill="#7dd3fc" fontSize={compact ? 13 : 16} letterSpacing="0.08em" textAnchor="middle">
                C1 - C8
              </text>
            </g>
          )}

          {/* Gate Badges & Wayfinding Icons */}
          <g transform="translate(195, 125)">
            <circle cx="0" cy="0" r="10" fill="#f59e0b" />
            <path d="M -5,1 L 0,-5 L 5,1 L 2,1 L 2,5 L -2,5 L -2,1 Z" fill="#ffffff" />
          </g>
          <g transform="translate(245, 235)">
            <circle cx="0" cy="0" r="9" fill="#0284c7" />
            <path d="M -3,-3 L 3,-3 L 3,3 L -3,3 Z" fill="#ffffff" />
          </g>

          <g transform="translate(805, 125)">
            <circle cx="0" cy="0" r="10" fill="#f59e0b" />
            <path d="M -5,1 L 0,-5 L 5,1 L 2,1 L 2,5 L -2,5 L -2,1 Z" fill="#ffffff" />
          </g>
          <g transform="translate(755, 235)">
            <circle cx="0" cy="0" r="9" fill="#0284c7" />
            <path d="M -3,-3 L 3,-3 L 3,3 L -3,3 Z" fill="#ffffff" />
          </g>

          <g transform="translate(420, 275)">
            <rect x="-10" y="-8" width="20" height="16" rx="3" fill="#0284c7" />
            <circle cx="0" cy="0" r="3" fill="#38bdf8" />
          </g>
          <g transform="translate(580, 275)">
            <rect x="-10" y="-8" width="20" height="16" rx="3" fill="#0284c7" />
            <circle cx="0" cy="0" r="3" fill="#38bdf8" />
          </g>
        </g>

        {/* 5. The 29 SCADA Interactive Zone Overlays */}
        {showZones && (
          <g id="scada-zones">
            {ISOMETRIC_ZONES.map((zone) => {
              const isFaulted = hasAlert && zone.id === alertZone;
              const isHovered = hoveredZone === zone.id;

              return (
                <g
                  key={zone.id}
                  transform={zone.rot ? `rotate(${zone.rot}, ${zone.x}, ${zone.y})` : undefined}
                  onClick={(e) => {
                    e.stopPropagation();
                    onZoneClick?.(zone.id);
                  }}
                  onMouseEnter={() => setHoveredZone(zone.id)}
                  onMouseLeave={() => setHoveredZone(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <rect
                    x={zone.x - zone.w / 2}
                    y={zone.y - zone.h / 2}
                    width={zone.w}
                    height={zone.h}
                    rx="4"
                    fill={
                      isFaulted
                        ? 'rgba(239, 68, 68, 0.45)'
                        : isHovered
                        ? 'rgba(14, 165, 233, 0.35)'
                        : 'rgba(8, 16, 28, 0.78)'
                    }
                    stroke={
                      isFaulted
                        ? '#ef4444'
                        : isHovered
                        ? '#38bdf8'
                        : 'rgba(56, 189, 248, 0.35)'
                    }
                    strokeWidth={isFaulted || isHovered ? '2' : '1'}
                    filter={isFaulted ? 'url(#radarPingAlert)' : undefined}
                  />

                  {/* Faulted Ping Animation Rings */}
                  {isFaulted && (
                    <g>
                      <circle
                        cx={zone.x}
                        cy={zone.y}
                        r="18"
                        fill="rgba(239, 68, 68, 0.35)"
                        className="pulse-ring-anim"
                      />
                      <circle cx={zone.x} cy={zone.y} r="9" fill="#ef4444" />
                      <text
                        x={zone.x}
                        y={zone.y}
                        fill="#ffffff"
                        fontSize="9.5"
                        fontWeight="900"
                        fontFamily="'JetBrains Mono', monospace"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        {zone.id}
                      </text>
                    </g>
                  )}

                  {/* Normal Zone ID Number */}
                  {!isFaulted && (
                    <text
                      x={zone.x}
                      y={zone.y}
                      fill={isHovered ? '#38bdf8' : '#f8fafc'}
                      fontSize={compact ? '8.5' : '9.5'}
                      fontWeight="700"
                      fontFamily="'JetBrains Mono', monospace"
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{ pointerEvents: 'none' }}
                    >
                      {zone.id}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        )}

        {/* 6. Dynamic Telemetry Equipment Nodes (for FloorMap mode) */}
        {equipment.map((eq) => {
          const svgX = (eq.x / 100) * 880 + 60;
          const svgY = (eq.y / 100) * 440 + 50;

          const isHovered = hoveredEq?.id === eq.id;
          const isCritical = eq.status === 'critical';
          const isWarning = eq.status === 'warning';

          const markerColor = isCritical
            ? '#ef4444'
            : isWarning
            ? '#f59e0b'
            : '#10b981';

          return (
            <g
              key={eq.id}
              transform={`translate(${svgX}, ${svgY})`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectEquipment?.(eq);
              }}
              onMouseEnter={() => setHoveredEq(eq)}
              onMouseLeave={() => setHoveredEq(null)}
              style={{ cursor: 'pointer' }}
            >
              {(isCritical || isWarning) && (
                <circle
                  cx="0"
                  cy="0"
                  r={isHovered ? 16 : 12}
                  fill={isCritical ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}
                  className="pulse-ring-anim"
                />
              )}
              <circle
                cx="0"
                cy="0"
                r={isHovered ? 10 : 8}
                fill="#0f172a"
                stroke={markerColor}
                strokeWidth={isHovered ? 2.5 : 1.8}
                filter="url(#subtleGlow)"
              />
              <circle cx="0" cy="0" r="3" fill={markerColor} />
            </g>
          );
        })}
      </svg>

      {/* Equipment Inspection Hover Card */}
      {hoveredEq && (
        <div
          style={{
            position: 'absolute',
            left: `${Math.min(Math.max((hoveredEq.x / 100) * 88 + 6, 12), 85)}%`,
            top: `${Math.min(Math.max((hoveredEq.y / 100) * 75 + 10, 15), 75)}%`,
            transform: 'translate(-50%, -115%)',
            background: 'rgba(8, 14, 25, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: 10,
            padding: '10px 14px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
            zIndex: 40,
            pointerEvents: 'none',
            minWidth: 180,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#ffffff', fontFamily: 'monospace' }}>
              {hoveredEq.id}
            </span>
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                textTransform: 'uppercase',
                padding: '2px 6px',
                borderRadius: 4,
                background:
                  hoveredEq.status === 'critical'
                    ? 'rgba(239, 68, 68, 0.25)'
                    : hoveredEq.status === 'warning'
                    ? 'rgba(245, 158, 11, 0.25)'
                    : 'rgba(16, 185, 129, 0.25)',
                color:
                  hoveredEq.status === 'critical'
                    ? '#f87171'
                    : hoveredEq.status === 'warning'
                    ? '#fbbf24'
                    : '#34d399',
              }}
            >
              {hoveredEq.status}
            </span>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 2 }}>
            {hoveredEq.type} · {hoveredEq.system}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
            Zone: {hoveredEq.zone || activeFloor}
          </div>
        </div>
      )}
    </div>
  );
}
