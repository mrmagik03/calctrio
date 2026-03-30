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
  if (!Number.isFinite(annual) || annual < 1000 || annual > 10000000) return null;

  return {
    annual,
    monthly: annual / 12,
    biweekly: annual / 26,
    weekly: annual / 52,
    hourly: annual / 2080,
    daily: annual / 260,
  };
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
    return { title: "Salary Calculator | CalcTrio" };
  }

  const annualText = formatWholeCurrency(salaryData.annual);
  return {
    title: `${annualText} Salary is How Much a Month? | CalcTrio`,
    description: `${annualText} a year is about ${formatCurrency(salaryData.monthly)} per month.`,
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
  const hourlyText = formatCurrency(salaryData.hourly);

  return (
    <main className="min-h-screen bg-[#111111] text-[#f7f3eb]">
      <header className="border-b border-[#201c18] bg-[#0f0f0f]/95">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-lg font-semibold text-[#f7f3eb]">CalcTrio</Link>
          <nav className="flex gap-5 text-sm text-[#b29f7a]">
            <Link href="/">Home</Link>
            <Link href="/payment">Payment</Link>
            <Link href="/savings">Savings</Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">{annualText} Salary Breakdown</h1>
        <div className="grid gap-4 rounded-xl border border-[#2a2a2a] bg-[#171717] p-8">
          <div className="flex justify-between border-b border-[#2a2a2a] pb-4">
            <span>Monthly</span><span className="font-mono text-[#d8b07a]">{monthlyText}</span>
          </div>
          <div className="flex justify-between border-b border-[#2a2a2a] pb-4">
            <span>Bi-Weekly</span><span className="font-mono text-[#d8b07a]">{biweeklyText}</span>
          </div>
          <div className="flex justify-between">
            <span>Hourly</span><span className="font-mono text-[#d8b07a]">{hourlyText}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
