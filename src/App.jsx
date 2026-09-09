import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { LiveDataProvider } from './context/LiveDataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TopNotificationBar from './components/TopNotificationBar';
import InspectionPanel from './components/InspectionPanel';
import LoginPage from './pages/LoginPage';

import CommandCenter from './pages/CommandCenter';
import OperatorMode from './pages/OperatorMode';
import SupervisorMode from './pages/SupervisorMode';
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
  const { currentUser, canAccess } = useAuth();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => window.innerWidth < 1280);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  // Window resize listener
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileSidebarOpen) setMobileSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileSidebarOpen]);

  // Master Clock ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      if (!currentUser) return;
      switch (e.key.toLowerCase()) {
        case 'd': navigate('/digital-twin'); break;
        case 'm': navigate('/'); break;
        case 'a': navigate('/alerts'); break;
        case 'e': navigate('/equipment'); break;
        case 'o': if (canAccess('/operator-mode')) navigate('/operator-mode'); break;
        case 's': if (canAccess('/supervisor-mode')) navigate('/supervisor-mode'); break;
        case 'escape':
          setSelectedEquipment(null);
          setMobileSidebarOpen(false);
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate, canAccess, currentUser]);

  const handleSelectEquipment = useCallback((eq) => setSelectedEquipment(eq), []);
  const handleCloseInspection = useCallback(() => setSelectedEquipment(null), []);

  const handleToggleSidebar = () => {
    if (window.innerWidth <= 1024) setMobileSidebarOpen(prev => !prev);
    else setSidebarCollapsed(prev => !prev);
  };

  // Show login page if not authenticated
  if (!currentUser) {
    return <LoginPage />;
  }

  const getModuleName = () => {
    const path = location.pathname;
    if (path === '/' || path === '/command-center') return 'Dashboard';
    if (path === '/operator-mode') return 'Operator Cockpit';
    if (path === '/supervisor-mode') return 'Supervisor Observability';
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

  const isDigitalTwin = location.pathname === '/digital-twin';
  const isCommandCenter = location.pathname === '/' || location.pathname === '/command-center';

  const GuardedRoute = ({ path, element }) => {
    if (!canAccess(path)) return <Navigate to="/" replace />;
    return element;
  };

  return (
    <div className="app-layout">
      <div
        className={`sidebar-backdrop ${mobileSidebarOpen ? 'active' : ''}`}
        onClick={() => setMobileSidebarOpen(false)}
      />

      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onToggle={handleToggleSidebar}
        currentUser={currentUser}
      />

      <div className="app-main">
        <Header
          currentTime={currentTime}
          moduleName={getModuleName()}
          onToggleSidebar={handleToggleSidebar}
          currentUser={currentUser}
        />

        {!isCommandCenter && (
          <TopNotificationBar onSelectEquipment={handleSelectEquipment} />
        )}

        <div className="app-content-wrapper flex flex-1 overflow-hidden" style={{ position: 'relative' }}>
          <div className={`app-content flex-1 overflow-y-auto ${isDigitalTwin || isCommandCenter ? 'full-bleed' : ''}`}>
            <Routes>
              <Route path="/" element={<CommandCenter onSelectEquipment={handleSelectEquipment} />} />
              <Route path="/command-center" element={<CommandCenter onSelectEquipment={handleSelectEquipment} />} />
              <Route path="/operator-mode" element={<GuardedRoute path="/operator-mode" element={<OperatorMode onSelectEquipment={handleSelectEquipment} />} />} />
              <Route path="/operator" element={<GuardedRoute path="/operator-mode" element={<OperatorMode onSelectEquipment={handleSelectEquipment} />} />} />
              <Route path="/supervisor-mode" element={<GuardedRoute path="/supervisor-mode" element={<SupervisorMode />} />} />
              <Route path="/supervisor" element={<GuardedRoute path="/supervisor-mode" element={<SupervisorMode />} />} />
              <Route path="/map" element={<Navigate to="/" replace />} />
              <Route path="/subsystems" element={<Subsystems />} />
              <Route path="/subsystems/:id" element={<SubsystemDetail onSelectEquipment={handleSelectEquipment} />} />
              <Route path="/equipment" element={<EquipmentExplorer onSelectEquipment={handleSelectEquipment} />} />
              <Route path="/alerts" element={<AlertsEvents />} />
              <Route path="/analytics" element={<GuardedRoute path="/analytics" element={<Analytics />} />} />
              <Route path="/work-orders" element={<GuardedRoute path="/work-orders" element={<WorkOrders />} />} />
              <Route path="/assets" element={<GuardedRoute path="/assets" element={<AssetManagement onSelectEquipment={handleSelectEquipment} />} />} />
              <Route path="/sop" element={<GuardedRoute path="/sop" element={<SOPManagement />} />} />
              <Route path="/users" element={<GuardedRoute path="/users" element={<UserManagement />} />} />
              <Route path="/digital-twin" element={
                <Suspense fallback={<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',color:'#38bdf8',fontFamily:'monospace',fontSize:13,letterSpacing:2}}>Loading 3D Scene...</div>}>
                  <DigitalTwin />
                </Suspense>
              } />
            </Routes>
          </div>
        </div>
      </div>

      <InspectionPanel equipment={selectedEquipment} onClose={handleCloseInspection} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LiveDataProvider>
        <AppContent />
      </LiveDataProvider>
    </AuthProvider>
  );
}
