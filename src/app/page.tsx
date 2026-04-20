import { Metadata } from 'next';
import Link from 'next/link';

export const runtime = 'edge';
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            {hero && <NewsCard article={hero} variant="hero" />}
          </div>
          <div className="flex flex-col gap-4">
            <WeatherWidget />
            <div className="space-y-0 bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider">
                  Lajme të Spikatura
                </h3>
              </div>
              {sideFeatures.map((article, i) => (
                <div
                  key={article.id}
                  className={i < sideFeatures.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}
                >
                  <NewsCard article={article} variant="compact" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-blue-200 dark:via-gray-600 to-transparent" />
      </div>

      {/* Latest news */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white section-title">
            Lajmet e Fundit
          </h2>
          <Link
            href="/lajme"
            className="flex items-center gap-1.5 text-sm text-[#1a3a6b] dark:text-blue-400 font-semibold hover:gap-2.5 transition-all"
          >
            Të gjitha lajmet <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {latest.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Category sections */}
      <section className="bg-gray-50 dark:bg-gray-900 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white section-title">Sport</h2>
                <Link href="/lajme?kategoria=Sport" className="text-xs text-[#1a3a6b] dark:text-blue-400 font-semibold uppercase tracking-wider hover:underline">
                  Shiko të gjitha
                </Link>
              </div>
              <div className="space-y-3">
                {sports.map((article) => (
                  <NewsCard key={article.id} article={article} variant="horizontal" />
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white section-title">Teknologji</h2>
                <Link href="/lajme?kategoria=Teknologji" className="text-xs text-[#1a3a6b] dark:text-blue-400 font-semibold uppercase tracking-wider hover:underline">
                  Shiko të gjitha
                </Link>
              </div>
              <div className="space-y-3">
                {tech.map((article) => (
                  <NewsCard key={article.id} article={article} variant="horizontal" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category browse */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white section-title mb-6">
          Shfletoni Kategoritë
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/lajme?kategoria=${encodeURIComponent(cat)}`}
              className={`${CATEGORY_COLORS[cat]} text-white rounded-xl p-4 text-center hover:opacity-90 transition-all hover:-translate-y-0.5 shadow-sm hover:shadow-md`}
            >
              <span className="font-bold text-sm">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-5 h-5 text-[#1a3a6b] dark:text-blue-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white section-title">Trending</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.slice(0, 6).map((article, i) => (
            <Link
              key={article.id}
              href={`/lajme/${article.slug}`}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors group"
            >
              <span className="text-3xl font-black text-gray-200 dark:text-gray-700 w-10 flex-shrink-0 text-center">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <span className={`category-badge inline-block px-1.5 py-0.5 rounded-sm text-white mb-1 ${CATEGORY_COLORS[article.category]}`}>
                  {article.category}
                </span>
                <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#1a3a6b] dark:group-hover:text-blue-400 transition-colors">
                  {article.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
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
