import type { Metadata } from "next";
import { buildAmountMetadata, buildStaticParams, LoanAmountPageContent } from "../../AmountPage";
import { loanCategories } from "../../loan-data";

const category = loanCategories.rv;

export function generateStaticParams() {
  return buildStaticParams(category);
}

export async function generateMetadata({ params }: { params: Promise<{ amount: string }> }): Promise<Metadata> {
  const { amount } = await params;
  return buildAmountMetadata(amount, category);
}

export default async function RvLoanAmountPage({ params }: { params: Promise<{ amount: string }> }) {
  const { amount } = await params;
  return <LoanAmountPageContent amount={amount} category={category} />;
}
