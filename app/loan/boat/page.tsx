import type { Metadata } from "next";
import VehicleLoanCalculatorClient from "../VehicleLoanCalculatorClient";
import { loanCategories } from "../loan-data";

const category = loanCategories.boat;
const pageUrl = `https://calctrio.com/loan/${category.slug}`;

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why use a boat loan calculator before shopping seriously?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A boat loan calculator helps estimate the monthly payment before trailer costs, insurance, fuel, and marina expenses start stacking on top.",
      },
    },
    {
      "@type": "Question",
      name: "Does this include storage, insurance, or marina fees?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Results show principal and interest only. Storage, marina fees, maintenance, fuel, and insurance are not included.",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "Boat Loan Calculator: Monthly Payment, Total Paid & Interest",
  description: category.detailText,
  alternates: { canonical: `/loan/${category.slug}` },
  openGraph: {
    title: "Boat Loan Calculator: Monthly Payment, Total Paid & Interest",
    description: category.detailText,
    url: pageUrl,
    siteName: "CalcTrio",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Boat Loan Calculator: Monthly Payment, Total Paid & Interest",
    description: category.detailText,
  },
};

function getInitialAmount(value: string | string[] | undefined, fallback: number) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default async function BoatLoanPage({
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