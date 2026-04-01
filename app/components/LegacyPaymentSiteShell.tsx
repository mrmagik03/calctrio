import Link from "next/link";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-white/20 bg-black/35 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 md:px-6">
          <Link href="/" className="text-sm font-semibold tracking-wide text-white">
            CalcTrio
          </Link>

          <nav className="flex items-center gap-5 text-sm text-neutral-100">
            <Link href="/car-payment/50000/6/72" className="hover:text-white">
              Car
            </Link>
            <Link href="/boat-payment/50000/7/120" className="hover:text-white">
              Boat
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        {children}
      </main>
    </div>
  );
}
