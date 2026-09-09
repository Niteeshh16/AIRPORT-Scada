import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, AlertOctagon, X, Check, ArrowRight, 
  ChevronLeft, ChevronRight, Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RECENT_ALERTS_MOCK = [
  {
    id: 'ALT-01',
    system: 'BHS',
    severity: 'critical',
    title: 'Conveyor jam detected in sorting unit 3',
    time: '24m ago',
  },
  {
    id: 'ALT-02',
    system: 'BHS',
    severity: 'critical',
    title: 'Baggage tag scan failure rate > 5% threshold',
    time: '27m ago',
  },
  {
    id: 'ALT-03',
    system: 'SCADA',
    severity: 'high',
    title: 'Lighting control fault in apron zone 5 (SCADA)',
    time: '31m ago',
  },
  {
    id: 'ALT-04',
    system: 'LBMS',
    severity: 'medium',
    title: 'Temperature deviation in Zone 2 (26.5°C, target 24°C)',
    time: '37m ago',
  },
  {
    id: 'ALT-05',
    system: 'SCADA',
    severity: 'medium',
    title: 'Power consumption spike in HDR-12 (>82% capacity)',
    time: '44m ago',
  },
];

export default function TopNotificationBar() {
  const [alerts, setAlerts] = useState(RECENT_ALERTS_MOCK);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  if (alerts.length === 0) {
    return null;
  }

  const currentAlert = alerts[currentIndex] || alerts[0];
  const isCritical = currentAlert.severity === 'critical';
  const isHigh = currentAlert.severity === 'high';

  const handleAck = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    if (currentIndex >= alerts.length - 1 && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const nextAlert = () => {
    setCurrentIndex(prev => (prev + 1) % alerts.length);
  };

  const prevAlert = () => {
    setCurrentIndex(prev => (prev - 1 + alerts.length) % alerts.length);
  };

  return (
    <div className="reference-top-notif-bar animate-slideInDown">
      <div className={`ref-notif-inner ${currentAlert.severity}`}>
        
        {/* Left Badge & System */}
        <div className="flex items-center gap-2 shrink-0">
          <div className={`ref-notif-pulse-dot ${currentAlert.severity}`} />
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            RECENT ALERTS ({alerts.length})
          </span>
          <span className={`ref-notif-sys-tag ${currentAlert.severity}`}>
            {currentAlert.system} {currentAlert.severity.toUpperCase()}
          </span>
        </div>

        {/* Center: Message */}
        <div className="ref-notif-msg-box truncate">
          <span className="ref-notif-msg">{currentAlert.title}</span>
          <span className="ref-notif-time font-mono">({currentAlert.time})</span>
        </div>

        {/* Right: Pager & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {alerts.length > 1 && (
            <div className="ref-notif-pager">
              <button onClick={prevAlert} className="ref-notif-pager-btn" title="Previous Alert">
                <ChevronLeft size={13} />
              </button>
              <span className="font-mono text-3xs text-secondary font-bold">
                {currentIndex + 1} / {alerts.length}
              </span>
              <button onClick={nextAlert} className="ref-notif-pager-btn" title="Next Alert">
                <ChevronRight size={13} />
              </button>
            </div>
          )}

          <button
            onClick={() => handleAck(currentAlert.id)}
            className="ref-notif-ack-btn"
            title="Acknowledge Alert"
          >
            <Check size={12} />
            <span>ACK</span>
          </button>

          <button
            onClick={() => navigate('/alerts')}
            className="ref-notif-all-btn"
            title="Open Alerts Center"
          >
            <span>All Alerts →</span>
          </button>

          <button
            onClick={() => handleAck(currentAlert.id)}
            className="ref-notif-close-btn"
            title="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>

      </div>
    </div>
  );
}
