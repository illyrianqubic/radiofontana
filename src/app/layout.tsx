import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RadioPlayer from '@/components/layout/RadioPlayer';
import CookieConsentBanner from '@/components/layout/CookieConsentBanner';
import { AudioPlayerProvider } from '@/lib/AudioPlayerContext';

const geist = Geist({
  subsets: ['latin'],
  display: 'optional', // prevent font CLS
});

const SITE_URL = 'https://radiofontana.org';
const SITE_NAME = 'Radio Fontana';
const OG_IMAGE = `${SITE_URL}/logortvfontana.jpg`;

export const viewport: Viewport = {
  themeColor: '#dc2626',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Radio Fontana 98.8 FM | Radio Shqip Live nga Kosova',
    template: '%s | Radio Fontana',
  },
  description:
    'Radio Fontana 98.8 FM, stacioni kryesor i radios dhe lajmeve në Istog, Kosovë. Lajme live, muzikë shqip dhe transmetim 24 orë.',
  keywords: [
    'Radio Fontana', 'radio shqip', 'radio kosovë', 'radio 98.8 FM', 'lajme istog',
    'lajme kosovë', 'rtv fontana', 'radio live kosovë', 'lajme shqip', 'radio istog',
    'lajme politike kosovë', 'radio online shqip', 'radio fontana live',
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: 'RTV Fontana',
  applicationName: SITE_NAME,
  appleWebApp: {
    title: SITE_NAME,
    statusBarStyle: 'default',
    capable: true,
  },
  formatDetection: { telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'sq_AL',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'Radio Fontana 98.8 FM | Radio Shqip Live nga Kosova',
    description:
      'Radio Fontana 98.8 FM, stacioni kryesor i radios dhe lajmeve në Istog, Kosovë. Lajme live dhe muzikë shqip 24 orë.',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Radio Fontana 98.8 FM - Istog, Kosovë',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@rtvfontana',
    creator: '@rtvfontana',
    title: 'Radio Fontana 98.8 FM | Radio Shqip Live nga Kosova',
    description: 'Radio Fontana 98.8 FM, lajme dhe muzikë shqip 24 orë nga Istog, Kosovë.',
    images: [OG_IMAGE],
  },
  alternates: {
    canonical: SITE_URL,
    languages: { 'sq-AL': SITE_URL },
    types: {
      'application/rss+xml': [{ url: '/rss.xml', title: 'Radio Fontana - RSS Feed' }],
      'application/atom+xml': [{ url: '/atom.xml', title: 'Radio Fontana - Atom Feed' }],
    },
  },
  other: {
    'geo.region': 'XK-PE',
    'geo.placename': 'Istog, Kosovë',
    'geo.position': '42.7833;20.4833',
    'ICBM': '42.7833, 20.4833',
    'apple-mobile-web-app-title': SITE_NAME,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

// Global JSON-LD schemas injected on every page
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': ['NewsMediaOrganization', 'Organization'],
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: 'RTV Fontana',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    '@id': `${SITE_URL}/#logo`,
    url: OG_IMAGE,
    width: 400,
    height: 400,
    caption: 'Radio Fontana',
  },
  image: { '@id': `${SITE_URL}/#logo` },
  sameAs: [
    'https://www.facebook.com/rtvfontanalive',
    'https://www.instagram.com/rtvfontana/',
    'https://www.youtube.com/@RTVFontana',
    'https://www.tiktok.com/@rtvfontanalive',
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rruga "Ibrahim Rugova" Nr. 56',
    addressLocality: 'Istog',
    addressRegion: 'Pejë',
    addressCountry: 'XK',
    postalCode: '50250',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+383-44-150-027',
      email: 'rtvfontana@gmail.com',
      contactType: 'editorial',
      availableLanguage: 'Albanian',
    },
    {
      '@type': 'ContactPoint',
      telephone: '+383-44-141-294',
      contactType: 'customer service',
      availableLanguage: 'Albanian',
    },
  ],
  foundingDate: '2010',
  knowsAbout: ['Radio broadcasting', 'News', 'Local news Kosovo', 'Albanian music'],
  areaServed: [
    { '@type': 'City', name: 'Istog', containedInPlace: { '@type': 'Country', name: 'Kosovo' } },
  ],
  numberOfEmployees: { '@type': 'QuantitativeValue', value: 10 },
};

const radioStationSchema = {
  '@context': 'https://schema.org',
  '@type': 'RadioStation',
  '@id': `${SITE_URL}/#radiostation`,
  name: 'Radio Fontana 98.8 FM',
  alternateName: ['RTV Fontana', 'Radio Fontana Istog'],
  url: SITE_URL,
  broadcastFrequency: {
    '@type': 'BroadcastFrequencySpecification',
    broadcastFrequencyValue: '98.8',
    broadcastSignalModulation: 'FM',
    broadcastSubChannel: 'Stereo',
  },
  broadcastDisplayName: 'Radio Fontana',
  broadcastServiceTier: 'Free',
  broadcaster: { '@id': `${SITE_URL}/#organization` },
  logo: OG_IMAGE,
  image: OG_IMAGE,
  sameAs: ['https://www.facebook.com/rtvfontanalive'],
  areaServed: { '@type': 'Country', name: 'Kosovo' },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  description: 'Radio Fontana 98.8 FM, lajme dhe muzikë shqip nga Istog, Kosovë',
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'sq-AL',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/lajme/?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq" className={geist.className} suppressHydrationWarning>
      <head>
        {/* Preconnect to external origins for performance */}
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="preconnect" href="https://live.radiostreaming.al" />
        <link rel="dns-prefetch" href="https://live.radiostreaming.al" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        {/* Hreflang */}
        <link rel="alternate" hrefLang="sq-AL" href={SITE_URL} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />
        {/* Global JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(radioStationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9D4QPTBGCQ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9D4QPTBGCQ');
          `}
        </Script>
        {/* Skip to main content for accessibility + SEO */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-red-600 focus:text-white focus:rounded-lg focus:font-semibold"
        >
          Kaло tek përmbajtja kryesore
        </a>
        <AudioPlayerProvider>
          <Navbar />
          <main id="main-content" className="flex-1 pb-24 sm:pb-28">{children}</main>
          <Footer />
          <CookieConsentBanner />
          <RadioPlayer />
        </AudioPlayerProvider>
      </body>
    </html>
  );
}
