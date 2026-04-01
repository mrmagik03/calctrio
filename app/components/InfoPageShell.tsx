import type { ReactNode } from "react";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

type InfoPageShellProps = {
  title: string;
  children: ReactNode;
};

export default function InfoPageShell({ title, children }: InfoPageShellProps) {
  return (
    <main className="min-h-screen bg-[#111111] text-[#f7f3eb]">
      <SiteHeader />

      <div className="mx-auto flex min-h-[calc(100vh-85px)] max-w-6xl flex-col justify-between px-6 py-12">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="w-full max-w-3xl rounded-xl border border-[#2a2a2a] bg-[#171717] px-8 py-10 shadow-[0_12px_32px_rgba(0,0,0,0.28)]">
            <h1 className="mb-6 text-center text-4xl font-bold text-[#f7f3eb]">
              {title}
            </h1>

            <div className="space-y-6 text-lg leading-8 text-[#d2c7b2]">{children}</div>
          </div>
        </div>

        <SiteFooter />
      </div>
    </main>
  );
}
