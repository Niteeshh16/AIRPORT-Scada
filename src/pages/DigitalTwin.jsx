import { useState, useEffect, lazy, Suspense } from 'react';
import { Search, Bell, Sun, Activity } from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';

const AirportScene = lazy(() => import('../components/digital-twin/AirportScene'));

function StatusPill({ label, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: color + '18', border: `1px solid ${color}44`, borderRadius: 5, padding: '3px 8px', flexShrink: 0 }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, boxShadow: `0 0 5px ${color}`, animation: 'dtPulse 2s infinite' }} />
      <span style={{ fontSize: 9, fontWeight: 800, fontFamily: 'monospace', color, letterSpacing: 0.8 }}>{label}</span>
      <style>{`@keyframes dtPulse { 0%,100%{opacity:1}50%{opacity:0.45} }`}</style>
    </div>
  );
}

function TopBar({ currentTime, alerts }) {
  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  return (
    <div style={{
      height: 52,
      background: 'rgba(3, 6, 14, 0.98)',
      borderBottom: '1px solid rgba(56,189,248,0.18)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: 12,
      flexShrink: 0,
      zIndex: 200,
    }}>
      {/* Identity */}
      <div style={{ borderRight: '1px solid rgba(255,255,255,0.08)', paddingRight: 14, marginRight: 4, flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 800, fontFamily: 'monospace', color: '#38bdf8', letterSpacing: 1.5 }}>LONG THANH INTL</div>
        <div style={{ fontSize: 9, color: '#6b7280', fontFamily: 'monospace', letterSpacing: 1 }}>IATA: LTI • ICAO: VTLT</div>
      </div>

      {/* Status pills */}
      <StatusPill label="OPS CTR ONLINE" color="#22d3a5" />
      <StatusPill label="TWR ACTIVE" color="#22d3a5" />
      <StatusPill label="ATIS INFO-X" color="#38bdf8" />
      {criticalCount > 0 && <StatusPill label={`${criticalCount} CRITICAL`} color="#ef4444" />}

      {/* Weather */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: 12, marginLeft: 4, flexShrink: 0 }}>
        <Sun size={13} color="#fbbf24" />
        <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#d1d5db' }}>28°C Clear</span>
        <span style={{ fontSize: 10, color: '#6b7280', fontFamily: 'monospace' }}>Wind: 12kt NE • VIS: 10km</span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 7, padding: '5px 10px' }}>
        <Search size={12} color="#6b7280" />
        <input
          placeholder="Search gates, flights, areas..."
          style={{ background: 'none', border: 'none', outline: 'none', color: '#e2e8f0', fontSize: 11, fontFamily: 'monospace', width: 170 }}
        />
      </div>

      {/* Time */}
      <div style={{ borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: 12, flexShrink: 0, textAlign: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 800, fontFamily: 'monospace', color: '#38bdf8', letterSpacing: 1 }}>
          {currentTime.toLocaleTimeString('en-US', { hour12: false })}
        </div>
        <div style={{ fontSize: 9, color: '#6b7280', fontFamily: 'monospace' }}>
          {currentTime.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
        </div>
      </div>

      {/* Alerts bell */}
      <button style={{ position: 'relative', background: criticalCount > 0 ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${criticalCount > 0 ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.09)'}`, borderRadius: 7, padding: '6px 8px', cursor: 'pointer', color: criticalCount > 0 ? '#ef4444' : '#6b7280', display: 'flex', alignItems: 'center' }}>
        <Bell size={14} />
        {criticalCount > 0 && (
          <span style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%', background: '#ef4444', fontSize: 9, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }}>{criticalCount}</span>
        )}
      </button>
    </div>
  );
}

function StatsStrip({ equipmentList }) {
  const stats = [
    { label: 'Runways', value: '2 / 2 Active', color: '#22d3a5' },
    { label: 'Gates Occupied', value: '18 / 29', color: '#38bdf8' },
    { label: 'Aircraft on Apron', value: '12', color: '#38bdf8' },
    { label: 'Flights Today', value: '248', color: '#22d3a5' },
    { label: 'PAX Processed', value: '42,180', color: '#22d3a5' },
    { label: 'GSE Vehicles', value: '31 Active', color: '#a78bfa' },
    { label: 'BHS Status', value: 'WARNING', color: '#f59e0b' },
    { label: 'SCADA Assets', value: `${equipmentList.length} Online`, color: '#22d3a5' },
  ];
  return (
    <div style={{ height: 34, background: 'rgba(3,6,14,0.96)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', flexShrink: 0, overflow: 'hidden' }}>
      {stats.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '0 14px', borderRight: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'nowrap', flexShrink: 0 }}>
          <span style={{ fontSize: 9, color: '#4b5563', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</span>
          <span style={{ fontSize: 11, fontWeight: 800, fontFamily: 'monospace', color: s.color }}>{s.value}</span>
        </div>
      ))}
    </div>
  );
}

const Loader3D = () => (
  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg,#060d18,#020609)', flexDirection: 'column', gap: 20 }}>
    <div style={{ position: 'relative', width: 64, height: 64 }}>
      <div style={{ position: 'absolute', inset: 0, border: '2px solid rgba(56,189,248,0.15)', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <div style={{ position: 'absolute', inset: 10, border: '2px solid rgba(56,189,248,0.08)', borderBottomColor: '#38bdf8', borderRadius: '50%', animation: 'spin 1.3s linear infinite reverse' }} />
      <Activity size={18} color="#38bdf8" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
    </div>
    <div style={{ fontFamily: 'monospace', color: '#38bdf8', fontSize: 13, letterSpacing: 3, fontWeight: 700 }}>LOADING DIGITAL TWIN</div>
    <div style={{ fontFamily: 'monospace', color: '#4b5563', fontSize: 10, letterSpacing: 2 }}>LONG THANH INTERNATIONAL • VTLT</div>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default function DigitalTwin() {
  const { alerts, equipmentList } = useLiveData();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#020609', position: 'relative' }} className="animate-fadeIn">
      <TopBar currentTime={currentTime} alerts={alerts} />
      <StatsStrip equipmentList={equipmentList} />
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
        <Suspense fallback={<Loader3D />}>
          <AirportScene />
        </Suspense>
      </div>
    </div>
  );
}
