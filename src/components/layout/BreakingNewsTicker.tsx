import Link from 'next/link';
import { Article } from '@/lib/types';

interface Props {
  articles: Article[];
}

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

export default function BreakingNewsTicker({ articles }: Props) {
  const now = Date.now();

  // Prefer: breaking articles from the last 24 hours
  const recentBreaking = articles.filter((a) => {
    if (!a.breaking || !a.publishedAt) return false;
    return now - new Date(a.publishedAt).getTime() < TWENTY_FOUR_HOURS;
  });

  // Fallback: all articles marked breaking (regardless of age)
  const allBreaking = articles.filter((a) => a.breaking);

  // Final fallback: latest 6 articles
  const source =
    recentBreaking.length > 0
      ? recentBreaking
      : allBreaking.length > 0
      ? allBreaking.slice(0, 6)
      : articles.slice(0, 6);

  // Strict deduplication
  const seen = new Set<string>();
  const items = source.filter((a) => {
    const key = a.id || a.slug;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (items.length === 0) return null;

  // Duplicate content so seamless loop works at any viewport width
  const loopItems = [...items, ...items];

  return (
    <div className="w-full bg-[#c0152a] text-white overflow-hidden" role="marquee" aria-label="Lajmet e fundit">
      <div className="flex items-stretch" style={{ height: '40px' }}>

        {/* Label */}
        <div className="flex-shrink-0 flex items-center px-4 sm:px-5 gap-3" style={{ background: '#a01020' }}>
          <span
            className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.2em] whitespace-nowrap leading-none"
            style={{ letterSpacing: '0.18em' }}
          >
            Lajm i Fundit
          </span>
          {/* Vertical divider */}
          <span className="block w-px self-stretch my-2" style={{ background: 'rgba(255,255,255,0.35)' }} />
        </div>

        {/* Scrolling track */}
        <div className="relative flex-1 overflow-hidden flex items-center">
          <div
            className="ticker-track ticker-animate flex"
            style={{ willChange: 'transform' }}
          >
            {loopItems.map((article, idx) => (
              <Link
                key={`${idx}-${article.id || article.slug}`}
                href={`/lajme/${article.slug}`}
                className="inline-flex items-center gap-3 whitespace-nowrap px-5 sm:px-7 text-[11px] sm:text-[12px] font-semibold text-white/90 hover:text-white transition-colors duration-200"
                style={{ lineHeight: '40px' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white/50 flex-shrink-0 inline-block" />
                {article.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

