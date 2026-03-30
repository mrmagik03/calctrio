import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://calctrio.com"),
  title: {
    default: "CalcTrio | Free Online Financial & Salary Calculators",
    template: "%s | CalcTrio",
  },
  description: "Accurate and easy-to-use financial tools, including salary, savings, and payment calculators to help you manage your money.",
  keywords: ["salary calculator", "savings tool", "financial planning", "tax calculator", "CalcTrio"],
  authors: [{ name: "CalcTrio Team" }],
  creator: "CalcTrio",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://calctrio.com",
    siteName: "CalcTrio",
    title: "CalcTrio | Free Online Financial & Salary Calculators",
    description: "Plan your finances with our accurate, free calculators.",
    images:,
  },
  twitter: {
    card: "summary_large_image",
    title: "CalcTrio | Financial Calculators",
    description: "Simple tools for complex financial decisions.",
    images:,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
