import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const VEHICLE_COLORS = {
  baggage: '#f59e0b',
  fuel: '#ef4444',
  catering: '#a78bfa',
  pushback: '#38bdf8',
  patrol: '#22d3a5',
};

function GroundVehicle({ path = [], speed = 0.002, type = 'baggage', label = 'GSE' }) {
  const ref = useRef();
  const t = useRef(Math.random());

  useFrame(() => {
    if (!ref.current || path.length < 2) return;
    t.current = (t.current + speed) % 1;
    const totalSegments = path.length - 1;
    const progress = t.current * totalSegments;
    const segIdx = Math.min(Math.floor(progress), totalSegments - 1);
    const localT = progress - segIdx;
    const p1 = path[segIdx];
    const p2 = path[segIdx + 1];

    ref.current.position.x = p1[0] + (p2[0] - p1[0]) * localT;
    ref.current.position.z = p1[2] + (p2[2] - p1[2]) * localT;

    const dx = p2[0] - p1[0];
    const dz = p2[2] - p1[2];
    ref.current.rotation.y = Math.atan2(dx, dz);
  });

  const stripeColor = VEHICLE_COLORS[type] || '#38bdf8';

  return (
    <group ref={ref} position={path[0] || [0, 0.08, 0]}>
      {/* Vehicle chassis */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <boxGeometry args={[0.3, 0.14, 0.55]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.7} roughness={0.25} />
      </mesh>
      {/* Windshield / Cab */}
      <mesh position={[0, 0.17, -0.1]}>
        <boxGeometry args={[0.26, 0.11, 0.22]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* SCADA / Vehicle Status Accent Stripe */}
      <mesh position={[0, 0.09, 0]}>
        <boxGeometry args={[0.32, 0.04, 0.5]} />
        <meshBasicMaterial color={stripeColor} />
      </mesh>
      {/* Tiny wheels */}
      {[-0.14, 0.14].map((wx, i) =>
        [-0.16, 0.16].map((wz, j) => (
          <mesh key={`${i}-${j}`} position={[wx, 0.04, wz]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, 0.06, 6]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        ))
      )}
      {/* Headlights */}
      <mesh position={[0.09, 0.08, 0.28]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.09, 0.08, 0.28]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {/* Flashing hazard beacon */}
      <mesh position={[0, 0.25, -0.1]}>
        <sphereGeometry args={[0.035, 6, 6]} />
        <meshBasicMaterial color={stripeColor} />
      </mesh>
    </group>
  );
}

export default function VehicleModel() {
  const apronPatrols = [
    {
      type: 'baggage',
      speed: 0.0016,
      path: [
        [-5, 0.08, 2],
        [-5, 0.08, -8],
        [0, 0.08, -10],
        [5, 0.08, -8],
        [5, 0.08, 2],
        [0, 0.08, 4],
        [-5, 0.08, 2]
      ]
    },
    {
      type: 'pushback',
      speed: 0.0012,
      path: [
        [8, 0.08, 3],
        [8, 0.08, -4],
        [2, 0.08, -8],
        [-4, 0.08, -4],
        [-4, 0.08, 3],
        [8, 0.08, 3]
      ]
    },
    {
      type: 'fuel',
      speed: 0.001,
      path: [
        [-12, 0.08, 2],
        [-8, 0.08, -5],
        [0, 0.08, -14],
        [8, 0.08, -5],
        [12, 0.08, 2],
        [-12, 0.08, 2]
      ]
    },
    {
      type: 'patrol',
      speed: 0.0022,
      path: [
        [-16, 0.08, -20],
        [16, 0.08, -20],
        [16, 0.08, -24],
        [-16, 0.08, -24],
        [-16, 0.08, -20]
      ]
    },
    {
      type: 'catering',
      speed: 0.0014,
      path: [
        [-2, 0.08, -6],
        [-2, 0.08, -18],
        [2, 0.08, -18],
        [2, 0.08, -6],
        [-2, 0.08, -6]
      ]
    }
  ];

  return (
    <group>
      {apronPatrols.map((v, i) => (
        <GroundVehicle
          key={i}
          path={v.path}
          speed={v.speed}
          type={v.type}
          label={`GSE-${i + 1}`}
        />
      ))}
    </group>
  );
}
