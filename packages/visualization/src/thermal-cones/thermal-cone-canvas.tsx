"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import {
  BufferGeometry,
  DoubleSide,
  Float32BufferAttribute,
  type Camera,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { TETRAHEDRON_VERTICES_XYZ, embedProbability } from "./embedding";
import { createThermalConePieceGeometry } from "./geometry";
import {
  THERMAL_CONE_REGION_IDS,
  type StagedThermalConeCase,
  type ThermalConePiece,
  type ThermalConeRegionId,
} from "./schema";

export interface ThermalConeSelection {
  region: ThermalConeRegionId;
  pieceIndex: number;
  label: string;
  provenance: string;
  volumeXyz: number;
}

export interface ThermalConeCanvasProps {
  className?: string;
  thermalCase: StagedThermalConeCase;
  visibleRegions: Readonly<Record<ThermalConeRegionId, boolean>>;
  selected: ThermalConeSelection | null;
  resetToken: number;
  onSelect: (selection: ThermalConeSelection | null) => void;
}

const REGION_STYLE: Record<
  ThermalConeRegionId,
  { color: string; opacity: number; renderOrder: number }
> = {
  past: { color: "#c2a46f", opacity: 0.34, renderOrder: 2 },
  incomparable: { color: "#71899e", opacity: 0.2, renderOrder: 1 },
  future: { color: "#6f9f8d", opacity: 0.52, renderOrder: 3 },
};

const CAMERA_POSITION = [2.75, 2.05, 3.55] as const;

function resetCamera(camera: Camera, controls: OrbitControls) {
  camera.position.set(...CAMERA_POSITION);
  camera.up.set(0, 1, 0);
  controls.target.set(0, 0, 0);
  controls.update();
}

function CameraController({ resetToken }: { resetToken: number }) {
  const { camera, gl, invalidate } = useThree();
  const controls = useMemo(() => {
    const configuredControls = new OrbitControls(camera, gl.domElement);
    configuredControls.enableDamping = false;
    configuredControls.enablePan = false;
    configuredControls.minDistance = 1.8;
    configuredControls.maxDistance = 8;
    return configuredControls;
  }, [camera, gl.domElement]);

  useEffect(() => {
    const handleChange = () => invalidate();

    controls.addEventListener("change", handleChange);
    resetCamera(camera, controls);

    return () => {
      controls.removeEventListener("change", handleChange);
      controls.dispose();
    };
  }, [camera, controls, invalidate]);

  useEffect(() => {
    resetCamera(camera, controls);
    invalidate();
  }, [camera, controls, invalidate, resetToken]);

  return null;
}

function PieceMesh({
  piece,
  pieceIndex,
  region,
  selected,
  onSelect,
}: {
  piece: ThermalConePiece;
  pieceIndex: number;
  region: ThermalConeRegionId;
  selected: boolean;
  onSelect: (selection: ThermalConeSelection) => void;
}) {
  const geometry = useMemo(() => createThermalConePieceGeometry(piece), [piece]);
  const style = REGION_STYLE[region];

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <group>
      <mesh
        geometry={geometry}
        renderOrder={style.renderOrder}
        onClick={(event) => {
          event.stopPropagation();
          onSelect({
            region,
            pieceIndex,
            label: piece.label,
            provenance: piece.provenance,
            volumeXyz: piece.volume_xyz,
          });
        }}
      >
        <meshStandardMaterial
          color={style.color}
          depthWrite={false}
          flatShading
          metalness={0}
          opacity={style.opacity}
          roughness={0.82}
          side={DoubleSide}
          transparent
        />
      </mesh>
      {selected ? (
        <mesh geometry={geometry} renderOrder={10}>
          <meshBasicMaterial
            color="#f2ede3"
            depthTest={false}
            opacity={0.72}
            transparent
            wireframe
          />
        </mesh>
      ) : null}
    </group>
  );
}

function SimplexFrame() {
  const geometry = useMemo(() => {
    const edges = [
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 2],
      [1, 3],
      [2, 3],
    ] as const;
    const positions = edges.flatMap(([start, end]) => [
      ...TETRAHEDRON_VERTICES_XYZ[start],
      ...TETRAHEDRON_VERTICES_XYZ[end],
    ]);
    const frame = new BufferGeometry();
    frame.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return frame;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <lineSegments geometry={geometry} renderOrder={20}>
      <lineBasicMaterial color="#d8d3c9" opacity={0.34} transparent />
    </lineSegments>
  );
}

function StateMarker({
  label,
  position,
  color,
  scale,
}: {
  label: string;
  position: readonly [number, number, number];
  color: string;
  scale: number;
}) {
  return (
    <mesh name={label} position={position} renderOrder={30} scale={scale}>
      <sphereGeometry args={[1, 18, 18]} />
      <meshBasicMaterial color={color} depthTest={false} />
    </mesh>
  );
}

function ThermalConeScene({
  thermalCase,
  visibleRegions,
  selected,
  resetToken,
  onSelect,
}: Omit<ThermalConeCanvasProps, "className">) {
  const presentPosition = embedProbability(thermalCase.present);
  const gibbsPosition = embedProbability(thermalCase.gibbs);

  return (
    <>
      <color attach="background" args={["#111416"]} />
      <ambientLight intensity={1.4} />
      <directionalLight intensity={2.2} position={[4, 5, 3]} />
      <directionalLight intensity={0.7} position={[-3, -2, -4]} />
      <CameraController resetToken={resetToken} />

      {THERMAL_CONE_REGION_IDS.map((region) =>
        visibleRegions[region]
          ? thermalCase.regions[region].map((piece, pieceIndex) => (
              <PieceMesh
                key={`${region}-${pieceIndex}`}
                onSelect={onSelect}
                piece={piece}
                pieceIndex={pieceIndex}
                region={region}
                selected={
                  selected?.region === region && selected.pieceIndex === pieceIndex
                }
              />
            ))
          : null,
      )}

      <SimplexFrame />
      <StateMarker color="#f1ece2" label="Present state" position={presentPosition} scale={0.035} />
      <StateMarker color="#9ab2c5" label="Gibbs state" position={gibbsPosition} scale={0.026} />
    </>
  );
}

export function ThermalConeCanvas({
  className,
  thermalCase,
  visibleRegions,
  selected,
  resetToken,
  onSelect,
}: ThermalConeCanvasProps) {
  return (
    <div className={className} data-testid="thermal-cone-canvas">
      <Canvas
        camera={{ position: [...CAMERA_POSITION], fov: 34, near: 0.05, far: 100 }}
        dpr={[1, 1.75]}
        frameloop="demand"
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onPointerMissed={() => onSelect(null)}
      >
        <ThermalConeScene
          onSelect={onSelect}
          resetToken={resetToken}
          selected={selected}
          thermalCase={thermalCase}
          visibleRegions={visibleRegions}
        />
      </Canvas>
    </div>
  );
}
