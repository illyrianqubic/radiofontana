import Link from 'next/link';
import { Radio, Mail, Phone, MapPin } from 'lucide-react';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '@/components/shared/SocialIcons';
import { CATEGORIES } from '@/lib/types';
import FooterNewsletter from '@/components/layout/FooterNewsletter';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0f2347] text-white mt-16 pb-20">
      {/* Newsletter */}
      <div className="bg-[#1a3a6b] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-1">Abonohu tek Buletini Ynë</h3>
              <p className="text-blue-200 text-sm">Merr lajmet e fundit direkt në emailin tënd.</p>
            </div>
            <FooterNewsletter />
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Radio className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-lg leading-none">Radio Fontana</p>
                <p className="text-xs text-blue-300">96.5 FM · Pejë</p>
              </div>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed mb-5">
              Stacioni kryesor i informacionit dhe muzikës në Pejë, Kosovë. Duke transmetuar me cilësi të lartë që nga viti 1995.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 transition-colors"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-blue-300 mb-4">Kategoritë</h4>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/lajme?kategoria=${encodeURIComponent(cat)}`}
                    className="text-blue-100 hover:text-white text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-blue-400 group-hover:bg-white transition-colors" />
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-blue-300 mb-4">Lidhje të Shpejta</h4>
            <ul className="space-y-2">
              {[
                { label: 'Kryefaqja', href: '/' },
                { label: 'Lajme', href: '/lajme' },
                { label: 'Radio Live', href: '/live' },
                { label: 'Skema Programore', href: '/skema' },
                { label: 'Kontakt', href: '/kontakt' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-100 hover:text-white text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-blue-400 group-hover:bg-white transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-blue-300 mb-4">Na Kontaktoni</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-blue-100">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>Rr. Mbretëresha Teuta, Nr. 15<br />Pejë 30000, Kosovë</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-blue-100">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href="tel:+38339123456" className="hover:text-white transition-colors">+383 39 123 456</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-blue-100">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href="mailto:info@radiofontana.com" className="hover:text-white transition-colors">info@radiofontana.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-300">
          <p>© {year} Radio Fontana. Të gjitha të drejtat e rezervuara.</p>
          <div className="flex gap-4">
            <Link href="/kontakt" className="hover:text-white transition-colors">Politika e Privatësisë</Link>
            <Link href="/kontakt" className="hover:text-white transition-colors">Kushtet e Përdorimit</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
