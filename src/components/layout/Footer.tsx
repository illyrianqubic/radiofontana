import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Radio } from 'lucide-react';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '@/components/shared/SocialIcons';
import { CATEGORIES } from '@/lib/types';
import FooterNewsletter from '@/components/layout/FooterNewsletter';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0d14] text-white">
      {/* Top red accent */}
      <div className="h-1 gradient-bar" />

      {/* Newsletter strip */}
      <div className="border-b border-white/[0.06] bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-red-500 mb-1">Buletini Ditor</p>
              <h3 className="text-base sm:text-lg font-bold text-white mb-0.5">Qëndro i Informuar</h3>
              <p className="text-slate-500 text-sm">Merr lajmet e fundit direkt në emailin tënd.</p>
            </div>
            <FooterNewsletter />
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Image
                src="/logortvfontana.jpg"
                alt="Radio Fontana"
                width={120}
                height={40}
                className="h-10 w-auto object-contain rounded"
              />
            </div>
            <div className="flex items-center gap-1.5 mb-3">
              <Radio className="w-3.5 h-3.5 text-red-500" />
              <span className="text-sm font-semibold text-slate-300">96.5 FM · Pejë, Kosovë</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-5">
              Stacioni kryesor i informacionit dhe muzikës në Pejë, Kosovë. Transmetim live 24/7.
            </p>
            <div className="flex gap-2">
              <a href="https://www.facebook.com/rtvfontanalive" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center hover:bg-[#1877F2] hover:border-[#1877F2] transition-all duration-200" aria-label="Facebook">
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/rtvfontana/" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center hover:bg-pink-600 hover:border-pink-600 transition-all duration-200" aria-label="Instagram">
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a href="https://www.youtube.com/@RTVFontana" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all duration-200" aria-label="YouTube">
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500 mb-5">Kategoritë</h4>
            <ul className="space-y-2.5">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/lajme?kategoria=${encodeURIComponent(cat)}`}
                    className="text-slate-400 hover:text-white text-sm transition-colors duration-200 hover:pl-1"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500 mb-5">Navigimi</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Kryefaqja', href: '/' },
                { label: 'Lajme', href: '/lajme' },
                { label: 'Radio Live', href: '/live' },
                { label: 'Skema Programore', href: '/skema' },
                { label: 'Kontakt', href: '/kontakt' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors duration-200 hover:pl-1">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500 mb-5">Kontakti</h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                <span>Rruga &quot;Ibrahim Rugova&quot; Nr. 56<br />Pejë, Kosovë</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Phone className="w-4 h-4 text-slate-600 flex-shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:+38344150027" className="hover:text-white transition-colors">+383 44 150 027</a>
                  <a href="tel:+38344141294" className="hover:text-white transition-colors">+383 44 141 294</a>
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-slate-600 flex-shrink-0" />
                <a href="mailto:rtvfontana@gmail.com" className="hover:text-white transition-colors">rtvfontana@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <p>© {year} Radio Fontana · RTV Fontana. Të gjitha të drejtat e rezervuara.</p>
          <div className="flex gap-6">
            <Link href="/kontakt" className="hover:text-slate-300 transition-colors">Privatësia</Link>
            <Link href="/kontakt" className="hover:text-slate-300 transition-colors">Kushtet e Përdorimit</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

      {/* Newsletter strip */}
      <div className="border-b border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-1">Abonohu tek Buletini</h3>
              <p className="text-slate-400 text-sm">Merr lajmet e fundit direkt në emailin tënd.</p>
            </div>
            <FooterNewsletter />
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <Image
                src="/logortvfontana.jpg"
                alt="Radio Fontana"
                width={120}
                height={40}
                className="h-10 w-auto object-contain rounded"
              />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Stacioni kryesor i informacionit dhe muzikës në Pejë, Kosovë. Radio Fontana 98.8 FM.
            </p>
            <div className="flex gap-2">
              <a href="https://www.facebook.com/rtvfontanalive" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center hover:bg-[#1877F2] transition-all duration-200" aria-label="Facebook">
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/rtvfontana/" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 transition-all duration-200" aria-label="Instagram">
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a href="https://www.youtube.com/@RTVFontana" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center hover:bg-[#FF0000] transition-all duration-200" aria-label="YouTube">
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-500 mb-5">Kategoritë</h4>
            <ul className="space-y-2.5">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/lajme?kategoria=${encodeURIComponent(cat)}`}
                    className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-500 mb-5">Navigimi</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Kryefaqja', href: '/' },
                { label: 'Lajme', href: '/lajme' },
                { label: 'Radio Live', href: '/live' },
                { label: 'Skema Programore', href: '/skema' },
                { label: 'Kontakt', href: '/kontakt' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-500 mb-5">Kontakti</h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                <span>Rruga &quot;Ibrahim Rugova&quot; Nr. 56<br />Pejë, Kosovë</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Phone className="w-4 h-4 text-slate-600 flex-shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:+38344150027" className="hover:text-white transition-colors duration-200">+383 44 150 027</a>
                  <a href="tel:+38344141294" className="hover:text-white transition-colors duration-200">+383 44 141 294</a>
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-slate-600 flex-shrink-0" />
                <a href="mailto:rtvfontana@gmail.com" className="hover:text-white transition-colors duration-200">rtvfontana@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <p>© {year} Radio Fontana. Të gjitha të drejtat e rezervuara.</p>
          <div className="flex gap-6">
            <Link href="/kontakt" className="hover:text-slate-300 transition-colors">Privatësia</Link>
            <Link href="/kontakt" className="hover:text-slate-300 transition-colors">Kushtet</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
