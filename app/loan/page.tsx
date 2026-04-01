import type { Metadata } from "next";
import LoanCalculatorClient from "./LoanCalculatorClient";

const siteUrl = "https://calctrio.com";
const pageUrl = `${siteUrl}/loan`;

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How is monthly loan payment calculated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This calculator uses your loan amount, interest rate, and loan term to estimate a fixed monthly payment.",
      },
    },
    {
      "@type": "Question",
      name: "Should I use the general loan calculator or a vehicle category page?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use the general loan calculator for broad estimates, and use the car, boat, or RV pages when you want examples and navigation tailored to that type of purchase.",
      },
    },
    {
      "@type": "Question",
      name: "Does this include taxes, insurance, registration, or fees?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Results show principal and interest only. Taxes, insurance, registration, dealer fees, marina costs, campground fees, and similar costs are not included.",
      },
    },
  ],
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CalcTrio Loan Calculator",
  url: pageUrl,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  description:
    "Estimate monthly loan payment, total paid, and total interest with CalcTrio's loan calculator, including car, boat, and RV branches.",
};

export const metadata: Metadata = {
  title: "Loan Calculator: Monthly Payment, Total Paid & Interest",
  description:
    "Estimate monthly loan payment, total paid, and total interest with CalcTrio's loan calculator, then branch into car, boat, or RV examples.",
  alternates: {
    canonical: "/loan",
  },
  openGraph: {
    title: "Loan Calculator: Monthly Payment, Total Paid & Interest",
    description:
      "Estimate monthly loan payment, total paid, and total interest with CalcTrio's loan calculator, then branch into car, boat, or RV examples.",
    url: pageUrl,
    siteName: "CalcTrio",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Loan Calculator: Monthly Payment, Total Paid & Interest",
    description:
      "Estimate monthly loan payment, total paid, and total interest with CalcTrio's loan calculator, then branch into car, boat, or RV examples.",
  },
};

export default function LoanPage() {
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
      <LoanCalculatorClient />
    </>
  );
}
