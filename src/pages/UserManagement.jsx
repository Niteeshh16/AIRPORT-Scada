import React, { useState } from 'react';
import {
  Search, Plus, Shield, Mail, Clock, UserCheck, Lock, Unlock,
  ChevronDown, ChevronUp, Check, X
} from 'lucide-react';
import { USERS } from '../data/mockData';
import { ROLES } from '../context/AuthContext';

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
    { label: 'Total Accounts', value: USERS.length, color: 'blue', icon: Shield },
    { label: 'Active Sessions', value: USERS.filter(u => u.status === 'active').length, color: 'green', icon: UserCheck },
    { label: 'Away / Shift Rest', value: USERS.filter(u => u.status === 'away').length, color: 'yellow', icon: Clock },
    { label: 'Offline Personnel', value: USERS.filter(u => u.status === 'offline').length, color: 'muted', icon: Lock },
  ];

  return (
    <div className="page animate-fadeIn">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">User Accounts & Role Access Control</h1>
          <p className="page-subtitle">
            Long Thanh International Airport (LTIA) • Role-Based Access Control (FRS FR-07 Compliant)
          </p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-primary"
            onClick={() => alert('New User Invitation Dialog (LDAP / Active Directory sync)')}
          >
            <Plus size={14} /> Add User
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stat-grid stat-grid-4" style={{ marginBottom: 'var(--s5)' }}>
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="stat-card">
              <div className={`stat-icon ${s.color}`}>
                <Icon size={16} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, marginBottom: 'var(--s4)', flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', width: 280 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
          <input
            placeholder="Search users by name or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 32 }}
          />
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setShowMatrix(!showMatrix)}
        >
          {showMatrix ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          <span>{showMatrix ? 'Hide Permission Matrix' : 'Show Permission Matrix'}</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 'var(--s5)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role / Clearance</th>
                <th>Department</th>
                <th>Status</th>
                <th>Email Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => {
                const statusBadge =
                  user.status === 'active' ? 'badge-operational' :
                  user.status === 'away' ? 'badge-warning' : 'badge-offline';

                return (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #388bfd, #58a6ff)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 700, color: 'white'
                        }}>
                          {user.avatar || user.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-1)' }}>{user.name}</div>
                          <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>{user.id}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="badge badge-operational">
                        {user.role}
                      </span>
                    </td>

                    <td style={{ color: 'var(--text-2)' }}>
                      {user.dept}
                    </td>

                    <td>
                      <span className={`badge ${statusBadge}`}>
                        {user.status.toUpperCase()}
                      </span>
                    </td>

                    <td style={{ color: 'var(--text-2)', fontFamily: 'var(--mono)', fontSize: 11 }}>
                      {user.email}
                    </td>

                    <td>
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() => alert(`Edit profile for ${user.name}`)}
                        style={{ fontSize: 11 }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collapsible RBAC Permission Matrix */}
      {showMatrix && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{
            padding: 'var(--s3) var(--s5)', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={15} style={{ color: 'var(--accent)' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>
                FRS FR-07 RBAC Clearance & Permission Matrix
              </span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
              Enforced by AuthContext Route Guarding
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Application Module / Route</th>
                  <th style={{ textAlign: 'center' }}>SOC Operator</th>
                  <th style={{ textAlign: 'center' }}>Supervisor</th>
                  <th style={{ textAlign: 'center' }}>Management (Admin)</th>
                </tr>
              </thead>
              <tbody>
                {PERMISSIONS_MATRIX.map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600, color: 'var(--text-1)' }}>
                      {row.permission}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {row.operator ? (
                        <span style={{ color: 'var(--green)', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                          <Check size={14} /> Allowed
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-3)', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                          <X size={14} /> Restricted
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {row.supervisor ? (
                        <span style={{ color: 'var(--green)', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                          <Check size={14} /> Allowed
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-3)', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                          <X size={14} /> Restricted
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {row.management ? (
                        <span style={{ color: 'var(--green)', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                          <Check size={14} /> Allowed
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-3)', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                          <X size={14} /> Restricted
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
