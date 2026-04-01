import type { Metadata } from "next";
import VehicleLoanCalculatorClient from "../VehicleLoanCalculatorClient";
import { loanCategories } from "../loan-data";

const category = loanCategories.rv;
const pageUrl = `https://calctrio.com/loan/${category.slug}`;

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why use an RV loan calculator before shopping seriously?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An RV loan calculator helps you estimate the monthly payment before campground fees, insurance, upgrades, and towing or setup costs get layered in.",
      },
    },
    {
      "@type": "Question",
      name: "Does this include insurance, taxes, or campground costs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Results show principal and interest only. Insurance, taxes, campground fees, setup costs, and maintenance are not included.",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "RV Loan Calculator: Monthly Payment, Total Paid & Interest",
  description: category.detailText,
  alternates: { canonical: `/loan/${category.slug}` },
  openGraph: {
    title: "RV Loan Calculator: Monthly Payment, Total Paid & Interest",
    description: category.detailText,
    url: pageUrl,
    siteName: "CalcTrio",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "RV Loan Calculator: Monthly Payment, Total Paid & Interest",
    description: category.detailText,
  },
};

function getInitialAmount(value: string | string[] | undefined, fallback: number) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default async function RVLoanPage({
  searchParams,
}: {
  searchParams?: Promise<{ amount?: string | string[] }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const initialAmount = getInitialAmount(params?.amount, category.quickExamples[2]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <VehicleLoanCalculatorClient category={category} initialAmount={initialAmount} />
    </>
  );
}