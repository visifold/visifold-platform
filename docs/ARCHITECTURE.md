# Visifold Product Architecture

Status: Thermal Cone MVP implemented for local/private development
Decision date: 2026-08-29

This document records the current Visifold implementation architecture. It operates within the scientific scope and release gates in MVP_ACCEPTANCE.md and the ownership rules in the repository AGENTS.md.

## Product position

Visifold is an interactive scientific visualization platform for exploring abstract structures in physics and mathematics. The product is concept-centric, scientifically serious, and oriented toward advanced students, graduate students, and researchers. Scientific objects are primary; explanation is adjacent and available in greater depth on demand.

The architecture supports reusable visualization objects without introducing a generic engine before repeated product needs establish the right abstraction.

## Technical stack

- pnpm workspace
- Next.js with the App Router and static export
- React and TypeScript
- Tailwind CSS
- Three.js and React Three Fiber
- Zod for runtime validation at product contract boundaries
- ESLint for linting and Vitest for focused package tests

The platform remains static and build-time oriented. It has no database, authentication, backend API, CMS, user account system, real-time scientific solver, container platform, or microservice layer.

## Monorepo responsibilities

### apps/web

The public Next.js application owns routes, composition, page metadata, product presentation, and application-level interaction. The Thermal Cone route is `/visualizations/thermal-cones`. It loads validated staged data on the server and hands plain contract data to the client workspace.

### packages/ui

Small reusable product UI primitives. Components are added only when an immediate reusable need exists.

### packages/visualization

The reusable scientific visualization boundary. Thermal Cone modules own the accepted Zod contract, exact probability-simplex embedding, piece-preserving Three.js geometry conversion, and React Three Fiber renderer. The renderer preserves every authoritative convex piece and region identity; it performs no welding, simplification, smoothing, interpolation, convexification, or decimation.

### docs, scripts, and tests

- docs contains durable product, architecture, handoff, provenance, and release decisions.
- scripts contains explicit build-time verification and controlled staging tools.
- tests contains cross-package and product-level verification. Package-local tests stay with the package they validate.

## Thermal Cone research consumption

The research workspace remains an upstream read-only source. Product development consumes the accepted handoff in place when direct access is available.

The configurable build-time variable is:

    VISIFOLD_RESEARCH_ROOT

It identifies an authorized local research project checkout. The accepted Thermal Cone handoff is found at the portable project-relative path `exports/visifold`. Machine-specific paths belong only in uncommitted local environment configuration. The variable is not prefixed with `NEXT_PUBLIC_`, so the research path cannot be embedded in browser code.

The controlled local flow is:

    accepted handoff
    → manifest revision and SHA-256 verification
    → referenced-file hash and byte verification
    → Zod contract validation
    → controlled ignored staging artifact
    → server-side page load
    → interactive product rendering

`scripts/stage-thermal-cones.ts` verifies accepted manifest revision 1 and its recorded digest, every manifest-listed file, referenced case assets, validation checkpoints, case identity, piece counts, and normalized volume fractions. It stages only user-facing beta cases 0, 0.2, and 1.0 to `apps/web/.visifold-research/thermal-cones.json`. That artifact is ignored by Git and is not a redistributable product asset.

See THERMAL_CONES_LOCAL_DEVELOPMENT.md for the command sequence and verification boundary.

## Interaction model

The Thermal Cone MVP uses a wide scientific canvas with an adjacent inspector. Users can rotate and zoom the tetrahedral probability-simplex view, reset the camera, select beta 0, 0.2, or 1.0, toggle past/incomparable/future regions, and inspect an individual convex piece. Diagnostic beta 0.5 is not included in normal navigation.

The explanation below the workspace is constrained to the accepted fixed four-level classical energy-population system. It must not imply arbitrary beta, arbitrary states, arbitrary spectra, or the full quantum state space.

## Intentionally deferred

- Formal machine-readable upstream JSON Schemas
- A quantitative mesh fidelity budget and all geometry optimization
- Final attribution wording and placement
- Redistribution licensing clearance
- Possible future public exposure of diagnostic beta 0.5
- A generalized visualization-object abstraction
- Deployment and hosting configuration
- Any backend, account, persistence, CMS, or real-time computation capability
