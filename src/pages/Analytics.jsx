import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Minus, Download, Zap, 
  Activity, Thermometer, CheckCircle2, Layers
} from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';
import { TREND_DATA } from '../data/mockData';
import { 
  LineChart, Line, AreaChart, Area, 
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend 
} from 'recharts';

export default function Analytics() {
  const { airportInfo, lbmsKpis, scadaElectrical } = useLiveData();
  const [activeTab, setActiveTab] = useState('trends'); // 'trends' | 'lbms_kpis' | 'electrical_scada' | 'dbku_kpis'
  const [timeRange, setTimeRange] = useState('24H');
  const [chartType, setChartType] = useState('area');
  const [showComparison, setShowComparison] = useState(true);

  const ranges = ['1H', '6H', '24H', '7D', '30D'];

  const dataSlice = timeRange === '1H' ? TREND_DATA.slice(-8) :
                    timeRange === '6H' ? TREND_DATA.slice(-24) :
                    timeRange === '7D' ? TREND_DATA.slice(-60) :
                    timeRange === '30D' ? TREND_DATA : TREND_DATA;

  // Calculate KPIs from trend data
  const availabilities = dataSlice.map(d => d.availability);
  const current = availabilities[availabilities.length - 1]?.toFixed(1);
  const avg = (availabilities.reduce((a, b) => a + b, 0) / availabilities.length).toFixed(1);
  const min = Math.min(...availabilities).toFixed(1);
  const max = Math.max(...availabilities).toFixed(1);
  const change = (availabilities[availabilities.length - 1] - availabilities[0]).toFixed(1);

  const summaryKpis = [
    { label: 'Fleet Availability', value: `${current}%`, icon: change > 0 ? TrendingUp : TrendingDown, color: 'teal', note: 'Target ≥95.0%' },
    { label: 'Plant Efficiency', value: '0.58 kW/RT', icon: TrendingUp, color: 'teal', note: 'LBMS-KPI-E03 (Target ≤0.65)' },
    { label: 'Specific Energy (SEC)', value: '16.4 kWh/m²', icon: Minus, color: 'blue', note: 'LBMS-KPI-E02 (Target ≤18.5)' },
    { label: 'Power Factor (cos φ)', value: '0.98', icon: Zap, color: 'amber', note: '12 PFC Banks Active' },
    { label: 'Harmonic THD', value: '2.8%', icon: CheckCircle2, color: 'teal', note: '4 AHFs Active (<5% Limit)' },
  ];

  // DBKU 3 Subsystems KPI dataset from DBKU 3 subsystem kpi.csv
  const dbkuKpis = [
    { code: 'CCTV-01', name: 'Camera Fleet Availability', formula: '(Online Cameras / Total Cameras) × 100', target: '≥ 98.0%', actual: '98.6%', freq: '5 mins', sub: 'CCTV' },
    { code: 'CCTV-02', name: 'RTSP Video Stream Latency', formula: 'T_display - T_capture', target: '≤ 1.50 sec', actual: '1.18 sec', freq: 'Realtime', sub: 'CCTV' },
    { code: 'CCTV-03', name: '30-Day Storage Retention Compliance', formula: '(Cameras with ≥30d Footage / Total) × 100', target: '100%', actual: '100%', freq: 'Daily', sub: 'CCTV' },
    { code: 'CCTV-04', name: 'Camera Mean Time to Repair (MTTR)', formula: 'Σ(T_restore - T_fault) / Total Faults', target: '≤ 4.0 hrs', actual: '2.8 hrs', freq: 'Monthly', sub: 'CCTV' },
    { code: 'TAX-01', name: 'Annual Assessment Collection Rate', formula: '(Revenue Collected / Total Demand) × 100', target: '≥ 90.0%', actual: '92.4%', freq: 'Weekly', sub: 'Assessment Tax' },
    { code: 'TAX-02', name: 'Cumulative Arrears Recovery', formula: '(Arrears Recovered / Total Arrears) × 100', target: '≥ 35.0%', actual: '38.2%', freq: 'Monthly', sub: 'Assessment Tax' },
    { code: 'TAX-03', name: 'e-Payment Digital Channel Adoption', formula: '(Online Payments / Total Payments) × 100', target: '≥ 65.0%', actual: '71.5%', freq: 'Monthly', sub: 'Assessment Tax' },
    { code: 'FB-01', name: 'Public Complaint SLA Compliance', formula: '(Tickets within SLA / Total Tickets) × 100', target: '≥ 85.0%', actual: '88.4%', freq: 'Weekly', sub: 'Feedback' },
    { code: 'FB-02', name: 'Average Resolution Time (ART)', formula: 'Σ(T_resolve - T_log) / Resolved Tickets', target: '≤ 72.0 hrs', actual: '44.8 hrs', freq: 'Weekly', sub: 'Feedback' },
    { code: 'FB-03', name: 'First Contact Resolution (FCR)', formula: '(Resolved at First Contact / Total) × 100', target: '≥ 40.0%', actual: '46.2%', freq: 'Monthly', sub: 'Feedback' },
    { code: 'FB-04', name: 'Citizen Satisfaction Index (CSAT)', formula: 'Σ(Survey Scores) / (Responses × 5) × 100', target: '≥ 80.0%', actual: '84.5%', freq: 'Monthly', sub: 'Feedback' },
  ];

  const renderTrendsChart = () => {
    const commonProps = {
      data: dataSlice,
      children: [
        <CartesianGrid key="grid" stroke="rgba(255,255,255,0.04)" vertical={false} />,
        <XAxis key="x" dataKey="time" tick={{ fontSize: 10, fill: '#5a6178' }} tickLine={false} interval={Math.max(1, Math.floor(dataSlice.length / 10))} />,
        <YAxis key="y" domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#5a6178' }} tickLine={false} />,
        <Tooltip key="tip" contentStyle={{ background: '#1a1e28', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, color: '#e8eaf0' }} />,
        <Legend key="legend" wrapperStyle={{ fontSize: 11, color: '#8b92a5', paddingTop: 10 }} />,
      ],
    };

    if (chartType === 'area') {
      return (
        <ResponsiveContainer width="100%" height={360}>
          <AreaChart data={dataSlice}>
            <defs>
              <linearGradient id="availGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c997" stopOpacity="0.3" />
                <stop offset="95%" stopColor="#22c997" stopOpacity="0" />
              </linearGradient>
            </defs>
            {commonProps.children}
            <Area type="monotone" dataKey="availability" stroke="#22c997" fill="url(#availGrad)" strokeWidth={2} name="Fleet Availability %" />
            {showComparison && (
              <>
                <Area type="monotone" dataKey="sec" stroke="#3b82f6" fill="rgba(59,130,246,0.08)" strokeWidth={1.5} name="SEC (kWh/m²)" />
                <Area type="monotone" dataKey="cop" stroke="#f5a623" fill="rgba(245,166,35,0.08)" strokeWidth={1.5} name="Chiller COP" />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={dataSlice}>
          {commonProps.children}
          <Line type="monotone" dataKey="availability" stroke="#22c997" strokeWidth={2} dot={false} name="Fleet Availability %" />
          {showComparison && (
            <>
              <Line type="monotone" dataKey="sec" stroke="#3b82f6" strokeWidth={1.5} dot={false} name="SEC (kWh/m²)" />
              <Line type="monotone" dataKey="cop" stroke="#f5a623" strokeWidth={1.5} dot={false} name="Chiller COP" />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">{airportInfo.name} — Operational KPI & Analytics Engine</h1>
          <p className="page-subtitle">Evaluation baseline conforming to LTIA LBMS KPI Specs, Electrical SCADA distribution, and DBKU CIOC requirements</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => alert('Exporting Official KPI Audit Package (PDF / Excel)...')}>
            <Download size={14} /> Export KPI Report
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Strip */}
      <div className="scada-grid-5" style={{ marginBottom: 'var(--space-4)' }}>
        {summaryKpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="card p-3" style={{ borderLeft: `3px solid var(--accent-${kpi.color || 'teal'})` }}>
              <div className="flex justify-between items-start mb-1">
                <span className="text-3xs font-mono uppercase text-secondary">{kpi.label}</span>
                <Icon size={14} className={`text-${kpi.color || 'teal'}`} />
              </div>
              <div className="font-mono text-xl font-bold text-primary mb-1">{kpi.value}</div>
              <span className="text-3xs text-tertiary">{kpi.note}</span>
            </div>
          );
        })}
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-subtle mb-4 pb-2 flex-wrap">
        <button 
          id="tab-btn-trends"
          className={`btn btn-sm ${activeTab === 'trends' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('trends')}
        >
          <Activity size={13} /> Fleet Availability & SEC Trends
        </button>
        <button 
          id="tab-btn-lbms-kpis"
          className={`btn btn-sm ${activeTab === 'lbms_kpis' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('lbms_kpis')}
        >
          <Thermometer size={13} /> LBMS 27 KPI Suite (Official Spec)
        </button>
        <button 
          id="tab-btn-electrical-scada"
          className={`btn btn-sm ${activeTab === 'electrical_scada' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('electrical_scada')}
        >
          <Zap size={13} /> Electrical SCADA Distribution (1,613 Assets)
        </button>
        <button 
          id="tab-btn-dbku-kpis"
          className={`btn btn-sm ${activeTab === 'dbku_kpis' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('dbku_kpis')}
        >
          <Layers size={13} /> DBKU Smart City CIOC KPIs (3 Subsystems)
        </button>
      </div>

      {/* TAB 1: TRENDS & AVAILABILITY */}
      {activeTab === 'trends' && (
        <div className="card p-4">
          <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
            <div>
              <h2 className="text-sm font-bold font-mono text-primary m-0">Dynamic Availability vs Specific Energy Consumption</h2>
              <span className="text-2xs text-secondary">AIDX Flight sync correlation & HVAC thermal response</span>
            </div>
            <div className="flex gap-2 items-center">
              <div className="segmented-control">
                <button className={`control-btn ${chartType === 'area' ? 'active' : ''}`} onClick={() => setChartType('area')}>Area</button>
                <button className={`control-btn ${chartType === 'line' ? 'active' : ''}`} onClick={() => setChartType('line')}>Line</button>
              </div>
              <div className="segmented-control">
                {ranges.map(r => (
                  <button key={r} className={`control-btn ${timeRange === r ? 'active' : ''}`} onClick={() => setTimeRange(r)}>{r}</button>
                ))}
              </div>
            </div>
          </div>
          {renderTrendsChart()}
        </div>
      )}

      {/* TAB 2: OFFICIAL LBMS 27 KPI SUITE */}
      {activeTab === 'lbms_kpis' && (
        <div className="card p-4">
          <div className="mb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold font-mono text-primary m-0">LBMS Core KPI Evaluation Matrix (LBMS_KPI_Specification.xlsx)</h2>
              <span className="text-2xs text-secondary">Automated supervisory calculation engine per FRS requirements FR-11/12</span>
            </div>
            <span className="status-badge operational font-mono text-2xs">19/19 Core KPIs Within SLA</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="scada-table w-full" style={{ fontSize: '11px' }}>
              <thead>
                <tr className="text-tertiary text-left border-b border-subtle">
                  <th className="p-2">KPI ID</th>
                  <th className="p-2">Metric Name</th>
                  <th className="p-2">Mathematical Formula</th>
                  <th className="p-2">Target SLA</th>
                  <th className="p-2">Live Actual</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {lbmsKpis.map((kpi, idx) => (
                  <tr key={idx} className="border-b border-subtle hover:bg-elevated transition-colors">
                    <td className="p-2 font-mono font-bold text-teal">{kpi.id}</td>
                    <td className="p-2 font-medium text-primary">{kpi.name}</td>
                    <td className="p-2 font-mono text-secondary text-3xs">{kpi.formula}</td>
                    <td className="p-2 font-mono text-amber">{kpi.target}</td>
                    <td className="p-2 font-mono font-bold text-teal">{kpi.value}</td>
                    <td className="p-2">
                      <span className="status-badge operational font-mono text-3xs">
                        <span className="status-dot-sm" /> PASS
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ELECTRICAL SCADA POWER DISTRIBUTION */}
      {activeTab === 'electrical_scada' && (
        <div className="flex flex-col gap-4">
          <div className="scada-grid-4">
            <div className="card p-3">
              <span className="text-3xs font-mono text-secondary">TOTAL SCADA ASSETS</span>
              <div className="font-mono text-xl font-bold text-teal mt-1">{scadaElectrical.totalMonitoredAssets}</div>
              <span className="text-3xs text-tertiary">100% Monitored via OPC UA</span>
            </div>
            <div className="card p-3">
              <span className="text-3xs font-mono text-secondary">MV/LV SWITCHGEAR</span>
              <div className="font-mono text-xl font-bold text-primary mt-1">{scadaElectrical.vcbCount} VCB / {scadaElectrical.acbCount} ACB</div>
              <span className="text-3xs text-tertiary">33 Vacuum + 100 Air Circuit Breakers</span>
            </div>
            <div className="card p-3">
              <span className="text-3xs font-mono text-secondary">SUB-FEEDER MCCB FLEET</span>
              <div className="font-mono text-xl font-bold text-primary mt-1">{scadaElectrical.mccbCount} Units</div>
              <span className="text-3xs text-tertiary">Distribution Panels Across T1</span>
            </div>
            <div className="card p-3">
              <span className="text-3xs font-mono text-secondary">TRANSFORMERS & UPS</span>
              <div className="font-mono text-xl font-bold text-amber mt-1">{scadaElectrical.transformerCount} TR / {scadaElectrical.upsCount} UPS</div>
              <span className="text-3xs text-tertiary">32.5 MVA Grid Incomer Capacity</span>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-mono font-bold text-primary mb-2">Electrical Equipment Classification Breakdown (Operational screen.xlsx)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
              <div className="p-2.5 bg-elevated rounded border border-subtle">
                <div className="text-2xs text-secondary font-mono">Distribution Meters (DM)</div>
                <div className="text-base font-bold text-primary font-mono">{scadaElectrical.distributionMeterCount} Units</div>
                <div className="text-3xs text-tertiary">kWh & Power profiling per board</div>
              </div>
              <div className="p-2.5 bg-elevated rounded border border-subtle">
                <div className="text-2xs text-secondary font-mono">Power Meters (PM)</div>
                <div className="text-base font-bold text-primary font-mono">{scadaElectrical.powerMeterCount} Units</div>
                <div className="text-3xs text-tertiary">Main Incomer & Substation feeders</div>
              </div>
              <div className="p-2.5 bg-elevated rounded border border-subtle">
                <div className="text-2xs text-secondary font-mono">Power Factor Banks (PFC)</div>
                <div className="text-base font-bold text-teal font-mono">{scadaElectrical.powerFactorCorrectionBanks} Banks</div>
                <div className="text-3xs text-tertiary">Active cos φ: 0.98 (target ≥0.95)</div>
              </div>
              <div className="p-2.5 bg-elevated rounded border border-subtle">
                <div className="text-2xs text-secondary font-mono">Active Harmonic Filters</div>
                <div className="text-base font-bold text-teal font-mono">{scadaElectrical.activeHarmonicFilters} AHF</div>
                <div className="text-3xs text-tertiary">THD Current reduced to 2.8%</div>
              </div>
              <div className="p-2.5 bg-elevated rounded border border-subtle">
                <div className="text-2xs text-secondary font-mono">Protection Relays (PR)</div>
                <div className="text-base font-bold text-primary font-mono">{scadaElectrical.protectionRelays} Relays</div>
                <div className="text-3xs text-tertiary">Overcurrent, Earth-fault, Buchholz</div>
              </div>
              <div className="p-2.5 bg-elevated rounded border border-subtle">
                <div className="text-2xs text-secondary font-mono">Remote Display Units (RDU)</div>
                <div className="text-base font-bold text-primary font-mono">{scadaElectrical.remoteDisplayUnits} Units</div>
                <div className="text-3xs text-tertiary">Local switchroom annunciator panels</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DBKU SMART CITY CIOC KPIS */}
      {activeTab === 'dbku_kpis' && (
        <div className="card p-4">
          <div className="mb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold font-mono text-primary m-0">DBKU Smart City Subsystems KPI Catalog (DBKU 3 susbsystem kpi.csv)</h2>
              <span className="text-2xs text-secondary">CCTV Surveillance, Assessment Tax, and Citizen Feedback Engine</span>
            </div>
            <span className="status-badge operational font-mono text-2xs">CIOC POC Verified</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="scada-table w-full" style={{ fontSize: '11px' }}>
              <thead>
                <tr className="text-tertiary text-left border-b border-subtle">
                  <th className="p-2">Metric Code</th>
                  <th className="p-2">Subsystem</th>
                  <th className="p-2">Metric Name</th>
                  <th className="p-2">Mathematical Formula</th>
                  <th className="p-2">Target SLA</th>
                  <th className="p-2">Live Value</th>
                  <th className="p-2">Frequency</th>
                </tr>
              </thead>
              <tbody>
                {dbkuKpis.map((kpi, idx) => (
                  <tr key={idx} className="border-b border-subtle hover:bg-elevated transition-colors">
                    <td className="p-2 font-mono font-bold text-teal">{kpi.code}</td>
                    <td className="p-2 font-mono text-secondary">{kpi.sub}</td>
                    <td className="p-2 font-medium text-primary">{kpi.name}</td>
                    <td className="p-2 font-mono text-secondary text-3xs">{kpi.formula}</td>
                    <td className="p-2 font-mono text-amber">{kpi.target}</td>
                    <td className="p-2 font-mono font-bold text-teal">{kpi.actual}</td>
                    <td className="p-2 text-tertiary font-mono">{kpi.freq}</td>
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
