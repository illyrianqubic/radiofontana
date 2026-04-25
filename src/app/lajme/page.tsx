import { Metadata } from 'next';
import { Suspense } from 'react';
import LajmeClient from './LajmeClient';

const SITE_URL = 'https://radiofontana.org';

export const metadata: Metadata = {
  title: 'Lajmet e Fundit | Radio Fontana 98.8 FM',
  description:
    'Lajmet e fundit nga Istog, Kosova dhe bota. Politikë, sport, teknologji, showbiz, shëndetësi dhe biznes, të gjitha tek Radio Fontana.',
  keywords: [
    'lajme kosovë', 'lajme istog', 'lajme shqip', 'lajme politike', 'lajme sport',
    'radio fontana lajme', 'lajme sot', 'lajme fundit',
  ],
  alternates: {
    canonical: `${SITE_URL}/lajme`,
  },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/lajme`,
    title: 'Lajmet e Fundit | Radio Fontana 98.8 FM',
    description:
      'Lajmet e fundit nga Istog, Kosova dhe bota. Politikë, sport, teknologji, showbiz dhe më shumë.',
    images: [{ url: `${SITE_URL}/logortvfontana.jpg`, width: 1200, height: 630, alt: 'Radio Fontana - Lajme' }],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Kryefaqja', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Lajme', item: `${SITE_URL}/lajme` },
  ],
};

export default function LajmePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <LajmeClient />
      </Suspense>
    </>
  );
}
