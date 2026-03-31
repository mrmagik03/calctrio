import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const siteUrl = "https://calctrio.com";
const defaultYears: number = 5;
const defaultRate: number = 4;

const savingsExamples: number[] = [];
for (let i = 5000; i <= 50000; i += 2500) savingsExamples.push(i);
for (let i = 55000; i <= 100000; i += 5000) savingsExamples.push(i);
for (let i = 110000; i <= 250000; i += 10000) savingsExamples.push(i);

function isValidAmount(value: string) {
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
  return formatCurrency(num, 0);
}

function calculateMonthsToGoal(
  goalAmount: number,
  annualRate: number,
  monthlyContribution: number
) {
  if (goalAmount <= 0 || monthlyContribution <= 0) return null;

  const monthlyRate = annualRate / 100 / 12;

  if (annualRate === 0) {
    return Math.ceil(goalAmount / monthlyContribution);
  }

  let balance = 0;
  let months = 0;
  const maxMonths = 1200;

  while (balance < goalAmount && months < maxMonths) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    months += 1;
  }

  if (months >= maxMonths) return null;

  return months;
}

function calculateSavingsData(amountParam: string) {
  if (!isValidAmount(amountParam)) return null;

  const goalAmount = Number(amountParam);
  if (!Number.isFinite(goalAmount) || goalAmount < 1000 || goalAmount > 1000000) {
    return null;
  }

  const months = defaultYears * 12;

  if (defaultRate === 0) {
    const monthlyDeposit = goalAmount / months;
    const totalContribution = monthlyDeposit * months;
    return {
      goalAmount,
      monthlyDeposit,
      totalContribution,
      interestEarned: 0,
      weeklyDeposit: (monthlyDeposit * 12) / 52,
      months,
    };
  }

  const monthlyRate = defaultRate / 100 / 12;
  const growthFactor = (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
  const monthlyDeposit = goalAmount / growthFactor;
  const totalContribution = monthlyDeposit * months;
  const interestEarned = goalAmount - totalContribution;
  const weeklyDeposit = (monthlyDeposit * 12) / 52;

  return {
    goalAmount,
    monthlyDeposit,
    totalContribution,
    interestEarned,
    weeklyDeposit,
    months,
  };
}

function getNearbySavingsLinks(currentAmount: number) {
  const currentIndex = savingsExamples.indexOf(currentAmount);

  if (currentIndex === -1) {
    return savingsExamples.slice(0, 6);
  }

  const start = Math.max(0, currentIndex - 3);
  const end = Math.min(savingsExamples.length, currentIndex + 4);
  return savingsExamples.slice(start, end).filter((amount) => amount !== currentAmount);
}

export function generateStaticParams() {
  return savingsExamples.map((amount) => ({ amount: amount.toString() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ amount: string }>;
}): Promise<Metadata> {
  const { amount } = await params;
  const savingsData = calculateSavingsData(amount);

  if (!savingsData) {
    return {
      title: "Savings Calculator",
      description: "Estimate monthly savings needed to reach a savings goal.",
      alternates: {
        canonical: "/savings",
      },
    };
  }

  const goalText = formatWholeCurrency(savingsData.goalAmount);
  const monthlyText = formatCurrency(savingsData.monthlyDeposit);
  const pageUrl = `${siteUrl}/savings/${savingsData.goalAmount}`;
  const title = `How to Save ${goalText} in ${defaultYears} Years`;
  const description = `To reach ${goalText} in ${defaultYears} years at ${defaultRate}% annual return, you would need to save about ${monthlyText} per month.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/savings/${savingsData.goalAmount}`,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "CalcTrio",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function SavingsAmountPage({
  params,
}: {
  params: Promise<{ amount: string }>;
}) {
  const { amount } = await params;
  const savingsData = calculateSavingsData(amount);

  if (!savingsData) {
    notFound();
  }

  const goalText = formatWholeCurrency(savingsData.goalAmount);
  const monthlyText = formatCurrency(savingsData.monthlyDeposit);
  const contributedText = formatCurrency(savingsData.totalContribution);
  const interestText = formatCurrency(savingsData.interestEarned);
  const weeklyText = formatCurrency(savingsData.weeklyDeposit);
  const pageUrl = `${siteUrl}/savings/${savingsData.goalAmount}`;

  const fasterMonths = calculateMonthsToGoal(
    savingsData.goalAmount,
    defaultRate,
    savingsData.monthlyDeposit + 100
  );

  const monthsSooner =
    fasterMonths !== null ? Math.max(0, savingsData.months - fasterMonths) : 0;

  const nearbyExamples = getNearbySavingsLinks(savingsData.goalAmount);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How much do I need to save monthly to reach ${goalText}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `To reach ${goalText} in ${defaultYears} years at ${defaultRate}% annual return, you need to save about ${monthlyText} per month.`,
        },
      },
      {
        "@type": "Question",
        name: `How much interest could I earn saving toward ${goalText}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `At ${defaultRate}% annual return over ${defaultYears} years, estimated interest earned is about ${interestText}.`,
        },
      },
      {
        "@type": "Question",
        name: "Is the return guaranteed?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. The annual return in this example is only an estimate. Actual savings and investment returns can vary.",
        },
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `CalcTrio ${goalText} Savings Calculator`,
    url: pageUrl,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    description: `Find out how much you need to save each month to reach ${goalText} in ${defaultYears} years at ${defaultRate}% annual return with CalcTrio.`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Savings Calculator", item: `${siteUrl}/savings` },
      { "@type": "ListItem", position: 3, name: goalText, item: pageUrl },
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
              <Link href="/" className="transition-colors duration-200 hover:text-[#f7f3eb]">Home</Link>
              <Link href="/salary" className="transition-colors duration-200 hover:text-[#f7f3eb]">Salary</Link>
              <Link href="/payment" className="transition-colors duration-200 hover:text-[#f7f3eb]">Payment</Link>
              <Link href="/savings" className="transition-colors duration-200 hover:text-[#f7f3eb]">Savings</Link>
            </nav>
          </div>
        </header>

        <div className="mx-auto w-full max-w-6xl px-6 py-8">
          <div className="mb-6">
            <Link
              href="/savings"
              className="inline-flex items-center border border-[#2f2a22] bg-[#1f1b16] px-4 py-2 text-sm font-medium text-[#f7f3eb] transition-colors duration-200 hover:border-[#b29f7a] hover:bg-[#262119]"
            >
              ← Back to Savings Calculator
            </Link>
          </div>

          <section className="rounded-xl border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.28)]">
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Savings Goal Example</p>

            <h1 className="max-w-4xl text-4xl font-bold leading-tight text-[#f7f3eb] md:text-5xl">
              How to Save {goalText} in {defaultYears} Years
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#d2c7b2]">
              To reach <span className="font-semibold text-[#f7f3eb]">{goalText}</span> in{" "}
              <span className="font-semibold text-[#f7f3eb]">{defaultYears} years</span> at{" "}
              <span className="font-semibold text-[#f7f3eb]">{defaultRate}% annual return</span>,
              you would need to save about{" "}
              <span className="font-semibold text-[#f7f3eb]">{monthlyText}</span> per month.
            </p>
          </section>

          <section className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-[#2a2a2a] bg-[#171717] px-7 py-7 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Savings Goal</p>
              <p className="text-4xl font-semibold tracking-tight text-[#f7f3eb]">{goalText}</p>
            </div>

            <div className="rounded-xl border border-[#2a2a2a] bg-[#171717] px-7 py-7 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Monthly Savings</p>
              <p className="text-4xl font-semibold tracking-tight text-[#f7f3eb]">{monthlyText}</p>
            </div>

            <div className="rounded-xl border border-[#2a2a2a] bg-[#171717] px-7 py-7 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Interest Earned</p>
              <p className="text-4xl font-semibold tracking-tight text-[#f7f3eb]">{interestText}</p>
            </div>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="rounded-xl border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
              <div className="mb-6">
                <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Clean Breakdown</p>
                <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">Full savings picture</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                  <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Total Contributed</p>
                  <p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">{contributedText}</p>
                </div>

                <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                  <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Weekly Savings</p>
                  <p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">{weeklyText}</p>
                </div>
              </div>

              <div className="mt-4 border border-[#3a3128] bg-[#151311] px-5 py-4">
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#b29f7a]">Smart Insight</p>
                <p className="text-sm leading-6 text-[#d2c7b2]">
                  Saving <span className="font-semibold text-[#f7f3eb]">+$100/month</span> could help you reach {goalText} about{" "}
                  <span className="font-semibold text-[#f7f3eb]">{monthsSooner} months sooner</span>.
                </p>
              </div>

              <div className="mt-4 border border-[#2a2a2a] bg-[#121212] px-5 py-4 text-sm text-[#d2c7b2]">
                <div className="flex items-center justify-between py-2">
                  <span>Savings goal</span>
                  <span className="font-medium text-[#f7f3eb]">{goalText}</span>
                </div>

                <div className="flex items-center justify-between border-t border-[#232323] py-2">
                  <span>Years to save</span>
                  <span className="font-medium text-[#f7f3eb]">{defaultYears} years</span>
                </div>

                <div className="flex items-center justify-between border-t border-[#232323] py-2">
                  <span>Annual return</span>
                  <span className="font-medium text-[#f7f3eb]">{defaultRate.toFixed(2)}%</span>
                </div>

                <div className="flex items-center justify-between border-t border-[#232323] py-2">
                  <span>Weekly savings target</span>
                  <span className="font-medium text-[#f7f3eb]">{weeklyText}</span>
                </div>
              </div>
            </div>

            <aside className="rounded-xl border border-[#2a2a2a] bg-[#171717] px-7 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
              <p className="mb-3 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Try Another Goal</p>

              <div className="grid gap-3">
                {nearbyExamples.map((example) => (
                  <Link
                    key={example}
                    href={`/savings/${example}`}
                    className="border border-[#2f2a22] bg-[#141414] px-4 py-3 text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]"
                  >
                    Save {formatWholeCurrency(example)}
                  </Link>
                ))}
              </div>

              <div className="mt-6 border-t border-[#232323] pt-6">
                <p className="mb-3 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Related Calculators</p>
                <div className="grid gap-3">
                  <Link href="/savings" className="border border-[#2f2a22] bg-[#141414] px-4 py-3 text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]">Savings calculator</Link>
                  <Link href="/salary" className="border border-[#2f2a22] bg-[#141414] px-4 py-3 text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]">Salary calculator</Link>
                  <Link href="/payment" className="border border-[#2f2a22] bg-[#141414] px-4 py-3 text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]">Payment calculator</Link>
                </div>
              </div>
            </aside>
          </section>

          <section className="mt-6 rounded-xl border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
            <div className="mb-6">
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">FAQs</p>
              <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">{goalText} savings questions</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                <h3 className="mb-2 text-lg font-semibold text-[#f7f3eb]">How much do I need to save monthly for {goalText}?</h3>
                <p className="text-sm leading-6 text-[#d2c7b2]">
                  To reach {goalText} in {defaultYears} years, you need to save about {monthlyText} per month in this example.
                </p>
              </div>

              <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                <h3 className="mb-2 text-lg font-semibold text-[#f7f3eb]">How much interest could I earn?</h3>
                <p className="text-sm leading-6 text-[#d2c7b2]">
                  Estimated interest earned is about {interestText} at {defaultRate}% annual return.
                </p>
              </div>

              <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                <h3 className="mb-2 text-lg font-semibold text-[#f7f3eb]">Is the return guaranteed?</h3>
                <p className="text-sm leading-6 text-[#d2c7b2]">No. These are planning estimates only. Actual returns can vary.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
