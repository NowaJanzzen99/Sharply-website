"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

/*
  The hero orb, in WebGL.

  A thin-film soap bubble rather than solid glass: transmission plus
  iridescence reads as the brand image while staying far cheaper than
  MeshTransmissionMaterial. All light comes from Lightformers inside the
  scene, so nothing is fetched from a CDN and the highlights stay art
  directed instead of accidental.
*/

export type SceneDrivers = {
  /** 0 at the top of the hero, 1 when it has scrolled away. */
  scroll: { current: number };
  /** Pointer in normalised screen space, already smoothed by the caller. */
  pointer: { current: { x: number; y: number } };
};

const BUBBLE_COLOR = new THREE.Color("#b9d2ff");

function Bubble({ scroll, pointer, compact }: SceneDrivers & { compact: boolean }) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!group.current || !mesh.current) return;
    const step = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

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
          transmission={1}
          thickness={0.08}
          roughness={0.015}
          ior={1.06}
          metalness={0}
          iridescence={1}
          iridescenceIOR={1.9}
          iridescenceThicknessRange={[220, 1000]}
          clearcoat={1}
          clearcoatRoughness={0.02}
          envMapIntensity={2.6}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function Satellites({ pointer, compact }: Pick<SceneDrivers, "pointer"> & { compact: boolean }) {
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
    const t = state.clock.elapsedTime;

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
            transmission={1}
            thickness={0.05}
            roughness={0.02}
            ior={1.05}
            metalness={0}
            iridescence={1}
            iridescenceIOR={1.85}
            iridescenceThicknessRange={[180, 900]}
            envMapIntensity={2.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * In still mode the loop is off, so nothing would ever be drawn once the
 * environment map resolves. Nudge it a few times over the first second.
 */
function PaintOnce() {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    const timers = [0, 120, 400, 900, 1600].map((delay) =>
      setTimeout(() => invalidate(), delay),
    );
    return () => timers.forEach(clearTimeout);
  }, [invalidate]);

  return null;
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
  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 35 }}
      dpr={compact ? [1, 1.5] : [1, 1.85]}
      frameloop={still ? "demand" : "always"}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      onCreated={() => onReady?.()}
      style={{ pointerEvents: "none" }}
    >
      {still ? <PaintOnce /> : null}
      <ParallaxRig pointer={pointer}>
        <Bubble scroll={scroll} pointer={pointer} compact={compact} />
        <Satellites pointer={pointer} compact={compact} />
      </ParallaxRig>

      {/* Art directed light. Rect forms give the long highlights that read as glass. */}
      <Environment resolution={compact ? 128 : 256}>
        <Lightformer
          form="rect"
          intensity={2.4}
          color="#8fb6ff"
          position={[-5, 3, 4]}
          scale={[10, 6, 1]}
          rotation={[0, 0.5, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.4}
          color="#ffc98f"
          position={[6, -2, 3]}
          scale={[8, 4, 1]}
          rotation={[0, -0.6, 0]}
        />
        <Lightformer
          form="ring"
          intensity={3}
          color="#ffffff"
          position={[1, 3, -4]}
          scale={7}
        />
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#2f57ff"
          position={[0, -5, -2]}
          scale={[14, 5, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.1}
          color="#7be0ff"
          position={[-2, -3, 5]}
          scale={[6, 3, 1]}
        />
      </Environment>
    </Canvas>
  );
}

export default OrbScene;
