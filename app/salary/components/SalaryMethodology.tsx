import { formatCurrency, type SalaryBreakdown } from "@/lib/salary";

export default function SalaryMethodology({
  breakdown,
  stateLabel,
  cityLabel,
}: {
  breakdown: SalaryBreakdown;
  stateLabel?: string;
  cityLabel?: string;
}) {
  const locationLabel = cityLabel
    ? `${cityLabel}, ${stateLabel}`
    : stateLabel
      ? stateLabel
      : "this estimate";

  return (
    <section className="mt-6 border border-[#2a2a2a] bg-[#171717] px-8 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
      <div className="mb-5">
        <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#8b826f]">How we calculated this</p>
        <h2 className="text-2xl font-semibold tracking-tight text-[#f7f3eb]">Estimated deductions behind {locationLabel}</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="border border-[#2f2a22] bg-[#141414] px-5 py-5 text-sm text-[#d2c7b2]">
          <div className="flex items-center justify-between py-2">
            <span>Gross annual salary</span>
            <span className="font-medium text-[#f7f3eb]">{formatCurrency(breakdown.amount, 0)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-[#232323] py-2">
            <span>Estimated federal tax</span>
            <span className="font-medium text-[#f7f3eb]">{formatCurrency(breakdown.federalTax)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-[#232323] py-2">
            <span>Estimated state tax</span>
            <span className="font-medium text-[#f7f3eb]">{formatCurrency(breakdown.stateTax)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-[#232323] py-2">
            <span>Estimated local tax</span>
            <span className="font-medium text-[#f7f3eb]">{formatCurrency(breakdown.localTax)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-[#232323] py-2">
            <span>Social Security</span>
            <span className="font-medium text-[#f7f3eb]">{formatCurrency(breakdown.socialSecurity)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-[#232323] py-2">
            <span>Medicare</span>
            <span className="font-medium text-[#f7f3eb]">{formatCurrency(breakdown.medicare)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-[#232323] py-2">
            <span>Estimated net income</span>
            <span className="font-medium text-[#f7f3eb]">{formatCurrency(breakdown.netAnnual, 0)}</span>
          </div>
        </div>

        <div className="border border-[#3a3128] bg-[#151311] px-5 py-5 text-sm leading-7 text-[#d2c7b2]">
          <p>
            We show a planning estimate rather than a payroll stub. The calculator starts with gross salary, applies a simplified federal tax estimate, then layers in state and local tax where relevant, followed by Social Security and Medicare.
          </p>
          <p className="mt-3">
            Employer benefits, retirement contributions, insurance premiums, bonus pay, and filing-status nuances can all change your actual paycheck, so use this as a quick decision tool rather than a final payroll quote.
          </p>
        </div>
      </div>
    </section>
  );
}
