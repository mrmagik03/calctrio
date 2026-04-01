"use client";

const STATE_NAMES: Record<string, string> = {
  alabama: "Alabama",
  alaska: "Alaska",
  arizona: "Arizona",
  arkansas: "Arkansas",
  california: "California",
  colorado: "Colorado",
  connecticut: "Connecticut",
  delaware: "Delaware",
  florida: "Florida",
  georgia: "Georgia",
  hawaii: "Hawaii",
  idaho: "Idaho",
  illinois: "Illinois",
  indiana: "Indiana",
  iowa: "Iowa",
  kansas: "Kansas",
  kentucky: "Kentucky",
  louisiana: "Louisiana",
  maine: "Maine",
  maryland: "Maryland",
  massachusetts: "Massachusetts",
  michigan: "Michigan",
  minnesota: "Minnesota",
  mississippi: "Mississippi",
  missouri: "Missouri",
  montana: "Montana",
  nebraska: "Nebraska",
  nevada: "Nevada",
  "new-hampshire": "New Hampshire",
  "new-jersey": "New Jersey",
  "new-mexico": "New Mexico",
  "new-york": "New York",
  "north-carolina": "North Carolina",
  "north-dakota": "North Dakota",
  ohio: "Ohio",
  oklahoma: "Oklahoma",
  oregon: "Oregon",
  pennsylvania: "Pennsylvania",
  "rhode-island": "Rhode Island",
  "south-carolina": "South Carolina",
  "south-dakota": "South Dakota",
  tennessee: "Tennessee",
  texas: "Texas",
  utah: "Utah",
  vermont: "Vermont",
  virginia: "Virginia",
  washington: "Washington",
  "west-virginia": "West Virginia",
  wisconsin: "Wisconsin",
  wyoming: "Wyoming",
  "district-of-columbia": "District of Columbia",
};

const STATE_SLUGS = Object.keys(STATE_NAMES);

type Props = {
  amount: number;
  stateKey: string;
};

export default function StateJumpSelect({ amount, stateKey }: Props) {
  return (
    <select
      value={stateKey}
      onChange={(e) => {
        const newState = e.target.value;
        window.location.href = `/salary/${amount}/after-tax/${newState}`;
      }}
      className="w-full border border-[#2f2a22] bg-[#1b1b1b] px-4 py-3 text-white focus:border-[#b29f7a] focus:outline-none"
    >
      {STATE_SLUGS.map((slug) => (
        <option key={slug} value={slug}>
          {STATE_NAMES[slug]}
        </option>
      ))}
    </select>
  );
}