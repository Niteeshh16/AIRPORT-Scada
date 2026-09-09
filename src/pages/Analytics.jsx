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
  const [activeTab, setActiveTab] = useState('trends');
  const [timeRange, setTimeRange] = useState('24H');
  const [chartType, setChartType] = useState('area');
  const [showComparison, setShowComparison] = useState(true);

  const ranges = ['1H', '6H', '24H', '7D', '30D'];

  const dataSlice = timeRange === '1H' ? TREND_DATA.slice(-8) :
                    timeRange === '6H' ? TREND_DATA.slice(-24) :
                    timeRange === '7D' ? TREND_DATA.slice(-60) :
                    timeRange === '30D' ? TREND_DATA : TREND_DATA;

  const availabilities = dataSlice.map(d => d.availability);
  const current = availabilities[availabilities.length - 1]?.toFixed(1);
  const change = (availabilities[availabilities.length - 1] - availabilities[0]).toFixed(1);

  const summaryKpis = [
    { label: 'Fleet Availability', value: `${current}%`, icon: change > 0 ? TrendingUp : TrendingDown, color: 'green', note: 'Target ≥95.0%' },
    { label: 'Plant Efficiency', value: '0.58 kW/RT', icon: TrendingUp, color: 'blue', note: 'LBMS-KPI-E03 (Target ≤0.65)' },
    { label: 'Specific Energy (SEC)', value: '16.4 kWh/m²', icon: Minus, color: 'blue', note: 'LBMS-KPI-E02 (Target ≤18.5)' },
    { label: 'Power Factor (cos φ)', value: '0.98', icon: Zap, color: 'yellow', note: '12 PFC Banks Active' },
    { label: 'Harmonic THD', value: '2.8%', icon: CheckCircle2, color: 'green', note: '4 AHFs Active (<5% Limit)' },
  ];

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
        <CartesianGrid key="grid" stroke="rgba(255,255,255,0.06)" vertical={false} strokeDasharray="3 3" />,
        <XAxis key="x" dataKey="time" tick={{ fontSize: 10, fill: '#8b949e' }} tickLine={false} interval={Math.max(1, Math.floor(dataSlice.length / 10))} />,
        <YAxis key="y" domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#8b949e' }} tickLine={false} />,
        <Tooltip key="tip" contentStyle={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, fontSize: 12, color: '#f0f6fc' }} />,
        <Legend key="legend" wrapperStyle={{ fontSize: 11, color: '#8b949e', paddingTop: 12 }} />,
      ],
    };

    if (chartType === 'area') {
      return (
        <ResponsiveContainer width="100%" height={360}>
          <AreaChart data={dataSlice}>
            <defs>
              <linearGradient id="availGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3fb950" stopOpacity="0.3" />
                <stop offset="95%" stopColor="#3fb950" stopOpacity="0" />
              </linearGradient>
            </defs>
            {commonProps.children}
            <Area type="monotone" dataKey="availability" stroke="#3fb950" fill="url(#availGrad)" strokeWidth={2} name="Fleet Availability %" />
            {showComparison && (
              <>
                <Area type="monotone" dataKey="sec" stroke="#58a6ff" fill="rgba(88,166,255,0.06)" strokeWidth={1.5} name="SEC (kWh/m²)" />
                <Area type="monotone" dataKey="cop" stroke="#d29922" fill="rgba(210,153,34,0.06)" strokeWidth={1.5} name="Chiller COP" />
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
          <Line type="monotone" dataKey="availability" stroke="#3fb950" strokeWidth={2} dot={false} name="Fleet Availability %" />
          {showComparison && (
            <>
              <Line type="monotone" dataKey="sec" stroke="#58a6ff" strokeWidth={1.5} dot={false} name="SEC (kWh/m²)" />
              <Line type="monotone" dataKey="cop" stroke="#d29922" strokeWidth={1.5} dot={false} name="Chiller COP" />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="page animate-fadeIn">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{airportInfo.name} — Operational KPI & Analytics</h1>
          <p className="page-subtitle">
            Long Thanh International Airport (LTIA) • Conforming to LBMS KPI Specs & Electrical SCADA Distribution
          </p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => alert('Exporting Official KPI Audit Package (PDF / Excel)...')}
          >
            <Download size={14} /> Export KPI Report
          </button>
        </div>
      </div>

      {/* Primary KPI Strip */}
      <div className="stat-grid stat-grid-5" style={{ marginBottom: 'var(--s5)' }}>
        {summaryKpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="stat-card">
              <div className={`stat-icon ${kpi.color}`}>
                <Icon size={16} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{kpi.value}</div>
                <div className="stat-label">{kpi.label}</div>
                <div className="stat-note">{kpi.note}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 'var(--s4)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--s3)', flexWrap: 'wrap' }}>
        {[
          { id: 'trends', label: 'Fleet Availability & SEC Trends', icon: Activity },
          { id: 'lbms_kpis', label: 'LBMS 27 KPI Suite (Official Spec)', icon: Thermometer },
          { id: 'electrical_scada', label: 'Electrical SCADA Distribution (1,613 Assets)', icon: Zap },
          { id: 'dbku_kpis', label: 'DBKU Smart City CIOC KPIs', icon: Layers },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <Icon size={13} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: TRENDS */}
      {activeTab === 'trends' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--s4)', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>
                Fleet Availability vs Specific Energy Consumption
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                Real-time correlation with AIDX flight schedule & passenger loading
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ display: 'flex', background: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 2 }}>
                <button
                  onClick={() => setChartType('area')}
                  className={`btn btn-xs ${chartType === 'area' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ fontSize: 11 }}
                >
                  Area
                </button>
                <button
                  onClick={() => setChartType('line')}
                  className={`btn btn-xs ${chartType === 'line' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ fontSize: 11 }}
                >
                  Line
                </button>
              </div>

              <div style={{ display: 'flex', background: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 2 }}>
                {ranges.map(r => (
                  <button
                    key={r}
                    onClick={() => setTimeRange(r)}
                    className={`btn btn-xs ${timeRange === r ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ fontSize: 11 }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {renderTrendsChart()}
        </div>
      )}

      {/* TAB 2: LBMS 27 KPIS */}
      {activeTab === 'lbms_kpis' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: 'var(--s4) var(--s5)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>
                LBMS Core KPI Evaluation Matrix
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                Conforming to FRS Specification (LBMS_KPI_Specification.xlsx)
              </div>
            </div>
            <span className="badge badge-operational">19/19 Within Target SLA</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>KPI ID</th>
                  <th>Metric Name</th>
                  <th>Formula</th>
                  <th>Target SLA</th>
                  <th>Live Actual</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {lbmsKpis.map((kpi, idx) => (
                  <tr key={idx}>
                    <td style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--accent)' }}>{kpi.id}</td>
                    <td style={{ fontWeight: 500, color: 'var(--text-1)' }}>{kpi.name}</td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-3)' }}>{kpi.formula}</td>
                    <td style={{ fontFamily: 'var(--mono)', color: 'var(--yellow)' }}>{kpi.target}</td>
                    <td style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--green)' }}>{kpi.value}</td>
                    <td>
                      <span className="badge badge-operational">PASS</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ELECTRICAL SCADA */}
      {activeTab === 'electrical_scada' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}>
          <div className="stat-grid stat-grid-4">
            <div className="stat-card">
              <div className="stat-icon blue"><Zap size={16} /></div>
              <div className="stat-content">
                <div className="stat-value">{scadaElectrical.totalMonitoredAssets}</div>
                <div className="stat-label">Total SCADA Assets</div>
                <div className="stat-note">100% Monitored via OPC-UA</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green"><Activity size={16} /></div>
              <div className="stat-content">
                <div className="stat-value">{scadaElectrical.vcbCount} VCB / {scadaElectrical.acbCount} ACB</div>
                <div className="stat-label">MV/LV Switchgear Breakers</div>
                <div className="stat-note">Vacuum & Air Circuit Breakers</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon yellow"><Layers size={16} /></div>
              <div className="stat-content">
                <div className="stat-value">{scadaElectrical.mccbCount} Units</div>
                <div className="stat-label">Sub-Feeder MCCBs</div>
                <div className="stat-note">Substation Distribution Panels</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon purple"><Zap size={16} /></div>
              <div className="stat-content">
                <div className="stat-value">{scadaElectrical.transformerCount} TR / {scadaElectrical.upsCount} UPS</div>
                <div className="stat-label">Transformers & Redundant UPS</div>
                <div className="stat-note">32.5 MVA Incomer Capacity</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', marginBottom: 'var(--s3)' }}>
              Electrical Telemetry Nodes Breakdown (Operational screen.xlsx)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--s3)' }}>
              {[
                { name: 'Distribution Meters (DM)', val: `${scadaElectrical.distributionMeterCount} Units`, note: 'kWh & power profiling per board' },
                { name: 'Power Meters (PM)', val: `${scadaElectrical.powerMeterCount} Units`, note: 'Main Incomer & Substation feeders' },
                { name: 'Power Factor Banks (PFC)', val: `${scadaElectrical.powerFactorCorrectionBanks} Banks`, note: 'Active cos φ: 0.98 (target ≥0.95)' },
                { name: 'Active Harmonic Filters (AHF)', val: `${scadaElectrical.activeHarmonicFilters} AHF`, note: 'THD Current reduced to 2.8%' },
                { name: 'Protection Relays (PR)', val: `${scadaElectrical.protectionRelays} Relays`, note: 'Overcurrent, Earth-fault, Buchholz' },
                { name: 'Remote Display Units (RDU)', val: `${scadaElectrical.remoteDisplayUnits} Units`, note: 'Local switchroom annunciator panels' },
              ].map((item, idx) => (
                <div key={idx} style={{
                  background: 'var(--bg-app)', border: '1px solid var(--border)',
                  borderRadius: 'var(--r-md)', padding: 'var(--s3)'
                }}>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{item.name}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', fontFamily: 'var(--mono)', margin: '4px 0' }}>
                    {item.val}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{item.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DBKU SMART CITY CIOC KPIS */}
      {activeTab === 'dbku_kpis' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: 'var(--s4) var(--s5)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>
                DBKU Smart City Subsystems KPI Catalog
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                CCTV Surveillance, Assessment Tax, and Citizen Feedback Engine (DBKU 3 subsystem kpi.csv)
              </div>
            </div>
            <span className="badge badge-operational">CIOC Conforming</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Subsystem</th>
                  <th>Metric Name</th>
                  <th>Formula</th>
                  <th>Target SLA</th>
                  <th>Live Value</th>
                  <th>Frequency</th>
                </tr>
              </thead>
              <tbody>
                {dbkuKpis.map((kpi, idx) => (
                  <tr key={idx}>
                    <td style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--accent)' }}>{kpi.code}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-2)' }}>{kpi.sub}</td>
                    <td style={{ fontWeight: 500, color: 'var(--text-1)' }}>{kpi.name}</td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-3)' }}>{kpi.formula}</td>
                    <td style={{ fontFamily: 'var(--mono)', color: 'var(--yellow)' }}>{kpi.target}</td>
                    <td style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--green)' }}>{kpi.actual}</td>
                    <td style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>{kpi.freq}</td>
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
