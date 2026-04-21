import { Metadata } from 'next';
import HomeClient from './HomeClient';
import { client } from '@/sanity/client';
import { ARTICLES_QUERY } from '@/sanity/queries';
import { Article } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Radio Fontana - Lajmet e Fundit nga Istog dhe Kosova',
  description:
    'Lajmet e fundit, analizat dhe raportimet ekskluzive nga Radio Fontana, stacioni kryesor i informacionit në Istog.',
};

async function fetchHomeArticles(): Promise<Article[]> {
  try {
    const data = await client.fetch<Article[]>(ARTICLES_QUERY, { limit: 30 });
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const articles = await fetchHomeArticles();
  return <HomeClient articles={articles} />;
}
