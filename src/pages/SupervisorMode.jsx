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
    { title: 'OVERALL EQUIPMENT AVAILABILITY', value: '97.1%', target: '98%', yest: '97.5%', avg: '97.8%', status: 'warning', note: 'All monitored LBMS equipment — ON/OFF vs TRIP' },
    { title: 'OVERALL DEVICE HEALTH', value: '97.8%', target: '98%', yest: '98%', avg: '98.1%', status: 'warning', note: 'Devices excluding TRIP/DISCONNECTED' },
    { title: 'OVERALL COMMUNICATION AVAILABILITY', value: '99.2%', target: '99%', yest: '99.3%', avg: '99.3%', status: 'operational', note: 'BACnet / OPC-UA field devices' },
    { title: 'AHU EQUIPMENT AVAILABILITY', value: '93.8%', target: '98%', yest: '94%', avg: '94.3%', status: 'warning', note: '198 of 208 AHUs ON/OFF (not TRIP)' },
    { title: 'PAU EQUIPMENT AVAILABILITY', value: '97.7%', target: '98%', yest: '97.9%', avg: '98%', status: 'operational', note: '1 PAU unit in TRIP state (GF)' },
    { title: 'MAU EQUIPMENT AVAILABILITY', value: '99.4%', target: '98%', yest: '99.3%', avg: '99.3%', status: 'operational', note: 'All MAU units nominal' },
    { title: 'CRAH EQUIPMENT AVAILABILITY', value: '93.9%', target: '98%', yest: '94.5%', avg: '95.2%', status: 'warning', note: '2/20 CRAH units offline — comm flagged' },
    { title: 'FCU EQUIPMENT AVAILABILITY', value: '99.6%', target: '98%', yest: '99.5%', avg: '98.5%', status: 'operational', note: '6 of 1,200 FCU units in fault' },
    { title: 'VAV EQUIPMENT AVAILABILITY', value: '99.1%', target: '98%', yest: '99%', avg: '99%', status: 'operational', note: 'All 280 VAV controllers reporting nominal' },
    { title: 'CHILLERS EQUIPMENT AVAILABILITY', value: '98.5%', target: '98%', yest: '98.4%', avg: '98.3%', status: 'operational', note: 'All chiller plant units active' },
    { title: 'PLUMBING EQUIPMENT AVAILABILITY', value: '99.2%', target: '98%', yest: '99.1%', avg: '99.1%', status: 'operational', note: 'Hydraulic pumps + water meters' },
    { title: 'FIRE FIGHTING INTERFACES AVAILABILITY', value: '100%', target: '98%', yest: '100%', avg: '100%', status: 'operational', note: 'FM200 + fire pumping/nitrogen interface' },
  ];

  return (
    <div className="page animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}>
      {/* Top Mode Bar */}
      <ModeSwitcherBar activeMode="supervisor" />

      {/* Main 2-Column Supervisor Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: 'var(--s4)',
        alignItems: 'start'
      }}>
        {/* Left Column: Floor Map + 12 KPI Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}>
          {/* Multi-Floor Grid Map */}
          <div className="card" style={{ padding: 'var(--s4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--s3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Layers size={15} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>
                  Terminal 1 Multi-Floor Availability Map
                </span>
              </div>
              <span className="badge badge-warning">
                Zone 23 (1F) Active Fault Detected
              </span>
            </div>

            <div style={{
              background: 'var(--bg-app)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-md)', padding: 'var(--s3)'
            }}>
              <MultiFloorMapGrid
                selectedFloor={selectedFloor}
                onSelectFloor={f => setSelectedFloor(f)}
              />
            </div>
          </div>

          {/* 12 Subsystem KPI Availability Cards */}
          <div className="card" style={{ padding: 'var(--s4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--s4)' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Subsystem Fleet Availability SLAs (12 Systems)
              </span>
              <button
                className="btn btn-secondary btn-xs"
                onClick={() => setTrendModalOpen(true)}
                style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <TrendingUp size={12} />
                <span>Trend Analysis</span>
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 'var(--s3)'
            }}>
              {supervisorKpis.map((kpi, idx) => {
                const isWarn = kpi.status === 'warning';
                const statusColor = isWarn ? 'var(--yellow)' : 'var(--green)';

                return (
                  <div
                    key={idx}
                    onClick={() => setTrendModalOpen(true)}
                    style={{
                      background: 'var(--bg-app)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--r-md)',
                      padding: 'var(--s3)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--border-md)';
                      e.currentTarget.style.background = 'var(--bg-hover)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.background = 'var(--bg-app)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.04em' }}>
                        {kpi.title}
                      </span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, color: statusColor,
                        background: isWarn ? 'var(--yellow-bg)' : 'var(--green-bg)',
                        padding: '1px 5px', borderRadius: 'var(--r-sm)'
                      }}>
                        {isWarn ? 'WARN' : 'NOMINAL'}
                      </span>
                    </div>

                    <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--mono)', color: statusColor }}>
                      {kpi.value}
                    </div>

                    {/* Target / Yest / Avg stats */}
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', fontSize: 10,
                      color: 'var(--text-3)', fontFamily: 'var(--mono)'
                    }}>
                      <span>Target: <strong style={{ color: 'var(--text-2)' }}>{kpi.target}</strong></span>
                      <span>Yest: <strong style={{ color: 'var(--text-2)' }}>{kpi.yest}</strong></span>
                      <span>7D Avg: <strong style={{ color: 'var(--text-2)' }}>{kpi.avg}</strong></span>
                    </div>

                    {/* Progress Track */}
                    <div style={{ height: 4, background: 'var(--bg-overlay)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{
                        width: kpi.value, height: '100%',
                        background: statusColor, borderRadius: 2
                      }} />
                    </div>

                    <div style={{ fontSize: 10, color: 'var(--text-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {kpi.note}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Operations Widgets & Event Feeds */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}>
          <div className="card" style={{ padding: 'var(--s3) var(--s4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>
              Telemetry Sync Pulse
            </span>
            <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--green)' }}>
              00:03 ago • ONLINE
            </span>
          </div>

          <div className="card" style={{ padding: 'var(--s3)' }}>
            <BottomOpsWidgets />
          </div>
        </div>
      </div>

      {/* Trend Analysis Modal */}
      {trendModalOpen && (
        <TrendAnalysisModal
          isOpen={trendModalOpen}
          onClose={() => setTrendModalOpen(false)}
        />
      )}
    </div>
  );
}
