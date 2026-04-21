'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, ChevronDown, Radio } from 'lucide-react';
import { CATEGORIES } from '@/lib/types';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '@/components/shared/SocialIcons';

const navLinks = [
  { label: 'Kryefaqja', href: '/' },
  { label: 'Lajme', href: '/lajme', hasDropdown: true },
  { label: 'Live', href: '/live' },
  { label: 'Skema', href: '/skema' },
  { label: 'Kontakt', href: '/kontakt' },
];

function TopBar() {
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setDateStr(
        new Date().toLocaleDateString('sq-AL', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      );
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="bg-slate-950 text-white hidden md:block border-b border-white/[0.06]">
      <div className="site-container">
        <div className="flex items-center justify-between h-8 3xl:h-9 text-[11px] 2xl:text-xs">
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="font-semibold text-white">Radio Fontana 98.8 FM</span>
            </span>
            {dateStr && (
              <>
                <span className="text-slate-700">|</span>
                <span className="capitalize">{dateStr}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <a href="https://www.facebook.com/rtvfontanalive" target="_blank" rel="noopener noreferrer"
              className="text-slate-500 hover:text-white transition-colors" aria-label="Facebook">
              <FacebookIcon className="w-3 h-3" />
            </a>
            <a href="https://www.instagram.com/rtvfontana/" target="_blank" rel="noopener noreferrer"
              className="text-slate-500 hover:text-white transition-colors" aria-label="Instagram">
              <InstagramIcon className="w-3 h-3" />
            </a>
            <a href="https://www.youtube.com/@RTVFontana" target="_blank" rel="noopener noreferrer"
              className="text-slate-500 hover:text-white transition-colors" aria-label="YouTube">
              <YoutubeIcon className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setMobileOpen(false);
      setDropdownOpen(false);
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  // Fetch live status from Sanity via Cloudflare Function
  useEffect(() => {
    const loadLiveStatus = () => {
      fetch('/api/livestream')
        .then((r) => r.json())
        .then((data: { isLive?: boolean }) => setIsLive(data?.isLive === true))
        .catch(() => {});
    };

    if ('requestIdleCallback' in window) {
      const idleId = (window as Window & {
        requestIdleCallback: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
        cancelIdleCallback: (id: number) => void;
      }).requestIdleCallback(loadLiveStatus, { timeout: 2500 });
      return () =>
        (window as Window & {
          cancelIdleCallback: (id: number) => void;
        }).cancelIdleCallback(idleId);
    }

    const timeoutId = setTimeout(loadLiveStatus, 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/lajme/?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  if (pathname.startsWith('/studio')) {
    return null;
  }

  return (
    <>
      <TopBar />
      <header
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
          scrolled ? 'shadow-[0_2px_12px_rgba(0,0,0,0.08)]' : 'border-b border-slate-100'
        }`}
        style={{ minWidth: 0 }}
      >
        {/* Red accent line at top */}
        <div className="h-0.5 gradient-bar" />

        {/* Main navbar */}
        <div className="site-container">
          <div className="flex items-center justify-between h-14 sm:h-16 3xl:h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image
                src="/logortvfontana.jpg"
                alt="Radio Fontana"
                width={190}
                height={64}
                className="h-10 sm:h-12 lg:h-[52px] 3xl:h-[58px] w-auto object-contain translate-y-0.5"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <div key={link.href} className="relative">
                  {link.hasDropdown ? (
                    <div
                      className="relative"
                      onMouseEnter={() => setDropdownOpen(true)}
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      <Link
                        href={link.href}
                        className={`flex items-center gap-1 px-4 2xl:px-5 py-2 rounded-lg text-sm 2xl:text-[15px] 3xl:text-base font-medium transition-all duration-200 ${
                          isActive('/lajme')
                            ? 'text-red-600 font-semibold'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        {link.label}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                      </Link>
                      {dropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden z-50">
                          <div className="p-1.5">
                            {CATEGORIES.map((cat) => (
                              <Link
                                key={cat}
                                href={`/lajme/?kategoria=${encodeURIComponent(cat)}`}
                                className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-slate-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors group"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-red-400 transition-colors" />
                                {cat}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className={`px-4 2xl:px-5 py-2 rounded-lg text-sm 2xl:text-[15px] 3xl:text-base font-medium transition-all duration-200 ${
                        isActive(link.href)
                          ? 'text-red-600 font-semibold'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-1.5 2xl:gap-2">
              {/* Live badge — visible only when Sanity liveStream.isLive is true */}
              {isLive && (
                <Link
                  href="/live"
                  className="hidden sm:flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-[11px] 2xl:text-xs font-bold px-3 2xl:px-4 py-1.5 rounded-full transition-colors live-glow min-h-11"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  LIVE
                </Link>
              )}

              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="touch-target h-11 w-11 inline-flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                aria-label="Kërko"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>
              <button
                className="touch-target h-11 w-11 inline-flex items-center justify-center lg:hidden rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="overflow-hidden">
              <form onSubmit={handleSearch} className="pb-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Kërko lajme, tema, autorë..."
                    autoFocus
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/25 focus:border-red-500 text-sm 2xl:text-base transition-all"
                  />
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white overflow-hidden max-h-[70vh] overflow-y-auto">
            <nav className="px-4 py-3 space-y-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors min-h-11 ${
                    isActive(link.href)
                      ? 'bg-red-50 text-red-600 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 mt-2 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 px-4 py-1 font-bold uppercase tracking-[0.15em]">Kategoritë</p>
                <div className="grid grid-cols-2 gap-0.5 mt-1">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat}
                      href={`/lajme/?kategoria=${encodeURIComponent(cat)}`}
                      className="px-4 py-3 text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors min-h-11 flex items-center"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
              {/* Mobile social links */}
              <div className="flex items-center gap-3 px-4 pt-3 border-t border-slate-100 mt-2">
                <a href="https://www.facebook.com/rtvfontanalive" target="_blank" rel="noopener noreferrer"
                  className="touch-target w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center justify-center" aria-label="Facebook">
                  <FacebookIcon className="w-4 h-4" />
                </a>
                <a href="https://www.instagram.com/rtvfontana/" target="_blank" rel="noopener noreferrer"
                  className="touch-target w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center justify-center" aria-label="Instagram">
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a href="https://www.youtube.com/@RTVFontana" target="_blank" rel="noopener noreferrer"
                  className="touch-target w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center justify-center" aria-label="YouTube">
                  <YoutubeIcon className="w-4 h-4" />
                </a>
                <span className="ml-auto flex items-center gap-1.5 text-xs text-slate-500">
                  <Radio className="w-3.5 h-3.5 text-red-500" />
                  98.8 FM
                </span>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

