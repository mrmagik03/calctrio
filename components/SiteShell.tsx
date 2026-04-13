import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

export default function SiteShell({
  children,
  theme,
}: {
  children: ReactNode;
  theme?: CSSProperties;
}) {
  return (
    <div className="site-frame ambient-top ambient-bottom" style={theme}>
      <header className="site-header">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <Link href="/" className="text-sm font-semibold tracking-wide text-white">
            CalcTrio
          </Link>

          <nav className="flex flex-wrap items-center gap-4 text-sm text-neutral-300">
            <Link href="/loan" className="hover:text-white">
              Loan
            </Link>
            <Link href="/salary" className="hover:text-white">
              Salary
            </Link>
            <Link href="/hourly/25/to-salary" className="hover:text-white">
              Hourly
            </Link>
            <Link href="/salary" className="hover:text-white">
              State Compare
            </Link>
            <Link href="/savings" className="hover:text-white">
              Savings
            </Link>
          </nav>
        </div>
      </header>

      {children}

      <footer className="mx-auto w-full max-w-6xl px-4 pb-10 md:px-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-6">
          <h2 className="text-2xl font-semibold text-white">Related tools</h2>
          <p className="mt-3 text-neutral-300">
            Explore more calculators across loans, salary, hourly pay, and savings.
          </p>

          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <Link href="/loan" className="underline underline-offset-4 hover:text-white">
              Loan calculator
            </Link>
            <Link href="/salary" className="underline underline-offset-4 hover:text-white">
              Salary calculator
            </Link>
            <Link
              href="/hourly/25/to-salary"
              className="underline underline-offset-4 hover:text-white"
            >
              Hourly to salary
            </Link>
            <Link href="/savings" className="underline underline-offset-4 hover:text-white">
              Savings calculator
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}