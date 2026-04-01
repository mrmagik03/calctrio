export async function GET() {
  const base = "https://calctrio.com";

  const urls = [
    "/",
    "/salary",
    "/loan",
    "/savings",
    "/about",
    "/methodology",
    "/privacy",
    "/disclaimer",
  ];

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

  return new Response(body, { headers: { "Content-Type": "application/xml" } });
}
