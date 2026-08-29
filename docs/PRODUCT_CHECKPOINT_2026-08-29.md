# Visifold Product Checkpoint — 2026-08-29

Status: End-of-day production prototype checkpoint
Recorded: 2026-08-29

This document records the product state at the end of the first Thermal Cone implementation cycle. It is an operational checkpoint, not a change to the scientific authority, accepted handoff, geometry policy, or unresolved publication gates recorded elsewhere in this repository.

## Operational product surfaces

- Production site: https://visifold.dev
- Thermal Cone visualization: https://visifold.dev/visualizations/thermal-cones
- Visualization route: `/visualizations/thermal-cones`
- Vercel project: `visifold-platform-web`
- GitHub repository: `visifold/visifold-platform`

The production homepage contains the understated entry point “Explore Thermal Cones,” linking to `/visualizations/thermal-cones`.

## Operational stack

The production product foundation is operational with:

- pnpm workspace
- Next.js
- React
- TypeScript
- React Three Fiber
- Three.js
- Tailwind CSS
- Zod

The application remains a static, build-time-oriented Next.js product. No speculative backend, database, authentication, CMS, account, or real-time scientific solver has been introduced.

## Thermal Cone MVP capability

The first real Visifold Visualization Object is available at `/visualizations/thermal-cones`.

It currently supports:

- validated beta cases `0`, `0.2`, and `1.0`;
- Past, Incomparable, and Future region visibility toggles;
- rotate and zoom;
- convex piece and region selection;
- a scientific inspector;
- camera reset;
- adjacent explanation sections;
- provenance-aware, runtime-validated scientific ingestion.

Diagnostic beta `0.5` is not exposed in normal navigation. The product still represents only the accepted fixed four-level classical energy-population simplex and must not imply support for arbitrary beta, states, spectra, Hamiltonians, or the full quantum state space.

## Research-to-product data flow

The current controlled flow is:

    Thermal Cone research handoff
    → manifest and SHA-256 verification
    → Zod validation
    → ignored local staging during verified development
    → tracked prototype deployment snapshot fallback
    → static Next.js build

Local development continues to prefer `apps/web/.visifold-research/thermal-cones.json`, generated through `VISIFOLD_RESEARCH_ROOT` and the verified staging script. CI and Vercel builds fall back to the tracked snapshot when local staging is unavailable.

### Tracked prototype snapshot

Path:

    apps/web/publication-data/thermal-cones/thermal-cones.json

Recorded provenance:

- artifact role: `tracked-deployment-snapshot`
- release status: `prototype-testing-only`
- research project: `Thermal Cone Visualization`
- handoff path: `exports/visifold`
- accepted manifest revision: `1`
- accepted manifest SHA-256: `27014175c155031a887f972b76e2feaf7a14cbf2de444401254befc503cdeb04`
- source geometry: `outputs/data/fig9_finite_geometry.json`
- source geometry SHA-256: `496efdddbb757d32fc6c69b08b40649073b52ae1e68fe5f01cdb97293c6f2949`
- supported beta cases: `0`, `0.2`, and `1`

The snapshot preserves the verified scientific payload without geometry optimization, simplification, welding, decimation, interpolation, smoothing, convexification, or topology changes. Its presence in the deployed prototype does not by itself resolve final publication licensing or attribution policy.

## Current UX direction

The established product direction is:

- high-end scientific software × academic publication;
- dark but restrained;
- object first, with explanation adjacent and depth on demand;
- approximately two-thirds visualization and one-third inspector on desktop;
- mathematically serious;
- no sci-fi, neon, glow-heavy, or startup-gradient visual language.

Human review found the current Thermal Cone UI good enough for this MVP checkpoint. Do not change it merely for visual novelty; later changes should respond to concrete usability findings, scientific review, or validated product needs.

## Temporary Git and Vercel identity workflow

During the current Vercel Hobby-plan phase, normal development commits must use the repository-local identity:

    Chen Zui
    322386990+zui-chen@users.noreply.github.com

When a deployment trigger is required, create a separate empty commit authored by:

    Visifold
    322154557+visifold@users.noreply.github.com

Immediately after creating that empty commit, restore the repository-local author to Chen Zui. Do not change global Git identity.

This is a temporary Vercel Hobby-plan workaround. It is not the intended long-term deployment architecture. Future deployment and team identity cleanup must remove the need for author-swapping trigger commits.

## Repository health at checkpoint opening

- branch: `main`
- working tree: clean
- local and `origin/main`: synchronized
- repository-local author: `Chen Zui <322386990+zui-chen@users.noreply.github.com>`
- checkpoint-opening HEAD: `fc491ec7df7d4d8b177bf9a8a7b261940034dd94`

Latest relevant commits before this documentation checkpoint:

- `fc491ec` — `chore: trigger Vercel deployment` — Visifold
- `f6de118` — `feat: link homepage to Thermal Cones` — Chen Zui
- `090d389` — `chore: trigger Vercel deployment` — Visifold
- `74233ee` — `fix: add deployable Thermal Cone data snapshot` — Chen Zui
- `2fa5ffc` — `feat: implement Thermal Cone visualization MVP` — Chen Zui
- `a944ced` — `chore: scaffold Visifold web platform` — Chen Zui

## Unresolved product items

Record these without treating them as solved:

- final publication licensing and attribution review;
- future deployment and team identity cleanup;
- an eventual quantitative geometry fidelity budget for optimization;
- formal machine-readable scientific schemas;
- selection and implementation of a second visualization;
- proving the reusable Visualization Object architecture with another scientific concept.

A sensible next product step is to identify and accept the second research-to-product handoff before generalizing the Visualization Object architecture. Reuse should be extracted from two concrete validated concepts rather than invented speculatively.
