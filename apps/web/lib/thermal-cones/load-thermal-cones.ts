import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import {
  StagedThermalConeDataSchema,
  type StagedThermalConeData,
} from "@visifold/visualization";

const STAGED_DATA_PATH = resolve(
  process.cwd(),
  ".visifold-research/thermal-cones.json",
);

export async function loadThermalConeData(): Promise<StagedThermalConeData> {
  let serialized: string;

  try {
    serialized = await readFile(STAGED_DATA_PATH, "utf8");
  } catch (error) {
    throw new Error(
      "Thermal Cone local data is not staged. Set VISIFOLD_RESEARCH_ROOT and run pnpm research:stage:thermal-cones from the repository root.",
      { cause: error },
    );
  }

  try {
    return StagedThermalConeDataSchema.parse(JSON.parse(serialized));
  } catch (error) {
    throw new Error(
      "The staged Thermal Cone data failed product-side runtime validation. Re-run the verified staging command.",
      { cause: error },
    );
  }
}
