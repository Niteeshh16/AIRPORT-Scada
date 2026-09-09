import React, { useState } from 'react';
import { Shield, Activity, Users, ChevronRight, Lock, Eye, EyeOff, Wifi, Server, Zap } from 'lucide-react';
import { useAuth, DEMO_USERS, ROLES } from '../context/AuthContext';

const ROLE_CONFIG = {
  [ROLES.OPERATOR]: {
    icon: Activity,
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    glowColor: 'rgba(14, 165, 233, 0.3)',
    borderColor: 'rgba(14, 165, 233, 0.4)',
    badge: 'LEVEL 2',
    desc: 'Real-time monitoring, alarm acknowledgment, and equipment inspection access.',
    permissions: ['Command Center', 'Alerts & Events', 'Subsystems', 'Equipment Explorer'],
  },
  [ROLES.SUPERVISOR]: {
    icon: Shield,
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    glowColor: 'rgba(245, 158, 11, 0.3)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
    badge: 'LEVEL 3',
    desc: 'Full operational oversight, SOP execution, analytics, and work order management.',
    permissions: ['All Operator Access', 'Analytics & Trends', 'SOP Workflows', 'Work Orders', 'Operator Cockpit'],
  },
  [ROLES.MANAGEMENT]: {
    icon: Users,
    gradient: 'linear-gradient(135deg, #00d4aa 0%, #0891b2 100%)',
    glowColor: 'rgba(0, 212, 170, 0.3)',
    borderColor: 'rgba(0, 212, 170, 0.4)',
    badge: 'LEVEL 5',
    desc: 'Full system authority — all dashboards, user management, and configuration.',
    permissions: ['Full System Access', 'User Management', 'Supervisor Mode', 'All Reports'],
  },
};

export default function LoginPage() {
  const { login } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!selectedUser) { setError('Select your role to continue.'); return; }
    if (!password.trim()) { setError('Password is required.'); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    login(selectedUser);
  };

  const now = new Date();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 20% 50%, rgba(0, 212, 170, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(56, 189, 248, 0.06) 0%, transparent 50%), #080d14',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Background Grid */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
        backgroundSize: '40px 40px', pointerEvents: 'none',
      }} />

      {/* Animated corner decorations */}
      {['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].map((pos) => (
        <div key={pos} style={{
          position: 'absolute',
          width: 120, height: 120,
          ...(pos === 'topLeft' ? { top: 0, left: 0, borderTop: '2px solid rgba(0,212,170,0.2)', borderLeft: '2px solid rgba(0,212,170,0.2)' } : {}),
          ...(pos === 'topRight' ? { top: 0, right: 0, borderTop: '2px solid rgba(56,189,248,0.2)', borderRight: '2px solid rgba(56,189,248,0.2)' } : {}),
          ...(pos === 'bottomLeft' ? { bottom: 0, left: 0, borderBottom: '2px solid rgba(56,189,248,0.2)', borderLeft: '2px solid rgba(56,189,248,0.2)' } : {}),
          ...(pos === 'bottomRight' ? { bottom: 0, right: 0, borderBottom: '2px solid rgba(0,212,170,0.2)', borderRight: '2px solid rgba(0,212,170,0.2)' } : {}),
        }} />
      ))}

      {/* System Status Bar */}
      <div style={{
        position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: 20,
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8, padding: '6px 16px', fontSize: 11,
        color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', letterSpacing: '0.05em',
        whiteSpace: 'nowrap',
      }}>
        {[
          { icon: Wifi, label: 'NETWORK', value: 'SECURE', color: '#00d4aa' },
          { icon: Server, label: 'AVEVA UOC', value: 'ONLINE', color: '#00d4aa' },
          { icon: Zap, label: 'SYSTEM', value: 'OPERATIONAL', color: '#00d4aa' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon size={10} style={{ color }} />
            <span>{label}:</span>
            <span style={{ color, fontWeight: 600 }}>{value}</span>
          </div>
        ))}
        <span style={{ opacity: 0.3 }}>|</span>
        <span>{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} ICT</span>
      </div>

      {/* Main Card */}
      <div style={{
        width: '100%', maxWidth: 960,
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 0,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
      }}>

        {/* Left — Branding Panel */}
        <div style={{
          padding: '48px 40px',
          background: 'linear-gradient(160deg, rgba(0,212,170,0.08) 0%, rgba(56,189,248,0.05) 50%, rgba(0,0,0,0.2) 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 40 }}>
              <div style={{
                width: 48, height: 48,
                background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)',
                borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(0,212,170,0.4)',
              }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: 'white' }}>✈</span>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'white', letterSpacing: '0.1em' }}>LTIA · HBMS</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', fontFamily: 'monospace' }}>HUB BUILDING MGMT SYSTEM</div>
              </div>
            </div>

            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 12 }}>
              Airport Control &<br />
              <span style={{ background: 'linear-gradient(90deg, #00d4aa, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Monitoring Center
              </span>
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
              Long Thanh International Airport — Terminal 1<br />
              AVEVA UOC Supervisory Platform v4.2<br />
              Strictly Read-Only Supervisory Mode
            </p>
          </div>

          {/* System Info Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['Deployment', 'LTIA T1 — Main Complex'],
              ['Protocol', 'OPC UA · BACnet · Modbus'],
              ['Security', 'TLS 1.3 · RBAC · Audit Log'],
              ['Compliance', 'ICD-LTIA-HBMS-2025 Rev.4'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 8 }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', letterSpacing: '0.04em' }}>{k}</span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Login Form */}
        <div style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', fontFamily: 'monospace', marginBottom: 8 }}>
              AUTHENTICATED ACCESS
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'white', margin: 0 }}>Select Your Role</h2>
          </div>

          {/* Role Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {DEMO_USERS.map(user => {
              const cfg = ROLE_CONFIG[user.role];
              const Icon = cfg.icon;
              const isSelected = selectedUser?.id === user.id;
              return (
                <button
                  key={user.id}
                  onClick={() => { setSelectedUser(user); setError(''); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 16px',
                    background: isSelected ? `rgba(${cfg.glowColor.slice(5, -1)}, 0.15)` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isSelected ? cfg.borderColor : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: 12,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? `0 0 20px ${cfg.glowColor}` : 'none',
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: cfg.gradient, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: isSelected ? `0 0 14px ${cfg.glowColor}` : 'none',
                  }}>
                    <Icon size={18} color="white" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{user.name}</span>
                      <span style={{
                        fontSize: 9, padding: '2px 6px', borderRadius: 4,
                        background: cfg.gradient, color: 'white', fontFamily: 'monospace',
                        fontWeight: 700, letterSpacing: '0.05em',
                      }}>{cfg.badge}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>{user.role} · {user.department.split('—')[0].trim()}</div>
                  </div>
                  {isSelected && <ChevronRight size={16} color={cfg.borderColor.slice(0, -4) + '1)'} />}
                </button>
              );
            })}
          </div>

          {/* Password Field */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, padding: '0 14px',
                transition: 'border-color 0.2s',
              }}>
                <Lock size={14} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0 }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password..."
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    color: 'white', fontSize: 13, padding: '12px 0',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'rgba(255,255,255,0.3)' }}
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {error && (
                <div style={{ fontSize: 11, color: '#f87171', marginTop: 6, paddingLeft: 4 }}>{error}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '14px 24px',
                background: loading ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #00d4aa 0%, #0891b2 100%)',
                border: 'none', borderRadius: 10,
                color: 'white', fontSize: 13, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: '0.04em',
                transition: 'all 0.2s ease',
                boxShadow: loading ? 'none' : '0 0 20px rgba(0,212,170,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield size={14} />
                  Authenticate & Enter HBMS
                </>
              )}
            </button>
          </form>

          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', textAlign: 'center', fontFamily: 'monospace', lineHeight: 1.6 }}>
            DEMO MODE — Any password accepted<br />
            All access is logged per ICD-LTIA-SEC-2025
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 24, fontSize: 10, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', textAlign: 'center', letterSpacing: '0.05em' }}>
        LTIA HBMS v4.2 · © 2025 Long Thanh International Airport Authority · Restricted System
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
