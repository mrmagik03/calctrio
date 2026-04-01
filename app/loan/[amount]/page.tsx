import type { Metadata } from "next";
import { buildAmountMetadata, buildStaticParams, LoanAmountPageContent } from "../AmountPage";

export function generateStaticParams() {
  return buildStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ amount: string }> }): Promise<Metadata> {
  const { amount } = await params;
  return buildAmountMetadata(amount);
}

export default async function LoanAmountPage({ params }: { params: Promise<{ amount: string }> }) {
  const { amount } = await params;
  return <LoanAmountPageContent amount={amount} />;
}
