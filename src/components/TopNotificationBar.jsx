import React, { useState } from 'react';
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

  if (alerts.length === 0) return null;

  const currentAlert = alerts[currentIndex] || alerts[0];
  const isCritical = currentAlert.severity === 'critical';

  const handleAck = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    if (currentIndex >= alerts.length - 1 && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const nextAlert = () => setCurrentIndex(prev => (prev + 1) % alerts.length);
  const prevAlert = () => setCurrentIndex(prev => (prev - 1 + alerts.length) % alerts.length);

  return (
    <div className="top-alert-bar">
      {/* Alert Pill & Counter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <span
          className={`badge ${isCritical ? 'badge-critical' : 'badge-warning'}`}
          style={{ fontSize: 10, padding: '1px 6px' }}
        >
          {isCritical ? 'CRITICAL' : 'WARNING'}
        </span>
        <span style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--text-1)' }}>
          [{currentAlert.system}]
        </span>
      </div>

      {/* Message & Time */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          fontSize: 12, color: 'var(--text-1)', fontWeight: 500,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
        }}>
          {currentAlert.title}
        </span>
        <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--mono)', flexShrink: 0 }}>
          ({currentAlert.time})
        </span>
      </div>

      {/* Pager & Quick Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {alerts.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginRight: 6 }}>
            <button
              onClick={prevAlert}
              className="btn btn-ghost btn-xs"
              style={{ padding: 2, height: 22, width: 22 }}
              title="Previous Alert"
            >
              <ChevronLeft size={13} />
            </button>
            <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text-3)', padding: '0 4px' }}>
              {currentIndex + 1}/{alerts.length}
            </span>
            <button
              onClick={nextAlert}
              className="btn btn-ghost btn-xs"
              style={{ padding: 2, height: 22, width: 22 }}
              title="Next Alert"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        )}

        <button
          onClick={() => handleAck(currentAlert.id)}
          className="btn btn-secondary btn-xs"
          style={{ height: 22, padding: '0 8px', fontSize: 10 }}
        >
          <Check size={11} style={{ marginRight: 3 }} /> Ack
        </button>

        <button
          onClick={() => navigate('/alerts')}
          className="btn btn-ghost btn-xs"
          style={{ height: 22, padding: '0 8px', fontSize: 10, color: 'var(--accent)' }}
        >
          View All <ArrowRight size={11} style={{ marginLeft: 3 }} />
        </button>

        <button
          onClick={() => handleAck(currentAlert.id)}
          className="btn btn-ghost btn-xs"
          style={{ padding: 2, height: 22, width: 22, color: 'var(--text-3)' }}
          title="Dismiss banner"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
