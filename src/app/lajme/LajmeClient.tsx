'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Article, Category, CATEGORY_COLORS } from '@/lib/types';
import articlesData from '@/data/articles.json';
import NewsCard from '@/components/news/NewsCard';
import NewsFilter from '@/components/news/NewsFilter';

const staticArticles = articlesData as Article[];

export default function LajmeClient() {
  const searchParams = useSearchParams();
  const kategoria = searchParams.get('kategoria') as Category | null;
  const q = searchParams.get('q') ?? '';

  const [allArticles, setAllArticles] = useState<Article[]>(staticArticles);

  useEffect(() => {
    fetch('/api/articles?limit=100')
      .then((r) => r.json())
      .then((data: Article[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllArticles([...data, ...staticArticles]);
        }
      })
      .catch(() => {});
  }, []);

  let filtered = allArticles;

  if (kategoria) {
    filtered = filtered.filter((a) => a.category === kategoria);
  }

  if (q) {
    const query = q.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.excerpt.toLowerCase().includes(query) ||
        a.tags.some((t) => t.toLowerCase().includes(query)),
    );
  }

  const title = kategoria
    ? kategoria
    : q
    ? `Rezultate për "${q}"`
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
            {kategoria && (
              <>
                <span className="text-slate-300">/</span>
                <span className="text-slate-700 font-medium">{kategoria}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-red-600 rounded-full" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {title}
            </h1>
          </div>
          {kategoria && (
            <div className="mt-3">
              <span
                className={`category-badge inline-block px-3 py-1.5 rounded-lg text-white ${
                  CATEGORY_COLORS[kategoria as Category] ?? 'bg-slate-500'
                }`}
              >
                {filtered.length} artikuj
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <NewsFilter />
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14">
        {filtered.length === 0 ? (
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
