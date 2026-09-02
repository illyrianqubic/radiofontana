// Cloudflare Pages Function: middleware guarding every /studio/* path.
//
// WHY THIS EXISTS
// Sanity Studio is a client-side React SPA. The Next.js static export
// (`output: 'export'`) only prerenders the bare `/studio/` shell
// (out/studio/index.html). Every other Studio route — /studio/structure,
// /studio/intent/create, /studio/schema, /studio/desk/... — has no static
// asset.
//
// On a hard refresh the browser requests that exact URL from Pages. There is
// no static asset to serve, and the `_redirects` `/studio/* -> /studio/index.html
// 200` rewrite is rejected by Pages as an "infinite loop" (rewriting to an
// index.html inside the same prefix), so the request fell through to the
// `/*` catch-all and Pages served out/404.html — hence the "Faqja nuk u gjet"
// page every time the editor URL was refreshed.
//
// PRECEDENCE
// On Pages: static asset -> _redirects -> Function. This middleware runs
// for ALL /studio/* requests that don't match a static asset, and returns
// the prerendered shell so Sanity's React router hydrates and renders the
// route client-side (exactly as it does for /studio/ itself).
//
// Note: we deliberately fetch the shell out of ASSETS ourselves (rather than
// `next()`) so the rewrite is explicit and cache headers are under our control
// for the auth session cookie flow.

interface Env {
  ASSETS: { fetch: (request: Request | string) => Promise<Response> };
}

interface Ctx {
  request: Request;
  env: Env;
}

async function serveStudioShell(context: Ctx): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);

  const shellReq = new Request(new URL('/studio/index.html', url.origin).toString(), {
    method: 'GET',
    // Forward headers (incl. host/cookies) so the shell resolves any
    // relative __next/ asset URLs correctly; auth is validated client-side by
    // the Sanity script loaded in the shell.
    headers: request.headers,
  });
  const shell = await env.ASSETS.fetch(shellReq);

  if (!shell.ok) {
    // Shell not built / mis-deployed — let ASSETS surface its own error.
    return shell;
  }

  const headers = new Headers(shell.headers);
  headers.set('Content-Type', 'text/html; charset=utf-8');
  // Never let the studio shell go stale in cache during a deploy.
  headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  headers.delete('Content-Length');
  headers.delete('content-length');
  headers.delete('ETag');
  headers.delete('etag');

  const html = await shell.text();
  return new Response(html, { status: 200, headers });
}

export const onRequest = serveStudioShell;
// Mirror for non-GET verbs (Sanity occasionally re-issues route resolves).
export const onRequestGet = serveStudioShell;
export const onRequestPost = serveStudioShell;
export const onRequestPut = serveStudioShell;
export const onRequestDelete = serveStudioShell;
export const onRequestPatch = serveStudioShell;
export const onRequestHead = serveStudioShell;
export const onRequestOptions = serveStudioShell;

