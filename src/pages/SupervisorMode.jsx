import React, { useState } from 'react';
import { 
  Shield, Activity, TrendingUp, AlertTriangle, CheckCircle2, 
  Clock, ArrowRight, Layers, ChevronRight
} from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';
import MultiFloorMapGrid from '../components/MultiFloorMapGrid';
import BottomOpsWidgets from '../components/BottomOpsWidgets';
import TrendAnalysisModal from '../components/TrendAnalysisModal';
import ModeSwitcherBar from '../components/ModeSwitcherBar';

export default function SupervisorMode() {
  const { subsystems, equipmentList, alerts, workOrders, scadaLogs } = useLiveData();
  const [selectedFloor, setSelectedFloor] = useState('1F');
  const [trendModalOpen, setTrendModalOpen] = useState(false);

  const supervisorKpis = [
    { title: 'OVERALL EQUIPMENT AVAILABILITY', value: '97.1%', target: '98%', yest: '97.5%', avg: '97.8%', status: 'warning', note: 'All monitored LBMS equipment — ON/OFF vs TRIP/DISCONNECTED' },
    { title: 'OVERALL DEVICE HEALTH', value: '97.8%', target: '98%', yest: '98%', avg: '98.1%', status: 'warning', note: 'Devices excluding TRIP/DISCONNECTED' },
    { title: 'OVERALL COMMUNICATION AVAILABILITY', value: '99.2%', target: '99%', yest: '99.3%', avg: '99.3%', status: 'operational', note: 'Devices not in DISCONNECTED state' },
    { title: 'AHU EQUIPMENT AVAILABILITY', value: '93.8%', target: '98%', yest: '94%', avg: '94.3%', status: 'warning', note: '198 of 208 AHUs ON/OFF (not TRIP)' },
    { title: 'PAU EQUIPMENT AVAILABILITY', value: '97.7%', target: '98%', yest: '97.9%', avg: '98%', status: 'operational', note: '1 PAU unit in TRIP state (GF)' },
    { title: 'MAU EQUIPMENT AVAILABILITY', value: '99.4%', target: '98%', yest: '99.3%', avg: '99.3%', status: 'operational', note: 'All MAU units ON/OFF, none TRIP/DISCONNECTED' },
    { title: 'CRAH EQUIPMENT AVAILABILITY', value: '93.9%', target: '98%', yest: '94.5%', avg: '95.2%', status: 'warning', note: '2/20 CRAH units offline — comm failure flagged' },
    { title: 'FCU EQUIPMENT AVAILABILITY', value: '99.6%', target: '98%', yest: '99.5%', avg: '98.5%', status: 'operational', note: '6 of 1,200 FCU units in fault' },
    { title: 'VAV EQUIPMENT AVAILABILITY', value: '99.1%', target: '98%', yest: '99%', avg: '99%', status: 'operational', note: 'All 280 VAV controllers reporting nominal' },
    { title: 'CHILLERS EQUIPMENT AVAILABILITY', value: '98.5%', target: '98%', yest: '98.4%', avg: '98.3%', status: 'operational', note: 'All chiller plant units ON/OFF, none TRIP' },
    { title: 'PLUMBING EQUIPMENT AVAILABILITY', value: '99.2%', target: '98%', yest: '99.1%', avg: '99.1%', status: 'operational', note: 'Hydraulic pumps + water meters — all reporting' },
    { title: 'FIRE FIGHTING INTERFACES AVAILABILITY', value: '100%', target: '98%', yest: '100%', avg: '100%', status: 'operational', note: 'FM200 + fire pumping/nitrogen interface — all ready' },
  ];

  return (
    <div className="supervisor-full-layout animate-fadeIn">
      {/* Top Mode Switcher matching Screenshot 4 */}
      <div style={{ marginBottom: '10px' }}>
        <ModeSwitcherBar activeMode="supervisor" />
      </div>

      {/* Main Column */}
      <div className="supervisor-main-col">
        {/* Top: 6-Floor Multi-Floor Map Grid (Screenshot 4) */}
        <div className="card p-3 mb-4">
          <div className="card-header py-1 px-2 mb-2 flex justify-between items-center">
            <span className="card-title text-xs font-mono font-bold uppercase flex items-center gap-2">
              <Layers size={14} className="text-teal" /> TERMINAL 1 MULTI-FLOOR AVAILABILITY MAP
            </span>
            <span className="text-2xs text-secondary font-mono">Zone 23 (1F) Active Fault Detected</span>
          </div>
          <MultiFloorMapGrid 
            selectedFloor={selectedFloor}
            onSelectFloor={f => setSelectedFloor(f)}
          />
        </div>

        {/* Bottom: 12 Subsystem Availability Cards (Screenshot 4) */}
        <div className="supervisor-kpi-matrix">
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-xs font-mono font-bold uppercase text-tertiary">KPI OVERVIEW & FLEET AVAILABILITY</span>
            <button 
              className="text-xs text-teal font-medium hover:underline flex items-center gap-1"
              onClick={() => setTrendModalOpen(true)}
            >
              <TrendingUp size={13} /> Open Availability Trend Analysis →
            </button>
          </div>

          <div className="scada-grid-6">
            {supervisorKpis.map((kpi, idx) => (
              <div 
                key={idx} 
                className={`supervisor-kpi-card ${kpi.status}`}
                onClick={() => setTrendModalOpen(true)}
                title="Click to view detailed Trend Analysis"
              >
                <div className="kpi-card-top">
                  <span className="kpi-card-title truncate">{kpi.title}</span>
                  <span className={`kpi-status-icon ${kpi.status}`}>
                    {kpi.status === 'warning' ? '▲' : '✓'}
                  </span>
                </div>

                <div className={`kpi-big-value font-mono ${kpi.status}`}>
                  {kpi.value}
                </div>

                {/* Target / Yest / 7D Avg stats */}
                <div className="kpi-stat-strip">
                  <div>
                    <span className="kpi-stat-label">TARGET</span>
                    <span className="kpi-stat-val font-mono">{kpi.target}</span>
                  </div>
                  <div>
                    <span className="kpi-stat-label">YEST</span>
                    <span className="kpi-stat-val font-mono">{kpi.yest}</span>
                  </div>
                  <div>
                    <span className="kpi-stat-label">7D AVG</span>
                    <span className="kpi-stat-val font-mono">{kpi.avg}</span>
                  </div>
                </div>

                {/* Sparkline fill bar */}
                <div className="kpi-sparkline-track">
                  <div 
                    className={`kpi-sparkline-fill ${kpi.status}`} 
                    style={{ width: kpi.value }}
                  />
                </div>

                <div className="kpi-note-text truncate">{kpi.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Alerts, Event Logs, Components, Work Orders (Screenshot 4) */}
      <div className="supervisor-side-col">
        {/* Last Data Received */}
        <div className="card p-2.5 mb-3 flex justify-between items-center">
          <span className="text-2xs text-tertiary uppercase font-mono font-bold flex items-center gap-1.5">
            <span className="live-dot-badge" style={{ width: 6, height: 6 }} /> LAST DATA RECEIVED
          </span>
          <span className="font-mono text-xs text-secondary">4s ago</span>
        </div>

        {/* Alert Notifications */}
        <div className="card p-3 mb-3">
          <div className="card-header py-1 px-2 mb-2 flex justify-between items-center">
            <span className="card-title text-2xs font-mono font-bold uppercase flex items-center gap-1">
              <AlertTriangle size={12} className="text-amber" /> ALERT NOTIFICATIONS
            </span>
            <span className="alert-count-badge pulse-badge">3</span>
          </div>

          <div className="flex flex-col gap-2">
            {[
              { id: 'UC-LBMS-35', level: 'HIGH', loc: 'Terminal 1 — Departure Hall Zone 03', msg: 'HVAC off-line, thermal compliance breach' },
              { id: 'UC-LBMS-36', level: 'HIGH', loc: 'Pier B — Boarding Zone 08', msg: 'CO2 level 1240 ppm in Zone 08 — IAQ threshold exceeded' },
              { id: 'UC-LBMS-34', level: 'MEDIUM', loc: 'Terminal 2 — Check-in Zone', msg: 'Return air temp deviation +2.8°C' },
            ].map(al => (
              <div key={al.id} className="side-alert-card">
                <div className="flex justify-between items-center text-2xs">
                  <span className="font-mono text-amber font-bold">{al.id}</span>
                  <span className="status-badge warning" style={{ fontSize: '8px', padding: '0 4px' }}>{al.level}</span>
                </div>
                <div className="text-xs font-semibold text-primary mt-0.5">{al.loc}</div>
                <div className="text-2xs text-tertiary mt-0.5">{al.msg}</div>
              </div>
            ))}
          </div>
        </div>

        {/* System & Event Logs */}
        <div className="card p-3 mb-3">
          <div className="card-header py-1 px-2 mb-2">
            <span className="card-title text-2xs font-mono font-bold uppercase">SYSTEM & EVENT LOGS</span>
          </div>
          <div className="font-mono text-2xs flex flex-col gap-1.5">
            {scadaLogs.slice(0, 4).map(l => (
              <div key={l.id} className="bottom-log-row">
                <span className={`log-dot ${l.level}`} />
                <span className="log-msg text-primary flex-1 truncate">{l.msg}</span>
                <span className="log-time text-tertiary">{l.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Ops Widgets stacked vertically */}
        <div className="card p-3">
          <div className="card-header py-1 px-2 mb-2">
            <span className="card-title text-2xs font-mono font-bold uppercase">FLEET DISPATCH</span>
          </div>
          <div className="flex flex-col gap-2 text-xs">
            {workOrders.slice(0, 2).map(wo => (
              <div key={wo.id} className="bottom-wo-item">
                <div className="flex justify-between font-mono text-2xs">
                  <span className="text-teal font-bold">{wo.id}</span>
                  <span className="text-amber">{wo.priority}</span>
                </div>
                <div className="font-medium truncate text-primary text-xs">{wo.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Trend Analysis Modal Overlay (Screenshot 3) */}
      <TrendAnalysisModal 
        isOpen={trendModalOpen}
        onClose={() => setTrendModalOpen(false)}
      />
    </div>
  );
}
