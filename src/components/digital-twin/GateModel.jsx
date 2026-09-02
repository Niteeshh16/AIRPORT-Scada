import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import StatusIndicator from './StatusIndicator';
import { FlightCard } from './TerminalModel';

export default function GateModel({
  position = [0, 0, 0],
  rotation = 0,
  label = 'Gate',
  status = 'operational',
  onSelect
}) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (ref.current) {
      const targetY = hovered ? 0.15 : 0;
      ref.current.position.y += (targetY - ref.current.position.y) * 0.15;
    }
  });

  const statusColors = {
    operational: '#22d3a5',
    warning: '#f59e0b',
    critical: '#ef4444',
    boarding: '#38bdf8',
    offline: '#6b7280',
    occupied: '#38bdf8'
  };
  const color = statusColors[status] || '#22d3a5';

  return (
    <group
      ref={ref}
      position={position}
      rotation={[0, rotation, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.({
          id: `Gate ${label}`,
          type: 'Gate',
          status,
          zone: `${label} Boarding Pier`,
          metrics: {
            'Gate': label,
            'Status': status.toUpperCase(),
            'Passenger Flow': status === 'boarding' ? '412 PAX/hr' : 'Normal',
            'Jet Bridge': 'Coupled (Active)',
            'VDGS Docking': 'Calibrated'
          }
        });
      }}
    >
      {/* Gate Boarding Pod structure */}
      <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
        <boxGeometry args={[1.2, 0.85, 1.6]} />
        <meshStandardMaterial
          color={hovered ? '#e2ecf8' : '#cbd5e1'}
          metalness={0.6}
          roughness={0.3}
          emissive={hovered ? color : '#000000'}
          emissiveIntensity={hovered ? 0.25 : 0}
        />
      </mesh>

      {/* Aerobridge connector arm */}
      <mesh position={[0, 0.35, 1.1]} castShadow>
        <boxGeometry args={[0.26, 0.26, 0.8]} />
        <meshStandardMaterial color="#64748b" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Glass Observation Strip */}
      <mesh position={[0, 0.5, 0.81]}>
        <boxGeometry args={[1.0, 0.25, 0.05]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          transparent
          opacity={0.65}
          roughness={0.1}
          metalness={0.9}
          emissive="#38bdf8"
          emissiveIntensity={hovered ? 0.4 : 0.15}
        />
      </mesh>

      {/* Futuristic status glow strip */}
      <mesh position={[0, 0.88, 0]}>
        <boxGeometry args={[1.1, 0.04, 1.5]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Floating Status Ring Indicator */}
      <StatusIndicator status={status} position={[0, 1.05, 0]} radius={0.45} />

      {/* Interactive Tooltip Card on Hover */}
      {hovered && (
        <Html position={[0, 1.8, 0]} center distanceFactor={12}>
          <FlightCard
            label={`GATE ${label}`}
            sub={status === 'boarding' ? 'Flight Boarding in Progress' : 'Operational • Ready'}
            status={status}
          />
        </Html>
      )}
    </group>
  );
}
