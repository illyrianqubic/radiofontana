'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Article } from '@/lib/types';
import { Zap } from 'lucide-react';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';

interface Props {
  articles: Article[];
}

export default function BreakingNewsTicker({ articles }: Props) {
  const breaking = articles.filter((a) => a.breaking);
  // Fall back to latest 5 articles when no explicitly-breaking ones exist
  const source = breaking.length > 0 ? breaking : articles.slice(0, 5);
  const items = useMemo(
    () => source.filter((article, index, arr) => {
      const key = article.id || article.slug;
      return arr.findIndex((candidate) => (candidate.id || candidate.slug) === key) === index;
    }),
    [source]
  );

  const [paused, setPaused] = useState(false);
  const [sizes, setSizes] = useState({ container: 0, track: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const SPEED_PX_PER_SECOND = 70;

  useEffect(() => {
    const updateSizes = () => {
      const container = containerRef.current?.offsetWidth ?? 0;
      const track = trackRef.current?.scrollWidth ?? 0;
      setSizes({ container, track });
    };

    updateSizes();

    const observer = new ResizeObserver(updateSizes);
    if (containerRef.current) observer.observe(containerRef.current);
    if (trackRef.current) observer.observe(trackRef.current);

    window.addEventListener('resize', updateSizes);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSizes);
    };
  }, [items.length]);

  useEffect(() => {
    if (!sizes.container) return;
    x.set(sizes.container);
  }, [sizes.container, items.length, x]);

  useAnimationFrame((_, delta) => {
    if (paused || !sizes.container || !sizes.track) return;

    const next = x.get() - (SPEED_PX_PER_SECOND * delta) / 1000;
    if (next <= -sizes.track) {
      x.set(sizes.container);
      return;
    }
    x.set(next);
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
        <div
          ref={containerRef}
          className="relative flex-1 overflow-hidden flex items-center"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <motion.div
            ref={trackRef}
            className="flex gap-0 whitespace-nowrap"
            style={{ x, willChange: 'transform' }}
          >
            {items.map((article) => (
              <Link
                key={article.id || article.slug}
                href={`/lajme/${article.slug}`}
                className="inline-flex items-center gap-3 text-[12px] text-white/90 hover:text-white transition-colors duration-200 px-8"
              >
                <span className="text-red-300 font-bold text-xs">◆</span>
                <span className="font-medium">{article.title}</span>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}


