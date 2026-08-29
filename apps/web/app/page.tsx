import Link from "next/link";

import { Container } from "@visifold/ui";
import { ScientificCanvas } from "@visifold/visualization";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-graphite text-paper">
      <Container className="flex min-h-screen flex-col py-8 md:py-12">
        <header className="flex items-baseline justify-between border-b border-line pb-5">
          <span className="text-sm font-medium tracking-[0.18em] uppercase">Visifold</span>
          <span className="font-mono text-[0.68rem] tracking-[0.16em] text-muted uppercase">
            Foundation / 001
          </span>
        </header>

        <section className="grid flex-1 items-center gap-12 py-14 lg:grid-cols-[minmax(16rem,0.7fr)_minmax(28rem,1.3fr)] lg:gap-20">
          <div className="max-w-xl">
            <p className="mb-5 font-mono text-xs tracking-[0.16em] text-muted uppercase">
              Scientific visualization platform
            </p>
            <h1 className="text-5xl leading-none font-medium tracking-[-0.045em] md:text-7xl">
              Visifold
            </h1>
            <p className="mt-7 max-w-md text-base leading-7 text-secondary md:text-lg md:leading-8">
              Interactive scientific visualization for physics and mathematics.
            </p>
            <Link
              className="mt-9 inline-flex items-center gap-3 border-b border-[#55595c] pb-2 text-sm text-secondary transition-colors hover:border-paper hover:text-paper"
              href="/visualizations/thermal-cones"
            >
              Explore Thermal Cones
              <span aria-hidden="true" className="font-mono text-xs">
                →
              </span>
            </Link>
          </div>

          <figure>
            <ScientificCanvas className="h-[22rem] w-full border border-line md:h-[32rem]" />
            <figcaption className="mt-3 flex justify-between font-mono text-[0.68rem] tracking-[0.12em] text-muted uppercase">
              <span>Visualization foundation</span>
              <span>Neutral test geometry</span>
            </figcaption>
          </figure>
        </section>
      </Container>
    </main>
  );
}
