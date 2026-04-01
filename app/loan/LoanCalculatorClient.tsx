"use client";

import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import { loanCategories } from "./loan-data";

const quickJumpConfig = [
  { slug: "car", amounts: [20000, 30000, 40000] },
  { slug: "boat", amounts: [30000, 50000, 100000] },
  { slug: "rv", amounts: [40000, 75000, 150000] },
] as const;

export default function LoanCalculatorClient() {
  return (
    <main className="min-h-screen bg-[#111111] text-[#f7f3eb]">
      <SiteHeader />

      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <section className="mb-6 border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
          <div className="mb-6 text-center">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">
              The loan leg of CalcTrio
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-[#f7f3eb] sm:text-4xl">
              Pick your vehicle loan type
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-[#d2c7b2]">
              Start in the branch that matches the purchase you are actually pricing.
              Car, boat, and RV pages each use more realistic examples and cleaner full breakdown pages.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {Object.values(loanCategories).map((category) => (
              <Link
                key={category.slug}
                href={`/loan/${category.slug}`}
                className="group relative overflow-hidden border border-[#2f2a22] bg-cover bg-center px-6 py-6 transition-all duration-200 hover:border-[#b29f7a] hover:shadow-[0_0_0_1px_rgba(178,159,122,0.12)]"
                style={{ backgroundImage: category.cardImage }}
              >
                <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#b29f7a]">
                  {category.shortLabel}
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
                  {category.label}
                </h2>
                <p className="mt-3 max-w-[18rem] text-sm leading-6 text-[#e0d7c8]">
                  {category.intro}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-6 border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
          <div className="mb-6">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">
              Quick jump examples
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
              View common loan scenarios with one click
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-[#d2c7b2]">
              These shortcuts drop you straight into the category calculator with a common amount already loaded.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {quickJumpConfig.map((group) => {
              const category = loanCategories[group.slug];
              return (
                <div key={group.slug} className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                  <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[#b29f7a]">
                    {category.shortLabel} quick jumps
                  </p>
                  <div className="grid gap-3">
                    {group.amounts.map((amount) => (
                      <Link
                        key={amount}
                        href={`/loan/${group.slug}?amount=${amount}`}
                        className="border border-[#2f2a22] bg-[#171717] px-4 py-3 text-center text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]"
                      >
                        {category.shortLabel} {amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
          <div className="mb-6">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">
              Common questions
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
              Ground rules for vehicle loans
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
              <h3 className="mb-2 text-lg font-semibold text-[#f7f3eb]">
                Why split by car, boat, and RV?
              </h3>
              <p className="text-sm leading-6 text-[#d2c7b2]">
                Because the realistic term lengths, interest ranges, and common budgets are different. A cleaner branch gives better context than one generic calculator page.
              </p>
            </div>

            <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
              <h3 className="mb-2 text-lg font-semibold text-[#f7f3eb]">
                Are these results full ownership costs?
              </h3>
              <p className="text-sm leading-6 text-[#d2c7b2]">
                No. These pages show principal and interest only. Fuel, insurance, registration, storage, maintenance, campground fees, marina costs, and accessories are separate.
              </p>
            </div>

            <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
              <h3 className="mb-2 text-lg font-semibold text-[#f7f3eb]">
                Why use full breakdown pages?
              </h3>
              <p className="text-sm leading-6 text-[#d2c7b2]">
                They make it easier to compare common loan amounts quickly, and they give you a dedicated page for a realistic scenario instead of re-entering numbers every time.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
