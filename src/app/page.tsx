import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Clock } from 'lucide-react';
import articlesData from '@/data/articles.json';
import { Article, CATEGORIES, CATEGORY_COLORS } from '@/lib/types';
import NewsCard from '@/components/news/NewsCard';
import BreakingNewsTicker from '@/components/layout/BreakingNewsTicker';
import WeatherWidget from '@/components/home/WeatherWidget';
import NewsletterSection from '@/components/home/NewsletterSection';
import { timeAgo } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Radio Fontana - Lajmet e Fundit nga Peja dhe Kosova',
  description:
    'Lajmet e fundit, analizat dhe raportimet ekskluzive nga Radio Fontana, stacioni kryesor i informacionit në Pejë.',
};

const articles = articlesData as Article[];

export default function HomePage() {
  const featured = articles.filter((a) => a.featured);
  const hero = featured[0];
  const sideFeatures = featured.slice(1);
  const latest = articles.slice(0, 8);
  const sports = articles.filter((a) => a.category === 'Sport').slice(0, 3);
  const tech = articles.filter((a) => a.category === 'Teknologji').slice(0, 3);

  return (
    <div>
      <BreakingNewsTicker articles={articles} />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {hero && <NewsCard article={hero} variant="hero" />}
          </div>
          <div className="flex flex-col gap-5">
            <WeatherWidget />
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 flex-1">
              <div className="px-5 py-3.5 border-b border-slate-100">
                <h3 className="font-bold text-xs text-slate-800 uppercase tracking-[0.1em]">
                  Lajme të Spikatura
                </h3>
              </div>
              {sideFeatures.map((article, i) => (
                <div
                  key={article.id}
                  className={i < sideFeatures.length - 1 ? 'border-b border-slate-50' : ''}
                >
                  <NewsCard article={article} variant="compact" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest news */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-2xl font-bold text-slate-800 section-title">
            Lajmet e Fundit
          </h2>
          <Link
            href="/lajme"
            className="flex items-center gap-1.5 text-sm text-[#e63946] font-semibold hover:gap-2.5 transition-all duration-200"
          >
            Të gjitha <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {latest.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Category sections */}
      <section className="bg-slate-50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 section-title">Sport</h2>
                <Link href="/lajme?kategoria=Sport" className="text-xs text-[#e63946] font-bold uppercase tracking-wider hover:underline">
                  Shiko të gjitha
                </Link>
              </div>
              <div className="space-y-2">
                {sports.map((article) => (
                  <NewsCard key={article.id} article={article} variant="horizontal" />
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 section-title">Teknologji</h2>
                <Link href="/lajme?kategoria=Teknologji" className="text-xs text-[#e63946] font-bold uppercase tracking-wider hover:underline">
                  Shiko të gjitha
                </Link>
              </div>
              <div className="space-y-2">
                {tech.map((article) => (
                  <NewsCard key={article.id} article={article} variant="horizontal" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category browse */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 section-title mb-5 sm:mb-7">
          Shfletoni Kategoritë
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/lajme?kategoria=${encodeURIComponent(cat)}`}
              className={`${CATEGORY_COLORS[cat]} text-white rounded-2xl p-3 sm:p-5 text-center hover:opacity-90 transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-lg`}
            >
              <span className="font-bold text-sm">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-[#e63946]" />
          <h2 className="text-xl font-bold text-slate-800 section-title">Trending</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
          {articles.slice(0, 6).map((article, i) => (
            <Link
              key={article.id}
              href={`/lajme/${article.slug}`}
              className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors duration-200 group"
            >
              <span className="text-3xl font-black text-slate-100 w-10 flex-shrink-0 text-center tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <span className={`category-badge inline-block px-1.5 py-0.5 rounded text-white mb-1.5 ${CATEGORY_COLORS[article.category]}`}>
                  {article.category}
                </span>
                <p className="text-sm font-semibold text-slate-800 line-clamp-2 group-hover:text-[#e63946] transition-colors duration-200">
                  {article.title}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {timeAgo(article.publishedAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <NewsletterSection />
    </div>
  );
}
