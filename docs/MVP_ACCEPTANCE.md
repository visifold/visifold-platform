# Thermal Cone MVP Downstream Acceptance

Status: Accepted for local/private MVP development  
Decision date: 2026-08-29

This document records the product-side acceptance decision for the first Thermal Cone research handoff. It is the durable scope and release gate for MVP implementation. A later handoff revision or product decision must update or supersede this document explicitly.

## 1. Upstream source

- Research project: `D:\Projects\Visifold\02-research\Thermal Cone Visualization`
- Handoff: `exports\visifold`
- Accepted manifest revision: `1`
- Accepted manifest SHA-256: `27014175c155031a887f972b76e2feaf7a14cbf2de444401254befc503cdeb04`

The accepted handoff is the authoritative upstream contract. Product work must verify the manifest revision and SHA-256 before consuming the handoff or regenerating a derivative.

## 2. MVP scientific scope

- User-facing beta cases are `0`, `0.2`, and `1.0`.
- Beta `0.5` remains diagnostic and is not part of default public navigation.
- The MVP represents the fixed validated four-level classical energy-population simplex only.
- The product must not imply support for arbitrary beta, arbitrary states, arbitrary spectra, or the full quantum state space.

## 3. Geometry policy

- Render the authoritative scientific JSON directly.
- Preserve convex-piece structure and region identities.
- Do not perform mesh simplification, welding, decimation, convexification, interpolation, smoothing, or any other geometry-altering optimization yet.
- Mesh optimization is deferred until research and product agree on a quantitative fidelity budget.

## 4. Release policy

- Redistribution licensing is unresolved and blocks public release of research-derived assets or derivatives.
- Local/private MVP development is allowed.
- Do not publish or redistribute upstream assets until licensing is explicitly cleared.

## 5. Attribution policy

- Citation and reconstruction-credit placement must be resolved before public release.
- Figure 9(c) must remain represented as beta `1.0` according to the accepted research contract.
- Beta `0.5` must not silently replace Figure 9(c).

## 6. Product/research boundary

- Product may change visual presentation and interaction only within the accepted handoff rules.
- Scientific changes require research review.
- Research remains the source of scientific truth.

## 7. Deferred items

- Redistribution licensing
- Final attribution wording and placement
- Mesh fidelity metric and tolerance
- Possible future exposure of beta `0.5`
- Formal machine-readable JSON Schemas

None of these deferred items may be treated as implicitly resolved by implementation choices or chat history. Release-blocking items must be recorded as cleared in a durable product decision before public release.
