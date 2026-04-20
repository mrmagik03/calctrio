export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SalaryPageHero from "@/components/SalaryPageHero";
import SiteShell from "@/components/SiteShell";
import ValueLinks from "@/components/ValueLinks";
import { PAGE_IDENTITY_LABELS, getPageTheme } from "@/lib/pageThemes";
import {
  annualSalaryToBiweekly,
  annualSalaryToHourly,
  annualSalaryToMonthly,
  clampSalaryForSeo,
  formatCurrency,
  toNumber,
} from "@/lib/pay";

const SITE_URL = "https://calctrio.com";

type PageProps = {
  params: Promise<{ amount: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { amount: rawAmount } = await params;
  const amount = clampSalaryForSeo(toNumber(rawAmount));

  return {
    title: `${formatCurrency(amount, 0)} Salary → ${formatCurrency(annualSalaryToBiweekly(amount))} Biweekly Before Tax`,
    description: `${formatCurrency(
      amount,
      0
    )} a year is about ${formatCurrency(annualSalaryToBiweekly(amount))} every two weeks before taxes, plus ${formatCurrency(annualSalaryToMonthly(amount), 0)} monthly and ${formatCurrency(annualSalaryToHourly(amount))}/hour.`,
    alternates: {
      canonical: `${SITE_URL}/salary/${amount}/biweekly`,
    },
  };
}

export default async function SalaryToBiweeklyPage({ params }: PageProps) {
  const { amount: rawAmount } = await params;
  const amount = clampSalaryForSeo(toNumber(rawAmount));

  const biweekly = annualSalaryToBiweekly(amount);
  const monthly = annualSalaryToMonthly(amount);
  const hourly = annualSalaryToHourly(amount);

  const salaryLabel = formatCurrency(amount, 0);
  const biweeklyLabel = formatCurrency(biweekly);
  const monthlyLabel = formatCurrency(monthly);
  const hourlyLabel = formatCurrency(hourly);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Salary",
        item: `${SITE_URL}/salary/${amount}/biweekly`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Salary to Biweekly",
        item: `${SITE_URL}/salary/${amount}/biweekly`,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `${salaryLabel} a year is how much biweekly?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${salaryLabel} per year is about ${biweeklyLabel} every two weeks before taxes.`,
        },
      },
      {
        "@type": "Question",
        name: `What is ${salaryLabel} per year monthly?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${salaryLabel} per year is about ${monthlyLabel} per month.`,
        },
      },
      {
        "@type": "Question",
        name: `What is ${salaryLabel} a year per hour?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${salaryLabel} per year is about ${hourlyLabel} per hour based on a 40-hour work week and 52 weeks per year.`,
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />

      <SiteShell>
        <main className="shell">
          <div className="mb-8 text-sm text-neutral-400">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span>Salary to Biweekly</span>
          </div>

          <SalaryPageHero
            title={`${salaryLabel} a Year is How Much Every 2 Weeks?`}
            description={
              <>
                A salary of <strong>{salaryLabel}</strong> per year works out
                to about <strong>{biweeklyLabel} every two weeks</strong> before
                taxes.
              </>
            }
          />

          <section className="gap-sections grid gap-4 md:grid-cols-3">
            <div className="result-card">
              <p className="text-sm text-neutral-300">Biweekly pay</p>
              <p className="mt-2 text-4xl font-semibold md:text-5xl">
                {biweeklyLabel}
              </p>
            </div>

            <div className="metric-card">
              <p className="text-sm text-neutral-400">Monthly pay</p>
              <p className="mt-2 text-3xl font-semibold">{monthlyLabel}</p>
            </div>

            <div className="metric-card">
              <p className="text-sm text-neutral-400">Hourly pay</p>
              <p className="mt-2 text-3xl font-semibold">{hourlyLabel}</p>
            </div>
          </section>

          <section className="gap-sections grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
            <div className="section-card">
              <h2 className="text-2xl font-semibold">Salary to biweekly breakdown</h2>

              <div className="table-wrap">
                <div className="table-head">
                  <div className="table-head-cell">Conversion</div>
                  <div className="table-head-cell">Amount</div>
                </div>

                <div className="table-row">
                  <div className="table-cell-label">{salaryLabel} per year</div>
                  <div className="table-cell-value">{biweeklyLabel} every 2 weeks</div>
                </div>

                <div className="table-row">
                  <div className="table-cell-label">Per month</div>
                  <div className="table-cell-value">{monthlyLabel}</div>
                </div>

                <div className="table-row">
                  <div className="table-cell-label">Per hour</div>
                  <div className="table-cell-value">{hourlyLabel}</div>
                </div>
              </div>
            </div>

            <div className="section-card">
              <ValueLinks amount={amount} />
            </div>
          </section>
        </main>
      </SiteShell>
    </>
  );
}
