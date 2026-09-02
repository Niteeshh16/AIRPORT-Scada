import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Plane, Truck, Tag, Maximize, Minimize } from 'lucide-react';

export default function SceneControls({
  onZoomIn,
  onZoomOut,
  onReset,
  showAircraft,
  onToggleAircraft,
  showVehicles,
  onToggleVehicles,
  showLabels,
  onToggleLabels,
  fullscreen,
  onToggleFullscreen,
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 24,
        right: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 50,
      }}
    >
      {/* Camera Actions */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          background: 'rgba(5, 10, 24, 0.85)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '10px',
          padding: '6px',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        }}
      >
        <button
          onClick={onZoomIn}
          title="Zoom In"
          className="twin-ctrl-btn"
          style={btnStyle}
        >
          <ZoomIn size={15} />
        </button>
        <button
          onClick={onZoomOut}
          title="Zoom Out"
          className="twin-ctrl-btn"
          style={btnStyle}
        >
          <ZoomOut size={15} />
        </button>
        <button
          onClick={onReset}
          title="Reset Camera to Overhead View"
          className="twin-ctrl-btn"
          style={{ ...btnStyle, color: '#38bdf8' }}
        >
          <RotateCcw size={15} />
        </button>
      </div>

      {/* Layer Toggles */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          background: 'rgba(5, 10, 24, 0.85)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '10px',
          padding: '6px',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        }}
      >
        <button
          onClick={onToggleAircraft}
          title={showAircraft ? 'Hide Aircraft' : 'Show Aircraft'}
          style={toggleBtnStyle(showAircraft, '#38bdf8')}
        >
          <Plane size={15} />
        </button>
        <button
          onClick={onToggleVehicles}
          title={showVehicles ? 'Hide GSE Vehicles' : 'Show GSE Vehicles'}
          style={toggleBtnStyle(showVehicles, '#a78bfa')}
        >
          <Truck size={15} />
        </button>
        <button
          onClick={onToggleLabels}
          title={showLabels ? 'Hide Gate Labels' : 'Show Gate Labels'}
          style={toggleBtnStyle(showLabels, '#22d3a5')}
        >
          <Tag size={15} />
        </button>
      </div>

      {/* Fullscreen Toggle */}
      <div
        style={{
          background: 'rgba(5, 10, 24, 0.85)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '10px',
          padding: '6px',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        }}
      >
        <button
          onClick={onToggleFullscreen}
          title={fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          style={btnStyle}
        >
          {fullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
        </button>
      </div>
    </div>
  );
}

const btnStyle = {
  width: '34px',
  height: '34px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '8px',
  color: '#cbd5e1',
  cursor: 'pointer',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
};

const toggleBtnStyle = (active, activeColor) => ({
  width: '34px',
  height: '34px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: active ? `${activeColor}22` : 'rgba(255, 255, 255, 0.03)',
  border: `1px solid ${active ? `${activeColor}66` : 'rgba(255, 255, 255, 0.08)'}`,
  borderRadius: '8px',
  color: active ? activeColor : '#64748b',
  cursor: 'pointer',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: active ? `0 0 12px ${activeColor}33` : 'none',
});
