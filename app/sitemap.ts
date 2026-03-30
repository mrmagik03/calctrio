import type { MetadataRoute } from "next";

const baseUrl = "https://www.calctrio.com";

const salaryExamples: number[] = [];

// 25k → 100k (every 2.5k)
for (let i = 25000; i <= 100000; i += 2500) {
  salaryExamples.push(i);
}

// 100k → 200k (every 5k)
for (let i = 105000; i <= 200000; i += 5000) {
  salaryExamples.push(i);
}

// 200k → 300k (every 10k)
for (let i = 210000; i <= 300000; i += 10000) {
  salaryExamples.push(i);
}

const paymentExamples: number[] = [];

// 5k → 50k (every 2.5k)
for (let i = 5000; i <= 50000; i += 2500) {
  paymentExamples.push(i);
}

// 55k → 100k (every 5k)
for (let i = 55000; i <= 100000; i += 5000) {
  paymentExamples.push(i);
}

// 110k → 250k (every 10k)
for (let i = 110000; i <= 250000; i += 10000) {
  paymentExamples.push(i);
}

const savingsExamples: number[] = [];

// 5k → 50k (every 2.5k)
for (let i = 5000; i <= 50000; i += 2500) {
  savingsExamples.push(i);
}

// 55k → 100k (every 5k)
for (let i = 55000; i <= 100000; i += 5000) {
  savingsExamples.push(i);
}

// 110k → 250k (every 10k)
for (let i = 110000; i <= 250000; i += 10000) {
  savingsExamples.push(i);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/salary`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/payment`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/savings`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/methodology`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const salaryRoutes: MetadataRoute.Sitemap = salaryExamples.map((amount) => ({
    url: `${baseUrl}/salary/${amount}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const paymentRoutes: MetadataRoute.Sitemap = paymentExamples.map((amount) => ({
    url: `${baseUrl}/payment/${amount}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const savingsRoutes: MetadataRoute.Sitemap = savingsExamples.map((amount) => ({
    url: `${baseUrl}/savings/${amount}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...salaryRoutes, ...paymentRoutes, ...savingsRoutes];
}