export function toNumber(value: string | number | undefined | null): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (!value) return 0;
  const cleaned = String(value).replace(/[^0-9.-]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function clampSalaryForSeo(value: number): number {
  const rounded = Math.round(value || 0);
  if (rounded < 10000) return 10000;
  if (rounded > 500000) return 500000;
  return rounded;
}

export function clampHourlyForSeo(value: number): number {
  const rounded = Math.round((value || 0) * 100) / 100;
  if (rounded < 8) return 8;
  if (rounded > 500) return 500;
  return rounded;
}

export function annualSalaryToMonthly(salary: number): number {
  return salary / 12;
}

export function annualSalaryToBiweekly(salary: number): number {
  return salary / 26;
}

export function annualSalaryToHourly(
  salary: number,
  hoursPerWeek = 40,
  weeksPerYear = 52,
): number {
  return salary / (hoursPerWeek * weeksPerYear);
}

export function hourlyToAnnualSalary(
  hourly: number,
  hoursPerWeek = 40,
  weeksPerYear = 52,
): number {
  return hourly * hoursPerWeek * weeksPerYear;
}

export function formatCurrency(value: number, maximumFractionDigits = 2): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits,
    minimumFractionDigits: maximumFractionDigits === 0 ? 0 : 2,
  }).format(value);
}
