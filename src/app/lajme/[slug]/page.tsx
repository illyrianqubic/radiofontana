import { Metadata } from 'next';
import ArticleClient from './ArticleClient';
import { ARTICLE_SLUGS_QUERY } from '@/sanity/queries';

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
const SANITY_API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01';

interface Props {
  params: Promise<{ slug: string }>;
}

async function fetchSanity<T>(
  query: string,
  params: Record<string, string> = {},
  options: { useCdn?: boolean } = {},
): Promise<T | null> {
  if (!SANITY_PROJECT_ID) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID for Sanity fetch');
  }

  const useCdn = options.useCdn ?? true;
  const host = useCdn ? 'apicdn.sanity.io' : 'api.sanity.io';

  try {
    const paramStr = Object.entries(params)
      .map(([k, v]) => `&%24${k}=${encodeURIComponent(JSON.stringify(v))}`)
      .join('');
    const url =
      `https://${SANITY_PROJECT_ID}.${host}/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}` +
      `?query=${encodeURIComponent(query)}${paramStr}`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      cache: useCdn ? 'force-cache' : 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Sanity request failed with ${res.status}`);
    }

    const data = (await res.json()) as { result?: T };
    return data.result ?? null;
  } catch (error) {
    console.error('[lajme/[slug]] Sanity fetch failed:', error);
    throw error;
  }
}

export async function generateStaticParams() {
  const results = (await fetchSanity<Array<{ slug: string | null }>>(
    ARTICLE_SLUGS_QUERY,
    {},
    { useCdn: false },
  )) ?? [];

  return results
    .map((p) => p.slug)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchSanity<{
    title: string;
    excerpt: string;
    imageUrl: string;
  }>(
    `*[_type == "post" && slug.current == $slug][0]{ title, excerpt, "imageUrl": coalesce(mainImage.asset->url, "") }`,
    { slug },
  );
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
  return <ArticleClient slug={slug} />;
}
