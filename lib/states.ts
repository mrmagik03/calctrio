export type StateTax = {
  slug: string;
  name: string;
  taxRate: number;
  aliases?: string[];
};

export const STATES: StateTax[] = [
  { slug: "alabama", name: "Alabama", taxRate: 0.05 },
  { slug: "alaska", name: "Alaska", taxRate: 0 },
  { slug: "arizona", name: "Arizona", taxRate: 0.025, aliases: ["az"] },
  { slug: "arkansas", name: "Arkansas", taxRate: 0.047 },
  { slug: "california", name: "California", taxRate: 0.08, aliases: ["ca"] },
  { slug: "colorado", name: "Colorado", taxRate: 0.044, aliases: ["co"] },
  { slug: "connecticut", name: "Connecticut", taxRate: 0.05 },
  { slug: "delaware", name: "Delaware", taxRate: 0.052 },
  { slug: "district-of-columbia", name: "District of Columbia", taxRate: 0.06, aliases: ["districtcolumbia", "dc"] },
  { slug: "florida", name: "Florida", taxRate: 0, aliases: ["fl"] },
  { slug: "georgia", name: "Georgia", taxRate: 0.053, aliases: ["ga"] },
  { slug: "hawaii", name: "Hawaii", taxRate: 0.075 },
  { slug: "idaho", name: "Idaho", taxRate: 0.058 },
  { slug: "illinois", name: "Illinois", taxRate: 0.0495, aliases: ["il"] },
  { slug: "indiana", name: "Indiana", taxRate: 0.0315 },
  { slug: "iowa", name: "Iowa", taxRate: 0.057 },
  { slug: "kansas", name: "Kansas", taxRate: 0.052 },
  { slug: "kentucky", name: "Kentucky", taxRate: 0.045 },
  { slug: "louisiana", name: "Louisiana", taxRate: 0.03 },
  { slug: "maine", name: "Maine", taxRate: 0.062 },
  { slug: "maryland", name: "Maryland", taxRate: 0.05 },
  { slug: "massachusetts", name: "Massachusetts", taxRate: 0.05, aliases: ["ma"] },
  { slug: "michigan", name: "Michigan", taxRate: 0.0425, aliases: ["mi"] },
  { slug: "minnesota", name: "Minnesota", taxRate: 0.068 },
  { slug: "mississippi", name: "Mississippi", taxRate: 0.047 },
  { slug: "missouri", name: "Missouri", taxRate: 0.047 },
  { slug: "montana", name: "Montana", taxRate: 0.059 },
  { slug: "nebraska", name: "Nebraska", taxRate: 0.058 },
  { slug: "nevada", name: "Nevada", taxRate: 0 },
  { slug: "new-hampshire", name: "New Hampshire", taxRate: 0, aliases: ["newhampshire"] },
  { slug: "new-jersey", name: "New Jersey", taxRate: 0.057, aliases: ["newjersey"] },
  { slug: "new-mexico", name: "New Mexico", taxRate: 0.049, aliases: ["newmexico"] },
  { slug: "new-york", name: "New York", taxRate: 0.06, aliases: ["newyork"] },
  { slug: "north-carolina", name: "North Carolina", taxRate: 0.0475, aliases: ["northcarolina"] },
  { slug: "north-dakota", name: "North Dakota", taxRate: 0.025, aliases: ["northdakota"] },
  { slug: "ohio", name: "Ohio", taxRate: 0.035, aliases: ["oh"] },
  { slug: "oklahoma", name: "Oklahoma", taxRate: 0.04 },
  { slug: "oregon", name: "Oregon", taxRate: 0.075 },
  { slug: "pennsylvania", name: "Pennsylvania", taxRate: 0.0307, aliases: ["pa"] },
  { slug: "rhode-island", name: "Rhode Island", taxRate: 0.05, aliases: ["rhodeisland"] },
  { slug: "south-carolina", name: "South Carolina", taxRate: 0.062, aliases: ["southcarolina"] },
  { slug: "south-dakota", name: "South Dakota", taxRate: 0, aliases: ["southdakota"] },
  { slug: "tennessee", name: "Tennessee", taxRate: 0 },
  { slug: "texas", name: "Texas", taxRate: 0, aliases: ["tx"] },
  { slug: "utah", name: "Utah", taxRate: 0.0485 },
  { slug: "vermont", name: "Vermont", taxRate: 0.06 },
  { slug: "virginia", name: "Virginia", taxRate: 0.0575, aliases: ["va"] },
  { slug: "washington", name: "Washington", taxRate: 0, aliases: ["wa"] },
  { slug: "west-virginia", name: "West Virginia", taxRate: 0.051, aliases: ["westvirginia"] },
  { slug: "wisconsin", name: "Wisconsin", taxRate: 0.053 },
  { slug: "wyoming", name: "Wyoming", taxRate: 0 },
];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z]/g, "");
}

export function getStateBySlug(slug: string) {
  const target = normalize(slug);
  return STATES.find((state) => {
    if (normalize(state.slug) === target) return true;
    return state.aliases?.some((alias) => normalize(alias) === target);
  });
}
