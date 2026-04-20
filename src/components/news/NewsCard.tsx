import Link from 'next/link';
import Image from 'next/image';
import { Article, CATEGORY_COLORS } from '@/lib/types';
import { timeAgo } from '@/lib/utils';
import { Clock, User } from 'lucide-react';

interface Props {
  article: Article;
  variant?: 'default' | 'hero' | 'compact' | 'horizontal';
}

export default function NewsCard({ article, variant = 'default' }: Props) {
  const categoryColor = CATEGORY_COLORS[article.category];

  if (variant === 'hero') {
    return (
      <Link href={`/lajme/${article.slug}`} className="group block relative overflow-hidden rounded-2xl news-card h-full">
        <div className="relative h-[420px] sm:h-[500px]">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover img-zoom"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-7 sm:p-9">
            <span className={`category-badge inline-block px-2.5 py-1.5 rounded-md text-white mb-3 w-fit ${categoryColor}`}>
              {article.category}
            </span>
            <h2 className="text-white text-2xl sm:text-3xl lg:text-[2rem] font-bold leading-[1.2] mb-3 group-hover:text-red-300 transition-colors duration-300">
              {article.title}
            </h2>
            <p className="text-white/70 text-sm line-clamp-2 mb-5 max-w-2xl leading-relaxed">{article.excerpt}</p>
            <div className="flex items-center gap-4 text-white/50 text-xs">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                {article.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {timeAgo(article.publishedAt)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/lajme/${article.slug}`} className="group flex gap-3.5 items-start p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200">
        <div className="relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={article.imageUrl}
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
          <h4 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 group-hover:text-[#e63946] transition-colors duration-200">
            {article.title}
          </h4>
          <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo(article.publishedAt)}
          </p>
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Link href={`/lajme/${article.slug}`} className="group flex gap-4 items-start p-3.5 rounded-2xl hover:bg-slate-50 transition-colors duration-200">
        <div className="relative w-32 h-24 flex-shrink-0 rounded-xl overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            sizes="128px"
            className="object-cover img-zoom"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className={`category-badge inline-block px-2 py-0.5 rounded text-white mb-2 ${categoryColor}`}>
            {article.category}
          </span>
          <h3 className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-[#e63946] transition-colors duration-200 mb-2.5">
            {article.title}
          </h3>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {article.author}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeAgo(article.publishedAt)}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link href={`/lajme/${article.slug}`} className="group block bg-white rounded-2xl overflow-hidden border border-slate-100 news-card h-full">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover img-zoom"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 left-3">
          <span className={`category-badge px-2.5 py-1 rounded-md text-white ${categoryColor}`}>
            {article.category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-slate-800 text-[0.95rem] leading-snug mb-2.5 line-clamp-2 group-hover:text-[#e63946] transition-colors duration-200">
          {article.title}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-4 border-t border-slate-100">
          <span className="flex items-center gap-1.5">
            <User className="w-3 h-3" />
            {article.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            {timeAgo(article.publishedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
