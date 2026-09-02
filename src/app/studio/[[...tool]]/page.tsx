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
  // NOTE: keep user-scalable + a generous maximum so editors can pinch-zoom to
  // recover on any element that is slightly wider than the viewport (Sanity's
  // auth/login and some legacy panes occasionally overflow the safe area on
  // small phones). maximumScale:1 / userScalable:false made the embedded studio
  // feel "non-responsive" on mobile because overflow was un-recoverable.
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export default function StudioPage() {
  return <StudioClient />;
}
