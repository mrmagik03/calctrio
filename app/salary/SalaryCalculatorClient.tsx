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

  return (
    <main className="min-h-screen bg-[#111111] text-[#f7f3eb]">
      <SiteHeader />

      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        {/* Strong intro that sells the full trio concept */}
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-[#a89a7a]">Step 1 of CalcTrio</p>
          <h1 className="text-4xl font-bold tracking-tight text-[#f5f1e8] md:text-5xl">
            Salary Calculator: See Your Real Take-Home Pay
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[#d2c7b2]">
            Enter your annual salary once. Instantly see monthly, biweekly, weekly, daily, and hourly pay — plus estimated take-home after federal and state taxes. 
            Then compare the exact same salary in any US city and finally see what that money can actually buy you (cars, vacations, savings growth). 
            One connected flow. No bouncing between different sites.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
          {/* Your original calculator panel — completely untouched */}
          <SalaryCalculatorPanel
            initialAmount={65000}
            title="Salary take-home calculator"
            description="See what your salary looks like per month, per paycheck, and in different states or cities without bouncing between pages."
          />

          {/* Upgraded preview section */}
          <section className="border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.24)]">
            <div className="mb-6">
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Instant answer — $65,000 salary example</p>
              <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">What $65,000 actually looks like</h2>
            </div>

            {/* Your original preview cards — kept 100% the same */}
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

              <div className="border border-[#2a2a2a] bg-[#121212] px-5 py-4 text-sm text-[#d2c7b2]">
                <div className="flex items-center justify-between py-2"><span>Annual salary</span><span className="font-medium text-[#f7f3eb]">{formatCurrency(65000, 0)}</span></div>
                <div className="flex items-center justify-between border-t border-[#232323] py-2"><span>Monthly gross pay</span><span className="font-medium text-[#f7f3eb]">{formatCurrency(preview.monthlyGross)}</span></div>
                <div className="flex items-center justify-between border-t border-[#232323] py-2"><span>Daily pay</span><span className="font-medium text-[#f7f3eb]">{formatCurrency(preview.dailyGross)}</span></div>
              </div>
            </div>

            {/* New helpful context box */}
            <div className="mt-8 border border-[#3a3128] bg-[#151311] p-5 text-sm">
              <p className="text-[#d2c7b2]">
                In 2026, a $65,000 salary puts you right in the middle of the U.S. income range. 
                After taxes you’ll keep roughly <span className="font-semibold text-[#f7f3eb]">{formatCurrency(Math.round(preview.monthlyGross * 0.78))}</span> per month (varies by state). 
                That difference is exactly why the next step (city comparison) matters so much.
              </p>
            </div>
          </section>
        </div>

        {/* Upgraded comparison section */}
        <section className="mt-10 border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
          <div className="mb-6">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Step 2 — Location matters</p>
            <h2 className="text-3xl font-semibold tracking-tight text-[#f7f3eb]">Same salary. Totally different lifestyle.</h2>
            <p className="mt-3 text-sm leading-7 text-[#d2c7b2]">
              The same $65,000 feels very different depending on where you live. Click any state or city below to see the real purchasing power difference.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-[#f7f3eb]">Popular states</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
              {featuredStates.map((state) => (
                <Link
                  key={state.slug}
                  href={`/salary/65000/${state.slug}`}
                  className="border border-[#2f2a22] bg-[#141414] px-3 py-3 text-center text-sm text-[#d2c7b2] transition-colors hover:border-[#b29f7a] hover:text-[#f7f3eb]"
                >
                  {state.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[#f7f3eb]">Popular cities</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {featuredCities.map((city) => (
                <Link
                  key={`${city.stateSlug}-${city.slug}`}
                  href={`/salary/65000/${city.stateSlug}/${city.slug}`}
                  className="border border-[#2f2a22] bg-[#141414] px-4 py-4 text-center text-sm text-[#d2c7b2] transition-colors hover:border-[#b29f7a] hover:text-[#f7f3eb]"
                >
                  {city.name}, {STATE_ABBR[city.stateName] ?? city.stateName}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* New Step 3 section that ties the trio together */}
        <section className="mt-8 border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
          <div className="mb-5">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Step 3 — Lifestyle</p>
            <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">What can you actually buy or save?</h2>
          </div>
          <p className="text-[#d2c7b2] leading-relaxed">
            After you compare cities, head over to the Savings Calculator to see how much extra you could save each month — 
            and how that money compounds into real lifestyle upgrades (cars, vacations, watches, retirement, etc.).
          </p>
          <Link
            href="/savings"
            className="mt-6 inline-flex items-center rounded-2xl border border-[#b29f7a] px-8 py-4 text-lg font-medium text-[#f7f3eb] hover:bg-[#b29f7a] hover:text-[#111111] transition-colors"
          >
            Open Savings Calculator →
          </Link>
        </section>

        {/* Your original related calculators section — untouched */}
        <section className="mt-10 border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
          <div className="mb-5">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Related calculators</p>
            <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">Keep exploring</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/loan" className="border border-[#2f2a22] bg-[#141414] px-5 py-4 transition-colors duration-200 hover:border-[#b29f7a]">
              <p className="text-lg font-semibold text-[#f7f3eb]">Loan Calculator</p>
              <p className="mt-1 text-sm text-[#d2c7b2]">Estimate monthly loan payments and compare total loan costs.</p>
            </Link>
            <Link href="/savings" className="border border-[#2f2a22] bg-[#141414] px-5 py-4 transition-colors duration-200 hover:border-[#b29f7a]">
              <p className="text-lg font-semibold text-[#f7f3eb]">Savings Calculator</p>
              <p className="mt-1 text-sm text-[#d2c7b2]">Estimate how much you need to save each month to hit a goal.</p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}