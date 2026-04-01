import Link from "next/link";
import { notFound } from "next/navigation";
import StateJumpSelect from "./StateJumpSelect";

type Props = {
  params: Promise<{
    amount: string;
    state: string;
  }>;
};

const STATE_TAX_RATES: Record<string, number> = {
  alabama: 0.05,
  alaska: 0,
  arizona: 0.025,
  arkansas: 0.047,
  california: 0.08,
  colorado: 0.044,
  connecticut: 0.05,
  delaware: 0.052,
  florida: 0,
  georgia: 0.053,
  hawaii: 0.08,
  idaho: 0.058,
  illinois: 0.0495,
  indiana: 0.0315,
  iowa: 0.057,
  kansas: 0.052,
  kentucky: 0.045,
  louisiana: 0.0425,
  maine: 0.058,
  maryland: 0.05,
  massachusetts: 0.05,
  michigan: 0.0425,
  minnesota: 0.068,
  mississippi: 0.05,
  missouri: 0.048,
  montana: 0.059,
  nebraska: 0.055,
  nevada: 0,
  "new-hampshire": 0,
  "new-jersey": 0.0637,
  "new-mexico": 0.049,
  "new-york": 0.06,
  "north-carolina": 0.0475,
  "north-dakota": 0.025,
  ohio: 0.035,
  oklahoma: 0.0475,
  oregon: 0.075,
  pennsylvania: 0.0307,
  "rhode-island": 0.05,
  "south-carolina": 0.05,
  "south-dakota": 0,
  tennessee: 0,
  texas: 0,
  utah: 0.0485,
  vermont: 0.06,
  virginia: 0.0575,
  washington: 0,
  "west-virginia": 0.0512,
  wisconsin: 0.053,
  wyoming: 0,
  "district-of-columbia": 0.06,
};

const STATE_NAMES: Record<string, string> = {
  alabama: "Alabama",
  alaska: "Alaska",
  arizona: "Arizona",
  arkansas: "Arkansas",
  california: "California",
  colorado: "Colorado",
  connecticut: "Connecticut",
  delaware: "Delaware",
  florida: "Florida",
  georgia: "Georgia",
  hawaii: "Hawaii",
  idaho: "Idaho",
  illinois: "Illinois",
  indiana: "Indiana",
  iowa: "Iowa",
  kansas: "Kansas",
  kentucky: "Kentucky",
  louisiana: "Louisiana",
  maine: "Maine",
  maryland: "Maryland",
  massachusetts: "Massachusetts",
  michigan: "Michigan",
  minnesota: "Minnesota",
  mississippi: "Mississippi",
  missouri: "Missouri",
  montana: "Montana",
  nebraska: "Nebraska",
  nevada: "Nevada",
  "new-hampshire": "New Hampshire",
  "new-jersey": "New Jersey",
  "new-mexico": "New Mexico",
  "new-york": "New York",
  "north-carolina": "North Carolina",
  "north-dakota": "North Dakota",
  ohio: "Ohio",
  oklahoma: "Oklahoma",
  oregon: "Oregon",
  pennsylvania: "Pennsylvania",
  "rhode-island": "Rhode Island",
  "south-carolina": "South Carolina",
  "south-dakota": "South Dakota",
  tennessee: "Tennessee",
  texas: "Texas",
  utah: "Utah",
  vermont: "Vermont",
  virginia: "Virginia",
  washington: "Washington",
  "west-virginia": "West Virginia",
  wisconsin: "Wisconsin",
  wyoming: "Wyoming",
  "district-of-columbia": "District of Columbia",
};

const STATE_SLUGS = Object.keys(STATE_NAMES);

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

function parseAmount(value: string) {
  const amount = Number(value.replace(/,/g, ""));
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

function federalTaxEstimate(amount: number) {
  return amount * 0.18;
}

function plainStateTaxNote(stateName: string, stateRate: number) {
  if (stateRate === 0) {
    return `${stateName} does not have a broad state income tax in this estimate, so take-home pay is mostly driven by federal taxes unless a city or local tax applies.`;
  }

  return `${stateName} uses an assumed ${(stateRate * 100).toFixed(2)}% state tax rate in this estimate, so your take-home pay comes in lower than a no-income-tax state at the same salary.`;
}

export default async function SalaryAfterTaxStatePage({ params }: Props) {
  const { amount: rawAmount, state: rawState } = await params;

  const amount = parseAmount(rawAmount);
  const stateKey = rawState.toLowerCase();
  const stateName = STATE_NAMES[stateKey];
  const stateTaxRate = STATE_TAX_RATES[stateKey];

  if (!amount || !stateName || stateTaxRate === undefined) {
    notFound();
  }

  const federalTax = federalTaxEstimate(amount);
  const stateTax = amount * stateTaxRate;
  const netAnnual = amount - federalTax - stateTax;
  const monthly = netAnnual / 12;
  const biweekly = netAnnual / 26;
  const hourly = netAnnual / 2080;

  return (
    <main className="min-h-screen bg-[#111111] text-[#f7f3eb]">
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <nav className="mb-8 text-sm text-[#9f9486]">
          <Link href="/" className="hover:text-[#f7f3eb]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/salary/${amount}/after-tax`} className="hover:text-[#f7f3eb]">
            After Tax
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#f7f3eb]">{stateName}</span>
        </nav>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          <section className="border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.28)]">
            <h1 className="mb-4 text-center text-4xl font-bold">
              ${amount.toLocaleString()} After Tax
            </h1>

            <p className="mb-8 text-center text-lg leading-8 text-[#d2c7b2]">
              Compare your estimated take-home pay in{" "}
              <span className="font-semibold text-[#f7f3eb]">{stateName}</span>.
            </p>

            <div className="mx-auto w-full max-w-md">
              <p className="mb-2 text-sm font-medium text-[#b29f7a]">
                Jump to a state
              </p>

              <StateJumpSelect amount={amount} stateKey={stateKey} />
            </div>

            <div className="mt-8">
              <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[#8b826f]">
                Popular state pages
              </p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  "texas",
                  "california",
                  "florida",
                  "new-york",
                  "illinois",
                  "georgia",
                  "north-carolina",
                  "ohio",
                ].map((slug) => (
                  <Link
                    key={slug}
                    href={`/salary/${amount}/after-tax/${slug}`}
                    className="border border-[#2f2a22] bg-[#141414] px-4 py-3 text-center text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]"
                  >
                    {STATE_NAMES[slug]}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.24)]">
            <div className="mb-6">
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">
                Clean Breakdown
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
                Full take-home picture
              </h2>
            </div>

            <div className="space-y-4">
              <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#b29f7a]">
                  Net annual pay
                </p>
                <p className="text-4xl font-semibold tracking-tight text-[#f7f3eb]">
                  {formatCurrency(netAnnual).replace(".00", "")}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                  <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#b29f7a]">
                    Monthly take-home
                  </p>
                  <p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
                    {formatCurrency(monthly)}
                  </p>
                </div>

                <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                  <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#b29f7a]">
                    Biweekly take-home
                  </p>
                  <p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
                    {formatCurrency(biweekly)}
                  </p>
                </div>

                <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                  <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#b29f7a]">
                    Hourly take-home
                  </p>
                  <p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
                    {formatCurrency(hourly)}
                  </p>
                </div>
              </div>

              <div className="border border-[#3a3128] bg-[#151311] px-5 py-5">
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#b29f7a]">
                  How state taxes change this salary
                </p>
                <p className="text-sm leading-8 text-[#d2c7b2]">
                  On a{" "}
                  <span className="font-semibold text-[#f7f3eb]">
                    {formatCurrency(amount).replace(".00", "")}
                  </span>{" "}
                  salary in{" "}
                  <span className="font-semibold text-[#f7f3eb]">{stateName}</span>,
                  this simple estimate leaves about{" "}
                  <span className="font-semibold text-[#f7f3eb]">
                    {formatCurrency(netAnnual).replace(".00", "")}
                  </span>{" "}
                  a year after federal taxes and an assumed{" "}
                  <span className="font-semibold text-[#f7f3eb]">
                    {(stateTaxRate * 100).toFixed(2)}%
                  </span>{" "}
                  state tax rate. {plainStateTaxNote(stateName, stateTaxRate)}
                </p>
              </div>

              <div className="border border-[#2a2a2a] bg-[#121212] px-5 py-4 text-sm text-[#d2c7b2]">
                <div className="flex items-center justify-between py-2">
                  <span>Gross salary</span>
                  <span className="font-medium text-[#f7f3eb]">
                    {formatCurrency(amount).replace(".00", "")}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-[#232323] py-2">
                  <span>Estimated federal tax</span>
                  <span className="font-medium text-[#f7f3eb]">
                    {formatCurrency(federalTax)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-[#232323] py-2">
                  <span>Estimated state tax</span>
                  <span className="font-medium text-[#f7f3eb]">
                    {formatCurrency(stateTax)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-[#232323] py-2">
                  <span>Estimated net income</span>
                  <span className="font-medium text-[#f7f3eb]">
                    {formatCurrency(netAnnual).replace(".00", "")}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}