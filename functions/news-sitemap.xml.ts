// Cloudflare Pages Function: /news-sitemap.xml
// Computes the 48 h cutoff at REQUEST time (audit P1-M3) — the previous Next
// static route froze it at build time.

import { corsHeaders, fetchWithTimeout, rateLimit, tooManyRequests } from './api/_shared';

interface Env {
  NEXT_PUBLIC_SANITY_PROJECT_ID?: string;
  NEXT_PUBLIC_SANITY_DATASET?: string;
  NEXT_PUBLIC_SANITY_API_VERSION?: string;
}

const DEFAULT_PROJECT_ID = 'ksakxvtt';
const DEFAULT_DATASET = 'production';
const API_VERSION = '2024-01-01';
const SITE_URL = 'https://radiofontana.org';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function onRequestGet(context: { request: Request; env: Env }) {
  const { env, request } = context;
  const rl = rateLimit(request, 'news-sitemap');
  if (!rl.allowed) return tooManyRequests(rl);

  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID || DEFAULT_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET || DEFAULT_DATASET;
  const apiVersion = env.NEXT_PUBLIC_SANITY_API_VERSION || API_VERSION;

  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
  const groq = `*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**")) && publishedAt > $cutoff] | order(publishedAt desc) { "slug": slug.current, title, publishedAt }`;
  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(groq)}&%24cutoff=${encodeURIComponent(JSON.stringify(cutoff))}`;

  let articles: Array<{ slug: string; title: string; publishedAt: string }> = [];
  try {
    const res = await fetchWithTimeout(url);
    if (res.ok) {
      const data = (await res.json()) as { result?: typeof articles };
      articles = Array.isArray(data.result) ? data.result : [];
    }
  } catch {
    // empty sitemap on failure
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${articles
  .map(
    (a) => `  <url>
    <loc>${SITE_URL}/lajme/${escapeXml(a.slug)}/</loc>
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
      'Cache-Control': 'public, max-age=600, stale-while-revalidate=3600',
      ...corsHeaders(rl.headers),
    },
  });
}
