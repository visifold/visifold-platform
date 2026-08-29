import { describe, expect, it } from "vitest";

import {
  StagedThermalConeDataSchema,
  ThermalConePieceSchema,
  getThermalConeCase,
  type StagedThermalConeData,
} from "./schema";

const FIXED_STATE = [25 / 48, 13 / 48, 7 / 48, 3 / 48] as const;

const CASE_METADATA = {
  0: {
    paperRole: "Figure 9(a)",
    gibbs: [0.25, 0.25, 0.25, 0.25],
    normalizedVolumes: {
      past: 0.3203125,
      incomparable: 0.384837962963,
      future: 0.294849537037,
    },
  },
  0.2: {
    paperRole: "Figure 9(b)",
    gibbs: [
      0.3291788293012836, 0.26950883081116833, 0.22065516801119428,
      0.1806571718763537,
    ],
    normalizedVolumes: {
      past: 0.635581470404,
      incomparable: 0.285943867314,
      future: 0.078474662283,
    },
  },
  1: {
    paperRole: "Figure 9(c), following the caption and geometry evidence",
    gibbs: [
      0.6439142598879724, 0.23688281808991013, 0.08714431874203257,
      0.03205860328008499,
    ],
    normalizedVolumes: {
      past: 0.947691841348,
      incomparable: 0.05003261671,
      future: 0.002275541942,
    },
  },
} as const;

const tetrahedronPiece = {
  label: "test piece",
  provenance: "Accepted contract field",
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
};

function createCase(beta: 0 | 0.2 | 1) {
  const metadata = CASE_METADATA[beta];

  return {
    beta,
    paper_role: metadata.paperRole,
    present: [...FIXED_STATE],
    gibbs: [...metadata.gibbs],
    source_beta_order: [0, 1, 2, 3],
    normalized_volume_fractions: metadata.normalizedVolumes,
    regions: {
      past: [tetrahedronPiece],
      incomparable: [tetrahedronPiece],
      future: [tetrahedronPiece],
    },
  };
}

const stagedData = {
  schema: "visifold-thermal-cones-mvp-v1",
  release_status: "local-development-only",
  artifact_role: "verified-local-staging",
  supported_beta_cases: [0, 0.2, 1],
  provenance: {
    source_identity: {
      research_project: "Thermal Cone Visualization",
      handoff_relative_path: "exports/visifold",
    },
    manifest_revision: 1,
    manifest_sha256: "a".repeat(64),
    contract_sha256: "b".repeat(64),
    source_geometry_path: "outputs/data/geometry.json",
    source_geometry_sha256: "c".repeat(64),
    case_index_path: "data/cases.json",
    case_index_sha256: "d".repeat(64),
  },
  fixed_system: {
    state: [...FIXED_STATE],
    state_exact: "(25,13,7,3)/48",
    energies: [0, 1, 2, 3],
    population_labels: ["level 1", "level 2", "level 3", "level 4"],
    probability_normalization: "sum = 1",
    thermal_convention: "k_B = 1",
  },
  cases: [createCase(0), createCase(0.2), createCase(1)],
};

describe("Thermal Cone contract schemas", () => {
  it("accepts the three supported cases without mixing them", () => {
    const parsed = StagedThermalConeDataSchema.parse(stagedData);
    expect(getThermalConeCase(parsed, 0.2).beta).toBe(0.2);
    expect(parsed.cases.map((item) => item.beta)).toEqual([0, 0.2, 1]);
  });

  it("rejects non-normalized probability vectors", () => {
    const invalidPiece = structuredClone(tetrahedronPiece);
    invalidPiece.vertices_probability[0] = [0.8, 0, 0, 0];

    expect(() => ThermalConePieceSchema.parse(invalidPiece)).toThrow(/sum to 1/);
  });

  it("rejects triangle indices outside a piece-local vertex array", () => {
    const invalidPiece = structuredClone(tetrahedronPiece);
    invalidPiece.triangles[0] = [0, 1, 8];

    expect(() => ThermalConePieceSchema.parse(invalidPiece)).toThrow(
      /local to the piece/,
    );
  });

  it("does not admit diagnostic beta 0.5", () => {
    const invalidData = structuredClone(stagedData) as unknown as StagedThermalConeData;
    invalidData.cases[1]!.beta = 0.5 as 0.2;

    expect(() => StagedThermalConeDataSchema.parse(invalidData)).toThrow();
  });
});
