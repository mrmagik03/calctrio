import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getStateBySlug } from "@/lib/states";
import { readAmountParam } from "@/lib/salary";

type Props = {
  params: Promise<{ state: string }>;
  searchParams: Promise<{ amount?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    robots: { index: false, follow: true },
  };
}

export default async function SalaryStateOverviewRedirect({ params, searchParams }: Props) {
  const { state: rawState } = await params;
  const state = getStateBySlug(rawState);
  if (!state) notFound();

  const { amount: rawAmount } = await searchParams;
  const amount = readAmountParam(rawAmount);

  redirect(`/salary/${amount}/${state.slug}`);
}
