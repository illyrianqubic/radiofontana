'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { CATEGORIES, Category } from '@/lib/types';

export default function NewsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeCategory = searchParams.get('kategoria') as Category | null;
  const activeQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(activeQuery);

  useEffect(() => {
    setQuery(activeQuery);
  }, [activeQuery]);

  const navigate = (params: Record<string, string>) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) sp.set(k, v); });
    startTransition(() => {
      router.push(`/lajme${sp.toString() ? `?${sp.toString()}` : ''}`);
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ q: query, ...(activeCategory ? { kategoria: activeCategory } : {}) });
  };

  const selectCategory = (cat: Category | null) => {
    navigate({
      ...(cat ? { kategoria: cat } : {}),
      ...(activeQuery ? { q: activeQuery } : {}),
    });
  };

  const clearAll = () => {
    setQuery('');
    router.push('/lajme');
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Kërko lajme, tema, autorë..."
          className="w-full pl-11 pr-10 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e63946]/30 focus:border-[#e63946] text-sm transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); navigate({ ...(activeCategory ? { kategoria: activeCategory } : {}) }); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => selectCategory(null)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
            !activeCategory
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          Të gjitha
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => selectCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
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
            onClick={clearAll}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#e63946] bg-[#e63946]/5 hover:bg-[#e63946]/10 transition-colors duration-200 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Pastro
          </button>
        )}
      </div>

      {isPending && (
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <div className="w-3 h-3 border border-slate-400 border-t-transparent rounded-full animate-spin" />
          Duke filtruar...
        </div>
      )}
    </div>
  );
}
