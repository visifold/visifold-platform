import type { ProbabilityVector } from "./schema";

export type ScientificXyz = readonly [number, number, number];

export const TETRAHEDRON_VERTICES_XYZ = [
  [-1 / Math.sqrt(2), -1 / Math.sqrt(6), -1 / Math.sqrt(12)],
  [1 / Math.sqrt(2), -1 / Math.sqrt(6), -1 / Math.sqrt(12)],
  [0, 2 / Math.sqrt(6), -1 / Math.sqrt(12)],
  [0, 0, 3 / Math.sqrt(12)],
] as const satisfies readonly ScientificXyz[];

export function embedProbability(probability: ProbabilityVector): ScientificXyz {
  const [q1, q2, q3, q4] = probability;
  const [v1, v2, v3, v4] = TETRAHEDRON_VERTICES_XYZ;

  return [
    q1 * v1[0] + q2 * v2[0] + q3 * v3[0] + q4 * v4[0],
    q1 * v1[1] + q2 * v2[1] + q3 * v3[1] + q4 * v4[1],
    q1 * v1[2] + q2 * v2[2] + q3 * v3[2] + q4 * v4[2],
  ];
}
