import React from 'react';
import { X, Activity, ShieldCheck, AlertTriangle, ExternalLink, ArrowUpRight, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STATUS_CONFIGS = {
  operational: {
    color: '#22d3a5',
    bg: 'rgba(34, 211, 165, 0.1)',
    border: 'rgba(34, 211, 165, 0.3)',
    label: 'OPERATIONAL',
    icon: ShieldCheck,
  },
  warning: {
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.1)',
    border: 'rgba(245, 158, 11, 0.3)',
    label: 'WARNING',
    icon: AlertTriangle,
  },
  critical: {
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.1)',
    border: 'rgba(239, 68, 68, 0.3)',
    label: 'CRITICAL FAULT',
    icon: AlertTriangle,
  },
  boarding: {
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.1)',
    border: 'rgba(56, 189, 248, 0.3)',
    label: 'ACTIVE / BOARDING',
    icon: Activity,
  },
  offline: {
    color: '#6b7280',
    bg: 'rgba(107, 114, 128, 0.1)',
    border: 'rgba(107, 114, 128, 0.3)',
    label: 'OFFLINE / STANDBY',
    icon: Cpu,
  },
};

export default function ObjectInfoPanel({ object, onClose }) {
  const navigate = useNavigate();

  if (!object) return null;

  const config = STATUS_CONFIGS[object.status] || STATUS_CONFIGS.operational;
  const StatusIcon = config.icon;

  return (
    <div
      style={{
        position: 'absolute',
        top: 24,
        left: 24,
        width: '340px',
        maxHeight: 'calc(100% - 48px)',
        background: 'rgba(6, 11, 25, 0.94)',
        border: `1px solid ${config.border}`,
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        zIndex: 60,
        backdropFilter: 'blur(20px)',
        boxShadow: `0 16px 48px rgba(0, 0, 0, 0.7), 0 0 20px ${config.color}15`,
        animation: 'slideInLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '10px',
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#38bdf8',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                background: 'rgba(56, 189, 248, 0.1)',
                padding: '2px 6px',
                borderRadius: '4px',
                border: '1px solid rgba(56, 189, 248, 0.2)',
              }}
            >
              {object.type || 'ASSET'}
            </span>
            <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>
              SCADA ID: #{object.id?.replace(/\s+/g, '-')}
            </span>
          </div>
          <h3
            style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: 800,
              color: '#f8fafc',
              fontFamily: 'monospace',
              letterSpacing: '0.5px',
            }}
          >
            {object.id}
          </h3>
          <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#94a3b8' }}>
            {object.zone || 'Airport Operational Zone'}
          </p>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={15} />
        </button>
      </div>

      {/* Status Pill */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          borderRadius: '8px',
          background: config.bg,
          border: `1px solid ${config.border}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <StatusIcon size={16} color={config.color} />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: config.color,
              fontFamily: 'monospace',
              letterSpacing: '1px',
            }}
          >
            {config.label}
          </span>
        </div>
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: config.color,
            boxShadow: `0 0 8px ${config.color}`,
          }}
        />
      </div>

      {/* Metrics List */}
      {object.metrics && Object.keys(object.metrics).length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span
            style={{
              fontSize: '10px',
              fontFamily: 'monospace',
              fontWeight: 700,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Live Operational Metrics
          </span>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '6px',
            }}
          >
            {Object.entries(object.metrics).map(([key, val]) => (
              <div
                key={key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '7px 10px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '6px',
                }}
              >
                <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>
                  {key}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#e2e8f0',
                    fontFamily: 'monospace',
                  }}
                >
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
        <button
          onClick={() => navigate('/subsystems')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 12px',
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '6px',
            color: '#38bdf8',
            fontSize: '11px',
            fontWeight: 700,
            fontFamily: 'monospace',
            cursor: 'pointer',
          }}
        >
          <span>View in SCADA</span>
          <ExternalLink size={12} />
        </button>

        <button
          onClick={() => navigate('/alerts')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 12px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '6px',
            color: '#94a3b8',
            fontSize: '11px',
            fontWeight: 600,
            fontFamily: 'monospace',
            cursor: 'pointer',
          }}
        >
          <span>Events</span>
          <ArrowUpRight size={12} />
        </button>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-16px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
