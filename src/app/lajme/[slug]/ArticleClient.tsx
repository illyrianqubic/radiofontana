'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, usePathname } from 'next/navigation';
import { Clock, User, Tag, ArrowLeft, Share2 } from 'lucide-react';
import { FacebookIcon, TwitterIcon } from '@/components/shared/SocialIcons';
import { Article, CATEGORY_COLORS } from '@/lib/types';
import NewsCard from '@/components/news/NewsCard';
import SanityPortableText from '@/components/sanity/PortableText';
import { formatAlbanianDate, timeAgo, optimizeImageUrl } from '@/lib/utils';

interface Props {
  slug: string;
  initialArticle?: Article | null;
}

export default function ArticleClient({ slug, initialArticle = null }: Props) {
  const pathname = usePathname();
  const resolvedSlug = (() => {
    if (slug !== '_') {
      return slug;
    }

    const fromPath = pathname?.split('/').filter(Boolean).at(-1) ?? slug;

    try {
      return decodeURIComponent(fromPath);
    } catch {
      return fromPath;
    }
  })();

  const [article, setArticle] = useState<Article | null>(initialArticle);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(!initialArticle);

  useEffect(() => {
    let cancelled = false;

    const fetchRelated = async (current: Article) => {
      try {
        const response = await fetch('/api/articles?limit=8');
        const all = (await response.json()) as Article[];

        if (cancelled) {
          return;
        }

        setRelated(
          (Array.isArray(all) ? all : [])
            .filter((a) => a.id !== current.id && a.category === current.category)
            .slice(0, 4),
        );
      } catch {
        if (!cancelled) {
          setRelated([]);
        }
      }
    };

    const loadArticle = async () => {
      if (initialArticle && initialArticle.slug === resolvedSlug) {
        setArticle(initialArticle);
        setLoading(false);
        await fetchRelated(initialArticle);
        return;
      }

      setArticle(null);
      setLoading(true);

      try {
        const response = await fetch(`/api/article?slug=${encodeURIComponent(resolvedSlug)}`);
        const data = response.ok ? ((await response.json()) as Article) : null;

        if (cancelled) {
          return;
        }

        setArticle(data);

        if (data) {
          await fetchRelated(data);
        }
      } catch {
        if (!cancelled) {
          setArticle(null);
          setRelated([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadArticle();

    return () => {
      cancelled = true;
    };
  }, [resolvedSlug, initialArticle]);

  if (!loading && !article) {
    notFound();
  }

  if (!article) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-100 rounded w-1/4" />
            <div className="h-8 bg-slate-100 rounded w-3/4" />
            <div className="h-4 bg-slate-100 rounded w-1/2" />
            <div className="aspect-video bg-slate-100 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const catColor = CATEGORY_COLORS[article.category];

  return (
    <div className="bg-white page-shell">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
          {/* Main content */}
          <article className="lg:col-span-2">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-5">
              <Link href="/" className="hover:text-red-600 transition-colors duration-200">Kryefaqja</Link>
              <span className="text-slate-300">/</span>
              <Link href="/lajme" className="hover:text-red-600 transition-colors duration-200">Lajme</Link>
              <span className="text-slate-300">/</span>
              <Link
                href={`/lajme/?kategoria=${encodeURIComponent(article.category)}`}
                className="hover:text-red-600 transition-colors duration-200"
              >
                {article.category}
              </Link>
            </div>

            {/* Category */}
            <span className={`category-badge inline-block px-3 py-1.5 rounded-lg text-white mb-5 ${catColor}`}>
              {article.category}
            </span>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-extrabold text-slate-900 leading-tight mb-4 sm:mb-5">
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="text-base sm:text-lg text-slate-500 leading-relaxed mb-7 border-l-4 border-red-600 pl-5 italic">
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
                src={optimizeImageUrl(article.imageUrl, 1440, 810, 76)}
                alt={article.title}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Article content */}
            {Array.isArray(article.content) ? (
              <div className="prose prose-lg max-w-none break-words">
                <SanityPortableText value={article.content} />
              </div>
            ) : typeof article.content === 'string' && article.content ? (
              <div
                className="prose prose-lg max-w-none break-words prose-headings:text-slate-800 prose-p:text-slate-600 prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content as string }}
              />
            ) : (
              <p className="text-slate-500">Përmbajtja e artikullit nuk është e disponueshme.</p>
            )}

            {/* Tags */}
            <div className="mt-10 pt-7 border-t border-slate-100">
              <div className="flex flex-wrap gap-2 items-center">
                <Tag className="w-4 h-4 text-slate-400" />
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/lajme/?q=${encodeURIComponent(tag)}`}
                    className="px-3 py-1.5 bg-slate-100 text-slate-500 rounded-xl text-sm hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
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
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                <a
                  href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://radiofontana.org/lajme/${article.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target inline-flex items-center gap-2 px-4 py-2.5 bg-[#1877F2] text-white rounded-xl text-sm font-medium hover:bg-[#166FE5] transition-colors duration-200"
                >
                  <FacebookIcon className="w-4 h-4" />
                  Facebook
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`https://radiofontana.org/lajme/${article.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors duration-200"
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
              className="touch-target inline-flex items-center gap-2 text-sm text-red-600 font-semibold hover:gap-3 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Kthehu tek Lajmet
            </Link>

            {/* Related */}
            {related.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="px-5 py-3.5 bg-red-600 text-white">
                  <h3 className="font-extrabold text-[10px] uppercase tracking-[0.14em]">Artikuj të Ngjashëm</h3>
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
              <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-extrabold text-[10px] text-slate-700 uppercase tracking-[0.14em]">Lajmet e Fundit</h3>
              </div>
              <div className="divide-y divide-slate-50">
                {related
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
          <section className="mt-14 sm:mt-16 pt-8 sm:pt-10 border-t border-slate-100">
            <div className="flex items-center gap-2.5 mb-5 sm:mb-7">
              <div className="w-1 h-6 bg-red-600 rounded-full" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Lexo Gjithashtu
              </h2>
            </div>
            <div className="news-grid-responsive gap-5">
              {related.map((a) => (
                <NewsCard key={a.id} article={a} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
