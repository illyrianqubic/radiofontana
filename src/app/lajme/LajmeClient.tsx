'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Article, Category, CATEGORIES, CATEGORY_COLORS } from '@/lib/types';
import NewsCard from '@/components/news/NewsCard';
import NewsFilter from '@/components/news/NewsFilter';

const ARTICLES_PER_PAGE = 12;

let articlesCache: Article[] | null = null;
let articlesRequest: Promise<Article[]> | null = null;

function parseFiltersFromSearch(search: string): { category: Category | null; query: string } {
  const sp = new URLSearchParams(search);
  const rawCategory = sp.get('kategoria');
  const category = CATEGORIES.includes(rawCategory as Category) ? (rawCategory as Category) : null;
  const query = sp.get('q') ?? '';
  return { category, query };
}

async function loadArticles(): Promise<Article[]> {
  if (articlesCache) {
    return articlesCache;
  }
  if (articlesRequest) {
    return articlesRequest;
  }

  articlesRequest = fetch('/api/articles?limit=100')
    .then((r) => r.json())
    .then((data: unknown) => {
      if (Array.isArray(data)) {
        articlesCache = data as Article[];
        return articlesCache;
      }
      return [];
    })
    .catch(() => [])
    .finally(() => {
      articlesRequest = null;
    });

  return articlesRequest;
}

export default function LajmeClient() {
  const [allArticles, setAllArticles] = useState<Article[]>(articlesCache ?? []);
  const [loadingArticles, setLoadingArticles] = useState(!articlesCache);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [activeQuery, setActiveQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(ARTICLES_PER_PAGE);

  const syncUrl = useCallback((category: Category | null, query: string) => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams();
    if (category) sp.set('kategoria', category);
    const normalizedQuery = query.trim();
    if (normalizedQuery) sp.set('q', normalizedQuery);
    const nextUrl = `/lajme/${sp.toString() ? `?${sp.toString()}` : ''}`;
    window.history.replaceState({}, '', nextUrl);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const applyFromLocation = () => {
      const { category, query } = parseFiltersFromSearch(window.location.search);
      setActiveCategory(category);
      setActiveQuery(query);
    };

    applyFromLocation();
    window.addEventListener('popstate', applyFromLocation);
    return () => window.removeEventListener('popstate', applyFromLocation);
  }, []);

  useEffect(() => {
    let cancelled = false;

    loadArticles().then((data) => {
      if (cancelled) return;
      setAllArticles(data);
      setLoadingArticles(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCategoryChange = useCallback((category: Category | null) => {
    setActiveCategory(category);
    setVisibleCount(ARTICLES_PER_PAGE);
    syncUrl(category, activeQuery);
  }, [activeQuery, syncUrl]);

  const handleSearchApply = useCallback((query: string) => {
    const normalizedQuery = query.trim();
    setActiveQuery(normalizedQuery);
    setVisibleCount(ARTICLES_PER_PAGE);
    syncUrl(activeCategory, normalizedQuery);
  }, [activeCategory, syncUrl]);

  const handleClear = useCallback(() => {
    setActiveCategory(null);
    setActiveQuery('');
    setVisibleCount(ARTICLES_PER_PAGE);
    syncUrl(null, '');
  }, [syncUrl]);

  const filtered = useMemo(() => {
    let result = allArticles;

    if (activeCategory) {
      result = result.filter((a) => a.category === activeCategory);
    }

    if (activeQuery) {
      const query = activeQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.excerpt.toLowerCase().includes(query) ||
          a.tags.some((t) => t.toLowerCase().includes(query)),
      );
    }

    return result;
  }, [allArticles, activeCategory, activeQuery]);

  const title = activeCategory
    ? activeCategory
    : activeQuery
    ? `Rezultate për "${activeQuery}"`
    : 'Lajmet e Fundit nga Radio Fontana';

  return (
    <div className="bg-white min-h-screen page-shell">
      <div className="border-b border-slate-100 bg-slate-50/50">
        <div className="site-container py-8 md:py-12 lg:py-14 2xl:py-16">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mb-4">
            <Link href="/" className="hover:text-red-600 transition-colors">Kryefaqja</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-medium">Lajme</span>
            {activeCategory && (
              <>
                <span className="text-slate-300">/</span>
                <span className="text-slate-700 font-medium">{activeCategory}</span>
              </>
            )}
          </div>
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="w-1 h-8 bg-red-600 rounded-full" />
            <h1 className="ipad-page-title text-[2rem] md:text-[2.2rem] lg:text-[2.6rem] 2xl:text-[2.9rem] 3xl:text-[3.2rem] font-extrabold text-slate-900 break-words leading-tight">
              {title}
            </h1>
          </div>
          {activeCategory && (
            <div className="mt-3">
              <span
                className={`category-badge inline-block max-w-full truncate px-3 py-1.5 rounded-lg text-white ${CATEGORY_COLORS[activeCategory] ?? 'bg-slate-500'}`}
              >
                {filtered.length} artikuj
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="site-container py-7 md:py-9 lg:py-10 2xl:py-12">
        <NewsFilter
          activeCategory={activeCategory}
          activeQuery={activeQuery}
          loading={loadingArticles}
          onCategoryChange={handleCategoryChange}
          onSearchApply={handleSearchApply}
          onClear={handleClear}
        />
      </div>

      {/* Results */}
      <div className="site-container pb-12 md:pb-14 lg:pb-16 2xl:pb-20">
        {loadingArticles && allArticles.length === 0 ? (
          <div className="news-grid-responsive gap-6 lg:gap-7 2xl:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-slate-100 p-4 md:p-5 animate-pulse">
                <div className="aspect-video rounded-xl bg-slate-100 mb-4" />
                <div className="h-4 bg-slate-100 rounded w-2/3 mb-2" />
                <div className="h-4 bg-slate-100 rounded w-full mb-2" />
                <div className="h-4 bg-slate-100 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 md:py-24 lg:py-28">
            <h3 className="text-xl md:text-2xl 2xl:text-[1.9rem] 3xl:text-[2rem] font-bold text-slate-800 mb-2">
              Nuk u gjetën rezultate
            </h3>
            <p className="text-slate-600 text-base md:text-lg">
              Provo me fjalë kyçe të ndryshme ose zgjidh një kategori tjetër.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm md:text-base text-slate-600 mb-6 font-medium uppercase tracking-wider">
              {filtered.length} artikuj gjithsej
            </p>
            <div className="news-grid-responsive gap-6 lg:gap-7 2xl:gap-8">
              {filtered.slice(0, visibleCount).map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
            {visibleCount < filtered.length && (
              <div className="mt-10 md:mt-12 flex flex-col items-center gap-2">
                <button
                  onClick={() => setVisibleCount((c) => c + ARTICLES_PER_PAGE)}
                  className="inline-flex items-center gap-2.5 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3.5 rounded-xl text-base transition-colors shadow-md"
                >
                  Shfaq Më Shumë
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <p className="text-sm text-slate-500">
                  {Math.min(visibleCount, filtered.length)} / {filtered.length} artikuj
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
