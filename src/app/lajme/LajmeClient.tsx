'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Article, Category, CATEGORIES, CATEGORY_COLORS } from '@/lib/types';
import NewsCard from '@/components/news/NewsCard';
import NewsFilter from '@/components/news/NewsFilter';

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

  const syncUrl = useCallback((category: Category | null, query: string) => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams();
    if (category) sp.set('kategoria', category);
    const normalizedQuery = query.trim();
    if (normalizedQuery) sp.set('q', normalizedQuery);
    const nextUrl = `/lajme${sp.toString() ? `?${sp.toString()}` : ''}`;
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
    setLoadingArticles(!articlesCache);

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
    syncUrl(category, activeQuery);
  }, [activeQuery, syncUrl]);

  const handleSearchApply = useCallback((query: string) => {
    const normalizedQuery = query.trim();
    setActiveQuery(normalizedQuery);
    syncUrl(activeCategory, normalizedQuery);
  }, [activeCategory, syncUrl]);

  const handleClear = useCallback(() => {
    setActiveCategory(null);
    setActiveQuery('');
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
    : 'Të gjitha lajmet';

  return (
    <div className="bg-white min-h-screen">
      <div className="border-b border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
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
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-red-600 rounded-full" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {title}
            </h1>
          </div>
          {activeCategory && (
            <div className="mt-3">
              <span
                className={`category-badge inline-block px-3 py-1.5 rounded-lg text-white ${CATEGORY_COLORS[activeCategory] ?? 'bg-slate-500'}`}
              >
                {filtered.length} artikuj
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14">
        {loadingArticles && allArticles.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-100 p-4 animate-pulse">
                <div className="h-40 rounded-xl bg-slate-100 mb-4" />
                <div className="h-3 bg-slate-100 rounded w-2/3 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-full mb-2" />
                <div className="h-3 bg-slate-100 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-5">🔍</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Nuk u gjetën rezultate
            </h3>
            <p className="text-slate-400">
              Provo me fjalë kyçe të ndryshme ose zgjidh një kategori tjetër.
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-400 mb-5 font-medium uppercase tracking-wider">
              {filtered.length} artikuj gjithsej
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
