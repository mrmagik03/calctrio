import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/app/components/JsonLd";
import SalaryCalculatorPanel from "@/app/salary/components/SalaryCalculatorPanel";
import SalaryMethodology from "@/app/salary/components/SalaryMethodology";
import SalaryPageScaffold from "@/app/salary/components/SalaryPageScaffold";
import { getCityByStateAndSlug } from "@/lib/cities";
import { getStateBySlug } from "@/lib/states";
import {
  formatCurrency,
  formatWholeCurrency,
  getCostProfile,
  getNearbyCities,
  getSalaryBreakdown,
  readAmountParam,
} from "@/lib/salary";

const SITE_URL = "https://calctrio.com";

const STATE_ABBREVIATIONS: Record<string, string> = {
  alabama: "AL",
  alaska: "AK",
  arizona: "AZ",
  arkansas: "AR",
  california: "CA",
  colorado: "CO",
  connecticut: "CT",
  delaware: "DE",
  florida: "FL",
  georgia: "GA",
  hawaii: "HI",
  idaho: "ID",
  illinois: "IL",
  indiana: "IN",
  iowa: "IA",
  kansas: "KS",
  kentucky: "KY",
  louisiana: "LA",
  maine: "ME",
  maryland: "MD",
  massachusetts: "MA",
  michigan: "MI",
  minnesota: "MN",
  mississippi: "MS",
  missouri: "MO",
  montana: "MT",
  nebraska: "NE",
  nevada: "NV",
  "new-hampshire": "NH",
  "new-jersey": "NJ",
  "new-mexico": "NM",
  "new-york": "NY",
  "north-carolina": "NC",
  "north-dakota": "ND",
  ohio: "OH",
  oklahoma: "OK",
  oregon: "OR",
  pennsylvania: "PA",
  "rhode-island": "RI",
  "south-carolina": "SC",
  "south-dakota": "SD",
  tennessee: "TN",
  texas: "TX",
  utah: "UT",
  vermont: "VT",
  virginia: "VA",
  washington: "WA",
  "west-virginia": "WV",
  wisconsin: "WI",
  wyoming: "WY",
};

type Props = { params: Promise<{ amount: string; state: string; city: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { amount: rawAmount, state: rawState, city: rawCity } = await params;
  const amount = readAmountParam(rawAmount);
  const state = getStateBySlug(rawState);
  const city = state ? getCityByStateAndSlug(state.slug, rawCity) : null;
  if (!state || !city) return {};

  return {
    title: `${formatWholeCurrency(amount)} Salary in ${city.name}, ${state.name}`,
    description: `Estimate take-home pay on ${formatWholeCurrency(amount)} in ${city.name}, ${state.name}, then compare nearby cities and local cost pressure.`,
    alternates: { canonical: `${SITE_URL}/salary/${amount}/${state.slug}/${city.slug}` },
  };
}

function buildCityBlurb(amount: number, cityName: string, stateName: string, costSummary: string, rentBand: string, cityNote?: string) {
  const firstSentence = `${formatWholeCurrency(amount)} in ${cityName} comes out to roughly ${formatCurrency(amount / 12)} per month before taxes, so the real question is how much of your take-home pay still feels usable once rent, transportation, and day-to-day costs show up.`;
  const secondSentence = `${costSummary} A reasonable planning range for rent here is ${rentBand}, which helps explain whether this salary feels tight, comfortable, or somewhere in the middle for ${cityName}.`;
  if (cityNote) {
    return `${firstSentence} ${secondSentence} ${cityNote}`;
  }
  return `${firstSentence} ${secondSentence}`;
}

function getMedianRentFromBand(rentBand: string) {
  const matches = rentBand.match(/\$([\d,]+)[–-]\$([\d,]+)/);
  if (!matches) return null;

  const low = Number(matches[1].replace(/,/g, ""));
  const high = Number(matches[2].replace(/,/g, ""));
  return Math.round((low + high) / 2);
}

function buildCitySalaryBlurb({
  amount,
  cityName,
  stateTax,
  localTax,
  monthlyNet,
  medianRent,
  rentBand,
}: {
  amount: number;
  cityName: string;
  stateTax: number;
  localTax: number;
  monthlyNet: number;
  medianRent: number | null;
  rentBand: string;
}) {
  const taxSentence =
    stateTax <= 0
      ? `With no state income tax, more of a ${formatWholeCurrency(amount)} salary stays in your pocket in ${cityName}.`
      : localTax > 0
        ? `State and local income taxes both reduce take-home pay on a ${formatWholeCurrency(amount)} salary in ${cityName}.`
        : `State income tax reduces take-home pay on a ${formatWholeCurrency(amount)} salary in ${cityName}.`;

  if (!medianRent || monthlyNet <= 0) {
    return `${taxSentence} Rent typically runs ${rentBand}, so housing will be a major factor in how comfortable this income feels.`;
  }

  const rentRatio = medianRent / monthlyNet;

  const housingSentence =
    rentRatio >= 0.4
      ? `Typical rent runs ${rentBand}, which puts real pressure on this income once housing is covered.`
      : rentRatio >= 0.3
        ? `Typical rent runs ${rentBand}, so housing will take a meaningful share of take-home pay here.`
        : `Typical rent runs ${rentBand}, so housing costs are more manageable here than in many higher-cost cities.`;

  return `${taxSentence} ${housingSentence}`;
}

export default async function SalaryCityAmountPage({ params }: Props) {
  const { amount: rawAmount, state: rawState, city: rawCity } = await params;
  const amount = readAmountParam(rawAmount);
  const state = getStateBySlug(rawState);
  const city = state ? getCityByStateAndSlug(state.slug, rawCity) : null;
  if (!state || !city) notFound();

  const breakdown = getSalaryBreakdown(amount, state, city);
  const nearbyCities = getNearbyCities(city);
  const costProfile = getCostProfile(state, city);
  const medianRent = getMedianRentFromBand(costProfile.rentBand);
  const citySalaryBlurb = buildCitySalaryBlurb({
  amount,
  cityName: city.name,
  stateTax: breakdown.stateTax,
  localTax: breakdown.localTax,
  monthlyNet: breakdown.monthlyNet,
  medianRent,
  rentBand: costProfile.rentBand,
});
  
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How much is ${formatWholeCurrency(amount)} after tax in ${city.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Our estimate puts take-home pay around ${formatCurrency(breakdown.netAnnual, 0)} per year, or about ${formatCurrency(breakdown.monthlyNet)} per month in ${city.name}, ${state.name}.`,
        },
      },
    ],
  };

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: `${city.name} Salary Calculator`,
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Any',
          url: `${SITE_URL}/salary/${amount}/${state.slug}/${city.slug}`,
        }}
      />
      <JsonLd data={faqSchema} />
      <SalaryPageScaffold
        crumbs={[
          { href: '/', label: 'Home' },
          { href: '/salary', label: 'Salary' },
          { href: `/salary/location/${state.slug}`, label: state.name },
          { href: `/salary/location/${state.slug}/${city.slug}?amount=${amount}`, label: city.name },
          { label: formatWholeCurrency(amount) },
        ]}
      >
        <div className="grid items-start gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <SalaryCalculatorPanel
            initialAmount={amount}
            initialStateSlug={state.slug}
            initialCitySlug={city.slug}
            description={`Change the salary or location to see how the same paycheck looks somewhere else without backing out of the calculator.`}
          />

          <section className="border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.24)]">
  <div className="mb-5">
    <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Cost of living breakdown</p>
    <h1 className="text-3xl font-semibold leading-tight tracking-tight text-[#f7f3eb] sm:text-4xl">
      {city.name}, {STATE_ABBREVIATIONS[state.slug] ?? state.name}
    </h1>
  </div>

  <div className="space-y-4">
    <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
      <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Take-home pay after tax</p>
      <p className="text-4xl font-semibold tracking-tight text-[#f7f3eb]">{formatCurrency(breakdown.netAnnual, 0)} / year</p>
    </div>

    <div className="grid gap-4 sm:grid-cols-3">
      <div className="border border-[#2f2a22] bg-[#141414] px-4 py-4 flex flex-col justify-center">
        <p className="mb-1 text-xs uppercase tracking-[0.12em] text-[#8b826f] whitespace-nowrap">Monthly take-home</p>
        <p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">{formatCurrency(breakdown.monthlyNet, 0)}</p>
      </div>
      <div className="border border-[#2f2a22] bg-[#141414] px-4 py-4 flex flex-col justify-center">
        <p className="mb-1 text-xs uppercase tracking-[0.12em] text-[#8b826f] whitespace-nowrap">Biweekly take-home</p>
        <p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">{formatCurrency(breakdown.biweeklyNet, 0)}</p>
      </div>
      <div className="border border-[#2f2a22] bg-[#141414] px-4 py-4 flex flex-col justify-center">
        <p className="mb-1 text-xs uppercase tracking-[0.12em] text-[#8b826f] whitespace-nowrap">Typical rent</p>
        <p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
          {medianRent ? formatCurrency(medianRent, 0) : costProfile.rentBand}
        </p>
      </div>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
        <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">State income tax</p>
        <p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
          {breakdown.stateTax > 0 ? formatCurrency(breakdown.stateTax, 0) : "None"}
        </p>
      </div>
      <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
        <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Local income tax</p>
        <p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
          {breakdown.localTax > 0 ? formatCurrency(breakdown.localTax, 0) : "None"}
        </p>
      </div>
    </div>

    <div className="border border-[#3a3128] bg-[#151311] px-5 py-4 text-sm leading-7 text-[#d2c7b2]">
        <p>{citySalaryBlurb}</p>
    </div>
  </div>
</section>
        </div>

        <section className="mt-6 border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
          <div className="mb-5">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Nearby comparisons</p>
            <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">Compare nearby cities</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {nearbyCities.map((entry) => (
              <Link
                key={`${entry.stateSlug}-${entry.slug}`}
                href={`/salary/${amount}/${entry.stateSlug}/${entry.slug}`}
                className="border border-[#2f2a22] bg-[#141414] px-5 py-5 text-left transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]"
              >
                <span className="block text-2xl font-semibold leading-snug text-[#f7f3eb]">
                  {entry.name}
                  <span className="text-[#d2c7b2]">, {STATE_ABBREVIATIONS[entry.stateSlug] ?? entry.stateName}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <SalaryMethodology breakdown={breakdown} stateLabel={state.name} cityLabel={city.name} />
      </SalaryPageScaffold>
    </>
  );
}
