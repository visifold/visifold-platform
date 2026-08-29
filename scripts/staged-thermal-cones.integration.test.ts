import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { StagedThermalConeDataSchema } from "../packages/visualization/src/thermal-cones/schema";

const stagedPath = resolve(
  process.cwd(),
  "apps/web/.visifold-research/thermal-cones.json",
);
const hasStagedData = existsSync(stagedPath);

describe.runIf(hasStagedData)("staged Thermal Cone contract", () => {
  const data = StagedThermalConeDataSchema.parse(
    JSON.parse(readFileSync(stagedPath, "utf8")),
  );

  it("contains only the accepted user-facing beta set", () => {
    expect(data.cases.map((thermalCase) => thermalCase.beta)).toEqual([
      0, 0.2, 1,
    ]);
  });

  it.each([
    [0, 24, 144, 1],
    [0.2, 24, 476, 1],
    [1, 18, 222, 1],
  ] as const)(
    "preserves accepted piece counts for beta %s",
    (beta, past, incomparable, future) => {
      const thermalCase = data.cases.find((candidate) => candidate.beta === beta);

      expect(thermalCase?.regions.past).toHaveLength(past);
      expect(thermalCase?.regions.incomparable).toHaveLength(incomparable);
      expect(thermalCase?.regions.future).toHaveLength(future);
    },
  );
});
