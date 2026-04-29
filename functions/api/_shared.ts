// Shared utilities for Cloudflare Pages Functions.
//
// 1. CORS — only `https://radiofontana.org` is allowed (audit P3-H1).
// 2. Best-effort per-IP rate limiting using an in-memory map kept on the
//    Workers isolate. Limits are advisory across multiple isolates but cap
//    the load any single isolate can put on Sanity (audit P3-H2).

const ALLOWED_ORIGIN = 'https://radiofontana.org';
const RATE_LIMIT = 60; // requests
const RATE_WINDOW_MS = 60_000; // per minute

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export function corsHeaders(extra: Record<string, string> = {}): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Vary': 'Origin',
    ...extra,
  };
}

export function clientIp(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
  headers: Record<string, string>;
}

export function rateLimit(request: Request, key = ''): RateLimitResult {
  const ip = clientIp(request);
  const bucketKey = `${key}:${ip}`;
  const now = Date.now();
  let bucket = buckets.get(bucketKey);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + RATE_WINDOW_MS };
    buckets.set(bucketKey, bucket);
  }
  bucket.count += 1;
  // Opportunistic GC so the map cannot grow without bound on a long-lived isolate.
  if (buckets.size > 5_000) {
    for (const [k, b] of buckets) {
      if (b.resetAt <= now) buckets.delete(k);
    }
  }
  const remaining = Math.max(0, RATE_LIMIT - bucket.count);
  const resetSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': String(RATE_LIMIT),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(resetSeconds),
  };
  return { allowed: bucket.count <= RATE_LIMIT, remaining, resetSeconds, headers };
}

export function tooManyRequests(rl: RateLimitResult): Response {
  return new Response(JSON.stringify({ error: 'rate_limited' }), {
    status: 429,
    headers: {
      'Content-Type': 'application/json',
      'Retry-After': String(rl.resetSeconds),
      ...corsHeaders(rl.headers),
    },
  });
}
