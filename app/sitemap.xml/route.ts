export async function GET() {
  const base = "https://calctrio.com";

  const sitemaps = [
    `${base}/sitemap-main.xml`,
    `${base}/sitemap-loans.xml`,
    `${base}/sitemap-salary-states.xml`,
    `${base}/sitemap-salary-cities.xml`,
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (url) => `
  <sitemap>
    <loc>${url}</loc>
  </sitemap>`
  )
  .join("")}
</sitemapindex>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}