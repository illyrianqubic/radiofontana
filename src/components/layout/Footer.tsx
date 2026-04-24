'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Mail, Phone, MapPin } from 'lucide-react';
import { FacebookIcon, InstagramIcon, YoutubeIcon, TiktokIcon } from '@/components/shared/SocialIcons';
import { CATEGORIES } from '@/lib/types';
export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/studio')) {
    return null;
  }

  return (
    <footer className="bg-slate-950 text-slate-200 border-t border-slate-800">
      <div className="h-1 gradient-bar" />

      {/* Newsletter row */}
      <div className="border-b border-slate-800 bg-slate-900/70">
        <div className="site-container py-6 sm:py-7">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-center">
            <div className="lg:col-span-7">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-red-400 mb-2">Newsletter</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">Qëndro i informuar me lajmet e fundit</h3>
              <p className="text-slate-400 text-sm mt-1.5">Abonohu me email për përmbledhjen ditore të lajmeve nga Radio Fontana.</p>
            </div>

            <form method="get" action="/kontakt" className="lg:col-span-5 flex flex-col sm:flex-row gap-2.5">
              <input
                type="email"
                name="email"
                required
                placeholder="Emaili juaj"
                className="w-full min-h-11 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/60"
              />
              <button
                type="submit"
                className="touch-target min-h-11 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition-colors"
              >
                Abonohu
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="site-container py-12 sm:py-14 2xl:py-16">
        <div className="mb-8 sm:mb-9">
          <Image
            src="/logortvfontana.jpg"
            alt="Radio Fontana"
            width={148}
            height={48}
            className="h-12 w-auto object-contain rounded"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-8 xl:gap-10 2xl:gap-12">
          {/* About */}
          <div className="xl:col-span-4">
            <h4 className="text-sm font-extrabold text-white mb-3">About Radio Fontana</h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-5 max-w-md">
              Radio Fontana është media lokale në Istog, Kosovë që sjell lajme të verifikuara,
              transmetim live dhe përmbajtje informative 24/7 për komunitetin.
            </p>

            <div className="flex gap-2.5">
              <a
                href="https://www.facebook.com/rtvfontanalive"
                target="_blank"
                rel="noopener noreferrer"
                className="group touch-target w-11 h-11 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white transition-all duration-200"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/rtvfontana/"
                target="_blank"
                rel="noopener noreferrer"
                className="group touch-target w-11 h-11 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:border-transparent hover:bg-[linear-gradient(135deg,#f58529_0%,#dd2a7b_45%,#8134af_75%,#515bd4_100%)] hover:text-white transition-all duration-200"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/@RTVFontana"
                target="_blank"
                rel="noopener noreferrer"
                className="group touch-target w-11 h-11 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-200"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@rtvfontanalive"
                target="_blank"
                rel="noopener noreferrer"
                className="group touch-target w-11 h-11 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-black hover:border-black hover:text-white transition-all duration-200"
                aria-label="TikTok"
              >
                <TiktokIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="xl:col-span-2">
            <h4 className="text-sm font-extrabold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Kryefaqja', href: '/' },
                { label: 'Lajme', href: '/lajme' },
                { label: 'Radio Live', href: '/live' },
                { label: 'Kontakt', href: '/kontakt' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-flex min-h-11 items-center text-sm text-slate-300 hover:text-red-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="xl:col-span-3">
            <h4 className="text-sm font-extrabold text-white mb-3">Categories</h4>
            <ul className="space-y-2.5">
              {CATEGORIES.slice(0, 7).map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/lajme/?kategoria=${encodeURIComponent(cat)}`}
                    className="inline-flex min-h-11 items-center text-sm text-slate-300 hover:text-red-400 transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="xl:col-span-3">
            <h4 className="text-sm font-extrabold text-white mb-3">Contact Info</h4>
            <ul className="space-y-3.5 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>Rruga &quot;Ibrahim Rugova&quot; Nr. 56, Istog, Kosovë</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-400 flex-shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <a href="tel:+38344150027" className="hover:text-red-400 transition-colors">+383 44 150 027</a>
                  <a href="tel:+38344141294" className="hover:text-red-400 transition-colors">+383 44 141 294</a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-red-400 flex-shrink-0" />
                <a href="mailto:rtvfontana@gmail.com" className="hover:text-red-400 transition-colors break-all">
                  rtvfontana@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs 2xl:text-sm text-slate-500">
          <p>© 2026 Radio Fontana. Të gjitha të drejtat e rezervuara.</p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link href="/privacy" className="hover:text-red-400 transition-colors min-h-11 inline-flex items-center">Privatësia</Link>
            <Link href="/terms" className="hover:text-red-400 transition-colors min-h-11 inline-flex items-center">Kushtet</Link>
            <Link href="/gdpr" className="hover:text-red-400 transition-colors min-h-11 inline-flex items-center">GDPR</Link>
            <Link href="/cookies" className="hover:text-red-400 transition-colors min-h-11 inline-flex items-center">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
