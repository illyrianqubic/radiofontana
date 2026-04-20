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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Kërko lajme..."
          className="w-full pl-10 pr-10 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] text-sm"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); navigate({ ...(activeCategory ? { kategoria: activeCategory } : {}) }); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => selectCategory(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            !activeCategory
              ? 'bg-[#1a3a6b] text-white shadow-sm'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Të gjitha
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => selectCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeCategory === cat
                ? 'bg-[#1a3a6b] text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
        {(activeCategory || activeQuery) && (
          <button
            onClick={clearAll}
            className="px-3 py-1.5 rounded-full text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Pastro
          </button>
        )}
      </div>

      {isPending && (
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
          <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
          Duke filtruar...
        </div>
      )}
    </div>
  );
}
