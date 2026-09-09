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
        title="Command Center Dashboard"
      >
        <LayoutDashboard size={13} />
        <span>Command Center</span>
      </button>

      <button
        className={`mode-btn ${currentMode === 'twin' ? 'active' : ''}`}
        onClick={() => navigate('/digital-twin')}
        title="3D Airport Digital Twin"
      >
        <Globe size={13} />
        <span>3D Digital Twin</span>
      </button>

      <button
        className={`mode-btn ${currentMode === 'supervisor' ? 'active' : ''}`}
        onClick={() => navigate('/supervisor-mode')}
        title="Supervisor Observability"
      >
        <User size={13} />
        <span>Supervisor View</span>
      </button>

      <button
        className={`mode-btn ${currentMode === 'operator' ? 'active' : ''}`}
        onClick={() => navigate('/operator-mode')}
        title="Operator Cockpit"
      >
        <Sliders size={13} />
        <span>Operator Cockpit</span>
      </button>
    </div>
  );
}
