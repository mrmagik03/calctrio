"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";

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

function formatState(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const quickExamples = [40000, 50000, 60000, 75000, 100000, 120000];

const states = [
  "texas",
  "california",
  "florida",
  "new-york",
  "illinois",
  "georgia",
  "north-carolina",
  "ohio",
  "pennsylvania",
  "michigan",
  "washington",
  "virginia",
];

const cities = [
  { state: "texas", city: "austin", name: "Austin, TX" },
  { state: "texas", city: "houston", name: "Houston, TX" },
  { state: "texas", city: "dallas", name: "Dallas, TX" },
  { state: "california", city: "los-angeles", name: "Los Angeles, CA" },
  { state: "california", city: "san-diego", name: "San Diego, CA" },
  { state: "new-york", city: "new-york-city", name: "New York City, NY" },
  { state: "florida", city: "miami", name: "Miami, FL" },
  { state: "washington", city: "seattle", name: "Seattle, WA" },
];

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

  const hasResults = monthly !== null && biweekly !== null && weekly !== null;

  const annualSalary = parseNumber(salary);
  const hourly = annualSalary > 0 ? annualSalary / 2080 : 0;
  const daily = annualSalary > 0 ? annualSalary / 260 : 0;

  return (
    <main className="min-h-screen bg-[#111111] text-[#f7f3eb]">
      <SiteHeader />

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
                  className="w-full border border-[#2f2a22] bg-[#1b1b1b] text-white py-3 px-4 appearance-none focus:outline-none focus:border-[#b29f7a]"
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
                    <span>Weekly pay</span>
                    <span className="font-medium text-[#f7f3eb]">
                      {formatCurrency(weekly)}
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
              Explore by location
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-[#f7f3eb]">
              Compare salary after tax by state and city
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#d2c7b2]">
              Taxes vary by location. Compare your take-home pay across states and
              major cities to see how far the same salary really goes.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[#f7f3eb]">
              Popular state pages
            </h3>

            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
              {states.map((state) => (
                <Link
                  key={state}
                  href={`/salary/60000/after-tax/${state}`}
                  className="border border-[#2f2a22] bg-[#141414] px-3 py-3 text-center text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]"
                >
                  {formatState(state)}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-semibold text-[#f7f3eb]">
              Popular city pages
            </h3>

            <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {cities.map((city) => (
                <Link
                  key={city.name}
                  href={`/salary/60000/after-tax/${city.state}/${city.city}`}
                  className="border border-[#2f2a22] bg-[#141414] px-4 py-4 text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]"
                >
                  {city.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-10 border border-[#3a3128] bg-[#151311] px-5 py-4">
            <h3 className="text-xl font-semibold text-[#f7f3eb]">
              Why compare salary by location?
            </h3>
            <p className="mt-3 text-sm leading-7 text-[#d2c7b2]">
              A salary that looks strong in one state may stretch differently in
              another after taxes. These location pages make it easier to compare
              take-home pay faster without guessing.
            </p>
          </div>
        </section>

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
                This calculator divides annual salary by 12 to estimate gross monthly pay before taxes and deductions.
              </p>
            </div>

            <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
              <h3 className="mb-2 text-lg font-semibold text-[#f7f3eb]">
                What does biweekly pay mean?
              </h3>
              <p className="text-sm leading-6 text-[#d2c7b2]">
                Biweekly pay assumes 26 pay periods in a year, which is common for many full-time jobs.
              </p>
            </div>

            <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
              <h3 className="mb-2 text-lg font-semibold text-[#f7f3eb]">
                Is this before or after taxes?
              </h3>
              <p className="text-sm leading-6 text-[#d2c7b2]">
                These are gross pay estimates only. Taxes, benefits, and other payroll deductions are not included.
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
              href="/loan"
              className="border border-[#2f2a22] bg-[#141414] px-5 py-4 transition-colors duration-200 hover:border-[#b29f7a]"
            >
              <p className="text-lg font-semibold text-[#f7f3eb]">
                Loan Calculator
              </p>
              <p className="mt-1 text-sm text-[#d2c7b2]">
                Estimate monthly loan payments and compare total loan costs.
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
                Estimate how much you need to save each month to hit a goal.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}