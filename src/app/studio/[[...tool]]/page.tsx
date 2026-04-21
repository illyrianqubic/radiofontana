// Server component — exports generateStaticParams for the static export build,
// then renders the client-side Studio component.
import StudioClient from './StudioClient';

// Generate only the root /studio path in the static export.
// Sanity Studio handles internal navigation client-side.
export function generateStaticParams() {
  return [{ tool: [] }];
}

export default function StudioPage() {
  return <StudioClient />;
}
