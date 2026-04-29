'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, usePathname } from 'next/navigation';
import { Clock, User, Tag, ArrowLeft, Share2, Copy, Check } from 'lucide-react';
import { FacebookIcon, WhatsAppIcon } from '@/components/shared/SocialIcons';
import { Article, CATEGORY_COLORS } from '@/lib/types';
import NewsCard from '@/components/news/NewsCard';
import SanityPortableText from '@/components/sanity/PortableText';
import TimeAgo from '@/components/shared/TimeAgo';
import { formatAlbanianDate } from '@/lib/utils';

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
  const [copied, setCopied] = useState(false);

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
      const hasInitial = Boolean(initialArticle && initialArticle.slug === resolvedSlug);

      if (hasInitial && initialArticle) {
        // Use the SSG-rendered article and skip the redundant /api/article fetch.
        // This avoids a duplicate Sanity round-trip on every page view.
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
        <div className="site-container py-20">
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
      <div className="site-container py-8 md:py-12 lg:py-14 2xl:py-16">
        <div className="grid grid-cols-1 md:grid-cols-10 3xl:grid-cols-14 gap-8 md:gap-10 lg:gap-12 2xl:gap-14">
          {/* Main content */}
          <article className="md:col-span-7 3xl:col-span-10">
            <div className="mx-auto w-full max-w-[820px]">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mb-5">
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
            <span className={`category-badge inline-block max-w-full truncate px-3 py-1.5 rounded-lg text-white mb-5 ${catColor}`}>
              {article.category}
            </span>

            {/* Title */}
            <h1 className="ipad-page-title text-[2rem] md:text-[2.2rem] lg:text-[2.6rem] 2xl:text-[2.95rem] 3xl:text-[3.2rem] font-extrabold text-slate-900 leading-tight mb-4 md:mb-5 break-words">
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="text-base md:text-[1.1rem] lg:text-[1.12rem] 2xl:text-[1.2rem] text-slate-600 leading-relaxed mb-7 border-l-4 border-red-600 pl-4 md:pl-5 italic break-words ipad-body">
              {article.excerpt}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm md:text-base text-slate-600 pb-7 border-b border-slate-100">
              <span className="inline-flex min-w-0 max-w-full items-center gap-1.5">
                <User className="w-4 h-4" />
                <span className="font-medium text-slate-700 truncate">{article.author}</span>
              </span>
              <span className="inline-flex min-w-0 max-w-full items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <time dateTime={article.publishedAt} className="truncate">{formatAlbanianDate(article.publishedAt)}</time>
              </span>
              <span className="text-slate-300">/</span>
              <TimeAgo dateString={article.publishedAt} />
            </div>

            {/* Hero image */}
            <div className="relative aspect-video overflow-hidden my-7 mx-0 rounded-2xl">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1023px) 100vw, (max-width: 1366px) 72vw, 820px"
                className="object-cover"
                priority
              />
            </div>

            {/* Article content */}
            {Array.isArray(article.content) ? (
              <div className="prose prose-slate prose-base md:prose-lg max-w-none break-words md:prose-p:text-[1.125rem] md:prose-p:leading-[1.72] md:prose-li:text-[1.08rem] md:prose-li:leading-[1.7] md:prose-headings:leading-tight">
                <SanityPortableText value={article.content} />
              </div>
            ) : typeof article.content === 'string' && article.content ? (
              <div
                className="prose prose-slate prose-base md:prose-lg max-w-none break-words prose-headings:text-slate-800 prose-p:text-slate-700 prose-p:leading-[1.72] md:prose-p:text-[1.125rem] md:prose-li:text-[1.08rem]"
                dangerouslySetInnerHTML={{ __html: article.content as string }}
              />
            ) : (
              <p className="text-slate-500">Përmbajtja e artikullit nuk është e disponueshme.</p>
            )}

            {/* Tags */}
            {(article.tags ?? []).filter(Boolean).length > 0 && (
              <div className="mt-10 pt-7 border-t border-slate-100">
                <div className="flex flex-wrap gap-2 items-center">
                  <Tag className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  {(article.tags ?? []).filter(Boolean).map((tag) => (
                    <Link
                      key={tag}
                      href={`/lajme/?q=${encodeURIComponent(tag)}`}
                      className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-sm md:text-base hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="mt-7 pt-7 border-t border-slate-100">
              <p className="text-base md:text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Shpërndaje këtë artikull
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://radiofontana.org/lajme/${article.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target inline-flex items-center gap-2 px-4 py-2.5 bg-[#1877F2] text-white rounded-xl text-sm md:text-base font-medium hover:bg-[#166FE5] transition-colors duration-200"
                >
                  <FacebookIcon className="w-4 h-4" />
                  Facebook
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${article.title} https://radiofontana.org/lajme/${article.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366] text-white rounded-xl text-sm md:text-base font-medium hover:bg-[#1ebe5d] transition-colors duration-200"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => {
                    // Always copy the canonical public URL — never window.location.href
                    // (which could carry query strings, hash, or — on certain wrapped
                    // contexts — an internal scheme). Title is intentionally NOT
                    // included; only the clean URL goes to the clipboard.
                    const url = `https://radiofontana.org/lajme/${article.slug}`;
                    const doSet = () => { setCopied(true); setTimeout(() => setCopied(false), 2500); };
                    const fallback = () => {
                      try {
                        const ta = document.createElement('textarea');
                        ta.value = url;
                        ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
                        document.body.appendChild(ta);
                        ta.focus();
                        ta.select();
                        document.execCommand('copy');
                        document.body.removeChild(ta);
                        doSet();
                      } catch {}
                    };
                    if (navigator.clipboard?.writeText) {
                      navigator.clipboard.writeText(url).then(doSet).catch(fallback);
                    } else {
                      fallback();
                    }
                  }}
                  className="touch-target inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm md:text-base font-medium hover:bg-slate-200 transition-colors duration-200"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Linku u kopjua!' : 'Kopjo linkun'}
                </button>
              </div>
            </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="md:col-span-3 3xl:col-span-4 space-y-7">
            <Link
              href="/lajme"
              className="touch-target inline-flex items-center gap-2 text-base text-red-600 font-semibold hover:gap-3 transition-all duration-200 break-words"
            >
              <ArrowLeft className="w-4 h-4" />
              Kthehu tek Lajmet
            </Link>

            {/* Related */}
            {related.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                <div className="px-5 py-3.5 bg-red-600 text-white">
                  <h3 className="font-extrabold text-xs md:text-sm uppercase tracking-[0.14em]">Artikuj të Ngjashëm</h3>
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
            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-extrabold text-xs md:text-sm text-slate-700 uppercase tracking-[0.14em]">Lajmet e Fundit</h3>
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
              <h2 className="ipad-section-title text-[1.5rem] md:text-[1.7rem] lg:text-[1.85rem] 2xl:text-[1.95rem] 3xl:text-[2.1rem] font-extrabold text-slate-900">
                Lexo Gjithashtu
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 2xl:gap-7">
              {related.map((a) => (
                <NewsCard key={a.id} article={a} />
              ))}
            </div>
          </section>
        )}
      </div>
      {/* Copy toast */}
      {copied && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[10040] px-5 py-3 bg-slate-900 text-white text-sm font-semibold rounded-2xl shadow-2xl pointer-events-none whitespace-nowrap">
          ✓ Linku u kopjua!
        </div>
      )}
    </div>
  );
}
