export const metadata = {
  title: "Privacy Policy | CalcTrio",
  description:
    "Learn how CalcTrio handles information and website usage data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen flex flex-col justify-between bg-[#111111] text-[#f7f3eb] px-6 py-12">
      <div className="flex flex-1 flex-col items-center justify-center">
        <nav className="mb-10 flex gap-6 text-sm text-[#b29f7a]">
          <a href="/" className="hover:text-[#f7f3eb]">
            Home
          </a>
          <a href="/salary" className="hover:text-[#f7f3eb]">
            Salary
          </a>
          <a href="/payment" className="hover:text-[#f7f3eb]">
            Payment
          </a>
          <a href="/savings" className="hover:text-[#f7f3eb]">
            Savings
          </a>
        </nav>

        <div className="w-full max-w-3xl border border-[#2a2a2a] bg-[#171717] px-8 py-10 shadow-[0_12px_32px_rgba(0,0,0,0.28)]">
          <h1 className="mb-6 text-center text-4xl font-bold text-[#f7f3eb]">
            Privacy Policy
          </h1>

          <div className="space-y-6 text-lg leading-8 text-[#d2c7b2]">
            <p>
              CalcTrio does not require users to create an account or submit
              personal financial information to use its calculators.
            </p>

            <p>
              Basic website usage data may be collected through standard
              analytics tools, cookies, or hosting providers to help improve
              site performance, understand traffic patterns, and maintain site
              reliability.
            </p>

            <p>
              Information collected through analytics tools is typically
              aggregated and does not directly identify individual users.
            </p>

            <p>
              CalcTrio may update this Privacy Policy from time to time as site
              features, analytics, or services change.
            </p>

            <p>
              By using this website, you agree to this Privacy Policy.
            </p>
          </div>
        </div>
      </div>

      <footer className="mt-12 text-center text-sm text-[#a89f8f]">
        <div className="mb-2 flex justify-center gap-6">
          <a href="/about" className="hover:text-[#f7f3eb]">
            About
          </a>
          <a href="/methodology" className="hover:text-[#f7f3eb]">
            Methodology
          </a>
          <a href="/disclaimer" className="hover:text-[#f7f3eb]">
            Disclaimer
          </a>
          <a href="/privacy" className="hover:text-[#f7f3eb]">
            Privacy
          </a>
        </div>

        <p>© {new Date().getFullYear()} CalcTrio</p>
      </footer>
    </main>
  );
}