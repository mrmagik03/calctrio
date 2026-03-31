import type { Metadata } from "next";
import InfoPageShell from "../components/InfoPageShell";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Important information about the limitations of CalcTrio calculators.",
  alternates: {
    canonical: "/disclaimer",
  },
};

export default function DisclaimerPage() {
  return (
    <InfoPageShell title="Disclaimer">
      <p>
        The calculators and information provided on CalcTrio are for
        informational and estimation purposes only. They are not intended to
        provide financial, investment, tax, or legal advice.
      </p>

      <p>
        While every effort is made to ensure accuracy, results are based on
        simplified formulas and assumptions and may not reflect real-world
        outcomes. Actual figures may vary depending on factors such as taxes,
        fees, interest rate changes, and individual financial situations.
      </p>

      <p>
        Users should verify all results and consult with a qualified
        professional before making financial decisions.
      </p>

      <p>
        CalcTrio makes no guarantees regarding the accuracy, completeness, or
        reliability of the information provided.
      </p>
    </InfoPageShell>
  );
}
