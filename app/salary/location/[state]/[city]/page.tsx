import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/app/components/JsonLd";
import SalaryCalculatorPanel from "@/app/salary/components/SalaryCalculatorPanel";
import SalaryPageScaffold from "@/app/salary/components/SalaryPageScaffold";
import { getCityByStateAndSlug } from "@/lib/cities";
import { getStateBySlug } from "@/lib/states";
import { formatCurrency, formatWholeCurrency, getCostProfile, getNearbyCities, getSalaryBreakdown, readAmountParam } from "@/lib/salary";

const SITE_URL = "https://calctrio.com";

type Props = {
  params: Promise<{ state: string; city: string }>;
  searchParams: Promise<{ amount?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: rawState, city: rawCity } = await params;
  const state = getStateBySlug(rawState);
  const city = state ? getCityByStateAndSlug(state.slug, rawCity) : null;
  if (!state || !city) return {};
  return {
    title: `${city.name} Salary Guide → Cost of Living & Take-Home Pay`,
    description: `Explore salary take-home estimates, local cost pressure, and nearby city comparisons for ${city.name}, ${state.name}.`,
    alternates: { canonical: `${SITE_URL}/salary/location/${state.slug}/${city.slug}` },
  };
}

export default async function CityOverviewPage({ params, searchParams }: Props) {
  const { state: rawState, city: rawCity } = await params;
  const state = getStateBySlug(rawState);
  const city = state ? getCityByStateAndSlug(state.slug, rawCity) : null;
  if (!state || !city) notFound();
  const { amount: rawAmount } = await searchParams;
  const amount = readAmountParam(rawAmount);
  const breakdown = getSalaryBreakdown(amount, state, city);
  const costProfile = getCostProfile(state, city);
  const nearbyCities = getNearbyCities(city);

  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: `${city.name} Salary Calculator Overview`, applicationCategory: 'FinanceApplication', operatingSystem: 'Any', url: `${SITE_URL}/salary/location/${state.slug}/${city.slug}` }} />
      <SalaryPageScaffold crumbs={[{ href: '/', label: 'Home' }, { href: '/salary', label: 'Salary' }, { href: `/salary/location/${state.slug}?amount=${amount}`, label: state.name }, { label: city.name }]}> 
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
          <SalaryCalculatorPanel initialAmount={amount} initialStateSlug={state.slug} initialCitySlug={city.slug} title={`${city.name} salary overview`} description="Keep your salary active while you compare nearby cities, step into exact result pages, or move back up to the state view." />

          <section className="border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.24)]">
            <div className="mb-5">
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">City overview</p>
              <h1 className="text-3xl font-semibold tracking-tight text-[#f7f3eb]">How salary tends to feel in {city.name}</h1>
            </div>

            <div className="space-y-4">
              <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Estimated net annual pay on {formatWholeCurrency(amount)}</p>
                <p className="text-4xl font-semibold tracking-tight text-[#f7f3eb]">{formatCurrency(breakdown.netAnnual, 0)}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5"><p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Monthly take-home</p><p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">{formatCurrency(breakdown.monthlyNet)}</p></div>
                <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5"><p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Cost profile</p><p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">{costProfile.label}</p></div>
                <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5"><p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Planning rent band</p><p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">{costProfile.rentBand}</p></div>
              </div>
              <div className="border border-[#3a3128] bg-[#151311] px-5 py-4 text-sm leading-7 text-[#d2c7b2]">
                <p>{costProfile.summary}</p>
                <p className="mt-3">A reasonable starting point is to keep housing near <span className="font-semibold text-[#f7f3eb]">{Math.round(costProfile.housingShare * 100)}%</span> of take-home pay. That is usually the quickest way to judge whether a salary feels stretched or comfortable here.</p>
                {city.note ? <p className="mt-3">{city.note}</p> : null}
              </div>
            </div>
          </section>
        </div>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
            <div className="mb-5"><p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Nearby city comparisons</p><h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">Places you might compare next</h2></div>
            <div className="grid gap-3 sm:grid-cols-2">
              {nearbyCities.map((entry) => (
                <Link key={`${entry.stateSlug}-${entry.slug}`} href={`/salary/${amount}/${entry.stateSlug}/${entry.slug}`} className="border border-[#2f2a22] bg-[#141414] px-4 py-4 text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]">
                  <div className="text-lg font-semibold text-[#f7f3eb]">{entry.name}, {entry.stateName}</div>
                </Link>
              ))}
            </div>
          </div>

          <div className="border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
            <div className="mb-5"><p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Next step</p><h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">Turn this city overview into an exact result page</h2></div>
            <div className="grid gap-3">
              <Link href={`/salary/${amount}/${state.slug}/${city.slug}`} className="border border-[#2f2a22] bg-[#141414] px-4 py-4 text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]">See exact take-home details for {formatWholeCurrency(amount)} in {city.name}</Link>
              <Link href={`/salary/location/${state.slug}?amount=${amount}`} className="border border-[#2f2a22] bg-[#141414] px-4 py-4 text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]">Go back to the {state.name} salary overview</Link>
            </div>
          </div>
        </section>
      </SalaryPageScaffold>
    </>
  );
}
