import { useState } from 'react';
import { Search, BookOpen, FileText, ExternalLink, Download, Plus } from 'lucide-react';
import { SOP_DATA } from '../data/mockData';

export default function SOPManagement() {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = [...new Set(SOP_DATA.map(s => s.category))];

  const filtered = SOP_DATA.filter(s => {
    if (filterCategory !== 'all' && s.category !== filterCategory) return false;
    if (search && !s.title.toLowerCase().includes(search.toLowerCase()) && !s.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">SOP Management</h1>
          <p className="page-subtitle">Standard Operating Procedures library</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={14} /> New SOP
        </button>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-5)', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, maxWidth: 400 }}>
          <div className="search-input-wrapper">
            <Search size={14} />
            <input className="search-input" placeholder="Search SOPs..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="filter-chips">
          <button className={`filter-chip ${filterCategory === 'all' ? 'active' : ''}`} onClick={() => setFilterCategory('all')}>All</button>
          {categories.map(c => (
            <button key={c} className={`filter-chip ${filterCategory === c ? 'active' : ''}`} onClick={() => setFilterCategory(c)}>{c}</button>
          ))}
        </div>
      </div>

      {/* SOP Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-4)' }}>
        {filtered.map((sop, idx) => (
          <div key={sop.id} className="card animate-slideInUp" style={{ animationDelay: `${idx * 40}ms`, cursor: 'pointer' }}>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={16} style={{ color: 'var(--accent-teal)' }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--accent-teal)', fontWeight: 600 }}>{sop.id}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>v{sop.version}</div>
                  </div>
                </div>
                <span className={`status-badge ${sop.priority}`} style={{ fontSize: '10px', padding: '0 6px' }}>
                  {sop.priority}
                </span>
              </div>

              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
                {sop.title}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                <span>{sop.category}</span>
                <span>Updated: {sop.lastUpdated}</span>
                <span className={`status-badge ${sop.status === 'Active' ? 'operational' : 'warning'}`} style={{ fontSize: '10px', padding: '0 6px' }}>
                  {sop.status}
                </span>
              </div>

              <div style={{ marginTop: 'var(--space-3)', display: 'flex', gap: 'var(--space-2)' }}>
                <button className="btn btn-secondary btn-sm">
                  <FileText size={12} /> View
                </button>
                <button className="btn btn-ghost btn-sm">
                  <Download size={12} /> PDF
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
