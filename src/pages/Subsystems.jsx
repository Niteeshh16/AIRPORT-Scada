import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, PlaneLanding, Monitor, Cpu, ShieldCheck, Volume2,
  Flame, Clock, Thermometer, Plane, ScanLine, DoorOpen, Layers,
  ArrowRight, Zap, Radio, Server, Search, CheckCircle2, AlertTriangle, AlertCircle
} from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';

const iconMap = {
  Package, PlaneLanding, Monitor, Cpu, ShieldCheck, Volume2,
  Flame, Clock, Thermometer, Plane, ScanLine, DoorOpen, Zap, Radio, Server
};

export default function Subsystems() {
  const { subsystems } = useLiveData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const totalAssets = subsystems.reduce((acc, s) => acc + s.total, 0);
  const healthySubs = subsystems.filter(s => s.status === 'operational').length;
  const warningSubs = subsystems.filter(s => s.status === 'warning').length;
  const criticalSubs = subsystems.filter(s => s.status === 'critical').length;

  const filteredSubsystems = subsystems.filter(sys => {
    const matchesSearch = sys.name.toLowerCase().includes(search.toLowerCase()) ||
                          sys.id.toLowerCase().includes(search.toLowerCase()) ||
                          (sys.desc && sys.desc.toLowerCase().includes(search.toLowerCase()));
    if (!matchesSearch) return false;
    if (filter === 'healthy') return sys.status === 'operational';
    if (filter === 'warning') return sys.status === 'warning';
    if (filter === 'critical') return sys.status === 'critical';
    return true;
  });

  return (
    <div className="page animate-fadeIn">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Building Subsystems Directory</h1>
          <p className="page-subtitle">
            Long Thanh International Airport (LTIA) • SCADA Supervisory Control & Data Acquisition
          </p>
        </div>
        <div className="page-actions">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            padding: '8px 14px', borderRadius: 'var(--r-md)', fontSize: 12
          }}>
            <span style={{ color: 'var(--green)', fontWeight: 600 }}>{healthySubs} Healthy</span>
            <span style={{ color: 'var(--text-3)' }}>•</span>
            <span style={{ color: 'var(--yellow)', fontWeight: 600 }}>{warningSubs} Warning</span>
            {criticalSubs > 0 && (
              <>
                <span style={{ color: 'var(--text-3)' }}>•</span>
                <span style={{ color: 'var(--red)', fontWeight: 600 }}>{criticalSubs} Fault</span>
              </>
            )}
            <span style={{ color: 'var(--text-3)' }}>•</span>
            <span style={{ color: 'var(--text-2)' }}>{totalAssets.toLocaleString()} Monitored Assets</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 16, marginBottom: 'var(--s5)', flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', width: 280 }}>
          <Search size={14} style={{
            position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-3)'
          }} />
          <input
            type="text"
            placeholder="Search subsystems by code or name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 32 }}
          />
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { id: 'all', label: `All (${subsystems.length})` },
            { id: 'healthy', label: `Healthy (${healthySubs})` },
            { id: 'warning', label: `Warning (${warningSubs})` },
            { id: 'critical', label: `Fault (${criticalSubs})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`btn btn-sm ${filter === tab.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: 12 }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Column Card Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: 'var(--s4)'
      }}>
        {filteredSubsystems.map(sys => {
          const Icon = iconMap[sys.icon] || Layers;
          const statusBadgeClass =
            sys.status === 'operational' ? 'badge-operational' :
            sys.status === 'warning' ? 'badge-warning' :
            sys.status === 'critical' ? 'badge-critical' : 'badge-offline';

          const healthColor =
            sys.health >= 98 ? 'var(--green)' :
            sys.health >= 90 ? 'var(--yellow)' : 'var(--red)';

          return (
            <div
              key={sys.id}
              className="card"
              onClick={() => navigate(`/subsystems/${sys.id}`)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--border-md)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 'var(--r-md)',
                      background: 'var(--bg-overlay)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', color: 'var(--accent)'
                    }}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', fontFamily: 'var(--mono)' }}>
                        {sys.id}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-2)' }}>
                        {sys.name}
                      </div>
                    </div>
                  </div>

                  <span className={`badge ${statusBadgeClass}`}>
                    {sys.status === 'operational' ? 'OPERATIONAL' :
                     sys.status === 'warning' ? 'WARNING' :
                     sys.status === 'critical' ? 'FAULT' : 'OFFLINE'}
                  </span>
                </div>

                {/* Description */}
                <div style={{
                  fontSize: 12, color: 'var(--text-3)', lineHeight: 1.4,
                  marginBottom: 16, minHeight: 34
                }}>
                  {sys.desc || `${sys.name} telemetry, command loops and health status.`}
                </div>

                {/* Health & Availability Bar */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 5 }}>
                    <span style={{ color: 'var(--text-2)' }}>Operational Health</span>
                    <span style={{ fontWeight: 700, color: healthColor, fontFamily: 'var(--mono)' }}>
                      {sys.health}%
                    </span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-overlay)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      width: `${sys.health}%`, height: '100%',
                      background: healthColor, borderRadius: 3, transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>

                {/* Asset Metrics Grid */}
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 6, padding: '10px 0', borderTop: '1px solid var(--border)',
                  borderBottom: '1px solid var(--border)', marginBottom: 12
                }}>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)' }}>TOTAL</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', fontFamily: 'var(--mono)' }}>
                      {sys.total}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)' }}>ACTIVE</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)', fontFamily: 'var(--mono)' }}>
                      {sys.operational}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)' }}>WARN</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: sys.warnings > 0 ? 'var(--yellow)' : 'var(--text-3)', fontFamily: 'var(--mono)' }}>
                      {sys.warnings}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)' }}>FAULT</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: sys.critical > 0 ? 'var(--red)' : 'var(--text-3)', fontFamily: 'var(--mono)' }}>
                      {sys.critical}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingTop: 8, fontSize: 11
              }}>
                <span style={{
                  fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text-3)',
                  background: 'var(--bg-overlay)', padding: '2px 6px', borderRadius: 'var(--r-sm)'
                }}>
                  {sys.protocol || 'BACnet/IP'}
                </span>
                <span style={{
                  color: 'var(--accent)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4
                }}>
                  Telemetry Details <ArrowRight size={12} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
