import Link from "next/link";

export default function LinkCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-white/25 bg-black/40 p-4 transition hover:border-white/40 hover:bg-black/50"
    >
      <div className="text-base font-semibold text-white">{title}</div>
      <p className="mt-2 text-sm leading-6 text-neutral-100">{description}</p>
    </Link>
  );
}
