import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  AIRPORT_INFO, 
  FLOORS, 
  SUBSYSTEMS as INITIAL_SUBSYSTEMS, 
  RAW_EQUIPMENT, 
  ALERTS as INITIAL_ALERTS, 
  WORK_ORDERS as INITIAL_WORK_ORDERS,
  LBMS_KPIS,
  SCADA_ELECTRICAL_SUMMARY,
  AODB_FLIGHTS
} from '../data/mockData';

const LiveDataContext = createContext();

export function LiveDataProvider({ children }) {
  const [tick, setTick] = useState(0);
  const [mode, setMode] = useState('standard'); // 'standard' | 'operator' | 'supervisor'
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [opsPanelOpen, setOpsPanelOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState('GF');

  // Real-time equipment state
  const [equipmentList, setEquipmentList] = useState(() =>
    RAW_EQUIPMENT.map(e => ({
      ...e,
      temp: e._temp,
      supplyTemp: e._supplyTemp,
      returnTemp: e._returnTemp,
      fanRPM: e._fanRPM,
      airPressure: e._airPressure,
      coolingValve: e._coolingValve,
      power: e._power,
      voltage: e._voltage || null,
      current: e._current || null,
      powerFactor: e._powerFactor || null,
      shutterState: e._shutterState || null,
      health: e._health,
      mode: e._mode,
      comm: e._comm,
      status: e.status,
      lastUpdate: e._lastUpdate,
      setpoint: e._setpoint,
    }))
  );

  // Real-time alerts
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);

  // Real-time work orders
  const [workOrders, setWorkOrders] = useState(INITIAL_WORK_ORDERS);

  // Real-time LBMS KPIs & SCADA metrics
  const [lbmsKpis, setLbmsKpis] = useState(LBMS_KPIS);
  const [scadaElectrical, setScadaElectrical] = useState(SCADA_ELECTRICAL_SUMMARY);
  const [flightSchedules, setFlightSchedules] = useState(AODB_FLIGHTS);

  // Real-time SCADA telemetry & protocols
  const [scadaMetrics, setScadaMetrics] = useState({
    packetRate: 1428,
    latency: 12,
    modbusLatency: 8,
    opcLatency: 14,
    bacnetLatency: 9,
    mqttLatency: 6,
    activeNodes: 3545, // Total 1,932 LBMS + 1,613 SCADA assets
    onlineNodes: 3476,
    bufferUsage: 34,
    flightSyncAge: 12, // seconds ago (FRS FR-14/15 requires 30-60s sync)
    lastSync: new Date().toLocaleTimeString(),
  });

  // Real-time SCADA event log stream
  const [scadaLogs, setScadaLogs] = useState([
    { id: 'log-1', time: '13:02:15', protocol: 'OPC UA', device: 'AHU-GF-001', msg: 'High return air temp (28.6°C > 26.0°C) - Alarm published to HBMS', level: 'critical' },
    { id: 'log-2', time: '13:02:08', protocol: 'OPC UA', device: 'CONV-BHS-03', msg: 'BHS Motor overload trip - Fire Shutter SHTR-BHS-FS01 closed for safety', level: 'critical' },
    { id: 'log-3', time: '13:01:55', protocol: 'BACnet', device: 'FAS-1F-ZONE01', msg: 'Life Safety supervisory heartbeat ACK (0 lost packets)', level: 'info' },
    { id: 'log-4', time: '13:01:40', protocol: 'RabbitMQ', device: 'GATE-01', msg: 'AGAC Boarding Gate G1 passenger passage telemetry packet received', level: 'info' },
    { id: 'log-5', time: '13:01:22', protocol: 'REST via IB', device: 'AODB-FIS-SYNC', msg: 'AIDX flight schedule 24-hr matrix synced to LBMS (Next sync in 30s)', level: 'info' },
  ]);

  // Dynamic simulation tick (runs every 2.5s)
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);

      // 1. Fluctuating equipment telemetry values
      setEquipmentList(prev => prev.map(eq => {
        if (eq.status === 'offline') return eq;

        const tempDrift = eq.temp !== null ? +(eq.temp + (Math.random() - 0.5) * 0.4).toFixed(1) : null;
        const returnTempDrift = eq.returnTemp !== null ? +(eq.returnTemp + (Math.random() - 0.5) * 0.3).toFixed(1) : null;
        const rpmDrift = eq.fanRPM !== null ? Math.round(eq.fanRPM + (Math.random() - 0.5) * 18) : null;
        const pressureDrift = eq.airPressure !== null ? Math.round(eq.airPressure + (Math.random() - 0.5) * 4) : null;
        const powerDrift = eq.power !== null ? +(eq.power + (Math.random() - 0.5) * 0.8).toFixed(1) : null;
        const valveDrift = eq.coolingValve !== null ? Math.min(100, Math.max(0, Math.round(eq.coolingValve + (Math.random() - 0.5) * 2))) : null;
        const voltageDrift = eq.voltage !== null ? +(eq.voltage + (Math.random() - 0.5) * 1.5).toFixed(1) : null;
        const currentDrift = eq.current !== null ? +(eq.current + (Math.random() - 0.5) * 3.0).toFixed(1) : null;
        const pfDrift = eq.powerFactor !== null ? +(Math.min(0.99, Math.max(0.95, eq.powerFactor + (Math.random() - 0.5) * 0.01))).toFixed(2) : null;

        return {
          ...eq,
          temp: tempDrift,
          returnTemp: returnTempDrift,
          fanRPM: rpmDrift,
          airPressure: pressureDrift,
          power: powerDrift,
          voltage: voltageDrift,
          current: currentDrift,
          powerFactor: pfDrift,
          coolingValve: valveDrift,
          lastUpdate: `${Math.floor(Math.random() * 4) + 1}s ago`,
        };
      }));

      // 2. Fluctuating SCADA metrics
      setScadaMetrics(prev => {
        const nextSyncAge = (prev.flightSyncAge + 2) % 35;
        return {
          packetRate: Math.round(1400 + Math.random() * 80),
          latency: Math.round(10 + Math.random() * 5),
          modbusLatency: Math.round(7 + Math.random() * 3),
          opcLatency: Math.round(14 + Math.random() * 4),
          bacnetLatency: Math.round(8 + Math.random() * 3),
          mqttLatency: Math.round(5 + Math.random() * 3),
          activeNodes: 3545,
          onlineNodes: 3476 + Math.round((Math.random() - 0.5) * 6),
          bufferUsage: Math.round(32 + Math.random() * 6),
          flightSyncAge: nextSyncAge,
          lastSync: new Date().toLocaleTimeString(),
        };
      });

      // 3. Occasional SCADA event streaming log injection
      if (Math.random() > 0.55) {
        const protocols = ['OPC UA', 'BACnet/IP', 'REST via IB', 'RabbitMQ', 'Bodet NMS'];
        const sampleDevices = [
          'AHU-GF-002', 'VCB-MV-22KV-01', 'TR-11-22KV-0.4KV', 'CRAH-GF-01', 
          'VDGS-ST-18', 'SACS-1F-01', 'FAS-1F-ZONE01', 'CONV-BHS-01', 'CHW-PIT-01'
        ];
        const sampleMsgs = [
          'OPC UA telemetry tag publish ACK received (<5s latency per FRS)',
          'BACnet Life Safety point object state verified: Normal',
          'Chilled water primary delta T stabilized at 5.8°C (target ≥5.5°C)',
          'Active Harmonic Filter (AHF-01) mitigated THD to 2.8%',
          'Power Factor Correction (PFC) stage 8 engaged: cos φ = 0.98',
          'AODB flight schedule AIDX XML sync broadcast to LBMS verified',
          'SACS Door portal heartbeat online: zero access anomalies',
          'CRAH telecom server vault temp 20.2°C complies with 100% SLA',
        ];
        const newLog = {
          id: `log-${Date.now()}`,
          time: new Date().toLocaleTimeString('en-US', { hour12: false }),
          protocol: protocols[Math.floor(Math.random() * protocols.length)],
          device: sampleDevices[Math.floor(Math.random() * sampleDevices.length)],
          msg: sampleMsgs[Math.floor(Math.random() * sampleMsgs.length)],
          level: 'info',
        };
        setScadaLogs(logs => [newLog, ...logs.slice(0, 19)]);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Equipment control actions
  const toggleEquipmentPower = useCallback((eqId) => {
    setEquipmentList(prev => prev.map(eq => {
      if (eq.id !== eqId) return eq;
      const isRunning = eq.mode !== 'Stop' && eq.status !== 'offline';
      return {
        ...eq,
        mode: isRunning ? 'Stop' : 'Auto',
        fanRPM: isRunning ? 0 : 1200,
        power: isRunning ? 0.2 : 32.5,
        status: isRunning ? 'warning' : 'operational',
      };
    }));

    const newLog = {
      id: `log-${Date.now()}`,
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      protocol: 'HBMS Supervisory',
      device: eqId,
      msg: `Operator commanded RUN/STOP toggle on device ${eqId}`,
      level: 'warning',
    };
    setScadaLogs(logs => [newLog, ...logs]);
  }, []);

  const setEquipmentMode = useCallback((eqId, newMode) => {
    setEquipmentList(prev => prev.map(eq => (eq.id === eqId ? { ...eq, mode: newMode } : eq)));
  }, []);

  const adjustSetpoint = useCallback((eqId, delta) => {
    setEquipmentList(prev => prev.map(eq => {
      if (eq.id !== eqId || eq.setpoint === null) return eq;
      const newSp = +(eq.setpoint + delta).toFixed(1);
      return { ...eq, setpoint: newSp };
    }));
  }, []);

  // Alert actions
  const acknowledgeAlert = useCallback((alertId) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true, assignee: 'Duty Operator' } : a));
    const targetAlert = alerts.find(a => a.id === alertId);
    if (targetAlert) {
      setScadaLogs(logs => [{
        id: `log-${Date.now()}`,
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        protocol: 'Alarm Manager',
        device: targetAlert.equipment,
        msg: `Alarm ${alertId} acknowledged per SOP guidelines by Operator`,
        level: 'info'
      }, ...logs]);
    }
  }, [alerts]);

  const resolveAlert = useCallback((alertId) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  }, []);

  // Work order creation
  const createWorkOrder = useCallback((data) => {
    const newWo = {
      id: `WO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: data.title || 'Corrective Maintenance Action',
      priority: data.priority || 'high',
      status: 'Assigned',
      assignee: data.assignee || 'Thanh Nguyen',
      equipment: data.equipment || 'AHU-GF-001',
      created: 'Just now',
      due: 'Today (within SLA)'
    };
    setWorkOrders(prev => [newWo, ...prev]);
    return newWo;
  }, []);

  // Calculated dynamic Subsystems preserving authentic catalog totals
  const dynamicSubsystems = INITIAL_SUBSYSTEMS.map(sub => {
    const subEqs = equipmentList.filter(e => e.system === sub.id);
    if (subEqs.length === 0) return sub;

    // Detect if any sample node in this subsystem is critical or warning
    const sampleCrit = subEqs.filter(e => e.status === 'critical').length;
    const sampleWarn = subEqs.filter(e => e.status === 'warning').length;

    // Adjust critical/warning based on active alerts
    const activeCritAlerts = alerts.filter(a => a.system === sub.id && a.severity === 'critical').length;
    const activeWarnAlerts = alerts.filter(a => a.system === sub.id && (a.severity === 'high' || a.severity === 'medium')).length;

    const critical = Math.max(sampleCrit, activeCritAlerts);
    const warnings = Math.max(sampleWarn, activeWarnAlerts, sub.warnings);
    const operational = Math.max(0, sub.total - critical - warnings);
    const health = +((operational / sub.total) * 100).toFixed(1);

    let status = 'operational';
    if (critical > 0) status = 'critical';
    else if (warnings > 0) status = 'warning';

    return {
      ...sub,
      operational,
      warnings,
      critical,
      health,
      status,
      lastUpdate: '1s ago',
    };
  });

  const value = {
    tick,
    airportInfo: AIRPORT_INFO,
    floors: FLOORS,
    mode,
    setMode,
    soundEnabled,
    setSoundEnabled,
    opsPanelOpen,
    setOpsPanelOpen,
    selectedFloor,
    setSelectedFloor,
    equipmentList,
    alerts,
    workOrders,
    scadaMetrics,
    scadaLogs,
    subsystems: dynamicSubsystems,
    lbmsKpis,
    scadaElectrical,
    flightSchedules,
    toggleEquipmentPower,
    setEquipmentMode,
    adjustSetpoint,
    acknowledgeAlert,
    resolveAlert,
    createWorkOrder,
  };

  return (
    <LiveDataContext.Provider value={value}>
      {children}
    </LiveDataContext.Provider>
  );
}

export function useLiveData() {
  const context = useContext(LiveDataContext);
  if (!context) {
    throw new Error('useLiveData must be used within a LiveDataProvider');
  }
  return context;
}
