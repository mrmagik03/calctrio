"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import SiteHeader from "../components/SiteHeader";
import {
  LoanCategory,
  calculateLoanResults,
  calculateMonthsWithExtraPayment,
  formatCurrency,
  formatInputCurrency,
  formatRateInput,
  loanCategories,
  parseNumber,
  sanitizeCurrencyInput,
  sanitizeWholeNumberInput,
} from "./loan-data";

type VehicleLoanCalculatorClientProps = {
  category: LoanCategory;
};

export default function VehicleLoanCalculatorClient({
  category,
}: VehicleLoanCalculatorClientProps) {
  const searchParams = useSearchParams();
  const initialAmount = useMemo(() => {
    const raw = searchParams.get("amount");
    const parsed = raw ? Number(raw) : NaN;
    if (Number.isFinite(parsed) && parsed > 0) {
      return formatInputCurrency(parsed.toString());
    }
    return formatInputCurrency(category.quickExamples[2].toString());
  }, [searchParams, category.quickExamples]);

  const [loan, setLoan] = useState(initialAmount);
  const [rate, setRate] = useState(category.defaultRate.toFixed(2));
  const [years, setYears] = useState(category.defaultYears.toString());
  const [monthly, setMonthly] = useState<number | null>(null);
  const [totalPaid, setTotalPaid] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);

  useEffect(() => {
    setLoan(initialAmount);
  }, [initialAmount]);

  const clearResults = () => {
    setMonthly(null);
    setTotalPaid(null);
    setTotalInterest(null);
  };

  const calculate = (loanValue = loan, rateValue = rate, yearsValue = years) => {
    const result = calculateLoanResults(
      parseNumber(loanValue),
      parseNumber(rateValue),
      Number(yearsValue)
    );

    if (!result) {
      clearResults();
      return;
    }

    setMonthly(result.monthlyPayment);
    setTotalPaid(result.totalPaid);
    setTotalInterest(result.totalInterest);
  };

  useEffect(() => {
    calculate(initialAmount, rate, years);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAmount]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    calculate();
  };

  const handleSelectAll = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const hasResults =
    monthly !== null && totalPaid !== null && totalInterest !== null;
  const principal = parseNumber(loan);
  const annualRate = parseNumber(rate);
  const fullTermMonths = Number(years) * 12;

  const extraPaymentResult =
    hasResults && monthly !== null
      ? calculateMonthsWithExtraPayment(principal, annualRate, monthly, 100)
      : { months: 0, totalPaid: 0, valid: false };

  const monthsSaved =
    extraPaymentResult.valid && fullTermMonths > 0
      ? Math.max(0, fullTermMonths - extraPaymentResult.months)
      : 0;

  const extraInterestSaved =
    extraPaymentResult.valid && totalPaid !== null
      ? Math.max(0, totalPaid - extraPaymentResult.totalPaid)
      : 0;

  const siblingCategories = Object.values(loanCategories).filter(
    (item) => item.slug !== category.slug
  );

  return (
    <main className="min-h-screen bg-[#111111] text-[#f7f3eb]">
      <SiteHeader />

      <section
        className="border-b border-[#201c18] bg-[#0f0f0f] bg-cover bg-center"
        style={{ backgroundImage: category.heroImage }}
      >
        <div className="mx-auto w-full max-w-6xl px-6 py-14">
          <p className="mb-3 text-xs uppercase tracking-[0.22em] text-[#b29f7a]">
            {category.shortLabel} financing
          </p>
          <h1 className="max-w-4xl text-4xl font-bold leading-tight text-[#f7f3eb] md:text-5xl">
            {category.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#ddd2c0]">
            {category.headline}
          </p>
          <p className="mt-3 max-w-3xl text-base leading-7 text-[#cfc4b1]">
            {category.intro}
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Link
            href="/loan"
            className="inline-flex items-center border border-[#2f2a22] bg-[#1f1b16] px-4 py-2 text-sm font-medium text-[#f7f3eb] transition-colors duration-200 hover:border-[#b29f7a] hover:bg-[#262119]"
          >
            ← Back to Loan Hub
          </Link>
          <p className="text-sm text-[#a99c88]">{category.helperText}</p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
          <section className="border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.28)]">
            <h2 className="mb-3 text-center text-4xl font-bold">
              {category.title}
            </h2>

            <p className="mb-8 text-center text-lg text-[#d2c7b2]">
              {category.detailText}
            </p>

            <form
              onSubmit={handleSubmit}
              className="mx-auto flex w-full max-w-md flex-col"
            >
              <label className="mb-2 text-sm font-medium text-[#b29f7a]">
                Loan Amount
              </label>

              <div className="relative mb-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b826f]">
                  $
                </span>
                <input
                  inputMode="decimal"
                  value={loan}
                  onChange={(e) => setLoan(sanitizeCurrencyInput(e.target.value))}
                  onBlur={() => setLoan(formatInputCurrency(loan))}
                  onFocus={handleSelectAll}
                  className="w-full border border-[#2f2a22] bg-[#1b1b1b] py-3 pl-8 pr-4 text-center transition-all duration-200 focus:border-[#b29f7a] focus:outline-none focus:shadow-[0_0_0_3px_rgba(178,159,122,0.12)]"
                />
              </div>

              <label className="mb-2 text-sm font-medium text-[#b29f7a]">
                Interest Rate (%)
              </label>
              <input
                inputMode="decimal"
                value={rate}
                onChange={(e) => setRate(sanitizeCurrencyInput(e.target.value))}
                onBlur={() => setRate(formatRateInput(rate))}
                onFocus={handleSelectAll}
                className="mb-4 w-full border border-[#2f2a22] bg-[#1b1b1b] px-4 py-3 text-center transition-all duration-200 focus:border-[#b29f7a] focus:outline-none focus:shadow-[0_0_0_3px_rgba(178,159,122,0.12)]"
              />

              <label className="mb-2 text-sm font-medium text-[#b29f7a]">
                Loan Term (Years)
              </label>
              <input
                inputMode="numeric"
                value={years}
                onChange={(e) => setYears(sanitizeWholeNumberInput(e.target.value))}
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
                Full Breakdown Examples
              </p>

              <div className="grid grid-cols-2 gap-3">
                {category.quickExamples.map((amount) => (
                  <Link
                    key={amount}
                    href={`/loan/${category.slug}/${amount}`}
                    className="border border-[#2f2a22] bg-[#141414] px-4 py-3 text-center text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]"
                  >
                    ${amount.toLocaleString()}
                  </Link>
                ))}
              </div>

              <p className="mt-4 text-center text-sm leading-6 text-[#9f9486]">
                Browse the most common full breakdown pages for this category.
              </p>
            </div>
          </section>

          <section className="border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.24)]">
            <div className="mb-6">
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">
                Clean Breakdown
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
                Full {category.shortLabel} loan picture
              </h2>
            </div>

            {hasResults ? (
              <div className="space-y-4">
                <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                  <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">
                    Monthly Payment
                  </p>
                  <p className="text-4xl font-semibold tracking-tight text-[#f7f3eb]">
                    {formatCurrency(monthly)}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                    <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">
                      Total Paid
                    </p>
                    <p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
                      {formatCurrency(totalPaid)}
                    </p>
                  </div>
                  <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
                    <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#8b826f]">
                      Total Interest
                    </p>
                    <p className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
                      {formatCurrency(totalInterest)}
                    </p>
                  </div>
                </div>

                <div className="border border-[#3a3128] bg-[#151311] px-5 py-4">
                  <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#b29f7a]">
                    Smart Insight
                  </p>
                  <p className="text-sm leading-6 text-[#d2c7b2]">
                    Paying <span className="font-semibold text-[#f7f3eb]">+$100/month</span> could pay this off <span className="font-semibold text-[#f7f3eb]">{monthsSaved} months sooner</span> and save about <span className="font-semibold text-[#f7f3eb]">{formatCurrency(extraInterestSaved)}</span> in interest.
                  </p>
                </div>

                <div className="border border-[#2a2a2a] bg-[#121212] px-5 py-4 text-sm text-[#d2c7b2]">
                  <div className="flex items-center justify-between py-2">
                    <span>Loan amount</span>
                    <span className="font-medium text-[#f7f3eb]">{formatCurrency(principal)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#232323] py-2">
                    <span>Interest rate</span>
                    <span className="font-medium text-[#f7f3eb]">{annualRate.toFixed(2)}%</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#232323] py-2">
                    <span>Loan term</span>
                    <span className="font-medium text-[#f7f3eb]">{years} years</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[360px] items-center justify-center border border-dashed border-[#2c2925] bg-[#141414] px-6 text-center text-[#9f9486]">
                Click calculate to see your monthly payment, total paid, and total interest.
              </div>
            )}
          </section>
        </div>

        <section className="mt-6 border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
          <div className="mb-5">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">
              Keep exploring
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
              More calculators in this branch
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/loan"
              className="border border-[#2f2a22] bg-[#141414] px-5 py-4 transition-colors duration-200 hover:border-[#b29f7a]"
            >
              <p className="text-lg font-semibold text-[#f7f3eb]">Loan Hub</p>
              <p className="mt-1 text-sm text-[#d2c7b2]">
                Jump back to the vehicle branches and common starting amounts.
              </p>
            </Link>

            {siblingCategories.map((item) => (
              <Link
                key={item.slug}
                href={`/loan/${item.slug}`}
                className="border border-[#2f2a22] bg-[#141414] px-5 py-4 transition-colors duration-200 hover:border-[#b29f7a]"
              >
                <p className="text-lg font-semibold text-[#f7f3eb]">{item.label}</p>
                <p className="mt-1 text-sm text-[#d2c7b2]">{item.intro}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
