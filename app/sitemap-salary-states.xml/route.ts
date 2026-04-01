import { POPULAR_STATE_SLUGS, SALARY_GRID } from "@/lib/salary";

export async function GET() {
  const base = "https://calctrio.com";
  const urls: string[] = [];

  for (const state of POPULAR_STATE_SLUGS) {
    urls.push(`/salary/location/${state}`);
    for (const amount of SALARY_GRID) {
      urls.push(`/salary/${amount}/${state}`);
    }
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `
  <url>
    <loc>${base}${path}</loc>
  </url>`).join("")}
</urlset>`;

  return new Response(body, { headers: { "Content-Type": "application/xml" } });
}
