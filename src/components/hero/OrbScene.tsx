"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

/*
  The hero orb, in WebGL.

  A soap bubble is a thin iridescent shell, not a ball of glass. Transmission
  was the wrong tool: with a transparent canvas it samples the environment map
  rather than the page, so the orb filled up with flat reflections of the
  lights. This is a near-transparent shell instead, lit so that the rim catches
  colour through fresnel while the middle stays open and the page shows through.

  All light comes from Lightformers inside the scene, so nothing is fetched
  from a CDN and the highlights stay art directed instead of accidental.
*/

export type SceneDrivers = {
  /** 0 at the top of the hero, 1 when it has scrolled away. */
  scroll: { current: number };
  /** Pointer in normalised screen space, already smoothed by the caller. */
  pointer: { current: { x: number; y: number } };
};

const BUBBLE_COLOR = new THREE.Color("#dbe7ff");

function Bubble({
  scroll,
  pointer,
  compact,
  still,
}: SceneDrivers & { compact: boolean; still: boolean }) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!group.current || !mesh.current) return;
    const step = Math.min(delta, 0.05);
    // Still mode holds time at zero, so the scene renders without ever moving.
    const t = still ? 0 : state.clock.elapsedTime;

    // Resting place, then a drift away as the hero scrolls off.
    const restX = compact ? 0 : 1.35;
    const restY = compact ? 0.25 : 0.1;

    const targetX = restX + pointer.current.x * 0.42;
    const targetY =
      restY + pointer.current.y * 0.3 + Math.sin(t * 0.45) * 0.07 + scroll.current * 1.1;
    const targetZ = -scroll.current * 2.4;

    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, targetX, 3, step);
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, targetY, 3, step);
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, targetZ, 3, step);

    // The bubble turns towards the pointer, which is what makes it feel held.
    mesh.current.rotation.y = THREE.MathUtils.damp(
      mesh.current.rotation.y,
      pointer.current.x * 0.5 + t * 0.06,
      2.5,
      step,
    );
    mesh.current.rotation.x = THREE.MathUtils.damp(
      mesh.current.rotation.x,
      -pointer.current.y * 0.35,
      2.5,
      step,
    );

    const breath = 1 + Math.sin(t * 0.7) * 0.012;
    const shrink = 1 - scroll.current * 0.18;
    mesh.current.scale.setScalar(breath * shrink);
  });

  return (
    <group ref={group} position={[compact ? 0 : 1.35, compact ? 0.25 : 0.1, 0]}>
      <mesh ref={mesh}>
        <sphereGeometry args={[1.15, compact ? 96 : 160, compact ? 96 : 160]} />
        <meshPhysicalMaterial
          color={BUBBLE_COLOR}
          transparent
          opacity={0.32}
          depthWrite={false}
          roughness={0.07}
          metalness={0}
          iridescence={1}
          iridescenceIOR={1.75}
          iridescenceThicknessRange={[240, 980]}
          clearcoat={1}
          clearcoatRoughness={0.06}
          envMapIntensity={2.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function Satellites({
  pointer,
  compact,
  still,
}: Pick<SceneDrivers, "pointer"> & { compact: boolean; still: boolean }) {
  const group = useRef<THREE.Group>(null);

  const seeds = useMemo(() => {
    const count = compact ? 2 : 5;
    return Array.from({ length: count }, (_, index) => ({
      radius: 0.1 + (index % 3) * 0.055,
      orbit: 2.5 + index * 0.55,
      speed: 0.12 + index * 0.035,
      phase: index * 1.7,
      lift: (index % 2 === 0 ? 1 : -1) * (0.5 + index * 0.24),
    }));
  }, [compact]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const step = Math.min(delta, 0.05);
    const t = still ? 0 : state.clock.elapsedTime;

    group.current.children.forEach((child, index) => {
      const seed = seeds[index];
      if (!seed) return;
      const angle = t * seed.speed + seed.phase;
      child.position.set(
        Math.cos(angle) * seed.orbit,
        seed.lift + Math.sin(angle * 1.3) * 0.28,
        Math.sin(angle) * seed.orbit * 0.6 - 1,
      );
    });

    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      pointer.current.x * 0.22,
      2,
      step,
    );
  });

  return (
    <group ref={group}>
      {seeds.map((seed, index) => (
        <mesh key={index}>
          <sphereGeometry args={[seed.radius, 48, 48]} />
          <meshPhysicalMaterial
            color="#cddcff"
            transparent
            opacity={0.3}
            depthWrite={false}
            roughness={0.08}
            metalness={0}
            iridescence={1}
            iridescenceIOR={1.6}
            iridescenceThicknessRange={[180, 880]}
            clearcoat={1}
            envMapIntensity={1.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Parallax for the whole scene. Shifting a wrapper group rather than the camera
 * gives the same depth cue and keeps the camera itself untouched.
 */
function ParallaxRig({
  pointer,
  children,
}: Pick<SceneDrivers, "pointer"> & { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    const step = Math.min(delta, 0.05);
    group.current.position.x = THREE.MathUtils.damp(
      group.current.position.x,
      pointer.current.x * 0.3,
      2,
      step,
    );
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      pointer.current.y * 0.2,
      2,
      step,
    );
  });

  return <group ref={group}>{children}</group>;
}

export function OrbScene({
  scroll,
  pointer,
  compact,
  still = false,
  onReady,
}: SceneDrivers & { compact: boolean; still?: boolean; onReady?: () => void }) {
  /*
    A still scene still has to be drawn a few dozen times: the transmission
    sampler and the environment map both resolve over several frames, and a
    single pass leaves the glass looking like matte plastic. Run the loop
    briefly with time frozen, then stop it.
  */
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!still) return;
    const timer = setTimeout(() => setSettled(true), 2500);
    return () => clearTimeout(timer);
  }, [still]);

  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 35 }}
      dpr={compact ? [1, 1.5] : [1, 1.85]}
      frameloop={still && settled ? "never" : "always"}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      onCreated={() => onReady?.()}
      style={{ pointerEvents: "none" }}
    >
      <ParallaxRig pointer={pointer}>
        <Bubble scroll={scroll} pointer={pointer} compact={compact} still={still} />
        <Satellites pointer={pointer} compact={compact} still={still} />
      </ParallaxRig>

      {/* Art directed light. Rect forms give the long highlights that read as glass. */}
      <Environment resolution={compact ? 128 : 256}>
        <Lightformer
          form="rect"
          intensity={5}
          color="#a8c6ff"
          position={[-4, 2.5, 3]}
          scale={[1.4, 7, 1]}
          rotation={[0, 0.6, 0.3]}
        />
        <Lightformer
          form="rect"
          intensity={3.5}
          color="#ffd0a0"
          position={[4.2, -1.2, 2.5]}
          scale={[1, 5, 1]}
          rotation={[0, -0.7, -0.35]}
        />
        <Lightformer
          form="rect"
          intensity={4}
          color="#8ee6ff"
          position={[2.6, 3.4, 1.5]}
          scale={[0.8, 4, 1]}
          rotation={[0, -0.3, 1]}
        />
        <Lightformer
          form="circle"
          intensity={6}
          color="#ffffff"
          position={[-1.5, 4, 2]}
          scale={1.2}
        />
        <Lightformer
          form="ring"
          intensity={2.4}
          color="#3f6bff"
          position={[0, -3.5, -3]}
          scale={9}
        />
      </Environment>
    </Canvas>
  );
}

export default OrbScene;
