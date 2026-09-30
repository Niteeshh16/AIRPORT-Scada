import React, { useState } from 'react';
import { Maximize2, AlertCircle } from 'lucide-react';
import AirportFloorGraphic from './AirportFloorGraphic';

export function FloorSchematic({ hasAlert = false, alertZone = '23', onZoneClick, compact = true }) {
  return (
    <AirportFloorGraphic
      hasAlert={hasAlert}
      alertZone={alertZone}
      onZoneClick={onZoneClick}
      compact={compact}
    />
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
