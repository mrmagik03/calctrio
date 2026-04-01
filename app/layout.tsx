import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
    default: "CalcTrio",
    template: "%s | CalcTrio",
  },
  description:
    "Free online calculators for loan planning, salary conversions, savings growth, and everyday financial decisions.",
  keywords: [
    "loan calculator",
    "car loan calculator",
    "boat loan calculator",
    "rv loan calculator",
    "salary calculator",
    "savings calculator",
    "financial calculator",
    "CalcTrio",
  ],
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
    title: "CalcTrio",
    description:
      "Free online calculators for loans, salary, savings, and financial planning.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CalcTrio",
    description:
      "Free online calculators for loans, salary, savings, and financial planning.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-HBE8PKSZ25`}
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HBE8PKSZ25');
          `}
        </Script>

        {children}
      </body>
    </html>
  );
}
