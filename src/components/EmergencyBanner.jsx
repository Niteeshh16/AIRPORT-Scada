import React, { useState } from 'react';
import { Flame, X, AlertTriangle } from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';

export default function EmergencyBanner() {
  const { alerts } = useLiveData();
  const [dismissed, setDismissed] = useState(false);

  const criticalAlert = alerts.find(a => a.severity === 'critical');

  if (dismissed || !criticalAlert) return null;

  return (
    <div className="emergency-banner-top animate-fadeIn">
      <div className="emergency-banner-content">
        <div className="emergency-icon-badge">
          <Flame size={14} />
          <span className="emergency-label">{criticalAlert.system} - CRITICAL</span>
        </div>
        <span className="emergency-msg">
          <strong>{criticalAlert.location}</strong> — {criticalAlert.message}
        </span>
      </div>
      <button 
        className="emergency-dismiss-btn"
        onClick={() => setDismissed(true)}
        title="Dismiss Banner"
      >
        <X size={14} />
      </button>
    </div>
  );
}
