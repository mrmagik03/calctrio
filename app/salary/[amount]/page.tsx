import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const siteUrl = "https://www.calctrio.com";

const salaryExamples = [
  30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000,
  80000, 85000, 90000, 100000, 110000, 120000, 130000, 150000, 175000, 200000,
];

function isValidSalaryAmount(value: string) {
  return /^\d+$/.test(value);
}

function formatCurrency(num: number, decimals = 2) {
  return num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatWholeCurrency(num: number) {
  return num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function getSalaryData(amountParam: string) {
  if (!isValidSalaryAmount(amountParam)) return null;

  const annual = Number(amountParam);

  if (!Number.isFinite(annual) || annual < 10000 || annual > 1000000) {
    return null;
  }

  const monthly = annual / 12;
  const biweekly = annual / 26;
  const weekly = annual / 52;
  const hourly = annual / 2080;
  const daily = annual / 260;

  return {
    annual,
    monthly,
    biweekly,
    weekly,
    hourly,
    daily,
  };
}

export function generateStaticParams() {
  return salaryExamples.map((amount) => ({
    amount: amount.toString(),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ amount: string }>;
}): Promise<Metadata> {
  const { amount } = await params;
  const salaryData = getSalaryData(amount);

  if (!salaryData) {
    return {
      title: "Salary Calculator | CalcTrio",
      description: "Convert annual salary into monthly, biweekly, weekly, and hourly pay.",
    };
  }

  const annualText = formatWholeCurrency(salaryData.annual);
  const monthlyText = formatCurrency(salaryData.monthly);
  const pageUrl = `${siteUrl}/salary/${salaryData.annual}`;

  return {
    title: `${annualText} Salary is How Much a Month? | CalcTrio`,
    description: `${annualText} a year is about ${monthlyText} per month before taxes. See monthly, biweekly, weekly, hourly, and daily pay with CalcTrio.`,
    alternates: {
      canonical: `/salary/${salaryData.annual}`,
    },
    openGraph: {
      title: `${annualText} Salary is How Much a Month? | CalcTrio`,
      description: `${annualText} a year is about ${monthlyText} per month before taxes. See monthly, biweekly, weekly, hourly, and daily pay with CalcTrio.`,
      url: pageUrl,
      siteName: "CalcTrio",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${annualText} Salary is How Much a Month? | CalcTrio`,
      description: `${annualText} a year is about ${monthlyText} per month before taxes. See monthly, biweekly, weekly, hourly, and daily pay with CalcTrio.`,
    },
  };
}

export default async function SalaryAmountPage({
  params,
}: {
  params: Promise<{ amount: string }>;
}) {
  const { amount } = await params;
  const salaryData = getSalaryData(amount);

  if (!salaryData) {
    notFound();
  }

  const annualText = formatWholeCurrency(salaryData.annual);
  const monthlyText = formatCurrency(salaryData.monthly);
  const biweeklyText = formatCurrency(salaryData.biweekly);
  const weeklyText = formatCurrency(salaryData.weekly);
  const hourlyText = formatCurrency(salaryData.hourly);
  const dailyText = formatCurrency(salaryData.daily);
  const pageUrl = `${siteUrl}/salary/${salaryData.annual}`;

  const nearbyExamples = salaryExamples.filter(
    (value) => value !== salaryData.annual
  ).slice(0, 6);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `${annualText} salary is how much per month?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${annualText} a year is about ${monthlyText} per month before taxes when divided across 12 months.`,
        },
      },
      {
        "@type": "Question",
        name: `${annualText} salary is how much biweekly?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${annualText} a year is about ${biweeklyText} every two weeks before taxes using 26 pay periods.`,
        },
      },
      {
        "@type": "Question",
        name: `Is ${annualText} before or after taxes?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `These salary conversion figures are before taxes and deductions. Actual take-home pay depends on tax withholding, benefits, and other deductions.`,
        },
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `CalcTrio ${annualText} Salary Calculator`,
    url: pageUrl,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    description: `${annualText} a year is about ${monthlyText} per month before taxes. See monthly, biweekly, weekly, hourly, and daily pay with CalcTrio.`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Salary Calculator",
        item: `${siteUrl}/salary`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: annualText,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen bg-[#111111] text-[#f7f3eb]">
        <header className="border-b border-[#201c18] bg-[#0f0f0f]/95">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
            <Link
              href="/"
              className="text-lg font-semibold tracking-[0.01em] text-[#f7f3eb] transition-colors duration-200 hover:text-[#d8b07a]"
            >
              CalcTrio
            </Link>

            <nav className="flex items-center gap-5 text-sm text-[#b29f7a]">
              <Link
                href="/"
                className="transition-colors duration-200 hover:text-[#f7f3eb]"
              >
                Home
              </Link>
              <Link
                href="/payment"
                className="transition-colors duration-200 hover:text-[#f7f3eb]"
              >
                Payment
              </Link>
              <Link
                href="/savings"
                className="transition-colors duration-200 hover:text-[#f7f3eb]"
              >
                Savings
              </Link>
            </nav>
          </div>
        </header>

        <div className="mx-auto w-full max-w-6xl px-6 py-8">
          <div className="mb-6 text-sm text-[#9f9486]">
            <Link href="/" className="transition-colors duration-200 hover:text-[#f7f3eb]">
              Home
            </Link>
            <span className="px-2">/</span>
            <Link
              href="/salary"
              className="transition-colors duration-200 hover:text-[#f7f3eb]"
            >
              Salary
            </Link>
            <span className="px-2">/</span>
            <span className="text-[#d2c7b2]">{salaryData.annual.toLocaleString()}</span>
          </div>

          <section className="border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.28)]">
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-[#8b826f]">
              Salary to Paycheck
            </p>

            <h1 className="max-w-4xl text-4xl font-bold leading-tight text-[#f7f3eb] md:text-5xl">
              {annualText} a Year is How Much a Month?
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#d2c7b2]">
              If you make <span className="font-semibold text-[#f7f3eb]">{annualText}</span> per
              year, that works out to about{" "}
              <span className="font-semibold text-[#f7f3eb]">{monthlyText}</span> per month
              before taxes on a standard full-time schedule.
            </p>
          </section>

          <section className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="border border-[#2a2a2a] bg-[#171717] px-7 py-7 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#8b826f]">
                Annual Salary
              </p>
              <p className="text-4xl font-semibold tracking-tight text-[#f7f3eb]">
                {annualText}
              </p>
            </div>

            <div className="border border-[#2a2a2a] bg-[#171717] px-7 py-7 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#8b826f]">
                Monthly Pay
              </p>
              <p className="text-4xl font-semibold tracking-tight text-[#f7f3eb]">
                {monthlyText}
              </p>
            </div>

            <div className="border border-[#2a2a2a] bg-[#171717] px-7 py-7 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#8b826f]">
                Biweekly Pay
              </p>
              <p className="text-4xl font-semibold tracking-tight text-[#f7f3eb]">
                {biweeklyText}
              </p>
            </div>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
              <div className="mb-6">
                <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">
                  Clean Breakdown
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
                  Full salary picture
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                  <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">
                    Weekly Pay
                  </p>
                  <p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
                    {weeklyText}
                  </p>
                </div>

                <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                  <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">
                    Hourly Rate
                  </p>
                  <p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
                    {hourlyText}
                  </p>
                </div>
              </div>

              <div className="mt-4 border border-[#3a3128] bg-[#151311] px-5 py-4">
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#b29f7a]">
                  Smart Insight
                </p>
                <p className="text-sm leading-6 text-[#d2c7b2]">
                  At <span className="font-semibold text-[#f7f3eb]">{annualText}</span> per
                  year, you are earning about{" "}
                  <span className="font-semibold text-[#f7f3eb]">{hourlyText}/hour</span> and
                  roughly <span className="font-semibold text-[#f7f3eb]">{dailyText}/day</span>{" "}
                  before taxes using a standard 40-hour work week.
                </p>
              </div>

              <div className="mt-4 border border-[#2a2a2a] bg-[#121212] px-5 py-4 text-sm text-[#d2c7b2]">
                <div className="flex items-center justify-between py-2">
                  <span>Annual salary</span>
                  <span className="font-medium text-[#f7f3eb]">{annualText}</span>
                </div>

                <div className="flex items-center justify-between border-t border-[#232323] py-2">
                  <span>Monthly pay</span>
                  <span className="font-medium text-[#f7f3eb]">{monthlyText}</span>
                </div>

                <div className="flex items-center justify-between border-t border-[#232323] py-2">
                  <span>Biweekly pay</span>
                  <span className="font-medium text-[#f7f3eb]">{biweeklyText}</span>
                </div>

                <div className="flex items-center justify-between border-t border-[#232323] py-2">
                  <span>Weekly pay</span>
                  <span className="font-medium text-[#f7f3eb]">{weeklyText}</span>
                </div>
              </div>
            </div>

            <aside className="border border-[#2a2a2a] bg-[#171717] px-7 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
              <p className="mb-3 text-xs uppercase tracking-[0.22em] text-[#8b826f]">
                Try Another Salary
              </p>

              <div className="grid gap-3">
                {nearbyExamples.map((example) => (
                  <Link
                    key={example}
                    href={`/salary/${example}`}
                    className="border border-[#2f2a22] bg-[#141414] px-4 py-3 text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]"
                  >
                    {formatWholeCurrency(example)} salary
                  </Link>
                ))}
              </div>

              <div className="mt-6 border-t border-[#232323] pt-6">
                <p className="mb-3 text-xs uppercase tracking-[0.22em] text-[#8b826f]">
                  Related Calculators
                </p>

                <div className="grid gap-3">
                  <Link
                    href="/salary"
                    className="border border-[#2f2a22] bg-[#141414] px-4 py-3 text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]"
                  >
                    Salary calculator
                  </Link>
                  <Link
                    href="/payment"
                    className="border border-[#2f2a22] bg-[#141414] px-4 py-3 text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]"
                  >
                    Payment calculator
                  </Link>
                  <Link
                    href="/savings"
                    className="border border-[#2f2a22] bg-[#141414] px-4 py-3 text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]"
                  >
                    Savings calculator
                  </Link>
                </div>
              </div>
            </aside>
          </section>

          <section className="mt-6 border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
            <div className="mb-6">
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">
                FAQs
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
                {annualText} salary questions
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                <h3 className="mb-2 text-lg font-semibold text-[#f7f3eb]">
                  {annualText} salary is how much a month?
                </h3>
                <p className="text-sm leading-6 text-[#d2c7b2]">
                  {annualText} a year is about {monthlyText} per month before taxes when spread across 12 months.
                </p>
              </div>

              <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                <h3 className="mb-2 text-lg font-semibold text-[#f7f3eb]">
                  {annualText} salary is how much biweekly?
                </h3>
                <p className="text-sm leading-6 text-[#d2c7b2]">
                  {annualText} a year is about {biweeklyText} every two weeks before taxes using 26 pay periods.
                </p>
              </div>

              <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                <h3 className="mb-2 text-lg font-semibold text-[#f7f3eb]">
                  Is {annualText} before or after taxes?
                </h3>
                <p className="text-sm leading-6 text-[#d2c7b2]">
                  These numbers are gross pay estimates before taxes, benefits, and other paycheck deductions.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}