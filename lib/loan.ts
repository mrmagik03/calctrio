export function toNumber(value: string): number {
  const clean = value.replace(/[^0-9.]/g, "");
  const parsed = Number(clean);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function formatCurrency(value: number, maximumFractionDigits = 2): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: maximumFractionDigits === 0 ? 0 : 2,
    maximumFractionDigits,
  }).format(value);
}

export function calculateLoanPayment(principal: number, annualRate: number, months: number) {
  const monthlyRate = annualRate / 100 / 12;

  if (monthlyRate === 0) {
    const monthlyPayment = principal / months;
    const totalPaid = monthlyPayment * months;
    return {
      monthlyPayment,
      totalPaid,
      totalInterest: totalPaid - principal,
    };
  }

  const monthlyPayment =
    principal *
    (monthlyRate / (1 - Math.pow(1 + monthlyRate, -months)));

  const totalPaid = monthlyPayment * months;
  const totalInterest = totalPaid - principal;

  return {
    monthlyPayment,
    totalPaid,
    totalInterest,
  };
}

export function buildTermExamples(type: "car" | "boat") {
  return type === "car" ? [36, 48, 60, 72, 84] : [60, 84, 120, 144, 180];
}

export function buildRateExamples() {
  return [4, 5, 6, 7, 8];
}

export function buildAmountExamples(type: "car" | "boat") {
  return type === "car"
    ? [20000, 30000, 40000, 50000, 60000, 75000, 100000]
    : [30000, 50000, 70000, 90000, 110000];
}
