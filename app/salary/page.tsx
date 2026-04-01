import type { Metadata } from "next";
import Link from "next/link";
import SalaryCalculatorClient from "./SalaryCalculatorClient";

const siteUrl = "https://calctrio.com";
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
        text: "Biweekly pay assumes 26 pay periods per year, which is common for many full-time jobs.",
      },
    },
    {
      "@type": "Question",
      name: "Is this before or after taxes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "These results are gross pay estimates only. Taxes, benefits, and other payroll deductions are not included.",
      },
    },
    {
      "@type": "Question",
      name: "Can I compare salary after tax by state and city?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. CalcTrio includes salary after-tax pages by state and major city so you can compare take-home pay by location.",
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
    "Convert annual salary into monthly, biweekly, weekly, hourly, and daily pay with CalcTrio's salary calculator.",
};

export const metadata: Metadata = {
  title: "Salary Calculator: Monthly, Biweekly, Weekly & Hourly Pay",
  description:
    "Convert annual salary into monthly, biweekly, weekly, hourly, and daily pay with CalcTrio's salary calculator.",
  alternates: {
    canonical: "/salary",
  },
  openGraph: {
    title: "Salary Calculator: Monthly, Biweekly, Weekly & Hourly Pay",
    description:
      "Convert annual salary into monthly, biweekly, weekly, hourly, and daily pay with CalcTrio's salary calculator.",
    url: pageUrl,
    siteName: "CalcTrio",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Salary Calculator: Monthly, Biweekly, Weekly & Hourly Pay",
    description:
      "Convert annual salary into monthly, biweekly, weekly, hourly, and daily pay with CalcTrio's salary calculator.",
  },
};

const STATES = [
  "texas",
  "california",
  "florida",
  "new-york",
  "illinois",
  "georgia",
  "north-carolina",
  "ohio",
  "pennsylvania",
  "michigan",
  "washington",
  "virginia",
];

const CITIES = [
  { state: "texas", city: "austin", name: "Austin, TX" },
  { state: "texas", city: "houston", name: "Houston, TX" },
  { state: "texas", city: "dallas", name: "Dallas, TX" },
  { state: "california", city: "los-angeles", name: "Los Angeles, CA" },
  { state: "california", city: "san-diego", name: "San Diego, CA" },
  { state: "new-york", city: "new-york-city", name: "New York City, NY" },
  { state: "florida", city: "miami", name: "Miami, FL" },
  { state: "washington", city: "seattle", name: "Seattle, WA" },
];

function formatState(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

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