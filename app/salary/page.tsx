import type { Metadata } from "next";
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
        text: "This calculator divides annual salary by 12 to estimate monthly pay before taxes and deductions.",
      },
    },
    {
      "@type": "Question",
      name: "Can I compare salary by state and city?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. CalcTrio lets you move from the main salary calculator into state overviews, city overviews, and salary-specific location pages without re-entering your salary.",
      },
    },
    {
      "@type": "Question",
      name: "Does the salary calculator include taxes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The main salary calculator shows gross pay conversions. Location pages also provide estimated after-tax take-home pay and deduction breakdowns.",
      },
    },
  ],
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CalcTrio Salary Calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  url: pageUrl,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "Salary to monthly conversion",
    "Salary to biweekly conversion",
    "State and city salary comparison",
    "Estimated after-tax take-home pay",
  ],
};

export const metadata: Metadata = {
  title: "Salary Calculator: Monthly, Biweekly, Weekly & Hourly Pay",
  description:
    "Convert annual salary into monthly, biweekly, weekly, hourly, and daily pay, then explore take-home estimates by state and city.",
  alternates: { canonical: "/salary" },
  openGraph: {
    title: "Salary Calculator: Monthly, Biweekly, Weekly & Hourly Pay",
    description:
      "Convert annual salary into monthly, biweekly, weekly, hourly, and daily pay, then explore take-home estimates by state and city.",
    url: pageUrl,
    siteName: "CalcTrio",
    type: "website",
  },
};

export default function SalaryPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <SalaryCalculatorClient />
    </>
  );
}
