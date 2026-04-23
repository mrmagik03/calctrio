export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SalaryPageHero from "@/components/SalaryPageHero";
import SiteShell from "@/components/SiteShell";
import { PAGE_IDENTITY_LABELS, getPageTheme } from "@/lib/pageThemes";
import { clampSalaryForSeo, formatCurrency, toNumber } from "@/lib/pay";
import { STATES } from "@/lib/states";

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
    title: `${formatCurrency(amount, 0)} Salary After Tax by State – Compare Take-Home Pay`,
    description: `Compare ${formatCurrency(
      amount,
      0
    )} salary after tax across states and see where monthly take-home pay lands fastest.`,
    robots: { index: false, follow: true },
    alternates: {
      canonical: `${SITE_URL}/salary/${amount}/after-tax`,
    },
  };
}

export default async function AfterTaxHubPage({ params }: PageProps) {
  const { amount: rawAmount } = await params;
  const amount = clampSalaryForSeo(toNumber(rawAmount));
  const salaryLabel = formatCurrency(amount, 0);

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
        name: "After Tax",
        item: `${SITE_URL}/salary/${amount}/after-tax`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />

      <SiteShell>
        <main className="shell">
          <div className="mb-8 text-sm text-neutral-400">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span>After Tax</span>
          </div>

          <SalaryPageHero
            title={`${salaryLabel} Salary After Tax by State`}
            description={
              <>
                Compare estimated take-home pay for <strong>{salaryLabel}</strong>{" "}
                across states.
              </>
            }
          />

          <section className="gap-sections section-card">
            <h2 className="text-2xl font-semibold">Choose a state</h2>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {STATES.map((state) => (
                <Link
                  key={state.slug}
                  href={`/salary/${amount}/after-tax/${state.slug}`}
                  className="tile-link"
                >
                  {state.name}
                </Link>
              ))}
            </div>
          </section>
        </main>
      </SiteShell>
    </>
  );
}
