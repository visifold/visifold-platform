import { z } from "zod";

export const SUPPORTED_THERMAL_CONE_BETAS = [0, 0.2, 1] as const;
export const THERMAL_CONE_REGION_IDS = ["past", "incomparable", "future"] as const;

export const SupportedThermalConeBetaSchema = z.union([
  z.literal(0),
  z.literal(0.2),
  z.literal(1),
]);

export const ThermalConeRegionIdSchema = z.enum(THERMAL_CONE_REGION_IDS);

const ProbabilityComponentSchema = z.number().min(0).max(1);

export const ProbabilityVectorSchema = z
  .tuple([
    ProbabilityComponentSchema,
    ProbabilityComponentSchema,
    ProbabilityComponentSchema,
    ProbabilityComponentSchema,
  ])
  .superRefine((value, context) => {
    const sum = value.reduce((total, component) => total + component, 0);

    if (Math.abs(sum - 1) > 1e-10) {
      context.addIssue({
        code: "custom",
        message: "Probability vectors must sum to 1 within 1e-10.",
      });
    }
  });

export const TriangleSchema = z.tuple([
  z.number().int().nonnegative(),
  z.number().int().nonnegative(),
  z.number().int().nonnegative(),
]);

export const ThermalConePieceSchema = z
  .object({
    label: z.string().min(1),
    provenance: z.string().min(1),
    vertices_probability: z.array(ProbabilityVectorSchema).min(4),
    triangles: z.array(TriangleSchema).min(4),
    volume_xyz: z.number().positive(),
  })
  .superRefine((piece, context) => {
    piece.triangles.forEach((triangle, triangleIndex) => {
      triangle.forEach((vertexIndex, localIndex) => {
        if (vertexIndex >= piece.vertices_probability.length) {
          context.addIssue({
            code: "custom",
            message: "Triangle indices must be local to the piece vertex array.",
            path: ["triangles", triangleIndex, localIndex],
          });
        }
      });
    });
  });

export const ThermalConeRegionsSchema = z.object({
  past: z.array(ThermalConePieceSchema).min(1),
  incomparable: z.array(ThermalConePieceSchema).min(1),
  future: z.array(ThermalConePieceSchema).min(1),
});

export const ThermalConeSourceCaseSchema = z
  .object({
    beta: z.number(),
    present: ProbabilityVectorSchema,
    gibbs: ProbabilityVectorSchema,
    source_beta_order: z.array(z.number().int().min(0).max(3)).length(4),
    regions: ThermalConeRegionsSchema,
  })
  .passthrough();

export const ThermalConeSourceGeometrySchema = z.object({
  schema: z.literal("thermal-cones-finite-v1"),
  cases: z.array(ThermalConeSourceCaseSchema).min(1),
});

const PieceCountsSchema = z.object({
  past: z.number().int().positive(),
  incomparable: z.number().int().positive(),
  future: z.number().int().positive(),
});

export const ThermalConeCaseIndexSchema = z
  .object({
    schema: z.literal("visifold-thermal-cone-cases-v1"),
    derived_from: z.object({
      research_relative_path: z.string().min(1),
      sha256: z.string().regex(/^[a-f0-9]{64}$/),
      schema: z.literal("thermal-cones-finite-v1"),
    }),
    fixed_system: z.object({
      state: ProbabilityVectorSchema,
      state_exact: z.string().min(1),
      energies: z.tuple([z.number(), z.number(), z.number(), z.number()]),
      population_labels: z.tuple([z.string(), z.string(), z.string(), z.string()]),
      probability_normalization: z.string().min(1),
      thermal_convention: z.string().min(1),
    }),
    cases: z.array(
      z
        .object({
          beta: z.number(),
          paper_role: z.string().min(1),
          gibbs: ProbabilityVectorSchema,
          source_beta_order_zero_based: z
            .array(z.number().int().min(0).max(3))
            .length(4),
          piece_counts: PieceCountsSchema,
          normalized_volume_fractions: z.object({
            past: z.number().nonnegative(),
            incomparable: z.number().nonnegative(),
            future: z.number().nonnegative(),
          }),
        })
        .passthrough(),
    ),
  })
  .passthrough();

const PortableAssetSchema = z
  .object({
    bytes: z.number().int().nonnegative(),
    sha256: z.string().regex(/^[a-f0-9]{64}$/),
  })
  .passthrough();

export const HandoffManifestSchema = z.object({
  schema: z.literal("visifold-research-handoff-manifest-v1"),
  revision: z.number().int().positive(),
  contract: PortableAssetSchema.extend({
    path: z.string().min(1),
  }),
  handoff_files: z.array(
    PortableAssetSchema.extend({
      path: z.string().min(1),
      role: z.string().min(1),
    }),
  ),
  referenced_assets: z.array(
    PortableAssetSchema.extend({
      id: z.string().min(1),
      research_relative_path: z.string().min(1),
    }),
  ),
  validation_checkpoints: z.array(
    PortableAssetSchema.extend({
      id: z.string().min(1),
      research_relative_path: z.string().min(1),
    }),
  ),
});

export const StagedThermalConeCaseSchema = z.object({
  beta: SupportedThermalConeBetaSchema,
  paper_role: z.string().min(1),
  present: ProbabilityVectorSchema,
  gibbs: ProbabilityVectorSchema,
  source_beta_order: z.array(z.number().int().min(0).max(3)).length(4),
  normalized_volume_fractions: z.object({
    past: z.number().nonnegative(),
    incomparable: z.number().nonnegative(),
    future: z.number().nonnegative(),
  }),
  regions: ThermalConeRegionsSchema,
});

export const StagedThermalConeDataSchema = z
  .object({
    schema: z.literal("visifold-thermal-cones-mvp-v1"),
    release_status: z.literal("local-development-only"),
    provenance: z.object({
      manifest_revision: z.literal(1),
      manifest_sha256: z.string().regex(/^[a-f0-9]{64}$/),
      contract_sha256: z.string().regex(/^[a-f0-9]{64}$/),
      source_geometry_path: z.string().min(1),
      source_geometry_sha256: z.string().regex(/^[a-f0-9]{64}$/),
      case_index_path: z.string().min(1),
      case_index_sha256: z.string().regex(/^[a-f0-9]{64}$/),
    }),
    fixed_system: z.object({
      state: ProbabilityVectorSchema,
      state_exact: z.string().min(1),
      energies: z.tuple([z.number(), z.number(), z.number(), z.number()]),
      population_labels: z.tuple([z.string(), z.string(), z.string(), z.string()]),
      probability_normalization: z.string().min(1),
      thermal_convention: z.string().min(1),
    }),
    cases: z.array(StagedThermalConeCaseSchema).length(3),
  })
  .superRefine((data, context) => {
    const suppliedBetas = new Set(data.cases.map((thermalCase) => thermalCase.beta));

    for (const beta of SUPPORTED_THERMAL_CONE_BETAS) {
      if (!suppliedBetas.has(beta)) {
        context.addIssue({
          code: "custom",
          message: `Missing supported beta case ${beta}.`,
          path: ["cases"],
        });
      }
    }
  });

export type ProbabilityVector = z.infer<typeof ProbabilityVectorSchema>;
export type SupportedThermalConeBeta = z.infer<typeof SupportedThermalConeBetaSchema>;
export type ThermalConeRegionId = z.infer<typeof ThermalConeRegionIdSchema>;
export type ThermalConePiece = z.infer<typeof ThermalConePieceSchema>;
export type StagedThermalConeCase = z.infer<typeof StagedThermalConeCaseSchema>;
export type StagedThermalConeData = z.infer<typeof StagedThermalConeDataSchema>;

export function getThermalConeCase(
  data: StagedThermalConeData,
  beta: SupportedThermalConeBeta,
): StagedThermalConeCase {
  const thermalCase = data.cases.find((candidate) => candidate.beta === beta);

  if (!thermalCase) {
    throw new Error(`The staged handoff does not contain beta ${beta}.`);
  }

  return thermalCase;
}
