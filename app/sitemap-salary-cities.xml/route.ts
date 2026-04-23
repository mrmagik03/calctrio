import { getPopularCities, SALARY_GRID } from "@/lib/salary";

export async function GET() {
  const base = "https://calctrio.com";
  const urls = new Set<string>();
  const cities = getPopularCities();

  for (const city of cities) {
    for (const amount of SALARY_GRID) {
      urls.add(`/salary/${amount}/${city.stateSlug}/${city.slug}`);
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
