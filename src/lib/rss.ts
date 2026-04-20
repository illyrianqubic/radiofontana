import Parser from 'rss-parser';
import type { Article, Category } from './types';

const FEED_BASE = 'https://telegrafi.com/feed';

type CustomItem = {
  mediaContent?: { $: { url: string; medium?: string } };
  mediaThumbnail?: { $: { url: string } };
};

const parser = new Parser<Record<string, unknown>, CustomItem>({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
    ],
  },
  timeout: 8000,
});

function extractImage(item: Parser.Item & CustomItem): string {
  // WordPress feeds typically use media:content for featured images
  if (item.mediaContent?.$?.url) return item.mediaContent.$.url;
  if (item.mediaThumbnail?.$?.url) return item.mediaThumbnail.$.url;

  // Try enclosure (some WP feeds use this)
  if (item.enclosure?.url) return item.enclosure.url;

  // Parse first <img> from content HTML
  const html = (item as Record<string, string>)['content:encoded'] || item.content || '';
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match?.[1]) return match[1];

  return '/logortvfontana.jpg';
}

const CATEGORY_MAP: Record<string, Category> = {
  sport: 'Sport',
  sports: 'Sport',
  futboll: 'Sport',
  teknologji: 'Teknologji',
  teknologjia: 'Teknologji',
  technology: 'Teknologji',
  tech: 'Teknologji',
  showbiz: 'Showbiz',
  kultura: 'Showbiz',
  muzik: 'Showbiz',
  'argëtim': 'Showbiz',
  argetim: 'Showbiz',
  film: 'Showbiz',
  'shëndetësi': 'Shëndetësi',
  shendetësi: 'Shëndetësi',
  shendetesi: 'Shëndetësi',
  health: 'Shëndetësi',
  mjekësi: 'Shëndetësi',
  bota: 'Nga Bota',
  world: 'Nga Bota',
  'ndërkombëtare': 'Nga Bota',
  nderkombetare: 'Nga Bota',
  international: 'Nga Bota',
  rajon: 'Nga Bota',
};

function mapCategory(categories?: string[]): Category {
  if (!categories?.length) return 'Lajme';
  for (const cat of categories) {
    const key = cat.toLowerCase().trim();
    if (key in CATEGORY_MAP) return CATEGORY_MAP[key];
    // Partial matching
    for (const [mapKey, mappedCat] of Object.entries(CATEGORY_MAP)) {
      if (key.includes(mapKey)) return mappedCat;
    }
  }
  return 'Lajme';
}

function sanitizeTitle(raw: string): string {
  return raw
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

async function fetchFeedPage(page: number): Promise<(Parser.Item & CustomItem)[]> {
  const url = page === 1 ? FEED_BASE : `${FEED_BASE}/?paged=${page}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 300 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader/1.0)',
        Accept: 'application/rss+xml, application/xml, text/xml, */*',
      },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const feed = await parser.parseString(xml);
    return feed.items as (Parser.Item & CustomItem)[];
  } catch {
    return [];
  }
}

function itemToArticle(item: Parser.Item & CustomItem, index: number): Article {
  const externalUrl = item.link || (typeof item.guid === 'string' ? item.guid : '') || '#';
  // Derive a stable slug from the last URL segment
  const urlSlug = externalUrl.split('/').filter(Boolean).pop() || `article-${index}`;
  const id = `tele-${urlSlug}`;

  return {
    id,
    slug: id,
    title: sanitizeTitle(item.title || 'Pa titull'),
    excerpt: (item.contentSnippet || item.summary || '').replace(/<[^>]+>/g, '').slice(0, 200),
    content: (item as Record<string, string>)['content:encoded'] || item.content || '',
    category: mapCategory(item.categories as string[] | undefined),
    author: (item as Record<string, string>).creator || 'Telegrafi',
    publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
    imageUrl: extractImage(item),
    tags: (item.categories as string[]) || [],
    featured: index < 3,
    breaking: false,
    externalUrl,
    source: 'Telegrafi',
  };
}

export async function fetchTelegrafiArticles(limit = 100): Promise<Article[]> {
  // Fetch pages in parallel to reach the limit (default 10 items/page on WP)
  const pagesNeeded = Math.ceil(limit / 10);
  const pageNumbers = Array.from({ length: Math.min(pagesNeeded, 15) }, (_, i) => i + 1);

  const results = await Promise.allSettled(pageNumbers.map(fetchFeedPage));

  const allItems: (Parser.Item & CustomItem)[] = [];
  const seen = new Set<string>();

  for (const result of results) {
    if (result.status !== 'fulfilled') continue;
    for (const item of result.value) {
      const key = item.link || (typeof item.guid === 'string' ? item.guid : '') || '';
      if (!key || seen.has(key)) continue;
      seen.add(key);
      allItems.push(item);
    }
  }

  return allItems.slice(0, limit).map((item, i) => itemToArticle(item, i));
}
