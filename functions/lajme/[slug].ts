// Cloudflare Pages Function: /lajme/[slug]
//
// For BUILT slugs, the static HTML in /lajme/<slug>/index.html is served by
// Cloudflare Pages and this Function never runs (Functions only handle
// requests that don't match a static asset).
//
// For UNBUILT (brand-new Sanity) slugs we serve the /lajme/_/ fallback shell
// so the client-side ArticleClient hydrates and fetches the article via
// /api/article. BUT: WhatsApp / Facebook / Twitter scrapers do NOT run JS,
// so without server-side OG injection they would see the shell's generic
// "Artikull | Radio Fontana" title and the site logo image.
//
// This function fetches the article from Sanity directly (same GROQ host as
// /functions/api/article.ts) and rewrites the <title>, og:*, twitter:* and
// canonical tags inside the shell HTML so link previews show the article's
// own image, title and excerpt — even before the next site rebuild.

interface Env {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
  NEXT_PUBLIC_SANITY_PROJECT_ID?: string;
  NEXT_PUBLIC_SANITY_DATASET?: string;
  NEXT_PUBLIC_SANITY_API_VERSION?: string;
}

const SITE_URL = 'https://radiofontana.org';
const DEFAULT_PROJECT_ID = 'ksakxvtt';
const DEFAULT_DATASET = 'production';
const DEFAULT_API_VERSION = '2024-01-01';
const FALLBACK_OG_IMAGE = `${SITE_URL}/logortvfontana.jpg`;
// Per-slug OG image proxy at a clean .jpg URL — see functions/og/[slug].jpg.ts.
// WhatsApp sniffs URL extension, so direct cdn.sanity.io URLs ending in
// `.webp` break previews even with `?fm=jpg`.
const OG_IMAGE_PROXY = (slug: string) => `${SITE_URL}/og/${encodeURIComponent(slug)}.jpg`;

// Minimal projection — just what we need for OG metadata.
const OG_QUERY = `*[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
  title,
  excerpt,
  "category": coalesce(category->title, "Politikë"),
  "imageUrl": mainImage.asset->url
}`;

interface OgArticle {
  title?: string;
  excerpt?: string;
  category?: string;
  imageUrl?: string;
}

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function fetchArticleForOg(env: Env, slug: string): Promise<OgArticle | null> {
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID || DEFAULT_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET || DEFAULT_DATASET;
  const apiVersion = env.NEXT_PUBLIC_SANITY_API_VERSION || DEFAULT_API_VERSION;
  const slugParam = JSON.stringify(slug);
  const sanityUrl =
    `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}` +
    `?query=${encodeURIComponent(OG_QUERY)}&%24slug=${encodeURIComponent(slugParam)}`;

  try {
    // Short timeout — scraper bots won't wait long; better to serve generic
    // OG than time out the entire request.
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2500);
    const res = await fetch(sanityUrl, {
      headers: { Accept: 'application/json' },
      signal: ctrl.signal,
    });
    clearTimeout(t);
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: OgArticle | null };
    return data.result ?? null;
  } catch {
    return null;
  }
}

function rewriteShellMeta(html: string, slug: string, article: OgArticle | null): string {
  // Trailing slash matches next.config trailingSlash:true so WhatsApp
  // doesn't follow a 308 when it crawls og:url.
  const articleUrl = `${SITE_URL}/lajme/${slug}/`;
  const title = article?.title ?? '';
  const excerpt = article?.excerpt ?? '';
  // Use the per-slug .jpg proxy when we have a real Sanity image; the
  // proxy itself falls back to the logo when Sanity has no mainImage.
  const ogImage = article?.imageUrl ? OG_IMAGE_PROXY(slug) : FALLBACK_OG_IMAGE;

  const fullTitle = title ? `${title} | Radio Fontana` : 'Artikull | Radio Fontana';
  const description =
    excerpt ||
    'Radio Fontana 98.8 FM — lajme dhe muzikë shqip nga Istog, Kosovë.';

  const tagsToInject = [
    `<meta name="description" content="${escapeHtmlAttr(description)}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:site_name" content="Radio Fontana" />`,
    `<meta property="og:locale" content="sq_AL" />`,
    `<meta property="og:url" content="${escapeHtmlAttr(articleUrl)}" />`,
    `<meta property="og:title" content="${escapeHtmlAttr(title || 'Radio Fontana')}" />`,
    `<meta property="og:description" content="${escapeHtmlAttr(description)}" />`,
    `<meta property="og:image" content="${escapeHtmlAttr(ogImage)}" />`,
    `<meta property="og:image:secure_url" content="${escapeHtmlAttr(ogImage)}" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapeHtmlAttr(title || 'Radio Fontana')}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtmlAttr(title || 'Radio Fontana')}" />`,
    `<meta name="twitter:description" content="${escapeHtmlAttr(description)}" />`,
    `<meta name="twitter:image" content="${escapeHtmlAttr(ogImage)}" />`,
    `<link rel="canonical" href="${escapeHtmlAttr(articleUrl)}" />`,
  ].join('');

  let out = html;

  // 1) Replace the <title> the shell baked.
  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtmlAttr(fullTitle)}</title>`);

  // 2) Strip noindex (the shell page is marked noindex; the rewritten page
  //    represents a real article and should be crawlable).
  out = out.replace(/<meta\s+name=["']robots["'][^>]*>/gi, '');

  // 3) Strip any pre-existing og:* / twitter:* / description / canonical so
  //    they don't conflict with what we inject.
  out = out
    .replace(/<meta\s+(?:property|name)=["'](?:og:[^"']+|twitter:[^"']+|description)["'][^>]*>/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>/gi, '');

  // 4) Inject our tags right before </head>.
  out = out.replace(/<\/head>/i, `${tagsToInject}</head>`);

  return out;
}

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);

  // Extract the slug from the URL path: /lajme/<slug>/  or  /lajme/<slug>
  const match = url.pathname.match(/^\/lajme\/([^/]+)\/?$/);
  const slug = match?.[1] ? decodeURIComponent(match[1]) : '';

  // Fetch the shell HTML and (in parallel) the article OG data.
  const shellRequest = new Request(new URL('/lajme/_/', url.origin).toString(), {
    method: 'GET',
    headers: request.headers,
  });
  const [shellResponse, article] = await Promise.all([
    env.ASSETS.fetch(shellRequest),
    slug ? fetchArticleForOg(env, slug) : Promise.resolve(null),
  ]);

  if (!shellResponse.ok) {
    return shellResponse;
  }

  const html = await shellResponse.text();
  const rewritten = rewriteShellMeta(html, slug, article);

  const headers = new Headers(shellResponse.headers);
  headers.set('Content-Type', 'text/html; charset=utf-8');
  // No-cache at the edge so stale-OG never sticks once a real build happens.
  headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  // Drop Content-Length / etag — body length changed.
  headers.delete('Content-Length');
  headers.delete('content-length');
  headers.delete('ETag');
  headers.delete('etag');

  return new Response(rewritten, {
    status: 200,
    headers,
  });
}

// HEAD requests (link previewers, health probes) — same routing.
export const onRequestHead = onRequestGet;
