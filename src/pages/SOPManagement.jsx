import React, { useState } from 'react';
import { Search, BookOpen, FileText, Download, Plus, CheckCircle2, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { SOP_DATA } from '../data/mockData';

const CATEGORY_COLORS = {
  'Fire Safety':    { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' },
  'HVAC':           { color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.3)' },
  'Security':       { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  'BHS':            { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.3)' },
  'Power':          { color: '#f97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.3)' },
  'Emergency':      { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' },
};
const defaultCat = { color: '#00d4aa', bg: 'rgba(0,212,170,0.12)', border: 'rgba(0,212,170,0.3)' };

const PIPELINE_STEPS = [
  { label: 'New', color: '#38bdf8' },
  { label: 'Assigned', color: '#38bdf8' },
  { label: 'Accepted', color: '#10b981' },
  { label: 'In Progress', color: '#f59e0b' },
  { label: 'Escalated', color: '#ef4444' },
  { label: 'Resolved', color: '#10b981' },
  { label: 'Closed', color: '#8b92a5' },
];

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
    <div className="animate-fadeIn" style={{ padding: 'var(--space-5)' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 4, height: 28, background: 'linear-gradient(180deg, #a78bfa, #38bdf8)', borderRadius: 2 }} />
            <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>SOP & Emergency Incident Workflows</h1>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: 0, paddingLeft: 14 }}>
            Standard Operating Procedures · LTIA FRS & DMKU Smart City CIOC Workflow Standards (FRS FR-09)
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => alert('Exporting SOP audit binder to PDF...')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', fontSize: 12, cursor: 'pointer' }}>
            <Download size={13} /> Export Binder
          </button>
          <button onClick={() => alert('New SOP authoring (Management only)')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, background: 'linear-gradient(135deg, #a78bfa, #38bdf8)', border: 'none', color: 'white', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
            <Plus size={13} /> Author New SOP
          </button>
        </div>
      </div>

      {/* Lifecycle Pipeline Banner */}
      <div style={{
        padding: '14px 20px', borderRadius: 12, marginBottom: 'var(--space-4)',
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', marginRight: 8 }}>WORKFLOW PIPELINE:</span>
          {PIPELINE_STEPS.map((step, idx) => (
            <React.Fragment key={step.label}>
              <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 5, background: `${step.color}18`, color: step.color, border: `1px solid ${step.color}30`, fontWeight: 700, fontFamily: 'monospace' }}>{step.label}</span>
              {idx < PIPELINE_STEPS.length - 1 && <ArrowRight size={10} color="rgba(255,255,255,0.2)" />}
            </React.Fragment>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 10, fontFamily: 'monospace' }}>
          <span><strong style={{ color: '#00d4aa' }}>L1:</strong> <span style={{ color: 'rgba(255,255,255,0.45)' }}>Field Dispatcher</span></span>
          <span><strong style={{ color: '#f59e0b' }}>L2:</strong> <span style={{ color: 'rgba(255,255,255,0.45)' }}>Shift Supervisor (&gt;30m)</span></span>
          <span><strong style={{ color: '#ef4444' }}>L3:</strong> <span style={{ color: 'rgba(255,255,255,0.45)' }}>ACMC Commander (&gt;2h)</span></span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ maxWidth: 320, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, padding: '8px 14px', flex: 1 }}>
          <Search size={14} color="rgba(255,255,255,0.3)" />
          <input
            placeholder="Search by SOP ID or title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: 13 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button onClick={() => setFilterCategory('all')} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 10, fontWeight: 700, cursor: 'pointer', border: filterCategory === 'all' ? '1px solid rgba(0,212,170,0.4)' : '1px solid rgba(255,255,255,0.08)', background: filterCategory === 'all' ? 'rgba(0,212,170,0.12)' : 'transparent', color: filterCategory === 'all' ? '#00d4aa' : 'rgba(255,255,255,0.4)' }}>All</button>
          {categories.map(c => {
            const cfg = CATEGORY_COLORS[c] || defaultCat;
            return (
              <button key={c} onClick={() => setFilterCategory(c)} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 10, fontWeight: 700, cursor: 'pointer', border: filterCategory === c ? `1px solid ${cfg.border}` : '1px solid rgba(255,255,255,0.08)', background: filterCategory === c ? cfg.bg : 'transparent', color: filterCategory === c ? cfg.color : 'rgba(255,255,255,0.4)' }}>{c}</button>
            );
          })}
        </div>
      </div>

      {/* SOP Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 'var(--space-4)' }}>
        {filtered.map((sop, idx) => {
          const catCfg = CATEGORY_COLORS[sop.category] || defaultCat;
          const isExpanded = expandedSop === sop.id;
          return (
            <div
              key={sop.id}
              style={{
                borderRadius: 14, overflow: 'hidden',
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid rgba(255,255,255,0.08)`,
                borderTop: `3px solid ${catCfg.color}`,
                transition: 'all 0.2s',
                animationDelay: `${idx * 40}ms`,
              }}
              className="animate-slideInUp"
            >
              <div style={{ padding: '16px 18px' }}>
                {/* Card Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: catCfg.bg, border: `1px solid ${catCfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BookOpen size={16} color={catCfg.color} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'monospace', fontSize: 12, color: catCfg.color, fontWeight: 700 }}>{sop.id}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{sop.version} · {sop.category}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 9, padding: '3px 8px', borderRadius: 5, background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', fontWeight: 700, fontFamily: 'monospace' }}>APPROVED</span>
                </div>

                <h3 style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 10, lineHeight: 1.4 }}>{sop.title}</h3>

                {/* Escalation */}
                <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 12 }}>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em', marginBottom: 3, fontFamily: 'monospace' }}>ESCALATION PATH</div>
                  <div style={{ fontSize: 11, color: catCfg.color, fontFamily: 'monospace' }}>{sop.escalation || 'L1 → L2 (>30m) → L3 ACMC (>2h SLA)'}</div>
                </div>

                {/* Steps Accordion */}
                <button
                  onClick={() => setExpandedSop(isExpanded ? null : sop.id)}
                  style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                    color: 'rgba(255,255,255,0.6)', fontSize: 11, fontFamily: 'monospace',
                    marginBottom: isExpanded ? 8 : 0,
                  }}
                >
                  <span>PROCEDURE STEPS ({sop.steps?.length || 4})</span>
                  {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>

                {isExpanded && sop.steps && (
                  <div style={{ borderLeft: `2px solid ${catCfg.color}`, paddingLeft: 12, display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                    {sop.steps.map((step, sIdx) => (
                      <div key={sIdx} style={{ display: 'flex', gap: 8, fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
                        <span style={{ fontFamily: 'monospace', color: catCfg.color, fontWeight: 700, flexShrink: 0 }}>{sIdx + 1}.</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>MTTR: ≤ 30 min</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => alert(`Test-running ${sop.id}...`)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, fontSize: 10, background: catCfg.bg, border: `1px solid ${catCfg.border}`, color: catCfg.color, cursor: 'pointer' }}>
                      <CheckCircle2 size={10} /> Test Run
                    </button>
                    <button onClick={() => alert(`Exporting ${sop.id}...`)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, fontSize: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                      <Download size={10} /> PDF
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
