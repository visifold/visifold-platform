"use client";

import {
  SUPPORTED_THERMAL_CONE_BETAS,
  THERMAL_CONE_REGION_IDS,
  ThermalConeCanvas,
  getThermalConeCase,
  type StagedThermalConeData,
  type SupportedThermalConeBeta,
  type ThermalConeRegionId,
  type ThermalConeSelection,
} from "@visifold/visualization";
import { useMemo, useState } from "react";

const REGION_PRESENTATION: Record<
  ThermalConeRegionId,
  { label: string; color: string; immediate: string }
> = {
  past: {
    label: "Past",
    color: "#c2a46f",
    immediate:
      "States in this region can thermodynamically evolve to the fixed present state p.",
  },
  incomparable: {
    label: "Incomparable",
    color: "#71899e",
    immediate:
      "States in this region are related to p in neither direction under thermomajorisation.",
  },
  future: {
    label: "Future",
    color: "#6f9f8d",
    immediate:
      "States in this region are thermodynamically reachable from the fixed present state p.",
  },
};

function formatBeta(beta: SupportedThermalConeBeta) {
  return beta === 1 ? "1.0" : String(beta);
}

function formatVector(vector: readonly number[]) {
  return vector.map((value) => value.toFixed(4)).join(", ");
}

export function ThermalConeWorkspace({ data }: { data: StagedThermalConeData }) {
  const [beta, setBeta] = useState<SupportedThermalConeBeta>(0.2);
  const [visibleRegions, setVisibleRegions] = useState<
    Record<ThermalConeRegionId, boolean>
  >({
    past: true,
    incomparable: true,
    future: true,
  });
  const [selected, setSelected] = useState<ThermalConeSelection | null>(null);
  const [resetToken, setResetToken] = useState(0);

  const thermalCase = useMemo(() => getThermalConeCase(data, beta), [beta, data]);
  const pieceCount = THERMAL_CONE_REGION_IDS.reduce(
    (total, region) => total + thermalCase.regions[region].length,
    0,
  );

  function changeBeta(nextBeta: SupportedThermalConeBeta) {
    setBeta(nextBeta);
    setSelected(null);
  }

  function toggleRegion(region: ThermalConeRegionId) {
    setVisibleRegions((current) => {
      const visible = !current[region];

      if (!visible && selected?.region === region) {
        setSelected(null);
      }

      return { ...current, [region]: visible };
    });
  }

  return (
    <section
      className="overflow-hidden border border-line bg-[#0d0f10]"
      data-current-beta={beta}
      data-testid="thermal-cone-workspace"
    >
      <div className="grid min-h-[44rem] xl:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]">
        <div className="relative min-h-[30rem] border-b border-line xl:min-h-[44rem] xl:border-r xl:border-b-0">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4 md:p-6">
            <div>
              <p className="font-mono text-[0.66rem] tracking-[0.14em] text-[#a5a7a7] uppercase">
                β = {formatBeta(beta)}
              </p>
              <p className="mt-1 text-xs text-[#74787a]">
                {pieceCount} convex pieces · direct scientific JSON
              </p>
            </div>
            <div className="text-right font-mono text-[0.62rem] leading-5 tracking-[0.08em] text-[#74787a] uppercase">
              <p>Drag to rotate</p>
              <p>Scroll to zoom</p>
            </div>
          </div>

          <ThermalConeCanvas
            className="h-[30rem] w-full xl:h-[44rem]"
            onSelect={setSelected}
            resetToken={resetToken}
            selected={selected}
            thermalCase={thermalCase}
            visibleRegions={visibleRegions}
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center gap-5 p-4 font-mono text-[0.62rem] tracking-[0.08em] text-[#8a8d8e] uppercase md:p-6">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#f1ece2]" />
              Present p
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#9ab2c5]" />
              Gibbs γ
            </span>
          </div>
        </div>

        <aside className="flex flex-col bg-[#131618]" aria-label="Thermal Cone inspector">
          <div className="border-b border-line p-5 md:p-6">
            <p className="font-mono text-[0.66rem] tracking-[0.14em] text-muted uppercase">
              Inverse temperature
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2" role="group" aria-label="Beta case">
              {SUPPORTED_THERMAL_CONE_BETAS.map((candidate) => {
                const active = candidate === beta;

                return (
                  <button
                    key={candidate}
                    aria-pressed={active}
                    className={
                      active
                        ? "border border-[#d8d3c9] bg-[#e8e3d9] px-3 py-2.5 font-mono text-xs text-[#111416]"
                        : "border border-line px-3 py-2.5 font-mono text-xs text-secondary transition-colors hover:border-[#666a6d] hover:text-paper"
                    }
                    data-testid={`beta-${candidate}`}
                    onClick={() => changeBeta(candidate)}
                    type="button"
                  >
                    β {formatBeta(candidate)}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-xs leading-5 text-muted">
              Discrete validated cases only. No interpolation is performed.
            </p>
          </div>

          <div className="border-b border-line p-5 md:p-6">
            <p className="font-mono text-[0.66rem] tracking-[0.14em] text-muted uppercase">
              Regions
            </p>
            <div className="mt-4 space-y-2">
              {THERMAL_CONE_REGION_IDS.map((region) => {
                const presentation = REGION_PRESENTATION[region];
                const count = thermalCase.regions[region].length;
                const volume =
                  100 * thermalCase.normalized_volume_fractions[region];

                return (
                  <label
                    key={region}
                    className="flex cursor-pointer items-center gap-3 border border-transparent py-1.5 text-sm hover:text-white"
                  >
                    <input
                      checked={visibleRegions[region]}
                      className="h-4 w-4 accent-[#d8d3c9]"
                      data-testid={`region-${region}`}
                      onChange={() => toggleRegion(region)}
                      type="checkbox"
                    />
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: presentation.color }}
                    />
                    <span className="flex-1">{presentation.label}</span>
                    <span className="font-mono text-[0.66rem] text-muted">
                      {count} · {volume.toFixed(1)}%
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex flex-1 flex-col p-5 md:p-6" data-testid="selected-item">
            <p className="font-mono text-[0.66rem] tracking-[0.14em] text-muted uppercase">
              Selected item
            </p>

            {selected ? (
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: REGION_PRESENTATION[selected.region].color }}
                  />
                  <h2 className="text-lg font-medium">
                    {REGION_PRESENTATION[selected.region].label}
                  </h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-secondary">
                  {REGION_PRESENTATION[selected.region].immediate}
                </p>
                <dl className="mt-5 space-y-3 border-t border-line pt-4 text-xs">
                  <div>
                    <dt className="font-mono tracking-[0.08em] text-muted uppercase">
                      Piece
                    </dt>
                    <dd className="mt-1 leading-5 text-secondary">{selected.label}</dd>
                  </div>
                  <div>
                    <dt className="font-mono tracking-[0.08em] text-muted uppercase">
                      Construction provenance
                    </dt>
                    <dd className="mt-1 leading-5 text-secondary">
                      {selected.provenance}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono tracking-[0.08em] text-muted uppercase">
                      XYZ volume
                    </dt>
                    <dd className="mt-1 text-secondary">
                      {selected.volumeXyz.toExponential(4)}
                    </dd>
                  </div>
                </dl>
              </div>
            ) : (
              <div className="mt-4">
                <h2 className="text-lg font-medium">Four-state probability simplex</h2>
                <p className="mt-3 text-sm leading-6 text-secondary">
                  This tetrahedron contains normalized, energy-incoherent population
                  states. Select a rendered piece to inspect its thermodynamic relation
                  to the fixed state p.
                </p>
              </div>
            )}

            <div className="mt-auto border-t border-line pt-5">
              <p className="font-mono text-[0.62rem] leading-5 tracking-[0.06em] text-muted uppercase">
                γ = ({formatVector(thermalCase.gibbs)})
              </p>
              <div className="mt-4 flex items-center justify-between gap-4">
                <a
                  className="text-sm text-secondary underline decoration-[#55595c] underline-offset-4 transition-colors hover:text-paper"
                  href="#region-relations"
                >
                  Learn more
                </a>
                <button
                  className="border border-line px-3 py-2 font-mono text-[0.66rem] tracking-[0.08em] text-secondary uppercase transition-colors hover:border-[#666a6d] hover:text-paper"
                  data-reset-count={resetToken}
                  data-testid="reset-camera"
                  onClick={() => setResetToken((token) => token + 1)}
                  type="button"
                >
                  Reset view
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
