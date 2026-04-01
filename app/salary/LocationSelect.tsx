"use client";

const STATES = [
  { slug: "alabama", name: "Alabama" },
  { slug: "alaska", name: "Alaska" },
  { slug: "arizona", name: "Arizona" },
  { slug: "arkansas", name: "Arkansas" },
  { slug: "california", name: "California" },
  { slug: "colorado", name: "Colorado" },
  { slug: "connecticut", name: "Connecticut" },
  { slug: "delaware", name: "Delaware" },
  { slug: "florida", name: "Florida" },
  { slug: "georgia", name: "Georgia" },
  { slug: "hawaii", name: "Hawaii" },
  { slug: "idaho", name: "Idaho" },
  { slug: "illinois", name: "Illinois" },
  { slug: "indiana", name: "Indiana" },
  { slug: "iowa", name: "Iowa" },
  { slug: "kansas", name: "Kansas" },
  { slug: "kentucky", name: "Kentucky" },
  { slug: "louisiana", name: "Louisiana" },
  { slug: "maine", name: "Maine" },
  { slug: "maryland", name: "Maryland" },
  { slug: "massachusetts", name: "Massachusetts" },
  { slug: "michigan", name: "Michigan" },
  { slug: "minnesota", name: "Minnesota" },
  { slug: "mississippi", name: "Mississippi" },
  { slug: "missouri", name: "Missouri" },
  { slug: "montana", name: "Montana" },
  { slug: "nebraska", name: "Nebraska" },
  { slug: "nevada", name: "Nevada" },
  { slug: "new-hampshire", name: "New Hampshire" },
  { slug: "new-jersey", name: "New Jersey" },
  { slug: "new-mexico", name: "New Mexico" },
  { slug: "new-york", name: "New York" },
  { slug: "north-carolina", name: "North Carolina" },
  { slug: "north-dakota", name: "North Dakota" },
  { slug: "ohio", name: "Ohio" },
  { slug: "oklahoma", name: "Oklahoma" },
  { slug: "oregon", name: "Oregon" },
  { slug: "pennsylvania", name: "Pennsylvania" },
  { slug: "rhode-island", name: "Rhode Island" },
  { slug: "south-carolina", name: "South Carolina" },
  { slug: "south-dakota", name: "South Dakota" },
  { slug: "tennessee", name: "Tennessee" },
  { slug: "texas", name: "Texas" },
  { slug: "utah", name: "Utah" },
  { slug: "vermont", name: "Vermont" },
  { slug: "virginia", name: "Virginia" },
  { slug: "washington", name: "Washington" },
  { slug: "west-virginia", name: "West Virginia" },
  { slug: "wisconsin", name: "Wisconsin" },
  { slug: "wyoming", name: "Wyoming" },
  { slug: "district-of-columbia", name: "District of Columbia" },
];

export default function LocationSelect() {
  return (
    <div className="mt-6">
      <label
        htmlFor="salary-location-select"
        className="mb-2 block text-sm text-zinc-300"
      >
        Browse salary after-tax pages by state
      </label>

      <select
        id="salary-location-select"
        defaultValue=""
        className="w-full max-w-md border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-white/20"
        onChange={(e) => {
          if (e.target.value) {
            window.location.href = e.target.value;
          }
        }}
      >
        <option value="" disabled>
          Select a state
        </option>

        {STATES.map((state) => (
          <option
            key={state.slug}
            value={`/salary/60000/after-tax/${state.slug}`}
          >
            {state.name}
          </option>
        ))}
      </select>
    </div>
  );
}