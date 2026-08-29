import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@visifold/ui";

import { loadThermalConeData } from "../../../lib/thermal-cones/load-thermal-cones";
import { ThermalConeExplanation } from "./thermal-cone-explanation";
import { ThermalConeWorkspace } from "./thermal-cone-workspace";

export const metadata: Metadata = {
  title: "Thermal Cones — Visifold",
  description:
    "Interactive geometry of past, future, and incomparable states for the validated four-level Thermal Cone system.",
};

export default async function ThermalConesPage() {
  const data = await loadThermalConeData();

  return (
    <main className="min-h-screen bg-graphite text-paper">
      <Container className="py-6 md:py-8">
        <header className="flex items-center justify-between border-b border-line pb-5">
          <Link
            className="text-sm font-medium tracking-[0.18em] uppercase transition-colors hover:text-white"
            href="/"
          >
            Visifold
          </Link>
          <div className="text-right">
            <p className="font-mono text-[0.66rem] tracking-[0.14em] text-muted uppercase">
              Visualization object / 001
            </p>
            <p className="mt-1 text-sm text-secondary">Thermal cones</p>
          </div>
        </header>

        <section className="pt-8 md:pt-10">
          <div className="mb-7 max-w-3xl">
            <p className="font-mono text-[0.68rem] tracking-[0.16em] text-muted uppercase">
              Thermomajorisation geometry
            </p>
            <h1 className="mt-4 text-4xl font-medium tracking-[-0.035em] md:text-6xl">
              Thermal cones
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-secondary">
              Explore the validated past, future, and incomparable regions around a
              fixed four-level population state.
            </p>
          </div>

          <ThermalConeWorkspace data={data} />
        </section>

        <ThermalConeExplanation data={data} />
      </Container>
    </main>
  );
}
