# Thermal Cone Local Development

Status: Local/private MVP only
Accepted manifest revision: `1`
Accepted manifest SHA-256: `27014175c155031a887f972b76e2feaf7a14cbf2de444401254befc503cdeb04`

This workflow consumes the accepted Thermal Cone handoff without modifying or copying arbitrary research internals. Redistribution licensing remains unresolved, so research-derived assets and derivatives must not be published, deployed, or committed.

## Configure the upstream checkout

Set `VISIFOLD_RESEARCH_ROOT` to an authorized local checkout of the Thermal Cone research project. Keep the machine-specific value in an uncommitted local environment or shell configuration.

PowerShell example:

    $env:VISIFOLD_RESEARCH_ROOT = "D:\path\to\Thermal Cone Visualization"

The product resolves the accepted handoff at the portable relative path `exports/visifold`.

## Stage and verify

Run:

    pnpm research:stage:thermal-cones

The staging script performs a read-only upstream review. It verifies:

- the accepted manifest revision and manifest SHA-256;
- the contract, every manifest-listed asset, and each referenced asset by byte count and SHA-256;
- the declared validation checkpoints;
- the finite-geometry and case-index contracts with Zod;
- supported case identities, convex-piece counts, and normalized volume fractions;
- exclusion of diagnostic beta `0.5` from the staged public-navigation cases.

A successful run writes `apps/web/.visifold-research/thermal-cones.json`. This generated local artifact is ignored by Git. It preserves authoritative convex-piece structure, region identities, probability coordinates, triangle indices, labels, volumes, and provenance; it does not optimize or alter geometry.

## Run the local MVP

Stage and start the application together:

    pnpm dev:thermal-cones

Then open:

    http://localhost:3000/visualizations/thermal-cones

For a production-mode local verification:

    pnpm build:thermal-cones

The standard `pnpm dev` and `pnpm build` commands assume the ignored staging artifact already exists.

## Release boundary

Local/private development is allowed. Do not deploy, publish, redistribute, or commit the upstream assets or the staged artifact until redistribution licensing is explicitly cleared. Attribution wording and placement must also be resolved before public release.

Scientific changes require research review. Product code may change presentation and interaction only within the accepted handoff rules. Geometry optimization remains deferred until product and research agree on a quantitative fidelity metric and tolerance.
