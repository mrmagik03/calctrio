export type StateTax = {
  slug: string;
  name: string;
  taxRate: number;
};

export const STATES: StateTax[] = [
  { slug: "arizona", name: "Arizona", taxRate: 0.045 },
  { slug: "california", name: "California", taxRate: 0.06 },
  { slug: "colorado", name: "Colorado", taxRate: 0.044 },
  { slug: "florida", name: "Florida", taxRate: 0 },
  { slug: "georgia", name: "Georgia", taxRate: 0.0575 },
  { slug: "illinois", name: "Illinois", taxRate: 0.0495 },
  { slug: "massachusetts", name: "Massachusetts", taxRate: 0.05 },
  { slug: "michigan", name: "Michigan", taxRate: 0.0425 },
  { slug: "new-jersey", name: "New Jersey", taxRate: 0.057 },
  { slug: "new-york", name: "New York", taxRate: 0.065 },
  { slug: "north-carolina", name: "North Carolina", taxRate: 0.0475 },
  { slug: "ohio", name: "Ohio", taxRate: 0.04 },
  { slug: "pennsylvania", name: "Pennsylvania", taxRate: 0.0307 },
  { slug: "texas", name: "Texas", taxRate: 0 },
  { slug: "virginia", name: "Virginia", taxRate: 0.0575 },
  { slug: "washington", name: "Washington", taxRate: 0 },
];

export function getStateBySlug(slug: string) {
  return STATES.find((state) => state.slug === slug);
}
