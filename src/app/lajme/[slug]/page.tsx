import { Metadata } from 'next';
import ArticleClient from './ArticleClient';

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
const SANITY_API_VERSION = '2024-01-01';

interface Props {
  params: Promise<{ slug: string }>;
}

async function fetchSanity<T>(query: string, params: Record<string, string> = {}): Promise<T | null> {
  if (!SANITY_PROJECT_ID) return null;
  try {
    const paramStr = Object.entries(params)
      .map(([k, v]) => `&%24${k}=${encodeURIComponent(JSON.stringify(v))}`)
      .join('');
    const url =
      `https://${SANITY_PROJECT_ID}.apicdn.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}` +
      `?query=${encodeURIComponent(query)}${paramStr}`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const data = (await res.json()) as { result: T };
    return data.result ?? null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  const results = await fetchSanity<Array<{ slug: string }>>(
    `*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`,
  );
  const slugs = (results ?? []).map((p) => ({ slug: p.slug }));
  // Next.js static export requires at least one path. If Sanity isn't configured
  // yet, return a placeholder (it will render a 404 via ArticleClient).
  return slugs.length > 0 ? slugs : [{ slug: '_' }];
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
