import React, { useState } from 'react';
import { Search, BookOpen, FileText, Download, Plus, CheckCircle2, AlertOctagon, ChevronDown, ChevronUp, Clock, ShieldAlert } from 'lucide-react';
import { SOP_DATA } from '../data/mockData';

export default function SOPManagement() {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [expandedSop, setExpandedSop] = useState(SOP_DATA[0]?.id || null);

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
          <h1 className="page-title">SOP & Emergency Incident Workflow Engine</h1>
          <p className="page-subtitle">Standard Operating Procedures conforming to LTIA Subsystems FRS & DMKU Smart City CIOC Workflow Standards</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => alert('Exporting all approved SOP workflows to PDF audit binder...')}>
            <Download size={14} /> Export SOP Binder
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => alert('New SOP workflow authoring modal (Role: Super Admin / City Admin only)')}>
            <Plus size={14} /> Author New SOP
          </button>
        </div>
      </div>

      {/* Lifecycle & Escalation Rule Banner */}
      <div className="card p-3 mb-4 bg-elevated border-subtle">
        <div className="flex justify-between items-center flex-wrap gap-2 text-2xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-secondary">Official Workflow Pipeline:</span>
            <span className="status-badge operational text-3xs">New</span> →
            <span className="status-badge operational text-3xs">Assigned</span> →
            <span className="status-badge operational text-3xs">Accepted</span> →
            <span className="status-badge warning text-3xs">In Progress</span> →
            <span className="status-badge critical text-3xs">Escalated</span> →
            <span className="status-badge operational text-3xs">Resolved</span> →
            <span className="status-badge font-mono text-3xs" style={{ background: '#2a3040', color: '#8b92a5' }}>Closed</span>
          </div>
          <div className="flex items-center gap-3 text-3xs text-secondary">
            <span><strong className="text-teal">L1</strong>: Field Dispatcher</span>
            <span><strong className="text-amber">L2</strong>: Shift Supervisor (&gt;30m)</span>
            <span><strong className="text-red">L3</strong>: ACMC Commander (&gt;2h SLA Breach)</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 260, maxWidth: 400 }}>
          <div className="search-input-wrapper">
            <Search size={14} />
            <input className="search-input" placeholder="Search SOPs by ID or Title..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="filter-chips">
          <button className={`filter-chip ${filterCategory === 'all' ? 'active' : ''}`} onClick={() => setFilterCategory('all')}>All Subsystems</button>
          {categories.map(c => (
            <button key={c} className={`filter-chip ${filterCategory === c ? 'active' : ''}`} onClick={() => setFilterCategory(c)}>{c}</button>
          ))}
        </div>
      </div>

      {/* SOP Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 'var(--space-4)' }}>
        {filtered.map((sop, idx) => {
          const isExpanded = expandedSop === sop.id;
          return (
            <div 
              key={sop.id} 
              className="card animate-slideInUp" 
              style={{ animationDelay: `${idx * 40}ms`, borderLeft: '4px solid var(--accent-teal)' }}
            >
              <div className="card-body p-4">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-md)', background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BookOpen size={16} style={{ color: 'var(--accent-teal)' }} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--accent-teal)', fontWeight: 700 }}>{sop.id}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{sop.version} • {sop.category}</div>
                    </div>
                  </div>
                  <span className="status-badge operational font-mono text-3xs">
                    ACTIVE APPROVED
                  </span>
                </div>

                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
                  {sop.title}
                </h3>

                <div className="p-2 bg-elevated rounded border border-subtle mb-3 text-3xs font-mono text-secondary">
                  <div className="text-tertiary mb-0.5 uppercase tracking-wide">Escalation Matrix:</div>
                  <div className="text-teal font-semibold">{sop.escalation || 'L1: Operator -> L2: Supervisor (>30m) -> L3: Management'}</div>
                </div>

                {/* Steps Accordion */}
                <div className="mb-3">
                  <button 
                    className="btn btn-ghost btn-sm w-full flex justify-between items-center text-2xs font-mono p-1"
                    onClick={() => setExpandedSop(isExpanded ? null : sop.id)}
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <span>Procedure Steps ({sop.steps?.length || 4} Actions)</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {isExpanded && sop.steps && (
                    <div className="mt-2 pl-2 border-l-2 border-teal flex flex-col gap-2 animate-fadeIn">
                      {sop.steps.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-2 text-2xs text-secondary">
                          <span className="font-mono text-teal font-bold">{sIdx + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--border-subtle)' }}>
                  <span className="text-3xs font-mono text-tertiary">MTTR Target: ≤ 30 min</span>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => alert(`Simulating execution test of ${sop.id}...`)}>
                      <CheckCircle2 size={12} /> Test Run
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => alert(`Exporting ${sop.id} documentation...`)}>
                      <Download size={12} /> PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
