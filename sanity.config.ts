import { defineConfig, buildLegacyTheme } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './src/sanity/schemaTypes';

const BRAND_RED = '#DC2626';

const theme = buildLegacyTheme({
  '--brand-primary': BRAND_RED,
  '--focus-color': BRAND_RED,
  '--default-button-primary-color': BRAND_RED,
  '--default-button-success-color': '#16a34a',
  '--default-button-warning-color': '#ca8a04',
  '--default-button-danger-color': BRAND_RED,
  '--state-success-color': '#16a34a',
  '--state-info-color': '#2563eb',
  '--state-warning-color': '#ca8a04',
  '--state-danger-color': BRAND_RED,
});

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
  plugins: [
    structureTool(),
    visionTool({ defaultApiVersion: '2024-01-01' }),
  ],
  schema: {
    types: schemaTypes,
  },
});
