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

type ExtraPaymentResult = {
  months: number;
  totalPaid: number;
  valid: boolean;
};

function calculateMonthsWithExtraPayment(
  principal: number,
  annualRate: number,
  monthlyPayment: number,
  extraPayment: number
): ExtraPaymentResult {
  const paymentPerMonth = monthlyPayment + extraPayment;

  if (principal <= 0 || paymentPerMonth <= 0) {
    return {
      months: 0,
      totalPaid: 0,
      valid: false,
    };
  }

  if (annualRate === 0) {
    const months = Math.ceil(principal / paymentPerMonth);
    return {
      months,
      totalPaid: paymentPerMonth * months,
      valid: true,
    };
  }

  const monthlyRate = annualRate / 100 / 12;
  let balance = principal;
  let months = 0;
  let totalPaid = 0;
  const maxMonths = 1200;

  while (balance > 0.01 && months < maxMonths) {
    const interest = balance * monthlyRate;
    const principalPaid = paymentPerMonth - interest;

    if (principalPaid <= 0) {
      return {
        months: 0,
        totalPaid: 0,
        valid: false,
      };
    }

    const actualPayment =
      balance + interest < paymentPerMonth ? balance + interest : paymentPerMonth;

    balance = Math.max(0, balance + interest - paymentPerMonth);
    totalPaid += actualPayment;
    months += 1;
  }

  if (months >= maxMonths) {
    return {
      months: 0,
      totalPaid: 0,
      valid: false,
    };
  }

  return {
    months,
    totalPaid,
    valid: true,
  };
}

const quickExamples = [10000, 15000, 20000, 30000, 50000, 75000];

export default function PaymentCalculatorClient() {
  const [loan, setLoan] = useState("25,000.00");
  const [rate, setRate] = useState("6.50");
  const [years, setYears] = useState("5");
  const [monthly, setMonthly] = useState<number | null>(null);
  const [totalPaid, setTotalPaid] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);

  const clearResults = () => {
    setMonthly(null);
    setTotalPaid(null);
    setTotalInterest(null);
  };

  const calculate = (
    loanValue = loan,
    rateValue = rate,
    yearsValue = years
  ) => {
    const principal = parseNumber(loanValue);
    const annualRate = parseNumber(rateValue);
    const termYears = Number(yearsValue);
    const months = termYears * 12;

    if (principal <= 0 || termYears <= 0 || months <= 0) {
      clearResults();
      return;
    }

    if (annualRate === 0) {
      const payment = principal / months;
      const paid = payment * months;
      const interest = paid - principal;

      setMonthly(payment);
      setTotalPaid(paid);
      setTotalInterest(interest);
      return;
    }

    const monthlyRate = annualRate / 100 / 12;

    const payment =
      (principal * monthlyRate) /
      (1 - Math.pow(1 + monthlyRate, -months));

    if (!Number.isFinite(payment)) {
      clearResults();
      return;
    }

    const paid = payment * months;
    const interest = paid - principal;

    setMonthly(payment);
    setTotalPaid(paid);
    setTotalInterest(interest);
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

  const applyExample = (amount: number) => {
    const nextLoan = formatInputCurrency(amount.toString());
    const nextRate = "6.50";
    const nextYears = "5";

    setLoan(nextLoan);
    setRate(nextRate);
    setYears(nextYears);
    calculate(nextLoan, nextRate, nextYears);
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
              Payment Calculator
            </h1>

            <p className="mb-8 text-center text-lg text-[#d2c7b2]">
              Estimate your monthly loan or mortgage payment.
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
                Quick Loan Examples
              </p>

              <div className="grid grid-cols-2 gap-3">
                {quickExamples.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => applyExample(amount)}
                    className="border border-[#2f2a22] bg-[#141414] px-4 py-3 text-center text-sm text-[#d2c7b2] transition-colors duration-200 hover:border-[#b29f7a] hover:text-[#f7f3eb]"
                  >
                    ${amount.toLocaleString()}
                  </button>
                ))}
              </div>

              <p className="mt-4 text-center text-sm leading-6 text-[#9f9486]">
                Example presets use a 5-year loan at 6.5% APR.
              </p>

              <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs text-[#8b826f]">
                {quickExamples.map((amount) => (
                  <Link
                    key={`detail-${amount}`}
                    href={`/payment/${amount}`}
                    className="transition-colors duration-200 hover:text-[#f7f3eb]"
                  >
                    View {amount.toLocaleString()} page
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.24)]">
            <div className="mb-6">
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">
                Clean Breakdown
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
                Full payment picture
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
                    Paying{" "}
                    <span className="font-semibold text-[#f7f3eb]">+$100/month</span>{" "}
                    could pay this off{" "}
                    <span className="font-semibold text-[#f7f3eb]">
                      {monthsSaved} months sooner
                    </span>{" "}
                    and save about{" "}
                    <span className="font-semibold text-[#f7f3eb]">
                      {formatCurrency(extraInterestSaved)}
                    </span>{" "}
                    in interest.
                  </p>
                </div>

                <div className="border border-[#2a2a2a] bg-[#121212] px-5 py-4 text-sm text-[#d2c7b2]">
                  <div className="flex items-center justify-between py-2">
                    <span>Loan amount</span>
                    <span className="font-medium text-[#f7f3eb]">
                      {formatCurrency(parseNumber(loan))}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#232323] py-2">
                    <span>Interest rate</span>
                    <span className="font-medium text-[#f7f3eb]">
                      {parseNumber(rate).toFixed(2)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#232323] py-2">
                    <span>Loan term</span>
                    <span className="font-medium text-[#f7f3eb]">
                      {years} years
                    </span>
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
          <div className="mb-6">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">
              FAQs
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">
              Payment calculator questions
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
              <h3 className="mb-2 text-lg font-semibold text-[#f7f3eb]">
                How is monthly payment calculated?
              </h3>
              <p className="text-sm leading-6 text-[#d2c7b2]">
                This calculator uses your loan amount, interest rate, and term to estimate a fixed monthly payment over the full payoff period.
              </p>
            </div>

            <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
              <h3 className="mb-2 text-lg font-semibold text-[#f7f3eb]">
                Does this include taxes or insurance?
              </h3>
              <p className="text-sm leading-6 text-[#d2c7b2]">
                No. The result is principal and interest only. Property taxes, homeowners insurance, HOA fees, and similar costs are not included here.
              </p>
            </div>

            <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5">
              <h3 className="mb-2 text-lg font-semibold text-[#f7f3eb]">
                Why does total paid exceed the loan amount?
              </h3>
              <p className="text-sm leading-6 text-[#d2c7b2]">
                Because total paid includes both the original amount borrowed and the total interest charged over the life of the loan.
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
                Turn annual pay into monthly, biweekly, and weekly numbers.
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
