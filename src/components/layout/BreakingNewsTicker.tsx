import Link from 'next/link';
import { Article } from '@/lib/types';

interface Props {
  articles: Article[];
}

export default function BreakingNewsTicker({ articles }: Props) {
  // Show all articles marked breaking — editorial control via the breaking flag in Sanity.
  const recentBreaking = articles.filter((a) => a.breaking && a.publishedAt);

  // Strict deduplication
  const seen = new Set<string>();
  const items = recentBreaking.filter((a) => {
    const key = a.id || a.slug;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (items.length === 0) return null;

  return (
    <div className="w-full bg-[#c0152a] text-white overflow-hidden" role="region" aria-label="Lajme të fundit">
      <div className="flex items-stretch h-11 md:h-[52px]">

        {/* Label */}
        <div className="flex-shrink-0 flex items-center px-3 sm:px-5 gap-2.5 sm:gap-3" style={{ background: '#a01020' }}>
          <span className="text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-[12px] font-extrabold uppercase tracking-[0.2em] whitespace-nowrap leading-none">
            Lajm i Fundit
          </span>
          <span className="block w-px self-stretch my-2" style={{ background: 'rgba(255,255,255,0.35)' }} />
        </div>

        {/* Scrolling track — two groups, each min 110vw, so only one is ever visible at a time */}
        <div className="relative flex-1 overflow-hidden flex items-center">
          <div className="ticker-track ticker-animate" style={{ willChange: 'transform' }}>
            {[0, 1].map((group) => (
              <div key={group} className="ticker-half">
                {items.map((article) => (
                  <Link
                    key={`${group}-${article.id || article.slug}`}
                    href={`/lajme/${article.slug}`}
                    className="touch-target inline-flex items-center gap-3 whitespace-nowrap px-4 sm:px-7 text-sm md:text-base 2xl:text-[1.02rem] font-semibold text-white/90 hover:text-white transition-colors duration-200 leading-[44px] md:leading-[52px]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/50 flex-shrink-0 inline-block" />
                    {article.title}
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

