import { Metadata } from 'next';
import { notFound } from 'next/navigation';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main content */}
        <article className="lg:col-span-2">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-5">
            <Link href="/" className="hover:text-[#e63946] transition-colors duration-200">Kryefaqja</Link>
            <span className="text-slate-300">/</span>
            <Link href="/lajme" className="hover:text-[#e63946] transition-colors duration-200">Lajme</Link>
            <span className="text-slate-300">/</span>
            <Link
              href={`/lajme?kategoria=${encodeURIComponent(article.category)}`}
              className="hover:text-[#e63946] transition-colors duration-200"
            >
              {article.category}
            </Link>
          </div>

          {/* Category */}
          <span className={`category-badge inline-block px-3 py-1.5 rounded-lg text-white mb-5 ${catColor}`}>
            {article.category}
          </span>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 leading-tight mb-5">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg text-slate-500 leading-relaxed mb-7 border-l-4 border-[#e63946] pl-5 italic">
            {article.excerpt}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 pb-7 border-b border-slate-100">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span className="font-medium text-slate-600">{article.author}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <time dateTime={article.publishedAt}>{formatAlbanianDate(article.publishedAt)}</time>
            </span>
            <span className="text-slate-300">/</span>
            <span>{timeAgo(article.publishedAt)}</span>
          </div>

          {/* Hero image */}
          <div className="relative aspect-video rounded-2xl overflow-hidden my-7">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Article content */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-slate-800 prose-p:text-slate-600 prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          <div className="mt-10 pt-7 border-t border-slate-100">
            <div className="flex flex-wrap gap-2 items-center">
              <Tag className="w-4 h-4 text-slate-400" />
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/lajme?q=${encodeURIComponent(tag)}`}
                  className="px-3 py-1.5 bg-slate-100 text-slate-500 rounded-xl text-sm hover:bg-[#e63946]/5 hover:text-[#e63946] transition-colors duration-200"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Share */}
          <div className="mt-7 pt-7 border-t border-slate-100">
            <p className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Shpërnda këtë artikull
            </p>
            <div className="flex gap-2.5">
              <a
                href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://radiofontana.org/lajme/${article.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-[#1877F2] text-white rounded-xl text-sm font-medium hover:bg-[#166FE5] transition-colors duration-200"
              >
                <FacebookIcon className="w-4 h-4" />
                Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`https://radiofontana.org/lajme/${article.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors duration-200"
              >
                <TwitterIcon className="w-4 h-4" />
                Twitter
              </a>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-7">
          <Link
            href="/lajme"
            className="flex items-center gap-2 text-sm text-[#e63946] font-semibold hover:gap-3 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Kthehu tek Lajmet
          </Link>

          {/* Related */}
          {related.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="px-5 py-3.5 bg-[#e63946] text-white">
                <h3 className="font-bold text-xs uppercase tracking-[0.1em]">Artikuj të Ngjashëm</h3>
              </div>
              <div className="divide-y divide-slate-50">
                {related.map((a) => (
                  <div key={a.id} className="p-2">
                    <NewsCard article={a} variant="compact" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All recent */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100">
              <h3 className="font-bold text-xs text-slate-800 uppercase tracking-[0.1em]">Lajmet e Fundit</h3>
            </div>
            <div className="divide-y divide-slate-50">
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
        <section className="mt-16 pt-10 border-t border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 section-title mb-7">
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
