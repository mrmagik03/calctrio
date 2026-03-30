export const metadata = {
  title: "Methodology | CalcTrio",
  description: "How CalcTrio calculators work and how results are calculated.",
};

export default function MethodologyPage() {
  return (
    <main className="min-h-screen flex flex-col justify-between bg-[#111111] text-[#f7f3eb] px-6 py-12">
      <div className="flex flex-1 flex-col items-center justify-center">
        <nav className="mb-10 flex gap-6 text-sm text-[#b29f7a]">
          <a href="/" className="hover:text-[#f7f3eb]">
            Home
          </a>
          <a href="/salary" className="hover:text-[#f7f3eb]">
            Salary
          </a>
          <a href="/payment" className="hover:text-[#f7f3eb]">
            Payment
          </a>
          <a href="/savings" className="hover:text-[#f7f3eb]">
            Savings
          </a>
        </nav>

        <div className="w-full max-w-3xl border border-[#2a2a2a] bg-[#171717] px-8 py-10 shadow-[0_12px_32px_rgba(0,0,0,0.28)]">
          <h1 className="mb-6 text-center text-4xl font-bold text-[#f7f3eb]">
            Methodology
          </h1>

          <div className="space-y-6 text-lg leading-8 text-[#d2c7b2]">
            <p>
              CalcTrio calculators use standard financial formulas to estimate
              income breakdowns, loan payments, and savings growth. These tools
              are designed to provide quick, easy-to-understand estimates based
              on common assumptions.
            </p>

            <div>
              <h2 className="mb-2 text-2xl font-semibold text-[#f7f3eb]">
                Salary Calculator
              </h2>
              <p>
                Monthly pay is calculated by dividing annual salary by 12.
                Weekly pay is calculated by dividing annual salary by 52.
                Hourly pay is estimated using 2,080 working hours per year
                (40 hours per week × 52 weeks).
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-2xl font-semibold text-[#f7f3eb]">
                Payment Calculator
              </h2>
              <p>
                Loan payments are calculated using a standard amortization
                formula based on loan amount, interest rate, and loan term.
                Results represent fixed monthly payments and do not include
                taxes, insurance, or other fees.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-2xl font-semibold text-[#f7f3eb]">
                Savings Calculator
              </h2>
              <p>
                Savings projections use a compound interest formula based on
                monthly contributions, interest rate, and time. Results assume
                consistent deposits and do not account for market fluctuations
                or changing rates.
              </p>
            </div>

            <p>
              These calculators are intended for estimation purposes only and
              should not be considered financial advice.
            </p>
          </div>
        </div>
      </div>

      <footer className="mt-12 text-center text-sm text-[#a89f8f]">
        <div className="mb-2 flex justify-center gap-6">
          <a href="/about" className="hover:text-[#f7f3eb]">
            About
          </a>
          <a href="/methodology" className="hover:text-[#f7f3eb]">
            Methodology
          </a>
          <a href="/disclaimer" className="hover:text-[#f7f3eb]">
            Disclaimer
          </a>
          <a href="/privacy" className="hover:text-[#f7f3eb]">
            Privacy
          </a>
        </div>

        <p>© {new Date().getFullYear()} CalcTrio</p>
      </footer>
    </main>
  );
}