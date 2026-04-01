import type { MetadataRoute } from "next";
import { genericExamples, loanCategories } from "./loan/loan-data";
import { STATES } from "@/lib/states";
import { buildAmountExamples, buildRateExamples, buildTermExamples } from "@/lib/loan";

const baseUrl = "https://calctrio.com";

const salaryExamples: number[] = [];
for (let i = 25000; i <= 100000; i += 2500) salaryExamples.push(i);
for (let i = 105000; i <= 200000; i += 5000) salaryExamples.push(i);
for (let i = 210000; i <= 300000; i += 10000) salaryExamples.push(i);

const savingsExamples: number[] = [];
for (let i = 5000; i <= 50000; i += 2500) savingsExamples.push(i);
for (let i = 55000; i <= 100000; i += 5000) savingsExamples.push(i);
for (let i = 110000; i <= 250000; i += 10000) savingsExamples.push(i);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/salary`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/loan`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/loan/car`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/loan/boat`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/loan/rv`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/savings`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/methodology`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  const salaryRoutes: MetadataRoute.Sitemap = salaryExamples.map((amount) => ({
    url: `${baseUrl}/salary/${amount}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const genericLoanRoutes: MetadataRoute.Sitemap = genericExamples.map((amount) => ({
    url: `${baseUrl}/loan/${amount}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = Object.values(loanCategories).flatMap((category) =>
    category.quickExamples.map((amount) => ({
      url: `${baseUrl}/loan/${category.slug}/${amount}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.78,
    }))
  );

  const savingsRoutes: MetadataRoute.Sitemap = savingsExamples.map((amount) => ({
    url: `${baseUrl}/savings/${amount}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const hourlyRoutes: MetadataRoute.Sitemap = [];
  for (let rate = 10; rate <= 100; rate += 1) {
    hourlyRoutes.push({
      url: `${baseUrl}/hourly/${rate}/to-salary`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  const salaryConversionRoutes: MetadataRoute.Sitemap = [];
  for (let amount = 10000; amount <= 300000; amount += 1000) {
    salaryConversionRoutes.push(
      {
        url: `${baseUrl}/salary/${amount}/monthly`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/salary/${amount}/biweekly`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/salary/${amount}/to-hourly`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/salary/${amount}/after-tax`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.78,
      }
    );

    for (const state of STATES) {
      salaryConversionRoutes.push({
        url: `${baseUrl}/salary/${amount}/after-tax/${state.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.72,
      });
    }
  }

  const paymentRoutes: MetadataRoute.Sitemap = [];
  for (const amount of buildAmountExamples("car")) {
    for (const rate of buildRateExamples()) {
      for (const term of buildTermExamples("car")) {
        paymentRoutes.push({
          url: `${baseUrl}/car-payment/${amount}/${rate}/${term}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }
  }

  for (const amount of buildAmountExamples("boat")) {
    for (const rate of buildRateExamples()) {
      for (const term of buildTermExamples("boat")) {
        paymentRoutes.push({
          url: `${baseUrl}/boat-payment/${amount}/${rate}/${term}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }
  }

  const rvAmounts = [40000, 60000, 80000, 100000, 120000];
  const rvRates = buildRateExamples();
  const rvTerms = [84, 120, 144, 180, 240];
  for (const amount of rvAmounts) {
    for (const rate of rvRates) {
      for (const term of rvTerms) {
        paymentRoutes.push({
          url: `${baseUrl}/rv-payment/${amount}/${rate}/${term}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.76,
        });
      }
    }
  }

  return [
    ...staticRoutes,
    ...salaryRoutes,
    ...genericLoanRoutes,
    ...categoryRoutes,
    ...savingsRoutes,
    ...hourlyRoutes,
    ...salaryConversionRoutes,
    ...paymentRoutes,
  ];
}
