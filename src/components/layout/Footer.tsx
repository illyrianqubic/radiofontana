'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Mail, Phone, MapPin, Radio } from 'lucide-react';
import { FacebookIcon, InstagramIcon, YoutubeIcon, TiktokIcon } from '@/components/shared/SocialIcons';
import { CATEGORIES } from '@/lib/types';
export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/studio')) {
    return null;
  }

  return (
    <footer className="bg-white text-slate-800 border-t border-slate-200">
      {/* Top red accent */}
      <div className="h-1 gradient-bar" />

      {/* Main footer */}
      <div className="site-container py-12 sm:py-14 2xl:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 2xl:grid-cols-6 gap-10 2xl:gap-12 3xl:gap-16">

          {/* Brand */}
          <div className="xl:col-span-1 2xl:col-span-2">
            <div className="mb-4">
              <Image
                src="/logortvfontana.jpg"
                alt="Radio Fontana"
                width={120}
                height={40}
                className="h-10 2xl:h-11 3xl:h-12 w-auto object-contain rounded"
              />
            </div>
            <div className="flex items-center gap-1.5 mb-3">
              <Radio className="w-3.5 h-3.5 text-red-600" />
              <span className="text-sm 2xl:text-base font-semibold text-slate-700">98.8 FM · Istog, Kosovë</span>
            </div>
            <p className="text-slate-500 text-sm 2xl:text-base leading-relaxed mb-5">
              Stacioni kryesor i informacionit dhe muzikës në Istog, Kosovë. Transmetim live 24/7.
            </p>
            <div className="flex gap-2.5">
              <a href="https://www.facebook.com/rtvfontanalive" target="_blank" rel="noopener noreferrer"
                className="group touch-target w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white hover:shadow-[0_10px_22px_rgba(24,119,242,0.3)] transition-all duration-200" aria-label="Facebook">
                <span className="rounded-full p-1.5 transition-colors duration-200 group-hover:bg-white/20">
                  <FacebookIcon className="w-5 h-5" />
                </span>
              </a>
              <a href="https://www.instagram.com/rtvfontana/" target="_blank" rel="noopener noreferrer"
                className="group touch-target w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:border-transparent hover:bg-[linear-gradient(135deg,#f58529_0%,#dd2a7b_45%,#8134af_75%,#515bd4_100%)] hover:text-white hover:shadow-[0_10px_22px_rgba(221,42,123,0.35)] transition-all duration-200" aria-label="Instagram">
                <span className="rounded-full p-1.5 transition-colors duration-200 group-hover:bg-white/20">
                  <InstagramIcon className="w-5 h-5" />
                </span>
              </a>
              <a href="https://www.youtube.com/@RTVFontana" target="_blank" rel="noopener noreferrer"
                className="group touch-target w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-red-600 hover:border-red-600 hover:text-white hover:shadow-[0_10px_22px_rgba(220,38,38,0.35)] transition-all duration-200" aria-label="YouTube">
                <span className="rounded-full p-1.5 transition-colors duration-200 group-hover:bg-white/20">
                  <YoutubeIcon className="w-5 h-5" />
                </span>
              </a>
              <a href="https://www.tiktok.com/@rtvfontanalive" target="_blank" rel="noopener noreferrer"
                className="group touch-target w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-black hover:border-black hover:text-white hover:shadow-[0_10px_22px_rgba(15,23,42,0.35)] transition-all duration-200" aria-label="TikTok">
                <span className="rounded-full p-1.5 transition-colors duration-200 group-hover:bg-white/15">
                  <TiktokIcon className="w-5 h-5" />
                </span>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400 mb-5">Kategoritë</h4>
            <ul className="space-y-2.5">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/lajme/?kategoria=${encodeURIComponent(cat)}`}
                    className="inline-flex items-center min-h-11 text-slate-600 hover:text-red-600 text-sm 2xl:text-[15px] transition-colors duration-200 hover:pl-1"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400 mb-5">Navigimi</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Kryefaqja', href: '/' },
                { label: 'Lajme', href: '/lajme' },
                { label: 'Radio Live', href: '/live' },
                { label: 'Kontakt', href: '/kontakt' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-flex items-center min-h-11 text-slate-600 hover:text-red-600 text-sm 2xl:text-[15px] transition-colors duration-200 hover:pl-1">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400 mb-5">Legal</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Kushtet e Shërbimit', href: '/terms' },
                { label: 'Politika e Privatësisë', href: '/privacy' },
                { label: 'Të Drejtat GDPR', href: '/gdpr' },
                { label: 'Mohim Përgjegjësie', href: '/disclaimer' },
                { label: 'Politika e Cookies', href: '/cookies' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-flex items-center min-h-11 text-slate-600 hover:text-red-600 text-sm 2xl:text-[15px] transition-colors duration-200 hover:pl-1">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400 mb-5">Kontakti</h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3 text-sm 2xl:text-[15px] text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <span>Rruga &quot;Ibrahim Rugova&quot; Nr. 56<br />Istog, Kosovë</span>
              </li>
              <li className="flex items-center gap-3 text-sm 2xl:text-[15px] text-slate-600">
                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:+38344150027" className="hover:text-red-600 transition-colors">+383 44 150 027</a>
                  <a href="tel:+38344141294" className="hover:text-red-600 transition-colors">+383 44 141 294</a>
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm 2xl:text-[15px] text-slate-600">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <a href="mailto:rtvfontana@gmail.com" className="hover:text-red-600 transition-colors break-all text-left">
                  rtvfontana@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs 2xl:text-sm text-slate-500">
          <p>© 2026 Radio Fontana. Të gjitha të drejtat e rezervuara.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-red-600 transition-colors min-h-11 inline-flex items-center">Privatësia</Link>
            <Link href="/terms" className="hover:text-red-600 transition-colors min-h-11 inline-flex items-center">Kushtet</Link>
            <Link href="/cookies" className="hover:text-red-600 transition-colors min-h-11 inline-flex items-center">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
