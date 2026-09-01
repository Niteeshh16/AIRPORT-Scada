import React, { useState } from 'react';
import { X, TrendingUp, Play, Pause, RotateCcw, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TREND_DATA } from '../data/mockData';

export default function TrendAnalysisModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [range, setRange] = useState('24H');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1x');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(28);

  const kpiStats = [
    { label: 'CURRENT', value: '97.1%', color: '#f5a623' },
    { label: 'AVERAGE', value: '98.9%', color: '#ffffff' },
    { label: 'MIN', value: '92.8%', color: '#3b82f6' },
    { label: 'MAX', value: '102.5%', color: '#facc15' },
    { label: 'CHANGE', value: '+3.1%', color: '#22c997' },
  ];

  return (
    <div className="trend-modal-overlay" onClick={onClose}>
      <div className="trend-modal-box animate-slideInUp" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="trend-modal-header">
          <div className="flex items-center gap-3">
            <div className="trend-icon-box">
              <TrendingUp size={20} className="text-amber" />
            </div>
            <div>
              <h2 className="trend-title">Overall Equipment Availability — Trend Analysis</h2>
              <p className="trend-subtitle">All monitored LBMS equipment — ON/OFF vs TRIP/DISCONNECTED</p>
            </div>
          </div>
          <button className="trend-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* KPI Stats Strip */}
        <div className="trend-kpi-row">
          {kpiStats.map(stat => (
            <div key={stat.label} className="trend-kpi-chip">
              <span className="trend-kpi-label">{stat.label}</span>
              <span className="trend-kpi-val font-mono" style={{ color: stat.color }}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Time Control Bar */}
        <div className="trend-control-bar">
          {/* Time Range Pills */}
          <div className="trend-range-pills">
            {['1H', '24H', '7D', '30D', 'Custom'].map(t => (
              <button 
                key={t}
                className={`trend-pill ${range === t ? 'active' : ''}`}
                onClick={() => setRange(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <button className="trend-reset-btn" onClick={() => setRange('24H')}>
            <RotateCcw size={12} /> Reset zoom
          </button>

          {/* Playback Controls */}
          <div className="trend-playback-box">
            <button className="trend-play-btn" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause size={12} /> : <Play size={12} />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <div className="trend-speed-pills">
              {['0.25x', '0.5x', '1x', '2x', '4x'].map(s => (
                <button 
                  key={s} 
                  className={`speed-pill ${playbackSpeed === s ? 'active' : ''}`}
                  onClick={() => setPlaybackSpeed(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            <span className="trend-playback-time font-mono">27 Aug, 11:22 pm • 93%</span>
          </div>

          {/* Date Picker Button */}
          <div style={{ position: 'relative' }}>
            <button 
              className="trend-date-btn"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <Calendar size={13} />
              <span>22-08-2026 to 28-08-2026</span>
            </button>

            {/* Calendar Popover */}
            {showCalendar && (
              <div className="trend-calendar-popover animate-fadeIn">
                <div className="calendar-header">
                  <span>August, 2026</span>
                  <div className="flex gap-1">
                    <button className="cal-nav-btn"><ChevronLeft size={12} /></button>
                    <button className="cal-nav-btn"><ChevronRight size={12} /></button>
                  </div>
                </div>

                <div className="calendar-grid">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                    <span key={d} className="cal-day-header">{d}</span>
                  ))}
                  {[26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5].map((day, i) => (
                    <button 
                      key={i} 
                      className={`cal-day-cell ${day === selectedDate && i >= 32 ? 'selected' : ''}`}
                      onClick={() => { setSelectedDate(day); setShowCalendar(false); }}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                <div className="calendar-footer">
                  <button className="text-2xs text-secondary hover:underline" onClick={() => setShowCalendar(false)}>Clear</button>
                  <button className="text-2xs text-amber font-semibold hover:underline" onClick={() => { setSelectedDate(28); setShowCalendar(false); }}>Today</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Golden Line Chart */}
        <div className="trend-chart-area">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={TREND_DATA}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#8b92a5' }} tickLine={false} />
              <YAxis domain={[85, 105]} tick={{ fontSize: 10, fill: '#8b92a5' }} tickLine={false} unit="%" />
              <Tooltip contentStyle={{ background: '#1a1e28', border: '1px solid #f5a623', borderRadius: 8, fontSize: 12, color: '#ffffff' }} />
              <Line 
                type="monotone" 
                dataKey="availability" 
                stroke="#f5a623" 
                strokeWidth={2.5} 
                dot={{ r: 3, fill: '#f5a623' }}
                activeDot={{ r: 6, fill: '#ffffff', stroke: '#f5a623', strokeWidth: 2 }}
                name="Availability" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Range Drag Scrub Handle */}
        <div className="trend-scrub-box">
          <span className="trend-scrub-label">DRAG HANDLES TO RESIZE THE SELECTED RANGE</span>
          <div className="trend-scrub-track">
            <div className="trend-scrub-selection" style={{ left: '25%', width: '55%' }}>
              <div className="scrub-handle left" />
              <div className="scrub-handle right" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
