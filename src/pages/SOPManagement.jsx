import React, { useState } from 'react';
import {
  Search, BookOpen, FileText, Download, Plus, CheckCircle2,
  ChevronDown, ChevronUp, ArrowRight, ShieldAlert, Clock, Check
} from 'lucide-react';
import { SOP_DATA } from '../data/mockData';

const PIPELINE_STEPS = [
  { label: 'New', color: 'var(--blue)' },
  { label: 'Assigned', color: 'var(--blue)' },
  { label: 'Accepted', color: 'var(--green)' },
  { label: 'In Progress', color: 'var(--yellow)' },
  { label: 'Escalated', color: 'var(--red)' },
  { label: 'Resolved', color: 'var(--green)' },
  { label: 'Closed', color: 'var(--text-3)' },
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
    <div className="page animate-fadeIn">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">SOP & Emergency Incident Workflows</h1>
          <p className="page-subtitle">
            Long Thanh International Airport (LTIA) • Standard Operating Procedures & Smart City CIOC Workflow Standards (FRS FR-09)
          </p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => alert('Exporting SOP audit binder to PDF...')}
          >
            <Download size={13} /> Export Binder
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => alert('New SOP authoring dialog')}
          >
            <Plus size={13} /> Author SOP
          </button>
        </div>
      </div>

      {/* Workflow Pipeline Banner */}
      <div className="card" style={{
        padding: 'var(--s3) var(--s4)', marginBottom: 'var(--s4)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Pipeline:
          </span>
          {PIPELINE_STEPS.map((step, idx) => (
            <React.Fragment key={step.label}>
              <span style={{
                fontSize: 10, padding: '2px 8px', borderRadius: 'var(--r-sm)',
                background: 'var(--bg-app)', color: step.color, border: '1px solid var(--border)',
                fontWeight: 600, fontFamily: 'var(--mono)'
              }}>
                {step.label}
              </span>
              {idx < PIPELINE_STEPS.length - 1 && (
                <ArrowRight size={10} style={{ color: 'var(--text-3)' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 16, fontSize: 11, fontFamily: 'var(--mono)' }}>
          <span><strong style={{ color: 'var(--accent)' }}>L1:</strong> <span style={{ color: 'var(--text-3)' }}>Dispatcher</span></span>
          <span><strong style={{ color: 'var(--yellow)' }}>L2:</strong> <span style={{ color: 'var(--text-3)' }}>Supervisor (&gt;30m)</span></span>
          <span><strong style={{ color: 'var(--red)' }}>L3:</strong> <span style={{ color: 'var(--text-3)' }}>ACMC (&gt;2h)</span></span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, marginBottom: 'var(--s4)', flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', width: 280 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
          <input
            placeholder="Search by SOP ID or title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 32 }}
          />
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilterCategory('all')}
            className={`btn btn-xs ${filterCategory === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: 11 }}
          >
            All Categories
          </button>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilterCategory(c)}
              className={`btn btn-xs ${filterCategory === c ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: 11 }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* SOP List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
        {filtered.map(sop => {
          const isExpanded = expandedSop === sop.id;
          return (
            <div
              key={sop.id}
              className="card"
              style={{
                padding: 0,
                overflow: 'hidden',
                borderColor: isExpanded ? 'var(--border-md)' : 'var(--border)'
              }}
            >
              {/* Header */}
              <div
                onClick={() => setExpandedSop(isExpanded ? null : sop.id)}
                style={{
                  padding: 'var(--s3) var(--s4)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: 12, background: isExpanded ? 'var(--bg-overlay)' : 'transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <span style={{
                    fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--accent)',
                    background: 'var(--bg-app)', padding: '3px 8px', borderRadius: 'var(--r-sm)',
                    border: '1px solid var(--border)'
                  }}>
                    {sop.id}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>
                      {sop.title}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                      Category: {sop.category} • Target SLA: {sop.targetSLA || '15 mins'} • Escalation: {sop.escalationPath || 'Level 2'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="badge badge-operational">ACTIVE</span>
                  {isExpanded ? <ChevronUp size={16} color="var(--text-3)" /> : <ChevronDown size={16} color="var(--text-3)" />}
                </div>
              </div>

              {/* Expanded Body */}
              {isExpanded && (
                <div style={{ padding: 'var(--s4)', borderTop: '1px solid var(--border)', background: 'var(--bg-app)' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 'var(--s3)', lineHeight: 1.5 }}>
                    {sop.summary || 'Standard operating procedure detailing step-by-step incident response, telemetry threshold validation, and personnel notification paths.'}
                  </div>

                  {sop.steps && sop.steps.length > 0 && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 8 }}>
                        Action Checklist & Operational Steps:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {sop.steps.map((step, idx) => (
                          <div key={idx} style={{
                            display: 'flex', alignItems: 'flex-start', gap: 8,
                            padding: '6px 10px', background: 'var(--bg-surface)',
                            border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: 12
                          }}>
                            <span style={{
                              width: 18, height: 18, borderRadius: '50%', background: 'var(--blue-bg)',
                              color: 'var(--accent)', display: 'flex', alignItems: 'center',
                              justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0
                            }}>
                              {idx + 1}
                            </span>
                            <span style={{ color: 'var(--text-1)' }}>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 'var(--s3)', paddingTop: 'var(--s3)', borderTop: '1px solid var(--border)' }}>
                    <button
                      className="btn btn-secondary btn-xs"
                      onClick={() => alert(`Printing checklist for ${sop.id}...`)}
                    >
                      Print Checklist
                    </button>
                    <button
                      className="btn btn-primary btn-xs"
                      onClick={() => alert(`SOP ${sop.id} executed for current incident`)}
                    >
                      Execute Workflow
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
