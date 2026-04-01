import LinkCard from "@/app/components/LinkCard";

export default function PaymentLinks({
  type,
  amount,
  rate,
  term,
}: {
  type: "car" | "boat";
  amount: number;
  rate: number;
  term: number;
}) {
  const base = type === "car" ? "/car-payment" : "/boat-payment";
  const otherBase = type === "car" ? "/boat-payment" : "/car-payment";
  const label = type === "car" ? "car" : "boat";
  const otherLabel = type === "car" ? "boat" : "car";

  const links = [
    {
      href: `${base}/${amount}/${Math.max(3, rate - 1)}/${term}`,
      title: `${rate - 1}% ${label} payment`,
      description: `See how a lower rate changes the monthly payment.`,
    },
    {
      href: `${base}/${amount}/${rate}/${term === 72 ? 60 : 72}`,
      title: `${term === 72 ? 60 : 72} month ${label} payment`,
      description: `Compare a different loan term with the same amount and rate.`,
    },
    {
      href: `${base}/${amount + 10000}/${rate}/${term}`,
      title: `Higher ${label} amount`,
      description: `Compare the payment on a larger loan amount.`,
    },
    {
      href: `${otherBase}/${amount}/${rate}/${type === "car" ? 120 : 72}`,
      title: `${otherLabel} payment version`,
      description: `Jump to the ${otherLabel} calculator using a similar loan amount.`,
    },
  ];

  return (
    <div className="rounded-2xl border border-white/25 bg-black/40 p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-white">Explore more payment pages</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-100">
        Compare nearby payment scenarios to understand how loan amount, rate, and term change your monthly cost.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <LinkCard key={link.href} href={link.href} title={link.title} description={link.description} />
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-white/25 bg-black/50 p-4">
        <h3 className="text-base font-semibold text-white">Related tools</h3>
        <p className="mt-2 text-sm text-neutral-100">
          For pay and income planning, visit{" "}
          <a href="https://calctrio.com">CalcTrio salary tools</a>.
        </p>
      </div>
    </div>
  );
}
