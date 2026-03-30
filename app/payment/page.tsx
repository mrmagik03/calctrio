import type { Metadata } from "next";
import PaymentCalculatorClient from "./PaymentCalculatorClient";

const siteUrl = "https://calctrio.co";
const pageUrl = `${siteUrl}/payment`;

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How is monthly payment calculated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This calculator uses your loan amount, interest rate, and loan term to estimate a fixed monthly payment over the full payoff period.",
      },
    },
    {
      "@type": "Question",
      name: "Does this include taxes or insurance?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The result includes principal and interest only. Property taxes, homeowners insurance, HOA fees, and similar costs are not included.",
      },
    },
    {
      "@type": "Question",
      name: "Why does total paid exceed the loan amount?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Total paid includes both the original loan amount and the total interest charged over the life of the loan.",
      },
    },
  ],
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CalcTrio Payment Calculator",
  url: pageUrl,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  description:
    "Calculate monthly payment, total paid, and total interest for a loan or mortgage with a clean payment calculator.",
};

export const metadata: Metadata = {
  title: "Payment Calculator | Monthly Loan Payment, Total Paid & Interest",
  description:
    "Calculate your monthly payment, total paid, and total interest with CalcTrio's clean loan and mortgage payment calculator.",
  alternates: {
    canonical: "/payment",
  },
  openGraph: {
    title: "Payment Calculator | Monthly Loan Payment, Total Paid & Interest",
    description:
      "Calculate your monthly payment, total paid, and total interest with CalcTrio's clean loan and mortgage payment calculator.",
    url: pageUrl,
    siteName: "CalcTrio",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Payment Calculator | Monthly Loan Payment, Total Paid & Interest",
    description:
      "Calculate your monthly payment, total paid, and total interest with CalcTrio's clean loan and mortgage payment calculator.",
  },
};

export default function PaymentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webAppSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <PaymentCalculatorClient />
    </>
  );
}