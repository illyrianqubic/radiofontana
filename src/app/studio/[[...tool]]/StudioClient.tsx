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
        Duke ngarkuar studionâ¦
      </div>
    ),
  },
);

const MOBILE_CSS = `
  /* ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
     Sanity Studio Mobile & Polish Overrides
     ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */

  /* ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
     Readability (ALL screen sizes) â bigger, clearer text for
     news editors. Targets Sanity's data-ui hooks so the sizes
     actually override the built-in design-system tokens.
     ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */

  /* Base wrapper size â everything that inherits gets the bump */
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

  /* ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
     Layout (desktop): keep the left structure pane narrow â the
     article list "Artikujt dhe PÃ«rmbajtja" (data-pane-index="0").
     Sanity sizes panes with flex, so capping max-width keeps it a
     clean, compact list (never wider than 440px) while the editor
     opens full-width to its right. Mobile keeps Sanity's
     one-pane-at-a-time layout.
     ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */
  @media (min-width: 769px) {
    .sanity-mobile-studio [data-ui="Pane"][data-pane-index="0"] {
      max-width: min(50%, 440px) !important;
    }
  }

  /* ââ Universal: larger tap targets & focus rings ââ */
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

  /* ââ Portable Text: much larger "+" insert button ââ */
  .sanity-mobile-studio [data-testid="insert-menu-button"],
  .sanity-mobile-studio button[aria-label*="insert" i],
  .sanity-mobile-studio button[aria-label*="add" i] {
    min-width: 44px !important;
    min-height: 44px !important;
  }

  /* ââ Inputs: comfortable height, prevent iOS zoom ââ */
  .sanity-mobile-studio input,
  .sanity-mobile-studio textarea,
  .sanity-mobile-studio select {
    min-height: 44px;
  }

  /* ââ Buttons: adequate padding ââ */
  .sanity-mobile-studio [data-ui="Button"] {
    min-height: 40px;
    padding: 8px 16px;
  }

  /* ââ Pane headers: bigger tap area ââ */
  .sanity-mobile-studio [data-ui="PaneHeader"] {
    min-height: 52px;
  }

  /* ââ Array drag handles ââ */
  .sanity-mobile-studio [data-testid="drag-handle"],
  .sanity-mobile-studio [data-ui="DragHandle"] {
    min-width: 44px;
    min-height: 44px;
  }

  /* ââ Dialogs / modals ââ */
  .sanity-mobile-studio [data-ui="Dialog"] {
    padding: 16px;
  }

  /* ââ Form labels ââ */
  .sanity-mobile-studio [data-ui="Field"] label,
  .sanity-mobile-studio [data-ui="Fieldset"] legend {
    font-weight: 600;
  }

  /* ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
     Mobile-only rules (max-width: 768px)
     ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */
  @media (max-width: 768px) {
    /* Base font size bump */
    .sanity-mobile-studio {
      font-size: 15px;
    }

    /* All touch targets â¥ 44Ã44px */
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

  /* ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
     PREMIUM SKIN â Radio Fontana Studio
     Brand-accented, high-contrast, responsive polish layer.
     Uses alpha black/white so it adapts to light AND dark UI.
     ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */

  .sanity-mobile-studio {
    --rf-red: #dc2626;
    --rf-red-light: #ef4444;
    --rf-red-dark: #b91c1c;
    --rf-ease: cubic-bezier(0.22, 0.61, 0.36, 1);
  }

  /* ââ Scrollbars: slim, rounded, brand-tinted ââ */
  .sanity-mobile-studio * {
    scrollbar-width: thin;
    scrollbar-color: rgba(128, 128, 128, 0.35) transparent;
  }
  .sanity-mobile-studio ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  .sanity-mobile-studio ::-webkit-scrollbar-track {
    background: transparent;
  }
  .sanity-mobile-studio ::-webkit-scrollbar-thumb {
    background: rgba(128, 128, 128, 0.3);
    border-radius: 8px;
  }
  .sanity-mobile-studio ::-webkit-scrollbar-thumb:hover {
    background: rgba(220, 38, 38, 0.55);
  }

  /* ââ Pane headers: gradient underline + stronger titles ââ */
  .sanity-mobile-studio [data-ui="PaneHeader"] {
    border-bottom: 1px solid rgba(128, 128, 128, 0.15) !important;
    position: relative;
  }
  .sanity-mobile-studio [data-ui="PaneHeader"]::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 2px;
    background: linear-gradient(90deg, var(--rf-red) 0%, rgba(220, 38, 38, 0) 60%);
    opacity: 0.85;
    pointer-events: none;
  }
  .sanity-mobile-studio [data-ui="PaneHeader"] h1,
  .sanity-mobile-studio [data-ui="PaneHeader"] h2,
  .sanity-mobile-studio [data-ui="PaneHeader"] [data-ui="PaneTitle"] {
    letter-spacing: -0.01em !important;
  }

  /* ââ Structure / list items: rounded, accent bar on selection ââ */
  .sanity-mobile-studio [data-ui="PaneContent"] button,
  .sanity-mobile-studio [data-ui="PaneContent"] a {
    border-radius: 8px !important;
    transition:
      background-color 0.15s var(--rf-ease),
      box-shadow 0.15s var(--rf-ease),
      transform 0.1s var(--rf-ease);
  }
  .sanity-mobile-studio [data-ui="PaneContent"] button:hover,
  .sanity-mobile-studio [data-ui="PaneContent"] a:hover {
    background-color: rgba(128, 128, 128, 0.1) !important;
  }
  .sanity-mobile-studio [data-ui="PaneContent"] [data-selected="true"],
  .sanity-mobile-studio [data-ui="PaneContent"] [aria-current="true"] {
    background-color: rgba(220, 38, 38, 0.12) !important;
    box-shadow: inset 3px 0 0 0 var(--rf-red) !important;
  }
  .sanity-mobile-studio [data-ui="PaneContent"] button:active,
  .sanity-mobile-studio [data-ui="PaneContent"] a:active {
    transform: scale(0.995);
  }

  /* ââ Buttons: primary gets the brand gradient ââ */
  .sanity-mobile-studio [data-ui="Button"][data-tone="primary"] {
    background: linear-gradient(135deg, var(--rf-red-light), var(--rf-red-dark)) !important;
    box-shadow: 0 1px 4px rgba(220, 38, 38, 0.35) !important;
    border: none !important;
    transition:
      box-shadow 0.15s var(--rf-ease),
      transform 0.1s var(--rf-ease) !important;
  }
  .sanity-mobile-studio [data-ui="Button"][data-tone="primary"]:hover {
    box-shadow: 0 3px 10px rgba(220, 38, 38, 0.45) !important;
  }
  .sanity-mobile-studio [data-ui="Button"]:active {
    transform: scale(0.98);
  }

  /* ââ Inputs & editors: rounded, clear focus ring ââ */
  .sanity-mobile-studio input:not([type='checkbox']):not([type='radio']),
  .sanity-mobile-studio textarea,
  .sanity-mobile-studio select {
    border-radius: 8px !important;
    transition:
      border-color 0.15s var(--rf-ease),
      box-shadow 0.15s var(--rf-ease) !important;
  }
  .sanity-mobile-studio input:not([type='checkbox']):not([type='radio']):focus,
  .sanity-mobile-studio textarea:focus,
  .sanity-mobile-studio select:focus,
  .sanity-mobile-studio [contenteditable='true']:focus {
    box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.35) !important;
    outline: 2px solid rgba(220, 38, 38, 0.55) !important;
    outline-offset: 1px;
  }

  /* ââ Document group tabs (PÃ«rmbajtja / Organizimi / Statusi): pills ââ */
  .sanity-mobile-studio [data-ui="GroupTab"],
  .sanity-mobile-studio [role="tablist"] [role="tab"] {
    border-radius: 999px !important;
    transition:
      background-color 0.15s var(--rf-ease),
      box-shadow 0.15s var(--rf-ease) !important;
  }
  .sanity-mobile-studio [data-ui="GroupTab"][aria-selected="true"],
  .sanity-mobile-studio [role="tablist"] [role="tab"][aria-selected="true"] {
    background-color: rgba(220, 38, 38, 0.14) !important;
    box-shadow: inset 0 0 0 1.5px rgba(220, 38, 38, 0.5) !important;
    font-weight: 700 !important;
  }

  /* ââ Status chips & badges: rounded pills ââ */
  .sanity-mobile-studio [data-ui="Badge"],
  .sanity-mobile-studio [data-ui="TextBadge"] {
    border-radius: 999px !important;
    font-weight: 700 !important;
  }

  /* ââ Cards & dialogs: softer, deeper elevation ââ
     NOTE: no overflow:hidden here â the reference-input popover (e.g. the
     category picker) contains its own scroll container, and clipping the
     popover wrapper breaks scrolling inside it. */
  .sanity-mobile-studio [data-ui="Dialog"],
  .sanity-mobile-studio [data-ui="Popover"] > div {
    border-radius: 14px !important;
    box-shadow:
      0 10px 40px rgba(0, 0, 0, 0.18),
      0 2px 8px rgba(0, 0, 0, 0.08) !important;
  }

  /* ââ Preview thumbnails: rounded with depth ââ */
  .sanity-mobile-studio [data-ui="Preview"] img {
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  }

  /* ââ Switches: brand accent when checked ââ */
  .sanity-mobile-studio [role="switch"][aria-checked="true"] {
    background-color: var(--rf-red) !important;
  }

  /* ââ Popover / dialog scroll safety: never clip pickers ââ
     Reference inputs (category, author) and select popovers scroll inside
     their own containers; guarantee they keep overflow scrolling and get
     contained overscroll so the page doesn't rubber-band instead. */
  .sanity-mobile-studio [data-ui="Popover"],
  .sanity-mobile-studio [data-ui="Popover"] [data-ui="ScrollContainer"],
  .sanity-mobile-studio [role="listbox"] {
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
  }

  /*  Touch-friendly scroll for all studio panes 
   Enable momentum scrolling (webkit-overflow-scrolling) on any element
   with overflow: auto / scroll within the studio. This makes lists,
   category trees, and any panes scroll naturally with touchpads and
   touch screens, not just via the scrollbar. 
  .sanity-mobile-studio [data-ui="PaneContent"],
  .sanity-mobile-studio [data-ui="Field"],
  .sanity-mobile-studio .sanity-Pane,
  .sanity-mobile-studio .sanity-StructureList,
  .sanity-mobile-studio .sanity-ScrollArea,
  .sanity-mobile-studio [data-ui="ReferenceInput"] {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }
  .sanity-mobile-studio .sanity-StructureList,
  .sanity-mobile-studio .sanity-ScrollArea {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }

  /* ââ Responsive refinement (tablets & small laptops) ââ */
  @media (max-width: 1024px) {
    .sanity-mobile-studio [data-ui="Field"] {
      padding-top: 6px;
      padding-bottom: 6px;
    }
  }

  /* ââ Responsive refinement (phones) ââ */
  @media (max-width: 768px) {
    /* Restore the existing 44px touch-target rules: drop micro transforms */
    .sanity-mobile-studio [data-ui="Button"] {
      transition: none !important;
    }
    .sanity-mobile-studio [data-ui="PaneContent"] button:active,
    .sanity-mobile-studio [data-ui="PaneContent"] a:active {
      transform: none;
    }

    /* List rows: slightly rounder on touch */
    .sanity-mobile-studio [data-ui="PaneContent"] button,
    .sanity-mobile-studio [data-ui="PaneContent"] a {
      border-radius: 10px !important;
    }

    /* Group tabs scroll horizontally instead of wrapping/cramping */
    .sanity-mobile-studio [role="tablist"] {
      overflow-x: auto;
      scrollbar-width: none;
    }
    .sanity-mobile-studio [role="tablist"]::-webkit-scrollbar {
      display: none;
    }
    .sanity-mobile-studio [data-ui="GroupTab"],
    .sanity-mobile-studio [role="tablist"] [role="tab"] {
      white-space: nowrap;
      flex-shrink: 0;
    }

    /* Dialogs: full-bleed, no rounded corners on phones */
    .sanity-mobile-studio [data-ui="Dialog"] {
      border-radius: 0 !important;
    }
  }

  /* Field action menu: remove copy field, paste field, and add comment */
  .sanity-mobile-studio [data-ui="FieldActionsMenu"],
  .sanity-mobile-studio [data-ui="Field"] [data-testid="field-actions-menu"],
  .sanity-mobile-studio [data-ui="Field"] [aria-label*="Copy" i],
  .sanity-mobile-studio [data-ui="Field"] [aria-label*="Paste" i],
  .sanity-mobile-studio [data-ui="Field"] [aria-label*="comment" i],
  .sanity-mobile-studio [data-ui="Field"] [title*="Copy" i],
  .sanity-mobile-studio [data-ui="Field"] [title*="Paste" i],
  .sanity-mobile-studio [data-ui="Field"] [title*="comment" i] {
    display: none !important;
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
        // Clear the iPhone home-bar / Android gesture area at the bottom so
        // the studio's bottom action bar (Publish / Fshij) isn't clipped
        // under the home indicator on mobile. border-box keeps the padded
        // height within 100dvh (no new overflow introduced).
        boxSizing: 'border-box',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 99999, // above the site shell (Navbar/Footer/RadioPlayer) so
                      // the full-screen studio is never occluded on small screens
        overflow: 'hidden',
      }}
    >
      <style>{MOBILE_CSS}</style>
      <StudioWithConfig />
    </div>
  );
}
