import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle, AlertOctagon, X, Check, ArrowRight,
  ChevronLeft, ChevronRight, Bell, Eye, ShieldCheck,
  Radio, CheckCircle2, ChevronDown, ChevronUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLiveData } from '../context/LiveDataContext';

export default function TopNotificationBar({ onSelectEquipment }) {
  const { alerts, acknowledgeAlert, equipmentList } = useLiveData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissedIds, setDismissedIds] = useState(new Set());
  const [isPaused, setIsPaused] = useState(false);
  const [ackedToast, setAckedToast] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // Get active unacknowledged alerts that are not dismissed in current session
  const activeAlerts = alerts
    .filter(a => !a.acknowledged && !dismissedIds.has(a.id))
    .sort((a, b) => {
      // Prioritize critical over high over others
      const rank = { critical: 3, high: 2, medium: 1, low: 0 };
      const diff = (rank[b.severity] || 0) - (rank[a.severity] || 0);
      if (diff !== 0) return diff;
      return (b.timestamp || 0) - (a.timestamp || 0);
    });

  // Clamp current index if list shrinks
  useEffect(() => {
    if (currentIndex >= activeAlerts.length && activeAlerts.length > 0) {
      setCurrentIndex(0);
    }
  }, [activeAlerts.length, currentIndex]);

  // Auto-cycle alerts every 6s unless paused by hover
  useEffect(() => {
    if (activeAlerts.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeAlerts.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeAlerts.length, isPaused]);

  const handleAck = (id, e) => {
    e?.stopPropagation();
    acknowledgeAlert(id);
    setAckedToast(id);
    setTimeout(() => {
      setAckedToast(null);
    }, 1500);
  };

  const handleDismiss = (id, e) => {
    e?.stopPropagation();
    setDismissedIds(prev => new Set([...prev, id]));
  };

  const handleInspect = (alert, e) => {
    e?.stopPropagation();
    if (!onSelectEquipment) return;
    const eq = equipmentList?.find(
      item => item.id === alert.equipment || item.id === alert.equipmentId || item.name === alert.equipment
    );
    if (eq) {
      onSelectEquipment(eq);
    } else {
      // fallback mock object for inspection panel
      onSelectEquipment({
        id: alert.equipment || 'EQ-NODE',
        name: `${alert.system} - ${alert.subsystem || 'Asset'}`,
        system: alert.system,
        floor: alert.location?.split(',')?.pop()?.trim() || 'GF',
        location: alert.location,
        status: alert.severity === 'critical' ? 'critical' : 'warning',
        temp: 28.4,
        health: 48,
        mode: 'manual'
      });
    }
  };

  const nextAlert = (e) => {
    e?.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % activeAlerts.length);
  };

  const prevAlert = (e) => {
    e?.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + activeAlerts.length) % activeAlerts.length);
  };

  // If collapsed by user
  if (collapsed) {
    return (
      <div 
        className="top-alert-bar-collapsed animate-fadeIn"
        onClick={() => setCollapsed(false)}
        title="Click to expand Alarm Banner"
      >
        <div className="flex items-center gap-2">
          {activeAlerts.length > 0 ? (
            <>
              <span className="live-dot-beacon critical" />
              <span className="font-mono text-xs font-bold text-red-400">
                {activeAlerts.length} UNACKNOWLEDGED ALARM{activeAlerts.length > 1 ? 'S' : ''} ACTIVE
              </span>
            </>
          ) : (
            <>
              <span className="live-dot-beacon nominal" />
              <span className="font-mono text-xs text-emerald-400">ALL SYSTEMS NOMINAL</span>
            </>
          )}
        </div>
        <button className="collapse-toggle-btn" aria-label="Expand alert bar">
          <ChevronDown size={14} />
        </button>
      </div>
    );
  }

  // 1. Nominal state: No unacknowledged alarms
  if (activeAlerts.length === 0) {
    return (
      <div className="top-alert-bar top-alert-nominal">
        <div className="top-alert-nominal-content">
          <div className="flex items-center gap-2">
            <span className="nominal-beacon-pulse" />
            <span className="nominal-badge">
              <CheckCircle2 size={12} /> NOMINAL
            </span>
            <span className="nominal-text">
              All 12 Terminal Subsystems Nominal • 0 Active Alarms • BACnet/OPC-UA Dual Redundant Link Healthy
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/alerts')}
              className="btn-link-sm"
              title="Open Alarm Logs"
            >
              Alarm History
            </button>
            <button
              onClick={() => setCollapsed(true)}
              className="btn-icon-subtle"
              title="Minimize Bar"
            >
              <ChevronUp size={13} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Active Alarm State
  const currentAlert = activeAlerts[currentIndex] || activeAlerts[0];
  const isCritical = currentAlert.severity === 'critical';
  const isHigh = currentAlert.severity === 'high';

  return (
    <div
      className={`top-alert-bar ${isCritical ? 'top-alert-critical' : 'top-alert-warning'} animate-slideInDown`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Left: Pulsing Beacon & Severity Pill */}
      <div className="top-alert-lead">
        <div className="beacon-container">
          <span className={`live-dot-beacon ${isCritical ? 'critical' : 'warning'}`} />
          <span className={`beacon-ring ${isCritical ? 'critical' : 'warning'}`} />
        </div>

        <span className={`top-alert-severity-badge ${isCritical ? 'badge-critical' : 'badge-warning'}`}>
          {isCritical ? <AlertOctagon size={12} /> : <AlertTriangle size={12} />}
          <span>{isCritical ? 'CRITICAL ALARM' : isHigh ? 'HIGH PRIORITY' : 'WARNING'}</span>
        </span>

        <span className="top-alert-sys-pill font-mono">
          [{currentAlert.system}{currentAlert.subsystem ? ` • ${currentAlert.subsystem}` : ''}]
        </span>
      </div>

      {/* Center: Equipment info, location & message */}
      <div className="top-alert-body">
        {currentAlert.equipment && (
          <span className="top-alert-eq-badge font-mono">
            {currentAlert.equipment}
          </span>
        )}

        <span className="top-alert-msg" title={currentAlert.message}>
          {currentAlert.message}
        </span>

        {currentAlert.location && (
          <span className="top-alert-loc font-mono">
            • {currentAlert.location}
          </span>
        )}

        <span className="top-alert-time font-mono">
          ({currentAlert.time || 'Live'})
        </span>
      </div>

      {/* Right: Carousel Navigation & Quick Action Buttons */}
      <div className="top-alert-actions">
        {activeAlerts.length > 1 && (
          <div className="top-alert-pager">
            <button
              onClick={prevAlert}
              className="top-alert-pager-btn"
              title="Previous Alarm"
            >
              <ChevronLeft size={13} />
            </button>
            <span className="top-alert-counter font-mono">
              {currentIndex + 1}/{activeAlerts.length}
            </span>
            <button
              onClick={nextAlert}
              className="top-alert-pager-btn"
              title="Next Alarm"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        )}

        {/* Quick Action: Inspect */}
        <button
          onClick={(e) => handleInspect(currentAlert, e)}
          className="btn-top-alert btn-top-alert-inspect"
          title="Inspect affected equipment telemetry"
        >
          <Eye size={12} />
          <span>Inspect</span>
        </button>

        {/* Quick Action: Acknowledge */}
        <button
          onClick={(e) => handleAck(currentAlert.id, e)}
          className="btn-top-alert btn-top-alert-ack"
          title="Acknowledge alarm"
        >
          <Check size={12} />
          <span>{ackedToast === currentAlert.id ? 'Acked!' : 'Ack'}</span>
        </button>

        {/* View All Alarms */}
        <button
          onClick={() => navigate('/alerts')}
          className="btn-top-alert btn-top-alert-all"
          title="Open Central Alarms Directory"
        >
          <span>All ({alerts.length})</span>
          <ArrowRight size={11} />
        </button>

        {/* Dismiss current from top bar */}
        <button
          onClick={(e) => handleDismiss(currentAlert.id, e)}
          className="btn-top-alert-close"
          title="Dismiss from banner"
        >
          <X size={13} />
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(true)}
          className="btn-top-alert-close"
          title="Minimize notification bar"
        >
          <ChevronUp size={13} />
        </button>
      </div>
    </div>
  );
}
