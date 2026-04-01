import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { calculateLoanPayment, formatCurrency, toNumber } from "@/lib/loan";
import { LOAN_TYPES } from "@/lib/loanTypes";

type PageProps = {
  params: Promise<{
    price: string;
    rate: string;
    term: string;
  }>;
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://calctrio.com";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { price, rate, term } = await params;

  const loanAmount = toNumber(price);
  const apr = toNumber(rate);
  const months = toNumber(term);

  if (!loanAmount || !apr || !months) {
    return {
      title: "RV CalcTrio",
    };
  }

  return {
    title: `${formatCurrency(loanAmount)} RV Payment at ${apr}% for ${months} Months`,
    description: `Estimate the monthly RV payment for ${formatCurrency(
      loanAmount
    )} financed at ${apr}% APR for ${months} months.`,
    alternates: {
      canonical: `${SITE_URL}/rv-payment/${loanAmount}/${apr}/${months}`,
    },
  };
}

export default async function RvPaymentPage({ params }: PageProps) {
  const { price, rate, term } = await params;

  const loanAmount = toNumber(price);
  const apr = toNumber(rate);
  const months = toNumber(term);

  if (!loanAmount || !apr || !months) {
    notFound();
  }

  const theme = LOAN_TYPES.rv;
  const result = calculateLoanPayment(loanAmount, apr, months);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the payment on ${formatCurrency(
          loanAmount
        )} at ${apr}% for ${months} months?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The estimated monthly RV payment is ${formatCurrency(
            result.monthlyPayment
          )}.`,
        },
      },
    ],
  };

  return (
     <main id="main-content" className={`min-h-screen text-white ${theme.backgroundClassName}`}>
        <div className="border-b border-white/20 bg-black/35">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 md:px-6">
            <Link href="/" className="text-sm font-semibold tracking-tight">
              CalcTrio
            </Link>

            <nav className="flex items-center gap-5 text-sm text-neutral-100">
              <Link href="/loan" className="hover:text-white">
                Loan Hub
              </Link>
              <Link href="/salary" className="hover:text-white">
                Salary
              </Link>
              <Link href="/savings" className="hover:text-white">
                Savings
              </Link>
              <Link href="/car-payment/50000/6/72" className="hover:text-white">
                Car
              </Link>
              <Link href="/boat-payment/70000/7/120" className="hover:text-white">
                Boat
              </Link>
              <Link href="/rv-payment/90000/7/180" className="hover:text-white">
                RV
              </Link>
            </nav>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
          <div className="mb-8 text-sm text-neutral-100">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span>RV Payment</span>
          </div>

          <section className="rounded-2xl border border-white/25 bg-black/40 p-8 shadow-sm backdrop-blur-sm">
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
              {formatCurrency(loanAmount)} RV Payment at {apr}% for {months} Months
            </h1>

            <p className="mt-4 max-w-3xl text-lg text-neutral-100">
              Estimate your monthly RV payment, total paid over the life of the
              loan, and total interest cost.
            </p>
          </section>

          <section className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/25 bg-black/40 p-6 backdrop-blur-sm">
              <p className="text-sm text-neutral-100">Monthly payment</p>
              <p className="mt-2 text-3xl font-semibold">
                {formatCurrency(result.monthlyPayment)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/25 bg-black/40 p-6 backdrop-blur-sm">
              <p className="text-sm text-neutral-100">Total paid</p>
              <p className="mt-2 text-3xl font-semibold">
                {formatCurrency(result.totalPaid)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/25 bg-black/40 p-6 backdrop-blur-sm">
              <p className="text-sm text-neutral-100">Total interest</p>
              <p className="mt-2 text-3xl font-semibold">
                {formatCurrency(result.totalInterest)}
              </p>
            </div>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
            <div className="rounded-2xl border border-white/25 bg-black/40 p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold">RV loan breakdown</h2>

              <div className="mt-6 overflow-hidden rounded-xl border border-white/25">
                <div className="grid grid-cols-2 border-b border-white/25 bg-black/45">
                  <div className="px-4 py-3 text-sm font-medium text-neutral-100">
                    Category
                  </div>
                  <div className="px-4 py-3 text-sm font-medium text-neutral-100">
                    Amount
                  </div>
                </div>

                <div className="grid grid-cols-2 border-b border-white/25">
                  <div className="px-4 py-3 text-sm text-neutral-100">
                    Loan amount
                  </div>
                  <div className="px-4 py-3 text-sm font-medium">
                    {formatCurrency(loanAmount)}
                  </div>
                </div>

                <div className="grid grid-cols-2 border-b border-white/25">
                  <div className="px-4 py-3 text-sm text-neutral-100">APR</div>
                  <div className="px-4 py-3 text-sm font-medium">{apr}%</div>
                </div>

                <div className="grid grid-cols-2 border-b border-white/25">
                  <div className="px-4 py-3 text-sm text-neutral-100">
                    Loan term
                  </div>
                  <div className="px-4 py-3 text-sm font-medium">
                    {months} months
                  </div>
                </div>

                <div className="grid grid-cols-2 border-b border-white/25">
                  <div className="px-4 py-3 text-sm text-neutral-100">
                    Monthly payment
                  </div>
                  <div className="px-4 py-3 text-sm font-medium">
                    {formatCurrency(result.monthlyPayment)}
                  </div>
                </div>

                <div className="grid grid-cols-2 border-b border-white/25">
                  <div className="px-4 py-3 text-sm text-neutral-100">
                    Total paid
                  </div>
                  <div className="px-4 py-3 text-sm font-medium">
                    {formatCurrency(result.totalPaid)}
                  </div>
                </div>

                <div className="grid grid-cols-2">
                  <div className="px-4 py-3 text-sm text-neutral-100">
                    Total interest
                  </div>
                  <div className="px-4 py-3 text-sm font-medium">
                    {formatCurrency(result.totalInterest)}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/25 bg-black/40 p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold">Explore more calculators</h2>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <Link
                  href="/car-payment/50000/6/72"
                  className="rounded-xl border border-white/25 bg-black/50 px-4 py-3 text-sm text-neutral-100 transition hover:bg-black/60"
                >
                  Car payment example
                </Link>
                <Link
                  href="/boat-payment/70000/7/120"
                  className="rounded-xl border border-white/25 bg-black/50 px-4 py-3 text-sm text-neutral-100 transition hover:bg-black/60"
                >
                  Boat payment example
                </Link>
                <Link
                  href="/rv-payment/90000/7/180"
                  className="rounded-xl border border-white/25 bg-black/50 px-4 py-3 text-sm text-neutral-100 transition hover:bg-black/60"
                >
                  RV payment example
                </Link>
              </div>

              <div className="mt-6 rounded-xl border border-white/25 bg-black/50 p-4">
                <h3 className="text-base font-semibold">Related tools</h3>
                <p className="mt-2 text-sm text-neutral-100">
                  Compare paycheck and salary estimates with{" "}
                  <a href="https://calctrio.com">CalcTrio salary tools</a>.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
}
