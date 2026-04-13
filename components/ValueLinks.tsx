import Link from "next/link";

type State = {
  slug: string;
  name: string;
  shortName?: string;
};

type ValueLinksProps = {
  amount: number;
  type?: "salary-location" | "default";
  currentState?: string;
};

const STATES: State[] = [
  { slug: "arizona", name: "Arizona" },
  { slug: "california", name: "California" },
  { slug: "colorado", name: "Colorado" },
  { slug: "florida", name: "Florida" },
  { slug: "georgia", name: "Georgia" },
  { slug: "illinois", name: "Illinois" },
  { slug: "massachusetts", name: "Massachusetts", shortName: "Mass." },
  { slug: "michigan", name: "Michigan" },
  { slug: "new-jersey", name: "New Jersey", shortName: "N. Jersey" },
  { slug: "new-york", name: "New York" },
  { slug: "north-carolina", name: "North Carolina", shortName: "N. Carolina" },
  { slug: "ohio", name: "Ohio" },
  { slug: "pennsylvania", name: "Pennsylvania", shortName: "Penn." },
  { slug: "texas", name: "Texas" },
  { slug: "virginia", name: "Virginia" },
  { slug: "washington", name: "Washington" },
];

function ConversionCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link href={href} className="tile-link p-4">
      <div className="text-sm font-semibold leading-5 text-white">{title}</div>
      <p className="mt-2 text-xs leading-5 text-neutral-300">{description}</p>
    </Link>
  );
}

function StatePill({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link href={href} className="pill-link" title={label}>
      <span>{label}</span>
    </Link>
  );
}

export default function ValueLinks({
  amount,
  type = "default",
  currentState,
}: ValueLinksProps) {
  const conversionLinks = [
    {
      href: `/salary/${amount}/to-hourly`,
      title: "Salary to hourly",
      description: "See the hourly rate for this yearly salary.",
    },
    {
      href: `/salary/${amount}/monthly`,
      title: "Salary to monthly",
      description: "Break annual salary into monthly income.",
    },
    {
      href: `/salary/${amount}/biweekly`,
      title: "Salary to biweekly",
      description: "Estimate each paycheck on a biweekly schedule.",
    },
    {
      href: `/salary/${amount}`,
      title: "State take-home compare",
      description: "Compare take-home pay across popular states.",
    },
  ];

  const otherStates =
    type === "salary-location"
      ? STATES.filter((state) => state.slug !== currentState)
      : [];

  return (
    <div className="space-y-10">
      <section>
        <h2 className="section-title">Explore more salary views</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400">
          Use these related pages to compare gross pay, paycheck timing, and
          take-home estimates and state comparisons.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {conversionLinks.map((link) => (
            <ConversionCard
              key={link.href}
              href={link.href}
              title={link.title}
              description={link.description}
            />
          ))}
        </div>
      </section>

      {type === "salary-location" && otherStates.length > 0 && (
        <section>
          <h2 className="section-title">
            Compare this salary in other states
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {otherStates.map((state) => (
              <StatePill
                key={state.slug}
                href={`/salary/${amount}/${state.slug}`}
                label={state.shortName || state.name}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
