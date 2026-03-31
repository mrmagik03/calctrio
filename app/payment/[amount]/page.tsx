import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const siteUrl = "https://calctrio.com";
const defaultRate = 6.5;
const defaultYears = 5;

const paymentExamples: number[] = [];
for (let i = 5000; i <= 50000; i += 2500) paymentExamples.push(i);
for (let i = 55000; i <= 100000; i += 5000) paymentExamples.push(i);
for (let i = 110000; i <= 250000; i += 10000) paymentExamples.push(i);

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

function getPaymentData(amountParam: string) {
  if (!isValidAmount(amountParam)) return null;

  const principal = Number(amountParam);
  if (!Number.isFinite(principal) || principal < 1000 || principal > 10000000) {
    return null;
  }

  const months = defaultYears * 12;
  const monthlyRate = defaultRate / 100 / 12;
  const monthlyPayment =
    (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  const totalPaid = monthlyPayment * months;
  const totalInterest = totalPaid - principal;

  return {
    principal,
    months,
    monthlyPayment,
    totalPaid,
    totalInterest,
  };
}

function getNearbyPaymentLinks(currentAmount: number) {
  const currentIndex = paymentExamples.indexOf(currentAmount);

  if (currentIndex === -1) {
    return paymentExamples.slice(0, 4);
  }

  const start = Math.max(0, currentIndex - 2);
  const end = Math.min(paymentExamples.length, currentIndex + 3);
  return paymentExamples.slice(start, end).filter((amount) => amount !== currentAmount);
}

export function generateStaticParams() {
  return paymentExamples.map((amount) => ({ amount: amount.toString() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ amount: string }>;
}): Promise<Metadata> {
  const { amount } = await params;
  const paymentData = getPaymentData(amount);

  if (!paymentData) {
    return {
      title: "Payment Calculator",
      description:
        "Use CalcTrio's payment calculator to estimate monthly loan payments, total paid, and total interest.",
      alternates: {
        canonical: "/payment",
      },
    };
  }

  const principalText = formatWholeCurrency(paymentData.principal);
  const monthlyText = formatCurrency(paymentData.monthlyPayment);
  const totalInterestText = formatCurrency(paymentData.totalInterest);
  const pageUrl = `${siteUrl}/payment/${amount}`;
  const title = `${principalText} Loan Payment Calculator`;
  const description = `${principalText} financed over ${defaultYears} years at ${defaultRate}% APR is about ${monthlyText} per month with roughly ${totalInterestText} in total interest.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/payment/${amount}`,
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

export default async function PaymentAmountPage({
  params,
}: {
  params: Promise<{ amount: string }>;
}) {
  const { amount } = await params;
  const paymentData = getPaymentData(amount);

  if (!paymentData) {
    notFound();
  }

  const principalText = formatWholeCurrency(paymentData.principal);
  const monthlyText = formatCurrency(paymentData.monthlyPayment);
  const totalPaidText = formatCurrency(paymentData.totalPaid);
  const totalInterestText = formatCurrency(paymentData.totalInterest);
  const pageUrl = `${siteUrl}/payment/${amount}`;
  const nearbyExamples = getNearbyPaymentLinks(paymentData.principal);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the monthly payment on ${principalText}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${principalText} financed over ${defaultYears} years at ${defaultRate}% APR is about ${monthlyText} per month.`,
        },
      },
      {
        "@type": "Question",
        name: `How much interest would I pay on ${principalText}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `At ${defaultRate}% APR over ${defaultYears} years, total interest would be about ${totalInterestText}.`,
        },
      },
      {
        "@type": "Question",
        name: "Does this include taxes or insurance?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. This example includes principal and interest only. Taxes, insurance, HOA fees, and other costs are not included.",
        },
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `CalcTrio ${principalText} Payment Calculator`,
    url: pageUrl,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    description: `${principalText} financed over ${defaultYears} years at ${defaultRate}% APR is about ${monthlyText} per month with CalcTrio's payment calculator.`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Payment Calculator", item: `${siteUrl}/payment` },
      { "@type": "ListItem", position: 3, name: principalText, item: pageUrl },
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
              href="/payment"
              className="inline-flex items-center border border-[#2f2a22] bg-[#1f1b16] px-4 py-2 text-sm font-medium text-[#f7f3eb] transition-colors duration-200 hover:border-[#b29f7a] hover:bg-[#262119]"
            >
              ← Back to Payment Calculator
            </Link>
          </div>

          <section className="rounded-xl border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.28)]">
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-[#8b826f]">
              Loan Example
            </p>

            <h1 className="max-w-4xl text-4xl font-bold leading-tight text-[#f7f3eb] md:text-5xl">
              {principalText} Loan Payment Calculator
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#d2c7b2]">
              Financing <span className="font-semibold text-[#f7f3eb]">{principalText}</span> over{" "}
              <span className="font-semibold text-[#f7f3eb]">{defaultYears} years</span> at{" "}
              <span className="font-semibold text-[#f7f3eb]">{defaultRate}% APR</span> gives an
              estimated monthly payment of{" "}
              <span className="font-semibold text-[#f7f3eb]">{monthlyText}</span>.
            </p>
          </section>

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

          <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="rounded-xl border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
              <div className="mb-6">
                <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Clean Breakdown</p>
                <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">Full payment picture</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                  <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Total Paid</p>
                  <p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">{totalPaidText}</p>
                </div>

                <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                  <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">Loan Assumptions</p>
                  <p className="text-sm leading-7 text-[#d2c7b2]">
                    Fixed monthly payment, {defaultRate}% APR, and a {defaultYears}-year repayment term.
                  </p>
                </div>
              </div>

              <div className="mt-4 border border-[#3a3128] bg-[#151311] px-5 py-4">
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#b29f7a]">Smart Insight</p>
                <p className="text-sm leading-6 text-[#d2c7b2]">
                  This example shows principal and interest only. Taxes, insurance, and other loan-related costs could raise the real monthly out-of-pocket amount.
                </p>
              </div>
            </div>

            <aside className="rounded-xl border border-[#2a2a2a] bg-[#171717] px-7 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
              <p className="mb-3 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Try Another Loan</p>

              <div className="grid gap-3">
                {nearbyExamples.map((example) => (
                  <Link
                    key={example}
                    href={`/payment/${example}`}
                    className="border border-[#2f2a22] bg-[#141414] px-4 py-3 text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]"
                  >
                    {formatWholeCurrency(example)} loan
                  </Link>
                ))}
              </div>

              <div className="mt-6 border-t border-[#232323] pt-6">
                <p className="mb-3 text-xs uppercase tracking-[0.22em] text-[#8b826f]">Related Calculators</p>
                <div className="grid gap-3">
                  <Link href="/payment" className="border border-[#2f2a22] bg-[#141414] px-4 py-3 text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]">Payment calculator</Link>
                  <Link href="/salary" className="border border-[#2f2a22] bg-[#141414] px-4 py-3 text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]">Salary calculator</Link>
                  <Link href="/savings" className="border border-[#2f2a22] bg-[#141414] px-4 py-3 text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]">Savings calculator</Link>
                </div>
              </div>
            </aside>
          </section>
        </div>
      </main>
    </>
  );
}
