# Thermal Cone Data Workflow

Status: Verified local development plus early-stage prototype deployment snapshot
Accepted manifest revision: `1`
Accepted manifest SHA-256: `27014175c155031a887f972b76e2feaf7a14cbf2de444401254befc503cdeb04`

This workflow consumes the accepted Thermal Cone handoff without modifying arbitrary research internals. Redistribution licensing remains unresolved. The repository-tracked deployment snapshot described below is an explicit early-stage prototype/testing mechanism, not a final publication or licensing policy.

## Configure the upstream checkout

Set `VISIFOLD_RESEARCH_ROOT` to an authorized local checkout of the Thermal Cone research project. Keep the machine-specific value in an uncommitted local environment or shell configuration.

PowerShell example:

    $env:VISIFOLD_RESEARCH_ROOT = "D:\path\to\Thermal Cone Visualization"

The product resolves the accepted handoff at the portable relative path `exports/visifold`.

## Stage and verify locally

Run:

    pnpm research:stage:thermal-cones

The staging script performs a read-only upstream review. It verifies:

- the accepted manifest revision and manifest SHA-256;
- the contract, every manifest-listed asset, and each referenced asset by byte count and SHA-256;
- the declared validation checkpoints;
- the finite-geometry and case-index contracts with Zod;
- supported case identities, convex-piece counts, and normalized volume fractions;
- exclusion of diagnostic beta `0.5` from the staged navigation cases.

A successful run writes `apps/web/.visifold-research/thermal-cones.json`. This generated local artifact is ignored by Git. It preserves authoritative convex-piece structure, region identities, probability coordinates, triangle indices, labels, volumes, and provenance; it does not optimize or alter geometry.

## Generate the prototype deployment snapshot

After successful local staging, run:

    pnpm data:snapshot:thermal-cones

This command validates the ignored staged artifact against the same Zod contract and accepted manifest identity, then writes:

    apps/web/publication-data/thermal-cones/thermal-cones.json

The snapshot changes only product distribution metadata from verified local staging to tracked prototype/testing snapshot. Scientific geometry, fixed-system data, beta cases, region identities, piece boundaries, triangle indices, volumes, and research provenance are copied unchanged.

The tracked snapshot exists solely so CI and Vercel prototype builds do not require access to a developer's research checkout. It is not a general research export, a declaration of final redistribution rights, or the final publication-data policy.

## Loader precedence

The application loader uses:

    ignored verified local staging, when present
    → tracked prototype deployment snapshot
    → explicit build error if neither exists

Invalid local staging fails validation and is not silently replaced by the snapshot.

## Run the MVP

For verified local development:

    pnpm dev:thermal-cones

Then open:

    http://localhost:3000/visualizations/thermal-cones

For a local build that refreshes staging first:

    pnpm build:thermal-cones

The standard `pnpm dev` and `pnpm build` commands prefer existing local staging and otherwise use the tracked prototype snapshot.

## Release boundary

The tracked snapshot is approved here only for early prototype/testing deployment. It does not resolve redistribution licensing or establish a final public-release policy. Do not add upstream PDFs, PNGs, 3MF files, arbitrary research directories, or other research assets to this repository.

Final public release still requires explicit licensing clearance and resolved attribution wording and placement. Scientific changes require research review. Geometry optimization remains deferred until product and research agree on a quantitative fidelity metric and tolerance.
