"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

/* ── Mouse state shared across hooks ──────────────────────────── */
const mouse = { x: 0, y: 0 };

if (typeof window !== "undefined") {
  window.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  });
}

/* ── Particles ─────────────────────────────────────────────────── */
const PARTICLE_COUNT = 200;

function Particles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const { positions, colors } = useMemo(() => {
    const pos: number[] = [];
    const col: number[] = [];
    const orange = new THREE.Color("#FF6A1A");
    const white = new THREE.Color("#FFFFFF");

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos.push(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20 - 2
      );
      const c = Math.random() > 0.7 ? orange : white;
      col.push(c.r, c.g, c.b);
    }
    return { positions: pos, colors: col };
  }, []);

  const driftSpeeds = useMemo(
    () => Array.from({ length: PARTICLE_COUNT }, () => (Math.random() - 0.5) * 0.002),
    []
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;
      positions[idx + 1] += driftSpeeds[i];

      // Wrap vertically
      if (positions[idx + 1] > 10) positions[idx + 1] = -10;
      if (positions[idx + 1] < -10) positions[idx + 1] = 10;

      dummy.position.set(positions[idx], positions[idx + 1], positions[idx + 2]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  const colorArray = useMemo(() => {
    const arr = new Float32Array(colors);
    return arr;
  }, [colors]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[0.04, 4, 4]} />
      <meshBasicMaterial vertexColors />
      {/* Attach instance colours */}
      <instancedBufferAttribute
        attach="geometry-attributes-color"
        args={[colorArray, 3]}
      />
    </instancedMesh>
  );
}

/* ── Molecular wireframe structure ─────────────────────────────── */
interface MoleculeProps {
  position: [number, number, number];
  rotationSpeed: [number, number, number];
  scale?: number;
}

function Molecule({ position, rotationSpeed, scale = 1 }: MoleculeProps) {
  const groupRef = useRef<THREE.Group>(null);

  const edgesGeo = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1, 0);
    return new THREE.EdgesGeometry(geo);
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.x += rotationSpeed[0];
    groupRef.current.rotation.y += rotationSpeed[1];
    groupRef.current.rotation.z += rotationSpeed[2];
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial color="#FF6A1A" transparent opacity={0.6} />
      </lineSegments>
    </group>
  );
}

/* ── Camera tilt on mouse ───────────────────────────────────────── */
function CameraRig() {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame(() => {
    target.current.x += (mouse.x * 0.08 - target.current.x) * 0.05;
    target.current.y += (mouse.y * 0.08 - target.current.y) * 0.05;

    camera.rotation.y = THREE.MathUtils.degToRad(target.current.x * 5);
    camera.rotation.x = THREE.MathUtils.degToRad(target.current.y * 5);
  });

  return null;
}

/* ── Scene contents ─────────────────────────────────────────────── */
function SceneContents() {
  return (
    <>
      <fog attach="fog" args={[0x0a0a0a, 1, 30]} />
      <Stars
        radius={60}
        depth={40}
        count={1500}
        factor={2}
        saturation={0}
        fade
        speed={0.3}
      />
      <Particles />
      <Molecule
        position={[-5, 1, -6]}
        rotationSpeed={[0.003, 0.005, 0.001]}
        scale={1.4}
      />
      <Molecule
        position={[6, -2, -8]}
        rotationSpeed={[0.002, 0.003, 0.004]}
        scale={1.0}
      />
      <Molecule
        position={[0, 3, -12]}
        rotationSpeed={[0.004, 0.001, 0.003]}
        scale={2.0}
      />
      <CameraRig />
    </>
  );
}

/* ── Exported canvas ────────────────────────────────────────────── */
function HeroScene() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: "#0A0A0A", width: "100%", height: "100%" }}
        gl={{ antialias: false, alpha: false }}
        dpr={[1, 1.5]}
      >
        <SceneContents />
      </Canvas>
    </div>
  );
}

export default React.memo(HeroScene);
