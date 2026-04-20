"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getCitiesForState } from "@/lib/cities";
import { STATES } from "@/lib/states";
import { HOURLY_PRESETS, SALARY_GRID, buildSalaryPath, normalizeSalaryInput } from "@/lib/salary";

type Props = {
  initialAmount: number;
  initialStateSlug?: string;
  initialCitySlug?: string;
  title?: string;
  description?: string;
  quickButtonsAsLinks?: boolean;
};

function parseCurrencyInput(value: string) {
  const cleaned = value.replace(/[^0-9.]/g, "");
  return cleaned;
}

function formatInput(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function SalaryCalculatorPanel({
  initialAmount,
  initialStateSlug,
  initialCitySlug,
  title,
  description = "Run the numbers here first, then compare the same salary across different states and cities.",
}: Props) {
  const router = useRouter();
  const [amountInput, setAmountInput] = useState(formatInput(initialAmount));
  const [stateSlug, setStateSlug] = useState(initialStateSlug ?? "");
  const [citySlug, setCitySlug] = useState(initialCitySlug ?? "");

  const currentAmount = useMemo(() => {
    const parsed = Number(amountInput.replace(/,/g, ""));
    return normalizeSalaryInput(Number.isFinite(parsed) ? parsed : initialAmount);
  }, [amountInput, initialAmount]);

  const cities = stateSlug ? getCitiesForState(stateSlug) : [];

  function navigate(nextAmount = currentAmount, nextStateSlug = stateSlug, nextCitySlug = citySlug) {
    const path = buildSalaryPath(nextAmount, nextStateSlug || null, nextCitySlug || null);
    router.push(path);
  }

  return (
    <section className="border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.28)]">
      {title && (
      <h1 className="mb-3 text-center text-4xl font-bold">
      {title}
      </h1>
      )}
      <p className="mb-6 text-center text-base text-[#d2c7b2] leading-relaxed">{description}</p>

      <div className="mx-auto grid w-full max-w-2xl gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[#b29f7a]">Annual Salary</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b826f]">$</span>
            <input
              inputMode="numeric"
              value={amountInput}
              onChange={(event) => setAmountInput(parseCurrencyInput(event.target.value))}
              onBlur={() => setAmountInput(formatInput(currentAmount))}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  setAmountInput(formatInput(currentAmount));
                  navigate(currentAmount, stateSlug, citySlug);
                }
              }}
              className="w-full border border-[#2f2a22] bg-[#1b1b1b] py-3 pl-8 pr-4 text-white focus:border-[#b29f7a] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#b29f7a]">State</label>
          <select
            value={stateSlug}
            onChange={(event) => {
              setStateSlug(event.target.value);
              setCitySlug("");
            }}
            className="w-full border border-[#2f2a22] bg-[#1b1b1b] px-4 py-3 text-white focus:border-[#b29f7a] focus:outline-none"
          >
            <option value="">No state selected</option>
            {STATES.map((state) => (
              <option key={state.slug} value={state.slug}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#b29f7a]">City</label>
          <select
            value={citySlug}
            onChange={(event) => setCitySlug(event.target.value)}
            disabled={!stateSlug}
            className="w-full border border-[#2f2a22] bg-[#1b1b1b] px-4 py-3 text-white disabled:opacity-50 focus:border-[#b29f7a] focus:outline-none"
          >
            <option value="">No city selected</option>
            {cities.map((city) => (
              <option key={city.slug} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mx-auto mt-5 flex w-full max-w-2xl justify-center">
        <button
          type="button"
          onClick={() => {
            setAmountInput(formatInput(currentAmount));
            navigate(currentAmount, stateSlug, citySlug);
          }}
          className="w-full border border-[#4a4034] bg-[#241f19] px-6 py-3 transition-all duration-200 hover:border-[#b29f7a] hover:bg-[#2d271f] active:scale-[0.99]"
        >
          Calculate
        </button>
      </div>

      <div className="mx-auto mt-6 w-full max-w-2xl">
        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Quick salary examples</p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {SALARY_GRID.filter((value) => [30000, 50000, 60000, 75000, 100000, 150000].includes(value)).map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => {
                setAmountInput(formatInput(amount));
                navigate(amount, stateSlug, citySlug);
              }}
              className="flex min-h-[52px] items-center justify-center border border-[#2f2a22] bg-[#141414] px-4 py-3 text-center text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]"
            >
              ${amount.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-6 w-full max-w-2xl">
        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Common hourly benchmarks</p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {HOURLY_PRESETS.map((hourly) => {
            const amount = normalizeSalaryInput(hourly * 2080);
            return (
              <button
                key={hourly}
                type="button"
                onClick={() => {
                  setAmountInput(formatInput(amount));
                  navigate(amount, stateSlug, citySlug);
                }}
                className="flex min-h-[52px] items-center justify-center border border-[#2f2a22] bg-[#141414] px-4 py-3 text-center text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]"
              >
                ${hourly}/hr
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
