import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const siteUrl = "https://calctrio.com";

const salaryExamples: number[] = [];
for (let i = 25000; i <= 100000; i += 2500) salaryExamples.push(i);
for (let i = 105000; i <= 200000; i += 5000) salaryExamples.push(i);
for (let i = 210000; i <= 300000; i += 10000) salaryExamples.push(i);

function isValidSalaryAmount(value: string) {
  return /^\d+$/.test(value);
}

function formatCurrency(num: number, decimals = 2) {
  return num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatWholeCurrency(num: number) {
  return num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function getSalaryData(amountParam: string) {
  if (!isValidSalaryAmount(amountParam)) return null;
  const annual = Number(amountParam);

  if (!Number.isFinite(annual) || annual < 1000 || annual > 10000000) {
    return null;
  }

  return {
    annual,
    monthly: annual / 12,
    biweekly: annual / 26,
    weekly: annual / 52,
    hourly: annual / 2080,
    daily: annual / 260,
  };
}

function getNearbySalaryLinks(currentAmount: number) {
  const currentIndex = salaryExamples.indexOf(currentAmount);

  if (currentIndex === -1) {
    return salaryExamples.slice(0, 4);
  }

  const start = Math.max(0, currentIndex - 2);
  const end = Math.min(salaryExamples.length, currentIndex + 3);
  return salaryExamples.slice(start, end).filter((amount) => amount !== currentAmount);
}

export function generateStaticParams() {
  return salaryExamples.map((amount) => ({
    amount: amount.toString(),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ amount: string }>;
}): Promise<Metadata> {
  const { amount } = await params;
  const salaryData = getSalaryData(amount);

  if (!salaryData) {
    return {
      title: "Salary Calculator",
      description:
        "Use CalcTrio's salary calculator to convert annual pay into monthly, biweekly, weekly, daily, and hourly amounts.",
      alternates: {
        canonical: "/salary",
      },
    };
  }

  const annualText = formatWholeCurrency(salaryData.annual);
  const monthlyText = formatCurrency(salaryData.monthly);
  const biweeklyText = formatCurrency(salaryData.biweekly);
  const hourlyText = formatCurrency(salaryData.hourly);
  const pageUrl = `${siteUrl}/salary/${amount}`;

  const title = `${annualText} Salary to Monthly Pay Calculator`;
  const description = `${annualText} a year is about ${monthlyText} per month, ${biweeklyText} biweekly, and ${hourlyText} per hour. Use CalcTrio's free salary calculator.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/salary/${amount}`,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "CalcTrio",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function SalaryAmountPage({
  params,
}: {
  params: Promise<{ amount: string }>;
}) {
  const { amount } = await params;
  const salaryData = getSalaryData(amount);

  if (!salaryData) {
    notFound();
  }

  const annualText = formatWholeCurrency(salaryData.annual);
  const monthlyText = formatCurrency(salaryData.monthly);
  const biweeklyText = formatCurrency(salaryData.biweekly);
  const weeklyText = formatCurrency(salaryData.weekly);
  const hourlyText = formatCurrency(salaryData.hourly);
  const dailyText = formatCurrency(salaryData.daily);
  const nearbySalaryLinks = getNearbySalaryLinks(salaryData.annual);

  return (
    <main className="min-h-screen bg-[#111111] text-[#f7f3eb]">
      <header className="border-b border-[#201c18] bg-[#0f0f0f]/95">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-lg font-semibold tracking-[0.01em] text-[#f7f3eb] transition-colors duration-200 hover:text-[#d8b07a]"
          >
            CalcTrio
          </Link>

          <nav className="flex items-center gap-5 text-sm text-[#b29f7a]">
            <Link
              href="/"
              className="transition-colors duration-200 hover:text-[#f7f3eb]"
            >
              Home
            </Link>
            <Link
              href="/salary"
              className="transition-colors duration-200 hover:text-[#f7f3eb]"
            >
              Salary Calculator
            </Link>
            <Link
              href="/payment"
              className="transition-colors duration-200 hover:text-[#f7f3eb]"
            >
              Payment
            </Link>
            <Link
              href="/savings"
              className="transition-colors duration-200 hover:text-[#f7f3eb]"
            >
              Savings
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="mb-6">
          <Link
            href="/salary"
            className="inline-flex items-center border border-[#2f2a22] bg-[#1f1b16] px-4 py-2 text-sm font-medium text-[#f7f3eb] transition-colors duration-200 hover:border-[#b29f7a] hover:bg-[#262119]"
          >
            ← Back to Salary Calculator
          </Link>
        </div>

        <section className="rounded-xl border border-[#2a2a2a] bg-[#171717] p-8">
          <h1 className="mb-3 text-3xl font-bold">{annualText} Salary Breakdown</h1>

          <p className="mb-8 max-w-2xl text-[#c8c2b5]">
            See how much {annualText} per year works out to per month, biweekly,
            weekly, daily, and hourly.
          </p>

          <div className="grid gap-4">
            <div className="flex justify-between border-b border-[#2a2a2a] pb-4">
              <span>Monthly</span>
              <span className="font-mono text-[#d8b07a]">{monthlyText}</span>
            </div>

            <div className="flex justify-between border-b border-[#2a2a2a] pb-4">
              <span>Bi-Weekly</span>
              <span className="font-mono text-[#d8b07a]">{biweeklyText}</span>
            </div>

            <div className="flex justify-between border-b border-[#2a2a2a] pb-4">
              <span>Weekly</span>
              <span className="font-mono text-[#d8b07a]">{weeklyText}</span>
            </div>

            <div className="flex justify-between border-b border-[#2a2a2a] pb-4">
              <span>Daily</span>
              <span className="font-mono text-[#d8b07a]">{dailyText}</span>
            </div>

            <div className="flex justify-between">
              <span>Hourly</span>
              <span className="font-mono text-[#d8b07a]">{hourlyText}</span>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-[#2a2a2a] bg-[#171717] p-8">
          <div className="mb-5">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">
              Try another salary
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
              Nearby salary examples
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {nearbySalaryLinks.map((exampleAmount) => (
              <Link
                key={exampleAmount}
                href={`/salary/${exampleAmount}`}
                className="border border-[#2f2a22] bg-[#141414] px-4 py-3 text-center text-sm font-medium text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]"
              >
                {formatWholeCurrency(exampleAmount)}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}