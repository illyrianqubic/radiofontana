// Cloudflare Pages Function: /api/deploy-hook
// Receives a POST from Sanity webhook, verifies the shared secret, then
// triggers a GitHub Actions `repository_dispatch` event which runs the
// full build + wrangler deploy workflow.

interface Env {
  GITHUB_TOKEN: string;          // GitHub PAT with `workflow` scope
  DEPLOY_HOOK_SECRET: string;    // Shared secret between Sanity webhook and this Function
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  // Fail-closed: refuse if shared secret not configured.
  if (!env.DEPLOY_HOOK_SECRET || env.DEPLOY_HOOK_SECRET.length === 0) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Accept the secret ONLY from a request header. Reading it from the URL
  // query string would leak it through Cloudflare access logs, browser
  // history, and Referer headers.
  const secret = request.headers.get('x-webhook-secret') ?? '';
  if (secret.length === 0 || !timingSafeEqual(secret, env.DEPLOY_HOOK_SECRET)) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (!env.GITHUB_TOKEN) {
    return new Response('Server misconfigured: missing GITHUB_TOKEN', { status: 500 });
  }

  const resp = await fetch(
    'https://api.github.com/repos/illyrianqubic/radiofontana/dispatches',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'RadioFontana-Sanity-Webhook/1.0',
      },
      body: JSON.stringify({ event_type: 'sanity-publish' }),
    }
  );

  if (resp.ok || resp.status === 204) {
    return Response.json({ ok: true, message: 'Deployment triggered' });
  }

  const body = await resp.text();
  return new Response(`GitHub API error: ${resp.status} ${body}`, { status: 502 });
}

// Reject non-POST requests
export function onRequest() {
  return new Response('Method Not Allowed', { status: 405 });
}
