# Visifold Platform

Visifold Platform is the product engineering workspace for Visifold's public interactive visualization experience. This repository owns website architecture, frontend implementation, interaction design, visualization infrastructure, performance, testing, deployment, and future product applications.

Scientific research remains owned by the corresponding upstream projects under `../../02-research`. The first upstream source is `../../02-research/Thermal Cone Visualization`.

## Product–research relationship

```text
Research project
→ validated handoff/export
→ Visifold product implementation
→ public interactive visualization
```

The product should consume validated handoffs and exported assets from research. It must not reinterpret or reconstruct authoritative equations, scientific conclusions, geometry, or datasets without an explicit research source. Product-optimized transformations may be stored here when their provenance and transformation are documented.

## Initial structure

```text
apps/
  web/                 Public web application
packages/
  ui/                  Shared product UI
  visualization/       Shared visualization infrastructure
docs/                  Architecture, decisions, handoffs, and provenance
scripts/               Product development and maintenance scripts
tests/                 Cross-package and product-level tests
```

The repository intentionally begins with no speculative services, databases, APIs, admin panels, or deployment infrastructure. Those should be introduced only when a validated product requirement justifies them.

## Technical foundation

The initial product foundation is a pnpm monorepo with a statically exported Next.js application, shared UI primitives, and a reusable React Three Fiber visualization package. TypeScript, Tailwind CSS, Zod, ESLint, and Vitest provide the baseline development and validation tooling.

    pnpm install
    pnpm dev
    pnpm lint
    pnpm typecheck
    pnpm test
    pnpm build

The first research handoff has been accepted for local/private MVP development. See docs/MVP_ACCEPTANCE.md for its scientific scope and release gates, and docs/ARCHITECTURE.md for the product architecture and build-time handoff strategy.

See `AGENTS.md` for the project governance rules that apply to all implementation work.
