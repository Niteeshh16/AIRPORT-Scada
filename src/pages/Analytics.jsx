import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart3, Download, Zap, Activity } from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';
import { TREND_DATA } from '../data/mockData';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend 
} from 'recharts';

export default function Analytics() {
  const { airportInfo } = useLiveData();
  const [timeRange, setTimeRange] = useState('24H');
  const [chartType, setChartType] = useState('area');
  const [showComparison, setShowComparison] = useState(true);

  const ranges = ['1H', '6H', '24H', '7D', '30D'];

  const dataSlice = timeRange === '1H' ? TREND_DATA.slice(-8) :
                    timeRange === '6H' ? TREND_DATA.slice(-24) :
                    timeRange === '7D' ? TREND_DATA.slice(-60) :
                    timeRange === '30D' ? TREND_DATA : TREND_DATA;

  // Calculate KPIs from data
  const availabilities = dataSlice.map(d => d.availability);
  const current = availabilities[availabilities.length - 1]?.toFixed(1);
  const avg = (availabilities.reduce((a, b) => a + b, 0) / availabilities.length).toFixed(1);
  const min = Math.min(...availabilities).toFixed(1);
  const max = Math.max(...availabilities).toFixed(1);
  const change = (availabilities[availabilities.length - 1] - availabilities[0]).toFixed(1);

  const kpis = [
    { label: 'Current Availability', value: `${current}%`, icon: change > 0 ? TrendingUp : TrendingDown, color: 'teal' },
    { label: 'Historical Average', value: `${avg}%`, icon: Minus, color: 'blue' },
    { label: 'Minimum Dip', value: `${min}%`, icon: TrendingDown, color: 'amber' },
    { label: 'Peak Capacity', value: `${max}%`, icon: TrendingUp, color: 'teal' },
    { label: 'Net 24H Delta', value: `${change > 0 ? '+' : ''}${change}%`, icon: change > 0 ? TrendingUp : TrendingDown, color: change > 0 ? 'teal' : 'red' },
  ];

  const renderChart = () => {
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
                <stop offset="5%" stopColor="#22c997" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c997" stopOpacity={0} />
              </linearGradient>
            </defs>
            {commonProps.children}
            <Area type="monotone" dataKey="availability" stroke="#22c997" fill="url(#availGrad)" strokeWidth={2} name="Fleet Availability %" />
            {showComparison && (
              <>
                <Area type="monotone" dataKey="ahu01" stroke="#3b82f6" fill="rgba(59,130,246,0.08)" strokeWidth={1.5} name="AHU-01 Temp (°C)" />
                <Area type="monotone" dataKey="ahu02" stroke="#f5a623" fill="rgba(245,166,35,0.08)" strokeWidth={1.5} name="AHU-02 Temp (°C)" />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={dataSlice}>
            {commonProps.children}
            <Bar dataKey="availability" fill="#22c997" radius={[2, 2, 0, 0]} name="Fleet Availability %" />
          </BarChart>
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
              <Line type="monotone" dataKey="ahu01" stroke="#3b82f6" strokeWidth={1.5} dot={false} name="AHU-01 Temp (°C)" />
              <Line type="monotone" dataKey="ahu02" stroke="#f5a623" strokeWidth={1.5} dot={false} name="AHU-02 Temp (°C)" />
              <Line type="monotone" dataKey="ahu03" stroke="#ef4444" strokeWidth={1.5} dot={false} name="AHU-03 Temp (°C)" />
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
          <h1 className="page-title">{airportInfo.name} — Trend & Availability Analytics</h1>
          <p className="page-subtitle">Long-term equipment availability, HVAC thermal efficiency, and electrical demand profiling</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => alert('Exporting SCADA CSV telemetry bundle...')}>
            <Download size={14} /> Export CSV / PDF
          </button>
        </div>
      </div>

      {/* KPI Cards Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className={`kpi-card ${kpi.color}`}>
              <div className="kpi-label">{kpi.label}</div>
              <div className="kpi-value font-mono" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {kpi.value}
                <Icon size={16} style={{ color: kpi.color === 'teal' ? 'var(--status-operational)' : kpi.color === 'red' ? 'var(--status-critical)' : 'var(--text-tertiary)' }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Chart Card */}
      <div className="chart-container">
        <div className="chart-header" style={{ flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <span className="chart-title flex items-center gap-2">
              <Activity size={16} className="text-teal" /> Equipment Availability vs Thermal Profiles
            </span>
            <button 
              className={`filter-chip ${showComparison ? 'active' : ''}`}
              onClick={() => setShowComparison(!showComparison)}
            >
              Overlay HVAC Multi-Zone
            </button>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            {/* Chart type pills */}
            <div className="time-range">
              {['area', 'line', 'bar'].map(t => (
                <button key={t} className={`time-range-btn ${chartType === t ? 'active' : ''}`} onClick={() => setChartType(t)}>
                  {t.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Time range selector */}
            <div className="time-range">
              {ranges.map(r => (
                <button key={r} className={`time-range-btn ${timeRange === r ? 'active' : ''}`} onClick={() => setTimeRange(r)}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {renderChart()}
      </div>

      {/* Power Demand Profiling */}
      <div className="chart-container" style={{ marginTop: 'var(--space-5)' }}>
        <div className="chart-header">
          <span className="chart-title flex items-center gap-2">
            <Zap size={16} className="text-teal" /> Substation Power Load & Electrical Demand (kW)
          </span>
          <span className="text-xs text-teal font-mono">Real-time SCADA Energy Monitor</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={dataSlice}>
            <defs>
              <linearGradient id="powerGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#5a6178' }} tickLine={false} interval={Math.max(1, Math.floor(dataSlice.length / 8))} />
            <YAxis tick={{ fontSize: 10, fill: '#5a6178' }} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1a1e28', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, color: '#e8eaf0' }} />
            <Area type="monotone" dataKey="power" stroke="#06b6d4" fill="url(#powerGrad)" strokeWidth={2} name="Total Power Load (kW)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
