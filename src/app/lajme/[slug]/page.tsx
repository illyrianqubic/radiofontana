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

export async function generateStaticParams() {
  const results = await fetchArticleSlugs();

  const slugs = results
    .map((p) => p.slug)
    .filter((slug): slug is string => Boolean(slug));

  // Always include the '_' fallback shell so newly-published Sanity articles
  // resolve via the client-side fetch in ArticleClient until the next build.
  // Without this, fresh slugs return 404 even though the article exists.
  return ['_', ...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // Reuse the same React-cached call as the page itself — Sanity is hit only once
  // per slug per render (audit P2-H5).
  const article = await fetchArticleBySlug(slug);
  if (!article?.title) {
    return {
      title: 'Artikull | Radio Fontana',
      robots: { index: false, follow: false },
    };
  }

  // Use trailing slash to match the actual canonical URL (next.config
  // trailingSlash: true) so WhatsApp doesn't follow a 308 redirect when
  // it crawls og:url.
  const articleUrl = `${SITE_URL}/lajme/${slug}/`;

  // Serve the OG image through our own domain at a clean .jpg URL.
  // WhatsApp's scraper sniffs the URL extension; Sanity asset URLs end in
  // `.webp`/`.png` (the original asset extension is immutable), which
  // breaks WhatsApp previews even though `?fm=jpg` returns JPEG bytes.
  // /og/<slug>.jpg is handled by functions/og/[slug].jpg.ts which proxies
  // the resized Sanity JPEG.
  const ogImage = article.imageUrl
    ? `${SITE_URL}/og/${slug}.jpg`
    : `${SITE_URL}/logortvfontana.jpg`;

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
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.title,
          type: 'image/jpeg',
        },
      ],
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
  const initialArticle = await fetchArticleBySlug(slug);

  const articleUrl = `${SITE_URL}/lajme/${slug}`;
  const ogImage = initialArticle?.imageUrl || `${SITE_URL}/logortvfontana.jpg`;

  const newsArticleSchema = initialArticle?.title
    ? {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        '@id': articleUrl,
        headline: initialArticle.title,
        description: initialArticle.excerpt,
        url: articleUrl,
        image: [
          {
            '@type': 'ImageObject',
            url: ogImage,
            width: 1200,
            height: 630,
          },
        ],
        datePublished: initialArticle.publishedAt,
        dateModified: initialArticle._updatedAt ?? initialArticle.publishedAt,
        author: {
          '@type': 'Person',
          name: initialArticle.author,
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
        articleSection: initialArticle.category,
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
      { '@type': 'ListItem', position: 3, name: initialArticle?.title ?? 'Artikull', item: articleUrl },
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
