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

function sanitizeCurrencyInput(value: string) {
  return value.replace(/[^0-9.]/g, "");
}

function sanitizeWholeNumberInput(value: string) {
  return value.replace(/[^0-9]/g, "");
}

function parseNumber(value: string) {
  const cleaned = sanitizeCurrencyInput(value);
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

function formatRateInput(value: string) {
  const num = parseNumber(value);
  return num.toFixed(2);
}

function calculateMonthsToGoal(
  goalAmount: number,
  annualRate: number,
  monthlyContribution: number
) {
  if (goalAmount <= 0 || monthlyContribution <= 0) return null;

  const monthlyRate = annualRate / 100 / 12;

  if (annualRate === 0) {
    return Math.ceil(goalAmount / monthlyContribution);
  }

  let balance = 0;
  let months = 0;
  const maxMonths = 1200;

  while (balance < goalAmount && months < maxMonths) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    months += 1;
  }

  if (months >= maxMonths) return null;

  return months;
}

const quickExamples = [5000, 10000, 15000, 25000, 50000, 100000];

export default function SavingsCalculatorClient() {
  const [goal, setGoal] = useState("10,000.00");
  const [years, setYears] = useState("3");
  const [rate, setRate] = useState("4.00");
  const [monthlyNeeded, setMonthlyNeeded] = useState<number | null>(null);
  const [totalContribution, setTotalContribution] = useState<number | null>(null);
  const [interestEarned, setInterestEarned] = useState<number | null>(null);

  const clearResults = () => {
    setMonthlyNeeded(null);
    setTotalContribution(null);
    setInterestEarned(null);
  };

  const calculate = () => {
    const savingsGoal = parseNumber(goal);
    const annualRate = parseNumber(rate);
    const totalYears = Number(years);
    const months = totalYears * 12;

    if (savingsGoal <= 0 || totalYears <= 0 || months <= 0) {
      clearResults();
      return;
    }

    if (annualRate === 0) {
      const monthlyDeposit = savingsGoal / months;
      const contributed = monthlyDeposit * months;
      const interest = savingsGoal - contributed;

      setMonthlyNeeded(monthlyDeposit);
      setTotalContribution(contributed);
      setInterestEarned(interest);
      return;
    }

    const monthlyRate = annualRate / 100 / 12;
    const growthFactor = (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
    const monthlyDeposit = savingsGoal / growthFactor;
    const contributed = monthlyDeposit * months;
    const interest = savingsGoal - contributed;

    if (!Number.isFinite(monthlyDeposit)) {
      clearResults();
      return;
    }

    setMonthlyNeeded(monthlyDeposit);
    setTotalContribution(contributed);
    setInterestEarned(interest);
  };

  useEffect(() => {
    calculate();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    calculate();
  };

  const handleSelectAll = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const hasResults =
    monthlyNeeded !== null &&
    totalContribution !== null &&
    interestEarned !== null;

  const annualRate = parseNumber(rate);
  const goalAmount = parseNumber(goal);
  const fullTermMonths = Number(years) * 12;
  const weeklyNeeded = monthlyNeeded !== null ? (monthlyNeeded * 12) / 52 : 0;

  const fasterMonths =
    monthlyNeeded !== null
      ? calculateMonthsToGoal(goalAmount, annualRate, monthlyNeeded + 100)
      : null;

  const monthsSooner =
    fasterMonths !== null ? Math.max(0, fullTermMonths - fasterMonths) : 0;

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
              Salary
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
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
          <section className="border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.28)]">
            <h1 className="mb-3 text-center text-4xl font-bold">
              Savings Calculator
            </h1>

            <p className="mb-8 text-center text-lg text-[#d2c7b2]">
              See what it takes to reach your savings goal.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mx-auto flex w-full max-w-md flex-col"
            >
              <label className="mb-2 text-sm font-medium text-[#b29f7a]">
                Savings Goal
              </label>

              <div className="relative mb-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b826f]">
                  $
                </span>
                <input
                  inputMode="decimal"
                  value={goal}
                  onChange={(e) => setGoal(sanitizeCurrencyInput(e.target.value))}
                  onBlur={() => setGoal(formatInputCurrency(goal))}
                  onFocus={handleSelectAll}
                  className="w-full border border-[#2f2a22] bg-[#1b1b1b] py-3 pl-8 pr-4 text-center transition-all duration-200 focus:border-[#b29f7a] focus:outline-none focus:shadow-[0_0_0_3px_rgba(178,159,122,0.12)]"
                />
              </div>

              <label className="mb-2 text-sm font-medium text-[#b29f7a]">
                Years to Save
              </label>

              <input
                inputMode="numeric"
                value={years}
                onChange={(e) => setYears(sanitizeWholeNumberInput(e.target.value))}
                onFocus={handleSelectAll}
                className="mb-4 w-full border border-[#2f2a22] bg-[#1b1b1b] px-4 py-3 text-center transition-all duration-200 focus:border-[#b29f7a] focus:outline-none focus:shadow-[0_0_0_3px_rgba(178,159,122,0.12)]"
              />

              <label className="mb-2 text-sm font-medium text-[#b29f7a]">
                Annual Return (%)
              </label>

              <input
                inputMode="decimal"
                value={rate}
                onChange={(e) => setRate(sanitizeCurrencyInput(e.target.value))}
                onBlur={() => setRate(formatRateInput(rate))}
                onFocus={handleSelectAll}
                className="mb-5 w-full border border-[#2f2a22] bg-[#1b1b1b] px-4 py-3 text-center transition-all duration-200 focus:border-[#b29f7a] focus:outline-none focus:shadow-[0_0_0_3px_rgba(178,159,122,0.12)]"
              />

              <button
                type="submit"
                className="border border-[#4a4034] bg-[#241f19] px-6 py-3 transition-all duration-200 hover:border-[#b29f7a] hover:bg-[#2d271f] active:scale-[0.99]"
              >
                Calculate
              </button>
            </form>

            <div className="mx-auto mt-6 w-full max-w-md">
              <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[#8b826f]">
                Quick Savings Goals
              </p>

              <div className="grid grid-cols-2 gap-3">
                {quickExamples.map((amount) => (
                  <Link
                    key={amount}
                    href={`/savings/${amount}`}
                    className="border border-[#2f2a22] bg-[#141414] px-4 py-3 text-center text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]"
                  >
                    ${amount.toLocaleString()}
                  </Link>
                ))}
              </div>

              <p className="mt-4 text-center text-sm leading-6 text-[#9f9486]">
                Use example goal pages for a fast starting point, then adjust the years or return estimate.
              </p>
            </div>
          </section>

          <section className="border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.24)]">
            <div className="mb-6">
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">
                Clean Breakdown
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
                Full savings picture
              </h2>
            </div>

            {hasResults ? (
              <div className="space-y-4">
                <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                  <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">
                    Monthly Savings Needed
                  </p>
                  <p className="text-4xl font-semibold tracking-tight text-[#f7f3eb]">
                    {formatCurrency(monthlyNeeded)}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                    <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">
                      Total Contribution
                    </p>
                    <p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
                      {formatCurrency(totalContribution)}
                    </p>
                  </div>

                  <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                    <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">
                      Interest Earned
                    </p>
                    <p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
                      {formatCurrency(interestEarned)}
                    </p>
                  </div>
                </div>

                <div className="border border-[#3a3128] bg-[#151311] px-5 py-4">
                  <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#b29f7a]">
                    Smart Insight
                  </p>
                  <p className="text-sm leading-6 text-[#d2c7b2]">
                    Saving{" "}
                    <span className="font-semibold text-[#f7f3eb]">+$100/month</span>{" "}
                    could help you reach your goal{" "}
                    <span className="font-semibold text-[#f7f3eb]">
                      {monthsSooner} months sooner
                    </span>
                    .
                  </p>
                </div>

                <div className="border border-[#2a2a2a] bg-[#121212] px-5 py-4 text-sm text-[#d2c7b2]">
                  <div className="flex items-center justify-between py-2">
                    <span>Savings goal</span>
                    <span className="font-medium text-[#f7f3eb]">
                      {formatCurrency(goalAmount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#232323] py-2">
                    <span>Years to save</span>
                    <span className="font-medium text-[#f7f3eb]">{years} years</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#232323] py-2">
                    <span>Annual return</span>
                    <span className="font-medium text-[#f7f3eb]">
                      {annualRate.toFixed(2)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#232323] py-2">
                    <span>Weekly savings target</span>
                    <span className="font-medium text-[#f7f3eb]">
                      {formatCurrency(weeklyNeeded)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[360px] items-center justify-center border border-dashed border-[#2c2925] bg-[#141414] px-6 text-center text-[#9f9486]">
                Click calculate to see your monthly savings target, contributions, and interest earned.
              </div>
            )}
          </section>
        </div>

        <section className="mt-6 border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
          <div className="mb-6">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">
              FAQs
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
              Savings calculator questions
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
              <h3 className="mb-2 text-lg font-semibold text-[#f7f3eb]">
                How is monthly savings calculated?
              </h3>
              <p className="text-sm leading-6 text-[#d2c7b2]">
                This calculator uses your goal, time frame, and annual return estimate to work backward into a monthly savings target.
              </p>
            </div>

            <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
              <h3 className="mb-2 text-lg font-semibold text-[#f7f3eb]">
                What happens if the return is 0%?
              </h3>
              <p className="text-sm leading-6 text-[#d2c7b2]">
                The math becomes simple monthly saving with no growth. Your goal is divided evenly across the full number of months.
              </p>
            </div>

            <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
              <h3 className="mb-2 text-lg font-semibold text-[#f7f3eb]">
                Is the return guaranteed?
              </h3>
              <p className="text-sm leading-6 text-[#d2c7b2]">
                No. The annual return field is only an estimate used for planning. Real savings and investment results can vary.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
          <div className="mb-5">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">
              Related Calculators
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
              Keep exploring
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/salary"
              className="border border-[#2f2a22] bg-[#141414] px-5 py-4 transition-colors duration-200 hover:border-[#b29f7a]"
            >
              <p className="text-lg font-semibold text-[#f7f3eb]">
                Salary Calculator
              </p>
              <p className="mt-1 text-sm text-[#d2c7b2]">
                Break annual salary into monthly, biweekly, and weekly pay.
              </p>
            </Link>

            <Link
              href="/payment"
              className="border border-[#2f2a22] bg-[#141414] px-5 py-4 transition-colors duration-200 hover:border-[#b29f7a]"
            >
              <p className="text-lg font-semibold text-[#f7f3eb]">
                Payment Calculator
              </p>
              <p className="mt-1 text-sm text-[#d2c7b2]">
                Estimate monthly payments and see total loan cost over time.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
