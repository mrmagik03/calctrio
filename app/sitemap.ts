import type { MetadataRoute } from "next";

const baseUrl = "https://calctrio.com";

const salaryExamples: number[] = [];
for (let i = 25000; i <= 100000; i += 2500) salaryExamples.push(i);
for (let i = 105000; i <= 200000; i += 5000) salaryExamples.push(i);
for (let i = 210000; i <= 300000; i += 10000) salaryExamples.push(i);

const paymentExamples: number[] = [];
for (let i = 5000; i <= 50000; i += 2500) paymentExamples.push(i);
for (let i = 55000; i <= 100000; i += 5000) paymentExamples.push(i);
for (let i = 110000; i <= 250000; i += 10000) paymentExamples.push(i);

const savingsExamples: number[] = [];
for (let i = 5000; i <= 50000; i += 2500) savingsExamples.push(i);
for (let i = 55000; i <= 100000; i += 5000) savingsExamples.push(i);
for (let i = 110000; i <= 250000; i += 10000) savingsExamples.push(i);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/salary`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/payment`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
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

  const paymentRoutes: MetadataRoute.Sitemap = paymentExamples.map((amount) => ({
    url: `${baseUrl}/payment/${amount}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const savingsRoutes: MetadataRoute.Sitemap = savingsExamples.map((amount) => ({
    url: `${baseUrl}/savings/${amount}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...salaryRoutes, ...paymentRoutes, ...savingsRoutes];
}
