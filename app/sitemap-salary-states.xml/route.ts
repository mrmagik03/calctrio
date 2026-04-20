import { POPULAR_STATE_SLUGS, SALARY_GRID } from "@/lib/salary";

export async function GET() {
  const base = "https://calctrio.com";
  const urls = new Set<string>();

  for (const amount of SALARY_GRID) {
    urls.add(`/salary/${amount}`);
    urls.add(`/salary/${amount}/monthly`);
    urls.add(`/salary/${amount}/biweekly`);
    urls.add(`/salary/${amount}/to-hourly`);
    urls.add(`/salary/${amount}/after-tax`);
  }

  for (const state of POPULAR_STATE_SLUGS) {
    urls.add(`/salary/location/${state}`);
    for (const amount of SALARY_GRID) {
      urls.add(`/salary/${amount}/${state}`);
      urls.add(`/salary/${amount}/after-tax/${state}`);
    }
  }

  const orderedUrls = Array.from(urls).sort();

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${orderedUrls.map((path) => `
  <url>
    <loc>${base}${path}</loc>
  </url>`).join("")}
</urlset>`;

  return new Response(body, { headers: { "Content-Type": "application/xml" } });
}
