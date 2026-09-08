import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import StatusIndicator from './StatusIndicator';

// ═══════════════════════════════════════════════════════════════════════════
//  MATERIAL SYSTEM — High-Fidelity Architectural PBR (Matches LTIA Photo)
// ═══════════════════════════════════════════════════════════════════════════

// 1. Pearl White Lotus Petal Canopy (Fluoropolymer architectural finish)
const MAT_PETAL = {
  color: '#ffffff',
  metalness: 0.18,
  roughness: 0.22,
  side: THREE.DoubleSide,
};

// 2. Petal Underside / Soffit (Soft architectural shadow tone)
const MAT_SOFFIT = {
  color: '#cbd5e1',
  metalness: 0.1,
  roughness: 0.6,
  side: THREE.BackSide,
};

// 3. Facade Cladding / Concrete Structure (Warm off-white panel)
const MAT_PANEL = {
  color: '#e2e8f0',
  metalness: 0.15,
  roughness: 0.45,
};

// 4. Crystal Atrium Skylight (Vibrant cyan-blue high-specular reflective glass)
const MAT_CRYSTAL_GLASS = {
  color: '#38bdf8',
  transparent: true,
  opacity: 0.72,
  metalness: 0.95,
  roughness: 0.04,
  emissive: '#0284c7',
  emissiveIntensity: 0.42,
  depthWrite: false,
  side: THREE.DoubleSide,
};

// 5. Diagrid Skylight Mullion Steel (Gleaming white architectural frame)
const MAT_DIAGRID = {
  color: '#ffffff',
  metalness: 0.85,
  roughness: 0.15,
};

// 6. Curtain Wall Glazing (Airside & landside panoramic glass)
const MAT_CURTAIN_WALL = {
  color: '#0284c7',
  transparent: true,
  opacity: 0.55,
  metalness: 0.95,
  roughness: 0.05,
  emissive: '#0369a1',
  emissiveIntensity: 0.2,
  depthWrite: false,
};

// 7. Dark Structural Steel (Columns, brackets, jet bridge pedestals)
const MAT_STEEL = {
  color: '#1e293b',
  metalness: 0.85,
  roughness: 0.22,
};

// 8. Elevated Viaduct & Highway Asphalt
const MAT_ROADWAY = {
  color: '#1e2530',
  metalness: 0.05,
  roughness: 0.88,
};

// 9. Concrete Piers & Road Kerbs
const MAT_CONCRETE = {
  color: '#94a3b8',
  metalness: 0.05,
  roughness: 0.75,
};

// 10. GTC Green Roof Turf (Lush vibrant grass)
const MAT_GREEN_ROOF = {
  color: '#15803d',
  metalness: 0.0,
  roughness: 0.92,
};

// 11. GTC White Terrace Contour Ribbons
const MAT_WHITE_TERRACE = {
  color: '#ffffff',
  metalness: 0.1,
  roughness: 0.3,
};

// ═══════════════════════════════════════════════════════════════════════════
//  HOVER HOOK & SCADA HUD
// ═══════════════════════════════════════════════════════════════════════════
function useHover(ref) {
  const [hov, setHov] = useState(false);
  useFrame(() => {
    if (ref.current) {
      const ty = hov ? 0.15 : 0;
      ref.current.position.y += (ty - ref.current.position.y) * 0.1;
    }
  });
  return [hov, {
    onPointerOver: (e) => { e.stopPropagation(); setHov(true); document.body.style.cursor = 'pointer'; },
    onPointerOut: () => { setHov(false); document.body.style.cursor = 'auto'; },
  }];
}

export function FlightCard({ label, sub, status }) {
  const colors = {
    operational: '#22d3a5', warning: '#f59e0b', critical: '#ef4444',
    boarding: '#38bdf8', offline: '#6b7280', active: '#22d3a5',
  };
  const sc = colors[status] || '#22d3a5';
  return (
    <div style={{
      background: 'rgba(4,10,24,0.95)', border: `1px solid ${sc}88`,
      borderRadius: 8, padding: '8px 14px', color: '#fff',
      fontFamily: 'monospace', whiteSpace: 'nowrap', pointerEvents: 'none',
      backdropFilter: 'blur(16px)',
      boxShadow: `0 8px 32px rgba(0,0,0,0.8), 0 0 16px ${sc}44`, minWidth: 160,
    }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: '#f8fafc', letterSpacing: 0.8, marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 5 }}>{sub}</div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
        background: `${sc}22`, border: `1px solid ${sc}55`, borderRadius: 4, padding: '2px 8px' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: sc, boxShadow: `0 0 6px ${sc}` }} />
        <span style={{ fontSize: 9, fontWeight: 800, color: sc, letterSpacing: 1 }}>{status?.toUpperCase()}</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  PARAMETRIC DOUBLE-CURVED LOTUS PETAL GEOMETRY (Correct Upward Normals)
// ═══════════════════════════════════════════════════════════════════════════
function createPetalGeometry({
  length = 21,
  startWidth = 0.5,
  midWidth = 15,
  endWidth = 4,
  peakHeight = 3.6,
  dishDepth = 1.3,
  upturnEdge = 0.35,
  lateralCurve = 0,
  zStart = 11,
  segL = 40,
  segW = 28,
}) {
  const verts = [];
  const idxs = [];

  for (let l = 0; l <= segL; l++) {
    const v = l / segL; // 0 = front (south tip), 1 = rear (north)
    const z = zStart - v * length;

    // Width curve: smooth aerodynamic petal silhouette
    let currentWidth;
    if (v < 0.42) {
      currentWidth = THREE.MathUtils.lerp(startWidth, midWidth, Math.sin((v / 0.42) * (Math.PI / 2)));
    } else {
      currentWidth = THREE.MathUtils.lerp(midWidth, endWidth, Math.sin(((v - 0.42) / 0.58) * (Math.PI / 2)));
    }

    // Spine height profile: arching gracefully
    const spineY = 2.4 + Math.sin(v * Math.PI * 0.92 + 0.08) * peakHeight;
    // Lateral sweep for flanking petals
    const sweepX = Math.pow(v, 1.15) * lateralCurve;

    for (let w = 0; w <= segW; w++) {
      const u = (w / segW) * 2 - 1; // -1 to +1
      const x = sweepX + u * (currentWidth * 0.5);

      // Transverse curvature (smooth arched dome shell with upturned tip)
      const arch = (1 - u * u) * dishDepth;
      const lip = Math.abs(u) > 0.78 ? Math.pow((Math.abs(u) - 0.78) / 0.22, 2) * upturnEdge : 0;
      const y = spineY + arch + lip;

      verts.push(x, y, z);
    }
  }

  // Winding order (a, b, c, b, d, c) ensures normals point UPWARDS (+Y towards the sun)
  for (let l = 0; l < segL; l++) {
    for (let w = 0; w < segW; w++) {
      const a = l * (segW + 1) + w;
      const b = a + 1;
      const c = (l + 1) * (segW + 1) + w;
      const d = c + 1;
      idxs.push(a, b, c, b, d, c);
    }
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  geom.setIndex(idxs);
  geom.computeVertexNormals();
  return geom;
}

// ═══════════════════════════════════════════════════════════════════════════
//  1. CENTRAL CRYSTAL ATRIUM SKYLIGHT (Signature Diamond Lotus in Photo)
// ═══════════════════════════════════════════════════════════════════════════
function CentralCrystalAtrium() {
  const { glassGeom, diagridLines, spineGeom } = useMemo(() => {
    const segL = 44;
    const segW = 32;
    const zStart = 6.5;
    const zEnd = -8.2;
    const length = zStart - zEnd;
    const maxW = 9.6;
    const domeH = 2.1;

    const verts = [];
    const idxs = [];
    const lines = [];

    for (let l = 0; l <= segL; l++) {
      const v = l / segL; // 0 = south tip, 1 = north tip
      const z = zStart - v * length;
      // Mandorla (vesica piscis) envelope: 0 at both tips, maximum in center
      const wWidth = Math.sin(v * Math.PI) * maxW;
      const spineY = 4.4 + Math.sin(v * Math.PI) * domeH;

      for (let w = 0; w <= segW; w++) {
        const u = (w / segW) * 2 - 1;
        const x = u * (wWidth * 0.5);
        // Transverse dome curve
        const y = spineY + (1 - u * u) * 0.85;
        verts.push(x, y, z);
      }
    }

    // Winding order with upward normals
    for (let l = 0; l < segL; l++) {
      for (let w = 0; w < segW; w++) {
        const a = l * (segW + 1) + w;
        const b = a + 1;
        const c = (l + 1) * (segW + 1) + w;
        const d = c + 1;
        idxs.push(a, b, c, b, d, c);

        // Diagrid triangular structural mullions (geometric diamond lattice)
        if ((l + w) % 2 === 0) {
          lines.push(
            new THREE.Vector3(verts[a * 3], verts[a * 3 + 1] + 0.04, verts[a * 3 + 2]),
            new THREE.Vector3(verts[d * 3], verts[d * 3 + 1] + 0.04, verts[d * 3 + 2])
          );
        } else {
          lines.push(
            new THREE.Vector3(verts[b * 3], verts[b * 3 + 1] + 0.04, verts[b * 3 + 2]),
            new THREE.Vector3(verts[c * 3], verts[c * 3 + 1] + 0.04, verts[c * 3 + 2])
          );
        }
      }
    }

    const gGlass = new THREE.BufferGeometry();
    gGlass.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    gGlass.setIndex(idxs);
    gGlass.computeVertexNormals();

    const gDiagrid = new THREE.BufferGeometry().setFromPoints(lines);

    return { glassGeom: gGlass, diagridLines: gDiagrid };
  }, []);

  return (
    <group>
      {/* Translucent Cyan Crystal Dome Shell */}
      <mesh geometry={glassGeom} castShadow receiveShadow>
        <meshPhysicalMaterial {...MAT_CRYSTAL_GLASS} />
      </mesh>

      {/* Silver / White Diagrid Structural Triangular Lattice (Matches photo) */}
      <lineSegments geometry={diagridLines}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.88} linewidth={2} />
      </lineSegments>

      {/* Internal Luminous Glow */}
      <pointLight position={[0, 5.8, 0]} color="#38bdf8" intensity={6} distance={28} decay={2} />
      <pointLight position={[0, 4.8, 3.5]} color="#bae6fd" intensity={4} distance={20} decay={2} />
      <pointLight position={[0, 4.8, -3.5]} color="#bae6fd" intensity={4} distance={20} decay={2} />

      {/* Central Roof Spine Ridge connecting directly to North Pier */}
      <mesh position={[0, 4.8, -9.0]} castShadow>
        <boxGeometry args={[1.8, 0.45, 3.2]} />
        <meshStandardMaterial {...MAT_PETAL} />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  2. FULL LOTUS CANOPY — 7 Interlocking Sculpted Petals
// ═══════════════════════════════════════════════════════════════════════════
function FullLotusCanopy() {
  // Central Petal (Houses the Crystal Atrium)
  const centralPetalGeom = useMemo(() => createPetalGeometry({
    length: 20.5,
    startWidth: 1.0,
    midWidth: 17.5,
    endWidth: 6.0,
    peakHeight: 3.8,
    dishDepth: 1.8,
    upturnEdge: 0.45,
    zStart: 11.5,
  }), []);

  // Flanking Inner Petals (Left & Right - Tier 1)
  const innerLeftGeom = useMemo(() => createPetalGeometry({
    length: 19.5,
    startWidth: 1.0,
    midWidth: 14.8,
    endWidth: 5.2,
    peakHeight: 3.5,
    dishDepth: 1.5,
    upturnEdge: 0.38,
    lateralCurve: -6.0,
    zStart: 10.8,
  }), []);

  const innerRightGeom = useMemo(() => createPetalGeometry({
    length: 19.5,
    startWidth: 1.0,
    midWidth: 14.8,
    endWidth: 5.2,
    peakHeight: 3.5,
    dishDepth: 1.5,
    upturnEdge: 0.38,
    lateralCurve: 6.0,
    zStart: 10.8,
  }), []);

  // Flanking Mid Petals (Left & Right - Tier 2)
  const midLeftGeom = useMemo(() => createPetalGeometry({
    length: 18.5,
    startWidth: 0.8,
    midWidth: 13.5,
    endWidth: 4.8,
    peakHeight: 3.1,
    dishDepth: 1.4,
    upturnEdge: 0.32,
    lateralCurve: -12.0,
    zStart: 9.8,
  }), []);

  const midRightGeom = useMemo(() => createPetalGeometry({
    length: 18.5,
    startWidth: 0.8,
    midWidth: 13.5,
    endWidth: 4.8,
    peakHeight: 3.1,
    dishDepth: 1.4,
    upturnEdge: 0.32,
    lateralCurve: 12.0,
    zStart: 9.8,
  }), []);

  // Flanking Outer Transition Petals (Left & Right - Tier 3, flowing into concourses)
  const outerLeftGeom = useMemo(() => createPetalGeometry({
    length: 17.0,
    startWidth: 0.6,
    midWidth: 12.0,
    endWidth: 4.2,
    peakHeight: 2.7,
    dishDepth: 1.2,
    upturnEdge: 0.28,
    lateralCurve: -18.0,
    zStart: 8.5,
  }), []);

  const outerRightGeom = useMemo(() => createPetalGeometry({
    length: 17.0,
    startWidth: 0.6,
    midWidth: 12.0,
    endWidth: 4.2,
    peakHeight: 2.7,
    dishDepth: 1.2,
    upturnEdge: 0.28,
    lateralCurve: 18.0,
    zStart: 8.5,
  }), []);

  return (
    <group>
      {/* Central Lotus Master Petal */}
      <mesh geometry={centralPetalGeom} castShadow receiveShadow>
        <meshStandardMaterial {...MAT_PETAL} />
      </mesh>

      {/* Inner Petals (Tier 1) */}
      <mesh geometry={innerLeftGeom} position={[-2.2, -0.18, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...MAT_PETAL} />
      </mesh>
      <mesh geometry={innerRightGeom} position={[2.2, -0.18, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...MAT_PETAL} />
      </mesh>

      {/* Mid Petals (Tier 2) */}
      <mesh geometry={midLeftGeom} position={[-5.0, -0.42, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...MAT_PETAL} />
      </mesh>
      <mesh geometry={midRightGeom} position={[5.0, -0.42, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...MAT_PETAL} />
      </mesh>

      {/* Outer Transition Petals (Tier 3) */}
      <mesh geometry={outerLeftGeom} position={[-8.5, -0.68, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...MAT_PETAL} />
      </mesh>
      <mesh geometry={outerRightGeom} position={[8.5, -0.68, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...MAT_PETAL} />
      </mesh>

      {/* Central Diamond Crystal Atrium Skylight */}
      <CentralCrystalAtrium />
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  3. TERMINAL BUILDING BODY & FACADES (Underneath the Lotus Canopy)
// ═══════════════════════════════════════════════════════════════════════════
function TerminalBuildingBody() {
  return (
    <group position={[0, 0, 0]}>
      {/* Recessed building base (Tucked under the lotus overhang, no box sticking out) */}
      <mesh position={[0, 0.5, 0.5]} receiveShadow castShadow>
        <boxGeometry args={[34, 1.0, 16]} />
        <meshStandardMaterial {...MAT_PANEL} />
      </mesh>

      {/* Departures hall upper floor */}
      <mesh position={[0, 1.6, 0.5]} receiveShadow castShadow>
        <boxGeometry args={[32, 1.4, 15]} />
        <meshStandardMaterial {...MAT_PANEL} />
      </mesh>

      {/* South landside curtain wall (Under front lotus overhang) */}
      <mesh position={[0, 1.6, 8.2]}>
        <boxGeometry args={[30, 2.2, 0.08]} />
        <meshPhysicalMaterial {...MAT_CURTAIN_WALL} />
      </mesh>

      {/* North airside curtain wall */}
      <mesh position={[0, 1.6, -7.2]}>
        <boxGeometry args={[28, 2.2, 0.08]} />
        <meshPhysicalMaterial {...MAT_CURTAIN_WALL} />
      </mesh>

      {/* East & West side curtain walls */}
      <mesh position={[-15.8, 1.6, 0.5]}>
        <boxGeometry args={[0.08, 2.2, 14.5]} />
        <meshPhysicalMaterial {...MAT_CURTAIN_WALL} />
      </mesh>
      <mesh position={[15.8, 1.6, 0.5]}>
        <boxGeometry args={[0.08, 2.2, 14.5]} />
        <meshPhysicalMaterial {...MAT_CURTAIN_WALL} />
      </mesh>

      {/* Interior Warm Illuminated Volume */}
      <mesh position={[0, 1.6, 0.5]}>
        <boxGeometry args={[31.6, 1.8, 14.6]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#ea580c"
          emissiveIntensity={0.25}
          transparent
          opacity={0.18}
        />
      </mesh>

      {/* Architectural Y-Columns supporting front overhang */}
      {[-12, -7.5, -3, 3, 7.5, 12].map((x, i) => (
        <group key={i} position={[x, 0.5, 8.4]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.2, 2.6, 8]} />
            <meshStandardMaterial {...MAT_STEEL} />
          </mesh>
          <mesh position={[-0.3, 1.1, 0]} rotation={[0, 0, 0.42]} castShadow>
            <cylinderGeometry args={[0.08, 0.12, 0.8, 8]} />
            <meshStandardMaterial {...MAT_STEEL} />
          </mesh>
          <mesh position={[0.3, 1.1, 0]} rotation={[0, 0, -0.42]} castShadow>
            <cylinderGeometry args={[0.08, 0.12, 0.8, 8]} />
            <meshStandardMaterial {...MAT_STEEL} />
          </mesh>
        </group>
      ))}

      {/* Covered Passenger Drop-Off Canopy */}
      <group position={[0, 1.25, 10.5]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[38, 0.18, 3.2]} />
          <meshStandardMaterial {...MAT_PETAL} />
        </mesh>
        {/* Soffit LED strip */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[37, 0.02, 2.8]} />
          <meshStandardMaterial color="#fffbeb" emissive="#fde047" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  4. GROUND TRANSPORTATION CENTER (GTC) & WAVY GREEN ROOF TERRACES
// ═══════════════════════════════════════════════════════════════════════════
function GroundTransportationCenter() {
  return (
    <group position={[0, 0, 17]}>
      {/* Central pedestrian glazed connector bridge from Terminal to GTC */}
      <group position={[0, 1.25, -3.2]}>
        <mesh castShadow>
          <boxGeometry args={[3.8, 0.14, 5.0]} />
          <meshStandardMaterial {...MAT_PETAL} />
        </mesh>
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[1.8, 1.8, 5.0, 16, 1, false, 0, Math.PI]} rotation={[Math.PI / 2, 0, 0]} />
          <meshPhysicalMaterial {...MAT_CRYSTAL_GLASS} opacity={0.68} />
        </mesh>
        <pointLight position={[0, 0.75, 0]} color="#38bdf8" intensity={2.5} distance={10} decay={2} />
      </group>

      {/* Elevated Viaduct Drop-off Flyover Roadway */}
      <group position={[0, 0.68, -2.8]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[52, 0.22, 4.0]} />
          <meshStandardMaterial {...MAT_ROADWAY} />
        </mesh>
        {/* Guardrails */}
        {[-1.95, 1.95].map((z, i) => (
          <mesh key={i} position={[0, 0.22, z]}>
            <boxGeometry args={[52, 0.28, 0.08]} />
            <meshStandardMaterial {...MAT_CONCRETE} />
          </mesh>
        ))}
        {/* Support piers */}
        {[-22, -14, -6, 2, 10, 18, 26].map((x, i) => (
          <mesh key={i} position={[x, -0.6, 0]} castShadow>
            <cylinderGeometry args={[0.28, 0.32, 1.2, 8]} />
            <meshStandardMaterial {...MAT_CONCRETE} />
          </mesh>
        ))}
      </group>

      {/* Two Symmetrical Crescent Green Roof Car Park / Garden Structures */}
      {[-1, 1].map((side, i) => (
        <group key={i} position={[side * 12.8, 0.25, 2.2]}>
          {/* Main green roof terrace base */}
          <mesh receiveShadow castShadow>
            <boxGeometry args={[20.5, 0.5, 9.2]} />
            <meshStandardMaterial {...MAT_GREEN_ROOF} />
          </mesh>

          {/* Organic white terrace contour stripes (Signature LTIA GTC design in photo) */}
          {Array.from({ length: 8 }, (_, j) => {
            const xOffset = -8.2 + j * 2.35;
            return (
              <mesh key={j} position={[xOffset, 0.27, 0]} castShadow>
                <boxGeometry args={[0.3, 0.06, 8.8]} />
                <meshStandardMaterial {...MAT_WHITE_TERRACE} />
              </mesh>
            );
          })}

          {/* Light wells / open air courtyards in the green roof */}
          {[-4.2, 4.2].map((lx, k) => (
            <mesh key={k} position={[lx, 0.24, 0]}>
              <boxGeometry args={[2.4, 0.18, 3.8]} />
              <meshStandardMaterial color="#0f172a" roughness={0.9} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Central APM Station with curved roof (center south) */}
      <group position={[0, 0.55, 6.8]}>
        <mesh castShadow>
          <boxGeometry args={[6.8, 0.75, 3.4]} />
          <meshStandardMaterial {...MAT_PANEL} />
        </mesh>
        <mesh position={[0, 0.48, 0]} castShadow>
          <cylinderGeometry args={[3.4, 3.7, 0.28, 24]} />
          <meshStandardMaterial {...MAT_PETAL} />
        </mesh>
      </group>

      {/* Landside Highway Corridor & Green Buffer with Trees */}
      <group position={[0, 0.05, 10.2]}>
        <mesh receiveShadow>
          <boxGeometry args={[78, 0.08, 3.5]} />
          <meshStandardMaterial {...MAT_ROADWAY} />
        </mesh>
        {/* Landscaped median trees */}
        {[-32, -24, -16, -8, 0, 8, 16, 24, 32].map((tx, idx) => (
          <group key={idx} position={[tx, 0.1, 3.0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.08, 0.12, 0.6, 6]} />
              <meshStandardMaterial color="#422006" />
            </mesh>
            <mesh position={[0, 0.7, 0]} castShadow>
              <sphereGeometry args={[0.68, 8, 6]} />
              <meshStandardMaterial color="#166534" roughness={0.9} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  5. AERODYNAMIC CONCOURSE PIERS (North Pier, West Wing, East Wing)
// ═══════════════════════════════════════════════════════════════════════════
function ConcoursePier({
  position = [0, 0, 0],
  rotation = 0,
  length = 26,
  width = 5.6,
  label = 'Concourse',
  status = 'operational',
  onSelect,
}) {
  const ref = useRef();
  const [hov, handlers] = useHover(ref);

  // Aerodynamic curved white roof geometry (Correct upward normals)
  const roofGeom = useMemo(() => {
    const lSeg = 28;
    const wSeg = 18;
    const arcH = 0.7;
    const verts = [];
    const idxs = [];

    for (let l = 0; l <= lSeg; l++) {
      const v = l / lSeg;
      const z = -v * length;
      for (let w = 0; w <= wSeg; w++) {
        const u = (w / wSeg) * 2 - 1;
        const x = u * (width * 0.52);
        // Smooth arched roof
        const y = Math.cos(u * (Math.PI / 2)) * arcH;
        verts.push(x, y, z);
      }
    }

    for (let l = 0; l < lSeg; l++) {
      for (let w = 0; w < wSeg; w++) {
        const a = l * (wSeg + 1) + w;
        const b = a + 1;
        const c = (l + 1) * (wSeg + 1) + w;
        const d = c + 1;
        idxs.push(a, b, c, b, d, c);
      }
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    g.setIndex(idxs);
    g.computeVertexNormals();
    return g;
  }, [width, length]);

  return (
    <group
      ref={ref}
      position={position}
      rotation={[0, rotation, 0]}
      {...handlers}
      onClick={() => onSelect?.({
        id: label,
        type: 'Concourse Pier',
        status,
        zone: `${label} Sector`,
        metrics: {
          'Length': `${(length * 18).toFixed(0)}m`,
          'Width': '38m Aerodynamic Pier',
          'Active Gates': '10 Gates',
          'Capacity': '2,400 PAX/hr',
          'Status': status.toUpperCase(),
        },
      })}
    >
      {/* Lower service deck */}
      <mesh position={[0, 0.45, -length / 2]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.88, 0.9, length]} />
        <meshStandardMaterial {...MAT_PANEL} />
      </mesh>

      {/* Upper passenger boarding hall */}
      <mesh position={[0, 1.45, -length / 2]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.84, 1.35, length]} />
        <meshStandardMaterial
          color={hov ? '#ffffff' : '#f1f5f9'}
          metalness={0.15}
          roughness={0.35}
          emissive={hov ? '#38bdf8' : '#000000'}
          emissiveIntensity={hov ? 0.08 : 0}
        />
      </mesh>

      {/* Continuous panoramic glass curtain walls on both sides */}
      {[-1, 1].map((side, i) => (
        <mesh key={i} position={[side * width * 0.43, 1.45, -length / 2]}>
          <boxGeometry args={[0.08, 1.3, length - 0.2]} />
          <meshPhysicalMaterial {...MAT_CURTAIN_WALL} />
        </mesh>
      ))}

      {/* Aerodynamic arched pure pearl-white roof shell */}
      <mesh geometry={roofGeom} position={[0, 2.15, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...MAT_PETAL} />
      </mesh>

      {/* Central linear cyan skylight ribbon running along pier spine */}
      <mesh position={[0, 2.3, -length / 2]}>
        <boxGeometry args={[width * 0.24, 0.06, length - 0.8]} />
        <meshPhysicalMaterial {...MAT_CRYSTAL_GLASS} emissiveIntensity={0.25} />
      </mesh>

      {/* Hammerhead End Pod at the tip of the concourse (Rounded aerodynamic terminal head) */}
      <group position={[0, 0, -length]}>
        <mesh position={[0, 1.35, -2.4]} castShadow receiveShadow>
          <cylinderGeometry args={[width * 0.88, width * 0.88, 2.1, 24]} />
          <meshStandardMaterial {...MAT_PANEL} />
        </mesh>
        <mesh position={[0, 2.45, -2.4]} castShadow>
          <cylinderGeometry args={[width * 0.92, width * 0.92, 0.2, 24]} />
          <meshStandardMaterial {...MAT_PETAL} />
        </mesh>
        {/* Panoramic end glass arc */}
        <mesh position={[0, 1.35, -2.4]}>
          <cylinderGeometry args={[width * 0.89, width * 0.89, 1.4, 24, 1, false, Math.PI * 0.75, Math.PI * 1.5]} />
          <meshPhysicalMaterial {...MAT_CURTAIN_WALL} />
        </mesh>
      </group>

      {/* Jet Bridges (5 Pairs along length) */}
      {Array.from({ length: 5 }, (_, i) => {
        const z = -3.8 - i * (length * 0.78 / 5);
        return (
          <React.Fragment key={i}>
            {[-1, 1].map((side, j) => (
              <group key={j} position={[side * (width * 0.5 + 1.05), 0.95, z]}>
                {/* Telescopic walkway tunnel */}
                <mesh castShadow>
                  <boxGeometry args={[2.1, 0.42, 0.4]} />
                  <meshStandardMaterial {...MAT_PANEL} />
                </mesh>
                {/* Glass observation strip */}
                <mesh position={[0, 0.18, 0]}>
                  <boxGeometry args={[1.8, 0.06, 0.38]} />
                  <meshPhysicalMaterial {...MAT_CURTAIN_WALL} />
                </mesh>
                {/* Aircraft docking rotunda */}
                <mesh position={[side * 1.05, -0.08, 0]} castShadow>
                  <cylinderGeometry args={[0.25, 0.3, 0.38, 10]} />
                  <meshStandardMaterial {...MAT_STEEL} />
                </mesh>
              </group>
            ))}
          </React.Fragment>
        );
      })}

      {/* Status indicator ring */}
      <StatusIndicator status={status} position={[0, 0.1, -length / 2]} radius={width * 0.38} />

      {/* Hover SCADA HUD */}
      {hov && (
        <Html position={[0, 5.8, -length / 2]} center distanceFactor={15}>
          <FlightCard
            label={label.toUpperCase()}
            sub={status === 'warning' ? '⚠ AHU-204 Service Alert' : '10 Boarding Gates Operational'}
            status={status}
          />
        </Html>
      )}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  ROOT TERMINAL MODEL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function TerminalModel({ onSelect }) {
  const [hovHub, setHovHub] = useState(false);
  // Concourse wing angle: ~62 degrees matching the LTIA architectural masterplan
  const wingAngle = Math.PI / 2.9;

  return (
    <group position={[0, 0, 0]}>
      {/* ── 1. CENTRAL LOTUS HEADHOUSE ──────────────────────────────────── */}
      <group
        onPointerOver={(e) => { e.stopPropagation(); setHovHub(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovHub(false); document.body.style.cursor = 'auto'; }}
        onClick={() => onSelect?.({
          id: 'Long Thanh Lotus Terminal T1',
          type: 'Terminal Headhouse',
          status: 'operational',
          zone: 'Central Lotus Blossom Hub',
          metrics: {
            'Architecture': 'Vietnamese Lotus Flower (Heerim Design)',
            'Capacity': '25 Million PAX / Year',
            'Subsystems Active': 'All 12 SCADA Systems Nominal',
            'Total Power': '2,480 kW Active Load',
            'Peak Flow': '4,800 PAX / Hour',
          },
        })}
      >
        <TerminalBuildingBody />
        <FullLotusCanopy />

        {hovHub && (
          <Html position={[0, 14, 0]} center distanceFactor={18}>
            <FlightCard
              label="LONG THANH INTL TERMINAL 1 (LOTUS HUB)"
              sub="25M Annual PAX  •  Heerim Lotus Architecture"
              status="operational"
            />
          </Html>
        )}
      </group>

      {/* ── 2. GROUND TRANSPORTATION CENTER (GTC) & TERRACES ─────────────── */}
      <GroundTransportationCenter />

      {/* ── 3. NORTH PIER CONCOURSE (Straight North) ─────────────────────── */}
      <ConcoursePier
        position={[0, 0, -8.6]}
        rotation={0}
        length={28}
        width={5.8}
        label="North Pier Concourse"
        status="operational"
        onSelect={onSelect}
      />

      {/* ── 4. WEST CONCOURSE WING ───────────────────────────────────────── */}
      <ConcoursePier
        position={[-13.5, 0, -1.2]}
        rotation={wingAngle}
        length={26}
        width={5.4}
        label="West Concourse Wing"
        status="warning"
        onSelect={onSelect}
      />

      {/* ── 5. EAST CONCOURSE WING ───────────────────────────────────────── */}
      <ConcoursePier
        position={[13.5, 0, -1.2]}
        rotation={-wingAngle}
        length={26}
        width={5.4}
        label="East Concourse Wing"
        status="operational"
        onSelect={onSelect}
      />
    </group>
  );
}
