'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Article } from '@/lib/types';

interface Props {
  articles: Article[];
}

export default function BreakingNewsTicker({ articles }: Props) {
  const breaking = articles.filter((a) => a.breaking);
  const containerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  if (breaking.length === 0) return null;

  return (
    <div className="bg-[#e63946] text-white overflow-hidden">
      <div className="flex items-stretch">
        {/* Label */}
        <div className="flex-shrink-0 bg-[#c0303b] px-4 py-2 flex items-center gap-2 z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] whitespace-nowrap">
            Breaking
          </span>
        </div>

        {/* Ticker */}
        <div
          ref={containerRef}
          className="relative flex-1 overflow-hidden py-2"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className={`flex gap-16 whitespace-nowrap ${paused ? '' : 'ticker-animate'}`}
            style={{ willChange: 'transform' }}
          >
            {[...breaking, ...breaking].map((article, i) => (
              <Link
                key={`${article.id}-${i}`}
                href={`/lajme/${article.slug}`}
                className="inline-flex items-center gap-2.5 text-[13px] text-white/90 hover:text-white transition-colors duration-200"
              >
                <span className="text-white/40 font-bold text-lg leading-none">|</span>
                <span>{article.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
