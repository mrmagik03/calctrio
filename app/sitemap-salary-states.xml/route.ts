const STATES = [
  "texas",
  "california",
  "florida",
  "new-york",
  "illinois",
  "pennsylvania",
  "ohio",
  "georgia",
  "north-carolina",
  "michigan",
  // include all 50
];

export async function GET() {
  const base = "https://calctrio.com";
  const amounts = [40000, 50000, 60000, 75000, 100000];

  const urls = [];

  for (const amount of amounts) {
    for (const state of STATES) {
      urls.push(`/salary/${amount}/after-tax/${state}`);
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