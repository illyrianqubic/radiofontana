// Cloudflare Pages Function: /api/livestream
// Returns the current live stream status from Sanity.

import { corsHeaders, fetchWithTimeout, rateLimit, tooManyRequests } from './_shared';

interface Env {
  NEXT_PUBLIC_SANITY_PROJECT_ID: string;
  NEXT_PUBLIC_SANITY_DATASET: string;
  NEXT_PUBLIC_SANITY_API_VERSION?: string;
}

const API_VERSION = '2024-01-01';
const DEFAULT_PROJECT_ID = 'ksakxvtt';
const DEFAULT_DATASET = 'production';

const QUERY = `*[_type == "liveStream"][0] {
  isLive,
  title,
  facebookUrl,
  youtubeUrl,
  description
}`;

const FALLBACK = { isLive: false, title: null, facebookUrl: null, youtubeUrl: null, description: null };

export async function onRequestGet(context: {
  request: Request;
  env: Env;
}) {
  const { env, request } = context;
  const rl = rateLimit(request, 'livestream');
  if (!rl.allowed) return tooManyRequests(rl);
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID || DEFAULT_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET || DEFAULT_DATASET;
  const apiVersion = env.NEXT_PUBLIC_SANITY_API_VERSION || API_VERSION;

  const url =
    `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}` +
    `?query=${encodeURIComponent(QUERY)}`;

  try {
    const res = await fetchWithTimeout(url, {
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) throw new Error(`Sanity responded with ${res.status}`);

    const data = (await res.json()) as { result?: typeof FALLBACK };

    return new Response(JSON.stringify(data.result ?? FALLBACK), {
      headers: {
        'Content-Type': 'application/json',
        // Short cache — live status should update quickly
        'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
        ...corsHeaders(rl.headers),
      },
    });
  } catch {
    return new Response(JSON.stringify(FALLBACK), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders(rl.headers) },
    });
  }
}
