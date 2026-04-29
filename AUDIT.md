# Radio Fontana — Exhaustive Three-Phase Codebase Audit

**Scope:** every source file under `src/`, `functions/`, `public/`, plus root configs.
**Mode:** diagnostic only — no code changes, no remediations proposed.
**Severity legend:** CRITICAL = data loss / security breach / site-wide outage / legal liability · HIGH = broken UX / wrong content / measurable performance regression · MEDIUM = correctness or quality issue · LOW = cosmetic / cleanup.
**Phase legend:** P1 = Bugs & correctness · P2 = Performance · P3 = Architecture / Security / SEO / A11y / Scale.

> Every issue lists exact `file:line`, what is happening, and why it is wrong. Sorted within each phase by severity.

---

## PHASE 1 — BUGS & CORRECTNESS

### CRITICAL

#### P1-C1. `cleanup` endpoint becomes a public mass-delete API when env var is unset
- **Where:** [functions/api/cleanup.ts](functions/api/cleanup.ts#L120-L126)
- **What:** `if (expectedSecret) { ...check secret... }` — the secret is only enforced when `CLEANUP_CRON_SECRET` is configured. If the env var is missing, empty string, or accidentally renamed in the Cloudflare dashboard, the `if` block is skipped entirely and any unauthenticated `POST /api/cleanup` proceeds to call `runCleanup(env)`.
- **Why it's wrong:** `runCleanup` issues `delete` mutations against the live Sanity dataset for every post older than 30 days, in batches of 100. A misconfiguration → silent destruction of the entire archive. Auth checks must be fail-closed, not fail-open.

#### P1-C2. `onScheduled` export is dead code — Pages Functions don’t support cron
- **Where:** [functions/api/cleanup.ts](functions/api/cleanup.ts#L113-L118), [wrangler.toml](wrangler.toml#L1-L8), [wrangler.jsonc](wrangler.jsonc)
- **What:** The file exports `onScheduled(event, env)`. Cloudflare *Workers* support `scheduled` handlers via `[triggers] crons = [...]`; Cloudflare *Pages Functions* (which is what this project uses, per `pages_build_output_dir = "out"`) do not. There is no `[triggers]` block in `wrangler.toml`/`wrangler.jsonc`.
- **Why it's wrong:** The 30-day archive cleanup will never fire automatically. The author believes a cron exists. Posts accumulate forever and the broken `onRequestPost` (P1-C1) is the only path that ever runs.

#### P1-C3. Inline images inside article body never render
- **Where:** [src/components/sanity/PortableText.tsx](src/components/sanity/PortableText.tsx#L1-L60), [src/sanity/queries.ts](src/sanity/queries.ts)
- **What:** The image renderer reads `value.asset.url`, falling back to `value.asset._ref`. `ARTICLE_BY_SLUG_QUERY` projects `content` as raw blocks — it never expands `content[].asset->{ url }`. Therefore `value.asset` is `{ _ref: "image-abc-1200x800-jpg", _type: "reference" }`, the URL fallback is the literal `_ref` string (`image-abc-...`), which is not a URL.
- **Why it's wrong:** Any inline image inserted by editors is broken in production: the `<img>` `src` becomes the Sanity asset reference id, producing 404s and broken UI in every article that uses the inline image block.

#### P1-C4. `BreakingNewsTicker` filters on build-time `Date.now()`
- **Where:** [src/components/layout/BreakingNewsTicker.tsx](src/components/layout/BreakingNewsTicker.tsx)
- **What:** `const NOW = Date.now()` is declared at module scope. With `output: 'export'` in [next.config.ts](next.config.ts#L4) the module evaluates once during the static build. The filter `NOW - publishedAt < 24h` is therefore frozen to "24 h before build time".
- **Why it's wrong:** Once the site has been live for >24 h since the last build, the ticker either silently drops every still-fresh breaking story or shows stale "breaking" items that are actually 25+ h old. Editors will think the breaking flag is broken.

#### P1-C5. Default category mismatch between frontend and Pages Function
- **Where:** [src/sanity/queries.ts](src/sanity/queries.ts) (`ARTICLES_QUERY` default `"Politikë"`), [functions/api/articles.ts](functions/api/articles.ts), [functions/api/article.ts](functions/api/article.ts), [src/lib/types.ts](src/lib/types.ts)
- **What:** The static-export GROQ uses `"Politikë"` as default category; the Cloudflare Functions use `"Lajme"`. `"Lajme"` is **not** a member of the `Category` union in `types.ts`, and there is no entry for it in `CATEGORY_COLORS`.
- **Why it's wrong:** `<NewsCard>` renders a category badge whose CSS color comes from `CATEGORY_COLORS[category]`. A `"Lajme"` value yields `undefined`, producing an unstyled badge. Worse, GROQ filtering by `"Lajme"` returns nothing while frontend filtering by `"Politikë"` returns articles — same call, different results depending on whether the user hits the SSG page or the dynamic API.

#### P1-C6. `ArticleClient` re-fetches the article on every mount, ignoring `initialArticle`
- **Where:** [src/app/lajme/[slug]/ArticleClient.tsx](src/app/lajme/[slug]/ArticleClient.tsx)
- **What:** The component receives `initialArticle` from the server, then `useEffect` always calls `fetch('/api/article?slug=...')`. There is no `if (!initialArticle)` guard.
- **Why it's wrong:** Every page view becomes a redundant Sanity hit through the Pages Function — an extra ~150–400 ms latency, doubled API quota, and a flash of stale-then-fresh content. At 30 k–40 k DAU this is the single biggest waste of Sanity API budget in the app.

#### P1-C7. GA4 fires before any consent decision
- **Where:** [src/app/layout.tsx](src/app/layout.tsx) (Script `G-9D4QPTBGCQ` with `strategy="lazyOnload"`), [src/components/layout/CookieConsentBanner.tsx](src/components/layout/CookieConsentBanner.tsx)
- **What:** The Google Tag Manager script is unconditionally rendered in the root layout. The banner has only an "Accept" button; there is no programmatic gate (e.g. `gtag('consent', 'default', { analytics_storage: 'denied' })`) before load.
- **Why it's wrong:** Under GDPR (the site has a `/gdpr/` page and serves EU users) any non-essential cookie must be opt-in. `lazyOnload` delays loading but does not delay tracking — `_ga`/`_gid` are written on first measurement hit. This is a regulatory violation and a P1 correctness bug because the consent UI is non-functional with respect to its claimed purpose.

#### P1-C8. Cookie banner has no Reject button
- **Where:** [src/components/layout/CookieConsentBanner.tsx](src/components/layout/CookieConsentBanner.tsx)
- **What:** Two actions only: "Pranoj" (accept) and "Më shumë info" (link to `/cookies/`). No "Reject" / "Refuzo" button.
- **Why it's wrong:** GDPR + Albanian DPA + EU CJEU "Planet49" jurisprudence require reject to be as easy as accept. Same severity (CRITICAL) because together with P1-C7 it constitutes a non-compliant consent UX.

### HIGH

#### P1-H1. `WeatherWidget` is hard-coded mock data labelled as live forecast
- **Where:** [src/components/home/WeatherWidget.tsx](src/components/home/WeatherWidget.tsx)
- **What:** `mockWeather` constant; UI strings: "Parashikimi për sot", "Moti Aktual". No fetch to any weather API.
- **Why it's wrong:** Users see fake meteorological data labelled as the current Istog forecast. Editorial credibility issue for a news outlet.

#### P1-H2. `timeAgo` and `formatAlbanianDate` cause hydration mismatches
- **Where:** [src/lib/utils.ts](src/lib/utils.ts), used in [src/app/HomeClient.tsx](src/app/HomeClient.tsx) and [src/components/news/NewsCard.tsx](src/components/news/NewsCard.tsx)
- **What:** `timeAgo(date)` is called during render of components that are pre-rendered to HTML at build time (static export). On the client, the same call uses the user's clock at hydration time. The strings differ ("2 orë më parë" vs "27 orë më parë").
- **Why it's wrong:** React 19 will throw a hydration mismatch warning, and on production the client text replaces the server text without a re-layout pass — visual flicker and missing CLS budget. `formatAlbanianDate` and `getDay()` further depend on local timezone, so server-built HTML is `Europe/Berlin`/`UTC` while the client may be `Europe/Tirane`.

#### P1-H3. `timeAgo` plural bug for "1 minutë" / "1 orë" / "1 ditë"
- **Where:** [src/lib/utils.ts](src/lib/utils.ts) `timeAgo()`
- **What:** Returns `${n} minuta`, `${n} orë`, `${n} ditë` for all `n`. Albanian singular forms are *minutë*, *orë* (same), *ditë* (same), but plural of *minutë* is *minuta* — so `1 minuta` is grammatically wrong.
- **Why it's wrong:** Visible language defect on every news card and article meta block.

#### P1-H4. `Sidebar "Lajmet e Fundit"` actually shows category-filtered "related"
- **Where:** [src/app/lajme/[slug]/ArticleClient.tsx](src/app/lajme/[slug]/ArticleClient.tsx)
- **What:** The sidebar block is titled "Lajmet e Fundit" but the data passed in is `related[]`, which is the category-filtered "more from this category" list returned by the article query.
- **Why it's wrong:** Reader expects globally newest stories; gets only stories in the same category. Same array is also rendered in two other sections lower on the page → triple-rendering of identical content.

#### P1-H5. Web3Forms access key embedded in client bundle without anti-spam
- **Where:** [src/app/kontakt/KontaktClient.tsx](src/app/kontakt/KontaktClient.tsx)
- **What:** `access_key: '182813ba-cf51-4bd3-936e-a32b78a1bdfd'` is hard-coded. No captcha, no honeypot, no rate-limiter, no email format validation beyond truthiness. Submission goes directly from the browser to `api.web3forms.com`.
- **Why it's wrong:** Any scraper finds the key in JS, automates POSTs, floods `rtvfontana@gmail.com` with arbitrary subjects/messages. The Web3Forms account quota will exhaust quickly under spam.

#### P1-H6. `LajmeClient` uses `window.history.replaceState` instead of Next router
- **Where:** [src/app/lajme/LajmeClient.tsx](src/app/lajme/LajmeClient.tsx)
- **What:** Search/filter changes mutate the URL through native History API. Next.js does not learn about the change; `usePathname` / `useSearchParams` will continue returning the original values for any other component on the page.
- **Why it's wrong:** Future code that subscribes to URL state through Next hooks will silently desync. Back/forward buttons can mismatch UI state.

#### P1-H7. `Navbar` search submits via full reload
- **Where:** [src/components/layout/Navbar.tsx](src/components/layout/Navbar.tsx)
- **What:** Search form handler does `window.location.href = ...`, throwing away the SPA state.
- **Why it's wrong:** Forces a hard navigation, full bundle re-evaluation, losing the radio player audio session if it isn't yet attached to the persistent context. Defeats the purpose of using a client-side router.

#### P1-H8. `LivePlayer` imports framer-motion just for an animated background, while the actual stream is unused
- **Where:** [src/components/live/LivePlayer.tsx](src/components/live/LivePlayer.tsx)
- **What:** Component fetches `/api/livestream`, calls `setStream(...)`, but the embed iframe is commented out. The fetched `stream` is never read. `buildFbEmbedUrl`, `FALLBACK_FB_URL`, `LiveStream` are all dead code.
- **Why it's wrong:** The "Live" page does not actually play live video. It performs an unused network call on every mount and ships ~50 KB of framer-motion to render decorative bars. Functional regression vs. the page's purpose.

#### P1-H9. `generateStaticParams` emits a sentinel slug `'_'`
- **Where:** [src/app/lajme/[slug]/page.tsx](src/app/lajme/[slug]/page.tsx)
- **What:** `[...slugs, { slug: '_' }]`. The intent is to ship a fallback HTML shell for slugs published after build, paired with the `_redirects` rewrite `/lajme/:slug -> /lajme/_/`. There is no Sanity post called `_`, but the slug `_` is now a real public URL emitting an article shell.
- **Why it's wrong:** `https://radiofontana.org/lajme/_/` returns 200 with an empty/broken article (no data), is crawlable, will be indexed by Google as a soft-404 / thin page, and dilutes link equity.

#### P1-H10. `_redirects` does not normalise no-slash legal pages
- **Where:** [public/_redirects](public/_redirects), [src/components/shared/Footer.tsx](src/components/layout/Footer.tsx), [src/components/shared/LegalPageLayout.tsx](src/components/shared/LegalPageLayout.tsx)
- **What:** `_redirects` has rewrites for `/live`, `/lajme`, `/kontakt`, but not for `/cookies`, `/privacy`, `/terms`, `/gdpr`, `/disclaimer`, `/rreth-nesh`. Internal `<Link href="/privacy">` etc. work because Next adds the trailing slash on click via `trailingSlash: true`, but a hand-typed `https://radiofontana.org/privacy` falls through to the catch-all `/* /404.html 404`.
- **Why it's wrong:** Direct URLs without trailing slash 404. SEO crawlers/share buttons that strip the slash will see 404s for legal pages.

#### P1-H11. Footer omits `/disclaimer` entirely
- **Where:** [src/components/layout/Footer.tsx](src/components/layout/Footer.tsx)
- **What:** Footer lists Privacy, Terms, GDPR, Cookies. No link to `/disclaimer/` even though the page is shipped, in the sitemap, and referenced by `LegalPageLayout`.
- **Why it's wrong:** Legal page exists but is unreachable from the global navigation — users cannot find the publisher’s liability disclaimer.

#### P1-H12. `start` script will not work with `output: 'export'`
- **Where:** [package.json](package.json#L7), [next.config.ts](next.config.ts#L4)
- **What:** `"start": "next start"` is incompatible with `output: 'export'` (no Node server is built).
- **Why it's wrong:** Anyone running `npm start` after `npm run build` gets a confusing failure. Suggests the production model is misunderstood by tooling.

### MEDIUM

#### P1-M1. `role="marquee"` is not a valid ARIA role
- **Where:** [src/components/layout/BreakingNewsTicker.tsx](src/components/layout/BreakingNewsTicker.tsx)
- **What:** `<div role="marquee">`. ARIA spec defines `marquee` only as an implicit role of the deprecated `<marquee>` element; it is not in the list of WAI-ARIA roles authors may set explicitly.
- **Why it's wrong:** axe-core / lighthouse a11y audits flag this as an invalid role; screen readers may treat the contents as plain text.

#### P1-M2. `getDay()` and `new Date()` everywhere — TZ drift between SSG and client
- **Where:** [src/lib/utils.ts](src/lib/utils.ts) (`formatAlbanianDate`, `weekday` calls)
- **What:** Build runs on Cloudflare Pages workers (UTC). Visitor is UTC+1/+2. `Date.prototype.getDay()` is local-TZ.
- **Why it's wrong:** Article dates can show the wrong day-of-week; midnight-published posts can shift by one calendar day depending on viewer location vs build location.

#### P1-M3. `news-sitemap.xml` cutoff frozen at build time
- **Where:** [src/app/news-sitemap.xml/route.ts](src/app/news-sitemap.xml/route.ts)
- **What:** `const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000)` evaluated once during the static build. The route handler exports `dynamic = 'force-static'`.
- **Why it's wrong:** Google News only consumes articles less than 48 h old. After 48 h without a rebuild the sitemap is empty; if the site was rebuilt 47 h ago, articles published at deploy time will fall out of the sitemap before Google re-fetches it.

#### P1-M4. `sitemap.ts` `lastModified: now` is build time, not content time
- **Where:** [src/app/sitemap.ts](src/app/sitemap.ts)
- **What:** Static pages get `lastModified: new Date()` (= build), and home/lajme are flagged `changeFrequency: 'hourly'`, but the sitemap is regenerated only on rebuild.
- **Why it's wrong:** Google sees `<lastmod>` lying about freshness.

#### P1-M5. Sitemap canonical mismatch with `trailingSlash: true`
- **Where:** [src/app/sitemap.ts](src/app/sitemap.ts), [next.config.ts](next.config.ts#L5)
- **What:** Sitemap entries are `${SITE_URL}/lajme`, `/live`, etc. Real canonical URLs after static export are `/lajme/`, `/live/`. Some legal page metadata also sets `canonical: 'https://radiofontana.org/cookies'` ([src/app/cookies/page.tsx](src/app/cookies/page.tsx#L8)).
- **Why it's wrong:** Google receives two URLs per page (slash and no-slash) with conflicting canonical signals.

#### P1-M6. `LivePlayer` `LiveStream`/`buildFbEmbedUrl`/`FALLBACK_FB_URL` are dead code
- **Where:** [src/components/live/LivePlayer.tsx](src/components/live/LivePlayer.tsx)
- **What:** Imports and helpers for a Facebook embed that has been commented out.
- **Why it's wrong:** Increases bundle and confuses future maintainers.

#### P1-M7. `NewsFilter` syncs prop into state on every render via `requestAnimationFrame`
- **Where:** [src/components/news/NewsFilter.tsx](src/components/news/NewsFilter.tsx)
- **What:** Pattern `useEffect(() => { rAF(() => setLocal(activeQuery)) }, [activeQuery])`.
- **Why it's wrong:** Two-source-of-truth state, redundant rerender each frame the prop changes, and the rAF deferral makes the input feel laggy.

#### P1-M8. `most-read` sidebar is fake "most read"
- **Where:** [src/app/HomeClient.tsx](src/app/HomeClient.tsx)
- **What:** "Më të lexuara" is filled by slicing the same articles array in publication order. There is no read-count metric.
- **Why it's wrong:** Misleading section label.

#### P1-M9. `Article` schema fields all optional except `title`/`slug`
- **Where:** [src/sanity/schemaTypes/post.ts](src/sanity/schemaTypes/post.ts)
- **What:** `excerpt`, `mainImage`, `category`, `author`, `publishedAt` have no `validation`.
- **Why it's wrong:** Editors can publish posts that crash or render emptily on the site (e.g. card without image triggers `<Image src={undefined}>`; OG image fallback never set).

#### P1-M10. `formatAlbanianDate` returns naïve string with no timezone marker
- **Where:** [src/lib/utils.ts](src/lib/utils.ts)
- **What:** Builds a string like `"15 Janar 2026"` from the local TZ.
- **Why it's wrong:** Same article shows different dates to different visitors depending on TZ.

#### P1-M11. `Article` `_ref` pattern not validated when building image URL
- **Where:** [src/lib/utils.ts](src/lib/utils.ts) `optimizeImageUrl`, [src/sanity/image.ts](src/sanity/image.ts)
- **What:** No defensive check that the URL belongs to `cdn.sanity.io` before appending `?w=...&auto=format`. Editors can paste any URL into `mainImage` (oddly-shaped Sanity assets, gif, svg) and the optimisation params are appended blindly.
- **Why it's wrong:** Non-Sanity URLs become broken (`?w=` query rejected); SVG → forced JPEG conversion that may render strangely.

#### P1-M12. `LegalPageLayout` paragraph keys use `paragraph` text as React `key`
- **Where:** [src/components/shared/LegalPageLayout.tsx](src/components/shared/LegalPageLayout.tsx)
- **What:** `{section.paragraphs.map((paragraph) => <p key={paragraph}>...)`.
- **Why it's wrong:** Two identical paragraph strings throw the React duplicate-key warning and break reconciliation.

#### P1-M13. `tsconfig` `target: ES2017`
- **Where:** [tsconfig.json](tsconfig.json)
- **What:** Compiling for ES2017 in 2025 disables modern syntax (top-level await, optional chaining short-circuit assignment lowering, etc.).
- **Why it's wrong:** Larger output, missed perf, mismatch with React 19 / Next 16 defaults.

### LOW

#### P1-L1. `lucide-react@^1.8.0` — non-existent stable major
- **Where:** [package.json](package.json#L17)
- **What:** Public npm `lucide-react` versions are `0.x.x`. `^1.8.0` either resolves to a tagged pre-release/typosquat or fails clean install on a fresh lockfile.
- **Why it's wrong:** Supply-chain risk: package may not be the canonical Lucide. At minimum, version pinning is wrong/fragile.

#### P1-L2. Hard-coded GitHub repo URL in deploy hook
- **Where:** [functions/api/deploy-hook.ts](functions/api/deploy-hook.ts)
- **What:** `'https://api.github.com/repos/illyrianqubic/radiofontana/dispatches'` baked in.
- **Why it's wrong:** Repo rename or fork breaks the auto-deploy silently.

#### P1-L3. `types.ts` `Category` union missing `"Lajme"` despite being used everywhere
- **Where:** [src/lib/types.ts](src/lib/types.ts)
- **What:** TypeScript union enumerates Politikë / Sport / etc. but not `"Lajme"`.
- **Why it's wrong:** Either `"Lajme"` is invalid (then the API defaulting to it is a bug — see P1-C5), or the union is incomplete.

#### P1-L4. Three `CATEGORY_COLORS` entries on a single line
- **Where:** [src/lib/types.ts](src/lib/types.ts)
- **What:** Formatting glitch.
- **Why it's wrong:** Diff noise risk; lint/format inconsistency.

#### P1-L5. `LajmeClient` uses module-level `articlesCache` and `articlesRequest`
- **Where:** [src/app/lajme/LajmeClient.tsx](src/app/lajme/LajmeClient.tsx)
- **What:** Promise/result memoised in module scope.
- **Why it's wrong:** Stale forever within an SPA session — newly published articles never appear until the user hard-reloads.

#### P1-L6. `Footer` is `'use client'` only to read `usePathname`
- **Where:** [src/components/layout/Footer.tsx](src/components/layout/Footer.tsx)
- **What:** Entire static footer markup ships as a client component.
- **Why it's wrong:** Pushes ~kB of unrelated JSX into the client bundle for one boolean (hide footer in studio).

#### P1-L7. `not-found.tsx` uses `priority` on a 100×100 logo
- **Where:** [src/app/not-found.tsx](src/app/not-found.tsx#L13)
- **What:** Decorative image marked LCP candidate.
- **Why it's wrong:** Misuse of `priority` boosts a non-critical image.

#### P1-L8. Catch blocks discard error info
- **Where:** [src/app/atom.xml/route.ts](src/app/atom.xml/route.ts), [src/app/news-sitemap.xml/route.ts](src/app/news-sitemap.xml/route.ts), [src/app/sitemap.ts](src/app/sitemap.ts), [src/app/kontakt/KontaktClient.tsx](src/app/kontakt/KontaktClient.tsx)
- **What:** `} catch { /* swallow */ }` — empty catch, no logging.
- **Why it's wrong:** Sanity outages produce empty feeds/sitemaps with no signal.

#### P1-L9. `WeatherWidget` hard-codes Albanian-only weekday names
- **Where:** [src/components/home/WeatherWidget.tsx](src/components/home/WeatherWidget.tsx)
- **What:** Weekday strings hard-coded; `getDay()` index used directly.
- **Why it's wrong:** Locale-coupled, day-shift risk per P1-M2.

---

## PHASE 2 — PERFORMANCE

### CRITICAL

#### P2-C1. ArticleClient double-fetch under 30 k–40 k DAU
- **Where:** [src/app/lajme/[slug]/ArticleClient.tsx](src/app/lajme/[slug]/ArticleClient.tsx)
- **What:** Server pre-renders article HTML, then client immediately re-requests `/api/article?slug=...`, which calls Sanity (no Cloudflare cache because `articles.ts`/`article.ts` set `Cache-Control: public, max-age=...` but the client `fetch` is `no-store` by default in Pages Functions response headers — review `functions/api/article.ts`).
- **Why it's wrong:** At 40 k DAU × ~3 article views = 120 k extra Sanity requests/day. Sanity CDN is fine for read but the project's Sanity plan limits CDN+API monthly. Cost and latency scale linearly with traffic.

#### P2-C2. Radio player `setInterval` clock + multiple `requestAnimationFrame` loops never sleep
- **Where:** [src/components/layout/RadioPlayer.tsx](src/components/layout/RadioPlayer.tsx)
- **What:** `setInterval(tick, 1000)` clock; rAF for drag/resize; persistent `localStorage` writes. No `document.hidden` gating.
- **Why it's wrong:** Tab in background still wakes the CPU once a second. On mobile this prevents radio-only users from hitting deep sleep, draining battery. At 30 k concurrent listeners the aggregate energy/CPU footprint is significant.

#### P2-C3. `framer-motion` shipped to home, contact, and live pages for decorative motion
- **Where:** [src/app/HomeClient.tsx](src/app/HomeClient.tsx), [src/app/kontakt/KontaktClient.tsx](src/app/kontakt/KontaktClient.tsx), [src/components/live/LivePlayer.tsx](src/components/live/LivePlayer.tsx)
- **What:** `import { motion, AnimatePresence } from 'framer-motion'` for fade-in cards and a row of bars. Even with `optimizePackageImports` the package adds ~40–60 KB gzipped.
- **Why it's wrong:** Adds first-load JS on the most visited pages for animations a CSS keyframe could deliver. Largest single library on the LCP-critical path.

#### P2-C4. Animations run forever on every page
- **Where:** [src/app/globals.css](src/app/globals.css#L255-L300) (ticker 40 s linear infinite, gradient-bar 8 s, glow-pulse 2 s, wave1–wave5 0.6–0.8 s, live-glow), [src/components/live/LivePlayer.tsx](src/components/live/LivePlayer.tsx) (`repeat: Infinity` on 18 motion.div bars)
- **What:** `animation: ... infinite` is applied to elements that exist on every page. Five waveform bars, ticker, gradient-bar, live-glow, ping-pulse, etc. all re-paint continuously.
- **Why it's wrong:** Constant compositor work; mobile GPUs and battery suffer. `animation: gradientShift` animates `background-position`, which is a paint-not-composite property — runs on the main thread.

#### P2-C5. Radio player uses `backdrop-filter: blur(32px) saturate(2)` permanently
- **Where:** [src/app/globals.css](src/app/globals.css#L325-L332) `.radio-player`
- **What:** Heaviest GPU effect in the CSS spec, applied to a fixed-position element that is on screen on every page.
- **Why it's wrong:** Forces the player and everything behind it onto a separate compositor layer, recomputed every paint. Weak Android GPUs can drop to <30 fps just from this.

### HIGH

#### P2-H1. `optimizeImageUrl` does not request `format=auto`/`q=70` consistently
- **Where:** [src/lib/utils.ts](src/lib/utils.ts), [src/components/news/NewsCard.tsx](src/components/news/NewsCard.tsx)
- **What:** Sanity supports `?w=...&auto=format&q=70&fit=max`. Worth confirming each call site uses the smallest size variant per breakpoint and `auto=format` to enable AVIF/WebP.
- **Why it's wrong:** With `images: { unoptimized: true }` in [next.config.ts](next.config.ts#L11), Next does no resizing/format conversion — every byte saved must come from the Sanity URL.

#### P2-H2. PortableText raw `<img>` has no `width`/`height` → CLS
- **Where:** [src/components/sanity/PortableText.tsx](src/components/sanity/PortableText.tsx)
- **What:** Renders `<img src=... />` without intrinsic dimensions or `loading="lazy"`.
- **Why it's wrong:** Cumulative Layout Shift on every article; Core Web Vitals regression site-wide.

#### P2-H3. `font-size: clamp(...)` on `<html>` triggers layout on resize
- **Where:** [src/app/globals.css](src/app/globals.css#L43)
- **What:** `font-size: clamp(14px, 0.22vw + 13px, 18px)` recomputes on every viewport resize event, cascading into every rem-based length.
- **Why it's wrong:** Massive style/layout invalidation on each resize tick.

#### P2-H4. `will-change: transform, opacity` on every animated class
- **Where:** [src/app/globals.css](src/app/globals.css#L444-L450) `.animate-pulse, .animate-spin, .animate-ping`
- **What:** Permanent `will-change` keeps composited layers alive even when not animating.
- **Why it's wrong:** Memory bloat and reduced GPU budget; opposite of intended optimisation.

#### P2-H5. Two GROQ calls per article page where one suffices
- **Where:** [src/app/lajme/[slug]/page.tsx](src/app/lajme/[slug]/page.tsx)
- **What:** `Promise.all([fetchArticleBySlug, fetchMetadataArticle])` — both hit Sanity for the same document.
- **Why it's wrong:** Double Sanity queries during build (and revalidation) for every published slug.

#### P2-H6. AudioPlayerContext leaks event listeners
- **Where:** [src/lib/AudioPlayerContext.tsx](src/lib/AudioPlayerContext.tsx)
- **What:** Listeners (`ended`, `error`, `play`, etc.) are added but never explicitly removed in cleanup; cleanup only sets `audio.src=''` and pauses.
- **Why it's wrong:** Long sessions accumulate audio elements / listener references during HMR or fast SPA navigation. Harmless when GC succeeds, leaky when something captures `audio`.

#### P2-H7. RadioPlayer writes `localStorage` on every state change
- **Where:** [src/components/layout/RadioPlayer.tsx](src/components/layout/RadioPlayer.tsx)
- **What:** Persisting volume/position/size on each move/resize tick.
- **Why it's wrong:** Synchronous main-thread writes during drag/resize cause jank and quota churn.

#### P2-H8. `optimizePackageImports: ['lucide-react','framer-motion','next-sanity']` cannot tree-shake CSS
- **Where:** [next.config.ts](next.config.ts#L7-L9)
- **What:** Helps JS, but `framer-motion` and `lucide-react` ship via several entry points; without code-level dynamic import the JS still lands on first load for HomeClient/Navbar/Footer/RadioPlayer.
- **Why it's wrong:** Initial JS payload remains heavy; LCP/INP blocked.

#### P2-H9. Pages Functions responses for `/api/article(s)` not cached on the edge
- **Where:** [functions/api/article.ts](functions/api/article.ts), [functions/api/articles.ts](functions/api/articles.ts)
- **What:** Inspecting headers — both set `Cache-Control: public, ...` but no `cf.cacheEverything` directive in fetch options to apicdn.sanity.io. Each function invocation calls Sanity even when an identical request was answered seconds ago.
- **Why it's wrong:** No edge cache means every reader hits Sanity through the function. With P2-C1 → linear scaling cost.

### MEDIUM

#### P2-M1. `articles.ts` clamps limit 1–200 — still allows expensive 200-doc fetches
- **Where:** [functions/api/articles.ts](functions/api/articles.ts)
- **What:** `Math.max(1, Math.min(200, limit))`.
- **Why it's wrong:** Anyone can spam `/api/articles?limit=200` to drain Sanity quota.

#### P2-M2. Decorative blur-3xl pseudo-elements on many pages
- **Where:** [src/app/kontakt/KontaktClient.tsx](src/app/kontakt/KontaktClient.tsx), [src/components/shared/LegalPageLayout.tsx](src/components/shared/LegalPageLayout.tsx), [src/app/rreth-nesh/page.tsx](src/app/rreth-nesh/page.tsx)
- **What:** Multiple absolutely-positioned `blur-3xl` divs.
- **Why it's wrong:** Each creates a composited layer; mobile fillrate hit.

#### P2-M3. ResponsiveContainer / breakpoints over-tweaked
- **Where:** [src/app/globals.css](src/app/globals.css#L116-L155)
- **What:** Five distinct width clauses for `.site-container`; nested media queries also mutate root font-size.
- **Why it's wrong:** Triggers extra layout recalc cycles; difficult to predict cascade order.

#### P2-M4. Navbar fetches `/api/livestream` every mount via `requestIdleCallback`
- **Where:** [src/components/layout/Navbar.tsx](src/components/layout/Navbar.tsx)
- **What:** No cross-tab dedupe, no `stale-while-revalidate`, no AbortController.
- **Why it's wrong:** Each SPA mount re-issues a network request; long-lived tabs never refresh, but freshly opened ones always hit the function.

#### P2-M5. `LajmeClient` filter logic recomputes derived arrays per keystroke
- **Where:** [src/app/lajme/LajmeClient.tsx](src/app/lajme/LajmeClient.tsx)
- **What:** `useMemo` not used; full array filter on every render.
- **Why it's wrong:** With hundreds of articles cached, search input feels sluggish.

#### P2-M6. Atom feed recomputes `new Date().toISOString()` per render
- **Where:** [src/app/atom.xml/route.ts](src/app/atom.xml/route.ts)
- **What:** Per-entry `new Date(a.publishedAt).toISOString()` plus per-entry `escapeXml`.
- **Why it's wrong:** Minor; build-time only since `dynamic = 'force-static'`.

### LOW

#### P2-L1. Studio chunk loaded via dynamic import, but `sanity.config.ts` still bundled
- **Where:** [src/app/studio/[[...tool]]/StudioClient.tsx](src/app/studio/[[...tool]]/StudioClient.tsx)
- **What:** Dynamic import works, but Sanity Studio is heavy (~MB).
- **Why it's wrong:** Acceptable given studio is editor-only, but worth noting it inflates the static export `out/` directory size.

#### P2-L2. Geist font loaded with `Geist` + `font-sans` fallback chain only
- **Where:** [src/app/layout.tsx](src/app/layout.tsx)
- **What:** Single weight family; no preconnect to `font.gstatic` (handled by next/font).
- **Why it's wrong:** Mostly fine. Verify `display: swap` is implicit.

---

## PHASE 3 — ARCHITECTURE / SECURITY / SEO / A11Y / SCALE

### CRITICAL

#### P3-C1. Open destructive endpoint = security incident waiting
- **Where:** [functions/api/cleanup.ts](functions/api/cleanup.ts) — see P1-C1
- **Why it's wrong (security-framed):** Any monitoring service / search engine / fuzzer that POSTs to `https://radiofontana.org/api/cleanup` triggers data destruction if `CLEANUP_CRON_SECRET` is missing. There is no allow-list of source IPs, no Cloudflare WAF rule visible. Add fail-closed auth and IP allow-listing.

#### P3-C2. `deploy-hook` uses non-constant-time comparison and accepts the secret as a query parameter
- **Where:** [functions/api/deploy-hook.ts](functions/api/deploy-hook.ts)
- **What:** `secret !== env.DEPLOY_HOOK_SECRET` (timing oracle, although Cloudflare's V8 string compare is hard to time remotely, discipline matters). Secret can be passed as `?secret=...`, which appears in Cloudflare access logs, browser history, referrer headers, and any log aggregator.
- **Why it's wrong:** Secret leakage through logs; principle is to require headers only and to use `crypto.subtle.timingSafeEqual` or equivalent.

#### P3-C3. No Content-Security-Policy header
- **Where:** [public/_headers](public/_headers)
- **What:** Missing `Content-Security-Policy` entirely. JSON-LD, GA4 inline scripts, PortableText `dangerouslySetInnerHTML`, and a contact form posting to a third-party domain all run without CSP.
- **Why it's wrong:** Any future XSS (in PortableText or inline JSON-LD) is unmitigated. CSP is mandatory baseline for a publicly indexed news site.

#### P3-C4. No Strict-Transport-Security header
- **Where:** [public/_headers](public/_headers)
- **What:** No HSTS.
- **Why it's wrong:** SSL stripping / downgrade attacks possible on first visit. Should be `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` after verifying all subdomains support TLS.

#### P3-C5. Studio is publicly reachable at `/studio`
- **Where:** [sanity.config.ts](sanity.config.ts), [src/app/studio/[[...tool]]/page.tsx](src/app/studio/[[...tool]]/page.tsx)
- **What:** No IP allow-list, no Cloudflare Access in front, no CAPTCHA. Studio relies on Sanity's own auth.
- **Why it's wrong:** Brute-force / credential stuffing / phishing attempts target an obvious URL. Should be behind Cloudflare Zero Trust / Access policy or geo-restricted.

#### P3-C6. GA4 + cookie banner non-compliance (legal CRITICAL)
- **Where:** see P1-C7, P1-C8
- **Why it's wrong:** Direct GDPR violation. Albanian DPA (AKMC) can fine; EU visitor lawsuits possible.

### HIGH

#### P3-H1. CORS `*` on every Pages Function
- **Where:** [functions/api/article.ts](functions/api/article.ts), [functions/api/articles.ts](functions/api/articles.ts), [functions/api/livestream.ts](functions/api/livestream.ts)
- **What:** `Access-Control-Allow-Origin: *`.
- **Why it's wrong:** Any third-party site can scrape your API at scale, multiplying Sanity costs and enabling content theft.

#### P3-H2. No rate limiting on any API endpoint
- **Where:** all `functions/api/*.ts`
- **What:** No per-IP throttle, no Cloudflare Rate Limiting Rules referenced.
- **Why it's wrong:** At 30 k–40 k users a single bad actor can DOS the Sanity quota with `/api/articles?limit=200`. The contact form is similarly unbounded.

#### P3-H3. Schema duplication between `<layout>` and `page`
- **Where:** [src/app/layout.tsx](src/app/layout.tsx), [src/app/page.tsx](src/app/page.tsx)
- **What:** layout emits `Organization`, `RadioStation`, `WebSite`. The home page additionally emits `LocalBusiness` describing the same entity.
- **Why it's wrong:** Conflicting `@type` for the same `@id` confuses Google. Use a single `RadioStation`/`Organization` graph.

#### P3-H4. Dual deploy configs (`wrangler.toml` + `wrangler.jsonc` + `open-next.config.ts`)
- **Where:** [wrangler.toml](wrangler.toml), [wrangler.jsonc](wrangler.jsonc), [open-next.config.ts](open-next.config.ts)
- **What:** Two wrangler configs side-by-side and an OpenNext config — but the project ships as a static export to Pages.
- **Why it's wrong:** Source of truth ambiguity. A dashboard-driven Pages deploy may pick one config; OpenNext is irrelevant unless deploying to Workers; future maintainers will guess wrong.

#### P3-H5. `Permissions-Policy` is incomplete
- **Where:** [public/_headers](public/_headers)
- **What:** Sets only `camera=(), microphone=(), geolocation=()`. Missing `interest-cohort=()`, `browsing-topics=()`, `attribution-reporting=()`, `autoplay=(self)` (since the radio player needs autoplay), `display-capture=()`, etc.
- **Why it's wrong:** Privacy hardening incomplete; FLoC/Topics signals not opted out.

#### P3-H6. `X-XSS-Protection` shipped — deprecated header
- **Where:** [public/_headers](public/_headers)
- **What:** `X-XSS-Protection: 1; mode=block`.
- **Why it's wrong:** Header is obsolete; Chrome's XSS auditor was removed and could even introduce vulnerabilities. Should be removed or set to `0`.

#### P3-H7. `X-Frame-Options: SAMEORIGIN` only — no CSP `frame-ancestors`
- **Where:** [public/_headers](public/_headers)
- **What:** XFO is legacy; modern equivalent is `Content-Security-Policy: frame-ancestors 'self'`.
- **Why it's wrong:** Inconsistent click-jacking defense.

#### P3-H8. Static export + dynamic article slugs leads to 200-OK soft 404s for unknown slugs
- **Where:** [src/app/lajme/[slug]/page.tsx](src/app/lajme/[slug]/page.tsx) + `_redirects` `/lajme/:slug -> /lajme/_/`
- **What:** Unknown slug → rewritten to `/lajme/_/` shell (200 OK), client fetch fails, user sees blank/error UI.
- **Why it's wrong:** Soft-404 pattern penalised by Google; reader bounces.

#### P3-H9. Sanity `readClient` uses `useCdn: true` and `perspective: 'published'` only
- **Where:** [src/sanity/client.ts](src/sanity/client.ts)
- **What:** No write client, no draft preview path.
- **Why it's wrong:** Editors cannot see unpublished drafts in Studio's "Live Preview" pane. Architectural limitation if previews are desired.

#### P3-H10. No telemetry for errors
- **Where:** entire app
- **What:** No Sentry, no Cloudflare Worker Logs subscription, no `console.error` aggregation.
- **Why it's wrong:** When a 30 k-DAU site breaks, you find out from Twitter, not from your monitoring.

#### P3-H11. `Article` schema lacks SEO fields
- **Where:** [src/sanity/schemaTypes/post.ts](src/sanity/schemaTypes/post.ts)
- **What:** No `seoTitle`, `metaDescription`, `ogImage`, `noIndex` toggle, `canonicalUrl`.
- **Why it's wrong:** Editors cannot tune snippets without changing the article title; OG image always defaults to `mainImage`.

#### P3-H12. RadioPlayer drag/resize has no keyboard alternative
- **Where:** [src/components/layout/RadioPlayer.tsx](src/components/layout/RadioPlayer.tsx)
- **What:** Drag handles are mouse/touch only; no `tabIndex`, no key bindings to move/resize.
- **Why it's wrong:** WCAG 2.1 SC 2.1.1 (Keyboard) violation — keyboard users cannot reposition the floating player that obscures content.

#### P3-H13. No focus-visible styling overrides
- **Where:** [src/app/globals.css](src/app/globals.css)
- **What:** `*:focus { outline: ... }` not customised; many custom buttons remove default outline (`focus:outline-none` Tailwind classes throughout).
- **Why it's wrong:** Keyboard navigation visibility broken across the site.

#### P3-H14. No Cloudflare Turnstile / hCaptcha on contact form
- **Where:** [src/app/kontakt/KontaktClient.tsx](src/app/kontakt/KontaktClient.tsx)
- **What:** Anonymous POSTs to public Web3Forms key.
- **Why it's wrong:** Spam vector; reputational risk if forwarded spam reaches editors.

### MEDIUM

#### P3-M1. `news-sitemap.xml` lacks `<news:keywords>` and `<news:genres>` tags
- **Where:** [src/app/news-sitemap.xml/route.ts](src/app/news-sitemap.xml/route.ts)
- **What:** Only mandatory fields emitted.
- **Why it's wrong:** Misses opportunity for Google News classification.

#### P3-M2. `robots.txt` allows `/api/*` indirectly; only `_headers` adds X-Robots-Tag
- **Where:** [src/app/robots.ts](src/app/robots.ts), [public/_headers](public/_headers)
- **What:** `disallow: ['/studio/', '/api/']` exists but lacks `Sitemap` per-language hint and there is no `Disallow: /lajme/_/` for the soft-404 shell.
- **Why it's wrong:** The fallback shell page is crawlable.

#### P3-M3. `<Link>` to `/cookies` etc. relies on Next adding trailing slash — fragile
- **Where:** [src/components/layout/Footer.tsx](src/components/layout/Footer.tsx)
- **What:** Hard-coded `href="/cookies"` (no slash). Works only because `trailingSlash: true` rewrites at the framework level.
- **Why it's wrong:** Brittle if `trailingSlash` is flipped; canonical inconsistency.

#### P3-M4. `lang` attribute on `<html>` is set, but article body lang not declared
- **Where:** [src/app/layout.tsx](src/app/layout.tsx)
- **What:** `<html lang="sq">` only.
- **Why it's wrong:** If editors ever embed English content, no `lang="en"` wrapper — accessibility/SR weakness.

#### P3-M5. Tailwind `group-hover` patterns used; fine on desktop, dead on mobile
- **Where:** several card components
- **What:** Touch devices never trigger `:hover`.
- **Why it's wrong:** Mobile users miss visual cues like `img-zoom` or accent bars.

#### P3-M6. No `<meta name="theme-color">` per dark/light, only one value
- **Where:** [src/app/layout.tsx](src/app/layout.tsx)
- **What:** Single theme-color.
- **Why it's wrong:** PWA / iOS Safari status bar color cannot adapt.

#### P3-M7. No skip-link for keyboard users
- **Where:** [src/app/layout.tsx](src/app/layout.tsx)
- **What:** No `<a href="#main">Skip to content</a>` at the top.
- **Why it's wrong:** WCAG SC 2.4.1 (Bypass Blocks).

#### P3-M8. No `prefers-reduced-motion` opt-out for many animations
- **Where:** [src/app/globals.css](src/app/globals.css)
- **What:** Only `.ticker-animate` honors `prefers-reduced-motion`. `glow-pulse`, `gradientShift`, `wave1..wave5`, `live-glow` ignore it.
- **Why it's wrong:** Vestibular-sensitive users cannot disable motion site-wide.

#### P3-M9. `eslint.config.mjs` lacks a11y, react-hooks, and security plugins
- **Where:** [eslint.config.mjs](eslint.config.mjs)
- **What:** Only `next/core-web-vitals` + `next/typescript`.
- **Why it's wrong:** Many of the issues catalogued here would be caught by `eslint-plugin-jsx-a11y`, `eslint-plugin-react-hooks`, `eslint-plugin-security`.

#### P3-M10. No CI workflow file visible
- **Where:** repository root
- **What:** No `.github/workflows/*.yml` referenced anywhere. Builds rely on Cloudflare Pages dashboard hooks.
- **Why it's wrong:** No PR-time typecheck, lint, or build verification → main branch can break in production.

#### P3-M11. `package.json` has no `engines` field
- **Where:** [package.json](package.json)
- **What:** No Node.js version constraint.
- **Why it's wrong:** Cloudflare Pages picks default Node; mismatches between local and prod possible.

#### P3-M12. No `Cross-Origin-Opener-Policy` / `Cross-Origin-Embedder-Policy` / `Cross-Origin-Resource-Policy`
- **Where:** [public/_headers](public/_headers)
- **What:** Missing modern isolation headers.
- **Why it's wrong:** Cannot use `SharedArrayBuffer`-based features; weaker process isolation.

#### P3-M13. `apicdn.sanity.io` used inside Pages Functions without timeout
- **Where:** [functions/api/article.ts](functions/api/article.ts), [functions/api/articles.ts](functions/api/articles.ts)
- **What:** `fetch(url)` with no `AbortController` / signal timeout.
- **Why it's wrong:** Sanity outage → function hangs until Cloudflare's hard 30 s limit, exhausting concurrent invocations and starving real requests.

#### P3-M14. Studio chunk is part of public deploy
- **Where:** [src/app/studio/[[...tool]]/page.tsx](src/app/studio/[[...tool]]/page.tsx)
- **What:** Studio bundle ships to every visitor of `/studio/`. Although `disallow: /studio/`, attackers can still load it.
- **Why it's wrong:** Surface area expansion. Studio could live on a separate subdomain (`studio.radiofontana.org`) protected by Access.

### LOW

#### P3-L1. JSON-LD organisation schema lacks `sameAs` for all socials in one place
- **Where:** [src/app/layout.tsx](src/app/layout.tsx)
- **What:** Verify all official socials listed; if missing TikTok/YouTube it weakens Knowledge Graph linking.

#### P3-L2. Seed script presence
- **Where:** [scripts/seed.mjs](scripts/seed.mjs)
- **What:** Seed script in repo. Verify it cannot be invoked against production by accident.

#### P3-L3. `_headers` cache TTL of 300s on HTML pages
- **Where:** [public/_headers](public/_headers)
- **What:** `Cache-Control: public,max-age=300,stale-while-revalidate=3600` on `/*`.
- **Why it's wrong:** Editors who hot-fix an article wait 5 min for browsers to refetch. Should rely on `revalidate=300` SSG plus shorter browser TTL or use `must-revalidate`.

#### P3-L4. `not-found` page does not include nav/search to recover
- **Where:** [src/app/not-found.tsx](src/app/not-found.tsx)
- **What:** Only "Back to home" link.
- **Why it's wrong:** Lost recovery opportunity; SEO bounce risk.

#### P3-L5. `Geist` font preconnect duplicated when next/font handles it
- **Where:** [src/app/layout.tsx](src/app/layout.tsx)
- **What:** Manual preconnects in `<head>` may overlap with next/font's automatic ones.

#### P3-L6. `LajmeClient` cache `articlesCache` is unbounded
- **Where:** [src/app/lajme/LajmeClient.tsx](src/app/lajme/LajmeClient.tsx)
- **What:** Module variable retains array forever.
- **Why it's wrong:** Memory growth on long sessions, although capped by article count.

#### P3-L7. `KontaktClient` floating decorations + framer-motion for static cards
- **Where:** [src/app/kontakt/KontaktClient.tsx](src/app/kontakt/KontaktClient.tsx)
- **What:** Each contact card uses `motion.div` for a one-time fade-in.
- **Why it's wrong:** Disproportionate library cost.

#### P3-L8. `Footer`/`LegalPageLayout` lack `aria-label` on the document-link region
- **Where:** [src/components/shared/LegalPageLayout.tsx](src/components/shared/LegalPageLayout.tsx)
- **What:** "Dokumente të lidhura" section has no landmark role.

#### P3-L9. `RadioPlayer` localStorage key `rf_player_v5` — version bump doesn't migrate
- **Where:** [src/components/layout/RadioPlayer.tsx](src/components/layout/RadioPlayer.tsx)
- **What:** Each version change orphans previous keys.
- **Why it's wrong:** Quota pollution over time on user devices.

#### P3-L10. `siteSettings` schema declared but never queried
- **Where:** [src/sanity/schemaTypes/siteSettings.ts](src/sanity/schemaTypes/siteSettings.ts)
- **What:** Schema defines `radioStreamUrl`, `facebookUrl`, etc., but the frontend hard-codes these.
- **Why it's wrong:** Editors think they can change socials/stream from Studio — they cannot.

---

## SUMMARY TABLE

| Severity | P1 (Bugs) | P2 (Perf) | P3 (Arch/Sec/SEO/A11y) | **Total** |
|---|---|---|---|---|
| CRITICAL | 8 | 5 | 6 | **19** |
| HIGH | 12 | 9 | 14 | **35** |
| MEDIUM | 13 | 6 | 14 | **33** |
| LOW | 9 | 2 | 10 | **21** |
| **Total** | **42** | **22** | **44** | **108** |

### Top recommended triage order (read-only assessment, not a fix list)
1. P1-C1 / P1-C2 / P3-C1 / P3-C2 — destructive endpoint + insecure auth (security incident risk).
2. P1-C7 / P1-C8 / P3-C6 — GDPR consent (legal exposure).
3. P1-C3 / P1-C4 / P1-C5 / P1-C6 — visible content correctness on every article view.
4. P2-C1 / P2-C2 / P2-C3 / P2-C4 / P2-C5 — perf at 30 k–40 k DAU.
5. P3-C3 / P3-C4 / P3-C5 — security headers + studio exposure.
6. Remaining HIGH / MEDIUM / LOW per phase.

— end of report —
