# Visifold Product Architecture

Status: Initial MVP foundation
Decision date: 2026-08-29

This document records the first implementation architecture for Visifold. It operates within the scientific scope and release gates in MVP_ACCEPTANCE.md and the ownership rules in the repository AGENTS.md.

## Product position

Visifold is an interactive scientific visualization platform for exploring abstract structures in physics and mathematics. The product is concept-centric, scientifically serious, and oriented toward advanced students, graduate students, and researchers. Scientific objects are primary; explanation is adjacent and available in greater depth on demand.

The initial architecture leaves room for reusable visualization objects without introducing a generic engine before repeated product needs establish the right abstraction.

## Technical stack

- pnpm workspace
- Next.js with the App Router and static export
- React and TypeScript
- Tailwind CSS
- Three.js and React Three Fiber
- Zod for runtime validation at product contract boundaries
- ESLint for linting and Vitest for focused package tests

The platform is intentionally static and build-time oriented. It has no database, authentication, backend API, CMS, user account system, real-time scientific solver, container platform, or microservice layer.

## Monorepo responsibilities

### apps/web

The public Next.js application. It owns routes, composition, page metadata, product presentation, and application-level interaction. Scientific semantics and reusable 3D foundations should not be embedded directly in route components.

### packages/ui

Small reusable product UI primitives. It begins with only the shared layout container required by the application shell. New components should be added only when an immediate reusable need exists.

### packages/visualization

The reusable scientific visualization boundary. It begins with a shared React Three Fiber canvas, camera and lighting defaults, a neutral test object, and a generic Zod parsing helper. It does not yet define a generic visualization-object engine or any Thermal Cone schema.

### docs, scripts, and tests

- docs contains durable product, architecture, handoff, provenance, and release decisions.
- scripts is reserved for explicit build-time verification and controlled staging tools.
- tests is reserved for cross-package and product-level verification. Package-local tests stay with the package they validate.

## Research handoff consumption

The research workspace remains an upstream read-only source. Product development consumes the accepted handoff in place when direct access is available; it does not copy or reconstruct research assets casually.

The configurable build-time variable is:

    VISIFOLD_RESEARCH_ROOT

It identifies an authorized local research project checkout. The Thermal Cone handoff remains at the portable project-relative path exports/visifold. Machine-specific paths belong only in uncommitted local environment configuration. The variable is intentionally not prefixed with NEXT_PUBLIC_, so the research path cannot be embedded in browser code.

The future controlled flow is:

    Research handoff
    → manifest and SHA-256 verification
    → runtime/schema validation
    → controlled product staging
    → website visualization

Only the generic validation boundary exists today. Thermal Cone schemas are not invented here. Research assets are not copied or exposed in the public build because redistribution licensing remains unresolved under MVP_ACCEPTANCE.md.

## Geometry and interaction direction

The first real visualization can use a wide scientific viewport with an adjacent inspector without restructuring the shell. Camera manipulation, beta selection, region toggles, piece selection, and reset behavior remain future feature work. The current neutral geometry proves the shared rendering boundary only.

## Intentionally deferred

- Thermal Cone routes, geometry, scientific copy, and controls
- Formal machine-readable research schemas
- Research manifest verification and controlled staging scripts
- A quantitative mesh fidelity budget and geometry optimization
- Final attribution wording and placement
- Redistribution licensing clearance
- A generalized visualization-object abstraction
- Deployment and hosting configuration
- Any backend, account, persistence, CMS, or real-time computation capability
