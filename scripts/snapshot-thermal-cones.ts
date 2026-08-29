import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  SUPPORTED_THERMAL_CONE_BETAS,
  StagedThermalConeDataSchema,
} from "../packages/visualization/src/thermal-cones/schema";
import {
  ACCEPTED_MANIFEST_REVISION,
  ACCEPTED_MANIFEST_SHA256,
  sha256,
} from "./stage-thermal-cones";

const REPOSITORY_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export const LOCAL_STAGED_DATA_PATH = resolve(
  REPOSITORY_ROOT,
  "apps/web/.visifold-research/thermal-cones.json",
);

export const DEPLOYMENT_SNAPSHOT_PATH = resolve(
  REPOSITORY_ROOT,
  "apps/web/publication-data/thermal-cones/thermal-cones.json",
);

export async function generateThermalConeDeploymentSnapshot(
  stagedPath = LOCAL_STAGED_DATA_PATH,
  snapshotPath = DEPLOYMENT_SNAPSHOT_PATH,
): Promise<{ outputPath: string; bytes: number; sha256: string }> {
  let serialized: string;

  try {
    serialized = await readFile(stagedPath, "utf8");
  } catch (error) {
    throw new Error(
      "Verified local Thermal Cone staging is required before generating the deployment snapshot.",
      { cause: error },
    );
  }

  const stagedData = StagedThermalConeDataSchema.parse(JSON.parse(serialized));

  if (stagedData.artifact_role !== "verified-local-staging") {
    throw new Error("The snapshot source is not a verified local staging artifact.");
  }

  if (
    stagedData.provenance.manifest_revision !== ACCEPTED_MANIFEST_REVISION ||
    stagedData.provenance.manifest_sha256 !== ACCEPTED_MANIFEST_SHA256
  ) {
    throw new Error("The staged data does not match the accepted manifest identity.");
  }

  if (
    stagedData.supported_beta_cases.some(
      (beta, index) => beta !== SUPPORTED_THERMAL_CONE_BETAS[index],
    )
  ) {
    throw new Error("The staged data does not contain the accepted beta case set.");
  }

  const snapshotData = StagedThermalConeDataSchema.parse({
    ...stagedData,
    release_status: "prototype-testing-only",
    artifact_role: "tracked-deployment-snapshot",
  });
  const snapshotBytes = new TextEncoder().encode(
    `${JSON.stringify(snapshotData)}\n`,
  );

  await mkdir(dirname(snapshotPath), { recursive: true });
  await writeFile(snapshotPath, snapshotBytes);

  return {
    outputPath: snapshotPath,
    bytes: snapshotBytes.byteLength,
    sha256: sha256(snapshotBytes),
  };
}

async function main() {
  const result = await generateThermalConeDeploymentSnapshot();

  console.log(`Deployment snapshot: ${result.outputPath}`);
  console.log(`Snapshot bytes: ${result.bytes}`);
  console.log(`Snapshot SHA-256: ${result.sha256}`);
  console.log(
    "Status: tracked prototype/testing snapshot; not a final publication or licensing policy.",
  );
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
