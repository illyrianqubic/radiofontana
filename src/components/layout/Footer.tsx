'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import { FacebookIcon, InstagramIcon, YoutubeIcon, TiktokIcon } from '@/components/shared/SocialIcons';

const quickLinks = [
  { label: 'Kryefaqja', href: '/' },
  { label: 'Lajme', href: '/lajme' },
  { label: 'Radio Live', href: '/live' },
  { label: 'Kontakt', href: '/kontakt' },
];

const footerCategories = [
  { label: 'Politikë', dotClass: 'bg-red-500' },
  { label: 'Sport', dotClass: 'bg-emerald-500' },
  { label: 'Teknologji', dotClass: 'bg-sky-500' },
  { label: 'Showbiz', dotClass: 'bg-fuchsia-500' },
  { label: 'Shëndetësi', dotClass: 'bg-lime-500' },
  { label: 'Nga Bota', dotClass: 'bg-indigo-500' },
  { label: 'Biznes', dotClass: 'bg-amber-500' },
];

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/studio')) {
    return null;
  }

  return (
    <footer className="bg-[#0f172a] text-slate-200 border-t border-slate-800">
      <div className="h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600" />

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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-0 rounded-2xl border border-slate-800/80 overflow-hidden bg-[#0f172a] shadow-[0_18px_40px_rgba(2,6,23,0.45)]">
          {/* Column 1 */}
          <div className="px-5 py-6 sm:px-6 sm:py-7">
            <h4 className="relative pl-3 text-sm font-black uppercase tracking-[0.14em] text-white mb-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-1 before:rounded-full before:bg-red-600">Rreth Nesh</h4>
            <p className="text-slate-300 text-sm leading-relaxed mb-5 max-w-md">
              Radio Fontana është media lokale në Istog, Kosovë që sjell lajme të verifikuara,
              transmetim live dhe përmbajtje informative 24/7 për komunitetin.
            </p>

            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 mb-5">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="text-sm font-semibold text-slate-100">Istog, Kosovë • 98.8 FM</span>
            </div>

            <div className="flex gap-2.5">
              <a
                href="https://www.facebook.com/rtvfontanalive"
                target="_blank"
                rel="noopener noreferrer"
                className="group touch-target w-11 h-11 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-[#1877F2] hover:border-[#1877F2] hover:shadow-[0_0_0_4px_rgba(24,119,242,0.20)] transition-none"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/rtvfontana/"
                target="_blank"
                rel="noopener noreferrer"
                className="group touch-target w-11 h-11 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-[#dd2a7b] hover:border-[#dd2a7b] hover:shadow-[0_0_0_4px_rgba(221,42,123,0.20)] transition-none"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/@RTVFontana"
                target="_blank"
                rel="noopener noreferrer"
                className="group touch-target w-11 h-11 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-[#ff0000] hover:border-[#ff0000] hover:shadow-[0_0_0_4px_rgba(255,0,0,0.20)] transition-none"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@rtvfontanalive"
                target="_blank"
                rel="noopener noreferrer"
                className="group touch-target w-11 h-11 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-white hover:shadow-[0_0_0_4px_rgba(241,245,249,0.16)] transition-none"
                aria-label="TikTok"
              >
                <TiktokIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2 */}
          <div className="px-5 py-6 sm:px-6 sm:py-7 border-t border-slate-800/80 md:border-t-0 md:border-l">
            <h4 className="relative pl-3 text-sm font-black uppercase tracking-[0.14em] text-white mb-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-1 before:rounded-full before:bg-red-600">Lidhje të Shpejta</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-slate-200 hover:text-red-400 transition-none">
                    <span>{link.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-red-500 opacity-0 group-hover:opacity-100 transition-none" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div className="px-5 py-6 sm:px-6 sm:py-7 border-t border-slate-800/80 xl:border-t-0 xl:border-l">
            <h4 className="relative pl-3 text-sm font-black uppercase tracking-[0.14em] text-white mb-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-1 before:rounded-full before:bg-red-600">Kategorite</h4>
            <ul className="space-y-2.5">
              {footerCategories.map((cat) => (
                <li key={cat.label}>
                  <Link
                    href={`/lajme/?kategoria=${encodeURIComponent(cat.label)}`}
                    className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-slate-200 hover:text-red-400 transition-none"
                  >
                    <span className={`w-2 h-2 rounded-full ${cat.dotClass}`} />
                    <span>{cat.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 */}
          <div className="px-5 py-6 sm:px-6 sm:py-7 border-t border-slate-800/80 md:border-l xl:border-t-0">
            <h4 className="relative pl-3 text-sm font-black uppercase tracking-[0.14em] text-white mb-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-1 before:rounded-full before:bg-red-600">Kontakti</h4>
            <ul className="space-y-4 text-sm text-slate-200">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-600 flex-shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <a href="tel:+38344150027" className="font-medium hover:text-red-400 transition-none">+383 44 150 027</a>
                  <a href="tel:+38344141294" className="font-medium hover:text-red-400 transition-none">+383 44 141 294</a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-red-600 flex-shrink-0" />
                <a href="mailto:rtvfontana@gmail.com" className="font-medium hover:text-red-400 transition-none break-all">
                  rtvfontana@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>Rruga &quot;Ibrahim Rugova&quot; Nr. 56, Istog, Kosovë</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-slate-700 bg-[#0a1020] px-4 sm:px-5 pb-4 sm:pb-5 rounded-b-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs 2xl:text-sm text-slate-300">
          <p>© 2026 Radio Fontana. Të gjitha të drejtat e rezervuara.</p>
          <div className="flex flex-wrap items-center justify-center gap-0">
            <Link href="/privacy" className="hover:text-red-400 transition-none min-h-11 inline-flex items-center px-2.5">Privatësia</Link>
            <span aria-hidden="true" className="h-3 w-px bg-slate-600" />
            <Link href="/terms" className="hover:text-red-400 transition-none min-h-11 inline-flex items-center px-2.5">Kushtet</Link>
            <span aria-hidden="true" className="h-3 w-px bg-slate-600" />
            <Link href="/gdpr" className="hover:text-red-400 transition-none min-h-11 inline-flex items-center px-2.5">GDPR</Link>
            <span aria-hidden="true" className="h-3 w-px bg-slate-600" />
            <Link href="/cookies" className="hover:text-red-400 transition-none min-h-11 inline-flex items-center px-2.5">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
