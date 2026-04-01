import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "../components/SiteHeader";
import {
  LoanCategory,
  calculateLoanResults,
  formatCurrency,
  formatWholeCurrency,
  genericExamples,
  getNearbyExamples,
  isValidAmount,
  loanCategories,
} from "./loan-data";

const siteUrl = "https://calctrio.com";

export function buildStaticParams(category?: LoanCategory) {
  const examples = category ? category.quickExamples : genericExamples;
  return examples.map((amount) => ({ amount: amount.toString() }));
}

function getAmountData(amountParam: string, category?: LoanCategory) {
  if (!isValidAmount(amountParam)) return null;

  const principal = Number(amountParam);
  if (!Number.isFinite(principal) || principal < 1000 || principal > 10000000) {
    return null;
  }

  const annualRate = category?.defaultRate ?? 6.5;
  const years = category?.defaultYears ?? 5;
  const result = calculateLoanResults(principal, annualRate, years);
  if (!result) return null;
  return result;
}

export function buildAmountMetadata(
  amount: string,
  category?: LoanCategory
): Metadata {
  const data = getAmountData(amount, category);
  const basePath = category ? `/loan/${category.slug}` : "/loan";

  if (!data) {
    return {
      title: category ? category.title : "Loan Calculator",
      description: category
        ? category.detailText
        : "Estimate monthly loan payment, total paid, and total interest.",
      alternates: { canonical: basePath },
    };
  }

  const principalText = formatWholeCurrency(data.principal);
  const monthlyText = formatCurrency(data.monthlyPayment);
  const totalInterestText = formatCurrency(data.totalInterest);
  const pageUrl = `${siteUrl}${basePath}/${amount}`;
  const title = category
    ? `${principalText} ${category.shortLabel} Loan Payment Calculator`
    : `${principalText} Loan Payment Calculator`;
  const description = category
    ? `${principalText} financed as a ${category.shortLabel.toLowerCase()} loan over ${data.years} years at ${data.annualRate.toFixed(2)}% APR is about ${monthlyText} per month with roughly ${totalInterestText} in total interest.`
    : `${principalText} financed over ${data.years} years at ${data.annualRate.toFixed(2)}% APR is about ${monthlyText} per month with roughly ${totalInterestText} in total interest.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${basePath}/${amount}`,
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

type LoanAmountPageContentProps = {
  amount: string;
  category?: LoanCategory;
};

export function LoanAmountPageContent({ amount, category }: LoanAmountPageContentProps) {
  const data = getAmountData(amount, category);
  if (!data) notFound();

  const principalText = formatWholeCurrency(data.principal);
  const monthlyText = formatCurrency(data.monthlyPayment);
  const totalPaidText = formatCurrency(data.totalPaid);
  const totalInterestText = formatCurrency(data.totalInterest);
  const basePath = category ? `/loan/${category.slug}` : "/loan";
  const pageUrl = `${siteUrl}${basePath}/${amount}`;
  const nearbyExamples = getNearbyExamples(
    data.principal,
    category ? category.quickExamples : genericExamples,
    5
  );
  const exampleTitle = category
    ? `${principalText} ${category.shortLabel} Loan Payment Calculator`
    : `${principalText} Loan Payment Calculator`;
  const intro = category
    ? `Financing ${principalText} over ${data.years} years at ${data.annualRate.toFixed(2)}% APR gives an estimated ${category.shortLabel.toLowerCase()} loan payment of ${monthlyText} per month.`
    : `Financing ${principalText} over ${data.years} years at ${data.annualRate.toFixed(2)}% APR gives an estimated monthly payment of ${monthlyText}.`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the monthly payment on ${principalText}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: intro,
        },
      },
      {
        "@type": "Question",
        name: `How much interest would I pay on ${principalText}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `At ${data.annualRate.toFixed(2)}% APR over ${data.years} years, total interest would be about ${totalInterestText}.`,
        },
      },
      {
        "@type": "Question",
        name: "Does this include taxes, insurance, or fees?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. This example includes principal and interest only. Taxes, insurance, registration, dealer fees, marina costs, campground fees, and other related costs are not included.",
        },
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `CalcTrio ${exampleTitle}`,
    url: pageUrl,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    description: intro,
  };

  const breadcrumbItems = [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Loan Calculator", item: `${siteUrl}/loan` },
    ...(category
      ? [{ "@type": "ListItem", position: 3, name: category.title, item: `${siteUrl}/loan/${category.slug}` }]
      : []),
    { "@type": "ListItem", position: category ? 4 : 3, name: principalText, item: pageUrl },
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

  const comparisonLinks = category
    ? Object.values(loanCategories).filter((item) => item.slug !== category.slug)
    : Object.values(loanCategories);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main className="min-h-screen bg-[#111111] text-[#f7f3eb]">
        <SiteHeader />

        {category ? (
          <section className="border-b border-[#201c18] bg-[#0f0f0f] bg-cover bg-center" style={{ backgroundImage: category.heroImage }}>
            <div className="mx-auto w-full max-w-6xl px-6 py-12">
              <p className="mb-3 text-xs uppercase tracking-[0.22em] text-[#b29f7a]">{category.shortLabel} example</p>
              <h1 className="max-w-4xl text-4xl font-bold leading-tight text-[#f7f3eb] md:text-5xl">{exampleTitle}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-[#ddd2c0]">{intro}</p>
            </div>
          </section>
        ) : null}

        <div className="mx-auto w-full max-w-6xl px-6 py-8">
          <div className="mb-6">
            <Link href={basePath} className="inline-flex items-center border border-[#2f2a22] bg-[#1f1b16] px-4 py-2 text-sm font-medium text-[#f7f3eb] transition-colors duration-200 hover:border-[#b29f7a] hover:bg-[#262119]">
              ← Back to {category ? category.title : "Loan Calculator"}
            </Link>
          </div>

          {!category ? (
            <section className="rounded-xl border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.28)]">
              <p className="mb-3 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Loan Example</p>
              <h1 className="max-w-4xl text-4xl font-bold leading-tight text-[#f7f3eb] md:text-5xl">{exampleTitle}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-[#d2c7b2]">{intro}</p>
            </section>
          ) : null}

          <section className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-[#2a2a2a] bg-[#171717] px-7 py-7 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Loan Amount</p>
              <p className="text-4xl font-semibold tracking-tight text-[#f7f3eb]">{principalText}</p>
            </div>

            <div className="rounded-xl border border-[#2a2a2a] bg-[#171717] px-7 py-7 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Monthly Payment</p>
              <p className="text-4xl font-semibold tracking-tight text-[#f7f3eb]">{monthlyText}</p>
            </div>

            <div className="rounded-xl border border-[#2a2a2a] bg-[#171717] px-7 py-7 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Total Interest</p>
              <p className="text-4xl font-semibold tracking-tight text-[#f7f3eb]">{totalInterestText}</p>
            </div>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div className="rounded-xl border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
              <div className="mb-5">
                <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">What this example means</p>
                <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">A grounded monthly estimate</h2>
              </div>

              <div className="space-y-4 text-base leading-7 text-[#d2c7b2]">
                <p>
                  Borrowing <span className="font-semibold text-[#f7f3eb]">{principalText}</span> over <span className="font-semibold text-[#f7f3eb]">{data.years} years</span> at <span className="font-semibold text-[#f7f3eb]">{data.annualRate.toFixed(2)}% APR</span> produces an estimated fixed monthly payment of <span className="font-semibold text-[#f7f3eb]">{monthlyText}</span>.
                </p>
                <p>
                  Over the full term, total paid would be about <span className="font-semibold text-[#f7f3eb]">{totalPaidText}</span>, with about <span className="font-semibold text-[#f7f3eb]">{totalInterestText}</span> going to interest.
                </p>
                <p>
                  This example is useful for a fast budget check before shopping, comparing models, or deciding whether to shorten the term or increase the down payment.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
              <div className="mb-5">
                <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Nearby examples</p>
                <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">Compare nearby amounts</h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {nearbyExamples.map((example) => (
                  <Link
                    key={example}
                    href={`${basePath}/${example}`}
                    className="border border-[#2f2a22] bg-[#141414] px-4 py-3 text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]"
                  >
                    {formatWholeCurrency(example)}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-xl border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
            <div className="mb-5">
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Related calculators</p>
              <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">Keep exploring</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/salary" className="border border-[#2f2a22] bg-[#141414] px-5 py-4 transition-colors duration-200 hover:border-[#b29f7a]">
                <p className="text-lg font-semibold text-[#f7f3eb]">Salary Calculator</p>
                <p className="mt-1 text-sm text-[#d2c7b2]">Turn annual pay into monthly, biweekly, weekly, and hourly numbers.</p>
              </Link>

              <Link href="/savings" className="border border-[#2f2a22] bg-[#141414] px-5 py-4 transition-colors duration-200 hover:border-[#b29f7a]">
                <p className="text-lg font-semibold text-[#f7f3eb]">Savings Calculator</p>
                <p className="mt-1 text-sm text-[#d2c7b2]">Estimate monthly savings needed to hit a goal.</p>
              </Link>

              {comparisonLinks.map((item) => (
                <Link key={item.slug} href={`/loan/${item.slug}`} className="border border-[#2f2a22] bg-[#141414] px-5 py-4 transition-colors duration-200 hover:border-[#b29f7a]">
                  <p className="text-lg font-semibold text-[#f7f3eb]">{item.label}</p>
                  <p className="mt-1 text-sm text-[#d2c7b2]">{item.intro}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
