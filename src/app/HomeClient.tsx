import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, TrendingUp, Clock, Flame, Radio, Rss } from 'lucide-react';
import { Article, CATEGORIES, CATEGORY_COLORS } from '@/lib/types';
import NewsCard from '@/components/news/NewsCard';
import BreakingNewsTicker from '@/components/layout/BreakingNewsTicker';
import WeatherWidget from '@/components/home/WeatherWidget';
import NewsletterSection from '@/components/home/NewsletterSection';
import { timeAgo, readTime, optimizeImageUrl } from '@/lib/utils';

interface HomeClientProps {
  articles: Article[];
}

export default function HomeClient({ articles }: HomeClientProps) {

  const featured = articles.filter((a) => a.featured);
  const hero = featured[0] ?? articles[0];
  const sideFeatures = featured.length > 1 ? featured.slice(1, 4) : articles.slice(1, 4);
  const latest = articles.slice(0, 8);
  const sports = articles.filter((a) => a.category === 'Sport').slice(0, 4);
  const tech = articles.filter((a) => a.category === 'Teknologji').slice(0, 4);
  const mostRead = articles.slice(0, 5);
  const teJundit = articles.slice(0, 6);

  return (
    <div className="min-h-screen">
      <BreakingNewsTicker articles={articles} />

      {/* ── HERO ── */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

            {/* Main hero */}
            <div className="lg:col-span-7">
              {hero && <NewsCard article={hero} variant="hero" />}
            </div>

            {/* Right column: weather + featured list */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <WeatherWidget />

              {/* Featured side cards */}
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex-1">
                <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <Flame className="w-3.5 h-3.5 text-red-500" />
                  <h3 className="font-extrabold text-[10px] text-slate-700 uppercase tracking-[0.14em]">
                    Lajme të Spikatura
                  </h3>
                </div>
                <div className="divide-y divide-slate-50">
                  {sideFeatures.map((article) => (
                    <NewsCard key={article.id} article={article} variant="compact" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LATEST NEWS + MOST READ ── */}
      <section className="bg-white py-8 sm:py-10 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

            {/* Latest grid */}
            <div className="xl:col-span-9">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-1 h-6 bg-red-600 rounded-full" />
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Lajmet e Fundit
                  </h2>
                </div>
                <Link
                  href="/lajme"
                  className="flex items-center gap-1.5 text-sm text-red-600 font-semibold hover:text-red-700 transition-colors group"
                >
                  Të gjitha
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {latest.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            </div>

            {/* Most Read sidebar */}
            <aside className="xl:col-span-3">
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] sticky top-24">
                <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white">
                  <TrendingUp className="w-3.5 h-3.5 text-red-400" />
                  <h3 className="font-extrabold text-[10px] uppercase tracking-[0.14em]">
                    Më të Lexuarat
                  </h3>
                </div>
                <div className="divide-y divide-slate-50">
                  {mostRead.map((article, i) => (
                    <Link
                      key={article.id}
                      href={`/lajme/${article.slug}`}
                      className="flex gap-3 p-3.5 hover:bg-slate-50 transition-colors duration-200 group"
                    >
                      <span className="text-2xl font-black text-slate-100 w-8 flex-shrink-0 leading-none mt-0.5 tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[0.8rem] font-semibold text-slate-800 line-clamp-2 group-hover:text-red-600 transition-colors leading-snug">
                          {article.title}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {timeAgo(article.publishedAt)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── TË FUNDIT — Live feed ── */}
      <section className="bg-slate-50 py-8 sm:py-10 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Live feed */}
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="flex items-center gap-1.5 bg-red-600 text-white text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  LIVE
                </div>
                <div className="w-1 h-6 bg-red-600 rounded-full" />
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Të Fundit</h2>
              </div>

              <div className="space-y-3">
                {teJundit.map((article) => (
                  <Link
                    key={article.id}
                    href={`/lajme/${article.slug}`}
                    className="group flex gap-4 bg-white rounded-xl p-3.5 border border-slate-100 hover:border-red-200 hover:shadow-[0_4px_16px_rgba(220,38,38,0.08)] transition-all duration-200"
                  >
                    <div className="relative w-24 h-[72px] sm:w-32 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={optimizeImageUrl(article.imageUrl, 256, 192, 72)}
                        alt={article.title}
                        fill
                        sizes="128px"
                        className="object-cover img-zoom"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`category-badge px-2 py-1 rounded text-white ${CATEGORY_COLORS[article.category]}`}>
                          {article.category}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {timeAgo(article.publishedAt)}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                        {article.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Radio promo */}
            <aside className="lg:col-span-4">
              <div className="bg-slate-900 rounded-2xl p-6 text-white sticky top-24 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 to-transparent" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center mb-4">
                    <Radio className="w-6 h-6 text-red-400" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-400 mb-1">
                    Dëgjo Tani
                  </p>
                  <h3 className="text-xl font-extrabold mb-1">Radio Fontana</h3>
                  <p className="text-slate-400 text-sm mb-5">98.8 FM · Pejë, Kosovë</p>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    Muzikë, lajme dhe emisionet e preferuara — 24 orë në ditë.
                  </p>
                  <Link
                    href="/live"
                    className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors duration-200 text-sm"
                  >
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    Dëgjo Live
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── SPORT & TEKNOLOGJI ── */}
      <section className="bg-white py-8 sm:py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">

            {/* Sport */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-1 h-6 bg-green-600 rounded-full" />
                  <h2 className="text-xl font-extrabold text-slate-900">Sport</h2>
                </div>
                <Link href="/lajme/?kategoria=Sport" className="text-xs text-red-600 font-bold uppercase tracking-wider hover:underline">
                  Të gjitha
                </Link>
              </div>
              <div className="space-y-2">
                {sports.map((article) => (
                  <NewsCard key={article.id} article={article} variant="horizontal" />
                ))}
              </div>
            </div>

            {/* Teknologji */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-1 h-6 bg-purple-600 rounded-full" />
                  <h2 className="text-xl font-extrabold text-slate-900">Teknologji</h2>
                </div>
                <Link href="/lajme/?kategoria=Teknologji" className="text-xs text-red-600 font-bold uppercase tracking-wider hover:underline">
                  Të gjitha
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

      {/* ── CATEGORY BROWSE ── */}
      <section className="bg-slate-50 py-8 sm:py-10 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 mb-6">
            <Rss className="w-4 h-4 text-red-600" />
            <h2 className="text-lg font-extrabold text-slate-900 uppercase tracking-wide">
              Shfletoni Kategoritë
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/lajme/?kategoria=${encodeURIComponent(cat)}`}
                className={`${CATEGORY_COLORS[cat]} text-white rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center hover:opacity-85 transition-all duration-200 hover:-translate-y-1 shadow-sm hover:shadow-lg`}
              >
                <span className="font-bold text-sm">{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRENDING ── */}
      <section className="bg-white py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 mb-6">
            <TrendingUp className="w-4 h-4 text-red-600" />
            <div className="w-1 h-6 bg-red-600 rounded-full" />
            <h2 className="text-xl font-extrabold text-slate-900">Trending</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5">
            {articles.slice(0, 6).map((article, i) => (
              <Link
                key={article.id}
                href={`/lajme/${article.slug}`}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors duration-200 group"
              >
                <span className="text-4xl font-black text-slate-100 w-10 flex-shrink-0 leading-none mt-1 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <span className={`category-badge inline-block px-2 py-1 rounded text-white mb-2 ${CATEGORY_COLORS[article.category]}`}>
                    {article.category}
                  </span>
                  <p className="text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-red-600 transition-colors duration-200 leading-snug">
                    {article.title}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {timeAgo(article.publishedAt)}
                    <span className="mx-1 text-slate-300">·</span>
                    {article.readMinutes ?? (article.content ? readTime(article.content) : 1)} min lexim
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <NewsletterSection />
    </div>
  );
}
