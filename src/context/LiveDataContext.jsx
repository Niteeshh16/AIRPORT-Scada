import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AIRPORT_INFO, FLOORS, SUBSYSTEMS as INITIAL_SUBSYSTEMS, RAW_EQUIPMENT, ALERTS as INITIAL_ALERTS, WORK_ORDERS as INITIAL_WORK_ORDERS } from '../data/mockData';

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

  // Real-time SCADA telemetry & protocols
  const [scadaMetrics, setScadaMetrics] = useState({
    packetRate: 1428,
    latency: 12,
    modbusLatency: 8,
    opcLatency: 15,
    mqttLatency: 6,
    activeNodes: 120,
    onlineNodes: 117,
    bufferUsage: 34,
    lastSync: new Date().toLocaleTimeString(),
  });

  // Real-time SCADA event log stream
  const [scadaLogs, setScadaLogs] = useState([
    { id: 'log-1', time: '11:42:15', protocol: 'BACnet', device: 'AHU-310-GF-EXT1', msg: 'High temp alert threshold tripped (28.6°C > 26.0°C)', level: 'critical' },
    { id: 'log-2', time: '11:42:08', protocol: 'Modbus', device: 'CONV-BHS-03', msg: 'VFD Overcurrent fault registered on Motor M3', level: 'critical' },
    { id: 'log-3', time: '11:41:55', protocol: 'OPC-UA', device: 'CHW-102-GF', msg: 'Condenser water pressure high (3.8 bar)', level: 'warning' },
    { id: 'log-4', time: '11:41:40', protocol: 'MQTT', device: 'GATE-01', msg: 'Passenger biometric validation packet received', level: 'info' },
    { id: 'log-5', time: '11:41:22', protocol: 'BACnet', device: 'AHU-311-GF-EXT2', msg: 'VAV damper modulation commanded to 45%', level: 'info' },
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

        return {
          ...eq,
          temp: tempDrift,
          returnTemp: returnTempDrift,
          fanRPM: rpmDrift,
          airPressure: pressureDrift,
          power: powerDrift,
          coolingValve: valveDrift,
          lastUpdate: `${Math.floor(Math.random() * 4) + 1}s ago`,
        };
      }));

      // 2. Fluctuating SCADA metrics
      setScadaMetrics(prev => ({
        packetRate: Math.round(1400 + Math.random() * 80),
        latency: Math.round(10 + Math.random() * 5),
        modbusLatency: Math.round(7 + Math.random() * 3),
        opcLatency: Math.round(14 + Math.random() * 4),
        mqttLatency: Math.round(5 + Math.random() * 3),
        activeNodes: 120,
        onlineNodes: 117,
        bufferUsage: Math.round(32 + Math.random() * 6),
        lastSync: new Date().toLocaleTimeString(),
      }));

      // 3. Occasional SCADA event streaming log injection
      if (Math.random() > 0.6) {
        const protocols = ['BACnet/IP', 'Modbus TCP', 'OPC-UA', 'MQTT'];
        const sampleDevices = ['AHU-312-GF-CEN', 'CHW-101-GF', 'VDGS-G4', 'SACS-1F-01', 'FAN-EF-GF-01', 'AHU-410-1F-DEPT'];
        const sampleMsgs = [
          'Telemetry heartbeat ping ACK received (0ms loss)',
          'Supply air flow sensor recalibrated automatically',
          'VAV box 14 airflow rate adjusted to 680 CFM',
          'Chilled water delta T stable at 5.6°C',
          'Access badge scan: Authorized Zone Airside T1',
          'Chiller refrigerant suction temp validated',
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

  // Equipment control actions (Start/Stop, Auto/Manual, Setpoint adjust, Override)
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
      protocol: 'SCADA Control',
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
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true, assignee: 'Operator' } : a));
    const targetAlert = alerts.find(a => a.id === alertId);
    if (targetAlert) {
      setScadaLogs(logs => [{
        id: `log-${Date.now()}`,
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        protocol: 'Alarm Manager',
        device: targetAlert.equipment,
        msg: `Alarm ${alertId} acknowledged by Operator`,
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
      title: data.title || 'Corrective Inspection',
      priority: data.priority || 'high',
      status: 'Assigned',
      assignee: data.assignee || 'T. Nguyen',
      equipment: data.equipment || 'AHU-310-GF-EXT1',
      created: 'Just now',
      due: 'Today'
    };
    setWorkOrders(prev => [newWo, ...prev]);
    return newWo;
  }, []);

  // Calculated dynamic Subsystems
  const dynamicSubsystems = INITIAL_SUBSYSTEMS.map(sub => {
    const subEqs = equipmentList.filter(e => e.system === sub.id);
    if (subEqs.length === 0) return sub;

    const opCount = subEqs.filter(e => e.status === 'operational').length;
    const warnCount = subEqs.filter(e => e.status === 'warning').length;
    const critCount = subEqs.filter(e => e.status === 'critical').length;
    const health = Math.round((opCount / subEqs.length) * 100);

    let status = 'operational';
    if (critCount > 0) status = 'critical';
    else if (warnCount > 0) status = 'warning';

    return {
      ...sub,
      operational: opCount,
      total: subEqs.length,
      warnings: warnCount,
      critical: critCount,
      health: health || sub.health,
      status,
      lastUpdate: '2s ago',
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
