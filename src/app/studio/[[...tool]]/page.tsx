// Server component — exports generateStaticParams for the static export build,
// then renders the client-side Studio component.
import type { Viewport } from 'next';
import StudioClient from './StudioClient';

// Generate only the root /studio path in the static export.
// Sanity Studio handles internal navigation client-side.
export function generateStaticParams() {
  return [{ tool: [] }];
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function StudioPage() {
  return <StudioClient />;
}
