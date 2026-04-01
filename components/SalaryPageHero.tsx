import type { ReactNode } from "react";

type SalaryPageHeroProps = {
  title: string;
  description: ReactNode;
};

export default function SalaryPageHero({
  title,
  description,
}: SalaryPageHeroProps) {
  return (
    <section className="hero-card">
      <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
        {title}
      </h1>
      <p className="mt-4 max-w-3xl text-base text-neutral-300 md:text-lg">
        {description}
      </p>
    </section>
  );
}