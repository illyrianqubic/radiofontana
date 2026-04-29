// Cloudflare Pages Function: /og/<slug>.jpg
//
// WhatsApp's link-preview scraper sniffs the og:image URL by EXTENSION, not
// by Content-Type. Sanity's CDN URLs end with the original asset's extension
// (often `.webp` or `.png`) even when `?fm=jpg` is set, so WhatsApp sees
// `.webp` and refuses to render the preview — leading to the "no image"
// behaviour we saw despite Telegram and Facebook working fine.
//
// This proxy gives us a clean `https://radiofontana.org/og/<slug>.jpg` URL
// that WhatsApp accepts. It looks the article up in Sanity, fetches the
// resized 1200x630 JPEG from the Sanity CDN, and streams it back with
// Content-Type: image/jpeg and aggressive caching.
//
// Falls back to redirecting to /logortvfontana.jpg when the article is not
// found or has no main image.

interface Env {
  NEXT_PUBLIC_SANITY_PROJECT_ID?: string;
  NEXT_PUBLIC_SANITY_DATASET?: string;
  NEXT_PUBLIC_SANITY_API_VERSION?: string;
}

const DEFAULT_PROJECT_ID = 'ksakxvtt';
const DEFAULT_DATASET = 'production';
const DEFAULT_API_VERSION = '2024-01-01';
const FALLBACK_IMAGE = '/logortvfontana.jpg';

const IMG_QUERY = `*[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
  "imageUrl": mainImage.asset->url
}`;

async function fetchArticleImageUrl(env: Env, slug: string): Promise<string | null> {
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID || DEFAULT_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET || DEFAULT_DATASET;
  const apiVersion = env.NEXT_PUBLIC_SANITY_API_VERSION || DEFAULT_API_VERSION;
  const slugParam = JSON.stringify(slug);
  const sanityUrl =
    `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}` +
    `?query=${encodeURIComponent(IMG_QUERY)}&%24slug=${encodeURIComponent(slugParam)}`;

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2500);
    const res = await fetch(sanityUrl, {
      headers: { Accept: 'application/json' },
      signal: ctrl.signal,
    });
    clearTimeout(t);
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: { imageUrl?: string } | null };
    return data.result?.imageUrl ?? null;
  } catch {
    return null;
  }
}

function buildSanityResizedJpeg(rawUrl: string): string | null {
  try {
    const u = new URL(rawUrl);
    if (!u.hostname.endsWith('sanity.io')) return null;
    u.searchParams.set('w', '1200');
    u.searchParams.set('h', '630');
    u.searchParams.set('fit', 'crop');
    u.searchParams.set('crop', 'entropy');
    u.searchParams.set('fm', 'jpg');
    u.searchParams.set('q', '82');
    u.searchParams.set('auto', 'format');
    return u.toString();
  } catch {
    return null;
  }
}

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);

  // Match /og/<slug>.jpg
  const match = url.pathname.match(/^\/og\/(.+)\.jpg$/i);
  const slug = match?.[1] ? decodeURIComponent(match[1]) : '';

  if (!slug) {
    return Response.redirect(new URL(FALLBACK_IMAGE, url.origin).toString(), 302);
  }

  const rawImageUrl = await fetchArticleImageUrl(env, slug);
  const sanityJpegUrl = rawImageUrl ? buildSanityResizedJpeg(rawImageUrl) : null;

  if (!sanityJpegUrl) {
    return Response.redirect(new URL(FALLBACK_IMAGE, url.origin).toString(), 302);
  }

  // Stream the Sanity JPEG through our domain so WhatsApp sees a `.jpg` URL
  // on radiofontana.org and the right Content-Type. We don't buffer — pass
  // the body straight through.
  let upstream: Response;
  try {
    upstream = await fetch(sanityJpegUrl, {
      // cf cache: long TTL — Sanity URLs are immutable per asset+params.
      cf: { cacheTtl: 86400, cacheEverything: true },
    } as RequestInit);
  } catch {
    return Response.redirect(new URL(FALLBACK_IMAGE, url.origin).toString(), 302);
  }

  if (!upstream.ok || !upstream.body) {
    return Response.redirect(new URL(FALLBACK_IMAGE, url.origin).toString(), 302);
  }

  const headers = new Headers();
  headers.set('Content-Type', 'image/jpeg');
  headers.set('Cache-Control', 'public, max-age=86400, s-maxage=86400, immutable');
  headers.set('X-Content-Type-Options', 'nosniff');
  // Forward content-length when known so WhatsApp can size-check.
  const len = upstream.headers.get('content-length');
  if (len) headers.set('Content-Length', len);

  return new Response(upstream.body, { status: 200, headers });
}

export const onRequestHead = onRequestGet;
