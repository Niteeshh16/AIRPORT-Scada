import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, PlaneLanding, Monitor, Cpu, ShieldCheck, Volume2, 
  Flame, Clock, Thermometer, Plane, ScanLine, DoorOpen, Layers, ArrowRight, Zap, Radio, Server
} from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';

const iconMap = {
  Package, PlaneLanding, Monitor, Cpu, ShieldCheck, Volume2,
  Flame, Clock, Thermometer, Plane, ScanLine, DoorOpen, Zap, Radio, Server
};

export default function Subsystems() {
  const { subsystems, scadaMetrics } = useLiveData();
  const navigate = useNavigate();

  const totalAssets = subsystems.reduce((acc, s) => acc + s.total, 0);
  const healthySubs = subsystems.filter(s => s.status === 'operational').length;

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Airport Subsystems Directory (13 Systems)</h1>
          <p className="page-subtitle">Long Thanh International Airport • Hub Building Management System (AVEVA UOC Supervisory Platform)</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <div className="flex flex-col items-end">
            <span className="live-data-tick font-mono text-teal">
              {healthySubs} / {subsystems.length} Subsystems Healthy
            </span>
            <span className="text-3xs font-mono text-secondary">
              {totalAssets.toLocaleString()} Total Monitored Field Assets
            </span>
          </div>
        </div>
      </div>

      <div className="subsystem-grid">
        {subsystems.map((sys, idx) => {
          const Icon = iconMap[sys.icon] || Layers;
          return (
            <div 
              key={sys.id} 
              className="subsystem-card animate-slideInUp"
              style={{ animationDelay: `${idx * 25}ms` }}
              onClick={() => navigate(`/subsystems/${sys.id}`)}
            >
              <div className="subsystem-card-header">
                <div className="subsystem-icon">
                  <Icon size={20} />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`status-badge ${sys.status}`}>
                    <span className="status-dot-sm" />
                    {sys.status === 'operational' ? 'HEALTHY' : sys.status === 'warning' ? 'WARNING' : sys.status === 'critical' ? 'FAULT' : 'OFFLINE'}
                  </span>
                  <span className="text-3xs font-mono text-tertiary bg-elevated px-1.5 py-0.5 rounded border border-subtle">
                    {sys.protocol}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: 'var(--space-3)' }}>
                <div className="subsystem-card-title">{sys.id}</div>
                <div className="subsystem-card-subtitle">{sys.name}</div>
                <div className="text-3xs text-secondary mt-1 line-clamp-2">{sys.desc}</div>
              </div>

              <div className="subsystem-health-value" style={{ 
                color: sys.health >= 98 ? 'var(--status-operational)' : 
                       sys.health >= 90 ? 'var(--status-warning)' : 'var(--status-critical)',
                marginBottom: 'var(--space-3)'
              }}>
                {sys.health}%
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontWeight: 400, marginLeft: '4px' }}>
                  operational health
                </span>
              </div>

              <div className="health-bar-container" style={{ marginBottom: 'var(--space-3)' }}>
                <div 
                  className={`health-bar ${sys.health >= 98 ? 'high' : sys.health >= 90 ? 'medium' : 'low'}`}
                  style={{ width: `${sys.health}%`, transition: 'width 1s ease' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)', fontSize: 'var(--text-xs)' }}>
                <div style={{ color: 'var(--text-tertiary)' }}>
                  Fleet Count: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{sys.total.toLocaleString()}</span>
                </div>
                <div style={{ color: 'var(--text-tertiary)' }}>
                  Operational: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{sys.operational.toLocaleString()}</span>
                </div>
                <div style={{ color: 'var(--text-tertiary)' }}>
                  Warnings: <span style={{ color: sys.warnings > 0 ? 'var(--status-warning)' : 'var(--text-secondary)', fontWeight: 600 }}>{sys.warnings}</span>
                </div>
                <div style={{ color: 'var(--text-tertiary)' }}>
                  Critical: <span style={{ color: sys.critical > 0 ? 'var(--status-critical)' : 'var(--text-secondary)', fontWeight: 600 }}>{sys.critical}</span>
                </div>
              </div>

              <div style={{ marginTop: 'var(--space-3)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="text-3xs font-mono text-tertiary">
                  Mode: Read-Only Supervisory
                </span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Inspect Subsystem <ArrowRight size={12} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
