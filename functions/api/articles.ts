import type { Article, Category } from '../../src/lib/types';

// ── RSS helpers ──────────────────────────────────────────────────────────────

function getCDATA(xml: string, tag: string): string {
  const re = new RegExp(
    `<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`,
    'i',
  );
  const m = xml.match(re);
  return m ? m[1].trim() : '';
}

function getTag(xml: string, tag: string): string {
  const cdata = getCDATA(xml, tag);
  if (cdata) return cdata;
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const m = xml.match(re);
  return m ? decodeEntities(m[1].trim()) : '';
}

function getAttr(xml: string, tag: string, attr: string): string {
  const re = new RegExp(`<${tag}[^>]+${attr}=["']([^"']+)["']`, 'i');
  const m = xml.match(re);
  return m ? m[1] : '';
}

function getAllTags(xml: string, tag: string): string[] {
  const re = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'gi');
  const results: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(xml)) !== null) {
    results.push(decodeEntities(match[1].trim()));
  }
  return results;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function extractImage(itemXml: string, content: string): string {
  const mediaUrl = getAttr(itemXml, 'media:content', 'url') || getAttr(itemXml, 'media:thumbnail', 'url');
  if (mediaUrl) return mediaUrl;
  const enclosureUrl = getAttr(itemXml, 'enclosure', 'url');
  if (enclosureUrl) return enclosureUrl;
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch?.[1]) return imgMatch[1];
  return '/logortvfontana.jpg';
}

// ── Category classification ──────────────────────────────────────────────────

const TITLE_KEYWORDS: Array<[Category, string[]]> = [
  ['Sport', ['futboll', 'basketboll', 'volejboll', 'sport', ' gol', 'ndeshje', 'kampionat', 'lojtarë', 'lojtare', 'trajner']],
  ['Teknologji', ['teknologji', ' ai ', 'iphone', 'samsung', 'internet', 'kompjuter', 'aplikacion', 'software']],
  ['Showbiz', ['muzikë', 'muzike', 'këngëtar', 'kengëtar', 'kengëtare', 'aktor', 'aktore', ' film', 'shfaqje', 'koncert', 'celebrity', 'showbiz']],
  ['Shëndetësi', ['shëndetësi', 'shendetësi', 'shendetesi', 'mjekësi', 'mjekesi', 'spital', 'sëmundje', 'semundje', 'ilaç', 'ilac', 'vaksinë', 'vaksine', 'dietë', 'diete']],
  ['Nga Bota', ['shba', 'rusi', 'kinë', 'kine', 'europë', 'europe', 'nato', ' okb ', 'botë', ' bote', 'ndërkombëtar', 'nderkombëtar', 'nderkombetar']],
];

const CATEGORY_MAP: Record<string, Category> = {
  sport: 'Sport', sports: 'Sport', futboll: 'Sport',
  teknologji: 'Teknologji', technology: 'Teknologji', tech: 'Teknologji',
  showbiz: 'Showbiz', kultura: 'Showbiz', argetim: 'Showbiz',
  'shëndetësi': 'Shëndetësi', shendetesi: 'Shëndetësi', health: 'Shëndetësi',
  bota: 'Nga Bota', world: 'Nga Bota', nderkombetare: 'Nga Bota', rajon: 'Nga Bota',
};

function classify(title: string, categories: string[]): Category {
  const t = ` ${title.toLowerCase()} `;
  for (const [cat, kws] of TITLE_KEYWORDS) {
    if (kws.some((kw) => t.includes(kw))) return cat;
  }
  for (const cat of categories) {
    const key = cat.toLowerCase().trim();
    if (key in CATEGORY_MAP) return CATEGORY_MAP[key];
    for (const [mapKey, mappedCat] of Object.entries(CATEGORY_MAP)) {
      if (key.includes(mapKey)) return mappedCat;
    }
  }
  return 'Lajme';
}

// ── RSS fetch & parse ────────────────────────────────────────────────────────

const FEED_BASE = 'https://telegrafi.com/feed';

async function fetchPage(page: number): Promise<Article[]> {
  const url = page === 1 ? FEED_BASE : `${FEED_BASE}/?paged=${page}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader/1.0)',
        Accept: 'application/rss+xml, application/xml, text/xml, */*',
      },
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const items: Article[] = [];
    const itemRe = /<item>([\s\S]*?)<\/item>/gi;
    let itemMatch: RegExpExecArray | null;
    let index = (page - 1) * 10;

    while ((itemMatch = itemRe.exec(xml)) !== null) {
      const item = itemMatch[1];
      const link = getTag(item, 'link') || getTag(item, 'guid');
      if (!link) continue;

      const slug = link.split('/').filter(Boolean).pop() ?? `article-${index}`;
      const title = getTag(item, 'title') || 'Pa titull';
      const rawContent = getCDATA(item, 'content:encoded') || getTag(item, 'content');
      const content = rawContent.replace(/<img[^>]*>/i, '');
      const imageUrl = extractImage(item, rawContent);
      const categories = getAllTags(item, 'category');
      const pubDate = getTag(item, 'pubDate') || getTag(item, 'dc:date');
      const creator = getTag(item, 'dc:creator') || 'Redaksia';
      const snippet = rawContent.replace(/<[^>]+>/g, '').slice(0, 200);

      items.push({
        id: `rss-${slug}`,
        slug,
        title,
        excerpt: snippet,
        content,
        category: classify(title, categories),
        author: creator,
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        imageUrl,
        tags: categories,
        featured: index < 3,
        breaking: false,
      });
      index++;
    }
    return items;
  } catch {
    return [];
  }
}

// ── Handler ──────────────────────────────────────────────────────────────────

export async function onRequestGet(context: { request: Request }) {
  const url = new URL(context.request.url);
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '100', 10), 200);
  const pagesNeeded = Math.min(Math.ceil(limit / 10), 10);

  const results = await Promise.allSettled(
    Array.from({ length: pagesNeeded }, (_, i) => fetchPage(i + 1)),
  );

  const allArticles: Article[] = [];
  const seen = new Set<string>();

  for (const result of results) {
    if (result.status !== 'fulfilled') continue;
    for (const article of result.value) {
      if (seen.has(article.id)) continue;
      seen.add(article.id);
      allArticles.push(article);
    }
  }

  return Response.json(allArticles.slice(0, limit), {
    headers: {
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
