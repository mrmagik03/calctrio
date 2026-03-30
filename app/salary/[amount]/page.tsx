import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const siteUrl = "https://www.calctrio.com";

// --- HELPERS (Same as your logic) ---
const salaryExamples: number[] = [];
for (let i = 25000; i <= 100000; i += 2500) salaryExamples.push(i);
for (let i = 105000; i <= 200000; i += 5000) salaryExamples.push(i);
for (let i = 210000; i <= 300000; i += 10000) salaryExamples.push(i);

function isValidSalaryAmount(value: string) { return /^\d+$/.test(value); }
function formatCurrency(num: number, decimals = 2) {
  return num.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
function formatWholeCurrency(num: number) {
  return num.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function getSalaryData(amountParam: string) {
  if (!isValidSalaryAmount(amountParam)) return null;
  const annual = Number(amountParam);
  if (!Number.isFinite(annual) || annual < 1000 || annual > 10000000) return null;
  return { annual, monthly: annual / 12, biweekly: annual / 26, weekly: annual / 52, hourly: annual / 2080, daily: annual / 260 };
}

// --- NEXT.JS SEO FUNCTIONS ---

export function generateStaticParams() {
  return salaryExamples.map((amount) => ({ amount: amount.toString() }));
}

export async function generateMetadata({ params }: { params: Promise<{ amount: string }> }): Promise<Metadata> {
  const { amount } = await params;
  const salaryData = getSalaryData(amount);
  if (!salaryData) return { title: "Salary Calculator | CalcTrio" };

  const annualText = formatWholeCurrency(salaryData.annual);
  const monthlyText = formatCurrency(salaryData.monthly);

  return {
    title: `${annualText} Salary is How Much a Month? | CalcTrio`,
    description: `${annualText} a year is about ${monthlyText} per month before taxes. See full breakdown at CalcTrio.`,
    alternates: { canonical: `/salary/${salaryData.annual}` },
  };
}

export default async function SalaryAmountPage({ params }: { params: Promise<{ amount: string }> }) {
  const { amount } = await params;
  const salaryData = getSalaryData(amount);
  if (!salaryData) notFound();

  const annualText = formatWholeCurrency(salaryData.annual);
  const monthlyText = formatCurrency(salaryData.monthly);
  
  // SEO Trick: Find 6 nearby salaries to link to for better crawling
  const nearbySalaries = salaryExamples
    .filter(v => v !== salaryData.annual)
    .sort((a, b) => Math.abs(salaryData.annual - a) - Math.abs(salaryData.annual - b))
    .slice(0, 6);

  // --- SCHEMA (FAQ, WebApp, Breadcrumb) ---
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity":
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      
      <main className="min-h-screen bg-[#111111] text-[#f7f3eb]">
        {/* Simple Header */}
        <header className="border-b border-[#201c18] p-5">
           <div className="mx-auto max-w-6xl flex justify-between items-center">
             <Link href="/" className="text-xl font-bold">CalcTrio</Link>
             <nav className="flex gap-4 text-sm text-[#b29f7a]">
               <Link href="/salary">Salary</Link>
               <Link href="/payment">Payment</Link>
               <Link href="/savings">Savings</Link>
             </nav>
           </div>
        </header>

        <div className="mx-auto max-w-3xl px-6 py-12">
          <h1 className="text-4xl font-bold mb-6">{annualText} Annual Salary</h1>
          
          <div className="grid gap-4 border border-[#2a2a2a] bg-[#171717] p-8 rounded-2xl">
            <div className="flex justify-between border-b border-[#2a2a2a] pb-2">
              <span>Monthly</span><span className="font-mono text-[#d8b07a]">{monthlyText}</span>
            </div>
            <div className="flex justify-between border-b border-[#2a2a2a] pb-2">
              <span>Bi-Weekly</span><span className="font-mono text-[#d8b07a]">{formatCurrency(salaryData.biweekly)}</span>
            </div>
            <div className="flex justify-between">
              <span>Hourly</span><span className="font-mono text-[#d8b07a]">{formatCurrency(salaryData.hourly)}</span>
            </div>
          </div>

          {/* INTERNAL LINKING BLOCK (Crucial for SEO) */}
          <div className="mt-12">
            <h2 className="text-sm uppercase tracking-widest text-[#a89a7a] mb-4">Related Salary Breakdowns</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {nearbySalaries.map(s => (
                <Link key={s} href={`/salary/${s}`} className="text-sm p-3 border border-[#2a2a2a] rounded-lg hover:border-[#a89a7a] transition-colors text-center">
                  {formatWholeCurrency(s)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
