// Cloudflare Pages Function: /api/home
// Fetches featured/breaking articles (no recency limit) plus the latest 24
// posts in parallel, then merges them so the home page hero card and breaking
// news ticker always reflect live Sanity data on every request.

import { corsHeaders, fetchWithTimeout, rateLimit, tooManyRequests } from './_shared';

interface Env {
  NEXT_PUBLIC_SANITY_PROJECT_ID: string;
  NEXT_PUBLIC_SANITY_DATASET: string;
  NEXT_PUBLIC_SANITY_API_VERSION?: string;
}

const API_VERSION = '2024-01-01';
const DEFAULT_PROJECT_ID = 'ksakxvtt';
const DEFAULT_DATASET = 'production';

const PROJECTION = `{
  "id": _id,
  "slug": slug.current,
  title,
  excerpt,
  "readMinutes": select(
    length(coalesce(excerpt, "")) > 420 => 3,
    length(coalesce(excerpt, "")) > 220 => 2,
    1
  ),
  "category": coalesce(category->title, "Politikë"),
  "author": coalesce(author->name, "Radio Fontana"),
  publishedAt,
  "featured": coalesce(featured, false),
  "breaking": coalesce(breaking, false),
  "tags": coalesce(tags, etiketat, []),
  "imageUrl": coalesce(mainImage.asset->url, "/logortvfontana.jpg")
}`;

const PINNED_QUERY =
  `*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**")) && (featured == true || breaking == true)] | order(publishedAt desc) ${PROJECTION}`;

const LATEST_QUERY =
  `*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))] | order(publishedAt desc) [0...24] ${PROJECTION}`;

export async function onRequestGet(context: { request: Request; env: Env }) {
  const { env, request } = context;
  const rl = rateLimit(request, 'home');
  if (!rl.allowed) return tooManyRequests(rl);

  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID || DEFAULT_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET || DEFAULT_DATASET;
  const apiVersion = env.NEXT_PUBLIC_SANITY_API_VERSION || API_VERSION;
  const base = `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}`;

  try {
    const [pinnedRes, latestRes] = await Promise.all([
      fetchWithTimeout(`${base}?query=${encodeURIComponent(PINNED_QUERY)}`, {
        headers: { Accept: 'application/json' },
      }),
      fetchWithTimeout(`${base}?query=${encodeURIComponent(LATEST_QUERY)}`, {
        headers: { Accept: 'application/json' },
      }),
    ]);

    const [pinnedData, latestData] = await Promise.all([
      pinnedRes.ok
        ? (pinnedRes.json() as Promise<{ result?: unknown[] }>)
        : Promise.resolve({ result: [] }),
      latestRes.ok
        ? (latestRes.json() as Promise<{ result?: unknown[] }>)
        : Promise.resolve({ result: [] }),
    ]);

    const pinned = (pinnedData.result ?? []) as Array<{ id: string }>;
    const latest = (latestData.result ?? []) as Array<{ id: string }>;
    const pinnedIds = new Set(pinned.map((a) => a.id));
    const merged = [...pinned, ...latest.filter((a) => !pinnedIds.has(a.id))];

    return new Response(JSON.stringify(merged), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
        ...corsHeaders(rl.headers),
      },
    });
  } catch {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(rl.headers) },
    });
  }
}
