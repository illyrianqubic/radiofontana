import { Metadata } from 'next';
import HomeClient from './HomeClient';
import { readClient } from '@/sanity/client';
import { ARTICLES_QUERY, FEATURED_BREAKING_QUERY } from '@/sanity/queries';
import { Article } from '@/lib/types';

const SITE_URL = 'https://radiofontana.org';

export const metadata: Metadata = {
  title: 'Radio Fontana 98.8 FM | Radio Shqip Live nga Kosova',
  description:
    'Radio Fontana 98.8 FM, lajmet e fundit nga Istog dhe Kosova. Politikë, sport, teknologji, showbiz. Dëgjo live 24 orë në ditë.',
  keywords: [
    'Radio Fontana', 'radio shqip', 'radio kosovë', '98.8 FM', 'lajme istog',
    'lajme kosovë', 'radio live', 'rtv fontana', 'lajme shqip online',
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: 'Radio Fontana 98.8 FM | Radio Shqip Live nga Kosova',
    description:
      'Radio Fontana 98.8 FM, lajmet e fundit nga Istog dhe Kosova. Dëgjo live 24 orë.',
    images: [{ url: `${SITE_URL}/logortvfontana.jpg`, width: 1200, height: 630, alt: 'Radio Fontana 98.8 FM' }],
  },
};

async function fetchHomeArticles(): Promise<Article[]> {
  try {
    const [pinned, latest] = await Promise.all([
      readClient.fetch<Article[]>(FEATURED_BREAKING_QUERY, {}, { next: { revalidate: 300 } }),
      readClient.fetch<Article[]>(ARTICLES_QUERY, { limit: 24 }, { next: { revalidate: 300 } }),
    ]);
    const pinnedSafe = Array.isArray(pinned) ? pinned : [];
    const latestSafe = Array.isArray(latest) ? latest : [];
    const pinnedIds = new Set(pinnedSafe.map((a) => a.id));
    return [...pinnedSafe, ...latestSafe.filter((a) => !pinnedIds.has(a.id))];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const articles = await fetchHomeArticles();

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'RadioStation'],
    '@id': `${SITE_URL}/#localbusiness`,
    name: 'Radio Fontana 98.8 FM',
    alternateName: 'RTV Fontana',
    url: SITE_URL,
    telephone: '+383-44-150-027',
    email: 'rtvfontana@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rruga "Ibrahim Rugova" Nr. 56',
      addressLocality: 'Istog',
      addressRegion: 'Pejë',
      addressCountry: 'XK',
      postalCode: '50250',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 42.7833,
      longitude: 20.4833,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '20:00',
    },
    image: `${SITE_URL}/logortvfontana.jpg`,
    logo: `${SITE_URL}/logortvfontana.jpg`,
    priceRange: 'Free',
    currenciesAccepted: 'EUR',
    broadcastFrequency: '98.8 FM',
    areaServed: { '@type': 'Country', name: 'Kosovo' },
    sameAs: [
      'https://www.facebook.com/rtvfontanalive',
      'https://www.instagram.com/rtvfontana/',
      'https://www.youtube.com/@RTVFontana',
      'https://www.tiktok.com/@rtvfontanalive',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <HomeClient articles={articles} />
    </>
  );
}
