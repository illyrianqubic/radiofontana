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

const MOBILE_CSS = `
  /* ════════════════════════════════════════════════════════
     Sanity Studio Mobile & Polish Overrides
     ════════════════════════════════════════════════════════ */

  /* ════════════════════════════════════════════════════════
     Readability (ALL screen sizes) — bigger, clearer text for
     news editors. Targets Sanity's data-ui hooks so the sizes
     actually override the built-in design-system tokens.
     ════════════════════════════════════════════════════════ */

  /* Base wrapper size — everything that inherits gets the bump */
  .sanity-mobile-studio {
    font-size: 16px;
  }

  /* Field labels & fieldset legends: big, bold, high-contrast */
  .sanity-mobile-studio [data-ui="Field"] label,
  .sanity-mobile-studio [data-ui="Fieldset"] legend {
    font-size: 16px !important;
    font-weight: 700 !important;
    letter-spacing: 0.01em;
  }

  /* Helper / description text under fields */
  .sanity-mobile-studio [data-ui="FormField"] p,
  .sanity-mobile-studio [data-testid="field-description"],
  .sanity-mobile-studio [data-ui="Field"] > div > p {
    font-size: 14px !important;
    line-height: 1.5 !important;
  }

  /* All text inputs, textareas, selects & rich-text editors */
  .sanity-mobile-studio input,
  .sanity-mobile-studio textarea,
  .sanity-mobile-studio select,
  .sanity-mobile-studio [contenteditable="true"] {
    font-size: 16px !important;
    line-height: 1.5 !important;
  }

  /* Article body (Portable Text) editor: comfortable writing size */
  .sanity-mobile-studio [data-testid="pt-editor"] [contenteditable="true"],
  .sanity-mobile-studio [data-ui="TextInput"] [contenteditable="true"] {
    font-size: 17px !important;
    line-height: 1.65 !important;
  }

  /* Buttons: clearer labels */
  .sanity-mobile-studio [data-ui="Button"] {
    font-size: 15px !important;
    font-weight: 600 !important;
  }

  /* Pane / document titles */
  .sanity-mobile-studio [data-ui="PaneHeader"] h1,
  .sanity-mobile-studio [data-ui="PaneHeader"] h2,
  .sanity-mobile-studio [data-ui="PaneHeader"] [data-ui="PaneTitle"] {
    font-size: 18px !important;
    font-weight: 700 !important;
  }

  /* Sidebar / structure list items */
  .sanity-mobile-studio [data-ui="CollapseItem"],
  .sanity-mobile-studio [data-ui="Link"],
  .sanity-mobile-studio [data-ui="Text"] {
    font-size: 15px !important;
  }

  /* ── Universal: larger tap targets & focus rings ── */
  .sanity-mobile-studio button,
  .sanity-mobile-studio [role="button"],
  .sanity-mobile-studio a {
    min-height: 40px;
    min-width: 40px;
  }

  .sanity-mobile-studio *:focus-visible {
    outline-color: #DC2626 !important;
    outline-width: 2px !important;
    outline-offset: 1px !important;
  }

  /* ── Portable Text: much larger "+" insert button ── */
  .sanity-mobile-studio [data-testid="insert-menu-button"],
  .sanity-mobile-studio button[aria-label*="insert" i],
  .sanity-mobile-studio button[aria-label*="add" i] {
    min-width: 44px !important;
    min-height: 44px !important;
  }

  /* ── Inputs: comfortable height, prevent iOS zoom ── */
  .sanity-mobile-studio input,
  .sanity-mobile-studio textarea,
  .sanity-mobile-studio select {
    min-height: 44px;
  }

  /* ── Buttons: adequate padding ── */
  .sanity-mobile-studio [data-ui="Button"] {
    min-height: 40px;
    padding: 8px 16px;
  }

  /* ── Pane headers: bigger tap area ── */
  .sanity-mobile-studio [data-ui="PaneHeader"] {
    min-height: 52px;
  }

  /* ── Array drag handles ── */
  .sanity-mobile-studio [data-testid="drag-handle"],
  .sanity-mobile-studio [data-ui="DragHandle"] {
    min-width: 44px;
    min-height: 44px;
  }

  /* ── Dialogs / modals ── */
  .sanity-mobile-studio [data-ui="Dialog"] {
    padding: 16px;
  }

  /* ── Form labels ── */
  .sanity-mobile-studio [data-ui="Field"] label,
  .sanity-mobile-studio [data-ui="Fieldset"] legend {
    font-weight: 600;
  }

  /* ════════════════════════════════════════════════════════
     Mobile-only rules (max-width: 768px)
     ════════════════════════════════════════════════════════ */
  @media (max-width: 768px) {
    /* Base font size bump */
    .sanity-mobile-studio {
      font-size: 15px;
    }

    /* All touch targets ≥ 44×44px */
    .sanity-mobile-studio button,
    .sanity-mobile-studio [role="button"],
    .sanity-mobile-studio a {
      min-height: 44px;
      min-width: 44px;
    }

    /* Inputs: larger + stop iOS zoom-on-focus */
    .sanity-mobile-studio input,
    .sanity-mobile-studio textarea,
    .sanity-mobile-studio select {
      min-height: 48px;
      font-size: 16px !important;
    }

    /* PT insert button: extra large on mobile */
    .sanity-mobile-studio [data-testid="insert-menu-button"],
    .sanity-mobile-studio button[aria-label*="insert" i],
    .sanity-mobile-studio button[aria-label*="add" i] {
      min-width: 52px !important;
      min-height: 52px !important;
    }

    /* Sidebar nav items */
    .sanity-mobile-studio nav a,
    .sanity-mobile-studio nav button {
      min-height: 48px;
      padding: 12px 16px;
    }

    /* Pane headers */
    .sanity-mobile-studio [data-ui="PaneHeader"] {
      min-height: 56px;
    }

    /* Dialog full-width on mobile */
    .sanity-mobile-studio [data-ui="Dialog"] > div {
      width: 100vw !important;
      max-width: 100vw !important;
      margin: 0 !important;
      border-radius: 0 !important;
    }

    /* Action bar / publish footer: sticky so it never hides behind keyboard */
    .sanity-mobile-studio [data-ui="PaneFooter"],
    .sanity-mobile-studio [data-ui="DocumentPanel"] footer {
      position: sticky !important;
      bottom: 0;
      z-index: 20;
    }

    /* Form labels bigger */
    .sanity-mobile-studio [data-ui="Field"] label,
    .sanity-mobile-studio [data-ui="Fieldset"] legend {
      font-size: 15px;
    }

    /* Spacing: less cramped */
    .sanity-mobile-studio [data-ui="Field"] {
      padding-top: 8px;
      padding-bottom: 8px;
    }

    /* Array items: more breathing room */
    .sanity-mobile-studio [data-ui="ArrayInput"] > div > div {
      padding: 8px 0;
    }
  }
`;

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
      className="sanity-mobile-studio"
      style={{
        position: 'fixed',
        inset: 0,
        height: '100dvh',
        width: '100%',
        zIndex: 50,
        overflow: 'hidden',
      }}
    >
      <style>{MOBILE_CSS}</style>
      <StudioWithConfig />
    </div>
  );
}
