import { Metadata } from 'next';
import { cache } from 'react';
import ArticleClient from './ArticleClient';
import { Article } from '@/lib/types';
import { readClient } from '@/sanity/client';
import { ARTICLE_BY_SLUG_QUERY, ARTICLE_SLUGS_QUERY } from '@/sanity/queries';

interface Props {
  params: Promise<{ slug: string }>;
}

const fetchArticleBySlug = cache(async (slug: string): Promise<Article | null> => {
  if (!slug || slug === '_') {
    return null;
  }
  try {
    return await readClient.fetch<Article | null>(
      ARTICLE_BY_SLUG_QUERY,
      { slug },
      { next: { revalidate: 300 } },
    );
  } catch (error) {
    console.error('[lajme/[slug]] ARTICLE_BY_SLUG_QUERY failed:', error);
    return null;
  }
});

const fetchArticleSlugs = cache(async (): Promise<Array<{ slug: string | null }>> => {
  try {
    const results = await readClient.fetch<Array<{ slug: string | null }>>(
      ARTICLE_SLUGS_QUERY,
      {},
      { next: { revalidate: 300 } },
    );
    return Array.isArray(results) ? results : [];
  } catch (error) {
    console.error('[lajme/[slug]] ARTICLE_SLUGS_QUERY failed:', error);
    return [];
  }
});

type MetadataArticle = {
  title: string;
  excerpt: string;
  imageUrl: string;
};

const fetchMetadataArticle = cache(async (slug: string): Promise<MetadataArticle | null> => {
  if (!slug || slug === '_') {
    return null;
  }
  try {
    return await readClient.fetch<MetadataArticle | null>(
      `*[_type == "post" && slug.current == $slug][0]{ title, excerpt, "imageUrl": coalesce(mainImage.asset->url, "") }`,
      { slug },
      { next: { revalidate: 300 } },
    );
  } catch {
    return null;
  }
});

export async function generateStaticParams() {
  const results = await fetchArticleSlugs();

  const slugs = results
    .map((p) => p.slug)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }));

  // Keep one static fallback page that can hydrate and fetch by browser URL slug.
  return [...slugs, { slug: '_' }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchMetadataArticle(slug);
  if (!article?.title) return { title: 'Artikull | Radio Fontana' };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.imageUrl ? [article.imageUrl] : [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const initialArticle = await fetchArticleBySlug(slug);

  return <ArticleClient slug={slug} initialArticle={initialArticle} />;
}
