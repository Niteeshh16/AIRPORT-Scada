import React from 'react';
import { Wind, Thermometer, Gauge, Zap, Flame, ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export default function SCADASchematic({ equipment }) {
  if (!equipment) return null;

  const type = equipment.type || 'AHU';
  const isCritical = equipment.status === 'critical';
  const isWarning = equipment.status === 'warning';
  const isRunning = equipment.mode !== 'Stop' && equipment.status !== 'offline';

  if (type === 'AHU') {
    const fanSpeed = isRunning ? Math.max(0.4, 2.5 - (equipment.fanRPM || 1200) / 800) : 0;

    return (
      <div className="scada-schematic-card">
        <div className="scada-schematic-header">
          <div className="schematic-title">
            <Wind size={15} className="text-teal" />
            <span>AHU INDUSTRIAL FLOW DIAGRAM</span>
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
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
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
            <circle cx="0" cy="0" r="10" fill="#22c997" filter={isRunning ? 'url(#glowEffect)' : undefined} />
            
            {/* Fan Blades */}
            <g className={isRunning ? 'rotating-fan' : ''} style={{ animationDuration: `${fanSpeed}s`, transformOrigin: '0px 0px' }}>
              <path d="M 0,-10 C 15,-25 25,-20 0,-34 C -5,-25 0,-15 0,-10" fill="#22c997" opacity="0.85" />
              <path d="M 10,0 C 25,15 20,25 34,0 C 25,-5 15,0 10,0" fill="#22c997" opacity="0.85" />
              <path d="M 0,10 C -15,25 -25,20 0,34 C 5,25 0,15 0,10" fill="#22c997" opacity="0.85" />
              <path d="M -10,0 C -25,-15 -20,-25 -34,0 C -25,5 -15,0 -10,0" fill="#22c997" opacity="0.85" />
            </g>
            <text x="0" y="52" textAnchor="middle" fill="#22c997" fontSize="8" fontWeight="bold" fontFamily="JetBrains Mono">FAN MOTOR</text>
          </g>

          {/* Sensor Readouts inside SVG */}
          {/* Return Air Sensor */}
          <g transform="translate(35, 12)">
            <rect x="0" y="0" width="72" height="16" rx="3" fill="#1a1e28" stroke="rgba(255,255,255,0.1)" />
            <text x="36" y="11" textAnchor="middle" fill={equipment.returnTemp > 26 ? '#ef4444' : '#e8eaf0'} fontSize="9" fontWeight="600" fontFamily="JetBrains Mono">
              RA: {equipment.returnTemp || 28.6}°C
            </text>
          </g>

          {/* Supply Air Sensor */}
          <g transform="translate(300, 12)">
            <rect x="0" y="0" width="72" height="16" rx="3" fill="#1a1e28" stroke="rgba(255,255,255,0.1)" />
            <text x="36" y="11" textAnchor="middle" fill="#22c997" fontSize="9" fontWeight="600" fontFamily="JetBrains Mono">
              SA: {equipment.supplyTemp || 21.2}°C
            </text>
          </g>

          {/* Static Pressure Sensor */}
          <g transform="translate(300, 145)">
            <rect x="0" y="0" width="72" height="16" rx="3" fill="#1a1e28" stroke="rgba(255,255,255,0.1)" />
            <text x="36" y="11" textAnchor="middle" fill="#8b92a5" fontSize="8" fontFamily="JetBrains Mono">
              SP: {equipment.airPressure || 248} Pa
            </text>
          </g>
        </svg>
      </div>
    );
  }

  if (type === 'Conveyor') {
    const isJam = equipment.status === 'critical';
    return (
      <div className="scada-schematic-card">
        <div className="scada-schematic-header">
          <div className="schematic-title">
            <Zap size={15} className="text-teal" />
            <span>BHS CONVEYOR LINE SCHEMATIC</span>
          </div>
          <span className={`status-badge ${equipment.status}`}>
            {isJam ? 'MOTOR OVERLOAD TRIP' : 'SPEED: 1.8 m/s'}
          </span>
        </div>

        <svg viewBox="0 0 400 140" className="scada-svg-diagram">
          {/* Conveyor Bed */}
          <rect x="30" y="55" width="340" height="24" rx="4" fill="#12161f" stroke="#2a3040" strokeWidth="2" />
          
          {/* Rollers */}
          {[50, 95, 140, 185, 230, 275, 320, 350].map((rx, idx) => (
            <g key={idx} transform={`translate(${rx}, 67)`}>
              <circle cx="0" cy="0" r="9" fill="#1e2430" stroke="#3b82f6" strokeWidth="1.5" />
              <line x1="-6" y1="0" x2="6" y2="0" stroke="rgba(255,255,255,0.4)" className={!isJam ? 'rotating-roller' : ''} />
              <line x1="0" y1="-6" x2="0" y2="6" stroke="rgba(255,255,255,0.4)" className={!isJam ? 'rotating-roller' : ''} />
            </g>
          ))}

          {/* Belt Track Texture */}
          <line x1="30" y1="56" x2="370" y2="56" stroke="#22c997" strokeWidth="2" strokeDasharray="8 6" className={!isJam ? 'flowing-line' : ''} />
          <line x1="30" y1="78" x2="370" y2="78" stroke="#22c997" strokeWidth="2" strokeDasharray="8 6" className={!isJam ? 'flowing-line' : ''} />

          {/* Luggage Parcels */}
          <g className={!isJam ? 'luggage-moving-1' : ''}>
            <rect x="70" y="38" width="28" height="18" rx="2" fill="#f5a623" stroke="#d97706" strokeWidth="1" />
            <line x1="77" y1="38" x2="77" y2="56" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
          </g>
          <g className={!isJam ? 'luggage-moving-2' : ''}>
            <rect x="180" y="36" width="32" height="20" rx="2" fill="#3b82f6" stroke="#2563eb" strokeWidth="1" />
            <line x1="190" y1="36" x2="190" y2="56" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
          </g>
          <g className={isJam ? 'luggage-jammed' : 'luggage-moving-3'}>
            <rect x="290" y="37" width="30" height="19" rx="2" fill={isJam ? '#ef4444' : '#10b981'} stroke={isJam ? '#b91c1c' : '#059669'} strokeWidth="1.5" />
            {isJam && (
              <text x="305" y="50" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">JAM</text>
            )}
          </g>

          {/* Photoelectric Sensor Laser */}
          <line x1="285" y1="20" x2="285" y2="90" stroke={isJam ? '#ef4444' : '#22c997'} strokeWidth="1.5" strokeDasharray="3 3" className="laser-beam" />
          <circle cx="285" cy="20" r="4" fill={isJam ? '#ef4444' : '#22c997'} />
          <text x="285" y="105" textAnchor="middle" fill={isJam ? '#ef4444' : '#22c997'} fontSize="8" fontFamily="JetBrains Mono">PE-SENSOR 03</text>
        </svg>
      </div>
    );
  }

  if (type === 'Chiller') {
    return (
      <div className="scada-schematic-card">
        <div className="scada-schematic-header">
          <div className="schematic-title">
            <Thermometer size={15} className="text-teal" />
            <span>CENTRAL CHILLER PLANT HYDRONIC LOOP</span>
          </div>
          <span className={`status-badge ${equipment.status}`}>
            COP: 5.8 | {equipment.power || 120.5} kW
          </span>
        </div>

        <svg viewBox="0 0 400 150" className="scada-svg-diagram">
          {/* Evaporator Barrel */}
          <rect x="40" y="30" width="130" height="60" rx="8" fill="#0c1e2e" stroke="#06b6d4" strokeWidth="2" />
          <text x="105" y="65" textAnchor="middle" fill="#06b6d4" fontSize="11" fontWeight="bold" fontFamily="JetBrains Mono">EVAPORATOR</text>
          
          {/* Condenser Barrel */}
          <rect x="230" y="30" width="130" height="60" rx="8" fill="#261b0c" stroke="#f5a623" strokeWidth="2" />
          <text x="295" y="65" textAnchor="middle" fill="#f5a623" fontSize="11" fontWeight="bold" fontFamily="JetBrains Mono">CONDENSER</text>

          {/* Centrifugal Compressor */}
          <circle cx="200" cy="40" r="22" fill="#1a1e28" stroke="#22c997" strokeWidth="2" />
          <text x="200" y="44" textAnchor="middle" fill="#22c997" fontSize="8" fontWeight="bold">COMP</text>

          {/* Connecting Pipes with animated flow */}
          <path d="M 170,45 L 178,45 L 178,40 L 222,40 L 222,45 L 230,45" fill="none" stroke="#22c997" strokeWidth="2" strokeDasharray="4 4" className="flowing-line" />
          <path d="M 230,80 L 170,80" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" className="flowing-line-reverse" />

          {/* Chilled Water In/Out */}
          <text x="40" y="115" fill="#3b82f6" fontSize="9" fontFamily="JetBrains Mono">CHW SUPPLY: {equipment.supplyTemp || 6.8}°C</text>
          <text x="40" y="130" fill="#06b6d4" fontSize="9" fontFamily="JetBrains Mono">CHW RETURN: {equipment.returnTemp || 12.4}°C</text>

          {/* Condenser Water In/Out */}
          <text x="230" y="115" fill="#f5a623" fontSize="9" fontFamily="JetBrains Mono">CW SUPPLY: 31.5°C</text>
          <text x="230" y="130" fill="#ef4444" fontSize="9" fontFamily="JetBrains Mono">CW RETURN: 36.8°C</text>
        </svg>
      </div>
    );
  }

  // Fallback generic SCADA schematic
  return (
    <div className="scada-schematic-card">
      <div className="scada-schematic-header">
        <div className="schematic-title">
          <Gauge size={15} className="text-teal" />
          <span>DEVICE TELEMETRY SIGNALS</span>
        </div>
        <span className={`status-badge ${equipment.status}`}>{equipment.comm}</span>
      </div>
      <div className="telemetry-grid">
        <div className="telemetry-chip">
          <span className="chip-label">STATE</span>
          <span className="chip-val font-mono">{equipment.mode}</span>
        </div>
        <div className="telemetry-chip">
          <span className="chip-label">HEALTH</span>
          <span className="chip-val font-mono text-teal">{equipment.health}%</span>
        </div>
        <div className="telemetry-chip">
          <span className="chip-label">COMM PROTOCOL</span>
          <span className="chip-val font-mono">BACnet / IP</span>
        </div>
        <div className="telemetry-chip">
          <span className="chip-label">SCAN CYCLE</span>
          <span className="chip-val font-mono text-teal">500ms</span>
        </div>
      </div>
    </div>
  );
}
