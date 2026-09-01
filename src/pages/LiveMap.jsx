import React, { useState } from 'react';
import { Layers, ArrowLeft } from 'lucide-react';
import MultiFloorMapGrid from '../components/MultiFloorMapGrid';
import FloorMap from '../components/FloorMap';
import ModeSwitcherBar from '../components/ModeSwitcherBar';
import { useLiveData } from '../context/LiveDataContext';

export default function LiveMap({ onSelectEquipment }) {
  const { selectedFloor, setSelectedFloor } = useLiveData();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' (Image 1) | 'single'

  const handleSelectFloor = (floorId) => {
    setSelectedFloor?.(floorId);
  };

  return (
    <div className="animate-fadeIn live-map-page" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Top Controls: Mode Switcher Bar matching Screenshot 1 */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <ModeSwitcherBar activeMode="map" />

        {viewMode === 'single' ? (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setViewMode('grid')}
            style={{ fontSize: '11px', padding: '4px 12px' }}
          >
            <ArrowLeft size={13} />
            <span>Show All 6 Floors Grid</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setViewMode('single')}
              style={{ fontSize: '11px', padding: '4px 12px' }}
              title="Focus on selected floor"
            >
              <Layers size={13} />
              <span>Inspect Single Floor</span>
            </button>
          </div>
        )}
      </div>

      {/* Main View: 6-Floor Grid matching Screenshot 1 */}
      {viewMode === 'grid' ? (
        <div className="card p-3" style={{ background: '#070a12', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <MultiFloorMapGrid
            selectedFloor={selectedFloor}
            onSelectFloor={handleSelectFloor}
            fullView={true}
          />
        </div>
      ) : (
        <div className="card" style={{ border: '1px solid rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
          <FloorMap
            onSelectEquipment={onSelectEquipment}
            selectedFloor={selectedFloor}
            height={580}
            showControls={true}
          />
        </div>
      )}
    </div>
  );
}
