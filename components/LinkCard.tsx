import Link from "next/link";
import type { ReactNode } from "react";

export default function LinkCard({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="tile-link">
      {children}
    </Link>
  );
}
