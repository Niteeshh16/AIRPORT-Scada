import {
  Package, PlaneLanding, Monitor, Cpu, ShieldCheck, Volume2,
  Flame, Clock, Thermometer, Plane, ScanLine, DoorOpen
} from 'lucide-react';

export const AIRPORT_INFO = {
  name: 'Long Thanh International Airport (LTIA)',
  code: 'LTIA / VVLT',
  terminals: ['Terminal 1 - Main Complex', 'Terminal 1 - Satellite Pier'],
  location: 'Long Thanh, Dong Nai, Vietnam',
};

export const FLOORS = [
  { id: 'PIT', label: 'PIT', name: 'PIT Level (Basement & Utilities)', altitude: '-4.5m', totalArea: '48,000 m²' },
  { id: 'GF', label: 'GF', name: 'Ground Floor (Baggage & Apron)', altitude: '0.0m', totalArea: '72,000 m²' },
  { id: '1F', label: '1F', name: 'First Floor (Departures & Concourse)', altitude: '+6.5m', totalArea: '85,000 m²' },
  { id: '2F', label: '2F', name: 'Second Floor (Food & Retail Atrium)', altitude: '+12.0m', totalArea: '65,000 m²' },
  { id: '3F', label: '3F', name: 'Third Floor (Airline Lounges & Admin)', altitude: '+18.0m', totalArea: '42,000 m²' },
  { id: '4F', label: '4F', name: 'Fourth Floor (ATC Tower & Fire Command)', altitude: '+24.5m', totalArea: '18,000 m²' },
];

export const SUBSYSTEMS = [
  { id: 'LBMS', name: 'HVAC & Building Management', icon: 'Thermometer', total: 14, operational: 10, warnings: 3, critical: 1, health: 71.4, status: 'critical', desc: 'Central Chillers, AHUs, PAUs, VAVs, Pumps' },
  { id: 'BHS', name: 'Baggage Handling System', icon: 'Package', total: 3, operational: 1, warnings: 1, critical: 1, health: 33.3, status: 'critical', desc: 'Early Bag Store, Sorters, Check-in Belts, Carousels' },
  { id: 'FAS', name: 'Fire Alarm System', icon: 'Flame', total: 5, operational: 4, warnings: 1, critical: 0, health: 80.0, status: 'warning', desc: 'Optical Smoke Detectors, FM200, Deluge Valves' },
  { id: 'SACS', name: 'Security & Access Control', icon: 'ShieldCheck', total: 2, operational: 1, warnings: 1, critical: 0, health: 50.0, status: 'warning', desc: 'Biometric Doors, Turnstiles, Airside Access Gates' },
  { id: 'SSE', name: 'Security Screening Equipment', icon: 'ScanLine', total: 2, operational: 1, warnings: 0, critical: 1, health: 50.0, status: 'critical', desc: 'Dual-View CT Baggage Scanners, Explosive Trace' },
  { id: 'AGAC', name: 'Gate Access Control', icon: 'DoorOpen', total: 3, operational: 2, warnings: 0, critical: 1, health: 66.7, status: 'operational', desc: 'Self-Boarding E-Gates, Automated Turnstiles' },
  { id: 'VDGS', name: 'Visual Docking Guidance', icon: 'PlaneLanding', total: 2, operational: 2, warnings: 0, critical: 0, health: 100.0, status: 'operational', desc: 'Laser Apron Profilers, Stand Guidance Displays' },
  { id: 'CMS', name: 'Central Power Monitoring', icon: 'Monitor', total: 15, operational: 15, warnings: 0, critical: 0, health: 100.0, status: 'operational', desc: '110kV Substations, UPS Banks, Diesel Generators' },
  { id: 'PAS', name: 'Public Address System', icon: 'Volume2', total: 1, operational: 1, warnings: 0, critical: 0, health: 100.0, status: 'operational', desc: 'Dante IP Audio, Emergency Evacuation Amplifiers' },
  { id: 'MCS', name: 'Master Clock System', icon: 'Clock', total: 1, operational: 1, warnings: 0, critical: 0, health: 100.0, status: 'operational', desc: 'GPS NTP Synchronizers, Digital Passenger Clocks' },
  { id: 'SCADA', name: 'Supervisory Control & Data', icon: 'Cpu', total: 12, operational: 12, warnings: 0, critical: 0, health: 98.3, status: 'operational', desc: 'Redundant PLC Matrix, Remote Terminal Units' },
  { id: 'IASS', name: 'Aircraft Stand Systems', icon: 'Plane', total: 18, operational: 18, warnings: 0, critical: 0, health: 96.3, status: 'operational', desc: '400Hz Ground Power Units, Pre-conditioned Air' },
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const createEquipment = (base) => {
  return {
    ...base,
    temp: base._temp !== null ? +(base._temp + (Math.random() * 0.4 - 0.2)).toFixed(1) : null,
    supplyTemp: base._supplyTemp !== null ? +(base._supplyTemp + (Math.random() * 0.3 - 0.15)).toFixed(1) : null,
    returnTemp: base._returnTemp !== null ? +(base._returnTemp + (Math.random() * 0.3 - 0.15)).toFixed(1) : null,
    fanRPM: base._fanRPM !== null ? (base.status === 'critical' ? 0 : Math.round(base._fanRPM + (Math.random() * 20 - 10))) : null,
    airPressure: base._airPressure !== null ? Math.round(base._airPressure + (Math.random() * 4 - 2)) : null,
    coolingValve: base._coolingValve !== null ? Math.min(100, Math.max(0, Math.round(base._coolingValve + (Math.random() * 2 - 1)))) : null,
    power: base._power !== null ? +(base._power + (Math.random() * 0.6 - 0.3)).toFixed(1) : null,
    health: base._health,
    setpoint: base._setpoint,
    mode: base._mode,
    comm: base._comm,
  };
};

export const RAW_EQUIPMENT = [
  // PIT LEVEL (Basement & Central Utility Tunnel)
  { id: 'PUMP-PIT-01', type: 'Pump', system: 'LBMS', floor: 'PIT', zone: 'Central Utility Tunnel - West', status: 'operational', _health: 96, _temp: null, _setpoint: null, _fanRPM: null, _supplyTemp: null, _returnTemp: null, _airPressure: null, _coolingValve: null, _power: 18.5, _mode: 'Auto', _comm: 'Online', _lastUpdate: '2s ago', x: 28, y: 35 },
  { id: 'PUMP-PIT-02', type: 'Pump', system: 'LBMS', floor: 'PIT', zone: 'Central Utility Tunnel - East', status: 'operational', _health: 94, _temp: null, _setpoint: null, _fanRPM: null, _supplyTemp: null, _returnTemp: null, _airPressure: null, _coolingValve: null, _power: 17.8, _mode: 'Auto', _comm: 'Online', _lastUpdate: '3s ago', x: 72, y: 35 },
  { id: 'CHW-PIT-01', type: 'Chiller', system: 'LBMS', floor: 'PIT', zone: 'Central Chiller Substation', status: 'operational', _health: 98, _temp: 6.8, _setpoint: 7.0, _fanRPM: null, _supplyTemp: 6.5, _returnTemp: 12.1, _airPressure: null, _coolingValve: 55, _power: 145.0, _mode: 'Auto', _comm: 'Online', _lastUpdate: '1s ago', x: 45, y: 55 },
  { id: 'CHW-PIT-02', type: 'Chiller', system: 'LBMS', floor: 'PIT', zone: 'Central Chiller Substation', status: 'warning', _health: 78, _temp: 7.9, _setpoint: 7.0, _fanRPM: null, _supplyTemp: 7.6, _returnTemp: 13.4, _airPressure: null, _coolingValve: 84, _power: 160.2, _mode: 'Auto', _comm: 'Online', _lastUpdate: '5s ago', x: 55, y: 55 },
  { id: 'FAN-PIT-EX1', type: 'Exhaust Fan', system: 'LBMS', floor: 'PIT', zone: 'Primary Ventilation Shaft', status: 'offline', _health: 0, _temp: null, _setpoint: null, _fanRPM: 0, _supplyTemp: null, _returnTemp: null, _airPressure: 0, _coolingValve: null, _power: 0, _mode: 'Offline', _comm: 'Offline', _lastUpdate: '1h ago', x: 50, y: 20 },
  { id: 'GEN-PIT-01', type: 'Exhaust Fan', system: 'CMS', floor: 'PIT', zone: 'Emergency Diesel Generator 1', status: 'operational', _health: 100, _temp: null, _setpoint: null, _fanRPM: 1500, _supplyTemp: null, _returnTemp: null, _airPressure: null, _coolingValve: null, _power: 85.0, _mode: 'Standby', _comm: 'Online', _lastUpdate: '1s ago', x: 38, y: 70 },

  // GROUND FLOOR (Baggage Sortation & Apron Gates)
  { id: 'AHU-310-GF-EXT1', type: 'AHU', system: 'LBMS', floor: 'GF', zone: 'West Baggage Sortation Hall', status: 'critical', _health: 42, _temp: 28.6, _setpoint: 24.0, _fanRPM: 1420, _supplyTemp: 26.1, _returnTemp: 28.6, _airPressure: 245, _coolingValve: 78, _power: 45.2, _mode: 'Auto', _comm: 'Online', _lastUpdate: '5s ago', x: 26, y: 32 },
  { id: 'AHU-311-GF-EXT2', type: 'AHU', system: 'LBMS', floor: 'GF', zone: 'East Baggage Sortation Hall', status: 'operational', _health: 96, _temp: 23.8, _setpoint: 24.0, _fanRPM: 1180, _supplyTemp: 21.2, _returnTemp: 23.8, _airPressure: 250, _coolingValve: 45, _power: 32.1, _mode: 'Auto', _comm: 'Online', _lastUpdate: '3s ago', x: 74, y: 32 },
  { id: 'AHU-312-GF-CEN', type: 'AHU', system: 'LBMS', floor: 'GF', zone: 'Arrival Hall Central Plaza', status: 'operational', _health: 98, _temp: 23.5, _setpoint: 24.0, _fanRPM: 1200, _supplyTemp: 20.8, _returnTemp: 23.5, _airPressure: 248, _coolingValve: 40, _power: 30.5, _mode: 'Auto', _comm: 'Online', _lastUpdate: '2s ago', x: 50, y: 55 },
  { id: 'CONV-BHS-01', type: 'Conveyor', system: 'BHS', floor: 'GF', zone: 'Baggage Sorter Loop 1', status: 'operational', _health: 99, _temp: null, _setpoint: null, _fanRPM: null, _supplyTemp: null, _returnTemp: null, _airPressure: null, _coolingValve: null, _power: 8.5, _mode: 'Auto', _comm: 'Online', _lastUpdate: '1s ago', x: 38, y: 65 },
  { id: 'CONV-BHS-02', type: 'Conveyor', system: 'BHS', floor: 'GF', zone: 'Baggage Sorter Loop 2', status: 'warning', _health: 72, _temp: null, _setpoint: null, _fanRPM: null, _supplyTemp: null, _returnTemp: null, _airPressure: null, _coolingValve: null, _power: 9.8, _mode: 'Auto', _comm: 'Online', _lastUpdate: '8s ago', x: 62, y: 65 },
  { id: 'CONV-BHS-03', type: 'Conveyor', system: 'BHS', floor: 'GF', zone: 'Check-in Belt Induction 3', status: 'critical', _health: 15, _temp: null, _setpoint: null, _fanRPM: null, _supplyTemp: null, _returnTemp: null, _airPressure: null, _coolingValve: null, _power: 0, _mode: 'Stop', _comm: 'Online', _lastUpdate: '12s ago', x: 50, y: 75 },
  { id: 'GATE-01', type: 'Gate', system: 'AGAC', floor: 'GF', zone: 'Ground Gate G1', status: 'operational', _health: 100, _temp: null, _setpoint: null, _fanRPM: null, _supplyTemp: null, _returnTemp: null, _airPressure: null, _coolingValve: null, _power: 0.5, _mode: 'Auto', _comm: 'Online', _lastUpdate: '1s ago', x: 22, y: 45 },
  { id: 'GATE-02', type: 'Gate', system: 'AGAC', floor: 'GF', zone: 'Ground Gate G2', status: 'operational', _health: 100, _temp: null, _setpoint: null, _fanRPM: null, _supplyTemp: null, _returnTemp: null, _airPressure: null, _coolingValve: null, _power: 0.5, _mode: 'Auto', _comm: 'Online', _lastUpdate: '2s ago', x: 50, y: 22 },
  { id: 'GATE-03', type: 'Gate', system: 'AGAC', floor: 'GF', zone: 'Ground Gate G3', status: 'offline', _health: 0, _temp: null, _setpoint: null, _fanRPM: null, _supplyTemp: null, _returnTemp: null, _airPressure: null, _coolingValve: null, _power: 0, _mode: 'Offline', _comm: 'Offline', _lastUpdate: '15m ago', x: 78, y: 45 },
  { id: 'SSE-XR-01', type: 'X-Ray Scanner', system: 'SSE', floor: 'GF', zone: 'Arrival Customs Scanner A', status: 'operational', _health: 98, _temp: null, _setpoint: null, _fanRPM: null, _supplyTemp: null, _returnTemp: null, _airPressure: null, _coolingValve: null, _power: 3.2, _mode: 'Active', _comm: 'Online', _lastUpdate: '2s ago', x: 42, y: 48 },
  { id: 'SSE-XR-02', type: 'X-Ray Scanner', system: 'SSE', floor: 'GF', zone: 'Arrival Customs Scanner B', status: 'critical', _health: 20, _temp: null, _setpoint: null, _fanRPM: null, _supplyTemp: null, _returnTemp: null, _airPressure: null, _coolingValve: null, _power: 0.1, _mode: 'Fault', _comm: 'Online', _lastUpdate: '30s ago', x: 58, y: 48 },
  { id: 'FD-GF-001', type: 'Fire Detector', system: 'FAS', floor: 'GF', zone: 'Arrival Hall Corridor', status: 'operational', _health: 100, _temp: 24.1, _setpoint: null, _fanRPM: null, _supplyTemp: null, _returnTemp: null, _airPressure: null, _coolingValve: null, _power: 0.1, _mode: 'Active', _comm: 'Online', _lastUpdate: '2s ago', x: 32, y: 55 },

  // FIRST FLOOR (Departures Concourse & Gates)
  { id: 'AHU-309-1F-EXT1', type: 'AHU', system: 'LBMS', floor: '1F', zone: 'Zone 23 — West Pier Concourse', status: 'critical', _health: 38, _temp: 28.6, _setpoint: 24.0, _fanRPM: 0, _supplyTemp: 26.1, _returnTemp: 28.6, _airPressure: 240, _coolingValve: 84, _power: 42.0, _mode: 'Manual', _comm: 'Online', _lastUpdate: '3s ago', x: 26, y: 26 },
  { id: 'AHU-301-1F-EXT1', type: 'AHU', system: 'LBMS', floor: '1F', zone: 'West Pier Boarding Gates 10-16', status: 'operational', _health: 98, _temp: 23.5, _setpoint: 24.0, _fanRPM: 1180, _supplyTemp: 20.2, _returnTemp: 23.5, _airPressure: 250, _coolingValve: 38, _power: 28.5, _mode: 'Auto', _comm: 'Online', _lastUpdate: '2s ago', x: 18, y: 38 },
  { id: 'AHU-302-1F-EXT1', type: 'AHU', system: 'LBMS', floor: '1F', zone: 'East Pier Boarding Gates 40-46', status: 'operational', _health: 97, _temp: 24.1, _setpoint: 24.0, _fanRPM: 1150, _supplyTemp: 21.0, _returnTemp: 24.1, _airPressure: 248, _coolingValve: 42, _power: 29.1, _mode: 'Auto', _comm: 'Online', _lastUpdate: '2s ago', x: 82, y: 38 },
  { id: 'AHU-410-1F-DEPT', type: 'AHU', system: 'LBMS', floor: '1F', zone: 'Central Lotus Check-in Hall', status: 'operational', _health: 99, _temp: 23.2, _setpoint: 23.5, _fanRPM: 1220, _supplyTemp: 20.5, _returnTemp: 23.2, _airPressure: 252, _coolingValve: 38, _power: 34.0, _mode: 'Auto', _comm: 'Online', _lastUpdate: '1s ago', x: 50, y: 60 },
  { id: 'AHU-412-1F-NORTH', type: 'AHU', system: 'LBMS', floor: '1F', zone: 'North Pier Concourse (Gates 30-37)', status: 'operational', _health: 98, _temp: 23.0, _setpoint: 23.5, _fanRPM: 1200, _supplyTemp: 20.1, _returnTemp: 23.0, _airPressure: 254, _coolingValve: 36, _power: 31.5, _mode: 'Auto', _comm: 'Online', _lastUpdate: '2s ago', x: 50, y: 18 },
  { id: 'VDGS-G18', type: 'Docking System', system: 'VDGS', floor: '1F', zone: 'West Pier Stand 18 (Zone 23)', status: 'operational', _health: 100, _temp: null, _setpoint: null, _fanRPM: null, _supplyTemp: null, _returnTemp: null, _airPressure: null, _coolingValve: null, _power: 1.2, _mode: 'Active', _comm: 'Online', _lastUpdate: '1s ago', x: 22, y: 22 },
  { id: 'VDGS-G34', type: 'Docking System', system: 'VDGS', floor: '1F', zone: 'North Pier Stand 34', status: 'operational', _health: 100, _temp: null, _setpoint: null, _fanRPM: null, _supplyTemp: null, _returnTemp: null, _airPressure: null, _coolingValve: null, _power: 1.2, _mode: 'Standby', _comm: 'Online', _lastUpdate: '2s ago', x: 54, y: 12 },
  { id: 'SACS-1F-01', type: 'Access Panel', system: 'SACS', floor: '1F', zone: 'Airside Security Portal A', status: 'warning', _health: 65, _temp: null, _setpoint: null, _fanRPM: null, _supplyTemp: null, _returnTemp: null, _airPressure: null, _coolingValve: null, _power: 0.3, _mode: 'Active', _comm: 'Online', _lastUpdate: '10s ago', x: 38, y: 52 },
  { id: 'PAS-1F-01', type: 'PA Speaker', system: 'PAS', floor: '1F', zone: 'Central Departure Concourse', status: 'operational', _health: 100, _temp: null, _setpoint: null, _fanRPM: null, _supplyTemp: null, _returnTemp: null, _airPressure: null, _coolingValve: null, _power: 0.2, _mode: 'Active', _comm: 'Online', _lastUpdate: '1s ago', x: 50, y: 48 },

  // SECOND FLOOR (Food Court & Retail Atrium)
  { id: 'AHU-510-2F', type: 'AHU', system: 'LBMS', floor: '2F', zone: 'Central Food Court & Dining', status: 'warning', _health: 75, _temp: 25.1, _setpoint: 24.0, _fanRPM: 1350, _supplyTemp: 22.8, _returnTemp: 25.1, _airPressure: 238, _coolingValve: 70, _power: 38.5, _mode: 'Auto', _comm: 'Online', _lastUpdate: '4s ago', x: 45, y: 45 },
  { id: 'AHU-511-2F-RETAIL', type: 'AHU', system: 'LBMS', floor: '2F', zone: 'Duty Free Luxury Retail Plaza', status: 'operational', _health: 98, _temp: 23.4, _setpoint: 24.0, _fanRPM: 1120, _supplyTemp: 20.6, _returnTemp: 23.4, _airPressure: 252, _coolingValve: 40, _power: 29.8, _mode: 'Auto', _comm: 'Online', _lastUpdate: '2s ago', x: 58, y: 45 },
  { id: 'FD-2F-001', type: 'Fire Detector', system: 'FAS', floor: '2F', zone: 'Kitchen Extraction Hood 1', status: 'operational', _health: 100, _temp: 25.0, _setpoint: null, _fanRPM: null, _supplyTemp: null, _returnTemp: null, _airPressure: null, _coolingValve: null, _power: 0.1, _mode: 'Active', _comm: 'Online', _lastUpdate: '2s ago', x: 42, y: 40 },
  { id: 'FD-2F-002', type: 'Fire Detector', system: 'FAS', floor: '2F', zone: 'Retail Concourse West', status: 'warning', _health: 80, _temp: 24.5, _setpoint: null, _fanRPM: null, _supplyTemp: null, _returnTemp: null, _airPressure: null, _coolingValve: null, _power: 0.1, _mode: 'Active', _comm: 'Online', _lastUpdate: '8s ago', x: 30, y: 35 },
  { id: 'MCS-2F-01', type: 'Clock Display', system: 'MCS', floor: '2F', zone: 'Main Central Atrium Display', status: 'operational', _health: 100, _temp: null, _setpoint: null, _fanRPM: null, _supplyTemp: null, _returnTemp: null, _airPressure: null, _coolingValve: null, _power: 0.05, _mode: 'Active', _comm: 'Online', _lastUpdate: '1s ago', x: 50, y: 58 },

  // THIRD FLOOR (Airline Lounges & Admin Offices)
  { id: 'AHU-610-3F', type: 'AHU', system: 'LBMS', floor: '3F', zone: 'First & Business CIP Lounge', status: 'operational', _health: 98, _temp: 22.8, _setpoint: 23.0, _fanRPM: 1050, _supplyTemp: 19.8, _returnTemp: 22.8, _airPressure: 255, _coolingValve: 35, _power: 24.5, _mode: 'Auto', _comm: 'Online', _lastUpdate: '2s ago', x: 35, y: 42 },
  { id: 'AHU-612-3F-OFFICE', type: 'AHU', system: 'LBMS', floor: '3F', zone: 'Airport Authority Administration', status: 'operational', _health: 99, _temp: 23.1, _setpoint: 23.5, _fanRPM: 1000, _supplyTemp: 20.2, _returnTemp: 23.1, _airPressure: 258, _coolingValve: 32, _power: 22.0, _mode: 'Auto', _comm: 'Online', _lastUpdate: '1s ago', x: 65, y: 42 },
  { id: 'SACS-3F-02', type: 'Access Panel', system: 'SACS', floor: '3F', zone: 'SCADA Telemetry Server Vault', status: 'operational', _health: 100, _temp: null, _setpoint: null, _fanRPM: null, _supplyTemp: null, _returnTemp: null, _airPressure: null, _coolingValve: null, _power: 0.3, _mode: 'Active', _comm: 'Online', _lastUpdate: '1s ago', x: 50, y: 50 },

  // FOURTH FLOOR (ATC Tower & Fire Command Station)
  { id: 'AHU-710-4F', type: 'AHU', system: 'LBMS', floor: '4F', zone: 'ATC Tower Avionics Cooling', status: 'operational', _health: 99, _temp: 21.8, _setpoint: 22.0, _fanRPM: 1100, _supplyTemp: 19.2, _returnTemp: 21.8, _airPressure: 265, _coolingValve: 30, _power: 21.5, _mode: 'Auto', _comm: 'Online', _lastUpdate: '1s ago', x: 50, y: 35 },
  { id: 'FAS-4F-PANEL', type: 'Fire Panel', system: 'FAS', floor: '4F', zone: 'Master Fire Command Station', status: 'operational', _health: 100, _temp: null, _setpoint: null, _fanRPM: null, _supplyTemp: null, _returnTemp: null, _airPressure: null, _coolingValve: null, _power: 0.5, _mode: 'Active', _comm: 'Online', _lastUpdate: '1s ago', x: 42, y: 55 },
  { id: 'FAN-4F-EX1', type: 'Exhaust Fan', system: 'LBMS', floor: '4F', zone: 'Roof Primary Exhaust Stack', status: 'operational', _health: 97, _temp: null, _setpoint: null, _fanRPM: 980, _supplyTemp: null, _returnTemp: null, _airPressure: 140, _coolingValve: null, _power: 7.2, _mode: 'Auto', _comm: 'Online', _lastUpdate: '2s ago', x: 58, y: 55 },
];

export const EQUIPMENT_DATA = RAW_EQUIPMENT.map(createEquipment);

export const ALERTS = [
  { id: 'ALR-001', severity: 'critical', system: 'LBMS', subsystem: 'AHU', equipment: 'AHU-309-1F-EXT1', location: 'Zone 23 — West Pier Concourse, 1F', message: 'High return air temperature - 28.6°C exceeds threshold (26°C)', get time() { return `${randomInt(22, 28)} min ago`; }, timestamp: Date.now() - 25 * 60000, acknowledged: false, assignee: null },
  { id: 'ALR-002', severity: 'critical', system: 'BHS', subsystem: 'Conveyor', equipment: 'CONV-BHS-03', location: 'Check-in Belt Induction 3, GF', message: 'Conveyor jam detected - Motor overload trip', get time() { return `${randomInt(15, 21)} min ago`; }, timestamp: Date.now() - 18 * 60000, acknowledged: false, assignee: null },
  { id: 'ALR-003', severity: 'high', system: 'SSE', subsystem: 'X-Ray', equipment: 'SSE-XR-02', location: 'Arrival Customs Scanner B, GF', message: 'X-Ray scanner calibration failure - Image quality degraded', get time() { return `${randomInt(38, 46)} min ago`; }, timestamp: Date.now() - 42 * 60000, acknowledged: true, assignee: 'T. Nguyen' },
  { id: 'ALR-004', severity: 'high', system: 'SACS', subsystem: 'Access', equipment: 'SACS-1F-01', location: 'Airside Security Portal A, 1F', message: 'Multiple failed access attempts detected', get time() { return '1h ago'; }, timestamp: Date.now() - 60 * 60000, acknowledged: true, assignee: 'H. Tran' },
  { id: 'ALR-005', severity: 'medium', system: 'LBMS', subsystem: 'Chiller', equipment: 'CHW-PIT-02', location: 'Central Chiller Substation, PIT', message: 'Chiller condenser pressure above normal operating range', get time() { return '1h 15min ago'; }, timestamp: Date.now() - 75 * 60000, acknowledged: false, assignee: null },
  { id: 'ALR-006', severity: 'medium', system: 'BHS', subsystem: 'Conveyor', equipment: 'CONV-BHS-02', location: 'Baggage Sorter Loop 2, GF', message: 'Belt speed deviation - Running 15% below setpoint', get time() { return '2h ago'; }, timestamp: Date.now() - 120 * 60000, acknowledged: true, assignee: 'D. Pham' },
  { id: 'ALR-007', severity: 'medium', system: 'LBMS', subsystem: 'AHU', equipment: 'AHU-510-2F', location: 'Central Food Court & Dining, 2F', message: 'Supply air temperature above setpoint by 2.8°C', get time() { return `${randomInt(30, 40)} min ago`; }, timestamp: Date.now() - 35 * 60000, acknowledged: false, assignee: null },
  { id: 'ALR-008', severity: 'low', system: 'FAS', subsystem: 'Detector', equipment: 'FD-2F-002', location: 'Retail Concourse West, 2F', message: 'Smoke detector sensitivity drift - Maintenance recommended', get time() { return '3h ago'; }, timestamp: Date.now() - 180 * 60000, acknowledged: true, assignee: 'M. Le' },
  { id: 'ALR-009', severity: 'low', system: 'LBMS', subsystem: 'Fan', equipment: 'FAN-PIT-EX1', location: 'Primary Ventilation Shaft, PIT', message: 'Exhaust fan offline - Communication lost', get time() { return '2h 30min ago'; }, timestamp: Date.now() - 150 * 60000, acknowledged: true, assignee: 'Q. Vo' },
];

export const WORK_ORDERS = [
  { id: 'WO-2026-001', title: 'AHU-309 Zone 23 Thermal Compliance Repair', system: 'LBMS', equipment: 'AHU-309-1F-EXT1', location: 'Zone 23 — West Pier, 1F', priority: 'critical', status: 'in_progress', assignee: 'Thanh Nguyen', created: '25 min ago', sla: '35 min remaining', desc: 'Inspect cooling coil valve actuator and reset thermal trip relay.' },
  { id: 'WO-2026-002', title: 'CONV-BHS-03 Motor Overload Clear & Lubrication', system: 'BHS', equipment: 'CONV-BHS-03', location: 'Check-in Belt Induction 3, GF', priority: 'critical', status: 'in_progress', assignee: 'Duc Pham', created: '18 min ago', sla: '42 min remaining', desc: 'Clear physical baggage jam in diverter chute, reset motor thermal overload.' },
  { id: 'WO-2026-003', title: 'SSE-XR-02 Dual-View Calibration Run', system: 'SSE', equipment: 'SSE-XR-02', location: 'Arrival Customs Scanner B, GF', priority: 'high', status: 'pending', assignee: 'Minh Le', created: '42 min ago', sla: '1h 18min remaining', desc: 'Perform multi-energy generator calibration and sensor array test.' },
  { id: 'WO-2026-004', title: 'Quarterly Chiller Condenser Maintenance', system: 'LBMS', equipment: 'CHW-PIT-02', location: 'Central Chiller Substation, PIT', priority: 'medium', status: 'pending', assignee: 'Quang Vo', created: '1h 15min ago', sla: '4h remaining', desc: 'Inspect condenser tube bundle, check refrigerant charge levels.' },
];

export const TREND_DATA = [
  { time: '00:00', power: 380, temp: 22.1, flow: 12400, availability: 98.2 },
  { time: '02:00', power: 340, temp: 21.8, flow: 11800, availability: 98.5 },
  { time: '04:00', power: 320, temp: 21.5, flow: 11200, availability: 98.5 },
  { time: '06:00', power: 460, temp: 22.8, flow: 14500, availability: 97.9 },
  { time: '08:00', power: 580, temp: 23.9, flow: 16800, availability: 97.1 },
  { time: '10:00', power: 640, temp: 24.5, flow: 18200, availability: 96.8 },
  { time: '12:00', power: 680, temp: 24.8, flow: 19100, availability: 96.2 },
  { time: '14:00', power: 660, temp: 24.6, flow: 18900, availability: 96.5 },
  { time: '16:00', power: 610, temp: 24.1, flow: 17800, availability: 97.0 },
  { time: '18:00', power: 540, temp: 23.4, flow: 16200, availability: 97.6 },
  { time: '20:00', power: 480, temp: 22.9, flow: 14800, availability: 98.0 },
  { time: '22:00', power: 420, temp: 22.4, flow: 13500, availability: 98.2 },
];

export const SOP_DATA = [
  { id: 'SOP-01', title: 'HVAC Emergency Thermal Deviation Response', category: 'HVAC', version: 'v3.2', steps: ['Identify tripped AHU zone and return air temperature sensor', 'Verify VAV damper position and chilled water supply valve %', 'Switch backup AHU unit to manual run mode', 'Dispatch HVAC technician to plant room'] },
  { id: 'SOP-02', title: 'Baggage Handling Diverter Jam Recovery', category: 'BHS', version: 'v2.1', steps: ['E-Stop commanded conveyor segment immediately', 'Inspect optical photo-eye sensor array for obstruction', 'Clear physical baggage blockage from diverter chute', 'Reset motor thermal overload relay and resume line'] },
  { id: 'SOP-03', title: 'Fire Alarm System FAS Zone Isolation', category: 'FAS', version: 'v4.0', steps: ['Acknowledge master alarm on FAS panel within 30 seconds', 'Cross-verify with CCTV live stream in designated zone', 'Command HVAC smoke dampers to pressurization mode', 'Notify Airport Operations Control Center (AOCC)'] },
];

export const USERS = [
  { id: 'USR-01', name: 'Arjun Sharma', role: 'Super Admin', email: 'arjun.sharma@ltia.gov.vn', status: 'active', department: 'HBMS Systems Engineering' },
  { id: 'USR-02', name: 'Thanh Nguyen', role: 'HVAC Shift Lead', email: 'thanh.nguyen@ltia.gov.vn', status: 'active', department: 'Facilities & MEP' },
  { id: 'USR-03', name: 'Duc Pham', role: 'BHS Technician', email: 'duc.pham@ltia.gov.vn', status: 'active', department: 'Baggage Automation' },
  { id: 'USR-04', name: 'Minh Le', role: 'Security Ops Operator', email: 'minh.le@ltia.gov.vn', status: 'active', department: 'Aviation Security' },
];
