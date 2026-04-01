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
      name: "What makes an RV loan calculator useful?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An RV loan calculator helps estimate the monthly payment before campground fees, insurance, maintenance, and travel costs shape the true budget.",
      },
    },
    {
      "@type": "Question",
      name: "Does this include insurance, campground fees, or maintenance?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Results show principal and interest only. Insurance, campground fees, maintenance, and travel expenses are not included.",
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

export default function RvLoanPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <VehicleLoanCalculatorClient category={category} />
    </>
  );
}
