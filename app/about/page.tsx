import type { Metadata } from "next";
import InfoPageShell from "../components/InfoPageShell";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn what CalcTrio is and how these financial calculators are designed to help with everyday decisions.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <InfoPageShell title="About CalcTrio">
      <p>
        CalcTrio is a simple suite of financial calculators built to help with
        three core money decisions: understanding income, estimating payments,
        and projecting savings growth.
      </p>

      <p>
        The goal is to keep financial tools straightforward, fast, and easy to
        use. Instead of bouncing between unrelated websites, users can access
        connected calculators in one place and move naturally from one decision
        to the next.
      </p>

      <p>
        The salary calculator helps translate annual income into monthly,
        weekly, and hourly pay. The payment calculator helps estimate common
        loan and mortgage payments. The savings calculator helps show how
        steady monthly contributions can grow over time.
      </p>

      <p>
        CalcTrio is designed for clarity first. These tools are intended to
        give quick estimates that support everyday planning, budgeting, and
        comparison.
      </p>
    </InfoPageShell>
  );
}
