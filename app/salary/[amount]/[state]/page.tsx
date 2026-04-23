import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/app/components/JsonLd";
import SalaryCalculatorPanel from "@/app/salary/components/SalaryCalculatorPanel";
import SalaryPageScaffold from "@/app/salary/components/SalaryPageScaffold";
import { getCitiesForState } from "@/lib/cities";
import { getStateBySlug } from "@/lib/states";
import { formatCurrency, formatWholeCurrency, getCostProfile, getNearbySalarySteps, getSalaryBreakdown, getStateSummary, readAmountParam } from "@/lib/salary";

const SITE_URL = "https://calctrio.com";

type Props = { params: Promise<{ amount: string; state: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { amount: rawAmount, state: rawState } = await params;
  const amount = readAmountParam(rawAmount);
  const state = getStateBySlug(rawState);
  if (!state) return {};
  const breakdown = getSalaryBreakdown(amount, state);
  return {
    title: `${formatWholeCurrency(amount)} Salary in ${state.name} – ${formatCurrency(breakdown.monthlyNet, 0)}/mo After Tax (2026)`,
    description: `See how far ${formatWholeCurrency(amount)} goes in ${state.name}, including estimated monthly take-home pay, tax hit, and quick links into major cities.`,
    alternates: { canonical: `${SITE_URL}/salary/${amount}/${state.slug}` },
  };
}

export default async function SalaryStateAmountPage({ params }: Props) {
  const { amount: rawAmount, state: rawState } = await params;
  const amount = readAmountParam(rawAmount);
  const state = getStateBySlug(rawState);
  if (!state) notFound();
  const breakdown = getSalaryBreakdown(amount, state);
  const costProfile = getCostProfile(state);
  const cities = getCitiesForState(state.slug).slice(0, 8);
  const nearbySalaries = getNearbySalarySteps(amount);

  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: `${state.name} Salary After Tax Calculator`, applicationCategory: 'FinanceApplication', operatingSystem: 'Any', url: `${SITE_URL}/salary/${amount}/${state.slug}` }} />
      <SalaryPageScaffold crumbs={[{ href: '/', label: 'Home' }, { href: '/salary', label: 'Salary' }, { href: `/salary/${amount}/${state.slug}`, label: state.name }, { label: formatWholeCurrency(amount) }]}> 
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
          <SalaryCalculatorPanel initialAmount={amount} initialStateSlug={state.slug} title={`${formatWholeCurrency(amount)} in ${state.name}`} description="Get the broad statewide picture first, then drill into specific cities when rent and local cost pressure matter more." />

          <section className="border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.24)]">
            <div className="mb-5">
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Fast answer</p>
              <h1 className="text-3xl font-semibold tracking-tight text-[#f7f3eb]">How {formatWholeCurrency(amount)} lands in {state.name}</h1>
            </div>

            <div className="space-y-4">
              <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5"><p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Estimated take-home per year</p><p className="text-4xl font-semibold tracking-tight text-[#f7f3eb]">{formatCurrency(breakdown.netAnnual, 0)}</p></div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5"><p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Monthly take-home</p><p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">{formatCurrency(breakdown.monthlyNet)}</p></div>
                <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5"><p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Biweekly take-home</p><p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">{formatCurrency(breakdown.biweeklyNet)}</p></div>
                <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5"><p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Hourly take-home</p><p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">{formatCurrency(breakdown.hourlyNet)}</p></div>
              </div>
              <div className="border border-[#3a3128] bg-[#151311] px-5 py-4 text-sm leading-7 text-[#d2c7b2]">
                <p>{getStateSummary(state)}</p>
                <p className="mt-3">Use this page as the quick statewide view. Then jump into a city page when you want a more realistic answer tied to housing, local taxes, and metro costs.</p>
                <p className="mt-3">The broad cost profile for {state.name} is <span className="font-semibold text-[#f7f3eb]">{costProfile.label.toLowerCase()}</span>, with many renters targeting a band near <span className="font-semibold text-[#f7f3eb]">{costProfile.rentBand}</span>.</p>
              </div>

              <section className="border border-[#2a2a2a] bg-[#171717] px-6 py-5 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
                <div className="mb-3"><p className="text-xs uppercase tracking-[0.22em] text-[#8b826f]">Quick deduction estimate</p></div>
                <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_240px]">
                  <div className="border border-[#2f2a22] bg-[#141414] px-4 py-2.5 text-sm text-[#d2c7b2]">
                    <div className="flex items-center justify-between py-1"><span>Federal tax</span><span className="font-medium text-[#f7f3eb]">{formatCurrency(breakdown.federalTax)}</span></div>
                    <div className="flex items-center justify-between border-t border-[#232323] py-1"><span>State tax</span><span className="font-medium text-[#f7f3eb]">{formatCurrency(breakdown.stateTax)}</span></div>
                    <div className="flex items-center justify-between border-t border-[#232323] py-1"><span>Local tax</span><span className="font-medium text-[#f7f3eb]">{formatCurrency(breakdown.localTax)}</span></div>
                    <div className="flex items-center justify-between border-t border-[#232323] py-1"><span>Social Security</span><span className="font-medium text-[#f7f3eb]">{formatCurrency(breakdown.socialSecurity)}</span></div>
                    <div className="flex items-center justify-between border-t border-[#232323] py-1"><span>Medicare</span><span className="font-medium text-[#f7f3eb]">{formatCurrency(breakdown.medicare)}</span></div>
                    <div className="flex items-center justify-between border-t border-[#232323] py-1"><span className="font-semibold">Estimated take-home</span><span className="font-semibold text-[#f7f3eb]">{formatCurrency(breakdown.netAnnual, 0)}</span></div>
                  </div>
                  <div className="border border-[#3a3128] bg-[#151311] px-4 py-2.5 text-sm leading-6 text-[#d2c7b2]">
                    <p>Fast read: {formatWholeCurrency(amount)} in {state.name} lands around {formatCurrency(breakdown.monthlyNet, 0)} a month after taxes.</p>
                    <p className="mt-2">That gives you the paycheck answer first instead of making you hunt for it.</p>
                  </div>
                </div>
              </section>
            </div>
          </section>
        </div>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
            <div className="mb-5"><p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Next step</p><h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">See how this salary feels in major cities</h2></div>
            <div className="grid gap-3 sm:grid-cols-2">
              {cities.map((city) => (
                <Link key={city.slug} href={`/salary/${amount}/${state.slug}/${city.slug}`} className="border border-[#2f2a22] bg-[#141414] px-4 py-4 text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]">{city.name}, {state.name}</Link>
              ))}
            </div>
          </div>
          <div className="border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
            <div className="mb-5"><p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Try a nearby salary</p><h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">Try a different salary in {state.name}</h2></div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {nearbySalaries.map((salary) => (
                <Link key={salary} href={`/salary/${salary}/${state.slug}`} className="border border-[#2f2a22] bg-[#141414] px-4 py-3 text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]">{formatWholeCurrency(salary)}</Link>
              ))}
            </div>
          </div>
        </section>
      </SalaryPageScaffold>
    </>
  );
}
