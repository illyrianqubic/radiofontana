import { defineConfig, buildLegacyTheme } from 'sanity';
import { structureTool } from 'sanity/structure';
import { Flame, Star, Radio as RadioIcon, Newspaper } from 'lucide-react';
import { schemaTypes } from './src/sanity/schemaTypes';
import { DeletePostAction } from './src/sanity/DeletePostAction';
import { PostListWithDelete } from './src/sanity/PostListWithDelete';

const BRAND_RED = '#DC2626';
const BRAND_RED_DARK = '#B91C1C';
const BRAND_RED_LIGHT = '#EF4444';

// ── Legacy theme ──────────────────────────────────────────────────────────────
// Sanity's legacy variable system (typed subset): brand accents, focus ring,
// semantic buttons and state colors are themed for the whole studio.
const theme = buildLegacyTheme({
  // Brand
  '--brand-primary': BRAND_RED,
  '--focus-color': BRAND_RED,

  // Semantic buttons
  '--default-button-color': '#374151',
  '--default-button-primary-color': BRAND_RED,
  '--default-button-success-color': '#16a34a',
  '--default-button-warning-color': '#ca8a04',
  '--default-button-danger-color': BRAND_RED,

  // State colors (validation, badges, chips)
  '--state-success-color': '#16a34a',
  '--state-info-color': '#2563eb',
  '--state-warning-color': '#ca8a04',
  '--state-danger-color': BRAND_RED,
});

// ── Document badges ───────────────────────────────────────────────────────────
// Premium touch: colored status chips on every row of the article list.
const BreakingBadge = (props: {
  draft?: { breaking?: boolean; _type?: string } | null;
  published?: { breaking?: boolean; _type?: string } | null;
}) => {
  const doc = props.draft ?? props.published;
  if (doc?._type !== 'post' || !doc.breaking) return null;
  return {
    label: 'Lajm i fundit',
    title: 'Ky artikull shfaqet si Lajm i fundit në faqe',
    color: 'danger' as const,
    icon: Flame,
  };
};

const FeaturedBadge = (props: {
  draft?: { featured?: boolean; _type?: string } | null;
  published?: { featured?: boolean; _type?: string } | null;
}) => {
  const doc = props.draft ?? props.published;
  if (doc?._type !== 'post' || !doc.featured) return null;
  return {
    label: 'E spikatur',
    title: 'Ky artikull është i spikatur në ballinë',
    color: 'warning' as const,
    icon: Star,
  };
};

// ── Logo ──────────────────────────────────────────────────────────────────────
const StudioLogo = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '0 8px',
      userSelect: 'none',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        borderRadius: 8,
        background: `linear-gradient(135deg, ${BRAND_RED_LIGHT}, ${BRAND_RED_DARK})`,
        boxShadow: '0 2px 8px rgba(220, 38, 38, 0.35)',
        flexShrink: 0,
      }}
    >
      <RadioIcon size={16} color="#fff" strokeWidth={2.5} />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
      <span
        style={{
          fontWeight: 800,
          fontSize: 13,
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap',
        }}
      >
        Radio Fontana
      </span>
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          opacity: 0.55,
          whiteSpace: 'nowrap',
        }}
      >
        Studio
      </span>
    </div>
  </div>
);

export default defineConfig({
  basePath: '/studio',
  name: 'radiofontana',
  title: 'Radio Fontana CMS',
  projectId: 'ksakxvtt',
  dataset: 'production',
  theme,
  // Disable Content Releases — restores the traditional "Publish" button on
  // each document. Content Releases (multi-doc scheduling workflow) is enabled
  // by default in Sanity Studio v3.75+ / v5 but adds unnecessary complexity
  // for a small news CMS where direct draft → publish is the desired workflow.
  releases: {
    enabled: false,
  },
  // Status chips (Breaking / Featured) on document list rows. The badge
  // components themselves no-op for non-post documents.
  document: {
    badges: (badges) => [...badges, BreakingBadge, FeaturedBadge],
    actions: (prev, context) => {
      if (context.schemaType !== 'post') return prev;
      const isDraft = context.versionType === 'draft';
      if (!isDraft) {
        // Published: show only Delete
        return [DeletePostAction];
      }
      // Draft: show Delete + all default actions (publish, unpublish, etc.)
      return [DeletePostAction, ...prev];
    },
  },
  // Branded top-left logo in the studio navbar.
  studio: {
    components: {
      logo: StudioLogo,
    },
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Përmbajtja')
          .items([
            // "Artikujt dhe Përmbajtja" — custom list view with a visible "−"
            // delete button on every row so authors can remove articles in
            // one click without opening each document.
            S.listItem()
              .title('Artikujt dhe Përmbajtja')
              .icon(() => <Newspaper size={18} />)
              .child(S.component(PostListWithDelete).title('Artikujt dhe Përmbajtja')),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
