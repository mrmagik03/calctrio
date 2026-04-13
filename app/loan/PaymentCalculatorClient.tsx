"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function formatCurrency(num: number) {
  return num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parseNumber(value: string) {
  const cleaned = value.replace(/[^0-9.]/g, "");
  if (!cleaned) return 0;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatInputCurrency(value: string) {
  const num = parseNumber(value);
  if (!num) return "";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getNearbyAmounts(base: number) {
  if (!base || base <= 0) return [10000, 15000, 20000, 25000, 30000, 40000];

  const step =
    base < 20000 ? 2500 :
    base < 100000 ? 5000 :
    10000;

  const amounts = [];

  for (let i = -2; i <= 3; i++) {
    const val = Math.max(step, Math.round((base + i * step) / step) * step);
    amounts.push(val);
  }

  return [...new Set(amounts)];
}

export default function PaymentCalculatorClient() {
  const [loan, setLoan] = useState("25,000.00");
  const [rate, setRate] = useState("6.50");
  const [years, setYears] = useState("5");

  const [monthly, setMonthly] = useState<number | null>(null);

  const calculate = () => {
    const principal = parseNumber(loan);
    const annualRate = parseNumber(rate);
    const months = Number(years) * 12;

    if (principal <= 0 || months <= 0) return;

    const monthlyRate = annualRate / 100 / 12;

    const payment =
      annualRate === 0
        ? principal / months
        : (principal * monthlyRate) /
          (1 - Math.pow(1 + monthlyRate, -months));

    setMonthly(payment);
  };

  useEffect(() => {
    calculate();
  }, []);

  const baseAmount = parseNumber(loan);
  const nearbyAmounts = getNearbyAmounts(baseAmount);

  return (
    <main className="min-h-screen bg-[#111111] text-[#f7f3eb]">
      <div className="mx-auto max-w-6xl px-6 py-8">

        {/* CALCULATOR */}
        <section className="border bg-[#171717] px-8 py-8">
          <h1 className="text-4xl text-center font-bold mb-4">
            Loan Calculator
          </h1>

          <form className="flex flex-col max-w-md mx-auto">
            <input
              value={loan}
              onChange={(e) => setLoan(e.target.value)}
              onBlur={() => setLoan(formatInputCurrency(loan))}
              className="mb-4 p-3 bg-[#1b1b1b] border text-center"
            />

            <input
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="mb-4 p-3 bg-[#1b1b1b] border text-center"
            />

            <input
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="mb-4 p-3 bg-[#1b1b1b] border text-center"
            />

            <button
              type="button"
              onClick={calculate}
              className="bg-[#241f19] p-3 border"
            >
              Calculate
            </button>
          </form>

          {monthly && (
            <div className="mt-6 text-center">
              <p className="text-2xl">
                {formatCurrency(monthly)}
              </p>
            </div>
          )}

          {/* 🔥 FULL BREAKDOWN EXAMPLES */}
          <div className="mt-8 max-w-md mx-auto">
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[#8b826f] text-center">
              Car Loan Breakdown Examples
            </p>

            <div className="grid grid-cols-2 gap-3">
              {nearbyAmounts.map((amount) => (
                <Link
                  key={amount}
                  href={`/loan/car/${amount}`}
                  className="border border-[#2f2a22] bg-[#141414] px-4 py-3 text-center text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]"
                >
                  ${amount.toLocaleString()}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}