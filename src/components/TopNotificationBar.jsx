import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, AlertOctagon, X, Check, ArrowRight, Bell, 
  ChevronLeft, ChevronRight, ShieldAlert, ExternalLink 
} from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';
import { useNavigate } from 'react-router-dom';

export default function TopNotificationBar({ onSelectEquipment }) {
  const { alerts, acknowledgeAlert, equipmentList } = useLiveData();
  const navigate = useNavigate();
  const [dismissedIds, setDismissedIds] = useState(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);

  // Active unacknowledged critical and high alerts
  const activeAlerts = alerts.filter(
    a => (a.severity === 'critical' || a.severity === 'high') && !a.acknowledged && !dismissedIds.has(a.id)
  );

  // Keep currentIndex in bounds when alerts change
  useEffect(() => {
    if (currentIndex >= activeAlerts.length && activeAlerts.length > 0) {
      setCurrentIndex(activeAlerts.length - 1);
    }
  }, [activeAlerts.length, currentIndex]);

  if (activeAlerts.length === 0) {
    return null;
  }

  const currentAlert = activeAlerts[currentIndex] || activeAlerts[0];
  const isCritical = currentAlert.severity === 'critical';

  const handleDismiss = (id) => {
    setDismissedIds(prev => new Set([...prev, id]));
  };

  const handleAck = (id) => {
    acknowledgeAlert(id);
    handleDismiss(id);
  };

  const handleInspect = (eqId) => {
    if (onSelectEquipment && eqId) {
      const eq = equipmentList.find(e => e.id === eqId || e.tag === eqId);
      if (eq) {
        onSelectEquipment(eq);
        return;
      }
    }
    navigate('/alerts');
  };

  const nextAlert = () => {
    setCurrentIndex(prev => (prev + 1) % activeAlerts.length);
  };

  const prevAlert = () => {
    setCurrentIndex(prev => (prev - 1 + activeAlerts.length) % activeAlerts.length);
  };

  return (
    <div className="top-notification-banner animate-slideInDown">
      <div className={`top-notification-inner ${isCritical ? 'critical' : 'warning'}`}>
        
        {/* Left: Glowing Icon & Severity Badge */}
        <div className="top-notif-left">
          <div className={`top-notif-icon-box ${isCritical ? 'critical' : 'warning'}`}>
            {isCritical ? <AlertOctagon size={16} className="pulse-fast" /> : <AlertTriangle size={16} />}
          </div>
          <span className={`top-notif-badge ${isCritical ? 'critical' : 'warning'}`}>
            {currentAlert.severity.toUpperCase()} ALARM
          </span>
        </div>

        {/* Center: Alarm Message, Tag, and Location */}
        <div className="top-notif-center">
          <span className="top-notif-tag font-mono">{currentAlert.equipment}</span>
          <span className="top-notif-divider">•</span>
          <span className="top-notif-msg">{currentAlert.message}</span>
          <span className="top-notif-divider">•</span>
          <span className="top-notif-time font-mono">{currentAlert.time}</span>
        </div>

        {/* Right: Pager (if multiple) & Quick Actions */}
        <div className="top-notif-right">
          {activeAlerts.length > 1 && (
            <div className="top-notif-pager">
              <button 
                onClick={prevAlert} 
                className="top-notif-pager-btn" 
                title="Previous Alarm"
              >
                <ChevronLeft size={13} />
              </button>
              <span className="font-mono text-3xs text-secondary font-bold">
                {currentIndex + 1} / {activeAlerts.length}
              </span>
              <button 
                onClick={nextAlert} 
                className="top-notif-pager-btn" 
                title="Next Alarm"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          )}

          {/* Acknowledge Button */}
          <button
            onClick={() => handleAck(currentAlert.id)}
            className="top-notif-ack-btn"
            title="Acknowledge this alarm"
          >
            <Check size={13} />
            <span>ACK</span>
          </button>

          {/* View in Alerts Page */}
          <button
            onClick={() => handleInspect(currentAlert.equipment)}
            className="top-notif-view-btn"
            title="View Alarm Center"
          >
            <span>Details</span>
            <ArrowRight size={12} />
          </button>

          {/* Dismiss Banner Button */}
          <button
            onClick={() => handleDismiss(currentAlert.id)}
            className="top-notif-dismiss-btn"
            title="Dismiss top notification"
          >
            <X size={14} />
          </button>
        </div>

      </div>
    </div>
  );
}
