import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import SalaryCalculatorPanel from "@/app/salary/components/SalaryCalculatorPanel";
import SalaryPageScaffold from "@/app/salary/components/SalaryPageScaffold";
import {
  formatCurrency,
  formatWholeCurrency,  
  getPopularCities,
  getPopularStates,
  getSalaryBreakdown,
  readAmountParam,
} from "@/lib/salary";

const SITE_URL = "https://calctrio.com";

type Props = {
  params: Promise<{ amount: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { amount: rawAmount } = await params;
  const amount = readAmountParam(rawAmount);
  const pageUrl = `${SITE_URL}/salary/${amount}`;

  return {
    title: `${formatWholeCurrency(amount)} Salary → ${formatCurrency(amount / 12, 0)}/mo (${formatCurrency(amount / 2080)}/hr) + Take-Home Estimate`,
    description: `${formatWholeCurrency(amount)} per year is about ${formatCurrency(
      amount / 12,
      0
    )} per month, ${formatCurrency(amount / 26)} biweekly, and ${formatCurrency(
      amount / 2080
    )}/hour before taxes. See the monthly, hourly, and quick take-home estimate in one view.`,
    alternates: { canonical: pageUrl },
  };
}

export default async function SalaryAmountPage({ params }: Props) {
  const { amount: rawAmount } = await params;
  const amount = readAmountParam(rawAmount);
  const breakdown = getSalaryBreakdown(amount);
  const pageUrl = `${SITE_URL}/salary/${amount}`;
  const popularStates = getPopularStates().slice(0, 6);
  const popularCities = getPopularCities().slice(0, 6);

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${formatWholeCurrency(amount)} Salary Calculator`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    url: pageUrl,
  };

  return (
    <>
      <JsonLd data={schema} />
      <SalaryPageScaffold
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/salary", label: "Salary" },
          { label: formatWholeCurrency(amount) },
        ]}
      >
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
          <SalaryCalculatorPanel
            initialAmount={amount}
            title={`${formatWholeCurrency(amount)} Salary Breakdown`}
            description="Change the salary, pick a state, or jump into a city page without losing your place."
          />

          <div className="space-y-4">
            <section className="border border-[#2a2a2a] bg-[#171717] px-6 py-6 shadow-[0_12px_32px_rgba(0,0,0,0.24)]">
              <div className="mb-4">
                <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">
                  Immediate answer
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-[#f7f3eb]">
                  What {formatWholeCurrency(amount)} looks like before taxes
                </h2>
              </div>

              <div className="space-y-3">
                <div className="border border-[#2f2a22] bg-[#141414] px-5 py-4">
                  <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">
                    Monthly gross pay
                  </p>
                  <p className="text-4xl font-semibold tracking-tight text-[#f7f3eb]">
                    {formatCurrency(breakdown.monthlyGross)}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="border border-[#2f2a22] bg-[#141414] px-4 py-4">
                    <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">
                      Biweekly
                    </p>
                    <p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
                      {formatCurrency(breakdown.biweeklyGross)}
                    </p>
                  </div>

                  <div className="border border-[#2f2a22] bg-[#141414] px-4 py-4">
                    <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">
                      Weekly
                    </p>
                    <p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
                      {formatCurrency(breakdown.weeklyGross)}
                    </p>
                  </div>

                  <div className="border border-[#2f2a22] bg-[#141414] px-4 py-4">
                    <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">
                      Hourly
                    </p>
                    <p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
                      {formatCurrency(breakdown.hourlyGross)}
                    </p>
                  </div>
                </div>

                <div className="border border-[#3a3128] bg-[#151311] px-4 py-3 text-sm leading-6 text-[#d2c7b2]">
                  <p>
                    Quick gross-pay view first. Then we show a simple take-home
                    estimate underneath.
                  </p>
                </div>
              </div>
            </section>

            <section className="border border-[#2a2a2a] bg-[#171717] px-6 py-5 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
              <div className="mb-3">
                <p className="text-xs uppercase tracking-[0.22em] text-[#8b826f]">
                  Quick deduction estimate
                </p>
              </div>

              <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_240px]">
                <div className="border border-[#2f2a22] bg-[#141414] px-4 py-2.5 text-sm text-[#d2c7b2]">
                  <div className="flex items-center justify-between py-1">
                    <span>Federal tax</span>
                    <span className="font-medium text-[#f7f3eb]">
                      {formatCurrency(breakdown.federalTax)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#232323] py-1">
                    <span>State tax</span>
                    <span className="font-medium text-[#f7f3eb]">
                      {formatCurrency(breakdown.stateTax)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#232323] py-1">
                    <span>Local tax</span>
                    <span className="font-medium text-[#f7f3eb]">
                      {formatCurrency(breakdown.localTax)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#232323] py-1">
                    <span>Social Security</span>
                    <span className="font-medium text-[#f7f3eb]">
                      {formatCurrency(breakdown.socialSecurity)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#232323] py-1">
                    <span>Medicare</span>
                    <span className="font-medium text-[#f7f3eb]">
                      {formatCurrency(breakdown.medicare)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#232323] py-1">
                    <span className="font-semibold">Estimated take-home</span>
                    <span className="font-semibold text-[#f7f3eb]">
                      {formatCurrency(breakdown.netAnnual, 0)}
                    </span>
                  </div>
                </div>

                <div className="border border-[#3a3128] bg-[#151311] px-4 py-2.5 text-sm leading-6 text-[#d2c7b2]">
                  <p>
                    Quick rule of thumb: on a {formatWholeCurrency(amount)} salary,
                    take-home usually lands somewhere in the mid{" "}
                    {formatWholeCurrency(breakdown.netAnnual).slice(0, -4)} range
                    after taxes.
                  </p>
                  <p className="mt-2">
                    This is just a fast estimate to make the number feel real.
                  </p>
                  <p className="mt-2">
                    Pick a state or city to tighten it up.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
            <div className="mb-5">
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">
                Explore states
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
                See {formatWholeCurrency(amount)} in a different state
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {popularStates.map((state) => (
                <Link
                  key={state.slug}
                  href={`/salary/${amount}/${state.slug}`}
                  className="border border-[#2f2a22] bg-[#141414] px-4 py-3 text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]"
                >
                  {state.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
            <div className="mb-5">
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">
                Explore cities
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
                Jump into city-specific salary pages
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {popularCities.map((city) => (
                <Link
                  key={`${city.stateSlug}-${city.slug}`}
                  href={`/salary/${amount}/${city.stateSlug}/${city.slug}`}
                  className="border border-[#2f2a22] bg-[#141414] px-4 py-3 text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]"
                >
                  {city.name}, {city.stateName}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </SalaryPageScaffold>
    </>
  );
}