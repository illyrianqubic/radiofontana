// Cloudflare Pages Function: /lajme/[slug]
//
// For built slugs, the static HTML in /lajme/<slug>/index.html is served by
// Pages and this Function never runs (Functions only handle requests that
// don't match a static asset). For brand-new Sanity slugs that haven't been
// rebuilt yet, this Function serves the /lajme/_/index.html fallback shell
// so the client-side ArticleClient can fetch the article via /api/article.

interface Env {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
}

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  // Build a request for the fallback shell, preserving the request method/headers.
  const url = new URL(request.url);
  const shellUrl = new URL('/lajme/_/', url.origin);
  const shellRequest = new Request(shellUrl.toString(), {
    method: 'GET',
    headers: request.headers,
  });
  const shellResponse = await env.ASSETS.fetch(shellRequest);
  if (!shellResponse.ok) {
    return shellResponse;
  }
  // Re-emit the shell HTML at the requested URL with no-cache headers so the
  // edge doesn't keep serving the shell after the next build adds the real
  // static page for this slug.
  const headers = new Headers(shellResponse.headers);
  headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  return new Response(shellResponse.body, {
    status: 200,
    headers,
  });
}

// Also handle HEAD so health checks / link previews don't see a 404.
export const onRequestHead = onRequestGet;
