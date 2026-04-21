import { Metadata } from 'next';
import articlesData from '@/data/articles.json';
import { Article } from '@/lib/types';
import ArticleClient from './ArticleClient';

const staticArticles = articlesData as Article[];

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return staticArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = staticArticles.find((a) => a.slug === slug);
  if (!article) return { title: 'Artikull | Radio Fontana' };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.imageUrl],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  return <ArticleClient slug={slug} />;
}
