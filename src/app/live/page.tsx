import { Metadata } from 'next';
import LivePlayer from '@/components/live/LivePlayer';


export const metadata: Metadata = {
  title: 'Radio Live',
  description: 'Dëgjoni Radio Fontana live online. 98.8 FM nga Peja, Kosova.',
};

export default function LivePage() {
  return <LivePlayer />;
}
