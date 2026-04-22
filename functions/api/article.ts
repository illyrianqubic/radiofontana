// Cloudflare Pages Function: /api/article
// Fetches a single post by slug from Sanity via the GROQ HTTP API.

interface Env {
  NEXT_PUBLIC_SANITY_PROJECT_ID: string;
  NEXT_PUBLIC_SANITY_DATASET: string;
  NEXT_PUBLIC_SANITY_API_VERSION?: string;
}

const API_VERSION = '2024-01-01';
const DEFAULT_PROJECT_ID = 'ksakxvtt';
const DEFAULT_DATASET = 'production';

// Using GROQ $slug parameter to avoid injection
const QUERY = `*[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
  "id": _id,
  "slug": slug.current,
  title,
  excerpt,
  content,
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
  const slug = (reqUrl.searchParams.get('slug') ?? '').trim();

  if (!slug) {
    return new Response(JSON.stringify(null), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Sanity GROQ parameters: $slug must be JSON-encoded (quoted string)
  const slugParam = JSON.stringify(slug);
  const url =
    `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}` +
    `?query=${encodeURIComponent(QUERY)}&%24slug=${encodeURIComponent(slugParam)}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      cache: 'force-cache',
    });

    if (!res.ok) {
      throw new Error(`Sanity responded with ${res.status}`);
    }

    const data = (await res.json()) as { result?: unknown };

    if (!data.result) {
      return new Response(JSON.stringify(null), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return new Response(JSON.stringify(data.result), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=900',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error('[/api/article] error:', err);
    if (debug) {
      return new Response(
        JSON.stringify({
          error: String(err),
          projectId,
          dataset,
          apiVersion,
          slug,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
    return new Response(JSON.stringify(null), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
