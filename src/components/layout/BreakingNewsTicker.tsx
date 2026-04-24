import Link from 'next/link';
import { Article } from '@/lib/types';

interface Props {
  articles: Article[];
}

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

export default function BreakingNewsTicker({ articles }: Props) {
  const now = Date.now();

  // Only articles from the last 24 hours
  const recent = articles.filter((a) => {
    if (!a.publishedAt) return false;
    return now - new Date(a.publishedAt).getTime() < TWENTY_FOUR_HOURS;
  });

  const breaking = recent.filter((a) => a.breaking);
  const source = breaking.length > 0 ? breaking : recent.slice(0, 6);

  // Strict deduplication — each article appears exactly once
  const seen = new Set<string>();
  const items = source.filter((a) => {
    const key = a.id || a.slug;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (items.length === 0) return null;

  return (
    <div className="w-full bg-red-700 text-white overflow-hidden">
      <div className="flex items-stretch h-10 2xl:h-11">
        {/* Label */}
        <div className="flex-shrink-0 bg-red-900 px-4 sm:px-5 2xl:px-6 flex items-center z-10">
          <span className="text-[9px] sm:text-[10px] 2xl:text-[11px] font-extrabold uppercase tracking-[0.18em] whitespace-nowrap">
            Lajm i Fundit
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
                    className="inline-flex items-center gap-3 text-[11px] sm:text-[12px] 2xl:text-[13px] text-white/90 hover:text-white transition-colors duration-200 px-6 sm:px-8 2xl:px-10 min-h-10"
                  >
                    <span className="text-white/40 font-light select-none">|</span>
                    <span className="font-semibold tracking-[0.01em]">{article.title}</span>
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


