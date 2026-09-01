import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Sliders, Map } from 'lucide-react';

export default function ModeSwitcherBar({ activeMode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentMode = activeMode || (
    location.pathname === '/supervisor-mode' ? 'supervisor' :
    location.pathname === '/operator-mode' ? 'operator' :
    location.pathname === '/map' ? 'map' : 'map'
  );

  return (
    <div className="mode-switcher-bar">
      <button
        className={`mode-btn ${currentMode === 'supervisor' ? 'active' : ''}`}
        onClick={() => navigate('/supervisor-mode')}
        title="Supervisor Observability Mode"
      >
        <User size={13} />
        <span>SUPERVISOR</span>
      </button>

      <button
        className={`mode-btn ${currentMode === 'operator' ? 'active' : ''}`}
        onClick={() => navigate('/operator-mode')}
        title="Operator Cockpit Mode"
      >
        <Sliders size={13} />
        <span>OPERATOR</span>
      </button>

      <button
        className={`mode-btn ${currentMode === 'map' ? 'active' : ''}`}
        onClick={() => navigate('/map')}
        title="Terminal Floor Map Grid View"
      >
        <Map size={13} />
        <span>MAP VIEW</span>
      </button>
    </div>
  );
}
