// Minimal portable text block type — avoids a hard dep on sanity in types.ts
export type PortableTextBlock = {
  _type: string;
  _key?: string;
  [key: string]: unknown;
};

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Portable Text blocks (from Sanity) or raw HTML string (legacy) */
  content?: string | PortableTextBlock[];
  readMinutes?: number;
  category: Category;
  author: string;
  publishedAt: string;
  /** Sanity-managed last-edit timestamp; used for OG modifiedTime / sitemap. */
  _updatedAt?: string;
  imageUrl: string;
  featured?: boolean;
  breaking?: boolean;
}

export interface LiveStream {
  isLive: boolean;
  title: string | null;
  facebookUrl: string | null;
  youtubeUrl: string | null;
  description: string | null;
}

export type Category =
  | 'Politikë'
  | 'Aktualitet'
  | 'Kronikë'
  | 'Sport'
  | 'Teknologji'
  | 'Showbiz'
  | 'Shëndetësi'
  | 'Nga Bota'
  | 'Biznes';

export const CATEGORIES: Category[] = [
  'Politikë',
  'Aktualitet',
  'Kronikë',
  'Sport',
  'Teknologji',
  'Showbiz',
  'Shëndetësi',
  'Biznes',
  'Nga Bota',
];

export const CATEGORY_COLORS: Record<Category, string> = {
  'Politikë': 'bg-blue-600',
  Aktualitet: 'bg-teal-600',
  'Kronikë': 'bg-indigo-600',
  Sport: 'bg-green-600',
  Teknologji: 'bg-purple-600',
  Showbiz: 'bg-pink-600',
  Shëndetësi: 'bg-red-600',
  Biznes: 'bg-amber-600',
  'Nga Bota': 'bg-orange-600',
};

/** Fallback badge color for categories missing from CATEGORY_COLORS (e.g. a
 *  category returned by Sanity that doesn't exactly match any known label —
 *  ASCII "Kronike" instead of "Kronikë", different diacritics, etc.). Keeps
 *  the category tag visible instead of rendering white text on a transparent
 *  background. */
export const DEFAULT_CATEGORY_COLOR = 'bg-red-600';

/** NFC-normalize + lowercase so "Kronike", "KRONIKË" and any copy/paste
 *  diacritic variance all match the canonical "Kronikë" badge color. */
export function getCategoryColor(category: string | null | undefined): string {
  if (!category) return DEFAULT_CATEGORY_COLOR;
  const normalized = category
    .normalize('NFC')
    .toLocaleLowerCase('sq-AL')
    .trim();
  for (const [key, color] of Object.entries(CATEGORY_COLORS)) {
    if (key.normalize('NFC').toLocaleLowerCase('sq-AL').trim() === normalized) {
      return color;
    }
  }
  return DEFAULT_CATEGORY_COLOR;
}

