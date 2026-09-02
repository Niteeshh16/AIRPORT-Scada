import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { LiveDataProvider, useLiveData } from './context/LiveDataContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OpsPanel from './components/OpsPanel';
import InspectionPanel from './components/InspectionPanel';

import CommandCenter from './pages/CommandCenter';
import OperatorMode from './pages/OperatorMode';
import SupervisorMode from './pages/SupervisorMode';
import LiveMap from './pages/LiveMap';
import Subsystems from './pages/Subsystems';
import SubsystemDetail from './pages/SubsystemDetail';
import EquipmentExplorer from './pages/EquipmentExplorer';
import AlertsEvents from './pages/AlertsEvents';
import Analytics from './pages/Analytics';
import WorkOrders from './pages/WorkOrders';
import AssetManagement from './pages/AssetManagement';
import SOPManagement from './pages/SOPManagement';
import UserManagement from './pages/UserManagement';
const DigitalTwin = lazy(() => import('./pages/DigitalTwin'));

function AppContent() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const location = useLocation();
  const navigate = useNavigate();

  // Master Clock ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard Shortcuts (M: Map, A: Alerts, E: Equipment, O: Operator, S: Supervisor, Esc: Close)
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

      switch (e.key.toLowerCase()) {
        case 'd': navigate('/digital-twin'); break;
        case 'm': navigate('/map'); break;
        case 'a': navigate('/alerts'); break;
        case 'e': navigate('/equipment'); break;
        case 'o': navigate('/operator-mode'); break;
        case 's': navigate('/supervisor-mode'); break;
        case 'escape': setSelectedEquipment(null); break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);

  const handleSelectEquipment = useCallback((eq) => {
    setSelectedEquipment(eq);
  }, []);

  const handleCloseInspection = useCallback(() => {
    setSelectedEquipment(null);
  }, []);

  const getModuleName = () => {
    const path = location.pathname;
    if (path === '/' || path === '/command-center') return 'Command Center';
    if (path === '/operator-mode') return 'Operator Cockpit';
    if (path === '/supervisor-mode') return 'Supervisor Observability';
    if (path === '/map') return 'Live Building Map';
    if (path === '/subsystems') return 'Building Subsystems';
    if (path.startsWith('/subsystems/')) return 'Subsystem Detail';
    if (path === '/equipment') return 'Equipment Explorer';
    if (path === '/alerts') return 'Alerts & Events';
    if (path === '/analytics') return 'Analytics & Trends';
    if (path === '/work-orders') return 'Work Orders';
    if (path === '/assets') return 'Asset Management';
    if (path === '/sop') return 'SOP Management';
    if (path === '/users') return 'User Management';
    if (path === '/digital-twin') return 'Airport Digital Twin 3D';
    return 'SCADA Control';
  };

  return (
    <div className="app-layout">
      {/* Left Navigation Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main SCADA Workspace */}
      <div className="app-main">
        <Header
          currentTime={currentTime}
          moduleName={getModuleName()}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <div className="app-content-wrapper flex flex-1 overflow-hidden">
          <div className="app-content flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<CommandCenter onSelectEquipment={handleSelectEquipment} />} />
              <Route path="/command-center" element={<CommandCenter onSelectEquipment={handleSelectEquipment} />} />
              <Route path="/operator-mode" element={<OperatorMode onSelectEquipment={handleSelectEquipment} />} />
              <Route path="/operator" element={<OperatorMode onSelectEquipment={handleSelectEquipment} />} />
              <Route path="/supervisor-mode" element={<SupervisorMode />} />
              <Route path="/supervisor" element={<SupervisorMode />} />
              <Route path="/map" element={<LiveMap onSelectEquipment={handleSelectEquipment} />} />
              <Route path="/subsystems" element={<Subsystems />} />
              <Route path="/subsystems/:id" element={<SubsystemDetail onSelectEquipment={handleSelectEquipment} />} />
              <Route path="/equipment" element={<EquipmentExplorer onSelectEquipment={handleSelectEquipment} />} />
              <Route path="/alerts" element={<AlertsEvents />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/work-orders" element={<WorkOrders />} />
              <Route path="/assets" element={<AssetManagement onSelectEquipment={handleSelectEquipment} />} />
              <Route path="/sop" element={<SOPManagement />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/digital-twin" element={
                <Suspense fallback={<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',color:'#38bdf8',fontFamily:'monospace',fontSize:13,letterSpacing:2}}>Loading 3D Scene...</div>}>
                  <DigitalTwin />
                </Suspense>
              } />
            </Routes>
          </div>

          {/* Right-Side SCADA Operations Panel */}
          <OpsPanel />
        </div>
      </div>

      {/* Slide-In Equipment Detail Inspection Panel */}
      <InspectionPanel
        equipment={selectedEquipment}
        onClose={handleCloseInspection}
      />
    </div>
  );
}

export default function App() {
  return (
    <LiveDataProvider>
      <AppContent />
    </LiveDataProvider>
  );
}
