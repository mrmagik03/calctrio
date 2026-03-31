import type { Metadata } from "next";
import InfoPageShell from "../components/InfoPageShell";

export const metadata: Metadata = {
  title: "Methodology",
  description: "How CalcTrio calculators work and how results are calculated.",
  alternates: {
    canonical: "/methodology",
  },
};

export default function MethodologyPage() {
  return (
    <InfoPageShell title="Methodology">
      <p>
        CalcTrio calculators use standard financial formulas to estimate income
        breakdowns, loan payments, and savings growth. These tools are designed
        to provide quick, easy-to-understand estimates based on common
        assumptions.
      </p>

      <div>
        <h2 className="mb-2 text-2xl font-semibold text-[#f7f3eb]">
          Salary Calculator
        </h2>
        <p>
          Monthly pay is calculated by dividing annual salary by 12. Weekly pay
          is calculated by dividing annual salary by 52. Hourly pay is
          estimated using 2,080 working hours per year.
        </p>
      </div>

      <div>
        <h2 className="mb-2 text-2xl font-semibold text-[#f7f3eb]">
          Payment Calculator
        </h2>
        <p>
          Loan payments are calculated using a standard amortization formula
          based on loan amount, interest rate, and loan term. Results represent
          fixed monthly payments and do not include taxes, insurance, or other
          fees.
        </p>
      </div>

      <div>
        <h2 className="mb-2 text-2xl font-semibold text-[#f7f3eb]">
          Savings Calculator
        </h2>
        <p>
          Savings projections use a compound interest formula based on monthly
          contributions, interest rate, and time. Results assume consistent
          deposits and do not account for market fluctuations or changing
          rates.
        </p>
      </div>

      <p>
        These calculators are intended for estimation purposes only and should
        not be considered financial advice.
      </p>
    </InfoPageShell>
  );
}
