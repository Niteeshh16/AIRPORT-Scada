import React from 'react';
import {
  Activity, AlertTriangle, CheckCircle2, Zap, Server,
  Layers, ArrowRight, ShieldCheck, Clock, Wind, Flame,
  Package, DoorOpen, ScanLine, Thermometer, Fan
} from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';
import FloorMap from '../components/FloorMap';
import FloatingAlerts from '../components/FloatingAlerts';
import { useNavigate } from 'react-router-dom';

const sysIcons = {
  'LBMS': Wind,
  'BHS': Package,
  'FAS': Flame,
  'SACS': ShieldCheck,
  'SSE': ScanLine,
  'AGAC': DoorOpen,
  'VDGS': Activity,
  'CMS': Zap,
  'PAS': Activity,
  'MCS': Clock,
  'SCADA': Server,
  'IASS': Activity,
};

export default function CommandCenter({ onSelectEquipment }) {
  const { subsystems, alerts, workOrders, equipmentList, selectedFloor } = useLiveData();
  const navigate = useNavigate();

  // Core SCADA metrics
  const totalEquipment = equipmentList.length;
  const operationalCount = equipmentList.filter(e => e.status === 'operational').length;
  const warningCount = equipmentList.filter(e => e.status === 'warning').length;
  const criticalCount = equipmentList.filter(e => e.status === 'critical').length;
  const totalPower = equipmentList.reduce((acc, curr) => acc + (curr.power || 0), 0).toFixed(1);

  return (
    <div className="command-center animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', position: 'relative' }}>
      {/* Floating Top Alarm Notifications */}
      <FloatingAlerts />

      {/* 1. Sleek, Compact SCADA Metric Bar with Generous 16px Gaps */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {/* System Health */}
        <div className="card" style={{ padding: '10px 14px', borderLeft: '3px solid var(--accent-teal)', background: 'var(--bg-surface)' }}>
          <div className="flex items-center justify-between">
            <span className="text-3xs font-mono font-bold text-tertiary uppercase tracking-wider">System Health</span>
            <div style={{ width: 22, height: 22, borderRadius: '4px', background: 'var(--status-operational-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-teal)' }}>
              <ShieldCheck size={13} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-mono text-base font-bold text-teal">98.4%</span>
            <span className="text-3xs text-secondary font-mono">● All DDCs Online</span>
          </div>
        </div>

        {/* Assets Monitored */}
        <div className="card" style={{ padding: '10px 14px', borderLeft: '3px solid var(--accent-blue)', background: 'var(--bg-surface)' }}>
          <div className="flex items-center justify-between">
            <span className="text-3xs font-mono font-bold text-tertiary uppercase tracking-wider">Monitored Assets</span>
            <div style={{ width: 22, height: 22, borderRadius: '4px', background: 'var(--status-info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)' }}>
              <Server size={13} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-mono text-base font-bold text-primary">{totalEquipment}</span>
            <span className="text-3xs text-secondary font-mono">
              <strong className="text-teal">{operationalCount} OK</strong> • {criticalCount} Fault
            </span>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="card" style={{ padding: '10px 14px', borderLeft: '3px solid var(--status-critical)', background: 'var(--bg-surface)' }}>
          <div className="flex items-center justify-between">
            <span className="text-3xs font-mono font-bold text-tertiary uppercase tracking-wider">Active Alerts</span>
            <div style={{ width: 22, height: 22, borderRadius: '4px', background: 'var(--status-critical-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-critical)' }}>
              <AlertTriangle size={13} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-mono text-base font-bold text-red">{alerts.length}</span>
            <span className="text-3xs text-secondary font-mono">
              {alerts.filter(a => a.severity === 'critical').length} Critical • {alerts.filter(a => a.severity === 'high').length} High
            </span>
          </div>
        </div>

        {/* Substation Load */}
        <div className="card" style={{ padding: '10px 14px', borderLeft: '3px solid var(--status-warning)', background: 'var(--bg-surface)' }}>
          <div className="flex items-center justify-between">
            <span className="text-3xs font-mono font-bold text-tertiary uppercase tracking-wider">Substation Power</span>
            <div style={{ width: 22, height: 22, borderRadius: '4px', background: 'var(--status-warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-warning)' }}>
              <Zap size={13} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-mono text-base font-bold text-amber">{totalPower} kW</span>
            <span className="text-3xs text-secondary font-mono">Demand Nominal</span>
          </div>
        </div>
      </div>

      {/* 2. Wide, Expansive Long Thanh Lotus Floor Map (Center Stage) */}
      <div className="card" style={{ border: '1px solid var(--border-default)', overflow: 'hidden', width: '100%' }}>
        <div className="card-header flex justify-between items-center py-2 px-4">
          <div className="flex items-center gap-2">
            <Layers size={15} className="text-teal" />
            <span className="card-title font-mono text-xs uppercase font-bold tracking-wide">
              LONG THANH INTERNATIONAL AIRPORT — TERMINAL 1 SCADA SPATIAL BLUEPRINT
            </span>
          </div>
          <span className="text-2xs text-secondary font-mono">
            Interactive Node Explorer • Click floor tabs or devices to inspect & control
          </span>
        </div>

        <div style={{ background: '#070a10', width: '100%' }}>
          <FloorMap
            height={560}
            onSelectEquipment={onSelectEquipment}
            showControls={true}
          />
        </div>
      </div>

      {/* 3. Full-Width 12 Building Subsystems Grid (Spacious & Clean) */}
      <div className="card p-3.5" style={{ width: '100%' }}>
        <div className="card-header py-1 px-2 mb-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="card-title font-mono text-xs uppercase font-bold text-primary">Building Subsystems (12)</span>
            <span className="live-dot-badge" style={{ width: 6, height: 6 }} />
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/subsystems')}
            style={{ fontSize: '10px', padding: '3px 10px', height: 24 }}
          >
            All Subsystems Directory →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
          {subsystems.map(sys => {
            const isCritical = sys.critical > 0;
            const isWarning = sys.warnings > 0 && !isCritical;
            const statusColor = isCritical ? 'var(--status-critical)' : isWarning ? 'var(--status-warning)' : 'var(--status-operational)';

            return (
              <div
                key={sys.id}
                className="subsystem-card"
                onClick={() => navigate(`/subsystems/${sys.id}`)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'linear-gradient(145deg, #121622 0%, #0c1018 100%)',
                  border: `1px solid rgba(255, 255, 255, 0.08)`,
                  borderLeft: `3.5px solid ${statusColor}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '84px'
                }}
                title={`Click to view ${sys.name} SCADA details`}
              >
                {/* Card Top: Code + Status Badge */}
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-xs font-bold text-primary tracking-wide">{sys.id}</span>
                  <span
                    className={`status-badge ${sys.status}`}
                    style={{ fontSize: '7.5px', padding: '1px 5px', borderRadius: '4px' }}
                  >
                    {sys.status.toUpperCase()}
                  </span>
                </div>

                {/* Card Title */}
                <div className="text-3xs text-secondary truncate font-medium mb-2">{sys.name}</div>

                {/* Card Bottom: SLA Percentage & Progress Bar */}
                <div>
                  <div className="flex justify-between items-center text-3xs font-mono mb-1">
                    <span className="font-bold" style={{ color: statusColor }}>{sys.health}% SLA</span>
                    <span className="text-tertiary">{sys.operational}/{sys.total}</span>
                  </div>

                  {/* Progress Fill Bar */}
                  <div style={{ height: '3px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${sys.health}%`,
                        background: statusColor,
                        borderRadius: '2px',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
