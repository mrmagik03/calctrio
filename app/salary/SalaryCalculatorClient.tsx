"use client";

import Link from "next/link";
import SiteHeader from "@/app/components/SiteHeader";
import SalaryCalculatorPanel from "@/app/salary/components/SalaryCalculatorPanel";
import { formatCurrency, getPopularCities, getPopularStates, getSalaryBreakdown } from "@/lib/salary";

const featuredStates = getPopularStates();
const featuredCities = getPopularCities();

const STATE_ABBR: Record<string, string> = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA", Colorado: "CO", Connecticut: "CT", Delaware: "DE", Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID", Illinois: "IL", Indiana: "IN", Iowa: "IA", Kansas: "KS", Kentucky: "KY", Louisiana: "LA", Maine: "ME", Maryland: "MD", Massachusetts: "MA", Michigan: "MI", Minnesota: "MN", Mississippi: "MS", Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV", "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK", Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT", Virginia: "VA", Washington: "WA", "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY", "District of Columbia": "DC",
};

export default function SalaryCalculatorClient() {
  const preview = getSalaryBreakdown(65000);

  const shortStates = featuredStates
    .filter(state => !["North Carolina", "Pennsylvania"].includes(state.name))
    .slice(0, 8);

  const topCities = featuredCities.slice(0, 8);

  return (
    <main className="min-h-screen bg-[#111111] text-[#f7f3eb]">
      <SiteHeader />

      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        {/* Step 1 blurb */}
        <div className="mb-10 max-w-2xl">
          <p className="mb-2 text-sm uppercase tracking-[0.35em] text-[#a89a7a]">Step 1 of CalcTrio</p>
          <p className="text-lg text-[#d2c7b2]">
            Enter your salary once.<br />
            Get monthly, biweekly, hourly pay + estimated take-home after taxes.<br />
            Then compare any city and see what that money can actually buy you.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
          <SalaryCalculatorPanel
            initialAmount={65000}
            title="Salary take-home calculator"
            description="See what your salary looks like per month, per paycheck, and in different states or cities without bouncing between pages."
          />

          <section className="border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.24)]">
            <div className="mb-6">
              <p className="mb-1 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Instant example</p>
              <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">What $65,000 looks like</h2>
            </div>

            <div className="space-y-4">
              <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Monthly gross pay</p>
                <p className="text-4xl font-semibold tracking-tight text-[#f7f3eb]">{formatCurrency(preview.monthlyGross)}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                  <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Biweekly gross pay</p>
                  <p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">{formatCurrency(preview.biweeklyGross)}</p>
                </div>
                <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                  <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Weekly gross pay</p>
                  <p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">{formatCurrency(preview.weeklyGross)}</p>
                </div>
              </div>

              <div className="border border-[#3a3128] bg-[#151311] px-5 py-4">
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#b29f7a]">Fast read</p>
                <p className="text-sm leading-6 text-[#d2c7b2]">
                  A {formatCurrency(65000, 0)} salary works out to about <span className="font-semibold text-[#f7f3eb]">{formatCurrency(preview.hourlyGross)}/hour</span> before taxes, with roughly <span className="font-semibold text-[#f7f3eb]">{formatCurrency(preview.monthlyGross)}</span> hitting each month before deductions.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Step 2 — button-style links */}
        <section className="mt-12 border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
          <div className="mb-6">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Step 2 — Location matters</p>
            <h2 className="text-3xl font-semibold tracking-tight text-[#f7f3eb]">Same salary. Totally different lifestyle.</h2>
            <p className="mt-3 text-base text-[#d2c7b2]">
              Click any state or city below to see the real purchasing power difference.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="mb-4 text-2xl font-semibold text-[#f7f3eb]">Popular states</h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {shortStates.map((state) => (
                <Link
                  key={state.slug}
                  href={`/salary/65000/${state.slug}`}
                  className="border border-[#b29f7a] bg-[#141414] px-8 py-6 text-center text-lg font-medium text-[#f7f3eb] rounded-2xl transition-all hover:bg-[#b29f7a] hover:text-[#111111]"
                >
                  {state.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-2xl font-semibold text-[#f7f3eb]">Popular cities</h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {topCities.map((city) => (
                <Link
                  key={`${city.stateSlug}-${city.slug}`}
                  href={`/salary/65000/${city.stateSlug}/${city.slug}`}
                  className="border border-[#b29f7a] bg-[#141414] px-8 py-6 text-center text-lg font-medium text-[#f7f3eb] rounded-2xl transition-all hover:bg-[#b29f7a] hover:text-[#111111]"
                >
                  {city.name}, {STATE_ABBR[city.stateName] ?? city.stateName}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Step 3 — already perfect */}
        <section className="mt-8 border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
          <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Step 3 — Lifestyle</p>
          <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">What can you actually buy or save?</h2>
          <p className="mt-4 text-[#d2c7b2]">
            Head to the Savings Calculator to see how much extra you could save — and how fast that turns into real upgrades.
          </p>
          <Link
            href="/savings"
            className="mt-6 inline-flex items-center rounded-2xl border border-[#b29f7a] px-8 py-4 text-lg font-medium text-[#f7f3eb] hover:bg-[#b29f7a] hover:text-[#111111]"
          >
            Open Savings Calculator →
          </Link>
        </section>

        {/* Related calculators — now also real buttons */}
        <section className="mt-12 border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
          <div className="mb-5">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Related calculators</p>
            <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">Keep exploring</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/loan" className="group border border-[#b29f7a] bg-[#141414] px-8 py-6 rounded-2xl transition-all hover:bg-[#b29f7a] hover:text-[#111111] flex flex-col">
              <p className="text-xl font-semibold text-[#f7f3eb] group-hover:text-[#111111]">Loan Calculator</p>
              <p className="mt-2 text-[#d2c7b2] group-hover:text-[#111111]">Estimate monthly loan payments and compare total loan costs.</p>
            </Link>
            <Link href="/savings" className="group border border-[#b29f7a] bg-[#141414] px-8 py-6 rounded-2xl transition-all hover:bg-[#b29f7a] hover:text-[#111111] flex flex-col">
              <p className="text-xl font-semibold text-[#f7f3eb] group-hover:text-[#111111]">Savings Calculator</p>
              <p className="mt-2 text-[#d2c7b2] group-hover:text-[#111111]">Estimate how much you need to save each month to hit a goal.</p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}