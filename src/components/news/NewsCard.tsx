import Link from 'next/link';
import Image from 'next/image';
import { Article, CATEGORY_COLORS } from '@/lib/types';
import { readTime } from '@/lib/utils';
import { Clock, User, BookOpen } from 'lucide-react';
import TimeAgo from '@/components/shared/TimeAgo';

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
      <Link href={href} className="group flex flex-col h-full relative min-w-0 overflow-hidden rounded-xl border border-slate-200/70 news-card isolate">
        <div className="relative flex-1 min-h-[210px] md:min-h-[300px] lg:min-h-[360px]">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 66vw, (max-width: 1366px) 70vw, 68vw"
            className="object-cover img-zoom"
            priority
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/90 via-black/52 to-black/18" />
          {/* Top labels */}
          <div className="absolute z-20 top-3 md:top-4 left-3 md:left-4 flex items-center gap-1.5 md:gap-2 flex-wrap pr-3 max-w-[calc(100%-1.5rem)] md:max-w-[calc(100%-2rem)]">
            <span className={`category-badge max-w-[9.75rem] md:max-w-[10.5rem] lg:max-w-[12rem] truncate px-2.5 py-1.5 rounded-md text-white ${categoryColor}`}>
              {article.category}
            </span>
            {article.breaking && (
              <span className="category-badge max-w-[9.75rem] md:max-w-[10.5rem] lg:max-w-[12rem] truncate px-2.5 py-1.5 rounded-md bg-red-600 text-white">
                Lajm i Fundit
              </span>
            )}
          </div>
          <div className="absolute z-10 inset-0 flex flex-col justify-end p-4 md:p-5 lg:p-7 pt-20 md:pt-24 overflow-hidden">
            <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.14em] text-red-300 mb-2 relative z-10">
              Lajm kryesor
            </p>
            <h2 className="text-white text-[1.1rem] tiny:text-[1.2rem] md:text-[1.45rem] lg:text-[2rem] xl:text-[2.3rem] 2xl:text-[2.6rem] 3xl:text-[3rem] font-extrabold leading-[1.16] mb-2 md:mb-3 group-hover:text-red-200 transition-colors duration-300 break-words line-clamp-2 lg:line-clamp-3 relative z-10 max-w-[92%] md:max-w-[88%]">
              {article.title}
            </h2>
            <p className="hidden lg:block text-white/80 text-sm lg:text-base line-clamp-2 mb-4 md:mb-5 max-w-2xl leading-relaxed relative z-10">{article.excerpt}</p>
            <div className="flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4 text-white/80 text-xs md:text-sm relative z-10">
              <span className="inline-flex min-w-0 max-w-full items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span className="truncate">{article.author}</span>
              </span>
              <span className="inline-flex min-w-0 max-w-full items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <TimeAgo dateString={article.publishedAt} className="truncate" />
              </span>
              <span className="hidden lg:inline-flex min-w-0 max-w-full items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span className="truncate">{minutes} min lexim</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={href} className="group flex gap-3 items-start p-3 md:p-4 hover:bg-slate-50 transition-all duration-200">
        <div className="relative w-24 h-[3.75rem] md:w-28 md:h-[4.15rem] flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            sizes="(max-width: 767px) 96px, 112px"
            className="object-cover img-zoom"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className={`category-badge inline-block max-w-full truncate px-1.5 py-0.5 rounded text-white mb-1.5 ${categoryColor}`}>
            {article.category}
          </span>
          <h4 className="text-[0.95rem] md:text-[1.05rem] font-semibold text-slate-800 leading-[1.35] line-clamp-2 group-hover:text-red-600 transition-colors duration-200 tracking-[0.01em] break-words">
            {article.title}
          </h4>
          <p className="text-xs md:text-sm text-slate-600 mt-1.5 flex items-center gap-1 min-w-0">
            <Clock className="w-2.5 h-2.5" />
            <TimeAgo dateString={article.publishedAt} className="truncate" />
            <span className="text-slate-300">•</span>
            <span className="truncate">{article.author}</span>
          </p>
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Link href={href} className="group flex flex-col sm:flex-row gap-3 sm:gap-4 items-start p-3.5 md:p-4 rounded-xl border border-slate-200/70 bg-white hover:bg-slate-50 transition-all duration-200 hover:shadow-[0_12px_30px_rgba(15,23,42,0.10)] hover:-translate-y-0.5">
        <div className="relative w-full aspect-video sm:w-40 sm:aspect-video sm:h-auto flex-shrink-0 rounded-xl overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 160px, 192px"
            className="object-cover img-zoom"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className={`category-badge inline-block max-w-full truncate px-2 py-0.5 rounded text-white mb-1.5 ${categoryColor}`}>
            {article.category}
          </span>
          <h3 className="font-bold text-[1rem] md:text-[1.1rem] text-slate-800 leading-[1.35] line-clamp-2 group-hover:text-red-600 transition-colors duration-200 mb-2 tracking-[0.01em] break-words">
            {article.title}
          </h3>
          <div className="flex items-center gap-2 sm:gap-2.5 text-xs md:text-sm text-slate-600 flex-wrap min-w-0">
            <span className="inline-flex min-w-0 max-w-full items-center gap-1">
              <User className="w-2.5 h-2.5" />
              <span className="truncate">{article.author}</span>
            </span>
            <span className="inline-flex min-w-0 max-w-full items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              <TimeAgo dateString={article.publishedAt} className="truncate" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link href={href} className="group flex flex-col min-w-0 bg-white rounded-xl overflow-hidden border border-slate-200/70 news-card card-accent h-full">
      <div className="relative aspect-video overflow-hidden flex-shrink-0">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, (max-width: 1366px) 33vw, 25vw"
          className="object-cover img-zoom"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 inset-x-3 z-10 flex items-start justify-between gap-2">
          <span className={`category-badge inline-block ${article.breaking ? 'max-w-[58%]' : 'max-w-full'} truncate px-2.5 py-1 rounded-lg text-white ${categoryColor}`}>
            {article.category}
          </span>
          {article.breaking && (
            <span className="category-badge inline-block max-w-[42%] truncate px-2 py-1 rounded-lg bg-red-600 text-white">Lajm i Fundit</span>
          )}
        </div>
      </div>
      <div className="p-3.5 md:p-4 lg:p-5 flex flex-col flex-1">
        <h3 className="font-bold text-slate-900 text-[1rem] md:text-[1.08rem] lg:text-[1.15rem] leading-[1.32] mb-2 line-clamp-2 group-hover:text-red-600 transition-colors duration-200 tracking-[0.01em] break-words">
          {article.title}
        </h3>
        <p className="text-slate-600 text-[0.88rem] md:text-[0.92rem] lg:text-[0.9rem] line-clamp-2 mb-3.5 leading-relaxed break-words">
          {article.excerpt}
        </p>
        <div className="mt-auto flex w-full flex-wrap sm:flex-nowrap items-center gap-x-2.5 gap-y-1.5 text-xs md:text-sm text-slate-600 pt-3 border-t border-slate-100">
          <span className="inline-flex min-w-0 max-w-full items-center gap-1">
            <User className="w-2.5 h-2.5" />
            <span className="truncate">{article.author}</span>
          </span>
          <div className="flex min-w-0 items-center gap-2 sm:gap-2.5 sm:ml-auto">
            <span className="inline-flex min-w-0 max-w-full items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              <TimeAgo dateString={article.publishedAt} className="truncate" />
            </span>
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <BookOpen className="w-2.5 h-2.5" />
              {minutes}m
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
