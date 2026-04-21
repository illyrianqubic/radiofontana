import Link from 'next/link';
import { Article } from '@/lib/types';
import { Zap } from 'lucide-react';

interface Props {
  articles: Article[];
}

export default function BreakingNewsTicker({ articles }: Props) {
  const breaking = articles.filter((a) => a.breaking);
  // Fall back to latest 5 articles when no explicitly-breaking ones exist
  const source = breaking.length > 0 ? breaking : articles.slice(0, 5);
  const items = source.filter((article, index, arr) => {
    const key = article.id || article.slug;
    return arr.findIndex((candidate) => (candidate.id || candidate.slug) === key) === index;
  });

  if (items.length === 0) return null;

  return (
    <div className="bg-red-600 text-white overflow-hidden shadow-sm">
      <div className="flex items-stretch h-9">
        {/* Label */}
        <div className="flex-shrink-0 bg-red-800 px-3 sm:px-4 flex items-center gap-1.5 z-10 shadow-[2px_0_8px_rgba(0,0,0,0.2)]">
          <Zap className="w-3 h-3 text-yellow-300 flex-shrink-0" fill="currentColor" />
          <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.18em] whitespace-nowrap">
            Breaking
          </span>
        </div>

        {/* Ticker */}
        <div className="relative flex-1 overflow-hidden flex items-center">
          <div className="ticker-track ticker-animate" style={{ willChange: 'transform' }}>
            {[0, 1].map((group) => (
              <div key={group} className="flex shrink-0 whitespace-nowrap">
                {items.map((article) => (
                  <Link
                    key={`${group}-${article.id || article.slug}`}
                    href={`/lajme/${article.slug}`}
                    className="inline-flex items-center gap-3 text-[12px] text-white/90 hover:text-white transition-colors duration-200 px-8"
                  >
                    <span className="text-red-300 font-bold text-xs">◆</span>
                    <span className="font-medium">{article.title}</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


