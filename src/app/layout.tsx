import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RadioPlayer from '@/components/layout/RadioPlayer';
import CookieConsentBanner from '@/components/layout/CookieConsentBanner';
import { AudioPlayerProvider } from '@/lib/AudioPlayerContext';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Radio Fontana - Istog, Kosovë',
    template: '%s | Radio Fontana',
  },
  description:
    'Radio Fontana është stacioni kryesor i radios në Istog, Kosovë. Lajme, muzikë dhe transmetim live 24 orë në ditë.',
  keywords: ['radio', 'Istog', 'Kosovë', 'lajme', 'muzikë', 'Radio Fontana'],
  authors: [{ name: 'Radio Fontana' }],
  creator: 'Radio Fontana',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'sq_AL',
    siteName: 'Radio Fontana',
    title: 'Radio Fontana - Istog, Kosovë',
    description: 'Stacioni kryesor i radios në Istog, Kosovë.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq" className={geist.className} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <AudioPlayerProvider>
          <Navbar />
          <main className="flex-1 pb-24 sm:pb-28">{children}</main>
          <Footer />
          <CookieConsentBanner />
          <RadioPlayer />
        </AudioPlayerProvider>
      </body>
    </html>
  );
}
