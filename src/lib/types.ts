export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: Category;
  author: string;
  publishedAt: string;
  imageUrl: string;
  tags: string[];
  featured?: boolean;
  breaking?: boolean;
  /** External article URL — opens in new tab instead of /lajme/[slug] */
  externalUrl?: string;
  /** Source label e.g. 'Telegrafi' */
  source?: string;
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

