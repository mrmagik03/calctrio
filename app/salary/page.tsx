import type { Metadata } from "next";
import JsonLd from "@/app/components/JsonLd";
import SalaryCalculatorClient from "@/app/salary/SalaryCalculatorClient";

const SITE_URL = "https://calctrio.com";

export const metadata: Metadata = {
  title: "Salary Calculator: Take-Home Pay After Taxes + City Cost Comparison",
  description:
    "Enter your salary once. See exact take-home pay after taxes, then instantly compare the same income in any US city. Part of CalcTrio — Income → Location → Lifestyle.",
  alternates: {
    canonical: `${SITE_URL}/salary`,
  },
};

export default function SalaryPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'CalcTrio Salary Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    url: `${SITE_URL}/salary`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does the salary calculator work with city comparisons?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Enter your annual salary once. We show your exact take-home pay, then let you click into any state or city to see how far that same paycheck actually goes after local taxes and cost of living.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does this calculator show take-home pay after taxes?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. It breaks down gross pay into monthly, biweekly, weekly, daily, and hourly amounts, then shows estimated take-home pay after federal and state taxes.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I compare my salary between cities like Houston vs Austin vs New York?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely. After you run your salary, you can jump straight into any metro area page to see the real purchasing power difference.',
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