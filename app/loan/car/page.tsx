import type { Metadata } from "next";
import VehicleLoanCalculatorClient from "../VehicleLoanCalculatorClient";
import { loanCategories } from "../loan-data";

const category = loanCategories.car;
const pageUrl = `https://calctrio.com/loan/${category.slug}`;

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How can a car loan calculator help before shopping?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A car loan calculator helps estimate the monthly payment, total paid, and total interest before you compare models, down payments, or dealership offers.",
      },
    },
    {
      "@type": "Question",
      name: "Does this include taxes, registration, or dealer fees?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Results show principal and interest only. Sales tax, registration, documentation fees, and insurance are not included.",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "Car Loan Calculator: Monthly Payment, Total Paid & Interest",
  description: category.detailText,
  alternates: { canonical: `/loan/${category.slug}` },
  openGraph: {
    title: "Car Loan Calculator: Monthly Payment, Total Paid & Interest",
    description: category.detailText,
    url: pageUrl,
    siteName: "CalcTrio",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Car Loan Calculator: Monthly Payment, Total Paid & Interest",
    description: category.detailText,
  },
};

export default function CarLoanPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <VehicleLoanCalculatorClient category={category} />
    </>
  );
}
