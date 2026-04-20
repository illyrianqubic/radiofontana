import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RadioPlayer from '@/components/layout/RadioPlayer';

export const runtime = 'edge';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Radio Fontana - Pejë, Kosovë',
    template: '%s | Radio Fontana',
  },
  description:
    'Radio Fontana është stacioni kryesor i radios në Pejë, Kosovë. Lajme, muzikë dhe transmetim live 24 orë në ditë.',
  keywords: ['radio', 'Pejë', 'Kosovë', 'lajme', 'muzikë', 'Radio Fontana'],
  authors: [{ name: 'Radio Fontana' }],
  creator: 'Radio Fontana',
  icons: {
    icon: '/logortvfontana.jpg',
    shortcut: '/logortvfontana.jpg',
    apple: '/logortvfontana.jpg',
  },
  openGraph: {
    type: 'website',
    locale: 'sq_AL',
    siteName: 'Radio Fontana',
    title: 'Radio Fontana - Pejë, Kosovë',
    description: 'Stacioni kryesor i radios në Pejë, Kosovë.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq" className={geist.className} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <RadioPlayer />
      </body>
    </html>
  );
}
