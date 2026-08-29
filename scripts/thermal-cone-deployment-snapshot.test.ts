import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { loadThermalConeDataFromPaths } from "../apps/web/lib/thermal-cones/load-thermal-cones";
import { StagedThermalConeDataSchema } from "../packages/visualization/src/thermal-cones/schema";
import {
  ACCEPTED_MANIFEST_REVISION,
  ACCEPTED_MANIFEST_SHA256,
} from "./stage-thermal-cones";

const localStagingPath = resolve(
  process.cwd(),
  "apps/web/.visifold-research/thermal-cones.json",
);
const deploymentSnapshotPath = resolve(
  process.cwd(),
  "apps/web/publication-data/thermal-cones/thermal-cones.json",
);

function readContract(path: string) {
  return StagedThermalConeDataSchema.parse(
    JSON.parse(readFileSync(path, "utf8")),
  );
}

function expectAcceptedCases(
  data: ReturnType<typeof StagedThermalConeDataSchema.parse>,
) {
  expect(data.supported_beta_cases).toEqual([0, 0.2, 1]);
  expect(data.cases.map((thermalCase) => thermalCase.beta)).toEqual([0, 0.2, 1]);

  expect(
    data.cases.map((thermalCase) => [
      thermalCase.regions.past.length,
      thermalCase.regions.incomparable.length,
      thermalCase.regions.future.length,
    ]),
  ).toEqual([
    [24, 144, 1],
    [24, 476, 1],
    [18, 222, 1],
  ]);
}

describe("Thermal Cone deployment snapshot", () => {
  const snapshot = readContract(deploymentSnapshotPath);

  it("matches the accepted manifest and scientific case invariants", () => {
    expect(snapshot.artifact_role).toBe("tracked-deployment-snapshot");
    expect(snapshot.release_status).toBe("prototype-testing-only");
    expect(snapshot.provenance.manifest_revision).toBe(
      ACCEPTED_MANIFEST_REVISION,
    );
    expect(snapshot.provenance.manifest_sha256).toBe(
      ACCEPTED_MANIFEST_SHA256,
    );
    expectAcceptedCases(snapshot);
  });

  it.runIf(existsSync(localStagingPath))(
    "parses local staging and the snapshot under the same contract",
    () => {
      const local = readContract(localStagingPath);

      expect(local.artifact_role).toBe("verified-local-staging");
      expectAcceptedCases(local);
      expect(snapshot.provenance).toEqual(local.provenance);
      expect(snapshot.fixed_system).toEqual(local.fixed_system);
      expect(snapshot.cases).toEqual(local.cases);
    },
  );

  it("falls back to the tracked snapshot when local staging is absent", async () => {
    const data = await loadThermalConeDataFromPaths({
      localStaging: resolve(
        process.cwd(),
        ".test-missing/thermal-cones.json",
      ),
      deploymentSnapshot: deploymentSnapshotPath,
    });

    expect(data.artifact_role).toBe("tracked-deployment-snapshot");
    expectAcceptedCases(data);
  });
});
