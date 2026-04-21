// Cloudflare Pages Function: /api/articles
// Fetches published posts from Sanity via the GROQ HTTP API.

interface Env {
  NEXT_PUBLIC_SANITY_PROJECT_ID: string;
  NEXT_PUBLIC_SANITY_DATASET: string;
}

const API_VERSION = '2024-01-01';

const QUERY = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) [0...$limit] {
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
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;

  if (!projectId) {
    return new Response(JSON.stringify([]), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const dataset = env.NEXT_PUBLIC_SANITY_DATASET || 'production';
  const reqUrl = new URL(context.request.url);
  const limit = Math.min(
    parseInt(reqUrl.searchParams.get('limit') ?? '20', 10),
    200,
  );

  // $limit must be a number in GROQ — pass as plain integer in the URL
  const url =
    `https://${projectId}.apicdn.sanity.io/v${API_VERSION}/data/query/${dataset}` +
    `?query=${encodeURIComponent(QUERY)}&%24limit=${limit}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
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
    return new Response(JSON.stringify([]), {
      status: 200, // return empty array so the UI degrades gracefully
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
