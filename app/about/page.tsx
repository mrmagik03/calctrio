export const metadata = {
  title: "About | CalcTrio",
  description:
    "Learn what CalcTrio is and how these financial calculators are designed to help with everyday decisions.",
};

export default function AboutPage() {
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
            About CalcTrio
          </h1>

          <div className="space-y-6 text-lg leading-8 text-[#d2c7b2]">
            <p>
              CalcTrio is a simple suite of financial calculators built to help
              with three core money decisions: understanding income, estimating
              payments, and projecting savings growth.
            </p>

            <p>
              The goal is to keep financial tools straightforward, fast, and
              easy to use. Instead of bouncing between unrelated websites,
              users can access connected calculators in one place and move
              naturally from one decision to the next.
            </p>

            <p>
              The salary calculator helps translate annual income into monthly,
              weekly, and hourly pay. The payment calculator helps estimate
              common loan and mortgage payments. The savings calculator helps
              show how steady monthly contributions can grow over time.
            </p>

            <p>
              CalcTrio is designed for clarity first. These tools are intended
              to give quick estimates that support everyday planning,
              budgeting, and comparison.
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