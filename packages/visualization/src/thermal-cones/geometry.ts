import { BufferGeometry, Float32BufferAttribute } from "three";

import { embedProbability } from "./embedding";
import type { ThermalConePiece } from "./schema";

export function createThermalConePieceGeometry(piece: ThermalConePiece): BufferGeometry {
  const positions = piece.vertices_probability.flatMap((probability) =>
    [...embedProbability(probability)],
  );
  const indices = piece.triangles.flat();

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();

  return geometry;
}
