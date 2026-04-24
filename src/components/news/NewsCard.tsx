import Link from 'next/link';
import Image from 'next/image';
import { Article, CATEGORY_COLORS } from '@/lib/types';
import { timeAgo, readTime, optimizeImageUrl } from '@/lib/utils';
import { Clock, User, BookOpen } from 'lucide-react';

interface Props {
  article: Article;
  variant?: 'default' | 'hero' | 'compact' | 'horizontal';
}

export default function NewsCard({ article, variant = 'default' }: Props) {
  const categoryColor = CATEGORY_COLORS[article.category];
  const minutes = article.readMinutes ?? (article.content ? readTime(article.content) : 1);
  const href = `/lajme/${article.slug}`;

  if (variant === 'hero') {
    return (
      <Link href={href} className="group block relative overflow-hidden rounded-3xl border border-slate-200/70 news-card h-full">
        <div className="relative h-[240px] xs:h-[280px] sm:h-[400px] lg:h-[480px] xl:h-[520px]">
          <Image
            src={optimizeImageUrl(article.imageUrl, 1280, 720, 74)}
            alt={article.title}
            fill
            sizes="(max-width: 1280px) 100vw, (max-width: 1920px) 68vw, 70vw"
            className="object-cover img-zoom"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10" />
          {/* Top labels */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex items-center gap-2 flex-wrap pr-3">
            <span className={`category-badge px-2.5 py-1.5 rounded-md text-white ${categoryColor}`}>
              {article.category}
            </span>
            {article.breaking && (
              <span className="category-badge px-2.5 py-1.5 rounded-md bg-red-600 text-white">
                Lajm i Fundit
              </span>
            )}
          </div>
          <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-7 lg:p-9">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-red-400 mb-2">
              Lajm kryesor
            </p>
            <h2 className="text-white text-lg sm:text-2xl lg:text-[1.85rem] xl:text-[2.1rem] 2xl:text-[2.3rem] 3xl:text-[2.55rem] font-extrabold leading-[1.18] mb-3 group-hover:text-red-200 transition-colors duration-300">
              {article.title}
            </h2>
            <p className="text-white/70 text-sm 2xl:text-base line-clamp-2 mb-5 max-w-2xl leading-relaxed">{article.excerpt}</p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-white/50 text-xs">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                {article.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {timeAgo(article.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                {minutes} min lexim
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={href} className="group flex gap-3.5 items-start p-3.5 sm:p-4 hover:bg-slate-50 transition-all duration-200">
        <div className="relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={optimizeImageUrl(article.imageUrl, 160, 128, 70)}
            alt={article.title}
            fill
            sizes="80px"
            className="object-cover img-zoom"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className={`category-badge inline-block px-1.5 py-0.5 rounded text-white mb-1.5 ${categoryColor}`}>
            {article.category}
          </span>
          <h4 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors duration-200 tracking-[0.01em]">
            {article.title}
          </h4>
          <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            {timeAgo(article.publishedAt)}
          </p>
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Link href={href} className="group flex flex-col sm:flex-row gap-3 sm:gap-4 items-start p-3.5 sm:p-4 rounded-2xl border border-slate-200/70 bg-white hover:bg-slate-50 transition-all duration-200 hover:shadow-[0_12px_30px_rgba(15,23,42,0.10)] hover:-translate-y-0.5">
        <div className="relative w-full h-44 sm:w-32 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden">
          <Image
            src={optimizeImageUrl(article.imageUrl, 256, 192, 72)}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, 128px"
            className="object-cover img-zoom"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className={`category-badge inline-block px-2 py-0.5 rounded text-white mb-1.5 ${categoryColor}`}>
            {article.category}
          </span>
          <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-red-600 transition-colors duration-200 mb-2 tracking-[0.01em]">
            {article.title}
          </h3>
          <div className="flex items-center gap-2.5 text-[10px] text-slate-400 flex-wrap">
            <span className="flex items-center gap-1">
              <User className="w-2.5 h-2.5" />
              {article.author}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {timeAgo(article.publishedAt)}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link href={href} className="group block bg-white rounded-2xl overflow-hidden border border-slate-200/70 news-card card-accent h-full">
      <div className="relative h-44 sm:h-48 2xl:h-56 3xl:h-60 overflow-hidden">
        <Image
          src={optimizeImageUrl(article.imageUrl, 480, 320, 72)}
          alt={article.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1920px) 33vw, 20vw"
          className="object-cover img-zoom"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 left-3">
          <span className={`category-badge px-2.5 py-1 rounded-lg text-white ${categoryColor}`}>
            {article.category}
          </span>
        </div>
        {article.breaking && (
          <div className="absolute top-3 right-3">
            <span className="category-badge px-2 py-1 rounded-lg bg-red-600 text-white">Lajm i Fundit</span>
          </div>
        )}
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="font-bold text-slate-900 text-[0.95rem] 2xl:text-[1.05rem] 3xl:text-[1.12rem] leading-snug mb-2 line-clamp-2 group-hover:text-red-600 transition-colors duration-200 tracking-[0.01em]">
          {article.title}
        </h3>
        <p className="text-slate-500 text-xs 2xl:text-sm line-clamp-2 mb-3.5 leading-relaxed">
          {article.excerpt}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 pt-3 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <User className="w-2.5 h-2.5" />
            {article.author}
          </span>
          <div className="flex items-center gap-2.5 sm:ml-auto">
            <span className="flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {timeAgo(article.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-2.5 h-2.5" />
              {minutes}m
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
