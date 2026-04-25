import { Metadata } from 'next';
import { cache } from 'react';

const SITE_URL = 'https://radiofontana.org';
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
  } catch {
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
  } catch {
    return [];
  }
});

type MetadataArticle = {
  title: string;
  excerpt: string;
  imageUrl: string;
  publishedAt: string;
  _updatedAt: string;
  author: string;
  category: string;
};

const fetchMetadataArticle = cache(async (slug: string): Promise<MetadataArticle | null> => {
  if (!slug || slug === '_') {
    return null;
  }
  try {
    return await readClient.fetch<MetadataArticle | null>(
      `*[_type == "post" && slug.current == $slug][0]{
        title, excerpt,
        "imageUrl": coalesce(mainImage.asset->url, ""),
        publishedAt, _updatedAt,
        "author": coalesce(author->name, "Radio Fontana"),
        "category": coalesce(category->title, "Lajme")
      }`,
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
  if (!article?.title) {
    return {
      title: 'Artikull | Radio Fontana',
      robots: { index: false, follow: false },
    };
  }

  const articleUrl = `${SITE_URL}/lajme/${slug}`;
  const ogImage = article.imageUrl || `${SITE_URL}/logortvfontana.jpg`;

  return {
    title: article.title,
    description: article.excerpt,
    keywords: ['lajme kosovë', article.category, 'radio fontana', 'lajme shqip'],
    alternates: {
      canonical: articleUrl,
      languages: { 'sq-AL': articleUrl },
    },
    openGraph: {
      type: 'article',
      url: articleUrl,
      title: article.title,
      description: article.excerpt,
      images: [{ url: ogImage, width: 1200, height: 630, alt: article.title }],
      locale: 'sq_AL',
      siteName: 'Radio Fontana',
      publishedTime: article.publishedAt,
      modifiedTime: article._updatedAt ?? article.publishedAt,
      authors: [article.author],
      section: article.category,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [ogImage],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const [initialArticle, metaArticle] = await Promise.all([
    fetchArticleBySlug(slug),
    fetchMetadataArticle(slug),
  ]);

  const articleUrl = `${SITE_URL}/lajme/${slug}`;
  const ogImage = metaArticle?.imageUrl || `${SITE_URL}/logortvfontana.jpg`;

  const newsArticleSchema = metaArticle?.title
    ? {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        '@id': articleUrl,
        headline: metaArticle.title,
        description: metaArticle.excerpt,
        url: articleUrl,
        image: [
          {
            '@type': 'ImageObject',
            url: ogImage,
            width: 1200,
            height: 630,
          },
        ],
        datePublished: metaArticle.publishedAt,
        dateModified: metaArticle._updatedAt ?? metaArticle.publishedAt,
        author: {
          '@type': 'Person',
          name: metaArticle.author,
        },
        publisher: {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
          name: 'Radio Fontana',
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/logortvfontana.jpg`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': articleUrl,
        },
        articleSection: metaArticle.category,
        inLanguage: 'sq-AL',
        isPartOf: { '@id': `${SITE_URL}/#website` },
      }
    : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Kryefaqja', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Lajme', item: `${SITE_URL}/lajme` },
      { '@type': 'ListItem', position: 3, name: metaArticle?.title ?? 'Artikull', item: articleUrl },
    ],
  };

  return (
    <>
      {newsArticleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ArticleClient slug={slug} initialArticle={initialArticle} />
    </>
  );
}
