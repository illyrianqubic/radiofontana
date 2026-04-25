import { Metadata } from 'next';
import LivePlayer from '@/components/live/LivePlayer';

export const metadata: Metadata = {
  title: 'Dëgjo Radio Fontana Live 98.8 FM Online',
  description:
    'Dëgjo Radio Fontana 98.8 FM live online pa ndërprerje. Muzikë shqip, lajme dhe programe të drejtpërdrejta nga Istog, Kosovë.',
  keywords: [
    'radio fontana live', 'dëgjo radio shqip online', 'radio kosovë live', '98.8 FM live',
    'streaming radio shqip', 'radio online kosovë', 'radio fontana stream',
  ],
  alternates: {
    canonical: 'https://radiofontana.org/live',
  },
  openGraph: {
    type: 'website',
    url: 'https://radiofontana.org/live',
    title: 'Dëgjo Radio Fontana Live 98.8 FM Online',
    description: 'Dëgjo Radio Fontana 98.8 FM live online. Muzikë shqip dhe lajme 24 orë.',
    images: [{ url: 'https://radiofontana.org/logortvfontana.jpg', width: 1200, height: 630, alt: 'Radio Fontana Live' }],
  },
};

export default function LivePage() {
  return <LivePlayer />;
}
