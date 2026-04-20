import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import SalaryLocationJump from "@/components/SalaryLocationJump";
import { getCityByStateAndSlug, getCitiesForState } from "@/lib/cities";
import { annualSalaryToHourly, annualSalaryToMonthly, clampSalaryForSeo, formatCurrency, toNumber } from "@/lib/pay";
import { getStateBySlug, STATES } from "@/lib/states";

const SITE_URL = "https://calctrio.com";

type Props = {
  params: Promise<{
    amount: string;
    state: string;
    city: string;
  }>;
};

function federalTaxEstimate(amount: number) {
  return amount * 0.18;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { amount: rawAmount, state: rawState, city: rawCity } = await params;
  const amount = clampSalaryForSeo(toNumber(rawAmount));
  const state = getStateBySlug(rawState);
  if (!state) return {};
  const city = getCityByStateAndSlug(state.slug, rawCity);
  if (!city) return {};

  const federalTax = federalTaxEstimate(amount);
  const stateTax = amount * state.taxRate;
  const localTax = amount * (city.localTaxRate ?? 0);
  const netAnnual = amount - federalTax - stateTax - localTax;

  return {
    title: `${formatCurrency(amount, 0)} After Tax in ${city.name}, ${(state.aliases?.[0] ?? state.name).toUpperCase()} → ${formatCurrency(annualSalaryToMonthly(netAnnual), 0)}/mo`,
    description: `See estimated take-home pay on ${formatCurrency(amount, 0)} in ${city.name}, ${state.name}: about ${formatCurrency(annualSalaryToMonthly(netAnnual), 0)} per month after federal, state, and local taxes.`,
    alternates: {
      canonical: `${SITE_URL}/salary/${amount}/after-tax/${state.slug}/${city.slug}`,
    },
  };
}

export default async function SalaryAfterTaxCityPage({ params }: Props) {
  const { amount: rawAmount, state: rawState, city: rawCity } = await params;
  const amount = clampSalaryForSeo(toNumber(rawAmount));
  const state = getStateBySlug(rawState);
  if (!state) notFound();
  const city = getCityByStateAndSlug(state.slug, rawCity);
  if (!city) notFound();

  const federalTax = federalTaxEstimate(amount);
  const stateTax = amount * state.taxRate;
  const localTax = amount * (city.localTaxRate ?? 0);
  const netAnnual = amount - federalTax - stateTax - localTax;
  const monthly = annualSalaryToMonthly(netAnnual);
  const biweekly = netAnnual / 26;
  const hourly = annualSalaryToHourly(netAnnual);
  const cities = getCitiesForState(state.slug);
  const nearbyCities = city.nearby
    ?.map((slug) => getCityByStateAndSlug(state.slug, slug))
    .filter(Boolean)
    .slice(0, 6) ?? [];
  const moreCities = cities.filter((entry) => entry.slug !== city.slug).slice(0, 10);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Salary", item: `${SITE_URL}/salary` },
      { "@type": "ListItem", position: 3, name: "After Tax", item: `${SITE_URL}/salary/${amount}/after-tax` },
      { "@type": "ListItem", position: 4, name: state.name, item: `${SITE_URL}/salary/${amount}/after-tax/${state.slug}` },
      { "@type": "ListItem", position: 5, name: city.name, item: `${SITE_URL}/salary/${amount}/after-tax/${state.slug}/${city.slug}` },
    ],
  };

  const summaryText = city.localTaxRate
    ? `${city.name} adds a local tax layer on top of the ${state.name} estimate, which is why take-home pay here can land lower than the statewide average.`
    : city.note ?? `${city.name} usually follows the broader ${state.name} income-tax picture, though local payroll deductions and benefits can still move your actual paycheck.`;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
        <nav className="mb-8 text-sm text-zinc-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/salary/${amount}/after-tax`} className="hover:text-white">After Tax</Link>
          <span className="mx-2">/</span>
          <Link href={`/salary/${amount}/after-tax/${state.slug}`} className="hover:text-white">{state.name}</Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-200">{city.name}</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
          <section className="border border-white/8 bg-white/[0.03] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <h1 className="text-center text-4xl font-semibold tracking-tight text-white">
              {formatCurrency(amount, 0)} After Tax
            </h1>
            <p className="mx-auto mt-4 max-w-md text-center text-xl leading-9 text-zinc-200">
              Estimate take-home pay in <span className="font-semibold text-white">{city.name}, {state.name}</span>.
            </p>

            <div className="mt-8">
              <SalaryLocationJump amount={amount} states={STATES} selectedStateSlug={state.slug} cities={cities} selectedCitySlug={city.slug} />
            </div>

            <div className="mt-8">
              <p className="mb-3 text-sm uppercase tracking-[0.18em] text-amber-200/70">Annual salary</p>
              <div className="flex items-center border border-white/8 bg-white/[0.03] px-4 py-4 text-2xl text-white">
                <span className="mr-4 text-zinc-400">$</span>
                <span>{amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-4 text-sm uppercase tracking-[0.18em] text-amber-200/70">Nearby city comparisons</p>
              <div className="grid grid-cols-2 gap-3">
                {nearbyCities.map((nearby) => (
                  <Link key={nearby!.slug} href={`/salary/${amount}/after-tax/${state.slug}/${nearby!.slug}`} className="flex min-h-[52px] items-center justify-center border border-white/8 px-4 py-3 text-center text-sm text-white transition hover:bg-white/[0.03]">
                    {nearby!.name}
                  </Link>
                ))}
              </div>
            </div>

            <p className="mt-6 text-sm leading-7 text-zinc-400">{summaryText}</p>
          </section>

          <section className="border border-white/8 bg-white/[0.03] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <p className="text-sm uppercase tracking-[0.18em] text-amber-200/70">City salary breakdown</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">{city.name} take-home picture</h2>

            <div className="mt-8 border border-white/8 bg-white/[0.02] p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-amber-200/70">Net annual pay</p>
              <p className="mt-2 text-4xl font-semibold text-white">{formatCurrency(netAnnual, 0)}</p>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="border border-white/8 bg-white/[0.02] p-5">
                <p className="text-sm uppercase tracking-[0.18em] text-amber-200/70">Monthly take-home</p>
                <p className="mt-2 text-2xl font-semibold text-white">{formatCurrency(monthly)}</p>
              </div>
              <div className="border border-white/8 bg-white/[0.02] p-5">
                <p className="text-sm uppercase tracking-[0.18em] text-amber-200/70">Biweekly take-home</p>
                <p className="mt-2 text-2xl font-semibold text-white">{formatCurrency(biweekly)}</p>
              </div>
              <div className="border border-white/8 bg-white/[0.02] p-5">
                <p className="text-sm uppercase tracking-[0.18em] text-amber-200/70">Hourly take-home</p>
                <p className="mt-2 text-2xl font-semibold text-white">{formatCurrency(hourly)}</p>
              </div>
            </div>

            <div className="mt-5 border border-amber-200/8 bg-amber-100/[0.02] p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-amber-200/70">Local tax notes</p>
              <p className="mt-3 text-lg leading-8 text-zinc-200">
                This {city.name} page starts with a simple federal estimate, layers in the broader {state.name} income tax, and {city.localTaxRate ? `adds an assumed ${(city.localTaxRate * 100).toFixed(2)}% local tax rate` : "does not add a separate local wage tax"}. {summaryText}
              </p>
            </div>

            <div className="mt-5 border border-white/8 bg-white/[0.02] p-5">
              <div className="grid grid-cols-2 gap-y-4 text-lg">
                <div className="text-zinc-200">Gross salary</div>
                <div className="text-right font-semibold text-white">{formatCurrency(amount, 0)}</div>
                <div className="text-zinc-200">Estimated federal tax</div>
                <div className="text-right font-semibold text-white">{formatCurrency(federalTax)}</div>
                <div className="text-zinc-200">Estimated state tax</div>
                <div className="text-right font-semibold text-white">{formatCurrency(stateTax)}</div>
                <div className="text-zinc-200">Estimated local tax</div>
                <div className="text-right font-semibold text-white">{formatCurrency(localTax)}</div>
                <div className="text-zinc-200">Estimated net income</div>
                <div className="text-right font-semibold text-white">{formatCurrency(netAnnual, 0)}</div>
              </div>
            </div>

            <div className="mt-5 border border-white/8 bg-white/[0.02] p-5">
              <h3 className="text-2xl font-semibold text-white">More {state.name} city pages</h3>
              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {moreCities.map((entry) => (
                  <Link key={entry.slug} href={`/salary/${amount}/after-tax/${state.slug}/${entry.slug}`} className="border border-white/8 bg-white/[0.02] p-4 transition hover:bg-white/[0.03]">
                    <div className="text-lg font-semibold text-white">{entry.name}</div>
                    <div className="mt-2 text-sm leading-6 text-zinc-300">Compare {formatCurrency(amount, 0)} after tax in {entry.name}, {state.name}.</div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
