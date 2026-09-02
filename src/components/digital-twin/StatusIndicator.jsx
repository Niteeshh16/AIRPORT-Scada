import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const STATUS_COLORS = {
  operational: '#22d3a5', warning: '#f59e0b', critical: '#ef4444',
  offline: '#6b7280', info: '#38bdf8', active: '#22d3a5',
  boarding: '#38bdf8', occupied: '#22d3a5', moving: '#a78bfa',
};

export default function StatusIndicator({ status = 'operational', position = [0, 0, 0], radius = 0.55 }) {
  const ringRef = useRef();
  const dotRef = useRef();
  const color = STATUS_COLORS[status] || '#22d3a5';

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + Math.sin(t * 2.5) * 0.12);
      ringRef.current.material.opacity = 0.45 + Math.sin(t * 2.5) * 0.3;
    }
    if (dotRef.current) {
      dotRef.current.material.opacity = 0.7 + Math.sin(t * 3) * 0.25;
    }
  });

  return (
    <group position={position}>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.82, radius, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={dotRef} position={[0, 0.07, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}
