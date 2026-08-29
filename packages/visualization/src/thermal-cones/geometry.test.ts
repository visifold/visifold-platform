import { describe, expect, it } from "vitest";

import { createThermalConePieceGeometry } from "./geometry";
import { ThermalConePieceSchema } from "./schema";

describe("Thermal Cone renderer geometry", () => {
  it("constructs indexed Three.js geometry without merging the source piece", () => {
    const piece = ThermalConePieceSchema.parse({
      label: "tetrahedron",
      provenance: "test",
      vertices_probability: [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ],
      triangles: [
        [0, 1, 2],
        [0, 1, 3],
        [0, 2, 3],
        [1, 2, 3],
      ],
      volume_xyz: 1 / 3,
    });

    const geometry = createThermalConePieceGeometry(piece);

    expect(geometry.getAttribute("position").count).toBe(4);
    expect(geometry.getIndex()?.count).toBe(12);

    geometry.dispose();
  });
});
