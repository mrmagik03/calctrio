import Link from "next/link";
import type { ReactNode } from "react";

type InfoPageShellProps = {
  title: string;
  children: ReactNode;
};

export default function InfoPageShell({ title, children }: InfoPageShellProps) {
  return (
    <main className="min-h-screen bg-[#111111] text-[#f7f3eb] px-6 py-12">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-between">
        <div className="flex flex-1 flex-col items-center justify-center">
          <nav className="mb-10 flex flex-wrap justify-center gap-6 text-sm text-[#b29f7a]">
            <Link href="/" className="hover:text-[#f7f3eb]">
              Home
            </Link>
            <Link href="/salary" className="hover:text-[#f7f3eb]">
              Salary
            </Link>
            <Link href="/payment" className="hover:text-[#f7f3eb]">
              Payment
            </Link>
            <Link href="/savings" className="hover:text-[#f7f3eb]">
              Savings
            </Link>
          </nav>

          <div className="w-full max-w-3xl rounded-xl border border-[#2a2a2a] bg-[#171717] px-8 py-10 shadow-[0_12px_32px_rgba(0,0,0,0.28)]">
            <h1 className="mb-6 text-center text-4xl font-bold text-[#f7f3eb]">
              {title}
            </h1>

            <div className="space-y-6 text-lg leading-8 text-[#d2c7b2]">{children}</div>
          </div>
        </div>

        <footer className="mt-12 text-center text-sm text-[#a89f8f]">
          <div className="mb-2 flex flex-wrap justify-center gap-6">
            <Link href="/about" className="hover:text-[#f7f3eb]">
              About
            </Link>
            <Link href="/methodology" className="hover:text-[#f7f3eb]">
              Methodology
            </Link>
            <Link href="/disclaimer" className="hover:text-[#f7f3eb]">
              Disclaimer
            </Link>
            <Link href="/privacy" className="hover:text-[#f7f3eb]">
              Privacy
            </Link>
          </div>

          <p>© {new Date().getFullYear()} CalcTrio</p>
        </footer>
      </div>
    </main>
  );
}
