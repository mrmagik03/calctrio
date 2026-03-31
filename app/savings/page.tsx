import type { Metadata } from "next";
import SavingsCalculatorClient from "./SavingsCalculatorClient";

const siteUrl = "https://calctrio.com";
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
        text: "This calculator uses your savings goal, timeline, and estimated annual return to calculate the monthly amount needed to reach your target.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if the return is 0%?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "With a 0% return, the calculator divides your savings goal evenly across the total number of months with no growth included.",
      },
    },
    {
      "@type": "Question",
      name: "Is the return guaranteed?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The annual return is only an estimate for planning purposes. Actual savings or investment growth may be higher or lower.",
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
    "Use CalcTrio's savings calculator to estimate monthly savings needed, total contributions, and interest earned toward your goal.",
};

export const metadata: Metadata = {
  title: "Savings Calculator: Monthly Goal, Contributions & Interest",
  description:
    "Use CalcTrio's savings calculator to estimate monthly savings needed, total contributions, and interest earned toward your goal.",
  alternates: {
    canonical: "/savings",
  },
  openGraph: {
    title: "Savings Calculator: Monthly Goal, Contributions & Interest",
    description:
      "Use CalcTrio's savings calculator to estimate monthly savings needed, total contributions, and interest earned toward your goal.",
    url: pageUrl,
    siteName: "CalcTrio",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Savings Calculator: Monthly Goal, Contributions & Interest",
    description:
      "Use CalcTrio's savings calculator to estimate monthly savings needed, total contributions, and interest earned toward your goal.",
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