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
    <div className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_45%,#ffffff_100%)] page-shell">
      <BreakingNewsTicker articles={articles} />

      {/* ── HERO ── */}
      <section className="bg-white border-b border-slate-200/70">
        <div className="site-container py-7 sm:py-10 2xl:py-12 3xl:py-14">
          <div className="grid grid-cols-1 xl:grid-cols-12 3xl:grid-cols-15 gap-6 2xl:gap-8 3xl:gap-10">

            {/* Main hero */}
            <div className="xl:col-span-8 3xl:col-span-10">
              {hero && <NewsCard article={hero} variant="hero" />}
            </div>

            {/* Right column: weather + featured list */}
            <div className="xl:col-span-4 3xl:col-span-5 flex flex-col gap-4 2xl:gap-5">
              <WeatherWidget />

              {/* Featured side cards */}
              <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-[0_14px_36px_rgba(15,23,42,0.10)] flex-1">
                <div className="px-4 py-3.5 border-b border-slate-200/70 bg-slate-50/70">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <Flame className="w-3.5 h-3.5 text-red-500" />
                    <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.16em]">Highlights</p>
                  </div>
                  <h3 className="section-title-bar text-sm font-bold text-slate-900">Lajme të Spikatura</h3>
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
      <section className="bg-white py-10 sm:py-12 2xl:py-14 border-b border-slate-200/70">
        <div className="site-container">
          <div className="grid grid-cols-1 xl:grid-cols-12 3xl:grid-cols-15 gap-9 2xl:gap-12">

            {/* Latest grid */}
            <div className="xl:col-span-9 3xl:col-span-11">
              <div className="flex items-end justify-between gap-4 mb-7">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400 mb-2">Redaksia</p>
                  <h2 className="section-title-bar text-xl sm:text-2xl 2xl:text-[1.85rem] 3xl:text-[2.05rem] font-extrabold text-slate-900 tracking-tight">
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
              <div className="news-grid-responsive gap-5 sm:gap-6 2xl:gap-7">
                {latest.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            </div>

            {/* Most Read sidebar */}
            <aside className="xl:col-span-3 3xl:col-span-4">
              <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-[0_16px_36px_rgba(15,23,42,0.12)] sticky top-24">
                <div className="flex items-center gap-2.5 px-4 py-3.5 bg-slate-900 text-white">
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
                      className="flex gap-3.5 p-4 hover:bg-slate-50 transition-colors duration-200 group"
                    >
                      <span className="text-2xl font-black text-slate-200 w-8 flex-shrink-0 leading-none mt-0.5 tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[0.84rem] font-semibold text-slate-800 line-clamp-2 group-hover:text-red-600 transition-colors leading-snug tracking-[0.01em]">
                          {article.title}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
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
      <section className="bg-slate-50/70 py-10 sm:py-12 2xl:py-14 border-b border-slate-200/70">
        <div className="site-container">
          <div className="grid grid-cols-1 xl:grid-cols-12 3xl:grid-cols-15 gap-9 2xl:gap-12">

            {/* Live feed */}
            <div className="xl:col-span-8 3xl:col-span-10">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="flex items-center gap-1.5 bg-red-600 text-white text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  LIVE
                </div>
                <h2 className="section-title-bar text-xl 2xl:text-[1.85rem] 3xl:text-[2.05rem] font-extrabold text-slate-900 tracking-tight">Të Fundit</h2>
              </div>

              <div className="space-y-3.5 2xl:space-y-4">
                {teJundit.map((article) => (
                  <Link
                    key={article.id}
                    href={`/lajme/${article.slug}`}
                    className="group flex flex-col sm:flex-row gap-3 sm:gap-4 bg-white rounded-2xl p-3.5 border border-slate-200/80 hover:border-red-200 hover:shadow-[0_14px_30px_rgba(220,38,38,0.12)] transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <div className="relative w-full h-44 sm:w-32 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={optimizeImageUrl(article.imageUrl, 256, 192, 72)}
                        alt={article.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 128px"
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
                      <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-red-600 transition-colors tracking-[0.01em]">
                        {article.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Radio promo */}
            <aside className="xl:col-span-4 3xl:col-span-5">
              <div className="bg-slate-900 rounded-2xl p-6 text-white sticky top-24 overflow-hidden relative shadow-[0_18px_38px_rgba(2,6,23,0.35)]">
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 to-transparent" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center mb-4">
                    <Radio className="w-6 h-6 text-red-400" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-400 mb-1">
                    Dëgjo Tani
                  </p>
                  <h3 className="text-xl font-extrabold mb-1">Radio Fontana</h3>
                  <p className="text-slate-400 text-sm mb-5">98.8 FM · Istog, Kosovë</p>
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
      <section className="bg-white py-10 sm:py-12 2xl:py-14 border-b border-slate-200/70">
        <div className="site-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 2xl:gap-16 3xl:gap-20">

            {/* Sport */}
            <div>
              <div className="flex items-end justify-between gap-4 mb-5">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400 mb-2">Kategoria</p>
                  <h2 className="section-title-bar text-xl 2xl:text-2xl 3xl:text-[1.7rem] font-extrabold text-slate-900">Sport</h2>
                </div>
                <Link href="/lajme/?kategoria=Sport" className="touch-target inline-flex items-center text-xs text-red-600 font-bold uppercase tracking-wider hover:underline">
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
              <div className="flex items-end justify-between gap-4 mb-5">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400 mb-2">Kategoria</p>
                  <h2 className="section-title-bar text-xl 2xl:text-2xl 3xl:text-[1.7rem] font-extrabold text-slate-900">Teknologji</h2>
                </div>
                <Link href="/lajme/?kategoria=Teknologji" className="touch-target inline-flex items-center text-xs text-red-600 font-bold uppercase tracking-wider hover:underline">
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
      <section className="bg-slate-50/70 py-10 sm:py-12 border-b border-slate-200/70">
        <div className="site-container">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Rss className="w-4 h-4 text-red-600" />
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Navigim</p>
            </div>
            <h2 className="section-title-bar text-lg 2xl:text-xl 3xl:text-2xl font-extrabold text-slate-900 tracking-wide">
              Shfletoni Kategoritë
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 gap-2.5 sm:gap-3.5 2xl:gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/lajme/?kategoria=${encodeURIComponent(cat)}`}
                className={`${CATEGORY_COLORS[cat]} text-white rounded-xl sm:rounded-2xl p-3 sm:p-4 min-h-11 text-center transition-all duration-200 hover:-translate-y-1 hover:brightness-105 shadow-[0_8px_16px_rgba(15,23,42,0.12)] hover:shadow-[0_14px_26px_rgba(15,23,42,0.22)] inline-flex items-center justify-center`}
              >
                <span className="font-bold text-sm">{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRENDING ── */}
      <section className="bg-white py-10 sm:py-12 2xl:py-14">
        <div className="site-container">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-red-600" />
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Në trend</p>
            </div>
            <h2 className="section-title-bar text-xl 2xl:text-[1.85rem] 3xl:text-[2.05rem] font-extrabold text-slate-900">Trending</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-1.5 2xl:gap-2">
            {articles.slice(0, 6).map((article, i) => (
              <Link
                key={article.id}
                href={`/lajme/${article.slug}`}
                className="flex items-start gap-4 p-4 rounded-2xl border border-slate-200/70 hover:bg-slate-50 transition-all duration-200 group hover:shadow-[0_12px_26px_rgba(15,23,42,0.10)]"
              >
                <span className="text-4xl font-black text-slate-200 w-10 flex-shrink-0 leading-none mt-1 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <span className={`category-badge inline-block px-2 py-1 rounded text-white mb-2 ${CATEGORY_COLORS[article.category]}`}>
                    {article.category}
                  </span>
                  <p className="text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-red-600 transition-colors duration-200 leading-snug tracking-[0.01em]">
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
