import Link from "next/link";
import SiteHeader from "@/app/components/SiteHeader";

export type Crumb = {
  href?: string;
  label: string;
};

export default function SalaryPageScaffold({
  crumbs,
  children,
}: {
  crumbs: Crumb[];
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#111111] text-[#f7f3eb]">
      <SiteHeader />
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Link
            href="/salary"
            className="inline-flex items-center border border-[#2f2a22] bg-[#1f1b16] px-4 py-2 text-sm font-medium text-[#f7f3eb] transition-colors duration-200 hover:border-[#b29f7a] hover:bg-[#262119]"
          >
            ← Back to Salary Calculator
          </Link>
          <nav className="text-sm text-[#9f9486]">
            {crumbs.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`}>
                {index > 0 ? <span className="mx-2">/</span> : null}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-[#f7f3eb]">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[#f7f3eb]">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        </div>
        {children}
      </div>
    </main>
  );
}
