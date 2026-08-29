import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import {
  StagedThermalConeDataSchema,
  type StagedThermalConeData,
} from "@visifold/visualization";

export interface ThermalConeDataPaths {
  localStaging: string;
  deploymentSnapshot: string;
}

export const DEFAULT_THERMAL_CONE_DATA_PATHS: ThermalConeDataPaths = {
  localStaging: resolve(
    process.cwd(),
    ".visifold-research/thermal-cones.json",
  ),
  deploymentSnapshot: resolve(
    process.cwd(),
    "publication-data/thermal-cones/thermal-cones.json",
  ),
};

function isMissingFile(error: unknown): boolean {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOENT"
  );
}

async function readDataFile(
  path: string,
  label: string,
): Promise<StagedThermalConeData> {
  let serialized: string;

  try {
    serialized = await readFile(path, "utf8");
  } catch (error) {
    throw new Error(`Unable to read the Thermal Cone ${label} at ${path}.`, {
      cause: error,
    });
  }

  try {
    return StagedThermalConeDataSchema.parse(JSON.parse(serialized));
  } catch (error) {
    throw new Error(
      `The Thermal Cone ${label} failed product-side runtime validation.`,
      { cause: error },
    );
  }
}

export async function loadThermalConeDataFromPaths(
  paths: ThermalConeDataPaths,
): Promise<StagedThermalConeData> {
  try {
    return await readDataFile(paths.localStaging, "verified local staging artifact");
  } catch (error) {
    if (!isMissingFile((error as Error).cause)) {
      throw error;
    }
  }

  try {
    return await readDataFile(
      paths.deploymentSnapshot,
      "tracked deployment snapshot",
    );
  } catch (error) {
    if (!isMissingFile((error as Error).cause)) {
      throw error;
    }

    throw new Error(
      "Thermal Cone data is unavailable. Run pnpm research:stage:thermal-cones for verified local development, or restore the tracked deployment snapshot for CI builds.",
      { cause: error },
    );
  }
}

export async function loadThermalConeData(): Promise<StagedThermalConeData> {
  return loadThermalConeDataFromPaths(DEFAULT_THERMAL_CONE_DATA_PATHS);
}
