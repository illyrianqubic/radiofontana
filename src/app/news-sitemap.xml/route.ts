import { readClient } from '@/sanity/client';

export const dynamic = 'force-static';
export const revalidate = 3600;

const SITE_URL = 'https://radiofontana.org';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  let articles: Array<{ slug: string; title: string; publishedAt: string }> = [];
  try {
    articles = await readClient.fetch(
      `*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**")) && publishedAt > $cutoff]
       | order(publishedAt desc) {
         "slug": slug.current,
         title,
         publishedAt
       }`,
      { cutoff },
    );
  } catch {
    // Return empty sitemap on error
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${(Array.isArray(articles) ? articles : [])
  .map(
    (a) => `  <url>
    <loc>${SITE_URL}/lajme/${escapeXml(a.slug)}</loc>
    <news:news>
      <news:publication>
        <news:name>Radio Fontana</news:name>
        <news:language>sq</news:language>
      </news:publication>
      <news:publication_date>${new Date(a.publishedAt).toISOString()}</news:publication_date>
      <news:title>${escapeXml(a.title)}</news:title>
    </news:news>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
