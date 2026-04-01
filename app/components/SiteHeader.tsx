"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/salary", label: "Salary" },
  { href: "/loan", label: "Loan" },
  { href: "/savings", label: "Savings" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-[#201c18] bg-[#0f0f0f]/95">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="text-lg font-semibold tracking-[0.01em] text-[#f7f3eb] transition-colors duration-200 hover:text-[#d8b07a]"
        >
          CalcTrio
        </Link>

        <nav className="flex items-center gap-5 text-sm text-[#b29f7a]">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors duration-200 hover:text-[#f7f3eb] ${
                  active ? "text-[#f7f3eb]" : "text-[#b29f7a]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
