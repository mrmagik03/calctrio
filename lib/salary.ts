import { CITY_LOCATIONS, getCityByStateAndSlug, getCitiesForState, type CityTaxLocation } from "@/lib/cities";
import { getStateBySlug, type StateTax } from "@/lib/states";

export const DEFAULT_SALARY = 60000;
export const SALARY_GRID = Array.from({ length: 25 }, (_, index) => 30000 + index * 5000);
export const HOURLY_PRESETS = [20, 25, 30, 40, 50];
export const POPULAR_STATE_SLUGS = [
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

export const POPULAR_CITY_KEYS = [
  ["texas", "houston"],
  ["texas", "dallas"],
  ["texas", "austin"],
  ["california", "los-angeles"],
  ["california", "san-diego"],
  ["new-york", "new-york-city"],
  ["florida", "miami"],
  ["washington", "seattle"],
  ["illinois", "chicago"],
  ["georgia", "atlanta"],
] as const;

export type SalaryBreakdown = {
  amount: number;
  federalTax: number;
  stateTax: number;
  localTax: number;
  socialSecurity: number;
  medicare: number;
  totalTaxes: number;
  netAnnual: number;
  monthlyNet: number;
  biweeklyNet: number;
  weeklyNet: number;
  hourlyNet: number;
  monthlyGross: number;
  biweeklyGross: number;
  weeklyGross: number;
  hourlyGross: number;
  dailyGross: number;
  effectiveTaxRate: number;
};

export function normalizeSalaryInput(value: number): number {
  const rounded = Math.round(value / 5000) * 5000;
  if (rounded < 30000) return 30000;
  if (rounded > 150000) return 150000;
  return rounded;
}

export function readAmountParam(value: string | string[] | undefined | null): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(String(raw ?? "").replace(/[^0-9.-]/g, ""));
  return normalizeSalaryInput(Number.isFinite(parsed) ? parsed : DEFAULT_SALARY);
}

export function formatWholeCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCurrency(value: number, digits = 2): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function getSalaryBreakdown(amount: number, state?: StateTax | null, city?: CityTaxLocation | null): SalaryBreakdown {
  const federalTax = amount * 0.18;
  const stateTax = amount * (state?.taxRate ?? 0);
  const localTax = amount * (city?.localTaxRate ?? 0);
  const socialSecurity = Math.min(amount, 176100) * 0.062;
  const medicare = amount * 0.0145;
  const totalTaxes = federalTax + stateTax + localTax + socialSecurity + medicare;
  const netAnnual = Math.max(amount - totalTaxes, 0);

  return {
    amount,
    federalTax,
    stateTax,
    localTax,
    socialSecurity,
    medicare,
    totalTaxes,
    netAnnual,
    monthlyNet: netAnnual / 12,
    biweeklyNet: netAnnual / 26,
    weeklyNet: netAnnual / 52,
    hourlyNet: netAnnual / 2080,
    monthlyGross: amount / 12,
    biweeklyGross: amount / 26,
    weeklyGross: amount / 52,
    hourlyGross: amount / 2080,
    dailyGross: amount / 260,
    effectiveTaxRate: totalTaxes / amount,
  };
}

const HIGH_COST_CITY_SLUGS = new Set([
  "new-york-city",
  "san-francisco",
  "san-jose",
  "los-angeles",
  "seattle",
  "boston",
  "miami",
  "washington",
  "san-diego",
]);
const MEDIUM_HIGH_CITY_SLUGS = new Set([
  "austin",
  "denver",
  "portland",
  "houston",
  "dallas",
  "atlanta",
  "philadelphia",
  "chicago",
  "charlotte",
  "orlando",
]);

export function getCostProfile(state: StateTax, city?: CityTaxLocation | null) {
  const slug = city?.slug;
  if (slug && HIGH_COST_CITY_SLUGS.has(slug)) {
    return {
      label: "Higher-cost metro",
      index: 118,
      housingShare: 0.34,
      rentBand: "$1,900–$2,700",
      summary:
        "Housing and everyday costs usually eat a bigger share of take-home pay here, so rent-to-income planning matters more than in lower-cost metros.",
    };
  }
  if (slug && MEDIUM_HIGH_CITY_SLUGS.has(slug)) {
    return {
      label: "Above-average cost metro",
      index: 108,
      housingShare: 0.3,
      rentBand: "$1,500–$2,200",
      summary:
        "This metro tends to run a bit above the national baseline, especially on rent, insurance, and services.",
    };
  }
  if (city) {
    return {
      label: "Balanced cost metro",
      index: 101,
      housingShare: 0.27,
      rentBand: "$1,200–$1,900",
      summary:
        "This city typically lands closer to the national middle, so salary decisions are driven as much by taxes and housing choices as by headline cost differences.",
    };
  }
  if (["california", "new-york", "washington", "massachusetts"].includes(state.slug)) {
    return {
      label: "Higher-cost state",
      index: 110,
      housingShare: 0.31,
      rentBand: "$1,500–$2,300",
      summary:
        "The state average usually runs above the national baseline, so the same salary can feel tighter once rent and transportation are layered in.",
    };
  }
  if (["texas", "florida", "georgia", "north-carolina", "ohio", "michigan", "pennsylvania", "virginia"].includes(state.slug)) {
    return {
      label: "Mid-range state",
      index: 100,
      housingShare: 0.28,
      rentBand: "$1,200–$2,000",
      summary:
        "This state usually sits near the national midpoint, so local rent and commute costs often decide whether a salary feels stretched or comfortable.",
    };
  }
  return {
    label: "Lower-cost state",
    index: 95,
    housingShare: 0.25,
    rentBand: "$1,000–$1,700",
    summary:
      "Average living costs tend to run below the national midpoint, which can let more of the same paycheck flow into savings or debt payoff.",
  };
}

export function getNearbySalarySteps(amount: number): number[] {
  const currentIndex = SALARY_GRID.indexOf(amount);
  if (currentIndex === -1) return SALARY_GRID.slice(4, 9);
  const start = Math.max(0, currentIndex - 2);
  const end = Math.min(SALARY_GRID.length, currentIndex + 3);
  return SALARY_GRID.slice(start, end).filter((value) => value !== amount);
}

export function getPopularStates() {
  return POPULAR_STATE_SLUGS.map((slug) => getStateBySlug(slug)).filter(Boolean) as StateTax[];
}

export function getPopularCities() {
  return POPULAR_CITY_KEYS.map(([stateSlug, citySlug]) => getCityByStateAndSlug(stateSlug, citySlug)).filter(Boolean) as CityTaxLocation[];
}

export function getOverviewCitiesForState(stateSlug: string, limit = 6): CityTaxLocation[] {
  return getCitiesForState(stateSlug).slice(0, limit);
}

export function getNearbyCities(city: CityTaxLocation, limit = 6): CityTaxLocation[] {
  const sameState = city.nearby
    ?.map((slug) => CITY_LOCATIONS.find((entry) => entry.slug === slug))
    .filter(Boolean) as CityTaxLocation[] | undefined;

  const chosen = new Map<string, CityTaxLocation>();
  (sameState ?? []).forEach((entry) => chosen.set(entry.slug, entry));

  if (chosen.size < limit) {
    const extras = CITY_LOCATIONS.filter(
      (entry) => entry.slug !== city.slug && !chosen.has(entry.slug) && entry.stateSlug !== city.stateSlug,
    ).slice(0, limit - chosen.size);
    extras.forEach((entry) => chosen.set(entry.slug, entry));
  }

  return Array.from(chosen.values()).slice(0, limit);
}

export function buildSalaryPath(amount?: number | null, stateSlug?: string | null, citySlug?: string | null) {
  if (amount && stateSlug && citySlug) return `/salary/${amount}/${stateSlug}/${citySlug}`;
  if (amount && stateSlug) return `/salary/${amount}/${stateSlug}`;
  if (stateSlug && citySlug) return `/salary/${stateSlug}/${citySlug}`;
  if (stateSlug) return `/salary/${stateSlug}`;
  if (amount) return `/salary/${amount}`;
  return "/salary";
}

export function buildAmountQuery(amount: number) {
  return `?amount=${amount}`;
}

export function getStateHeadline(state: StateTax) {
  if (state.taxRate === 0) return `${state.name} salary overview with no state income tax`;
  return `${state.name} salary overview with estimated state income tax`;
}

export function getStateSummary(state: StateTax) {
  if (state.taxRate === 0) {
    return `${state.name} is one of the states where your paycheck is not reduced by a broad state income tax, so federal payroll taxes do most of the heavy lifting in this estimate.`;
  }
  return `${state.name} uses an estimated ${(state.taxRate * 100).toFixed(2)}% state income tax in this planning view, so a paycheck here lands lower than the same salary in a no-tax state.`;
}
