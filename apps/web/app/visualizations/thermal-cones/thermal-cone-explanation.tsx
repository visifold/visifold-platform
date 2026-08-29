import type { ReactNode } from "react";

import type { StagedThermalConeData } from "@visifold/visualization";

function Section({
  id,
  index,
  title,
  children,
}: {
  id?: string;
  index: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-4 border-t border-line py-10 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-10 md:py-14" id={id}>
      <p className="font-mono text-[0.66rem] tracking-[0.14em] text-muted uppercase">
        {index}
      </p>
      <div className="max-w-3xl">
        <h2 className="text-2xl font-medium tracking-[-0.02em] md:text-3xl">
          {title}
        </h2>
        <div className="mt-5 space-y-4 text-sm leading-7 text-secondary md:text-base md:leading-8">
          {children}
        </div>
      </div>
    </section>
  );
}

export function ThermalConeExplanation({ data }: { data: StagedThermalConeData }) {
  return (
    <article className="mt-16 md:mt-24">
      <Section index="01" title="What am I looking at?">
        <p>
          The outer tetrahedron is the probability simplex of four classical
          energy populations q = (q₁, q₂, q₃, q₄), with qᵢ ≥ 0 and Σqᵢ = 1. It
          is not the full quantum state space of a four-level system.
        </p>
        <p>
          For each validated inverse temperature, the simplex is partitioned
          chamber by chamber into states that are past, future, or incomparable
          relative to one fixed present state.
        </p>
      </Section>

      <Section index="02" title="The fixed system">
        <p>
          The present state is fixed at p = {data.fixed_system.state_exact}. The
          energy spectrum is E = ({data.fixed_system.energies.join(", ")}) in
          equal-spacing energy units.
        </p>
        <p>
          This first Visualization Object does not vary p, the energy spectrum,
          or the number of levels. Its geometry is the validated Figure 9
          reconstruction only.
        </p>
      </Section>

      <Section index="03" title="Gibbs state and beta">
        <p>
          Beta is inverse temperature under k<sub>B</sub> = 1. Each discrete beta
          case carries its own normalized Gibbs population γ; the marker in the
          scene therefore moves when the case changes.
        </p>
        <p>
          Only beta 0, 0.2, and 1.0 are presented. The interface switches between
          complete validated datasets and never constructs intermediate
          scientific geometry.
        </p>
      </Section>

      <Section id="region-relations" index="04" title="Past, future, and incomparable regions">
        <p>
          A past state can thermodynamically evolve to p. A future state is
          reachable from p. An incomparable state is related to p in neither
          direction under thermomajorisation.
        </p>
        <p>
          Every visible object remains one source convex piece. Region toggles
          isolate these pieces for inspection without merging, filling, or
          changing the underlying geometry.
        </p>
      </Section>

      <Section index="05" title="Why the geometry changes with beta">
        <p>
          Across the three validated cases, the supplied Gibbs state and the
          thermomajorisation partition change. The resulting chamber
          decomposition, relative region volumes, and visible boundaries
          therefore differ with beta.
        </p>
        <p>
          The page makes no claim about values between the supplied cases and
          performs no continuous-beta interpolation.
        </p>
      </Section>

      <Section index="06" title="Scientific source and provenance">
        <p>
          Scientific source: A. de Oliveira Junior, J. Czartowski, K.
          Życzkowski, and K. Korzekwa, “Geometric structure of thermal cones,”
          Physical Review E 106, 064109 (2022), DOI
          10.1103/PhysRevE.106.064109; arXiv:2207.02237v3.
        </p>
        <p>
          This local-development build is locked to handoff revision{" "}
          {data.provenance.manifest_revision}, manifest SHA-256{" "}
          <span className="break-all font-mono text-xs text-[#989b9d]">
            {data.provenance.manifest_sha256}
          </span>
          . Figure 9(c) is represented as beta 1.0 under the accepted contract;
          beta 0.5 is not exposed here.
        </p>
        <p className="border-l border-[#6b5f49] pl-4 text-[#a9a49a]">
          Redistribution licensing and final public attribution placement remain
          unresolved. This page and its staged research derivative are for local
          review only.
        </p>
      </Section>
    </article>
  );
}
