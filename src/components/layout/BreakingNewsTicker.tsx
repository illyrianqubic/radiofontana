import Link from 'next/link';
import { Article } from '@/lib/types';

interface Props {
  articles: Article[];
}

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
const NOW = Date.now();

export default function BreakingNewsTicker({ articles }: Props) {
  // Only articles explicitly marked breaking AND published within 24 hours
  const recentBreaking = articles.filter((a) => {
    if (!a.breaking || !a.publishedAt) return false;
    return NOW - new Date(a.publishedAt).getTime() < TWENTY_FOUR_HOURS;
  });

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
    <div className="w-full bg-[#c0152a] text-white overflow-hidden" role="marquee" aria-label="Lajmet e fundit">
      <div className="flex items-stretch" style={{ height: '44px' }}>

        {/* Label */}
        <div className="flex-shrink-0 flex items-center px-3 sm:px-5 gap-2.5 sm:gap-3" style={{ background: '#a01020' }}>
          <span className="text-[10px] sm:text-[11px] 2xl:text-[12px] font-extrabold uppercase tracking-[0.2em] whitespace-nowrap leading-none">
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
                    className="touch-target inline-flex items-center gap-3 whitespace-nowrap px-4 sm:px-7 text-[11px] sm:text-[12px] 2xl:text-[13px] font-semibold text-white/90 hover:text-white transition-colors duration-200"
                    style={{ lineHeight: '44px' }}
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

