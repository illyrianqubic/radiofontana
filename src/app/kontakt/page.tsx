import type { Metadata } from 'next';
import KontaktClient from './KontaktClient';

const SITE_URL = 'https://radiofontana.org';

export const metadata: Metadata = {
  title: 'Na Kontaktoni | Radio Fontana 98.8 FM',
  description:
    'Na kontaktoni për reklama, lajme ose pyetje. Studio e Radio Fontana — Rruga Ibrahim Rugova Nr. 56, Istog, Kosovë. Tel: +383 44 150 027.',
  keywords: [
    'kontakt radio fontana', 'reklama radio kosovë', 'studio radio istog',
    'rtvfontana@gmail.com', 'Radio Fontana adresa', 'kontakt media kosovë',
  ],
  alternates: {
    canonical: `${SITE_URL}/kontakt`,
  },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/kontakt`,
    title: 'Na Kontaktoni | Radio Fontana 98.8 FM',
    description: 'Kontaktoni Radio Fontana — studio Istog, Kosovë. Tel: +383 44 150 027.',
    images: [{ url: `${SITE_URL}/logortvfontana.jpg`, width: 1200, height: 630, alt: 'Radio Fontana - Kontakt' }],
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#localbusiness`,
  name: 'Radio Fontana 98.8 FM',
  url: SITE_URL,
  telephone: ['+383-44-150-027', '+383-44-141-294'],
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
};

export default function KontaktPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <KontaktClient />
    </>
  );
}
