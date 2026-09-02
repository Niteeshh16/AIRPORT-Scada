import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import StatusIndicator from './StatusIndicator';
import { FlightCard } from './TerminalModel';

// ── More realistic aircraft body ─────────────────────────────────────────────
export function Aircraft({ position = [0, 0.1, 0], rotation = 0, label = 'VN-A001', flight = '', status = 'operational', time = '', onSelect }) {
  const ref = useRef();
  const [hov, setHov] = useState(false);

  useFrame(() => {
    if (ref.current) ref.current.position.y += ((hov ? 0.25 : 0.1) - ref.current.position.y) * 0.1;
  });

  const col = status === 'boarding' ? '#f0f6ff' : status === 'critical' ? '#ffe0e0' : '#eef3fa';
  const accentCol = status === 'boarding' ? '#38bdf8' : status === 'critical' ? '#ef4444' : '#a8c8e8';

  return (
    <group ref={ref} position={position} rotation={[0, rotation, 0]}
      onPointerOver={() => { setHov(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHov(false); document.body.style.cursor = 'auto'; }}
      onClick={() => onSelect?.({
        id: label, type: 'Aircraft', status, zone: 'Apron Stand',
        metrics: { 'Flight': flight || label, 'Status': status, 'Departure': time || '—', 'Type': 'Wide Body', 'Stand': label }
      })}
    >
      {/* Fuselage */}
      <mesh castShadow>
        <capsuleGeometry args={[0.25, 1.4, 4, 12]} />
        <meshStandardMaterial color={col} metalness={0.6} roughness={0.25} emissive={hov ? accentCol : '#000'} emissiveIntensity={hov ? 0.15 : 0} />
      </mesh>

      {/* Wings */}
      <mesh position={[0, -0.02, 0.1]} castShadow>
        <boxGeometry args={[2.8, 0.055, 0.55]} />
        <meshStandardMaterial color={col} metalness={0.55} roughness={0.3} />
      </mesh>
      {/* Wing sweep leading edge */}
      <mesh position={[-0.7, -0.01, -0.05]} rotation={[0, -0.2, 0]}>
        <boxGeometry args={[1.4, 0.04, 0.15]} />
        <meshStandardMaterial color={col} metalness={0.55} roughness={0.3} />
      </mesh>
      <mesh position={[0.7, -0.01, -0.05]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[1.4, 0.04, 0.15]} />
        <meshStandardMaterial color={col} metalness={0.55} roughness={0.3} />
      </mesh>

      {/* Tail horizontal stabilizer */}
      <mesh position={[0, 0.05, -0.7]}>
        <boxGeometry args={[1.0, 0.04, 0.28]} />
        <meshStandardMaterial color={col} metalness={0.55} roughness={0.3} />
      </mesh>
      {/* Tail fin */}
      <mesh position={[0, 0.3, -0.68]}>
        <boxGeometry args={[0.06, 0.55, 0.32]} />
        <meshStandardMaterial color={accentCol} metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Engines */}
      {[[-0.85, 0], [0.85, 0]].map(([ex], i) => (
        <group key={i} position={[ex, -0.14, 0.2]}>
          <mesh>
            <cylinderGeometry args={[0.09, 0.1, 0.4, 8]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, -0.22]}>
            <cylinderGeometry args={[0.08, 0.09, 0.06, 8]} />
            <meshStandardMaterial color="#333" metalness={0.9} roughness={0.15} />
          </mesh>
        </group>
      ))}

      {/* Airline accent stripe */}
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.025, 0.025, 1.38]} />
        <meshBasicMaterial color={accentCol} />
      </mesh>

      <StatusIndicator status={status} position={[0, 0.6, 0]} radius={0.6} />

      {hov && (
        <Html position={[0, 1.5, 0]} center distanceFactor={10}>
          <FlightCard label={`${flight || label}`} sub={time ? `Dep: ${time}` : 'At Stand'} status={status} />
        </Html>
      )}
    </group>
  );
}

// ── Animated taxiing aircraft ─────────────────────────────────────────────────
export function TaxiingAircraft({ path = [], speed = 0.002 }) {
  const ref = useRef();
  const t = useRef(Math.random());

  useFrame(() => {
    if (!ref.current || path.length < 2) return;
    t.current = (t.current + speed) % 1;
    const segs = path.length - 1;
    const st = t.current * segs;
    const idx = Math.min(Math.floor(st), segs - 1);
    const lt = st - idx;
    const a = path[idx], b = path[idx + 1];
    ref.current.position.x = a[0] + (b[0] - a[0]) * lt;
    ref.current.position.z = a[2] + (b[2] - a[2]) * lt;
    ref.current.rotation.y = Math.atan2(b[0] - a[0], b[2] - a[2]);
  });

  return (
    <group ref={ref} position={path[0] || [0, 0.1, 0]} scale={0.85}>
      <mesh castShadow>
        <capsuleGeometry args={[0.22, 1.2, 4, 12]} />
        <meshStandardMaterial color="#e8eef5" metalness={0.55} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.02, 0.08]}>
        <boxGeometry args={[2.4, 0.05, 0.48]} />
        <meshStandardMaterial color="#e8eef5" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.3, -0.6]}>
        <boxGeometry args={[0.06, 0.5, 0.28]} />
        <meshStandardMaterial color="#38bdf8" metalness={0.5} roughness={0.3} />
      </mesh>
      <StatusIndicator status="active" position={[0, 0.5, 0]} radius={0.5} />
    </group>
  );
}

export default Aircraft;
