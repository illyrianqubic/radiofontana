'use client';

import dynamic from 'next/dynamic';

// Dynamic import of BOTH the studio component AND sanity.config together.
// This prevents server-side bundling of the Sanity Studio (which needs browser APIs
// and styled-components) during the Next.js static export build.
const StudioWithConfig = dynamic(
  async () => {
    const [{ NextStudio }, { default: config }] = await Promise.all([
      import('next-sanity/studio'),
      import('../../../../sanity.config'),
    ]);
    function SanityStudio() {
      return <NextStudio config={config} />;
    }
    SanityStudio.displayName = 'SanityStudio';
    return SanityStudio;
  },
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          fontFamily: 'sans-serif',
          color: '#666',
          background: '#141416',
        }}
      >
        Duke ngarkuar studion…
      </div>
    ),
  },
);

export default function StudioClient() {
  return <StudioWithConfig />;
}
