"use client";

import { Canvas } from "@react-three/fiber";

export interface ScientificCanvasProps {
  className?: string;
}

export function NeutralTestObject() {
  return (
    <mesh rotation={[0.18, 0.42, 0]}>
      <icosahedronGeometry args={[1, 2]} />
      <meshStandardMaterial color="#a9afb3" metalness={0.06} roughness={0.72} />
    </mesh>
  );
}

export function ScientificCanvas({ className }: ScientificCanvasProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [2.8, 2, 3.6], fov: 35, near: 0.1, far: 100 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#14171a"]} />
        <ambientLight intensity={1.15} />
        <directionalLight intensity={2.4} position={[4, 5, 3]} />
        <NeutralTestObject />
      </Canvas>
    </div>
  );
}
