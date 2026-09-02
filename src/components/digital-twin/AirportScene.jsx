import { Suspense, useRef, useState, useCallback, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sky, Environment } from '@react-three/drei';
import * as THREE from 'three';

import AirportGround from './AirportGround';
import TerminalModel from './TerminalModel';
import GateModel from './GateModel';
import { Aircraft, TaxiingAircraft } from './AircraftModel';
import VehicleModel from './VehicleModel';
import SceneControls from './SceneControls';
import ObjectInfoPanel from './ObjectInfoPanel';

// ── Camera config — aerial telephoto like reference images ───────────────────
// ── Camera config — elevated aerial view matching real airport photo ────────
const CAM_POS    = [0, 54, 36];
const CAM_TARGET = [0, 0, -8];
const CAM_FOV    = 42;

function RunwayLightRow({ x, count = 14 }) {
  const refs = useRef([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    refs.current.forEach((m, i) => {
      if (m && m.material) m.material.emissiveIntensity = Math.sin(t * 3 + i * 0.4) > 0.4 ? 1.5 : 0.1;
    });
  });
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const z = -45 - i * 4.2;
        return (
          <mesh key={i} ref={el => refs.current[i] = el} position={[x, 0.12, z]}>
            <sphereGeometry args={[0.08, 6, 6]} />
            <meshStandardMaterial color="#fffbcc" emissive="#fffbcc" emissiveIntensity={0.8} />
          </mesh>
        );
      })}
    </>
  );
}

// ── PAPI approach lights ──────────────────────────────────────────────────────
function PAPILights({ x, z }) {
  return (
    <group position={[x, 0.1, z]}>
      {[0, 0.45, 0.9, 1.35].map((dx, i) => (
        <mesh key={i} position={[dx, 0, 0]}>
          <boxGeometry args={[0.3, 0.12, 0.3]} />
          <meshStandardMaterial color={i < 2 ? '#ff4444' : '#ffffff'} emissive={i < 2 ? '#ff2222' : '#eeeeee'} emissiveIntensity={1.5} />
        </mesh>
      ))}
    </group>
  );
}

// ── Gate definitions along the 3 wide concourse wings ───────────────────────
const GATE_DATA = [
  // 1. North Pier Gates (Dual rows along the wide central pier)
  { id: 'N31', pos: [-5.8, 0, -12], rot: -Math.PI / 2, status: 'boarding' },
  { id: 'N32', pos: [ 5.8, 0, -12], rot:  Math.PI / 2, status: 'operational' },
  { id: 'N33', pos: [-5.8, 0, -18], rot: -Math.PI / 2, status: 'operational' },
  { id: 'N34', pos: [ 5.8, 0, -18], rot:  Math.PI / 2, status: 'warning' },
  { id: 'N35', pos: [-5.8, 0, -24], rot: -Math.PI / 2, status: 'operational' },
  { id: 'N36', pos: [ 5.8, 0, -24], rot:  Math.PI / 2, status: 'operational' },
  // North Pier Hammerhead End Gates
  { id: 'N37', pos: [-7.5, 0, -34.5], rot: Math.PI,    status: 'operational' },
  { id: 'N38', pos: [ 0.0, 0, -35.5], rot: Math.PI,    status: 'boarding' },
  { id: 'N39', pos: [ 7.5, 0, -34.5], rot: Math.PI,    status: 'operational' },

  // 2. West Wing Gates (Wide sweeping concourse)
  { id: 'W11', pos: [-16.5, 0,  -3.5], rot: -Math.PI / 3.5, status: 'critical' },
  { id: 'W12', pos: [-21.2, 0,  -6.2], rot: -Math.PI / 3.5, status: 'operational' },
  { id: 'W13', pos: [-25.8, 0,  -8.8], rot: -Math.PI / 3.5, status: 'operational' },
  { id: 'W14', pos: [-19.0, 0,   2.5], rot:  Math.PI / 1.5, status: 'operational' },
  { id: 'W15', pos: [-23.5, 0,  -0.2], rot:  Math.PI / 1.5, status: 'warning' },
  // West Wing Hammerhead Tip
  { id: 'W16', pos: [-32.5, 0, -12.5], rot: -Math.PI / 3,   status: 'boarding' },

  // 3. East Wing Gates (Wide sweeping concourse)
  { id: 'E21', pos: [ 16.5, 0,  -3.5], rot:  Math.PI / 3.5, status: 'operational' },
  { id: 'E22', pos: [ 21.2, 0,  -6.2], rot:  Math.PI / 3.5, status: 'boarding' },
  { id: 'E23', pos: [ 25.8, 0,  -8.8], rot:  Math.PI / 3.5, status: 'operational' },
  { id: 'E24', pos: [ 19.0, 0,   2.5], rot: -Math.PI / 1.5, status: 'operational' },
  { id: 'E25', pos: [ 23.5, 0,  -0.2], rot: -Math.PI / 1.5, status: 'offline' },
  // East Wing Hammerhead Tip
  { id: 'E26', pos: [ 32.5, 0, -12.5], rot:  Math.PI / 3,   status: 'operational' },
];

// ── Parked Aircraft docked at Wide Concourse Gates ──────────────────────────
const AIRCRAFT_DATA = [
  // North Pier Aircraft (Dual sides)
  { id: 'VN-A891', flight: 'VN218',  pos: [-8.4, 0.1, -12],   rot:  Math.PI / 2, status: 'boarding',    time: '17:15' },
  { id: 'VN-A350', flight: 'VN019',  pos: [ 8.4, 0.1, -18],   rot: -Math.PI / 2, status: 'operational', time: '17:40' },
  { id: 'VN-A787', flight: 'VN502',  pos: [-8.4, 0.1, -24],   rot:  Math.PI / 2, status: 'warning',     time: '18:00' },
  { id: 'VN-A990', flight: 'VN101',  pos: [ 0.0, 0.1, -38.5], rot:  0,           status: 'boarding',    time: '17:30' },

  // West Wing Aircraft (Inner & Outer Apron)
  { id: 'QH-A321', flight: 'QH240',  pos: [-24.5, 0.1, -10.5], rot: Math.PI / 5,  status: 'critical',    time: '16:50' },
  { id: 'VN-A682', flight: 'VN620',  pos: [-22.5, 0.1,   4.5], rot: -Math.PI / 3, status: 'operational', time: '18:15' },
  { id: 'VJ-A330', flight: 'VJ081',  pos: [-35.0, 0.1, -15.5], rot: Math.PI / 4,  status: 'boarding',    time: '17:10' },

  // East Wing Aircraft (Inner & Outer Apron)
  { id: 'VN-A320', flight: 'VN782',  pos: [ 24.5, 0.1, -10.5], rot: -Math.PI / 5, status: 'operational', time: '17:50' },
  { id: 'QH-A888', flight: 'QH512',  pos: [ 22.5, 0.1,   4.5], rot:  Math.PI / 3, status: 'operational', time: '18:25' },
  { id: 'VN-A925', flight: 'VN338',  pos: [ 35.0, 0.1, -15.5], rot: -Math.PI / 4, status: 'operational', time: '18:40' },
];

// ── Animated Taxiing Aircraft ───────────────────────────────────────────────
const TAXI_PATHS = [
  // Outer perimeter loop
  [[-40, 0.1, -30], [-25, 0.1, -40], [0, 0.1, -44], [25, 0.1, -40], [40, 0.1, -30], [28, 0.1, -26], [0, 0.1, -32], [-28, 0.1, -26], [-40, 0.1, -30]],
  // Center exit path
  [[0, 0.1, -44], [0, 0.1, -60], [-24.5, 0.1, -60], [-24.5, 0.1, -95]],
];

// ── Camera controller ─────────────────────────────────────────────────────────
function CameraController({ controlsRef, onLoad }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(...CAM_POS);
    camera.updateProjectionMatrix();
    onLoad?.();
  }, []);
  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.07}
      minDistance={12}
      maxDistance={80}
      maxPolarAngle={Math.PI / 2.15}
      minPolarAngle={Math.PI / 5}
      target={new THREE.Vector3(...CAM_TARGET)}
      zoomSpeed={0.8}
    />
  );
}

// ── Lighting ──────────────────────────────────────────────────────────────────
function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.55} color="#d4e8ff" />
      <directionalLight
        position={[25, 35, 20]}
        intensity={2.2}
        color="#fff8f0"
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-near={1}
        shadow-camera-far={200}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-bias={-0.0003}
      />
      <hemisphereLight skyColor="#99ccff" groundColor="#223322" intensity={0.5} />
      {/* Terminal accent fill */}
      <pointLight position={[0, 12, 0]} color="#6ab4ff" intensity={4} distance={40} decay={2} />
      {/* Apron floodlights */}
      {[[-20, 8, -5], [20, 8, -5], [-20, 8, 8], [20, 8, 8]].map((p, i) => (
        <pointLight key={i} position={p} color="#fff5e0" intensity={3} distance={30} decay={2} />
      ))}
    </>
  );
}

// ── Scene-level runway markers ────────────────────────────────────────────────
function RunwayMarkers() {
  return (
    <group>
      {/* Runway threshold signs */}
      {[[-19.5, -25.5], [19.5, -25.5]].map(([rx, rz], i) => (
        <group key={i} position={[rx, 0.3, rz]}>
          <mesh>
            <boxGeometry args={[2.5, 0.6, 0.08]} />
            <meshStandardMaterial color="#ffff00" emissive="#aaaa00" emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}
      {/* Edge lights */}
      <RunwayLightRow x={-22} count={13} />
      <RunwayLightRow x={-17} count={13} />
      <RunwayLightRow x={17}  count={13} />
      <RunwayLightRow x={22}  count={13} />
      {/* PAPI */}
      <PAPILights x={-22.5} z={-25} />
      <PAPILights x={17.5}  z={-25} />
    </group>
  );
}

// ── Main exported scene ───────────────────────────────────────────────────────
export default function AirportScene({ onObjectSelect }) {
  const controlsRef = useRef();
  const [selected, setSelected] = useState(null);
  const [showAircraft, setShowAircraft] = useState(true);
  const [showVehicles, setShowVehicles] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef();

  const handleSelect = useCallback(obj => {
    setSelected(obj);
    onObjectSelect?.(obj);
  }, [onObjectSelect]);

  const resetCamera = useCallback(() => controlsRef.current?.reset(), []);

  const doZoom = useCallback(dir => {
    const cam = controlsRef.current?.object;
    const tgt = controlsRef.current?.target;
    if (!cam || !tgt) return;
    const factor = dir > 0 ? 0.78 : 1.28;
    cam.position.lerp(tgt, 1 - factor);
  }, []);

  const toggleFS = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setFullscreen(false);
    }
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%', background: '#060d18' }}>
      {/* Loading overlay */}
      {!loaded && (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#060d18,#020609)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
          <div style={{ position: 'relative', width: 64, height: 64 }}>
            <div style={{ position: 'absolute', inset: 0, border: '2px solid rgba(56,189,248,0.15)', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <div style={{ position: 'absolute', inset: 8, border: '2px solid rgba(56,189,248,0.08)', borderBottomColor: '#38bdf8', borderRadius: '50%', animation: 'spin 1.2s linear infinite reverse' }} />
          </div>
          <div style={{ fontFamily: 'monospace', color: '#38bdf8', fontSize: 13, letterSpacing: 3, fontWeight: 700 }}>LOADING DIGITAL TWIN</div>
          <div style={{ fontFamily: 'monospace', color: '#8f9fb2', fontSize: 10, letterSpacing: 2 }}>LONG THANH INTERNATIONAL</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      <Canvas
        shadows="soft"
        camera={{ position: CAM_POS, fov: CAM_FOV, near: 0.5, far: 600 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          {/* Sky */}
          <Sky
            distance={450}
            sunPosition={[1, 0.35, 0]}
            inclination={0.52}
            azimuth={0.25}
            rayleigh={1.8}
            mieCoefficient={0.006}
            mieDirectionalG={0.88}
          />
          <Stars radius={300} depth={50} count={1500} factor={2.5} fade speed={0.2} />

          <SceneLighting />
          <CameraController controlsRef={controlsRef} onLoad={() => setTimeout(() => setLoaded(true), 500)} />

          {/* Ground — full satellite texture */}
          <AirportGround />

          {/* 3D Runway lights & markers */}
          <RunwayMarkers />

          {/* Terminal building */}
          <TerminalModel onSelect={handleSelect} />

          {/* Interactive gates */}
          {GATE_DATA.map(g => (
            <GateModel key={g.id} position={g.pos} rotation={g.rot} label={g.id} status={g.status} onSelect={handleSelect} />
          ))}

          {/* Parked aircraft */}
          {showAircraft && AIRCRAFT_DATA.map(a => (
            <Aircraft key={a.id} position={a.pos} rotation={a.rot}
              label={a.id} flight={a.flight} status={a.status} time={a.time}
              onSelect={handleSelect}
            />
          ))}

          {/* Taxiing aircraft */}
          {showAircraft && TAXI_PATHS.map((path, i) => (
            <TaxiingAircraft key={`taxi-${i}`} path={path} speed={0.0014 + i * 0.0005} />
          ))}

          {/* Ground service vehicles */}
          {showVehicles && <VehicleModel />}
        </Suspense>
      </Canvas>

      {/* Floating controls */}
      <SceneControls
        onZoomIn={() => doZoom(1)}
        onZoomOut={() => doZoom(-1)}
        onReset={resetCamera}
        showAircraft={showAircraft}
        onToggleAircraft={() => setShowAircraft(v => !v)}
        showVehicles={showVehicles}
        onToggleVehicles={() => setShowVehicles(v => !v)}
        showLabels={showLabels}
        onToggleLabels={() => setShowLabels(v => !v)}
        fullscreen={fullscreen}
        onToggleFullscreen={toggleFS}
      />

      {/* Object info panel */}
      <ObjectInfoPanel object={selected} onClose={() => setSelected(null)} />

      {/* Status legend */}
      <div style={{ position: 'absolute', bottom: 24, left: 24, display: 'flex', gap: 14, zIndex: 40, background: 'rgba(4,8,18,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 14px', backdropFilter: 'blur(10px)' }}>
        {[
          ['#22d3a5', 'Operational'],
          ['#f59e0b', 'Warning'],
          ['#ef4444', 'Critical'],
          ['#38bdf8', 'Boarding'],
          ['#6b7280', 'Offline'],
          ['#a78bfa', 'Moving'],
        ].map(([color, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}`, flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: '#8f9fb2', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Camera hint */}
      <div style={{ position: 'absolute', bottom: 24, right: 84, zIndex: 40, background: 'rgba(4,8,18,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '6px 12px', backdropFilter: 'blur(10px)' }}>
        <span style={{ fontSize: 10, color: '#6b7280', fontFamily: 'monospace' }}>Scroll to zoom • Drag to orbit • Right-click to pan</span>
      </div>
    </div>
  );
}
