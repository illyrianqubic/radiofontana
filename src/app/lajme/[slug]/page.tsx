import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const runtime = 'edge';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, User, Tag, ArrowLeft, Share2 } from 'lucide-react';
import { FacebookIcon, TwitterIcon } from '@/components/shared/SocialIcons';
import articlesData from '@/data/articles.json';
import { Article, CATEGORY_COLORS } from '@/lib/types';
import NewsCard from '@/components/news/NewsCard';
import { formatAlbanianDate, timeAgo } from '@/lib/utils';

const allArticles = articlesData as Article[];

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = allArticles.find((a) => a.slug === slug);
  if (!article) return { title: 'Artikull nuk u gjet' };
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
  const article = allArticles.find((a) => a.slug === slug);

  if (!article) notFound();

  const related = allArticles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 4);

  const catColor = CATEGORY_COLORS[article.category];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main content */}
        <article className="lg:col-span-2">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
            <Link href="/" className="hover:text-[#1a3a6b] dark:hover:text-blue-400 transition-colors">Kryefaqja</Link>
            <span>›</span>
            <Link href="/lajme" className="hover:text-[#1a3a6b] dark:hover:text-blue-400 transition-colors">Lajme</Link>
            <span>›</span>
            <Link
              href={`/lajme?kategoria=${encodeURIComponent(article.category)}`}
              className="hover:text-[#1a3a6b] dark:hover:text-blue-400 transition-colors"
            >
              {article.category}
            </Link>
          </div>

          {/* Category */}
          <span className={`category-badge inline-block px-3 py-1.5 rounded-sm text-white mb-4 ${catColor}`}>
            {article.category}
          </span>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6 border-l-4 border-[#1a3a6b] pl-4 italic">
            {article.excerpt}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 pb-6 border-b border-gray-200 dark:border-gray-700">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span className="font-medium text-gray-700 dark:text-gray-200">{article.author}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <time dateTime={article.publishedAt}>{formatAlbanianDate(article.publishedAt)}</time>
            </span>
            <span className="text-gray-400">·</span>
            <span>{timeAgo(article.publishedAt)}</span>
          </div>

          {/* Hero image */}
          <div className="relative aspect-video rounded-xl overflow-hidden my-6">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2 items-center">
              <Tag className="w-4 h-4 text-gray-400" />
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/lajme?q=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-[#1a3a6b] dark:hover:text-blue-400 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Share */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Shpërnda këtë artikull
            </p>
            <div className="flex gap-3">
              <a
                href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://radiofontana.com/lajme/${article.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <FacebookIcon className="w-4 h-4" />
                Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`https://radiofontana.com/lajme/${article.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-600 transition-colors"
              >
                <TwitterIcon className="w-4 h-4" />
                Twitter
              </a>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-6">
          <Link
            href="/lajme"
            className="flex items-center gap-2 text-sm text-[#1a3a6b] dark:text-blue-400 font-semibold hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Kthehu tek Lajmet
          </Link>

          {/* Related */}
          {related.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-[#1a3a6b] text-white">
                <h3 className="font-bold text-sm uppercase tracking-wider">Artikuj të Ngjashëm</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {related.map((a) => (
                  <div key={a.id} className="p-2">
                    <NewsCard article={a} variant="compact" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All recent */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider">Lajmet e Fundit</h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {allArticles
                .filter((a) => a.id !== article.id)
                .slice(0, 5)
                .map((a) => (
                  <div key={a.id} className="p-2">
                    <NewsCard article={a} variant="compact" />
                  </div>
                ))}
            </div>
          </div>
        </aside>
      </div>

      {/* More articles */}
      {related.length > 0 && (
        <section className="mt-14 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white section-title mb-6">
            Lexo Gjithashtu
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((a) => (
              <NewsCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
