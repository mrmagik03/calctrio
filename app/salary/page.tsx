import type { Metadata } from "next";
import JsonLd from "@/app/components/JsonLd";
import SalaryCalculatorClient from "@/app/salary/SalaryCalculatorClient";

const SITE_URL = "https://calctrio.com";

export const metadata: Metadata = {
  title: "Salary Calculator for Take-Home Pay, Monthly Pay & City Comparisons",
  description:
    "Estimate take-home pay, convert salary into monthly and hourly views, and compare the same income across states and cities.",
  alternates: {
    canonical: `${SITE_URL}/salary`,
  },
};

export default function SalaryPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Calctrio Salary Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    url: `${SITE_URL}/salary`,
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I compare the same salary in different places?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Start with your salary, then move into a state or city page to see how taxes and local living costs can change what that paycheck feels like.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does this salary calculator show hourly pay too?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Each salary view includes monthly, biweekly, weekly, and hourly equivalents so you can compare different pay frequencies quickly.',
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={schema} />
      <JsonLd data={faqSchema} />
      <SalaryCalculatorClient />
    </>
  );
}
