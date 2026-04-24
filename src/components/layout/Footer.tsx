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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 xl:gap-10 2xl:gap-12">
          {/* About */}
          <div>
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
          <div>
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
          <div>
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
          <div>
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
