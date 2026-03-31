import type { Metadata } from "next";
import InfoPageShell from "../components/InfoPageShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how CalcTrio handles information and website usage data.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <InfoPageShell title="Privacy Policy">
      <p>
        CalcTrio does not require users to create an account or submit personal
        financial information to use its calculators.
      </p>

      <p>
        Basic website usage data may be collected through standard analytics
        tools, cookies, or hosting providers to help improve site performance,
        understand traffic patterns, and maintain site reliability.
      </p>

      <p>
        Information collected through analytics tools is typically aggregated
        and does not directly identify individual users.
      </p>

      <p>
        CalcTrio may update this Privacy Policy from time to time as site
        features, analytics, or services change.
      </p>

      <p>By using this website, you agree to this Privacy Policy.</p>
    </InfoPageShell>
  );
}
