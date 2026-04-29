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

type AtomArticle = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  _updatedAt: string;
  author: string;
  category: string;
  imageUrl: string;
};

export async function GET() {
  let articles: AtomArticle[] = [];
  try {
    articles = await readClient.fetch<AtomArticle[]>(
      `*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]
       | order(publishedAt desc) [0...50] {
         "slug": slug.current,
         title,
         excerpt,
         publishedAt,
         _updatedAt,
         "author": coalesce(author->name, "Radio Fontana"),
         "category": coalesce(category->title, "Politikë"),
         "imageUrl": coalesce(mainImage.asset->url, "")
       }`,
    );
  } catch {
    // Return empty feed on error
  }

  const updated =
    articles.length > 0 && articles[0]
      ? new Date(articles[0]._updatedAt ?? articles[0].publishedAt).toISOString()
      : new Date().toISOString();

  const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="sq">
  <title>Radio Fontana - Lajmet e Fundit</title>
  <subtitle>Lajmet e fundit nga Radio Fontana 98.8 FM, Istog, Kosovë</subtitle>
  <link href="${SITE_URL}" rel="alternate" type="text/html"/>
  <link href="${SITE_URL}/atom.xml" rel="self" type="application/atom+xml"/>
  <id>${SITE_URL}/</id>
  <updated>${updated}</updated>
  <author>
    <name>Radio Fontana</name>
    <email>rtvfontana@gmail.com</email>
    <uri>${SITE_URL}</uri>
  </author>
  <logo>${SITE_URL}/logortvfontana.jpg</logo>
  <icon>${SITE_URL}/favicon.ico</icon>
  <rights>Copyright ${new Date().getFullYear()} Radio Fontana</rights>
${(Array.isArray(articles) ? articles : [])
  .map((a) => {
    const url = `${SITE_URL}/lajme/${escapeXml(a.slug)}`;
    return `  <entry>
    <title type="html">${escapeXml(a.title)}</title>
    <link href="${url}" rel="alternate" type="text/html"/>
    <id>${url}</id>
    <published>${new Date(a.publishedAt).toISOString()}</published>
    <updated>${new Date(a._updatedAt ?? a.publishedAt).toISOString()}</updated>
    <author><name>${escapeXml(a.author)}</name></author>
    <category term="${escapeXml(a.category)}"/>
    <summary type="html">${escapeXml(a.excerpt ?? '')}</summary>
  </entry>`;
  })
  .join('\n')}
</feed>`;

  return new Response(atom, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
