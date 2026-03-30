import type { Metadata } from "next";
import SavingsCalculatorClient from "./SavingsCalculatorClient";

const siteUrl = "https://calctrio.co";
const pageUrl = `${siteUrl}/savings`;

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How is monthly savings calculated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This calculator uses your goal, time frame, and annual return estimate to work backward into a monthly savings target.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if the return is 0%?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The math becomes simple monthly saving with no growth. Your goal is divided evenly across the full number of months.",
      },
    },
    {
      "@type": "Question",
      name: "Is the return guaranteed?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The annual return field is only an estimate used for planning. Real savings and investment results can vary.",
      },
    },
  ],
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CalcTrio Savings Calculator",
  url: pageUrl,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  description:
    "Calculate monthly savings needed, total contributions, and estimated interest earned with CalcTrio's clean savings calculator.",
};

export const metadata: Metadata = {
  title: "Savings Calculator | Monthly Savings Goal & Interest Estimate",
  description:
    "Calculate monthly savings needed, total contributions, and estimated interest earned with CalcTrio's clean savings calculator.",
  alternates: {
    canonical: "/savings",
  },
  openGraph: {
    title: "Savings Calculator | Monthly Savings Goal & Interest Estimate",
    description:
      "Calculate monthly savings needed, total contributions, and estimated interest earned with CalcTrio's clean savings calculator.",
    url: pageUrl,
    siteName: "CalcTrio",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Savings Calculator | Monthly Savings Goal & Interest Estimate",
    description:
      "Calculate monthly savings needed, total contributions, and estimated interest earned with CalcTrio's clean savings calculator.",
  },
};

export default function SavingsPage() {
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
      <SavingsCalculatorClient />
    </>
  );
}