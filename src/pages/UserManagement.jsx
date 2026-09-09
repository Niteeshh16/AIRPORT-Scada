import React, { useState } from 'react';
import { Search, Plus, Shield, Mail, Clock, UserCheck, UserX, Lock, Unlock, Edit2 } from 'lucide-react';
import { USERS } from '../data/mockData';
import { ROLES } from '../context/AuthContext';

const ROLE_CONFIG = {
  'Super Admin':            { color: '#00d4aa', bg: 'rgba(0,212,170,0.12)', border: 'rgba(0,212,170,0.3)', roleKey: ROLES.MANAGEMENT },
  'HVAC Shift Lead':        { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', roleKey: ROLES.SUPERVISOR },
  'BHS Specialist':         { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', roleKey: ROLES.SUPERVISOR },
  'Security Ops Operator':  { color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.3)', roleKey: ROLES.OPERATOR },
};

const defaultRole = { color: '#8b92a5', bg: 'rgba(139,146,165,0.12)', border: 'rgba(139,146,165,0.3)' };

const PERMISSIONS_MATRIX = [
  { permission: 'Command Center',    operator: true,  supervisor: true,  management: true  },
  { permission: 'Alerts & Events',   operator: true,  supervisor: true,  management: true  },
  { permission: 'Equipment List',    operator: true,  supervisor: true,  management: true  },
  { permission: 'Subsystems',        operator: true,  supervisor: true,  management: true  },
  { permission: 'Analytics',         operator: false, supervisor: true,  management: true  },
  { permission: 'Work Orders',       operator: false, supervisor: true,  management: true  },
  { permission: 'SOP Management',    operator: false, supervisor: true,  management: true  },
  { permission: 'Operator Cockpit',  operator: false, supervisor: true,  management: true  },
  { permission: 'Supervisor Mode',   operator: false, supervisor: false, management: true  },
  { permission: 'User Management',   operator: false, supervisor: false, management: true  },
];

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const [showMatrix, setShowMatrix] = useState(true);

  const filtered = USERS.filter(u =>
    !search ||
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: 'Total Users', value: USERS.length, color: '#00d4aa' },
    { label: 'Active Now',  value: USERS.filter(u => u.status === 'active').length, color: '#10b981' },
    { label: 'Offline',     value: USERS.filter(u => u.status === 'offline').length, color: '#8b92a5' },
    { label: 'Away',        value: USERS.filter(u => u.status === 'away').length, color: '#f59e0b' },
  ];

  return (
    <div className="animate-fadeIn" style={{ padding: 'var(--space-5)' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-5)', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 4, height: 28, background: 'linear-gradient(180deg, #00d4aa, #0ea5e9)', borderRadius: 2 }} />
            <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>User Management & RBAC</h1>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: 0, paddingLeft: 14 }}>
            LTIA HBMS · Role-Based Access Control — FRS FR-07 Compliant
          </p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 20px', borderRadius: 10,
          background: 'linear-gradient(135deg, #00d4aa, #0891b2)',
          border: 'none', color: 'white', fontWeight: 700, fontSize: 13,
          cursor: 'pointer', boxShadow: '0 0 16px rgba(0,212,170,0.3)',
        }}>
          <Plus size={15} /> Add User
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        {stats.map(({ label, value, color }) => (
          <div key={label} style={{ padding: '20px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: 'monospace', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ maxWidth: 360, marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, padding: '8px 14px' }}>
        <Search size={14} color="rgba(255,255,255,0.3)" />
        <input
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: 13 }}
        />
      </div>

      {/* Users Table */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden', marginBottom: 'var(--space-5)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {['User', 'Role / Clearance', 'Department', 'Status', 'Email', 'Actions'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', background: 'rgba(0,0,0,0.2)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((user, idx) => {
              const rc = ROLE_CONFIG[user.role] || defaultRole;
              const isActive = user.status === 'active';
              const initials = user.name.split(' ').map(n => n[0]).join('');
              return (
                <tr key={user.id}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                        background: `linear-gradient(135deg, ${rc.color}aa, #0ea5e9)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 800, color: 'white',
                      }}>{initials}</div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'white', fontSize: 13 }}>{user.name}</div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Shield size={11} color={rc.color} />
                      <span style={{
                        fontSize: 10, padding: '3px 8px', borderRadius: 5, fontWeight: 700,
                        background: rc.bg, color: rc.color, border: `1px solid ${rc.border}`,
                      }}>{user.role}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>{user.department}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700,
                      color: isActive ? '#10b981' : user.status === 'away' ? '#f59e0b' : '#8b92a5',
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: isActive ? '#10b981' : user.status === 'away' ? '#f59e0b' : '#8b92a5', display: 'inline-block' }} />
                      {user.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Mail size={10} />{user.email}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.25)', color: '#38bdf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Edit2 size={9} /> Edit
                      </button>
                      <button style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Lock size={9} /> Perms
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* RBAC Permission Matrix */}
      <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', background: 'rgba(0,0,0,0.3)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={14} color="#00d4aa" />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>RBAC Permission Matrix</span>
            <span style={{ fontSize: 9, padding: '2px 6px', background: 'rgba(0,212,170,0.12)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.3)', borderRadius: 4, fontFamily: 'monospace' }}>FRS FR-07</span>
          </div>
          <button
            onClick={() => setShowMatrix(v => !v)}
            style={{ fontSize: 11, color: '#38bdf8', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            {showMatrix ? 'Collapse' : 'Expand'}
          </button>
        </div>
        {showMatrix && (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <th style={{ padding: '10px 20px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', background: 'rgba(0,0,0,0.2)' }}>Screen / Feature</th>
                {['SOC Operator', 'Supervisor', 'Management'].map(r => (
                  <th key={r} style={{ padding: '10px 20px', textAlign: 'center', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', background: 'rgba(0,0,0,0.2)' }}>{r}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS_MATRIX.map((row, idx) => (
                <tr key={row.permission} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                  <td style={{ padding: '10px 20px', color: 'var(--text-secondary)', fontWeight: 500 }}>{row.permission}</td>
                  {[row.operator, row.supervisor, row.management].map((has, i) => (
                    <td key={i} style={{ padding: '10px 20px', textAlign: 'center' }}>
                      {has
                        ? <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 6, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}>
                            <UserCheck size={12} color="#10b981" />
                          </span>
                        : <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 6, background: 'rgba(139,146,165,0.08)', border: '1px solid rgba(139,146,165,0.15)' }}>
                            <UserX size={12} color="rgba(139,146,165,0.4)" />
                          </span>
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
