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
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
          <SalaryCalculatorPanel
            initialAmount={65000}
            title="Salary take-home calculator"
            description="See what your salary looks like per month, per paycheck, and in different states or cities without bouncing between pages."
          />

          <section className="border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.24)]">
            <div className="mb-6">
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Instant answer</p>
              <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">What $65,000 looks like at a glance</h2>
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

              <div className="border border-[#2a2a2a] bg-[#121212] px-5 py-4 text-sm text-[#d2c7b2]">
                <div className="flex items-center justify-between py-2"><span>Annual salary</span><span className="font-medium text-[#f7f3eb]">{formatCurrency(65000, 0)}</span></div>
                <div className="flex items-center justify-between border-t border-[#232323] py-2"><span>Monthly gross pay</span><span className="font-medium text-[#f7f3eb]">{formatCurrency(preview.monthlyGross)}</span></div>
                <div className="flex items-center justify-between border-t border-[#232323] py-2"><span>Daily pay</span><span className="font-medium text-[#f7f3eb]">{formatCurrency(preview.dailyGross)}</span></div>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-6 border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
          <div className="mb-6">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Try the same salary somewhere else</p>
            <h2 className="text-3xl font-semibold tracking-tight text-[#f7f3eb]">Compare take-home pay by state and city</h2>
            <p className="mt-3 text-sm leading-7 text-[#d2c7b2]">Keep the same salary and see how taxes and local costs change the feel of that paycheck from one place to the next.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[#f7f3eb]">State overviews</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
              {featuredStates.map((state) => (
                <Link key={state.slug} href={`/salary/65000/${state.slug}`} className="border border-[#2f2a22] bg-[#141414] px-3 py-3 text-center text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]">
                  {state.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-semibold text-[#f7f3eb]">City overviews</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {featuredCities.map((city) => (
                <Link key={`${city.stateSlug}-${city.slug}`} href={`/salary/65000/${city.stateSlug}/${city.slug}`} className="border border-[#2f2a22] bg-[#141414] px-4 py-4 text-center text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]">
                  {city.name}, {STATE_ABBR[city.stateName] ?? city.stateName}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
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
