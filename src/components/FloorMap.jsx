import React, { useState, useMemo } from 'react';
import {
  Wind, ZoomIn, ZoomOut, Maximize2
} from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';
import AirportFloorGraphic from './AirportFloorGraphic';

export default function FloorMap({ onSelectEquipment, selectedFloor: externalFloor, height = 'clamp(320px, 45vh, 560px)', showControls = true }) {
  const { equipmentList, floors, selectedFloor, setSelectedFloor } = useLiveData();

  const [internalFloor, setInternalFloor] = useState('1F');
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

  // Equipment filtered strictly by active floor
  const equipment = useMemo(() => {
    return equipmentList.filter(e => e.floor === activeFloor);
  }, [equipmentList, activeFloor]);

  const currentFloorObj = floors.find(f => f.id === activeFloor) || floors[0];

  return (
    <div className="map-container" style={{ position: 'relative', background: '#0b111e', borderRadius: '8px', overflow: 'hidden' }}>
      {/* Streamlined Floor Switcher Bar */}
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
        <div className="flex items-center gap-2 flex-wrap">
          {currentFloorObj.inventory && (
            <span className="text-3xs font-mono text-teal bg-elevated px-2 py-1 rounded border border-subtle">
              Fleet: {currentFloorObj.inventory.ahu} AHUs {currentFloorObj.inventory.ahuFault > 0 ? `(${currentFloorObj.inventory.ahuFault} Flt)` : ''} • {currentFloorObj.inventory.fcu} FCUs • {currentFloorObj.inventory.fans} Fans
            </span>
          )}
          {activeFloor === '1F' && (
            <span className="floor-alert-pill" style={{ fontSize: '10px', padding: '3px 8px' }}>
              <span className="live-dot-badge amber" style={{ width: 6, height: 6 }} />
              Zone 23 Active Alert (AHU-1F-009)
            </span>
          )}
          <span className="text-3xs font-mono text-tertiary">
            {equipment.length} Telemetry Nodes
          </span>
        </div>
      </div>

      {/* 2.5D Isometric Floor Map Stage */}
      <div style={{
        position: 'relative',
        height,
        overflow: 'hidden',
        background: '#060a12',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
            transition: 'transform 0.25s ease',
          }}
        >
          <AirportFloorGraphic
            hasAlert={activeFloor === '1F'}
            alertZone="23"
            onZoneClick={(zoneId) => setHoveredZone(zoneId)}
            equipment={equipment}
            onSelectEquipment={onSelectEquipment}
            activeFloor={activeFloor}
            showZones={true}
            showLabels={true}
          />
        </div>

        {/* Zone Hover Tag */}
        {hoveredZone && (
          <div className="map-zone-hover-banner animate-fadeIn" style={{ fontSize: '11px', padding: '4px 10px', bottom: '12px', left: '16px', zIndex: 30 }}>
            <span>📍 Zone <strong>{hoveredZone}</strong> • {activeFloor === '1F' && hoveredZone === '23' ? 'CRITICAL FAULT (AHU-309)' : 'Nominal Status'}</span>
          </div>
        )}

        {/* Compact Zoom Controls */}
        {showControls && (
          <div className="map-controls" style={{ bottom: '12px', right: '12px', zIndex: 30 }}>
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
