'use client';

import { useEffect } from 'react';
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
          minHeight: '100dvh',
          width: '100%',
          padding: '1rem',
          textAlign: 'center',
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
  useEffect(() => {
    // Freeze parent page scroll so only the studio scrolls.
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Allow Sanity Studio to use its own dark theme.
    // The root layout forces color-scheme: only light, which breaks the
    // studio's dark UI on mobile (and makes it hard to read).
    const html = document.documentElement;
    const originalHtmlScheme = html.style.colorScheme;
    html.style.colorScheme = '';

    const body = document.body;
    const originalBodyScheme = body.style.colorScheme;
    body.style.colorScheme = '';

    return () => {
      document.body.style.overflow = originalOverflow;
      html.style.colorScheme = originalHtmlScheme;
      body.style.colorScheme = originalBodyScheme;
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        height: '100dvh',
        width: '100%',
        zIndex: 50,
        overflow: 'hidden',
      }}
    >
      <StudioWithConfig />
    </div>
  );
}
