"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { StateTax } from "@/lib/states";
import type { CityTaxLocation } from "@/lib/cities";

export default function SalaryLocationJump({
  amount,
  states,
  selectedStateSlug,
  cities = [],
  selectedCitySlug,
}: {
  amount: number;
  states: StateTax[];
  selectedStateSlug?: string;
  cities?: CityTaxLocation[];
  selectedCitySlug?: string;
}) {
  const router = useRouter();
  const [stateValue, setStateValue] = useState(selectedStateSlug ?? "");
  const [cityValue, setCityValue] = useState(selectedCitySlug ?? "");

  const cityOptions = useMemo(() => cities.slice().sort((a, b) => a.name.localeCompare(b.name)), [cities]);

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="state-jump" className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-amber-200/70">
          Jump to a state
        </label>
        <select
          id="state-jump"
          value={stateValue}
          onChange={(event) => {
            const next = event.target.value;
            setStateValue(next);
            setCityValue("");
            if (next) router.push(`/salary/${amount}/${next}`);
          }}
          className="w-full rounded-none border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-white/20"
        >
          <option value="">Choose a state</option>
          {states.map((state) => (
            <option key={state.slug} value={state.slug}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      {cityOptions.length > 0 ? (
        <div>
          <label htmlFor="city-jump" className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-amber-200/70">
            Jump to a city
          </label>
          <select
            id="city-jump"
            value={cityValue}
            onChange={(event) => {
              const next = event.target.value;
              setCityValue(next);
              if (next && selectedStateSlug) {
                router.push(`/salary/${amount}/${selectedStateSlug}/${next}`);
              }
            }}
            className="w-full rounded-none border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-white/20"
          >
            <option value="">Choose a city</option>
            {cityOptions.map((city) => (
              <option key={city.slug} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </div>
  );
}
