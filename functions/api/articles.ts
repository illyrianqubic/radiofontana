// Cloudflare Pages Function: /api/articles
// Fetches published posts from Sanity via the GROQ HTTP API.

interface Env {
  NEXT_PUBLIC_SANITY_PROJECT_ID: string;
  NEXT_PUBLIC_SANITY_DATASET: string;
  NEXT_PUBLIC_SANITY_API_VERSION?: string;
}

const API_VERSION = '2024-01-01';
const DEFAULT_PROJECT_ID = 'ksakxvtt';
const DEFAULT_DATASET = 'production';

const QUERY = `*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))] | order(publishedAt desc) [0...$limit] {
  "id": _id,
  "slug": slug.current,
  title,
  excerpt,
  "readMinutes": select(
    length(coalesce(excerpt, "")) > 420 => 3,
    length(coalesce(excerpt, "")) > 220 => 2,
    1
  ),
  "category": coalesce(category->title, "Lajme"),
  "author": coalesce(author->name, "Radio Fontana"),
  publishedAt,
  "featured": coalesce(featured, false),
  "breaking": coalesce(breaking, false),
  "tags": coalesce(tags, []),
  "imageUrl": coalesce(mainImage.asset->url, "/logortvfontana.jpg")
}`;

export async function onRequestGet(context: {
  request: Request;
  env: Env;
}) {
  const { env } = context;
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID || DEFAULT_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET || DEFAULT_DATASET;
  const apiVersion = env.NEXT_PUBLIC_SANITY_API_VERSION || API_VERSION;
  const reqUrl = new URL(context.request.url);
  const debug = reqUrl.searchParams.get('debug') === '1';
  const rawLimit = Number(reqUrl.searchParams.get('limit') ?? '20');
  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(Math.trunc(rawLimit), 1), 200)
    : 20;

  // $limit must be a number in GROQ — pass as plain integer in the URL
  const url =
    `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}` +
    `?query=${encodeURIComponent(QUERY)}&%24limit=${limit}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      cache: 'force-cache',
    });

    if (!res.ok) {
      throw new Error(`Sanity responded with ${res.status}`);
    }

    const data = (await res.json()) as { result?: unknown[] };

    return new Response(JSON.stringify(data.result ?? []), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error('[/api/articles] error:', err);
    if (debug) {
      return new Response(
        JSON.stringify({
          error: String(err),
          projectId,
          dataset,
          apiVersion,
          limit,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
    return new Response(JSON.stringify([]), {
      status: 200, // return empty array so the UI degrades gracefully
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
