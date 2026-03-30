import Link from "next/link";
import { Metadata } from "next";

// 1. Explicit Metadata for the Homepage
export const metadata: Metadata = {
  title: "Free Online Financial & Salary Calculators", // Overrides the default in layout.tsx
  description: "Calculate your take-home pay, savings growth, and loan payments with CalcTrio's simple, accurate financial tools.",
};

export default function Home() {
  // 2. Structured Data (JSON-LD) for Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "CalcTrio",
    "url": "https://calctrio.com",
    "description": "Simple financial calculators for salary, savings, and payments.",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
  };

  return (
    <main className="min-h-screen flex flex-col justify-between bg-[#111111] text-[#f5f1e8] px-6 py-12">
      {/* Injecting the Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center">
        <div className="w-full max-w-3xl rounded-[28px] border border-[#2a2a2a] bg-[#171717] px-8 py-16 text-center shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#a89a7a]">
            Financial Tools
          </p>

          {/* Slightly more descriptive H1 for SEO */}
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-[#f5f1e8]">
            CalcTrio
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-[#c8c2b5]">
            Simple financial calculators for real decisions.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/salary"
              className="rounded-2xl border border-[#2f2a22] bg-[#1f1b16] px-6 py-4 font-medium text-[#f5f1e8] transition hover:border-[#a89a7a] hover:bg-[#262119]"
            >
              Salary Calculator
            </Link>

            <Link
              href="/payment"
              className="rounded-2xl border border-[#2f2a22] bg-[#1f1b16] px-6 py-4 font-medium text-[#f5f1e8] transition hover:border-[#a89a7a] hover:bg-[#262119]"
            >
              Payment Calculator
            </Link>

            <Link
              href="/savings"
              className="rounded-2xl border border-[#2f2a22] bg-[#1f1b16] px-6 py-4 font-medium text-[#f5f1e8] transition hover:border-[#a89a7a] hover:bg-[#262119]"
            >
              Savings Calculator
            </Link>
          </div>
        </div>
      </div>

      <footer className="mt-12 text-center text-sm text-[#9f9788]">
        <div className="mb-2 flex justify-center gap-6">
          <Link href="/about" className="hover:text-[#f5f1e8]">About</Link>
          <Link href="/methodology" className="hover:text-[#f5f1e8]">Methodology</Link>
          <Link href="/disclaimer" className="hover:text-[#f5f1e8]">Disclaimer</Link>
          <Link href="/privacy" className="hover:text-[#f5f1e8]">Privacy</Link>
        </div>

        <p>© {new Date().getFullYear()} CalcTrio</p>
      </footer>
    </main>
  );
}
