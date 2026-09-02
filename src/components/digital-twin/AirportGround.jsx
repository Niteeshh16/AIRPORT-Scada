import React, { useMemo } from 'react';
import * as THREE from 'three';

function buildGroundCanvas() {
  const SIZE = 2048;
  const W = 220; // World size in units
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  const s = SIZE / W;

  const px = (x) => (x + W / 2) * s;
  const pz = (z) => (z + W / 2) * s;
  const pw = (w) => w * s;

  // ── 1. GRASS / TERRAIN BASE ───────────────────────────────────────────────
  ctx.fillStyle = '#223816'; // Lush airfield grass base
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Organic grass noise / subtle variations
  for (let i = 0; i < 16000; i++) {
    const d = (Math.random() - 0.5) * 24;
    ctx.fillStyle = `rgba(${Math.max(0, 32 + d)},${Math.max(0, 54 + d)},${Math.max(0, 20 + d)},0.35)`;
    ctx.fillRect(Math.random() * SIZE, Math.random() * SIZE, 4, 4);
  }

  // ── 2. MAIN CONCOURSE & APRON TARMAC (Hugging the 3 Wings) ────────────────
  // Heavy duty dark grey asphalt apron
  ctx.fillStyle = '#26292e';

  // Central apron base
  ctx.beginPath();
  // Polygon hugging the Lotus terminal and 3 sweeping concourse wings
  ctx.moveTo(px(-45), pz(10));
  ctx.lineTo(px(-42), pz(-18)); // West wing tip
  ctx.lineTo(px(-28), pz(-24));
  ctx.lineTo(px(-16), pz(-12)); // Inward curve towards north pier
  ctx.lineTo(px(-14), pz(-40)); // North pier tip left
  ctx.lineTo(px(14),  pz(-40)); // North pier tip right
  ctx.lineTo(px(16),  pz(-12)); // Inward curve towards east pier
  ctx.lineTo(px(28),  pz(-24));
  ctx.lineTo(px(42),  pz(-18)); // East wing tip
  ctx.lineTo(px(45),  pz(10));
  ctx.lineTo(px(26),  pz(16));
  ctx.lineTo(px(-26), pz(16));
  ctx.closePath();
  ctx.fill();

  // Subtle concrete panel texture on tarmac
  for (let i = 0; i < 18000; i++) {
    const d = (Math.random() - 0.5) * 14;
    ctx.fillStyle = `rgba(${38 + d},${41 + d},${46 + d},0.3)`;
    ctx.fillRect(Math.random() * SIZE, Math.random() * SIZE, 3, 3);
  }

  // ── 3. GREEN ISLAND LAWNS BETWEEN WINGS (Exactly like reference photo) ────
  const drawLawnIsland = (cx, cz, rw, rh) => {
    ctx.save();
    ctx.fillStyle = '#2d4a1d';
    ctx.beginPath();
    ctx.ellipse(px(cx), pz(cz), pw(rw), pw(rh), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1e3313';
    ctx.lineWidth = pw(0.3);
    ctx.stroke();
    // Subtle striped mowed grass lines
    ctx.strokeStyle = 'rgba(60, 95, 40, 0.4)';
    ctx.lineWidth = pw(0.4);
    for (let y = cz - rh; y < cz + rh; y += 1.8) {
      ctx.beginPath();
      ctx.moveTo(px(cx - rw), pz(y));
      ctx.lineTo(px(cx + rw), pz(y));
      ctx.stroke();
    }
    ctx.restore();
  };

  // West grass island (between North pier & West wing)
  drawLawnIsland(-15, -18, 7.5, 9);
  // East grass island (between North pier & East wing)
  drawLawnIsland(15, -18, 7.5, 9);

  // Far outer lawns
  drawLawnIsland(-42, -4, 6, 7);
  drawLawnIsland(42, -4, 6, 7);

  // ── 4. RUNWAYS (NORTH PARALLEL RUNWAYS) ────────────────────────────────────
  ctx.fillStyle = '#141619';
  ctx.fillRect(px(-28), pz(-102), pw(7), pw(60)); // RW01L (x = -24.5)
  ctx.fillRect(px(21),  pz(-102), pw(7), pw(60)); // RW01R (x = 24.5)

  // Runway white threshold & centerline markings
  ctx.fillStyle = '#ffffff';
  // Centerline dashes
  for (let z = -100; z < -45; z += 5) {
    ctx.fillRect(px(-24.5) - pw(0.18), pz(z), pw(0.36), pw(3.2));
    ctx.fillRect(px(24.5)  - pw(0.18), pz(z), pw(0.36), pw(3.2));
  }
  // Threshold bars
  for (let i = 0; i < 8; i++) {
    ctx.fillRect(px(-27.2 + i * 0.75), pz(-100), pw(0.4), pw(2.5));
    ctx.fillRect(px(-27.2 + i * 0.75), pz(-45),  pw(0.4), pw(2.5));
    ctx.fillRect(px(21.8  + i * 0.75), pz(-100), pw(0.4), pw(2.5));
    ctx.fillRect(px(21.8  + i * 0.75), pz(-45),  pw(0.4), pw(2.5));
  }

  // ── 5. TAXIWAYS & HIGH-SPEED EXITS ────────────────────────────────────────
  ctx.fillStyle = '#1e2126';
  // Outer perimeter taxiway looping around the 3 wings
  ctx.fillRect(px(-46), pz(-44), pw(92), pw(4));
  ctx.fillRect(px(-46), pz(-48), pw(92), pw(3.5));

  // Connecting taxiways to North Pier & Runways
  ctx.fillRect(px(-26), pz(-44), pw(4), pw(10));
  ctx.fillRect(px(22),  pz(-44), pw(4), pw(10));
  ctx.fillRect(px(-5),  pz(-44), pw(10), pw(8));

  // Yellow taxiway centerlines
  ctx.save();
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = pw(0.2);
  ctx.setLineDash([pw(2.2), pw(1.4)]);

  // Main perimeter taxiway line
  ctx.beginPath();
  ctx.moveTo(px(-46), pz(-42));
  ctx.lineTo(px(46),  pz(-42));
  ctx.stroke();

  // Curving taxi lines wrapping the wings
  ctx.beginPath();
  ctx.moveTo(px(-38), pz(-18));
  ctx.quadraticCurveTo(px(-28), pz(-32), px(-14), pz(-38));
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(px(38), pz(-18));
  ctx.quadraticCurveTo(px(28), pz(-32), px(14), pz(-38));
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.restore();

  // ── 6. AIRCRAFT PARKING STANDS & T-MARKINGS (At the Gates) ────────────────
  ctx.save();
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = pw(0.15);

  // North Pier Stands
  for (let z = -12; z >= -34; z -= 5) {
    // West side stand
    ctx.beginPath();
    ctx.moveTo(px(-7), pz(z));
    ctx.lineTo(px(-11), pz(z));
    ctx.stroke();
    // T-bar
    ctx.beginPath();
    ctx.moveTo(px(-11), pz(z - 1.2));
    ctx.lineTo(px(-11), pz(z + 1.2));
    ctx.stroke();

    // East side stand
    ctx.beginPath();
    ctx.moveTo(px(7), pz(z));
    ctx.lineTo(px(11), pz(z));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(px(11), pz(z - 1.2));
    ctx.lineTo(px(11), pz(z + 1.2));
    ctx.stroke();
  }

  // Hammerhead end stands (North tip)
  [-8, 0, 8].forEach((x) => {
    ctx.beginPath();
    ctx.moveTo(px(x), pz(-36));
    ctx.lineTo(px(x), pz(-41));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(px(x - 1.2), pz(-41));
    ctx.lineTo(px(x + 1.2), pz(-41));
    ctx.stroke();
  });
  ctx.restore();

  // ── 7. LANDSIDE: CURVED HIGHWAYS, RAMPS & PARKING (Front of Terminal) ─────
  // Multi-tier curved highway viaducts (dark roadway asphalt)
  ctx.fillStyle = '#1e293b';

  // Main East-West landside highway corridor
  ctx.fillRect(px(-55), pz(28), pw(110), pw(5.5));
  ctx.fillRect(px(-55), pz(35), pw(110), pw(4));

  // Loop interchanges on the left and right (matching the reference photo)
  ctx.beginPath();
  ctx.arc(px(-46), pz(26), pw(9), 0, Math.PI * 2);
  ctx.lineWidth = pw(3.2);
  ctx.strokeStyle = '#1e293b';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(px(46), pz(26), pw(9), 0, Math.PI * 2);
  ctx.stroke();

  // Highway dashed road markings
  ctx.save();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = pw(0.12);
  ctx.setLineDash([pw(2.0), pw(2.0)]);
  ctx.beginPath();
  ctx.moveTo(px(-55), pz(30.75));
  ctx.lineTo(px(55),  pz(30.75));
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // ── 8. TERRACED GREEN PARKING ROOF STRUCTURE (South of Terminal) ──────────
  ctx.fillStyle = '#15803d'; // Rich green garden roof
  ctx.beginPath();
  ctx.roundRect(px(-24), pz(17), pw(48), pw(9), 6);
  ctx.fill();

  // Organic white terrace contour curves (matching the iconic garden roof in photo)
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = pw(0.25);
  for (let i = 0; i < 8; i++) {
    const x = -20 + i * 5.6;
    ctx.beginPath();
    ctx.moveTo(px(x), pz(18));
    ctx.quadraticCurveTo(px(x + 1.2), pz(21.5), px(x), pz(25));
    ctx.stroke();
  }

  return canvas;
}

export default function AirportGround() {
  const texture = useMemo(() => {
    const tex = new THREE.CanvasTexture(buildGroundCanvas());
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.generateMipmaps = true;
    return tex;
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
      <planeGeometry args={[220, 220]} />
      <meshStandardMaterial map={texture} roughness={0.92} metalness={0.04} />
    </mesh>
  );
}
