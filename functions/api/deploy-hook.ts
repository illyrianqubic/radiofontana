// Cloudflare Pages Function: /api/deploy-hook
// Receives a POST from Sanity webhook, verifies the shared secret, then
// triggers a GitHub Actions `repository_dispatch` event which runs the
// full build + wrangler deploy workflow.

interface Env {
  GITHUB_TOKEN: string;          // GitHub PAT with `workflow` scope
  DEPLOY_HOOK_SECRET: string;    // Shared secret between Sanity webhook and this Function
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  // Validate shared secret passed by Sanity as a query param or header
  const url = new URL(request.url);
  const secret = url.searchParams.get('secret') ?? request.headers.get('x-webhook-secret') ?? '';
  if (!env.DEPLOY_HOOK_SECRET || secret !== env.DEPLOY_HOOK_SECRET) {
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
