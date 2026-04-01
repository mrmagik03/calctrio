import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/app/components/JsonLd";
import CopyResultLinkButton from "@/app/salary/components/CopyResultLinkButton";
import SalaryCalculatorPanel from "@/app/salary/components/SalaryCalculatorPanel";
import SalaryPageScaffold from "@/app/salary/components/SalaryPageScaffold";
import { getCitiesForState } from "@/lib/cities";
import { getStateBySlug } from "@/lib/states";
import { buildAmountQuery, formatCurrency, formatWholeCurrency, getCostProfile, getSalaryBreakdown, getStateHeadline, getStateSummary, readAmountParam } from "@/lib/salary";

const SITE_URL = "https://calctrio.com";

type Props = {
  params: Promise<{ state: string }>;
  searchParams: Promise<{ amount?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: rawState } = await params;
  const state = getStateBySlug(rawState);
  if (!state) return {};
  return {
    title: `${state.name} Salary Calculator and Take-Home Overview`,
    description: `Explore salary take-home estimates, state tax impact, and major city comparisons across ${state.name}.`,
    alternates: { canonical: `${SITE_URL}/salary/location/${state.slug}` },
  };
}

export default async function SalaryStateOverviewPage({ params, searchParams }: Props) {
  const { state: rawState } = await params;
  const state = getStateBySlug(rawState);
  if (!state) notFound();
  const { amount: rawAmount } = await searchParams;
  const amount = readAmountParam(rawAmount);
  const cities = getCitiesForState(state.slug).slice(0, 8);
  const breakdown = getSalaryBreakdown(amount, state);
  const costProfile = getCostProfile(state);
  const pageUrl = `${SITE_URL}/salary/location/${state.slug}${buildAmountQuery(amount)}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${state.name} Salary Calculator Overview`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    url: `${SITE_URL}/salary/location/${state.slug}`,
  };

  return (
    <>
      <JsonLd data={schema} />
      <SalaryPageScaffold crumbs={[{ href: "/", label: "Home" }, { href: "/salary", label: "Salary" }, { label: state.name }]}>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
          <SalaryCalculatorPanel initialAmount={amount} initialStateSlug={state.slug} title={`${state.name} salary overview`} description="Keep your salary active while you move between the state overview, city pages, and exact salary result pages." />

          <section className="border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.24)]">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">State overview</p>
                <h2 className="text-3xl font-semibold tracking-tight text-[#f7f3eb]">{getStateHeadline(state)}</h2>
              </div>
              <CopyResultLinkButton url={pageUrl} />
            </div>

            <div className="space-y-4">
              <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Estimated net annual pay on {formatWholeCurrency(amount)}</p>
                <p className="text-4xl font-semibold tracking-tight text-[#f7f3eb]">{formatCurrency(breakdown.netAnnual, 0)}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5"><p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Monthly take-home</p><p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">{formatCurrency(breakdown.monthlyNet)}</p></div>
                <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5"><p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Effective tax rate</p><p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">{(breakdown.effectiveTaxRate * 100).toFixed(1)}%</p></div>
                <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5"><p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Median benchmark</p><p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">{amount >= 63128 ? "Above" : "Below"} U.S. median</p></div>
              </div>

              <div className="border border-[#3a3128] bg-[#151311] px-5 py-4 text-sm leading-7 text-[#d2c7b2]">
                <p>{getStateSummary(state)}</p>
                <p className="mt-3">{costProfile.summary} In this state, housing often lands around <span className="font-semibold text-[#f7f3eb]">{Math.round(costProfile.housingShare * 100)}%</span> of take-home pay for many renters, with a planning rent band around <span className="font-semibold text-[#f7f3eb]">{costProfile.rentBand}</span>.</p>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-6 border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
          <div className="mb-5"><p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Major city pages</p><h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">Explore cities in {state.name}</h2></div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {cities.map((city) => (
              <Link key={city.slug} href={`/salary/location/${state.slug}/${city.slug}?amount=${amount}`} className="border border-[#2f2a22] bg-[#141414] px-4 py-4 text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]">
                <div className="text-lg font-semibold text-[#f7f3eb]">{city.name}</div>
                <div className="mt-1 text-sm">See cost pressure, local tax notes, and salary comparisons in {city.name}.</div>
              </Link>
            ))}
          </div>
        </section>
      </SalaryPageScaffold>
    </>
  );
}
