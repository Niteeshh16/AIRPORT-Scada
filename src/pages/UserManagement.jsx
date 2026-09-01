import { useState } from 'react';
import { Search, Plus, Shield, Mail, Clock } from 'lucide-react';
import { USERS } from '../data/mockData';

export default function UserManagement() {
  const [search, setSearch] = useState('');

  const filtered = USERS.filter(u => 
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Manage operators, supervisors, and system users</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={14} /> Add User
        </button>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <div className="card" style={{ padding: 'var(--space-4)' }}>
          <div className="kpi-label">Total Users</div>
          <div className="kpi-value teal">{USERS.length}</div>
        </div>
        <div className="card" style={{ padding: 'var(--space-4)' }}>
          <div className="kpi-label">Active Now</div>
          <div className="kpi-value teal">{USERS.filter(u => u.status === 'active').length}</div>
        </div>
        <div className="card" style={{ padding: 'var(--space-4)' }}>
          <div className="kpi-label">Offline</div>
          <div className="kpi-value">{USERS.filter(u => u.status === 'offline').length}</div>
        </div>
      </div>

      {/* Search */}
      <div style={{ maxWidth: 400, marginBottom: 'var(--space-4)' }}>
        <div className="search-input-wrapper">
          <Search size={14} />
          <input className="search-input" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Users Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Email</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ 
                      width: 32, height: 32, borderRadius: '50%', 
                      background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-blue))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: 700, color: 'white', flexShrink: 0
                    }}>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: 'var(--text-sm)' }}>{user.name}</span>
                  </div>
                </td>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)' }}>
                    <Shield size={10} /> {user.role}
                  </span>
                </td>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)' }}>
                    <Mail size={10} /> {user.email}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.status === 'active' ? 'operational' : user.status === 'away' ? 'warning' : 'offline'}`}>
                    <span className="status-dot-sm" />
                    {user.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                    <Clock size={10} /> {user.lastLogin}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                    <button className="btn btn-ghost btn-sm">Edit</button>
                    <button className="btn btn-ghost btn-sm">Permissions</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
