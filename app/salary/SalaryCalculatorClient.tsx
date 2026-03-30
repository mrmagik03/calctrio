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

const quickExamples = [40000, 50000, 60000, 75000, 100000, 120000];

export default function SalaryCalculatorClient() {
  const [salary, setSalary] = useState("60,000.00");
  const [monthly, setMonthly] = useState<number | null>(null);
  const [biweekly, setBiweekly] = useState<number | null>(null);
  const [weekly, setWeekly] = useState<number | null>(null);

  const clearResults = () => {
    setMonthly(null);
    setBiweekly(null);
    setWeekly(null);
  };

  const calculate = () => {
    const annualSalary = parseNumber(salary);

    if (annualSalary <= 0) {
      clearResults();
      return;
    }

    setMonthly(annualSalary / 12);
    setBiweekly(annualSalary / 26);
    setWeekly(annualSalary / 52);
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
    monthly !== null && biweekly !== null && weekly !== null;

  const annualSalary = parseNumber(salary);
  const hourly = annualSalary > 0 ? annualSalary / 2080 : 0;
  const daily = annualSalary > 0 ? annualSalary / 260 : 0;

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
              Salary Calculator
            </h1>

            <p className="mb-8 text-center text-lg text-[#d2c7b2]">
              Break your annual salary into clear paycheck views.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mx-auto flex w-full max-w-md flex-col"
            >
              <label className="mb-2 text-sm font-medium text-[#b29f7a]">
                Annual Salary
              </label>

              <div className="relative mb-5">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b826f]">
                  $
                </span>
                <input
                  inputMode="decimal"
                  value={salary}
                  onChange={(e) => setSalary(sanitizeCurrencyInput(e.target.value))}
                  onBlur={() => setSalary(formatInputCurrency(salary))}
                  onFocus={handleSelectAll}
                  className="w-full border border-[#2f2a22] bg-[#1b1b1b] py-3 pl-8 pr-4 text-center transition-all duration-200 focus:border-[#b29f7a] focus:outline-none focus:shadow-[0_0_0_3px_rgba(178,159,122,0.12)]"
                />
              </div>

              <button
                type="submit"
                className="border border-[#4a4034] bg-[#241f19] px-6 py-3 transition-all duration-200 hover:border-[#b29f7a] hover:bg-[#2d271f] active:scale-[0.99]"
              >
                Calculate
              </button>
            </form>

            <div className="mx-auto mt-6 w-full max-w-md">
              <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[#8b826f]">
                Quick Salary Examples
              </p>

              <div className="grid grid-cols-2 gap-3">
                {quickExamples.map((amount) => (
                  <Link
                    key={amount}
                    href={`/salary/${amount}`}
                    className="border border-[#2f2a22] bg-[#141414] px-4 py-3 text-center text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]"
                  >
                    ${amount.toLocaleString()}
                  </Link>
                ))}
              </div>

              <p className="mt-4 text-center text-sm leading-6 text-[#9f9486]">
                Based on 12 months, 26 biweekly pay periods, and 52 weeks per year.
              </p>
            </div>
          </section>

          <section className="border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.24)]">
            <div className="mb-6">
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">
                Clean Breakdown
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
                Full salary picture
              </h2>
            </div>

            {hasResults ? (
              <div className="space-y-4">
                <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                  <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">
                    Monthly Pay
                  </p>
                  <p className="text-4xl font-semibold tracking-tight text-[#f7f3eb]">
                    {formatCurrency(monthly)}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                    <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">
                      Biweekly Pay
                    </p>
                    <p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
                      {formatCurrency(biweekly)}
                    </p>
                  </div>

                  <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                    <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">
                      Weekly Pay
                    </p>
                    <p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
                      {formatCurrency(weekly)}
                    </p>
                  </div>
                </div>

                <div className="border border-[#3a3128] bg-[#151311] px-5 py-4">
                  <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#b29f7a]">
                    Smart Insight
                  </p>
                  <p className="text-sm leading-6 text-[#d2c7b2]">
                    That works out to about{" "}
                    <span className="font-semibold text-[#f7f3eb]">
                      {formatCurrency(hourly)}/hour
                    </span>{" "}
                    or roughly{" "}
                    <span className="font-semibold text-[#f7f3eb]">
                      {formatCurrency(daily)}/day
                    </span>{" "}
                    before taxes using a standard full-time work year.
                  </p>
                </div>

                <div className="border border-[#2a2a2a] bg-[#121212] px-5 py-4 text-sm text-[#d2c7b2]">
                  <div className="flex items-center justify-between py-2">
                    <span>Annual salary</span>
                    <span className="font-medium text-[#f7f3eb]">
                      {formatCurrency(parseNumber(salary))}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#232323] py-2">
                    <span>Monthly pay</span>
                    <span className="font-medium text-[#f7f3eb]">
                      {formatCurrency(monthly)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#232323] py-2">
                    <span>Biweekly pay</span>
                    <span className="font-medium text-[#f7f3eb]">
                      {formatCurrency(biweekly)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#232323] py-2">
                    <span>Estimated hourly rate</span>
                    <span className="font-medium text-[#f7f3eb]">
                      {formatCurrency(hourly)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[360px] items-center justify-center border border-dashed border-[#2c2925] bg-[#141414] px-6 text-center text-[#9f9486]">
                Click calculate to see your monthly, biweekly, and weekly pay.
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
              Salary calculator questions
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
              <h3 className="mb-2 text-lg font-semibold text-[#f7f3eb]">
                How is monthly salary calculated?
              </h3>
              <p className="text-sm leading-6 text-[#d2c7b2]">
                This calculator divides your annual salary by 12 to estimate monthly pay before taxes and deductions.
              </p>
            </div>

            <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
              <h3 className="mb-2 text-lg font-semibold text-[#f7f3eb]">
                What does biweekly pay mean?
              </h3>
              <p className="text-sm leading-6 text-[#d2c7b2]">
                Biweekly pay assumes 26 pay periods per year, which is common for many full-time jobs in the United States.
              </p>
            </div>

            <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
              <h3 className="mb-2 text-lg font-semibold text-[#f7f3eb]">
                Is this before or after taxes?
              </h3>
              <p className="text-sm leading-6 text-[#d2c7b2]">
                These results are gross pay estimates. Federal, state, local, and benefit deductions are not included.
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
              href="/payment"
              className="border border-[#2f2a22] bg-[#141414] px-5 py-4 transition-colors duration-200 hover:border-[#b29f7a]"
            >
              <p className="text-lg font-semibold text-[#f7f3eb]">
                Payment Calculator
              </p>
              <p className="mt-1 text-sm text-[#d2c7b2]">
                Estimate monthly loan payments, total paid, and total interest.
              </p>
            </Link>

            <Link
              href="/savings"
              className="border border-[#2f2a22] bg-[#141414] px-5 py-4 transition-colors duration-200 hover:border-[#b29f7a]"
            >
              <p className="text-lg font-semibold text-[#f7f3eb]">
                Savings Calculator
              </p>
              <p className="mt-1 text-sm text-[#d2c7b2]">
                Figure out what you need to save monthly to reach a goal.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}