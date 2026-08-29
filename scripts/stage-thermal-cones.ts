import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import {
  HandoffManifestSchema,
  SUPPORTED_THERMAL_CONE_BETAS,
  StagedThermalConeDataSchema,
  ThermalConeCaseIndexSchema,
  ThermalConeSourceGeometrySchema,
  THERMAL_CONE_REGION_IDS,
} from "../packages/visualization/src/thermal-cones/schema";

export const ACCEPTED_MANIFEST_REVISION = 1;
export const ACCEPTED_MANIFEST_SHA256 =
  "27014175c155031a887f972b76e2feaf7a14cbf2de444401254befc503cdeb04";

const REPOSITORY_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const HANDOFF_RELATIVE_PATH = "exports/visifold";
const STAGED_OUTPUT_PATH = resolve(
  REPOSITORY_ROOT,
  "apps/web/.visifold-research/thermal-cones.json",
);

interface PortableFileEntry {
  bytes: number;
  sha256: string;
}

interface ResearchFileEntry extends PortableFileEntry {
  research_relative_path: string;
}

interface HandoffFileEntry extends PortableFileEntry {
  path: string;
}

export function sha256(content: Uint8Array): string {
  return createHash("sha256").update(content).digest("hex");
}

export function resolvePortablePath(root: string, portablePath: string): string {
  const resolvedRoot = resolve(root);
  const resolvedPath = resolve(resolvedRoot, portablePath);
  const pathFromRoot = relative(resolvedRoot, resolvedPath);

  if (
    pathFromRoot === ".." ||
    pathFromRoot.startsWith(`..${sep}`) ||
    isAbsolute(pathFromRoot)
  ) {
    throw new Error(`Portable path escapes its authority root: ${portablePath}`);
  }

  return resolvedPath;
}

export function assertManifestIdentity(
  manifest: { revision: number },
  manifestSha256: string,
): void {
  if (manifest.revision !== ACCEPTED_MANIFEST_REVISION) {
    throw new Error(
      `Handoff revision mismatch: expected ${ACCEPTED_MANIFEST_REVISION}, received ${manifest.revision}.`,
    );
  }

  if (manifestSha256 !== ACCEPTED_MANIFEST_SHA256) {
    throw new Error(
      `Handoff manifest SHA-256 mismatch: expected ${ACCEPTED_MANIFEST_SHA256}, received ${manifestSha256}.`,
    );
  }
}

async function verifyFile(
  path: string,
  expected: PortableFileEntry,
  label: string,
): Promise<Uint8Array> {
  let content: Uint8Array;

  try {
    content = await readFile(path);
  } catch (error) {
    throw new Error(`Missing required ${label}: ${path}`, { cause: error });
  }

  if (content.byteLength !== expected.bytes) {
    throw new Error(
      `Byte-size mismatch for ${label}: expected ${expected.bytes}, received ${content.byteLength}.`,
    );
  }

  const digest = sha256(content);

  if (digest !== expected.sha256) {
    throw new Error(
      `SHA-256 mismatch for ${label}: expected ${expected.sha256}, received ${digest}.`,
    );
  }

  return content;
}

async function verifyHandoffEntry(
  handoffRoot: string,
  entry: HandoffFileEntry,
  label: string,
): Promise<Uint8Array> {
  return verifyFile(
    resolvePortablePath(handoffRoot, entry.path),
    entry,
    label,
  );
}

async function verifyResearchEntry(
  researchRoot: string,
  entry: ResearchFileEntry,
  label: string,
): Promise<Uint8Array> {
  return verifyFile(
    resolvePortablePath(researchRoot, entry.research_relative_path),
    entry,
    label,
  );
}

function assertCaseMetadataAgreement(
  sourceCase: ReturnType<typeof ThermalConeSourceGeometrySchema.parse>["cases"][number],
  caseMetadata: ReturnType<typeof ThermalConeCaseIndexSchema.parse>["cases"][number],
): void {
  for (const region of THERMAL_CONE_REGION_IDS) {
    const actualCount = sourceCase.regions[region].length;
    const expectedCount = caseMetadata.piece_counts[region];

    if (actualCount !== expectedCount) {
      throw new Error(
        `Piece-count mismatch for beta ${sourceCase.beta}, ${region}: expected ${expectedCount}, received ${actualCount}.`,
      );
    }

    const normalizedVolume =
      3 *
      sourceCase.regions[region].reduce(
        (total, piece) => total + piece.volume_xyz,
        0,
      );

    if (
      Math.abs(
        normalizedVolume -
          caseMetadata.normalized_volume_fractions[region],
      ) > 5e-12
    ) {
      throw new Error(
        `Normalized-volume mismatch for beta ${sourceCase.beta}, ${region}.`,
      );
    }
  }
}

export async function stageThermalCones(researchRootInput: string): Promise<{
  outputPath: string;
  outputSha256: string;
  verifiedFileCount: number;
  caseCount: number;
  pieceCount: number;
}> {
  const researchRoot = resolve(REPOSITORY_ROOT, researchRootInput);
  const handoffRoot = resolvePortablePath(researchRoot, HANDOFF_RELATIVE_PATH);
  const manifestPath = resolvePortablePath(handoffRoot, "MANIFEST.json");

  let manifestBytes: Uint8Array;

  try {
    manifestBytes = await readFile(manifestPath);
  } catch (error) {
    throw new Error(
      `Thermal Cone handoff is unavailable at ${handoffRoot}. Set VISIFOLD_RESEARCH_ROOT to the research project root.`,
      { cause: error },
    );
  }

  const manifestSha256 = sha256(manifestBytes);
  const manifest = HandoffManifestSchema.parse(
    JSON.parse(new TextDecoder().decode(manifestBytes)),
  );

  assertManifestIdentity(manifest, manifestSha256);

  const contractBytes = await verifyHandoffEntry(
    handoffRoot,
    manifest.contract,
    "handoff contract",
  );

  const handoffFiles = await Promise.all(
    manifest.handoff_files.map(async (entry) => ({
      entry,
      content: await verifyHandoffEntry(
        handoffRoot,
        entry,
        `handoff file ${entry.path}`,
      ),
    })),
  );

  await Promise.all([
    ...manifest.referenced_assets.map((entry) =>
      verifyResearchEntry(
        researchRoot,
        entry,
        `referenced asset ${entry.id}`,
      ),
    ),
    ...manifest.validation_checkpoints.map((entry) =>
      verifyResearchEntry(
        researchRoot,
        entry,
        `validation checkpoint ${entry.id}`,
      ),
    ),
  ]);

  const sourceGeometryEntry = manifest.referenced_assets.find(
    (entry) => entry.id === "fig9-finite-scientific-geometry",
  );
  const caseIndexEntry = manifest.handoff_files.find(
    (entry) => entry.path === "data/fig9_cases.json",
  );

  if (!sourceGeometryEntry || !caseIndexEntry) {
    throw new Error(
      "The accepted manifest does not contain the required finite geometry and case index entries.",
    );
  }

  const sourceGeometryBytes = await verifyResearchEntry(
    researchRoot,
    sourceGeometryEntry,
    "authoritative finite scientific geometry",
  );
  const caseIndexBytes =
    handoffFiles.find(({ entry }) => entry.path === caseIndexEntry.path)?.content;

  if (!caseIndexBytes) {
    throw new Error("The verified handoff case index could not be loaded.");
  }

  const sourceGeometry = ThermalConeSourceGeometrySchema.parse(
    JSON.parse(new TextDecoder().decode(sourceGeometryBytes)),
  );
  const caseIndex = ThermalConeCaseIndexSchema.parse(
    JSON.parse(new TextDecoder().decode(caseIndexBytes)),
  );

  if (
    caseIndex.derived_from.research_relative_path !==
      sourceGeometryEntry.research_relative_path ||
    caseIndex.derived_from.sha256 !== sourceGeometryEntry.sha256
  ) {
    throw new Error(
      "The case index does not point to the accepted authoritative geometry asset.",
    );
  }

  const stagedCases = SUPPORTED_THERMAL_CONE_BETAS.map((beta) => {
    const sourceCase = sourceGeometry.cases.find(
      (candidate) => candidate.beta === beta,
    );
    const caseMetadata = caseIndex.cases.find(
      (candidate) => candidate.beta === beta,
    );

    if (!sourceCase || !caseMetadata) {
      throw new Error(`The accepted handoff is missing beta ${beta}.`);
    }

    assertCaseMetadataAgreement(sourceCase, caseMetadata);

    return {
      beta,
      paper_role: caseMetadata.paper_role,
      present: sourceCase.present,
      gibbs: sourceCase.gibbs,
      source_beta_order: sourceCase.source_beta_order,
      normalized_volume_fractions: caseMetadata.normalized_volume_fractions,
      regions: sourceCase.regions,
    };
  });

  const stagedData = StagedThermalConeDataSchema.parse({
    schema: "visifold-thermal-cones-mvp-v1",
    release_status: "local-development-only",
    provenance: {
      manifest_revision: manifest.revision,
      manifest_sha256: manifestSha256,
      contract_sha256: sha256(contractBytes),
      source_geometry_path: sourceGeometryEntry.research_relative_path,
      source_geometry_sha256: sourceGeometryEntry.sha256,
      case_index_path: caseIndexEntry.path,
      case_index_sha256: caseIndexEntry.sha256,
    },
    fixed_system: caseIndex.fixed_system,
    cases: stagedCases,
  });

  const serialized = `${JSON.stringify(stagedData)}\n`;
  const serializedBytes = new TextEncoder().encode(serialized);

  await mkdir(dirname(STAGED_OUTPUT_PATH), { recursive: true });
  await writeFile(STAGED_OUTPUT_PATH, serializedBytes);

  const pieceCount = stagedData.cases.reduce(
    (caseTotal, thermalCase) =>
      caseTotal +
      THERMAL_CONE_REGION_IDS.reduce(
        (regionTotal, region) =>
          regionTotal + thermalCase.regions[region].length,
        0,
      ),
    0,
  );

  return {
    outputPath: STAGED_OUTPUT_PATH,
    outputSha256: sha256(serializedBytes),
    verifiedFileCount:
      1 +
      manifest.handoff_files.length +
      manifest.referenced_assets.length +
      manifest.validation_checkpoints.length,
    caseCount: stagedData.cases.length,
    pieceCount,
  };
}

async function main() {
  const researchRoot = process.env.VISIFOLD_RESEARCH_ROOT;

  if (!researchRoot) {
    throw new Error(
      "VISIFOLD_RESEARCH_ROOT is required and must point to the Thermal Cone research project root.",
    );
  }

  const result = await stageThermalCones(researchRoot);

  console.log(
    `Verified manifest revision ${ACCEPTED_MANIFEST_REVISION} and ${result.verifiedFileCount} manifest-listed files.`,
  );
  console.log(
    `Staged ${result.caseCount} supported beta cases with ${result.pieceCount} preserved convex pieces.`,
  );
  console.log(`Local artifact: ${result.outputPath}`);
  console.log(`Staged SHA-256: ${result.outputSha256}`);
  console.log("Release status: local development only; do not publish this artifact.");
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
