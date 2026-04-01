export type LoanCategoryKey = "generic" | "car" | "boat" | "rv";

export type LoanCategory = {
  key: LoanCategoryKey;
  slug: "car" | "boat" | "rv";
  label: string;
  shortLabel: string;
  title: string;
  headline: string;
  intro: string;
  helperText: string;
  detailText: string;
  defaultRate: number;
  defaultYears: number;
  quickExamples: number[];
  heroImage: string;
  cardImage: string;
};

export const genericExamples: number[] = [
  10000, 15000, 20000, 25000, 30000, 40000, 50000, 75000, 100000, 150000,
  200000, 250000,
];

export const loanCategories: Record<"car" | "boat" | "rv", LoanCategory> = {
  car: {
    key: "car",
    slug: "car",
    label: "Car Loan Calculator",
    shortLabel: "Car",
    title: "Car Loan Calculator",
    headline: "Estimate your next car payment with a clean, realistic starting point.",
    intro:
      "Run the numbers before you shop, compare trims, or negotiate with a dealer.",
    helperText: "Typical car loans: 3–6 years at ~5–8% APR.",
    detailText:
      "Use this car loan calculator to estimate monthly payment, total paid, and total interest before stepping onto the lot.",
    defaultRate: 6.5,
    defaultYears: 5,
    quickExamples: [10000, 15000, 20000, 25000, 30000, 35000, 40000, 50000],
    heroImage:
      "linear-gradient(180deg,rgba(16,16,16,0.40),rgba(16,16,16,0.88)), url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80')",
    cardImage:
      "linear-gradient(180deg,rgba(24,24,24,0.72),rgba(16,16,16,0.94)), url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80')",
  },
  boat: {
    key: "boat",
    slug: "boat",
    label: "Boat Loan Calculator",
    shortLabel: "Boat",
    title: "Boat Loan Calculator",
    headline:
      "See what the monthly cost looks like before the trailer, fuel, and add-ons enter the picture.",
    intro:
      "Use a realistic payment estimate before you start looking at options that stretch the budget.",
    helperText: "Typical boat loans: 7–12 years at ~6.5–8% APR.",
    detailText:
      "Use this boat loan calculator to estimate monthly payment, total paid, and total interest for common recreational boat prices.",
    defaultRate: 7,
    defaultYears: 10,
    quickExamples: [15000, 20000, 30000, 40000, 50000, 75000, 100000, 150000],
    heroImage:
      "linear-gradient(180deg,rgba(16,16,16,0.40),rgba(16,16,16,0.88)), url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80')",
    cardImage:
      "linear-gradient(180deg,rgba(22,22,22,0.65),rgba(15,15,15,0.94)), url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80')",
  },
  rv: {
    key: "rv",
    slug: "rv",
    label: "RV Loan Calculator",
    shortLabel: "RV",
    title: "RV Loan Calculator",
    headline:
      "Run the monthly math before you start picturing the first long weekend away.",
    intro:
      "Use a grounded RV payment estimate for motorhomes, campers, and travel trailers before you commit.",
    helperText: "Typical RV loans: 10–15 years at ~6.5–7.5% APR.",
    detailText:
      "Use this RV loan calculator to estimate monthly payment, total paid, and total interest for common RV budgets.",
    defaultRate: 6.75,
    defaultYears: 12,
    quickExamples: [20000, 30000, 40000, 50000, 75000, 100000, 150000, 200000],
    heroImage:
      "linear-gradient(180deg,rgba(16,16,16,0.40),rgba(16,16,16,0.88)), url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80')",
    cardImage:
      "linear-gradient(180deg,rgba(22,22,22,0.72),rgba(15,15,15,0.94)), url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80')",
  },
};

export function isValidAmount(value: string) {
  return /^\d+$/.test(value);
}

export function formatCurrency(num: number, decimals = 2) {
  return num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatWholeCurrency(num: number) {
  return formatCurrency(num, 0);
}

export function sanitizeCurrencyInput(value: string) {
  return value.replace(/[^0-9.]/g, "");
}

export function sanitizeWholeNumberInput(value: string) {
  return value.replace(/[^0-9]/g, "");
}

export function parseNumber(value: string) {
  const cleaned = sanitizeCurrencyInput(value);
  if (!cleaned) return 0;

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatInputCurrency(value: string) {
  const num = parseNumber(value);
  if (!num) return "";

  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatRateInput(value: string) {
  const num = parseNumber(value);
  return num.toFixed(2);
}

export type ExtraPaymentResult = {
  months: number;
  totalPaid: number;
  valid: boolean;
};

export function calculateMonthsWithExtraPayment(
  principal: number,
  annualRate: number,
  monthlyPayment: number,
  extraPayment: number
): ExtraPaymentResult {
  const paymentPerMonth = monthlyPayment + extraPayment;

  if (principal <= 0 || paymentPerMonth <= 0) {
    return { months: 0, totalPaid: 0, valid: false };
  }

  if (annualRate === 0) {
    const months = Math.ceil(principal / paymentPerMonth);
    return { months, totalPaid: paymentPerMonth * months, valid: true };
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
      return { months: 0, totalPaid: 0, valid: false };
    }

    const actualPayment =
      balance + interest < paymentPerMonth ? balance + interest : paymentPerMonth;

    balance = Math.max(0, balance + interest - paymentPerMonth);
    totalPaid += actualPayment;
    months += 1;
  }

  if (months >= maxMonths) {
    return { months: 0, totalPaid: 0, valid: false };
  }

  return { months, totalPaid, valid: true };
}

export function calculateLoanResults(
  principal: number,
  annualRate: number,
  years: number
) {
  const months = years * 12;
  if (principal <= 0 || years <= 0 || months <= 0) return null;

  if (annualRate === 0) {
    const monthlyPayment = principal / months;
    const totalPaid = monthlyPayment * months;
    return {
      principal,
      annualRate,
      years,
      months,
      monthlyPayment,
      totalPaid,
      totalInterest: totalPaid - principal,
    };
  }

  const monthlyRate = annualRate / 100 / 12;
  const monthlyPayment =
    (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

  if (!Number.isFinite(monthlyPayment)) return null;

  const totalPaid = monthlyPayment * months;
  return {
    principal,
    annualRate,
    years,
    months,
    monthlyPayment,
    totalPaid,
    totalInterest: totalPaid - principal,
  };
}

export function getNearbyExamples(currentAmount: number, examples: number[], count = 5) {
  const currentIndex = examples.indexOf(currentAmount);

  if (currentIndex === -1) {
    return examples.slice(0, count);
  }

  const halfWindow = Math.floor(count / 2);
  const start = Math.max(0, currentIndex - halfWindow);
  const end = Math.min(examples.length, currentIndex + halfWindow + 1);
  return examples.slice(start, end).filter((amount) => amount !== currentAmount);
}
