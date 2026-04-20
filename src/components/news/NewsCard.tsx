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
      <Link href={`/lajme/${article.slug}`} className="group block relative overflow-hidden rounded-xl news-card h-full">
        <div className="relative h-[420px] sm:h-[480px]">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
            <span className={`category-badge inline-block px-2.5 py-1 rounded-sm text-white mb-3 w-fit ${categoryColor}`}>
              {article.category}
            </span>
            <h2 className="text-white text-2xl sm:text-3xl font-bold leading-tight mb-3 group-hover:text-blue-200 transition-colors">
              {article.title}
            </h2>
            <p className="text-gray-300 text-sm line-clamp-2 mb-4">{article.excerpt}</p>
            <div className="flex items-center gap-4 text-gray-400 text-xs">
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
      <Link href={`/lajme/${article.slug}`} className="group flex gap-3 items-start p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
        <div className="relative w-20 h-16 flex-shrink-0 rounded-md overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className={`category-badge inline-block px-1.5 py-0.5 rounded-sm text-white mb-1 ${categoryColor}`}>
            {article.category}
          </span>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-[#1a3a6b] dark:group-hover:text-blue-400 transition-colors">
            {article.title}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo(article.publishedAt)}
          </p>
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Link href={`/lajme/${article.slug}`} className="group flex gap-4 items-start news-card p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
        <div className="relative w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className={`category-badge inline-block px-2 py-0.5 rounded-sm text-white mb-2 ${categoryColor}`}>
            {article.category}
          </span>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2 group-hover:text-[#1a3a6b] dark:group-hover:text-blue-400 transition-colors mb-2">
            {article.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
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
    <Link href={`/lajme/${article.slug}`} className="group block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 news-card h-full">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className={`category-badge px-2.5 py-1 rounded-sm text-white ${categoryColor}`}>
            {article.category}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug mb-2 line-clamp-2 group-hover:text-[#1a3a6b] dark:group-hover:text-blue-400 transition-colors">
          {article.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
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
