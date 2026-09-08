import React from 'react';
import { 
  Wind, Thermometer, Zap, Flame, Server, Package 
} from 'lucide-react';

export default function SCADASchematic({ equipment }) {
  if (!equipment) return null;

  const type = equipment.type || 'AHU';
  const isCritical = equipment.status === 'critical';
  const isWarning = equipment.status === 'warning';
  const isRunning = equipment.mode !== 'Stop' && equipment.status !== 'offline';

  // 1. ELECTRICAL POWER SCADA SINGLE LINE DIAGRAM (VCB, ACB, Transformer, UPS)
  if (type === 'VCB' || type === 'ACB' || type === 'Transformer' || type === 'UPS' || equipment.system === 'SCADA') {
    const isClosed = equipment.mode === 'Closed' || equipment.mode === 'Energized' || equipment.mode === 'Inverter Online';
    const isTrip = equipment.status === 'critical';

    return (
      <div className="scada-schematic-card">
        <div className="scada-schematic-header">
          <div className="schematic-title">
            <Zap size={15} className="text-amber" />
            <span>ELECTRICAL SCADA SINGLE LINE DIAGRAM (SLD)</span>
          </div>
          <span className={`status-badge ${isTrip ? 'critical' : 'operational'}`}>
            <span className="status-dot-sm" />
            {isTrip ? 'TRIP / FAULT' : isClosed ? 'ENERGIZED / CLOSED' : 'OPEN'}
          </span>
        </div>

        <svg viewBox="0 0 420 180" className="scada-svg-diagram">
          <defs>
            <linearGradient id="busbarGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ef4444" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="lvBusbarGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* 22kV MV Incomer Busbar */}
          <line x1="30" y1="25" x2="390" y2="25" stroke="url(#busbarGrad)" strokeWidth="4" strokeLinecap="round" />
          <text x="40" y="18" fill="#f59e0b" fontSize="9" fontWeight="bold" fontFamily="JetBrains Mono">22kV MV BUSBAR (SUBSTATION SS-1)</text>

          {/* Feeder to VCB */}
          <line x1="120" y1="25" x2="120" y2="50" stroke="#f59e0b" strokeWidth="2.5" />
          
          {/* VCB Breaker Symbol */}
          <rect x="105" y="50" width="30" height="24" rx="3" fill="#161b22" stroke={isTrip ? '#ef4444' : '#f59e0b'} strokeWidth="1.5" />
          {isClosed ? (
            <line x1="120" y1="50" x2="120" y2="74" stroke="#10b981" strokeWidth="3" />
          ) : (
            <line x1="112" y1="52" x2="128" y2="72" stroke="#ef4444" strokeWidth="2.5" />
          )}
          <text x="142" y="65" fill="#8b92a5" fontSize="8" fontFamily="JetBrains Mono">VCB-22KV</text>

          {/* Transformer Symbol */}
          <g transform="translate(120, 95)">
            <circle cx="0" cy="-6" r="12" fill="none" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="0" cy="10" r="12" fill="none" stroke="#06b6d4" strokeWidth="2" />
            <text x="22" y="5" fill="#e8eaf0" fontSize="8" fontWeight="bold" fontFamily="JetBrains Mono">TR-11 (22/0.4kV)</text>
          </g>

          {/* 0.4kV LV Main Busbar */}
          <line x1="30" y1="135" x2="390" y2="135" stroke="url(#lvBusbarGrad)" strokeWidth="4" strokeLinecap="round" />
          <text x="40" y="148" fill="#06b6d4" fontSize="9" fontWeight="bold" fontFamily="JetBrains Mono">0.4kV LV MAIN BUSBAR (MSB-1A)</text>

          {/* LV Air Circuit Breaker (ACB) */}
          <g transform="translate(280, 85)">
            <line x1="0" y1="-60" x2="0" y2="-15" stroke="#f59e0b" strokeWidth="2" />
            <rect x="-15" y="-15" width="30" height="25" rx="3" fill="#161b22" stroke="#22c997" strokeWidth="1.5" />
            <line x1="0" y1="-15" x2="0" y2="10" stroke="#22c997" strokeWidth="3" />
            <text x="20" y="0" fill="#22c997" fontSize="8" fontWeight="bold" fontFamily="JetBrains Mono">ACB-LV-01</text>
            <line x1="0" y1="10" x2="0" y2="50" stroke="#06b6d4" strokeWidth="2" />
          </g>

          {/* Substation Telemetry Badges */}
          <g transform="translate(30, 160)">
            <text x="0" y="10" fill="#8b92a5" fontSize="9" fontFamily="JetBrains Mono">
              Voltage: <tspan fill="#06b6d4">{equipment.voltage || '400.2'} V</tspan> | 
              Current: <tspan fill="#f59e0b">{equipment.current || '1,250'} A</tspan> | 
              cos φ: <tspan fill="#22c997">{equipment.powerFactor || '0.98'}</tspan> | 
              Power: <tspan fill="#e8eaf0">{equipment.power || '865'} kW</tspan>
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 2. BHS CONVEYOR & FIRE/SECURITY SHUTTER SCHEMATIC
  if (type === 'Conveyor' || type === 'Fire Shutter' || equipment.system === 'BHS') {
    const isJam = equipment.status === 'critical';
    const isShutterClosed = equipment.shutterState === 'Closed' || isJam;

    return (
      <div className="scada-schematic-card">
        <div className="scada-schematic-header">
          <div className="schematic-title">
            <Package size={15} className="text-teal" />
            <span>BHS CONVEYOR LINE & FIRE SHUTTER INTERLOCK</span>
          </div>
          <span className={`status-badge ${equipment.status}`}>
            {isJam ? 'MOTOR OVERLOAD TRIP' : 'FEED SPEED: 1.8 m/s'}
          </span>
        </div>

        <svg viewBox="0 0 420 160" className="scada-svg-diagram">
          {/* Conveyor Bed */}
          <rect x="25" y="60" width="370" height="26" rx="4" fill="#12161f" stroke="#2a3040" strokeWidth="2" />
          
          {/* Rollers */}
          {[45, 90, 135, 180, 225, 270, 315, 360].map((rx, idx) => (
            <g key={idx} transform={`translate(${rx}, 73)`}>
              <circle cx="0" cy="0" r="9" fill="#1e2430" stroke="#3b82f6" strokeWidth="1.5" />
              <line x1="-6" y1="0" x2="6" y2="0" stroke="rgba(255,255,255,0.4)" className={!isJam ? 'rotating-roller' : ''} />
              <line x1="0" y1="-6" x2="0" y2="6" stroke="rgba(255,255,255,0.4)" className={!isJam ? 'rotating-roller' : ''} />
            </g>
          ))}

          {/* Belt Track Texture */}
          <line x1="25" y1="61" x2="395" y2="61" stroke="#22c997" strokeWidth="2" strokeDasharray="8 6" className={!isJam ? 'flowing-line' : ''} />
          <line x1="25" y1="85" x2="395" y2="85" stroke="#22c997" strokeWidth="2" strokeDasharray="8 6" className={!isJam ? 'flowing-line' : ''} />

          {/* Fire / Security Shutter Barrier */}
          <g transform="translate(240, 20)">
            <rect x="0" y="0" width="14" height="66" fill="#1e2430" stroke={isShutterClosed ? '#ef4444' : '#22c997'} strokeWidth="1.5" />
            <line x1="7" y1="0" x2="7" y2="66" stroke={isShutterClosed ? '#ef4444' : '#22c997'} strokeDasharray="4 4" />
            <text x="7" y="-5" textAnchor="middle" fill={isShutterClosed ? '#ef4444' : '#22c997'} fontSize="8" fontWeight="bold" fontFamily="JetBrains Mono">
              SHUTTER: {isShutterClosed ? 'CLOSED' : 'OPEN'}
            </text>
          </g>

          {/* Luggage Parcels */}
          <g className={!isJam ? 'luggage-moving-1' : ''}>
            <rect x="65" y="42" width="28" height="18" rx="2" fill="#f5a623" stroke="#d97706" strokeWidth="1" />
          </g>
          <g className={!isJam ? 'luggage-moving-2' : ''}>
            <rect x="150" y="40" width="32" height="20" rx="2" fill="#3b82f6" stroke="#2563eb" strokeWidth="1" />
          </g>
          <g className={isJam ? 'luggage-jammed' : 'luggage-moving-3'}>
            <rect x="220" y="41" width="30" height="19" rx="2" fill={isJam ? '#ef4444' : '#10b981'} stroke={isJam ? '#b91c1c' : '#059669'} strokeWidth="1.5" />
            {isJam && (
              <text x="235" y="54" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">JAM</text>
            )}
          </g>

          {/* Photoelectric Sensor Laser */}
          <line x1="215" y1="30" x2="215" y2="95" stroke={isJam ? '#ef4444' : '#22c997'} strokeWidth="1.5" strokeDasharray="3 3" className="laser-beam" />
          <circle cx="215" cy="30" r="4" fill={isJam ? '#ef4444' : '#22c997'} />
          <text x="215" y="112" textAnchor="middle" fill={isJam ? '#ef4444' : '#22c997'} fontSize="8" fontFamily="JetBrains Mono">PE-SENSOR 03</text>

          {/* Shutter Safety Note */}
          <text x="25" y="145" fill="#8b92a5" fontSize="8" fontFamily="JetBrains Mono">
            OPC UA Tag: SubSystemStatus | ShutterStatus: {isShutterClosed ? '2 (Closed / Interlocked)' : '1 (Open / Clear)'}
          </text>
        </svg>
      </div>
    );
  }

  // 3. FIRE ALARM SYSTEM (FAS) BACNET LIFE SAFETY SCHEMATIC
  if (type === 'Fire Detector' || type === 'Fire Panel' || equipment.system === 'FAS') {
    return (
      <div className="scada-schematic-card">
        <div className="scada-schematic-header">
          <div className="schematic-title">
            <Flame size={15} className="text-red" />
            <span>FAS BACNET LIFE SAFETY ZONE SCHEMATIC</span>
          </div>
          <span className={`status-badge ${equipment.status}`}>
            BACNET: SUPERVISORY NORMAL
          </span>
        </div>

        <svg viewBox="0 0 400 150" className="scada-svg-diagram">
          {/* Zone Bounding Box */}
          <rect x="25" y="25" width="350" height="95" rx="6" fill="#12161f" stroke="rgba(239,68,68,0.3)" strokeWidth="1.5" />
          <text x="40" y="42" fill="#ef4444" fontSize="9" fontWeight="bold" fontFamily="JetBrains Mono">FIRE ZONE 01 — CENTRAL DEPARTURES</text>

          {/* Optical Smoke Detectors */}
          {[90, 180, 270].map((dx, idx) => (
            <g key={idx} transform={`translate(${dx}, 75)`}>
              <circle cx="0" cy="0" r="14" fill="#1e2430" stroke="#ef4444" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="5" fill="#ef4444" opacity="0.8" />
              <text x="0" y="24" textAnchor="middle" fill="#8b92a5" fontSize="8" fontFamily="JetBrains Mono">DET-0{idx+1}</text>
            </g>
          ))}

          {/* Deluge / Pre-action Sprinkler Valve */}
          <g transform="translate(330, 75)">
            <polygon points="-10,-10 10,-10 0,0 -10,10 10,10" fill="#3b82f6" opacity="0.8" />
            <text x="0" y="24" textAnchor="middle" fill="#06b6d4" fontSize="8" fontFamily="JetBrains Mono">FM200</text>
          </g>

          <text x="25" y="140" fill="#8b92a5" fontSize="8" fontFamily="JetBrains Mono">
            BACnet Protocol: Life Safety Point Object #4101 | Status: In-Service | Supervisory MTTA &lt; 30s
          </text>
        </svg>
      </div>
    );
  }

  // 4. CRAH DATA CENTER PRECISION COOLING UNIT
  if (type === 'CRAH') {
    return (
      <div className="scada-schematic-card">
        <div className="scada-schematic-header">
          <div className="schematic-title">
            <Server size={15} className="text-teal" />
            <span>CRAH COMPUTER ROOM AIR HANDLER (DATA CENTER)</span>
          </div>
          <span className={`status-badge ${equipment.status}`}>
            SLA: 100% COMPLIANT
          </span>
        </div>

        <svg viewBox="0 0 400 150" className="scada-svg-diagram">
          <rect x="30" y="25" width="340" height="95" rx="6" fill="#0d1117" stroke="#06b6d4" strokeWidth="1.5" />
          
          {/* Raised Floor Airflow */}
          <line x1="30" y1="100" x2="370" y2="100" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6 4" />
          <text x="40" y="112" fill="#3b82f6" fontSize="8" fontFamily="JetBrains Mono">UNDERFLOOR PLENUM SUPPLY: 18.0°C</text>

          {/* CRAH Fans */}
          <g transform="translate(100, 60)">
            <circle cx="0" cy="0" r="18" fill="#161b22" stroke="#22c997" strokeWidth="1.5" />
            <text x="0" y="4" textAnchor="middle" fill="#22c997" fontSize="8" fontWeight="bold">EC FAN</text>
          </g>
          <g transform="translate(160, 60)">
            <circle cx="0" cy="0" r="18" fill="#161b22" stroke="#22c997" strokeWidth="1.5" />
            <text x="0" y="4" textAnchor="middle" fill="#22c997" fontSize="8" fontWeight="bold">EC FAN</text>
          </g>

          {/* Sensor Readouts */}
          <g transform="translate(230, 45)">
            <text x="0" y="10" fill="#e8eaf0" fontSize="9" fontWeight="bold" fontFamily="JetBrains Mono">
              Server Room: <tspan fill="#22c997">{equipment.temp || '20.2'}°C</tspan>
            </text>
            <text x="0" y="26" fill="#8b92a5" fontSize="8" fontFamily="JetBrains Mono">
              Humidity: <tspan fill="#06b6d4">48% RH (Target: 50±10%)</tspan>
            </text>
            <text x="0" y="42" fill="#8b92a5" fontSize="8" fontFamily="JetBrains Mono">
              Chilled Water Valve: <tspan fill="#f59e0b">{equipment.coolingValve || '42'}%</tspan>
            </text>
          </g>

          <text x="30" y="140" fill="#8b92a5" fontSize="8" fontFamily="JetBrains Mono">
            OPC UA Tag: CRAH_ThermalCompliance | Target: 20°C ± 2°C (Zero Tolerance SLA)
          </text>
        </svg>
      </div>
    );
  }

  // 5. CHILLER HYDRONIC LOOP SCHEMATIC
  if (type === 'Chiller') {
    return (
      <div className="scada-schematic-card">
        <div className="scada-schematic-header">
          <div className="schematic-title">
            <Thermometer size={15} className="text-teal" />
            <span>CENTRAL CHILLER PLANT HYDRONIC LOOP (LBMS-KPI-E03)</span>
          </div>
          <span className={`status-badge ${equipment.status}`}>
            EFFICIENCY: 0.58 kW/RT | COP: 5.85
          </span>
        </div>

        <svg viewBox="0 0 400 155" className="scada-svg-diagram">
          {/* Evaporator Barrel */}
          <rect x="35" y="30" width="130" height="60" rx="8" fill="#0c1e2e" stroke="#06b6d4" strokeWidth="2" />
          <text x="100" y="65" textAnchor="middle" fill="#06b6d4" fontSize="11" fontWeight="bold" fontFamily="JetBrains Mono">EVAPORATOR</text>
          
          {/* Condenser Barrel */}
          <rect x="235" y="30" width="130" height="60" rx="8" fill="#261b0c" stroke="#f5a623" strokeWidth="2" />
          <text x="300" y="65" textAnchor="middle" fill="#f5a623" fontSize="11" fontWeight="bold" fontFamily="JetBrains Mono">CONDENSER</text>

          {/* Centrifugal Compressor */}
          <circle cx="200" cy="40" r="22" fill="#1a1e28" stroke="#22c997" strokeWidth="2" />
          <text x="200" y="44" textAnchor="middle" fill="#22c997" fontSize="8" fontWeight="bold">COMP</text>

          {/* Connecting Pipes with animated flow */}
          <path d="M 165,45 L 175,45 L 175,40 L 225,40 L 225,45 L 235,45" fill="none" stroke="#22c997" strokeWidth="2" strokeDasharray="4 4" className="flowing-line" />
          <path d="M 235,80 L 165,80" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" className="flowing-line-reverse" />

          {/* Chilled Water In/Out (Delta T) */}
          <text x="35" y="112" fill="#3b82f6" fontSize="9" fontFamily="JetBrains Mono">CHW SUPPLY: {equipment.supplyTemp || 6.4}°C</text>
          <text x="35" y="126" fill="#06b6d4" fontSize="9" fontFamily="JetBrains Mono">CHW RETURN: {equipment.returnTemp || 12.2}°C (ΔT = 5.8°C)</text>

          {/* Condenser Water In/Out */}
          <text x="235" y="112" fill="#f5a623" fontSize="9" fontFamily="JetBrains Mono">CW SUPPLY: 31.5°C</text>
          <text x="235" y="126" fill="#ef4444" fontSize="9" fontFamily="JetBrains Mono">CW RETURN: 36.8°C (Approach: 2.8°C)</text>

          <text x="35" y="146" fill="#8b92a5" fontSize="8" fontFamily="JetBrains Mono">
            OPC UA Server (Port 5011) | Metric: LBMS-KPI-06 (Chilled Water Delta T ≥ 5.5°C)
          </text>
        </svg>
      </div>
    );
  }

  // 6. DEFAULT AHU SCHEMATIC (Air Handling Unit)
  const fanSpeed = isRunning ? Math.max(0.4, 2.5 - (equipment.fanRPM || 1200) / 800) : 0;

  return (
    <div className="scada-schematic-card">
      <div className="scada-schematic-header">
        <div className="schematic-title">
          <Wind size={15} className="text-teal" />
          <span>AHU INDUSTRIAL FLOW DIAGRAM (LBMS-KPI-01)</span>
        </div>
        <span className={`status-badge ${equipment.status}`}>
          <span className="status-dot-sm" />
          {isRunning ? `${equipment.fanRPM || 1200} RPM` : 'STOPPED'}
        </span>
      </div>

      <svg viewBox="0 0 400 170" className="scada-svg-diagram">
        <defs>
          <linearGradient id="coolCoilGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="airFlowGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(245, 166, 35, 0.2)" />
            <stop offset="50%" stopColor="rgba(6, 182, 212, 0.3)" />
            <stop offset="100%" stopColor="rgba(34, 201, 151, 0.4)" />
          </linearGradient>
        </defs>

        {/* Duct Housing */}
        <rect x="20" y="30" width="360" height="110" rx="6" fill="#0d1117" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
        <rect x="20" y="30" width="360" height="110" rx="6" fill="url(#airFlowGrad)" />

        {/* Airflow Particles Animation */}
        {isRunning && (
          <g className="airflow-particles">
            <line x1="30" y1="55" x2="370" y2="55" stroke="rgba(34,201,151,0.6)" strokeWidth="1.5" strokeDasharray="8,12" className="flowing-line-fast" />
            <line x1="30" y1="85" x2="370" y2="85" stroke="rgba(6,182,212,0.6)" strokeWidth="2" strokeDasharray="12,16" className="flowing-line" />
            <line x1="30" y1="115" x2="370" y2="115" stroke="rgba(59,130,246,0.6)" strokeWidth="1.5" strokeDasharray="8,12" className="flowing-line-fast" />
          </g>
        )}

        {/* Air Filter Section */}
        <g transform="translate(65, 32)">
          <rect x="0" y="0" width="16" height="106" fill="#1f2430" stroke="#3b4252" strokeWidth="1" />
          <line x1="4" y1="0" x2="4" y2="106" stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4" />
          <line x1="12" y1="0" x2="12" y2="106" stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4" />
          <text x="8" y="120" textAnchor="middle" fill="#8b92a5" fontSize="8" fontFamily="JetBrains Mono">FILTER</text>
        </g>

        {/* Cooling Coil Section */}
        <g transform="translate(135, 32)">
          <rect x="0" y="0" width="28" height="106" fill="url(#coolCoilGrad)" rx="2" stroke="#06b6d4" strokeWidth="1" />
          <path d="M 5,5 Q 14,25 5,45 Q 14,65 5,85 Q 14,100 5,105" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
          <path d="M 20,5 Q 11,25 20,45 Q 11,65 20,85 Q 11,100 20,105" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
          <text x="14" y="120" textAnchor="middle" fill="#06b6d4" fontSize="8" fontWeight="bold" fontFamily="JetBrains Mono">COIL {equipment.coolingValve || 65}%</text>
        </g>

        {/* Rotating Fan Assembly */}
        <g transform="translate(240, 85)">
          <circle cx="0" cy="0" r="38" fill="#161b22" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="10" fill="#22c997" />
          
          <g className={isRunning ? 'rotating-fan' : ''} style={{ animationDuration: `${fanSpeed}s`, transformOrigin: '0px 0px' }}>
            <path d="M 0,-10 C 15,-25 25,-20 0,-34 C -5,-25 0,-15 0,-10" fill="#22c997" opacity="0.85" />
            <path d="M 10,0 C 25,15 20,25 34,0 C 25,-5 15,0 10,0" fill="#22c997" opacity="0.85" />
            <path d="M 0,10 C -15,25 -25,20 0,34 C 5,25 0,15 0,10" fill="#22c997" opacity="0.85" />
            <path d="M -10,0 C -25,-15 -20,-25 -34,0 C -25,5 -15,0 -10,0" fill="#22c997" opacity="0.85" />
          </g>
          <text x="0" y="52" textAnchor="middle" fill="#22c997" fontSize="8" fontWeight="bold" fontFamily="JetBrains Mono">FAN MOTOR</text>
        </g>

        {/* Sensor Readouts inside SVG */}
        <g transform="translate(35, 12)">
          <rect x="0" y="0" width="75" height="16" rx="3" fill="#1a1e28" stroke="rgba(255,255,255,0.1)" />
          <text x="37" y="11" textAnchor="middle" fill={equipment.returnTemp > 26 ? '#ef4444' : '#e8eaf0'} fontSize="9" fontWeight="600" fontFamily="JetBrains Mono">
            RA: {equipment.returnTemp || 28.6}°C
          </text>
        </g>

        <g transform="translate(295, 12)">
          <rect x="0" y="0" width="75" height="16" rx="3" fill="#1a1e28" stroke="rgba(255,255,255,0.1)" />
          <text x="37" y="11" textAnchor="middle" fill="#22c997" fontSize="9" fontWeight="600" fontFamily="JetBrains Mono">
            SA: {equipment.supplyTemp || 21.2}°C
          </text>
        </g>

        <g transform="translate(295, 145)">
          <rect x="0" y="0" width="75" height="16" rx="3" fill="#1a1e28" stroke="rgba(255,255,255,0.1)" />
          <text x="37" y="11" textAnchor="middle" fill="#8b92a5" fontSize="8" fontFamily="JetBrains Mono">
            SP: {equipment.airPressure || 248} Pa
          </text>
        </g>
      </svg>
    </div>
  );
}
