import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SalaryPageHero from "@/components/SalaryPageHero";
import SiteShell from "@/components/SiteShell";
import LinkCard from "@/components/LinkCard";
import { PAGE_IDENTITY_LABELS, getPageTheme } from "@/lib/pageThemes";
import {
  annualSalaryToBiweekly,
  annualSalaryToMonthly,
  clampHourlyForSeo,
  formatCurrency,
  hourlyToAnnualSalary,
  toNumber,
} from "@/lib/pay";

const SITE_URL = "https://calctrio.com";

type PageProps = { params: Promise<{ rate: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { rate: rawRate } = await params;
  const rate = clampHourlyForSeo(toNumber(rawRate));
  return {
    title: `${formatCurrency(rate)} an Hour to Salary`,
    description: `Convert ${formatCurrency(rate)} an hour to yearly salary, monthly pay, and biweekly pay.`,
    alternates: { canonical: `${SITE_URL}/hourly/${rate}/to-salary` },
  };
}

export default async function HourlyToSalaryPage({ params }: PageProps) {
  const { rate: rawRate } = await params;
  const rate = clampHourlyForSeo(toNumber(rawRate));
  const annual = hourlyToAnnualSalary(rate);
  const monthly = annualSalaryToMonthly(annual);
  const biweekly = annualSalaryToBiweekly(annual);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How much is ${formatCurrency(rate)} an hour per year?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${formatCurrency(rate)} an hour is about ${formatCurrency(annual, 0)} per year based on a 40-hour work week.`,
        },
      },
    ],
  };

  return (
    <SiteShell theme={getPageTheme("hourly-salary")}>
      <JsonLd data={faqJsonLd} />
      <main className="shell">
        <div className="mb-8 text-sm text-neutral-400">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span>Hourly to Salary</span>
        </div>

        <SalaryPageHero
          title={`${formatCurrency(rate)} an Hour is How Much a Year?`}
          description={
            <>
              At <strong>{formatCurrency(rate)}</strong> an hour, you would make about{" "}
              <strong>{formatCurrency(annual, 0)}</strong> per year before taxes
              based on a full-time schedule.
            </>
          }
        />

        <section className="gap-sections grid gap-4 md:grid-cols-3">
          <div className="result-card">
            <p className="text-sm text-neutral-300">Annual salary</p>
            <p className="mt-2 text-4xl font-semibold md:text-5xl">
              {formatCurrency(annual, 0)}
            </p>
          </div>
          <div className="metric-card">
            <p className="text-sm text-neutral-400">Monthly pay</p>
            <p className="mt-2 text-3xl font-semibold">{formatCurrency(monthly)}</p>
          </div>
          <div className="metric-card">
            <p className="text-sm text-neutral-400">Biweekly pay</p>
            <p className="mt-2 text-3xl font-semibold">{formatCurrency(biweekly)}</p>
          </div>
        </section>

        <section className="gap-sections section-card">
          <h2 className="text-2xl font-semibold">Related conversions</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {[15, 20, 25, 30].map((item) => (
              <LinkCard key={item} href={`/hourly/${item}/to-salary`}>
                {formatCurrency(item)} an hour
              </LinkCard>
            ))}
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
