import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, TrendingUp, Clock, Flame, Radio, Rss } from 'lucide-react';
import { Article, CATEGORIES, CATEGORY_COLORS } from '@/lib/types';
import NewsCard from '@/components/news/NewsCard';
import BreakingNewsTicker from '@/components/layout/BreakingNewsTicker';
import TimeAgo from '@/components/shared/TimeAgo';
import WeatherWidget from '@/components/home/WeatherWidget';

interface HomeClientProps {
  articles: Article[];
}

export default function HomeClient({ articles }: HomeClientProps) {

  const featured = articles.filter((a) => a.featured);
  const hero = featured[0] ?? articles[0];
  const sideFeatures = featured.length > 1 ? featured.slice(1, 4) : articles.slice(1, 4);
  const latest = articles.slice(0, 8);
  const mostRead = articles.slice(0, 5);
  const teJundit = articles.slice(0, 6);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_45%,#ffffff_100%)] page-shell">
      <h1 className="sr-only">Radio Fontana 98.8 FM - Radio Shqip Live nga Istog, Kosovë</h1>
      <BreakingNewsTicker articles={articles} />

      {/* ── HERO ── */}
      <section className="bg-white border-b border-slate-200/70">
          <div className="site-container py-4 md:py-10 lg:py-14 2xl:py-14 3xl:py-16">
          <div className="grid grid-cols-1 md:grid-cols-10 3xl:grid-cols-15 gap-4 md:gap-8 2xl:gap-10">

            {/* Main hero */}
            <div className="md:col-span-7 3xl:col-span-10">
              {hero && <NewsCard article={hero} variant="hero" />}
            </div>

            {/* Right column: featured list (weather widget removed — was mock data) */}
            <div className="md:col-span-3 3xl:col-span-5 flex flex-col gap-4 md:gap-5">
              {/* Featured side cards */}
              <div className="hidden md:block bg-white rounded-xl border border-slate-200/70 overflow-hidden shadow-[0_14px_36px_rgba(15,23,42,0.10)] flex-1">
                <div className="px-4 py-3.5 border-b border-slate-200/70 bg-slate-50/70">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <Flame className="w-3.5 h-3.5 text-red-500" />
                    <p className="text-xs md:text-sm font-extrabold text-slate-500 uppercase tracking-[0.16em]">Highlights</p>
                  </div>
                  <h3 className="section-title-bar text-base md:text-lg font-bold text-slate-900">Lajme të Spikatura</h3>
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
      <section className="bg-white py-7 md:py-12 lg:py-14 2xl:py-16 border-b border-slate-200/70">
        <div className="site-container">
          <div className="grid grid-cols-1 md:grid-cols-10 3xl:grid-cols-15 gap-8 md:gap-10 2xl:gap-12">

            {/* Latest grid */}
            <div className="md:col-span-7 3xl:col-span-11">
              <div className="flex flex-wrap items-end justify-between gap-3 sm:gap-4 mb-7">
                <div>
                  <p className="text-xs md:text-sm font-extrabold uppercase tracking-[0.16em] text-slate-400 mb-2">Redaksia</p>
                  <h2 className="section-title-bar ipad-section-title text-[1.45rem] md:text-[1.65rem] lg:text-[1.78rem] 2xl:text-[1.95rem] 3xl:text-[2.05rem] font-extrabold text-slate-900 tracking-tight">
                    Lajmet e Fundit
                  </h2>
                </div>
                <Link
                  href="/lajme"
                  className="touch-target inline-flex items-center gap-1.5 text-sm text-red-600 font-semibold hover:text-red-700 transition-colors group"
                >
                  Të gjitha
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
              <div className="news-grid-responsive gap-6 lg:gap-7 2xl:gap-8">
                {latest.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            </div>

            {/* Most Read sidebar */}
            <aside className="hidden md:block md:col-span-3 3xl:col-span-4 space-y-5">
              <WeatherWidget />
              <div className="bg-white rounded-xl border border-slate-200/70 overflow-hidden shadow-[0_16px_36px_rgba(15,23,42,0.12)] sticky top-24">
                <div className="flex items-center gap-2.5 px-4 py-3.5 bg-slate-900 text-white">
                  <TrendingUp className="w-3.5 h-3.5 text-red-400" />
                  <h3 className="font-extrabold text-xs md:text-sm uppercase tracking-[0.14em]">
                    Më të Lexuarat
                  </h3>
                </div>
                <div className="divide-y divide-slate-50">
                  {mostRead.map((article, i) => (
                    <Link
                      key={article.id}
                      href={`/lajme/${article.slug}`}
                      className="flex gap-3.5 p-4 hover:bg-slate-50 transition-colors duration-200 group"
                    >
                      <span className="text-2xl font-black text-slate-200 w-8 flex-shrink-0 leading-none mt-0.5 tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm md:text-base font-semibold text-slate-800 line-clamp-2 group-hover:text-red-600 transition-colors leading-snug tracking-[0.01em]">
                          {article.title}
                        </p>
                        <p className="text-xs md:text-sm text-slate-500 mt-2 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          <TimeAgo dateString={article.publishedAt} />
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

      {/* ── TË FUNDIT - Live feed ── */}
      <section className="cv-auto bg-slate-50/70 py-7 md:py-12 lg:py-14 2xl:py-16 border-b border-slate-200/70">
        <div className="site-container">
          <div className="grid grid-cols-1 md:grid-cols-10 3xl:grid-cols-15 gap-8 md:gap-10 2xl:gap-12">

            {/* Live feed */}
            <div className="md:col-span-7 3xl:col-span-10">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="flex items-center gap-1.5 bg-red-600 text-white text-xs font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  LIVE
                </div>
                <h2 className="section-title-bar ipad-section-title text-[1.45rem] md:text-[1.65rem] lg:text-[1.78rem] 2xl:text-[1.95rem] 3xl:text-[2.05rem] font-extrabold text-slate-900 tracking-tight">Të Fundit</h2>
              </div>

              <div className="space-y-3.5 2xl:space-y-4">
                {teJundit.map((article) => (
                  <Link
                    key={article.id}
                    href={`/lajme/${article.slug}`}
                    className="group flex flex-col sm:flex-row gap-3 sm:gap-4 bg-white rounded-xl p-4 md:p-5 border border-slate-200/80 hover:border-red-200 hover:shadow-[0_14px_30px_rgba(220,38,38,0.12)] transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <div className="relative w-full aspect-video sm:w-40 sm:aspect-video sm:h-auto flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 160px, 192px"
                        className="object-cover img-zoom"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5 min-w-0">
                        <span className={`category-badge inline-block max-w-full truncate px-2 py-1 rounded text-white ${CATEGORY_COLORS[article.category]}`}>
                          {article.category}
                        </span>
                        <span className="text-xs md:text-sm text-slate-600 flex items-center gap-1 min-w-0">
                          <Clock className="w-2.5 h-2.5" />
                          <TimeAgo dateString={article.publishedAt} className="truncate" />
                        </span>
                      </div>
                      <h3 className="font-bold text-[1.02rem] md:text-[1.15rem] text-slate-800 leading-[1.35] line-clamp-2 group-hover:text-red-600 transition-colors tracking-[0.01em] break-words">
                        {article.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Radio promo */}
            <aside className="hidden md:block md:col-span-3 3xl:col-span-5">
              <div className="bg-slate-900 rounded-xl p-6 text-white sticky top-24 overflow-hidden relative shadow-[0_18px_38px_rgba(2,6,23,0.35)]">
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 to-transparent" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center mb-4">
                    <Radio className="w-6 h-6 text-red-400" />
                  </div>
                  <p className="text-xs md:text-sm font-black uppercase tracking-[0.18em] text-red-400 mb-1">
                    Dëgjo Tani
                  </p>
                  <h3 className="text-xl md:text-2xl font-extrabold mb-1">Radio Fontana</h3>
                  <p className="text-slate-300 text-sm md:text-base mb-5">98.8 FM · Istog, Kosovë</p>
                  <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-6">
                    Muzikë, lajme dhe emisionet e preferuara, 24 orë në ditë.
                  </p>
                  <Link
                    href="/live"
                    className="touch-target flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors duration-200 text-sm md:text-base min-h-11"
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

      {/* ── CATEGORY BROWSE ── */}
      <section className="cv-auto bg-slate-50/70 py-7 md:py-12 lg:py-14 border-b border-slate-200/70">
        <div className="site-container">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Rss className="w-4 h-4 text-red-600" />
              <p className="text-xs md:text-sm font-extrabold uppercase tracking-[0.16em] text-slate-400">Navigim</p>
            </div>
            <h2 className="section-title-bar ipad-section-title text-[1.35rem] md:text-[1.6rem] lg:text-[1.75rem] 2xl:text-xl 3xl:text-2xl font-extrabold text-slate-900 tracking-wide">
              Shfletoni Kategoritë
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 gap-3.5 md:gap-4 lg:gap-5 2xl:gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/lajme/?kategoria=${encodeURIComponent(cat)}`}
                className={`${CATEGORY_COLORS[cat]} text-white rounded-xl p-3 md:p-4 lg:p-5 min-h-11 text-center transition-all duration-200 hover:-translate-y-1 hover:brightness-105 shadow-[0_8px_16px_rgba(15,23,42,0.12)] hover:shadow-[0_14px_26px_rgba(15,23,42,0.22)] inline-flex items-center justify-center`}
              >
                <span className="font-bold text-sm md:text-base leading-tight break-words line-clamp-2">{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
