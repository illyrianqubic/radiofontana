import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RadioPlayer from '@/components/layout/RadioPlayer';
import CookieConsentBanner from '@/components/layout/CookieConsentBanner';
import { AudioPlayerProvider } from '@/lib/AudioPlayerContext';
import { fetchSiteSettings } from '@/sanity/siteSettings';

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Wire social + stream URLs from Sanity siteSettings (audit P3-L10).
  const settings = await fetchSiteSettings();
  const socialSameAs = [
    settings.facebookUrl,
    settings.instagramUrl,
    settings.youtubeUrl,
    settings.tiktokUrl,
  ];
  const orgSchemaWithSocial = { ...orgSchema, sameAs: socialSameAs };
  const radioSchemaWithSocial = { ...radioStationSchema, sameAs: [settings.facebookUrl] };
  return (
    <html lang="sq" className={geist.className} suppressHydrationWarning>
      <head>
        {/* Preconnect to external origins for performance */}
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        {/* Stream is on :8010 — that's a separate origin from :443, so preconnect explicitly. */}
        <link rel="preconnect" href="https://live.radiostreaming.al:8010" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://live.radiostreaming.al:8010" />
        <link rel="dns-prefetch" href="https://live.radiostreaming.al" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        {/* Hreflang */}
        <link rel="alternate" hrefLang="sq-AL" href={SITE_URL} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />
        {/* Global JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchemaWithSocial) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(radioSchemaWithSocial) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        {/* GDPR: set Consent Mode v2 defaults to DENIED before GA loads.
            CookieConsentBanner calls gtag('consent','update', ...) once the
            user accepts. Without acceptance, GA collects no identifiable
            data (storage denied, ads denied). */}
        <Script id="gtag-consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied',
              'functionality_storage': 'denied',
              'personalization_storage': 'denied',
              'security_storage': 'granted',
              'wait_for_update': 500
            });
            try {
              if (window.localStorage.getItem('rf_cookie_consent') === 'accepted') {
                gtag('consent', 'update', {
                  'ad_storage': 'granted',
                  'ad_user_data': 'granted',
                  'ad_personalization': 'granted',
                  'analytics_storage': 'granted',
                  'functionality_storage': 'granted',
                  'personalization_storage': 'granted'
                });
              }
            } catch (e) {}
          `}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9D4QPTBGCQ"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9D4QPTBGCQ', { 'anonymize_ip': true });
          `}
        </Script>
        {/* Skip to main content for accessibility + SEO (audit P3-M7) */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[1000] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-red-600 focus:text-white focus:rounded-lg focus:font-semibold focus:shadow-lg"
        >
          Kalo te përmbajtja
        </a>
        <AudioPlayerProvider streamUrl={settings.radioStreamUrl}>
          <Navbar />
          <main id="main" className="flex-1 pb-24 sm:pb-28">{children}</main>
          <Footer
            facebookUrl={settings.facebookUrl}
            instagramUrl={settings.instagramUrl}
            youtubeUrl={settings.youtubeUrl}
            tiktokUrl={settings.tiktokUrl}
          />
          <CookieConsentBanner />
          <RadioPlayer />
        </AudioPlayerProvider>
      </body>
    </html>
  );
}
