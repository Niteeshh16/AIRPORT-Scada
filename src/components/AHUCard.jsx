import React from 'react';

export default function AHUCard({ equipment, isSelected, onClick }) {
  if (!equipment) return null;

  const isFault = equipment.status === 'critical';
  const isWarning = equipment.status === 'warning';
  const isTrip = isFault;
  const isManual = equipment.mode === 'Manual';

  const raTemp = equipment.returnTemp !== null ? equipment.returnTemp : (equipment.temp || 24.5);
  const saTemp = equipment.supplyTemp !== null ? equipment.supplyTemp : 21.5;
  const fanRpm = equipment.fanRPM !== null ? equipment.fanRPM : 1150;
  const vsdRpmPercent = Math.min(100, Math.round((fanRpm / 1500) * 100));
  const raPressurePercent = equipment.airPressure ? Math.min(100, Math.round((equipment.airPressure / 300) * 100)) : 85;
  const coolingValve = equipment.coolingValve !== null ? equipment.coolingValve : 65;

  // Temperature bar heights (scale 10 to 35 °C)
  const raHeightPct = Math.max(10, Math.min(100, ((raTemp - 10) / 25) * 100));
  const saHeightPct = Math.max(10, Math.min(100, ((saTemp - 10) / 25) * 100));

  // Circular gauge arc calculations
  const calculateArc = (percent, radius = 24, strokeWidth = 5) => {
    const circumference = Math.PI * radius; // Half circle
    const offset = circumference - (percent / 100) * circumference;
    return { circumference, offset };
  };

  const vsdArc = calculateArc(vsdRpmPercent, 20);
  const pressureArc = calculateArc(raPressurePercent, 18);
  const valveArc = calculateArc(coolingValve, 18);

  return (
    <div 
      className={`ahu-scada-card ${isFault ? 'fault' : isWarning ? 'warning' : 'operational'} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      {/* Top Header */}
      <div className="ahu-card-header">
        <div className="ahu-card-id-row">
          <span className={`ahu-id-text ${isFault ? 'text-red' : ''}`}>{equipment.id}</span>
        </div>
        <div className="ahu-card-status-tags">
          <span className={`ahu-tag-dot ${equipment.status === 'offline' ? 'off' : 'on'}`} title="Run/Stop Status" />
          <span className="ahu-mode-tag">{isManual ? 'Manual' : 'Auto'}</span>
          <span className={`ahu-trip-dot ${isTrip ? 'tripped' : ''}`} title="Trip Status" />
        </div>
      </div>

      {/* Main Dual Temp Bars + RPM Gauge */}
      <div className="ahu-gauges-center">
        {/* Dual Vertical Thermometer Bars */}
        <div className="ahu-thermometer-section">
          {/* Degree Scale */}
          <div className="ahu-scale-labels">
            <span>30°</span>
            <span>20°</span>
            <span>10°</span>
          </div>

          {/* RA Temp Bar */}
          <div className="ahu-temp-bar-wrapper">
            <span className="ahu-temp-digit">{raTemp}°</span>
            <div className="ahu-temp-track">
              <div 
                className={`ahu-temp-fill ${raTemp > 26 ? 'high-temp' : ''}`} 
                style={{ height: `${raHeightPct}%` }} 
              />
            </div>
            <span className="ahu-temp-label">RA Temp</span>
          </div>

          {/* SA Temp Bar */}
          <div className="ahu-temp-bar-wrapper">
            <span className="ahu-temp-digit">{saTemp}°</span>
            <div className="ahu-temp-track">
              <div 
                className="ahu-temp-fill sa" 
                style={{ height: `${saHeightPct}%` }} 
              />
            </div>
            <span className="ahu-temp-label">SA Temp</span>
          </div>
        </div>

        {/* FAN RPM & Circular VSD Gauge */}
        <div className="ahu-vsd-gauge-box">
          <div className="ahu-rpm-digital">
            <span className="ahu-rpm-value font-mono">{fanRpm}</span>
            <span className="ahu-rpm-unit">FAN RPM</span>
          </div>

          {/* Semicircular VSD % Gauge */}
          <div className="ahu-dial-gauge">
            <svg viewBox="0 0 50 30" width="56" height="34">
              <path 
                d="M 5,28 A 20,20 0 0,1 45,28" 
                fill="none" 
                stroke="#1a202c" 
                strokeWidth="5" 
                strokeLinecap="round" 
              />
              <path 
                d="M 5,28 A 20,20 0 0,1 45,28" 
                fill="none" 
                stroke="url(#vsdGrad)" 
                strokeWidth="5" 
                strokeDasharray={vsdArc.circumference}
                strokeDashoffset={vsdArc.offset}
                strokeLinecap="round" 
              />
              <defs>
                <linearGradient id="vsdGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#22c997" />
                  <stop offset="70%" stopColor="#f5a623" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
            </svg>
            <div className="ahu-dial-val font-mono">{vsdRpmPercent}%</div>
            <div className="ahu-dial-label">VSD - RPM</div>
          </div>
        </div>
      </div>

      {/* Bottom Dual Semicircular Gauges: RA Pressure & Cooling Valve */}
      <div className="ahu-bottom-dials">
        {/* RA Pressure Gauge */}
        <div className="ahu-small-dial">
          <svg viewBox="0 0 44 26" width="48" height="28">
            <path d="M 4,24 A 18,18 0 0,1 40,24" fill="none" stroke="#1a202c" strokeWidth="4" strokeLinecap="round" />
            <path 
              d="M 4,24 A 18,18 0 0,1 40,24" 
              fill="none" 
              stroke="#22c997" 
              strokeWidth="4" 
              strokeDasharray={pressureArc.circumference}
              strokeDashoffset={pressureArc.offset}
              strokeLinecap="round" 
            />
          </svg>
          <span className="ahu-dial-percent">{raPressurePercent}%</span>
          <span className="ahu-dial-title">RA Pressure</span>
        </div>

        {/* Cooling Coil Valve Gauge */}
        <div className="ahu-small-dial">
          <svg viewBox="0 0 44 26" width="48" height="28">
            <path d="M 4,24 A 18,18 0 0,1 40,24" fill="none" stroke="#1a202c" strokeWidth="4" strokeLinecap="round" />
            <path 
              d="M 4,24 A 18,18 0 0,1 40,24" 
              fill="none" 
              stroke="#f5a623" 
              strokeWidth="4" 
              strokeDasharray={valveArc.circumference}
              strokeDashoffset={valveArc.offset}
              strokeLinecap="round" 
            />
          </svg>
          <span className="ahu-dial-percent">{coolingValve}%</span>
          <span className="ahu-dial-title">Cooling Coil Valve - %</span>
        </div>
      </div>

      {/* Bottom Fault Indicators */}
      <div className="ahu-fault-strip">
        <div className="ahu-fault-indicator">
          <span className={`ahu-indicator-dot ${isFault ? 'red' : 'green'}`} />
          <span>Duct Smoke</span>
        </div>
        <div className="ahu-fault-indicator">
          <span className="ahu-indicator-dot green" />
          <span>Pre-Filter</span>
        </div>
        <div className="ahu-fault-indicator">
          <span className={`ahu-indicator-dot ${isWarning ? 'amber' : 'green'}`} />
          <span>Bag-Filter</span>
        </div>
      </div>
    </div>
  );
}
