# Radio Fontana 98.8 FM

Production codebase for **[radiofontana.org](https://radiofontana.org)** — the official website of **Radio Fontana**, a 24/7 Albanian-language FM radio station broadcasting from Istog, Kosovo on 98.8 MHz.

The site combines a live radio stream with a news publication: visitors can listen live from any page via a floating player and read articles published by the editorial team through Sanity CMS.

---

## What Radio Fontana is

- **Radio station** — Radio Fontana 98.8 FM, founded in 2010, broadcasting from Istog (Pejë region, Kosovo) on the FM band and live online via a Shoutcast stream at `live.radiostreaming.al:8010`.
- **News outlet** — original Albanian-language reporting on politics, sports, culture, technology and local Istog/Kosovo news. Articles are written and edited in Sanity Studio and published to the public site.
- **Sister organisation** — RTV Fontana (television sister channel; the radio site links to its social channels).

The website serves both audiences in one bundle: the live radio is always one click away (floating player visible on every non-Studio page) and the article archive is fully indexable by search engines and Google News.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | **Next.js 16** (App Router, `output: 'export'` static export) |
| Language | **TypeScript 6** (strict + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`) |
| UI | **React 19**, **Tailwind CSS v4** |
| CMS | **Sanity v5** (project `ksakxvtt`, dataset `production`, `next-sanity` v12) |
| Hosting | **Cloudflare Pages** + **Pages Functions** (edge), `wrangler` 4 |
| Audio | Native `<audio>` against Shoutcast MP3 stream, custom React context |
| Icons | `lucide-react` |
| Analytics | GA4 + Google Consent Mode v2 (denied by default until user accepts) |

No server runtime is built — every page is pre-rendered at build time and served as static HTML from the Cloudflare edge. Dynamic behaviour (article content, share metadata, contact form) is handled either client-side or via small Cloudflare Pages Functions.

---

## How it fits together

```
                       ┌──────────────────────────────┐
                       │  Editor writes in Sanity     │
                       │  Studio (/studio)            │
                       └──────────────┬───────────────┘
                                      │ webhook
                                      ▼
        ┌─────────────────────────────────────────────┐
        │  POST /api/deploy-hook (Pages Function)     │
        │  → triggers GitHub Actions workflow         │
        └──────────────┬──────────────────────────────┘
                       │
                       ▼
        ┌─────────────────────────────────────────────┐
        │  GitHub Actions: npm run build              │
        │  → Next exports static HTML                 │
        │  → wrangler pages deploy out                │
        └──────────────┬──────────────────────────────┘
                       │
                       ▼
        ┌─────────────────────────────────────────────┐
        │  Cloudflare Pages CDN serves static HTML    │
        │                                             │
        │  • /lajme/<slug>/   → static prerendered    │
        │  • /lajme/<slug>/   → Pages Function for    │
        │    NEW slugs (server-side OG injection)     │
        │  • /og/<slug>.jpg   → Pages Function (proxy │
        │    Sanity image, JPEG, for WhatsApp OG)     │
        │  • /api/article(s)  → Pages Function        │
        │    (Sanity passthrough, edge-cached)        │
        └─────────────────────────────────────────────┘
```

### How a brand-new article reaches a reader

1. **Author** writes/publishes the post in `/studio` (Sanity Studio, hosted in-app).
2. A **Sanity webhook** hits `/api/deploy-hook` which dispatches a GitHub Actions deploy.
3. While the rebuild is in flight, the slug **already works**: the Pages Function `functions/lajme/[slug].ts` serves the `/lajme/_/` shell, fetches the article from Sanity directly, and rewrites the `<title>` + `og:*` + `twitter:*` + canonical tags so WhatsApp / Facebook / Telegram link previews are correct *before* the static rebuild completes.
4. Inside the page, `ArticleClient.tsx` calls `/api/article?slug=…` (another Pages Function) and renders the content client-side.
5. After the build finishes, the slug is served as fully prerendered static HTML and the fallback Function is no longer used for it.

---

## Repository layout

```
radiofontana/
├── functions/                       # Cloudflare Pages Functions (run at the edge)
│   ├── api/
│   │   ├── article.ts               # GET /api/article?slug=…
│   │   ├── articles.ts              # GET /api/articles (paginated)
│   │   ├── deploy-hook.ts           # POST /api/deploy-hook (Sanity → GH Actions)
│   │   └── livestream.ts            # GET /api/livestream
│   ├── lajme/
│   │   └── [slug].ts                # Fallback for unbuilt slugs + OG injection
│   └── og/
│       └── [slug].jpg.ts            # Per-slug 1200×630 JPEG proxy for WhatsApp OG
│
├── public/
│   ├── _headers                     # Cloudflare Pages HTTP header rules (cache, CSP, security)
│   ├── _redirects                   # URL rewrites/redirects
│   ├── logortvfontana.jpg           # Station logo (used as fallback OG image)
│   └── …favicons, manifest…
│
├── scripts/
│   └── seed.mjs                     # Seed script for local Sanity dataset
│
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── layout.tsx               # Root layout: head, GA4, color-scheme, RadioPlayer mount
│   │   ├── globals.css              # Tailwind + design tokens + CSS animations
│   │   ├── page.tsx                 # Homepage (SSG)
│   │   ├── HomeClient.tsx           # Hero, featured, latest, most-read grids
│   │   ├── not-found.tsx            # 404 page
│   │   ├── robots.ts                # /robots.txt
│   │   ├── sitemap.ts               # /sitemap.xml
│   │   ├── lajme/
│   │   │   ├── page.tsx             # /lajme — listing page
│   │   │   ├── LajmeClient.tsx      # Client filter / search / pagination
│   │   │   └── [slug]/
│   │   │       ├── page.tsx         # Article SSG + generateMetadata (OG via /og/<slug>.jpg)
│   │   │       └── ArticleClient.tsx  # Client UI: share, copy link, related, etc.
│   │   ├── live/page.tsx            # /live — full-screen radio page
│   │   ├── kontakt/                 # Contact page + form (client component)
│   │   ├── rreth-nesh/page.tsx      # /rreth-nesh ("About us")
│   │   ├── privacy/  terms/  cookies/  gdpr/  disclaimer/   # Legal pages
│   │   ├── rss.xml/  atom.xml/  news-sitemap.xml/           # Feeds
│   │   └── studio/[[...tool]]/      # /studio — Sanity Studio host (dynamic import)
│   │
│   ├── components/
│   │   ├── home/                    # WeatherWidget, NewsletterSection
│   │   ├── layout/                  # Navbar, Footer, RadioPlayer (floating draggable),
│   │   │                            # BreakingNewsTicker, CookieConsentBanner
│   │   ├── live/LivePlayer.tsx      # /live page UI (pure CSS animations, no framer-motion)
│   │   ├── news/                    # NewsCard (4 variants), NewsFilter
│   │   ├── sanity/PortableText.tsx  # Custom Portable Text renderer
│   │   └── shared/                  # SocialIcons, LegalPageLayout
│   │
│   ├── lib/
│   │   ├── AudioPlayerContext.tsx   # Global radio audio state + first-interaction prewarm
│   │   ├── types.ts                 # Article, LiveStream, Category, CATEGORY_COLORS
│   │   └── utils.ts                 # formatAlbanianDate (UTC-safe), timeAgo, readTime, optimizeImageUrl
│   │
│   └── sanity/
│       ├── client.ts                # Sanity read client (CDN, no stega)
│       ├── env.ts                   # Project ID / dataset / API version
│       ├── image.ts                 # Sanity image URL builder
│       ├── queries.ts               # GROQ queries
│       ├── siteSettings.ts          # fetchSiteSettings (social URLs, stream URL)
│       └── schemaTypes/             # post, author, category, liveStream, siteSettings
│
├── design-tokens.json               # Documented design tokens
├── next.config.ts                   # output: 'export', trailingSlash, custom Sanity image loader
├── sanity.config.ts                 # Studio config
├── sanity.cli.ts                    # Sanity CLI config
├── wrangler.jsonc / wrangler.toml   # Cloudflare Pages config + env vars
├── tsconfig.json                    # TS 6 strict
├── eslint.config.mjs                # ESLint flat config
├── postcss.config.mjs               # PostCSS (Tailwind v4)
├── AGENTS.md / CLAUDE.md            # AI-agent project notes
└── AUDIT.md                         # Long-form code audit
```

---

## Running locally

### Prerequisites

- **Node.js ≥ 20**
- **npm ≥ 10**

### Install
```bash
npm install
```

### Development
```bash
npm run dev          # Next dev server at http://localhost:3000
```
Sanity Studio is available at `/studio` in dev as well.

### Local production preview (with Pages Functions)
```bash
npm run dev:cf       # builds the static site, then runs `wrangler pages dev out`
```
Use this whenever you change anything under `functions/` — `next dev` doesn't execute Cloudflare Pages Functions.

### Build for production
```bash
npm run build        # static export → ./out
```

### Lint
```bash
npm run lint
```

> ⚠️ `npm start` is intentionally not used — `output: 'export'` does not produce a Node server. Deploy the contents of `./out/` to Cloudflare Pages instead.

---

## Deploy

Deployments happen automatically:

- **Push to `main`** → GitHub Actions → `wrangler pages deploy out --project-name radiofontana`.
- **Sanity webhook** → `POST /api/deploy-hook` → GitHub Actions repository_dispatch event → same deploy.

Manual deploy (from a clean `out/`):
```bash
npm run build
npx wrangler pages deploy out --project-name radiofontana --commit-dirty=true
```

### Required environment variables

Set in Cloudflare Pages → Settings → Environment variables, and mirrored in `wrangler.jsonc` for Functions:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID (`ksakxvtt`) |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-01-01` |
| `SANITY_API_READ_TOKEN` | (optional) read token for non-CDN draft access |

GitHub Actions also needs:

| Secret | Purpose |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Pages deploy permission |
| `CLOUDFLARE_ACCOUNT_ID` | Account scope |

---

## Performance notes

The site is tuned for cold-start mobile cellular conditions; key choices:

- **Static export** — every page is HTML at the edge, no SSR cold-start.
- **Custom Sanity image loader** ([next.config.ts](next.config.ts)) — emits `?w=…&fm=webp&q=…` automatically so each `<Image>` is served at the right size and format.
- **Server-side OG injection** — `functions/lajme/[slug].ts` rewrites OG tags for unbuilt slugs so social previews work *before* the next deploy.
- **WhatsApp-friendly OG image proxy** — `functions/og/[slug].jpg.ts` streams the resized Sanity image at a clean `.jpg` URL because WhatsApp's scraper sniffs by URL extension, not Content-Type.
- **Forced light color-scheme** — `color-scheme: only light` (HTML `style`, `<meta>`, and a render-blocking inline `<style>`) prevents Android in-app WebViews from auto-darkening the page.
- **Audio prewarm** — the radio player opens a TLS handshake on the *first* interaction anywhere on the page (pointerdown / touch / scroll / key). By the time the user reaches the play button, DNS + TCP + TLS are already done, cutting first-audio latency by ~150–400 ms on cold cellular.
- **Lightweight `/live` page** — animations are pure CSS keyframes; framer-motion is not loaded on this page.
- **Trailing-slash canonical URLs everywhere** — matches `next.config.ts` `trailingSlash: true` so `og:url` / `<link rel="canonical">` never trigger a 308 when scrapers crawl them.

---

## Sanity content model

| Schema | Purpose |
| --- | --- |
| `post` | News article: title, slug, excerpt, mainImage, content (Portable Text), category ref, author ref, publishedAt |
| `author` | Editorial author: name, role, image, bio |
| `category` | Article category: title, slug, color |
| `liveStream` | Live status: isLive, title, facebookUrl, youtubeUrl |
| `siteSettings` | Singleton: site title, description, social URLs, stream URL |

The Studio is hosted at [radiofontana.org/studio](https://radiofontana.org/studio) and is gated by Sanity authentication.

---

## Routes overview

| Route | Type | Notes |
| --- | --- | --- |
| `/` | Static SSG | Homepage |
| `/lajme/` | Static SSG | News listing |
| `/lajme/<slug>/` | SSG (existing) / Pages Function (new slugs) | Fallback Function rewrites OG tags for unbuilt posts |
| `/live/` | Static SSG | Full-screen radio page |
| `/kontakt/`, `/rreth-nesh/` | Static SSG | About / contact |
| `/privacy/`, `/terms/`, `/cookies/`, `/gdpr/`, `/disclaimer/` | Static SSG | Legal pages |
| `/studio/*` | Static SSG (client-rendered) | Sanity Studio |
| `/sitemap.xml`, `/news-sitemap.xml`, `/robots.txt`, `/rss.xml`, `/atom.xml` | Static SSG | SEO surfaces |
| `/api/article`, `/api/articles`, `/api/livestream`, `/api/deploy-hook` | Pages Function | Edge JSON APIs |
| `/og/<slug>.jpg` | Pages Function | Per-article OG image proxy |

---

## Contact

- **Editorial:** rtvfontana@gmail.com — +383 44 150 027
- **Customer service:** +383 44 141 294
- **Address:** Rruga "Ibrahim Rugova" Nr. 56, 50250 Istog, Kosovo

---

## License

© Radio Fontana / RTV Fontana. All rights reserved. The source in this repository is private and not licensed for redistribution.
