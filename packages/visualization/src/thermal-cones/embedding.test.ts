import { describe, expect, it } from "vitest";

import { TETRAHEDRON_VERTICES_XYZ, embedProbability } from "./embedding";

describe("Thermal Cone probability embedding", () => {
  it.each([
    [[1, 0, 0, 0], 0],
    [[0, 1, 0, 0], 1],
    [[0, 0, 1, 0], 2],
    [[0, 0, 0, 1], 3],
  ] as const)("maps a simplex corner to its documented XYZ vertex", (q, vertex) => {
    expect(embedProbability([...q])).toEqual(TETRAHEDRON_VERTICES_XYZ[vertex]);
  });

  it("maps the uniform state to the tetrahedron centroid", () => {
    const embedded = embedProbability([0.25, 0.25, 0.25, 0.25]);
    embedded.forEach((coordinate) => expect(coordinate).toBeCloseTo(0, 14));
  });
});
