import { Metadata } from 'next';
import { Suspense } from 'react';
import articlesData from '@/data/articles.json';
import { Article, Category, CATEGORY_COLORS } from '@/lib/types';
import NewsCard from '@/components/news/NewsCard';
import NewsFilter from '@/components/news/NewsFilter';

export const metadata: Metadata = {
  title: 'Lajme',
  description: 'Lajmet e fundit nga Peja, Kosova dhe bota. Sport, Teknologji, Showbiz dhe më shumë.',
};

const allArticles = articlesData as Article[];

interface Props {
  searchParams: Promise<{ kategoria?: string; q?: string }>;
}

export default async function LajmePage({ searchParams }: Props) {
  const { kategoria, q } = await searchParams;

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
        a.tags.some((t) => t.toLowerCase().includes(query))
    );
  }

  const title = kategoria
    ? kategoria
    : q
    ? `Rezultate për "${q}"`
    : 'Të gjitha lajmet';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-10">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
          <span>Kryefaqja</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Lajme</span>
          {kategoria && (
            <>
              <span className="text-slate-300">/</span>
              <span className="text-slate-700 font-medium">{kategoria}</span>
            </>
          )}
        </div>
        <h1 className="text-3xl font-bold text-slate-800 section-title">
          {title}
        </h1>
        {kategoria && (
          <div className="mt-3">
            <span className={`category-badge inline-block px-3 py-1.5 rounded-lg text-white ${CATEGORY_COLORS[kategoria as Category] ?? 'bg-slate-500'}`}>
              {filtered.length} artikuj
            </span>
          </div>
        )}
      </div>

      {/* Filter */}
      <div className="mb-10">
        <Suspense fallback={<div className="h-20 bg-slate-100 rounded-xl animate-pulse" />}>
          <NewsFilter />
        </Suspense>
      </div>

      {/* Results */}
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
          <p className="text-sm text-slate-400 mb-5">
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
  );
}
