import Link from "next/link";
import type { Metadata } from "next";
import SiteFooter from "./components/SiteFooter";

export const metadata: Metadata = {
  title: "Salary Calculator: See What Your Pay Is Worth in Any City + What You Can Actually Buy",
  description:
    "Enter your salary → instantly compare take-home pay across US cities → see what cars, vacations, or savings that difference actually buys you. One connected trio of tools.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Salary Calculator: See What Your Pay Is Worth in Any City + What You Can Actually Buy",
    description:
      "Enter your salary → instantly compare take-home pay across US cities → see what cars, vacations, or savings that difference actually buys you.",
    url: "https://calctrio.com",
    siteName: "CalcTrio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Salary Calculator: See What Your Pay Is Worth in Any City + What You Can Actually Buy",
    description:
      "Enter your salary → instantly compare take-home pay across US cities → see what cars, vacations, or savings that difference actually buys you.",
  },
};

const trioCards = [
  {
    href: "/salary",
    kicker: "Step 1 — Income",
    title: "Salary Breakdown",
    description:
      "Turn your annual salary into monthly, biweekly, and hourly pay. See exact take-home after taxes.",
    className:
      "border-[#2f2a22] bg-[linear-gradient(180deg,rgba(28,25,21,0.74),rgba(18,16,14,0.92)),url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center hover:border-[#a89a7a]",
  },
  {
    href: "/salary",
    kicker: "Step 2 — Location",
    title: "City Cost Comparison",
    description:
      "Same salary, different city. See how far your money actually goes in Houston vs. NYC vs. Austin.",
    className:
      "border-[#3c3328] bg-[linear-gradient(180deg,rgba(34,30,24,0.74),rgba(20,18,15,0.92)),url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center hover:border-[#b79a6a]",
  },
  {
    href: "/savings",
    kicker: "Step 3 — Lifestyle",
    title: "What Can You Actually Buy?",
    description:
      "Take the difference and instantly see what car, vacation, watch, or future savings that money buys.",
    className:
      "border-[#2f2a22] bg-[linear-gradient(180deg,rgba(28,25,21,0.74),rgba(18,16,14,0.92)),url('https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center hover:border-[#a89a7a]",
  },
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "CalcTrio",
    url: "https://calctrio.com",
    description:
      "Connected salary, cost-of-living, and lifestyle calculators. See what your pay is really worth and what it can buy.",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
  };

  return (
    <main className="min-h-screen bg-[#111111] px-6 py-12 text-[#f5f1e8]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-between">
        <div className="flex flex-1 flex-col justify-center">
          <div className="mx-auto w-full max-w-5xl rounded-[28px] border border-[#2a2a2a] bg-[#171717] px-8 py-14 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#a89a7a]">
                The Connected Trio
              </p>

              <h1 className="mb-6 text-5xl font-bold tracking-tight text-[#f5f1e8]">
                Your Salary.<br />Your City.<br />Your Lifestyle.
              </h1>

              <p className="mx-auto mb-10 max-w-2xl text-xl leading-8 text-[#c8c2b5]">
                Enter your salary once.<br />
                See what it’s really worth after taxes and cost of living.<br />
                Then instantly see what car, vacation, or savings that extra money buys you.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {trioCards.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className={`rounded-3xl border px-6 py-6 text-left transition ${card.className}`}
                >
                  <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#c2ab84]">
                    {card.kicker}
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-[#f5f1e8]">
                    {card.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[#ded4c4]">
                    {card.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <SiteFooter />
      </div>
    </main>
  );
}