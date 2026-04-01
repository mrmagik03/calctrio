import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-12 text-center text-sm text-[#9f9788]">
      <div className="mb-2 flex flex-wrap justify-center gap-6">
        <Link href="/about" className="hover:text-[#f5f1e8]">
          About
        </Link>
        <Link href="/methodology" className="hover:text-[#f5f1e8]">
          Methodology
        </Link>
        <Link href="/disclaimer" className="hover:text-[#f5f1e8]">
          Disclaimer
        </Link>
        <Link href="/privacy" className="hover:text-[#f5f1e8]">
          Privacy
        </Link>
      </div>

      <p>© {new Date().getFullYear()} CalcTrio</p>
    </footer>
  );
}
