import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Sliders, LayoutDashboard, Globe } from 'lucide-react';

export default function ModeSwitcherBar({ activeMode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentMode = activeMode || (
    location.pathname === '/digital-twin' ? 'twin' :
    location.pathname === '/supervisor-mode' ? 'supervisor' :
    location.pathname === '/operator-mode' ? 'operator' : 'cmd'
  );

  return (
    <div className="mode-switcher-bar">
      <button
        className={`mode-btn ${currentMode === 'cmd' ? 'active' : ''}`}
        onClick={() => navigate('/')}
        title="Main Command Center with All-Floor Building Overview"
      >
        <LayoutDashboard size={13} />
        <span>COMMAND CENTER</span>
      </button>

      <button
        className={`mode-btn ${currentMode === 'twin' ? 'active' : ''}`}
        onClick={() => navigate('/digital-twin')}
        title="Interactive 3D Airport Digital Twin"
        style={currentMode === 'twin' ? { borderBottom: '2px solid #38bdf8', color: '#38bdf8' } : {}}
      >
        <Globe size={13} />
        <span>3D TWIN</span>
      </button>

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
    </div>
  );
}
