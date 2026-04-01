import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/app/components/JsonLd";
import CopyResultLinkButton from "@/app/salary/components/CopyResultLinkButton";
import SalaryCalculatorPanel from "@/app/salary/components/SalaryCalculatorPanel";
import SalaryMethodology from "@/app/salary/components/SalaryMethodology";
import SalaryPageScaffold from "@/app/salary/components/SalaryPageScaffold";
import { getCityByStateAndSlug } from "@/lib/cities";
import { getStateBySlug } from "@/lib/states";
import { formatCurrency, formatWholeCurrency, getCostProfile, getNearbyCities, getNearbySalarySteps, getSalaryBreakdown, readAmountParam } from "@/lib/salary";

const SITE_URL = "https://calctrio.com";

type Props = { params: Promise<{ amount: string; state: string; city: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { amount: rawAmount, state: rawState, city: rawCity } = await params;
  const amount = readAmountParam(rawAmount);
  const state = getStateBySlug(rawState);
  const city = state ? getCityByStateAndSlug(state.slug, rawCity) : null;
  if (!state || !city) return {};
  return {
    title: `${formatWholeCurrency(amount)} Salary in ${city.name}, ${state.name}`,
    description: `Estimate take-home pay on ${formatWholeCurrency(amount)} in ${city.name}, ${state.name}, with methodology, cost context, and nearby city comparisons.`,
    alternates: { canonical: `${SITE_URL}/salary/${amount}/${state.slug}/${city.slug}` },
  };
}

export default async function SalaryCityAmountPage({ params }: Props) {
  const { amount: rawAmount, state: rawState, city: rawCity } = await params;
  const amount = readAmountParam(rawAmount);
  const state = getStateBySlug(rawState);
  const city = state ? getCityByStateAndSlug(state.slug, rawCity) : null;
  if (!state || !city) notFound();
  const breakdown = getSalaryBreakdown(amount, state, city);
  const nearbyCities = getNearbyCities(city);
  const nearbySalaries = getNearbySalarySteps(amount);
  const costProfile = getCostProfile(state, city);
  const pageUrl = `${SITE_URL}/salary/${amount}/${state.slug}/${city.slug}`;

  const summaryText = city.localTaxRate
    ? `${city.name} adds an estimated local tax on top of the ${state.name} state layer, which is why the take-home number here runs lower than the broader state view.`
    : city.note ?? `${city.name} mostly follows the broader ${state.name} income-tax picture, so the main difference for many users is cost pressure rather than extra local tax.`;

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: `${city.name} Salary After Tax Calculator`, applicationCategory: "FinanceApplication", operatingSystem: "Any", url: pageUrl }} />
      <SalaryPageScaffold crumbs={[{ href: "/", label: "Home" }, { href: "/salary", label: "Salary" }, { href: `/salary/location/${state.slug}?amount=${amount}`, label: state.name }, { href: `/salary/location/${state.slug}/${city.slug}?amount=${amount}`, label: city.name }, { label: formatWholeCurrency(amount) }]}>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
          <SalaryCalculatorPanel initialAmount={amount} initialStateSlug={state.slug} initialCitySlug={city.slug} title={`${formatWholeCurrency(amount)} in ${city.name}`} description="This page answers the exact salary query first, then gives you the calculator, nearby comparisons, and a path back to the main salary hub." />

          <section className="border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.24)]">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Immediate answer</p>
                <h2 className="text-3xl font-semibold tracking-tight text-[#f7f3eb]">Estimated take-home for {formatWholeCurrency(amount)} in {city.name}</h2>
              </div>
              <CopyResultLinkButton url={pageUrl} />
            </div>

            <div className="space-y-4">
              <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5"><p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Net annual pay</p><p className="text-4xl font-semibold tracking-tight text-[#f7f3eb]">{formatCurrency(breakdown.netAnnual, 0)}</p></div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5"><p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Monthly take-home</p><p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">{formatCurrency(breakdown.monthlyNet)}</p></div>
                <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5"><p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Biweekly take-home</p><p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">{formatCurrency(breakdown.biweeklyNet)}</p></div>
                <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5"><p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Hourly take-home</p><p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">{formatCurrency(breakdown.hourlyNet)}</p></div>
              </div>
              <div className="border border-[#3a3128] bg-[#151311] px-5 py-4 text-sm leading-7 text-[#d2c7b2]">
                <p>{summaryText}</p>
                <p className="mt-3">{city.name} currently fits our <span className="font-semibold text-[#f7f3eb]">{costProfile.label.toLowerCase()}</span> bucket, with a planning rent band around <span className="font-semibold text-[#f7f3eb]">{costProfile.rentBand}</span>. That is what gives this page more real-world value than a plain salary conversion page.</p>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
            <div className="mb-5"><p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Nearby city comparisons</p><h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">Compare nearby cities</h2></div>
            <div className="grid gap-3 sm:grid-cols-2">
              {nearbyCities.map((entry) => (
                <Link key={`${entry.stateSlug}-${entry.slug}`} href={`/salary/${amount}/${entry.stateSlug}/${entry.slug}`} className="border border-[#2f2a22] bg-[#141414] px-4 py-4 text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]">
                  <div className="text-lg font-semibold text-[#f7f3eb]">{entry.name}, {entry.stateName}</div>
                  <div className="mt-1 text-sm">See the same salary in {entry.name}.</div>
                </Link>
              ))}
            </div>
          </div>
          <div className="border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
            <div className="mb-5"><p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Try another salary</p><h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">Nearby salary comparisons</h2></div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {nearbySalaries.map((salary) => (
                <Link key={salary} href={`/salary/${salary}/${state.slug}/${city.slug}`} className="border border-[#2f2a22] bg-[#141414] px-4 py-3 text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]">{formatWholeCurrency(salary)}</Link>
              ))}
            </div>
            <div className="mt-4 grid gap-3">
              <Link href={`/salary/location/${state.slug}/${city.slug}?amount=${amount}`} className="border border-[#2f2a22] bg-[#141414] px-4 py-4 text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]">View the broader {city.name} city overview</Link>
              <Link href={`/salary/${amount}/${state.slug}`} className="border border-[#2f2a22] bg-[#141414] px-4 py-4 text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]">Go back to the {state.name} state overview for this salary</Link>
            </div>
          </div>
        </section>

        <SalaryMethodology breakdown={breakdown} stateLabel={state.name} cityLabel={city.name} />
      </SalaryPageScaffold>
    </>
  );
}
