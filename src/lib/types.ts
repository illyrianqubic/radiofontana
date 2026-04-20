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

export interface ProgramSlot {
  day: string;
  time: string;
  show: string;
  host: string;
  description: string;
}

export interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  humidity: number;
  wind: number;
  icon: string;
}
