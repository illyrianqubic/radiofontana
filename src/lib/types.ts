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
  content: string | PortableTextBlock[];
  category: Category;
  author: string;
  publishedAt: string;
  imageUrl: string;
  tags: string[];
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
  | 'Lajme'
  | 'Sport'
  | 'Teknologji'
  | 'Showbiz'
  | 'Shëndetësi'
  | 'Nga Bota';

export const CATEGORIES: Category[] = [
  'Lajme',
  'Sport',
  'Teknologji',
  'Showbiz',
  'Shëndetësi',
  'Nga Bota',
];

export const CATEGORY_COLORS: Record<Category, string> = {
  Lajme: 'bg-blue-600',
  Sport: 'bg-green-600',
  Teknologji: 'bg-purple-600',
  Showbiz: 'bg-pink-600',
  Shëndetësi: 'bg-red-600',
  'Nga Bota': 'bg-orange-600',
};

