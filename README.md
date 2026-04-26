# Radio Fontana — radiofontana.org

The official website for **Radio Fontana 98.8 FM**, a local Albanian-language radio and news outlet based in Istog, Kosovo.

Live site: **https://radiofontana.org**  
GitHub: **https://github.com/illyrianqubic/radiofontana**  
Deploy target: **Cloudflare Pages** (static export, edge functions)

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router, `output: 'export'`) | 16.2.4 |
| UI Library | React | 19.2.4 |
| Language | TypeScript (strict mode) | ^5 |
| Styling | Tailwind CSS v4 | ^4 |
| CSS Processing | @tailwindcss/postcss | ^4 |
| CMS | Sanity v5 (hosted, project `ksakxvtt`) | ^5.21.0 |
| CMS Client | next-sanity | ^12.3.0 |
| CMS Studio | Embedded at `/studio` via `next-sanity/studio` | — |
| Portable Text | @portabletext/react | ^6.0.3 |
| Sanity Vision | @sanity/vision (GROQ query explorer) | ^5.21.0 |
| Animation | Framer Motion | ^12.38.0 |
| Icons | lucide-react | ^1.8.0 |
| Deployment | Cloudflare Pages + Pages Functions (edge) | — |
| Deploy CLI | Wrangler | ^4.84.0 |
| Lint | ESLint 9 (flat config) + eslint-config-next | ^9 |
| Font | Geist (via `next/font/google`) | — |
| Analytics | Google Analytics 4 (`G-9D4QPTBGCQ`) via `next/script` | — |
| Radio stream | ICY/Shoutcast `https://live.radiostreaming.al:8010/stream.mp3` | — |

> **Note:** `styled-components` appears as a direct dependency but is only required transitively by `sanity` / `@sanity/ui` / `next-sanity`. It is not used directly in application code.

---

## Project Structure

```
radiofontana/
├── functions/                    # Cloudflare Pages Functions (edge API routes)
│   └── api/
│       ├── articles.ts           # GET /api/articles — paginated article list from Sanity
│       ├── article.ts            # GET /api/article?slug=… — single article by slug
│       ├── livestream.ts         # GET /api/livestream — live stream status from Sanity
│       ├── deploy-hook.ts        # POST /api/deploy-hook — Sanity webhook → GitHub Actions dispatch
│       └── cleanup.ts            # POST /api/cleanup — delete Sanity posts older than 30 days
│
├── public/
│   ├── _headers                  # Cloudflare Pages HTTP headers (cache, security, CORS)
│   ├── _redirects                # Cloudflare Pages URL rewrites/redirects
│   └── logortvfontana.jpg        # Station logo (OG image, favicon fallback)
│
├── scripts/                      # Utility scripts (e.g. Sanity seed data)
│
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── layout.tsx            # Root layout: fonts, GA4, JSON-LD, Navbar, Footer, RadioPlayer, CookieConsent
│   │   ├── globals.css           # Global CSS, Tailwind base, design tokens, animations
│   │   ├── page.tsx              # Homepage — fetches articles from Sanity at build time
│   │   ├── HomeClient.tsx        # Client component: hero, featured, latest, most-read grids
│   │   ├── not-found.tsx         # 404 page with station logo
│   │   ├── robots.ts             # /robots.txt generation
│   │   ├── sitemap.ts            # /sitemap.xml — static pages + all article slugs
│   │   │
│   │   ├── lajme/
│   │   │   ├── page.tsx          # /lajme — news listing metadata + schema
│   │   │   ├── LajmeClient.tsx   # Client: article list, category filter, search, load-more pagination
│   │   │   └── [slug]/
│   │   │       ├── page.tsx      # Article page — SSG with generateStaticParams + generateMetadata
│   │   │       └── ArticleClient.tsx  # Client: full article, share buttons, related articles, copy toast
│   │   │
│   │   ├── live/
│   │   │   └── page.tsx          # /live — live radio player page
│   │   │
│   │   ├── kontakt/
│   │   │   ├── page.tsx          # /kontakt — contact page metadata + LocalBusiness schema
│   │   │   └── KontaktClient.tsx # Client: contact form UI, address, phone, email
│   │   │
│   │   ├── rreth-nesh/
│   │   │   └── page.tsx          # /rreth-nesh — "About Us" page (stats, history, values, schedule)
│   │   │
│   │   ├── privacy/page.tsx      # /privacy — Privacy Policy (Albanian, GDPR-compliant)
│   │   ├── terms/page.tsx        # /terms — Terms of Use
│   │   ├── cookies/page.tsx      # /cookies — Cookie Policy
│   │   ├── gdpr/page.tsx         # /gdpr — GDPR rights page
│   │   ├── disclaimer/page.tsx   # /disclaimer — Editorial Disclaimer
│   │   │
│   │   ├── rss.xml/route.ts      # /rss.xml — RSS 2.0 feed (revalidates hourly)
│   │   ├── atom.xml/route.ts     # /atom.xml — Atom feed
│   │   ├── news-sitemap.xml/     # /news-sitemap.xml — Google News sitemap
│   │   │
│   │   └── studio/[[...tool]]/
│   │       ├── page.tsx          # /studio — Sanity Studio host page
│   │       └── StudioClient.tsx  # Dynamic (SSR=false) import of NextStudio + sanity.config
│   │
│   ├── components/
│   │   ├── home/
│   │   │   └── WeatherWidget.tsx # Static mock weather widget for Istog (hardcoded, not live API)
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.tsx        # Sticky top nav: logo, links, search, mobile menu, live badge, date
│   │   │   ├── Footer.tsx        # Footer: links, social icons, legal links, copyright
│   │   │   ├── RadioPlayer.tsx   # Floating draggable/resizable audio player (fixed bottom-center)
│   │   │   ├── BreakingNewsTicker.tsx  # Horizontal scrolling ticker for breaking news
│   │   │   └── CookieConsentBanner.tsx # GDPR cookie consent banner (localStorage-persisted)
│   │   │
│   │   ├── live/
│   │   │   └── LivePlayer.tsx    # /live page: play/pause UI, live status badge, FB embed (commented out)
│   │   │
│   │   ├── news/
│   │   │   ├── NewsCard.tsx      # Article card with 4 variants: hero, compact, horizontal, default
│   │   │   └── NewsFilter.tsx    # Category pills + search input for the /lajme listing
│   │   │
│   │   ├── sanity/
│   │   │   └── PortableText.tsx  # Custom Portable Text renderer (paragraphs, headings, lists, images)
│   │   │
│   │   └── shared/
│   │       ├── SocialIcons.tsx   # SVG icon components: Facebook, Instagram, YouTube, TikTok, WhatsApp, X
│   │       └── LegalPageLayout.tsx  # Shared layout for all 5 legal pages (renders sections + email links)
│   │
│   ├── lib/
│   │   ├── AudioPlayerContext.tsx  # React context for the global radio audio player state
│   │   ├── types.ts               # Shared TypeScript types: Article, LiveStream, Category, CATEGORY_COLORS
│   │   └── utils.ts               # Utility functions: timeAgo, formatAlbanianDate, readTime, optimizeImageUrl
│   │
│   └── sanity/
│       ├── client.ts             # Sanity read client (CDN, no stega)
│       ├── env.ts                # Sanity config constants (project ID, dataset, API version)
│       ├── queries.ts            # GROQ queries: ARTICLES_QUERY, ARTICLE_BY_SLUG_QUERY, ARTICLE_SLUGS_QUERY
│       └── schemaTypes/
│           ├── index.ts          # Schema registry
│           ├── post.ts           # Article/post schema (title, slug, content, category, publishedAt, etc.)
│           ├── author.ts         # Author schema (name, role, image, bio)
│           ├── category.ts       # Category schema (title, slug, color)
│           ├── liveStream.ts     # Live stream schema (isLive, title, facebookUrl, youtubeUrl)
│           └── siteSettings.ts   # Site settings schema (title, description, social URLs)
│
├── design-tokens.json            # Documented colour/spacing tokens extracted from the codebase
├── next.config.ts                # Next.js config: static export, trailingSlash, transpilePackages
├── sanity.config.ts              # Sanity Studio config: structure, vision plugin, schema, no Releases
├── sanity.cli.ts                 # Sanity CLI config (project ID, dataset, auto-updates)
├── wrangler.jsonc                # Wrangler config: project name, output dir, Sanity env vars
├── wrangler.toml                 # Wrangler config (TOML mirror of wrangler.jsonc)
├── tsconfig.json                 # TypeScript config (strict, bundler resolution, @/* alias)
├── eslint.config.mjs             # ESLint flat config (next/core-web-vitals + next/typescript)
└── postcss.config.mjs            # PostCSS config (Tailwind CSS v4 plugin)
```

---

## Running Locally

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10

### Install dependencies

```bash
npm install
```

### Development server

```bash
npm run dev
```

Opens at `http://localhost:3000`. The app fetches articles from the live Sanity project at build/request time — no `.env` file needed for read-only access since project ID and dataset are committed in `src/sanity/env.ts`.

### Simulate Cloudflare Pages locally

```bash
npm run dev:cf
# Equivalent to: next build && wrangler pages dev out
```

This builds the static export to `out/` and serves it through Wrangler, including the edge API functions under `functions/`.

---

## Building

```bash
npm run build
```

Outputs a fully static site to `out/`. All article pages are pre-rendered at build time via `generateStaticParams`. A `{ slug: '_' }` fallback page is included so dynamically created articles can be fetched client-side without requiring a rebuild.

---

## Deploying to Cloudflare Pages

### Manual deploy

```bash
npx wrangler pages deploy out --project-name radiofontana --commit-dirty=true
```

### Automated deploy via Sanity webhook

When an article is published in Sanity Studio, a webhook fires `POST /api/deploy-hook`. That edge function verifies a shared secret and dispatches a `repository_dispatch` event to GitHub Actions (`sanity-publish`), triggering a full build + deploy.

Required Cloudflare Pages environment variables for the webhook:
- `GITHUB_TOKEN` — GitHub PAT with `workflow` scope
- `DEPLOY_HOOK_SECRET` — shared secret matching the Sanity webhook configuration

Optional variables for the cleanup cron:
- `SANITY_WRITE_TOKEN` — Sanity token with write access (for `/api/cleanup`)
- `CLEANUP_CRON_SECRET` — secret to protect the cleanup endpoint

---

## Sanity Studio

The embedded CMS studio is accessible at `/studio` in both development and production.

- **Project ID:** `ksakxvtt`
- **Dataset:** `production`
- **API version:** `2024-01-01`

### Schema types

| Type | Purpose |
|---|---|
| `post` | News articles (title, slug, excerpt, content, category, author, publishedAt, image, tags, featured, breaking) |
| `author` | Author profiles (name, role, image, bio) |
| `category` | Article categories (title, slug, description, Tailwind color class) |
| `liveStream` | Live stream status (isLive toggle, title, Facebook/YouTube URLs) |
| `siteSettings` | Global site metadata and social URLs |

Content Releases (multi-document scheduling) is disabled — the standard "Publish" button is used instead.

---

## Edge API Routes (Cloudflare Pages Functions)

All functions live in `functions/api/` and run at the Cloudflare edge.

| Route | Method | Description |
|---|---|---|
| `/api/articles` | GET | Returns up to N articles (default 20, max 200). Query param: `?limit=N` |
| `/api/article` | GET | Returns a single article. Query param: `?slug=<slug>` |
| `/api/livestream` | GET | Returns `{ isLive, title, facebookUrl, youtubeUrl, description }` — cached 30s |
| `/api/deploy-hook` | POST | Triggers GitHub Actions deploy when Sanity publishes content |
| `/api/cleanup` | POST | Deletes Sanity posts older than 30 days (requires `SANITY_WRITE_TOKEN`) |

---

## Key Features

- **Floating radio player** — draggable, resizable, persists position via `localStorage`, plays `live.radiostreaming.al:8010/stream.mp3`
- **Breaking news ticker** — horizontal scroll animation, shows articles marked `breaking` within the last 24 hours
- **Relative timestamps** — Albanian: "tani", "X minuta më parë", "dje", "X ditë më parë", "X javë më parë", "X muaj më parë"
- **Article copy link** — uses `window.location.href` with `execCommand` fallback for iOS, shows "✓ Linku u kopjua!" toast
- **Category filter + search** — URL-synced (`?kategoria=` / `?q=`), no page reload
- **Load-more pagination** — 12 articles per page on `/lajme`, client-side
- **SEO** — JSON-LD (Organization, RadioStation, WebSite, BreadcrumbList, NewsArticle, LocalBusiness), OpenGraph, hreflang, canonical URLs
- **Feeds** — RSS 2.0 (`/rss.xml`), Atom (`/atom.xml`), Google News Sitemap (`/news-sitemap.xml`)
- **Legal pages** — Privacy, Terms, Cookies, GDPR, Disclaimer (all in Albanian)
- **GA4** — `G-9D4QPTBGCQ`, loaded via `next/script strategy="afterInteractive"`
- **Cookie consent** — GDPR banner, `localStorage`-persisted
- **Weather widget** — static mock (not connected to a live API)

---

## Caching Strategy

Defined in `public/_headers` (applied by Cloudflare Pages):

| Asset type | Cache-Control |
|---|---|
| `/_next/static/*` | `max-age=31536000, immutable` |
| Images (jpg, png, webp, svg, ico) | `max-age=31536000, immutable` |
| `/rss.xml`, `/atom.xml` | `max-age=3600, stale-while-revalidate=86400` |
| `/sitemap.xml`, `/news-sitemap.xml` | `max-age=3600, stale-while-revalidate=86400` |
| All pages (`/*`) | `max-age=300, stale-while-revalidate=3600` |

Security headers applied globally: `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`.

---

## Dependency Audit

### Outdated packages (as of April 2026)

| Package | Installed | Latest | Notes |
|---|---|---|---|
| `sanity` | 5.21.0 | 5.22.0 | Minor, safe to update |
| `@sanity/vision` | 5.21.0 | 5.22.0 | Minor, safe to update |
| `lucide-react` | 1.8.0 | 1.11.0 | Minor, safe to update |
| `@tailwindcss/postcss` | 4.2.2 | 4.2.4 | Patch, safe to update |
| `tailwindcss` | 4.2.2 | 4.2.4 | Patch, safe to update |
| `wrangler` | 4.84.0 | 4.85.0 | Patch, safe to update |
| `@types/node` | 20.x | 25.x | Major jump, test before updating |
| `typescript` | 5.x | 6.x | Major, breaking changes possible |
| `eslint` | 9.x | 10.x | Major, config changes required |

### Unused direct dependency

- **`styled-components`** — listed as a direct dependency but only used transitively by `sanity` / `@sanity/ui`. It can be removed from `package.json` as `dependencies` (it will still be installed transitively). No custom application code imports it.

---

## Known Limitations

- **Weather widget** is static/mocked — temperature and conditions are hardcoded, not from a live API.
- **iOS volume control** — `HTMLAudioElement.volume` is ignored by iOS Safari (hardware volume buttons only). The slider moves visually but does not change audio volume on iOS.
- **Facebook Live embed** is commented out in `LivePlayer.tsx` — uncomment to re-enable when a live stream is active.
- **No `.env` file needed** for local development — Sanity project ID and dataset are hardcoded for this public read-only project. For write operations (deploy hook, cleanup), secrets must be set in Cloudflare Pages environment variables.
- **Static export limitation** — `next start` is not used. There is no server-side rendering; all pages are pre-rendered HTML. Dynamic content (new articles after build) is hydrated client-side via the edge API functions.

---

## Scripts

```bash
npm run dev        # Start Next.js dev server (hot reload)
npm run build      # Static export to out/
npm run start      # Next.js production server (not used — Cloudflare serves out/)
npm run lint       # ESLint (flat config, next/core-web-vitals + typescript rules)
npm run dev:cf     # Build + Wrangler local Pages dev (simulates Cloudflare environment)
```

