import { readClient } from '@/sanity/client';

export const dynamic = 'force-static';
export const revalidate = 3600;

const SITE_URL = 'https://radiofontana.org';

function escapeXml(str: string): string {
  return (str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

type RssArticle = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  author: string;
  category: string;
  imageUrl: string;
};

export async function GET() {
  let articles: RssArticle[] = [];
  try {
    articles = await readClient.fetch<RssArticle[]>(
      `*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]
       | order(publishedAt desc) [0...50] {
         "slug": slug.current,
         title,
         excerpt,
         publishedAt,
         "author": coalesce(author->name, "Radio Fontana"),
         "category": coalesce(category->title, "Lajme"),
         "imageUrl": coalesce(mainImage.asset->url, "")
       }`,
    );
  } catch {
    // Return empty feed on error
  }

  const buildDate = new Date().toUTCString();

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Radio Fontana - Lajmet e Fundit</title>
    <link>${SITE_URL}</link>
    <description>Lajmet e fundit nga Radio Fontana 98.8 FM, Istog, Kosovë. Lajme politike, sport, teknologji dhe showbiz.</description>
    <language>sq</language>
    <managingEditor>rtvfontana@gmail.com (Radio Fontana)</managingEditor>
    <webMaster>rtvfontana@gmail.com (Radio Fontana)</webMaster>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <ttl>60</ttl>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/logortvfontana.jpg</url>
      <title>Radio Fontana</title>
      <link>${SITE_URL}</link>
    </image>
${(Array.isArray(articles) ? articles : [])
  .map(
    (a) => `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${SITE_URL}/lajme/${escapeXml(a.slug)}</link>
      <guid isPermaLink="true">${SITE_URL}/lajme/${escapeXml(a.slug)}</guid>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(a.excerpt ?? '')}</description>
      <dc:creator>${escapeXml(a.author)}</dc:creator>
      <category>${escapeXml(a.category)}</category>${
        a.imageUrl
          ? `\n      <media:content url="${escapeXml(a.imageUrl)}" medium="image"/>`
          : ''
      }
    </item>`,
  )
  .join('\n')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
