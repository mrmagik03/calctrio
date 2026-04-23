import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCityByStateAndSlug } from "@/lib/cities";
import { readAmountParam } from "@/lib/salary";
import { getStateBySlug } from "@/lib/states";

type Props = {
  params: Promise<{ state: string; city: string }>;
  searchParams: Promise<{ amount?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    robots: { index: false, follow: true },
  };
}

export default async function SalaryCityOverviewRedirect({ params, searchParams }: Props) {
  const { state: rawState, city: rawCity } = await params;
  const state = getStateBySlug(rawState);
  const city = state ? getCityByStateAndSlug(state.slug, rawCity) : null;
  if (!state || !city) notFound();

  const { amount: rawAmount } = await searchParams;
  const amount = readAmountParam(rawAmount);

  redirect(`/salary/${amount}/${state.slug}/${city.slug}`);
}
