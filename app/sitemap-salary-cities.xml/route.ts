import { CITY_LOCATIONS } from "@/lib/cities";

export async function GET() {
  const base = "https://calctrio.com";
  const amounts = [40000, 50000, 60000];

  const urls = [];

  for (const amount of amounts) {
    for (const city of CITY_LOCATIONS) {
      urls.push(
        `/salary/${amount}/after-tax/${city.stateSlug}/${city.slug}`
      );
    }
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (path) => `
  <url>
    <loc>${base}${path}</loc>
  </url>`
  )
  .join("")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}