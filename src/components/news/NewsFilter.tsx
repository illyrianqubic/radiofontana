'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { CATEGORIES, Category } from '@/lib/types';

interface NewsFilterProps {
  activeCategory: Category | null;
  activeQuery: string;
  loading?: boolean;
  onCategoryChange: (category: Category | null) => void;
  onSearchApply: (query: string) => void;
  onClear: () => void;
}

export default function NewsFilter({
  activeCategory,
  activeQuery,
  loading = false,
  onCategoryChange,
  onSearchApply,
  onClear,
}: NewsFilterProps) {

  const [query, setQuery] = useState(activeQuery);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setQuery(activeQuery));
    return () => cancelAnimationFrame(raf);
  }, [activeQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchApply(query);
  };

  return (
    <div className="space-y-5">
      {/* Search */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Kërko lajme, tema, autorë..."
          className="w-full pl-11 pr-10 py-3.5 md:py-4 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e63946]/30 focus:border-[#e63946] text-base md:text-lg transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              onSearchApply('');
            }}
            className="touch-target absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors inline-flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Category pills */}
      <div className="flex gap-2.5 md:gap-3 overflow-x-auto pb-1 -mx-1 px-1 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible">
        <button
          type="button"
          onClick={() => onCategoryChange(null)}
          className={`px-4 md:px-5 py-2.5 md:py-3 min-h-11 rounded-xl text-sm md:text-base font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
            !activeCategory
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          Të gjitha lajmet
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryChange(cat)}
            className={`px-4 md:px-5 py-2.5 md:py-3 min-h-11 rounded-xl text-sm md:text-base font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
              activeCategory === cat
                ? 'bg-[#e63946] text-white shadow-sm shadow-[#e63946]/20'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
        {(activeCategory || activeQuery) && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              onClear();
            }}
            className="px-4 md:px-5 py-2.5 md:py-3 min-h-11 rounded-xl text-sm md:text-base font-semibold text-[#e63946] bg-[#e63946]/5 hover:bg-[#e63946]/10 transition-colors duration-200 flex items-center gap-1 whitespace-nowrap flex-shrink-0"
          >
            <X className="w-3 h-3" />
            Pastro
          </button>
        )}
      </div>

      {loading && (
        <div className="text-sm text-slate-500 flex items-center gap-1.5">
          <div className="w-3 h-3 border border-slate-400 border-t-transparent rounded-full animate-spin" />
          Duke filtruar...
        </div>
      )}
    </div>
  );
}
