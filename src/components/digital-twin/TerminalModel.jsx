import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import StatusIndicator from './StatusIndicator';

// ── Architectural Material Presets ──────────────────────────────────────────
const WHITE_CANOPY = {
  color: '#f1f5f9',
  metalness: 0.25,
  roughness: 0.25,
  clearcoat: 0.3,
  clearcoatRoughness: 0.15,
};

const GLASS_SKYLIGHT = {
  color: '#7dd3fc',
  transparent: true,
  opacity: 0.55,
  metalness: 0.9,
  roughness: 0.05,
  emissive: '#38bdf8',
  emissiveIntensity: 0.25,
};

const GLASS_FACADE = {
  color: '#60a5fa',
  transparent: true,
  opacity: 0.4,
  metalness: 0.85,
  roughness: 0.1,
  emissive: '#2563eb',
  emissiveIntensity: 0.1,
};

const METAL_TRIM = {
  color: '#94a3b8',
  metalness: 0.7,
  roughness: 0.35,
};

// ── Hover Hook ──────────────────────────────────────────────────────────────
function useHover(ref) {
  const [hov, setHov] = useState(false);
  useFrame(() => {
    if (ref.current) {
      const targetY = hov ? 0.2 : 0;
      ref.current.position.y += (targetY - ref.current.position.y) * 0.12;
    }
  });
  return [hov, {
    onPointerOver: (e) => { e.stopPropagation(); setHov(true); document.body.style.cursor = 'pointer'; },
    onPointerOut: (e) => { setHov(false); document.body.style.cursor = 'auto'; },
  }];
}

// ── Floating SCADA Card ─────────────────────────────────────────────────────
export function FlightCard({ label, sub, status }) {
  const colors = {
    operational: '#22d3a5',
    warning: '#f59e0b',
    critical: '#ef4444',
    boarding: '#38bdf8',
    offline: '#6b7280',
    active: '#22d3a5',
  };
  const sc = colors[status] || '#22d3a5';

  return (
    <div style={{
      background: 'rgba(6, 12, 28, 0.94)',
      border: `1px solid ${sc}77`,
      borderRadius: 8,
      padding: '8px 14px',
      color: '#fff',
      fontFamily: 'monospace',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      backdropFilter: 'blur(12px)',
      boxShadow: `0 6px 24px rgba(0,0,0,0.7), 0 0 16px ${sc}33`,
      minWidth: 150,
    }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: '#f8fafc', letterSpacing: 0.8, marginBottom: 3 }}>
        {label}
      </div>
      <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 5 }}>
        {sub}
      </div>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: `${sc}22`,
        border: `1px solid ${sc}55`,
        borderRadius: 4,
        padding: '2px 8px',
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: sc, boxShadow: `0 0 6px ${sc}` }} />
        <span style={{ fontSize: 9, fontWeight: 800, color: sc, letterSpacing: 1 }}>{status?.toUpperCase()}</span>
      </div>
    </div>
  );
}

// ── Sculpted Lotus Petal ────────────────────────────────────────────────────
function LotusPetal({
  width = 10,
  length = 18,
  archHeight = 1.4,
  curveScale = 1.0,
  yOffset = 0,
  rotationY = 0,
  position = [0, 0, 0],
  isCenter = false,
}) {
  const geometry = useMemo(() => {
    // Generate curved petal mesh
    const shape = new THREE.Shape();
    // Parametric leaf/petal silhouette
    const steps = 32;
    const points = [];
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI; // 0 to PI
      const x = Math.sin(t) * (width / 2);
      const z = -Math.cos(t) * (length / 2);
      points.push(new THREE.Vector2(x, z));
    }
    shape.setFromPoints(points);

    // Extrude with chamfered bevel
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 0.35,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.15,
      bevelThickness: 0.15,
    });
    geom.rotateX(-Math.PI / 2);

    // Bend the petal along Z and X to create the architectural bloom
    const posAttr = geom.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const distFromCenter = Math.sqrt((x * 0.4) ** 2 + (z * 0.2) ** 2);
      // Upward arch in middle, downward swoop at edges
      const curvature = Math.sin((z / length + 0.5) * Math.PI) * archHeight - (x / width) ** 2 * 0.8;
      posAttr.setY(i, posAttr.getY(i) + curvature * curveScale);
    }
    geom.computeVertexNormals();
    return geom;
  }, [width, length, archHeight, curveScale]);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Petal Shell */}
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial {...WHITE_CANOPY} />
      </mesh>

      {/* Central Glass Skylight on Main Petal (Clean non-intersecting curved glass) */}
      {isCenter && (
        <group position={[0, 1.8, -1]}>
          <mesh position={[0, 0.35, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[1.2, 2.2, 10, 16, 1, false]} />
            <meshPhysicalMaterial
              {...GLASS_SKYLIGHT}
              depthWrite={true}
              polygonOffset={true}
              polygonOffsetFactor={-1}
              polygonOffsetUnits={-1}
            />
          </mesh>
          <pointLight position={[0, 2.0, 0]} color="#38bdf8" intensity={3} distance={22} decay={2} />
        </group>
      )}
    </group>
  );
}

// ── Wide Sculpted Concourse Wing (Wide Pier) ────────────────────────────────
function WideConcourseWing({
  position = [0, 0, 0],
  rotation = 0,
  length = 26,
  width = 8.5,      // Wide concourse body
  label = 'Concourse',
  status = 'operational',
  onSelect,
}) {
  const ref = useRef();
  const [hov, handlers] = useHover(ref);

  return (
    <group
      ref={ref}
      position={position}
      rotation={[0, rotation, 0]}
      {...handlers}
      onClick={() => onSelect?.({
        id: label,
        type: 'Concourse',
        status,
        zone: `${label} Sector`,
        metrics: {
          'Length': `${(length * 18).toFixed(0)}m`,
          'Width': '68m (Dual Apron)',
          'Gates Active': '12 Gates',
          'Capacity': '2,800 PAX/hr',
          'Status': status.toUpperCase(),
        },
      })}
    >
      {/* 1. Main Concourse Base Building */}
      <mesh position={[0, 1.1, -length / 2]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.92, 2.2, length]} />
        <meshStandardMaterial
          color={hov ? '#ffffff' : '#f8fafc'}
          metalness={0.3}
          roughness={0.25}
          emissive={hov ? '#38bdf8' : status === 'warning' ? '#f59e0b' : '#000000'}
          emissiveIntensity={hov ? 0.08 : status === 'warning' ? 0.05 : 0}
        />
      </mesh>

      {/* 2. Panoramic Glass Curtain Walls (Both Sides) */}
      <mesh position={[-width * 0.47, 1.15, -length / 2]}>
        <boxGeometry args={[0.08, 1.7, length - 0.4]} />
        <meshPhysicalMaterial {...GLASS_FACADE} />
      </mesh>
      <mesh position={[width * 0.47, 1.15, -length / 2]}>
        <boxGeometry args={[0.08, 1.7, length - 0.4]} />
        <meshPhysicalMaterial {...GLASS_FACADE} />
      </mesh>

      {/* 3. Sweeping Aerodynamic Roof Canopy */}
      <mesh position={[0, 2.35, -length / 2]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.35, length + 0.6]} />
        <meshStandardMaterial {...WHITE_CANOPY} />
      </mesh>

      {/* 4. Central Continuous Glass Skylight Ribbon along the Spine */}
      <mesh position={[0, 2.55, -length / 2]}>
        <boxGeometry args={[width * 0.32, 0.12, length - 1.2]} />
        <meshPhysicalMaterial {...GLASS_SKYLIGHT} />
      </mesh>

      {/* 5. Skylight Mullions / Grid Lines */}
      {Array.from({ length: Math.floor(length / 2.2) }, (_, i) => (
        <mesh key={i} position={[0, 2.62, -2 - i * 2.2]}>
          <boxGeometry args={[width * 0.34, 0.06, 0.12]} />
          <meshStandardMaterial {...METAL_TRIM} />
        </mesh>
      ))}

      {/* 6. Sculpted End Hammerhead / T-Bulb Terminal Pod */}
      <group position={[0, 0, -length]}>
        {/* Expanded T-head body */}
        <mesh position={[0, 1.1, -1.8]} castShadow receiveShadow>
          <boxGeometry args={[width * 1.75, 2.2, 4.2]} />
          <meshStandardMaterial {...WHITE_CANOPY} />
        </mesh>

        {/* T-head roof cap with curved edges */}
        <mesh position={[0, 2.35, -1.8]} castShadow>
          <boxGeometry args={[width * 1.82, 0.4, 4.6]} />
          <meshStandardMaterial {...WHITE_CANOPY} />
        </mesh>

        {/* Hammerhead Panoramic Glass Windows */}
        <mesh position={[0, 1.15, -3.92]}>
          <boxGeometry args={[width * 1.65, 1.7, 0.08]} />
          <meshPhysicalMaterial {...GLASS_FACADE} />
        </mesh>

        {/* Hammerhead Skylight */}
        <mesh position={[0, 2.58, -1.8]}>
          <boxGeometry args={[width * 0.8, 0.1, 2.4]} />
          <meshPhysicalMaterial {...GLASS_SKYLIGHT} />
        </mesh>

        {/* End Aerobridges */}
        {[-width * 0.7, 0, width * 0.7].map((x, i) => (
          <group key={i} position={[x, 0.8, -4.6]}>
            <mesh castShadow>
              <boxGeometry args={[0.32, 0.32, 1.6]} />
              <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.4} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 7. Dual Telescoping Jet Bridges (Aerobridges) on East and West sides */}
      {Array.from({ length: 5 }, (_, i) => {
        const z = -3.5 - i * 4.4;
        return (
          <group key={i}>
            {/* Left Bridge (Outer) */}
            <group position={[-width * 0.5 - 0.9, 0.85, z]}>
              <mesh castShadow>
                <boxGeometry args={[1.8, 0.3, 0.35]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.4} />
              </mesh>
              {/* Glass walkway section */}
              <mesh position={[0, 0.05, 0]}>
                <boxGeometry args={[1.2, 0.22, 0.38]} />
                <meshPhysicalMaterial {...GLASS_FACADE} />
              </mesh>
              {/* Rotunda / docking head */}
              <mesh position={[-0.95, -0.15, 0]}>
                <cylinderGeometry args={[0.3, 0.3, 0.5, 8]} />
                <meshStandardMaterial color="#475569" />
              </mesh>
            </group>

            {/* Right Bridge (Inner) */}
            <group position={[width * 0.5 + 0.9, 0.85, z]}>
              <mesh castShadow>
                <boxGeometry args={[1.8, 0.3, 0.35]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.4} />
              </mesh>
              <mesh position={[0, 0.05, 0]}>
                <boxGeometry args={[1.2, 0.22, 0.38]} />
                <meshPhysicalMaterial {...GLASS_FACADE} />
              </mesh>
              <mesh position={[0.95, -0.15, 0]}>
                <cylinderGeometry args={[0.3, 0.3, 0.5, 8]} />
                <meshStandardMaterial color="#475569" />
              </mesh>
            </group>
          </group>
        );
      })}

      {/* 8. Pulsing Status Indicator on Pier */}
      <StatusIndicator status={status} position={[0, 0.12, -length / 2]} radius={width * 0.4} />

      {/* 9. Interactive Hover Card */}
      {hov && (
        <Html position={[0, 4.5, -length / 2]} center distanceFactor={14}>
          <FlightCard
            label={label.toUpperCase()}
            sub={`${status === 'warning' ? '⚠ AHU-309 Service Notice' : '12 Boarding Gates Active'}`}
            status={status}
          />
        </Html>
      )}
    </group>
  );
}

// ── Full Grand Central Lotus Terminal Building ──────────────────────────────
function GrandLotusCentralHub({ onSelect }) {
  const ref = useRef();
  const [hov, handlers] = useHover(ref);

  return (
    <group
      ref={ref}
      position={[0, 0, 0]}
      {...handlers}
      onClick={() => onSelect?.({
        id: 'Lotus Terminal T1',
        type: 'Terminal',
        status: 'operational',
        zone: 'Central Lotus Headhouse',
        metrics: {
          'Building': 'Long Thanh T1 Central Terminal',
          'Architecture': 'Lotus Blossom Canopy',
          'Width': '380m Sweeping Span',
          'Capacity': '25 Million PAX/Year',
          'Active Systems': 'BHS, LBMS, VDGS, FAS Nominal',
          'Power Load': '2,480 kW',
        },
      })}
    >
      {/* 1. Terminal Base Plinth & Ground Hall */}
      <mesh position={[0, 1.0, 1]} castShadow receiveShadow>
        <boxGeometry args={[34, 2.0, 16]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.3} roughness={0.3} />
      </mesh>

      {/* 2. Grand Curved Glass Curtain Wall (Front / South Entrance) */}
      <mesh position={[0, 1.1, 9.05]}>
        <boxGeometry args={[32, 1.9, 0.1]} />
        <meshPhysicalMaterial {...GLASS_FACADE} />
      </mesh>

      {/* 3. Grand Curved Glass Curtain Wall (Airside / North) */}
      <mesh position={[0, 1.1, -7.05]}>
        <boxGeometry args={[30, 1.9, 0.1]} />
        <meshPhysicalMaterial {...GLASS_FACADE} />
      </mesh>

      {/* 4. Sweeping Lotus Blossom Canopy (Cascading Petal Layers) */}
      {/* Central Majestic Petal with Crystal Skylight */}
      <LotusPetal
        width={14}
        length={20}
        archHeight={1.8}
        curveScale={1.1}
        position={[0, 2.5, 0]}
        isCenter={true}
      />

      {/* Left Tier-1 Petal */}
      <LotusPetal
        width={11}
        length={18}
        archHeight={1.4}
        curveScale={0.95}
        rotationY={Math.PI / 10}
        position={[-7.5, 2.25, 0.5]}
      />

      {/* Right Tier-1 Petal */}
      <LotusPetal
        width={11}
        length={18}
        archHeight={1.4}
        curveScale={0.95}
        rotationY={-Math.PI / 10}
        position={[7.5, 2.25, 0.5]}
      />

      {/* Left Outer Tier-2 Petal (Flaring into West Wing) */}
      <LotusPetal
        width={9.5}
        length={16}
        archHeight={1.2}
        curveScale={0.85}
        rotationY={Math.PI / 5.2}
        position={[-14.5, 1.95, 1.2]}
      />

      {/* Right Outer Tier-2 Petal (Flaring into East Wing) */}
      <LotusPetal
        width={9.5}
        length={16}
        archHeight={1.2}
        curveScale={0.85}
        rotationY={-Math.PI / 5.2}
        position={[14.5, 1.95, 1.2]}
      />

      {/* Far Outer Left Petal (Transition) */}
      <LotusPetal
        width={7}
        length={13}
        archHeight={0.9}
        curveScale={0.7}
        rotationY={Math.PI / 3.8}
        position={[-20, 1.7, 2]}
      />

      {/* Far Outer Right Petal (Transition) */}
      <LotusPetal
        width={7}
        length={13}
        archHeight={0.9}
        curveScale={0.7}
        rotationY={-Math.PI / 3.8}
        position={[20, 1.7, 2]}
      />

      {/* 5. Elevated Landside Roadway Viaduct (South Face) */}
      <group position={[0, 0.65, 11.2]}>
        {/* Multi-lane curved departures deck */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[42, 0.28, 2.6]} />
          <meshStandardMaterial color="#334155" metalness={0.4} roughness={0.7} />
        </mesh>
        {/* Guard rails */}
        <mesh position={[0, 0.25, 1.25]}>
          <boxGeometry args={[42, 0.25, 0.08]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        <mesh position={[0, 0.25, -1.25]}>
          <boxGeometry args={[42, 0.25, 0.08]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        {/* Support pillars */}
        {[-18, -12, -6, 0, 6, 12, 18].map((x, i) => (
          <mesh key={i} position={[x, -0.35, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.25, 0.7, 8]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
        ))}
      </group>

      {/* 6. Central Pedestrian Glass Bridge to Car Park & Transit */}
      <group position={[0, 0.9, 15]}>
        <mesh castShadow>
          <boxGeometry args={[2.2, 0.6, 6]} />
          <meshStandardMaterial {...WHITE_CANOPY} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[1.8, 0.45, 5.8]} />
          <meshPhysicalMaterial {...GLASS_FACADE} />
        </mesh>
      </group>

      {/* 7. Landside Terraced Green Roof Parking Garden (Front of Terminal) */}
      <group position={[0, 0.2, 20]}>
        {/* Green terraced parking roof slabs */}
        <mesh receiveShadow castShadow>
          <boxGeometry args={[36, 0.4, 6]} />
          <meshStandardMaterial color="#15803d" roughness={0.8} />
        </mesh>
        {/* Wavy organic white garden terraces */}
        {Array.from({ length: 8 }, (_, i) => (
          <mesh key={i} position={[-14 + i * 4, 0.22, 0]}>
            <boxGeometry args={[0.25, 0.05, 5.6]} />
            <meshStandardMaterial color="#e2e8f0" />
          </mesh>
        ))}
      </group>


      {/* Hover Information */}
      {hov && (
        <Html position={[0, 7, 0]} center distanceFactor={16}>
          <FlightCard
            label="LONG THANH T1 LOTUS TERMINAL"
            sub="25M Annual PAX • All 12 Subsystems Nominal"
            status="operational"
          />
        </Html>
      )}
    </group>
  );
}

// ── Complete Digital Twin Terminal Model Export ─────────────────────────────
export default function TerminalModel({ onSelect }) {
  // Concourse angles to match the reference photo:
  // North Pier runs straight forward (Z negative).
  // West Wing sweeps out at ~62 degrees from North (~28 deg from horizontal).
  // East Wing sweeps out symmetrically to the right.
  const wingAngle = Math.PI / 2.9; // ~62 degrees

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Central Lotus Blossom Terminal Headhouse */}
      <GrandLotusCentralHub onSelect={onSelect} />

      {/* 2. Central North Concourse Wing (Wide Pier) */}
      <WideConcourseWing
        position={[0, 0, -8]}
        rotation={0}
        length={26}
        width={8.8} // Wide concourse
        label="North Pier Concourse"
        status="operational"
        onSelect={onSelect}
      />

      {/* 3. Left / West Concourse Wing (Wide Sweeping Wing) */}
      <WideConcourseWing
        position={[-12, 0, -1]}
        rotation={wingAngle}
        length={24}
        width={8.5} // Wide concourse
        label="West Concourse Wing"
        status="warning"
        onSelect={onSelect}
      />

      {/* 4. Right / East Concourse Wing (Wide Sweeping Wing) */}
      <WideConcourseWing
        position={[12, 0, -1]}
        rotation={-wingAngle}
        length={24}
        width={8.5} // Wide concourse
        label="East Concourse Wing"
        status="operational"
        onSelect={onSelect}
      />
    </group>
  );
}
