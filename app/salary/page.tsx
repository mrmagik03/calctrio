import type { Metadata } from "next";
import SalaryCalculatorClient from "./SalaryCalculatorClient";

const siteUrl = "https://calctrio.co";
const pageUrl = `${siteUrl}/salary`;

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How is monthly salary calculated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This calculator divides your annual salary by 12 to estimate monthly pay before taxes and deductions.",
      },
    },
    {
      "@type": "Question",
      name: "What does biweekly pay mean?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Biweekly pay assumes 26 pay periods per year, which is common for many full-time jobs in the United States.",
      },
    },
    {
      "@type": "Question",
      name: "Is this before or after taxes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "These results are gross pay estimates. Federal, state, local, and benefit deductions are not included.",
      },
    },
  ],
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CalcTrio Salary Calculator",
  url: pageUrl,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  description:
    "Convert annual salary into monthly, biweekly, weekly, hourly, and daily pay with CalcTrio's clean salary calculator.",
};

export const metadata: Metadata = {
  title: "Salary Calculator | Monthly, Biweekly, Weekly & Hourly Pay",
  description:
    "Convert annual salary into monthly, biweekly, weekly, and hourly pay with CalcTrio's clean salary calculator.",
  alternates: {
    canonical: "/salary",
  },
  openGraph: {
    title: "Salary Calculator | Monthly, Biweekly, Weekly & Hourly Pay",
    description:
      "Convert annual salary into monthly, biweekly, weekly, and hourly pay with CalcTrio's clean salary calculator.",
    url: pageUrl,
    siteName: "CalcTrio",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Salary Calculator | Monthly, Biweekly, Weekly & Hourly Pay",
    description:
      "Convert annual salary into monthly, biweekly, weekly, and hourly pay with CalcTrio's clean salary calculator.",
  },
};

export default function SalaryPage() {
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
      <SalaryCalculatorClient />
    </>
  );
}