import { createClient } from 'next-sanity';
import { env } from './env';

const baseConfig = {
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
  perspective: 'published' as const,
};

// Read-mostly client optimized for production rendering speed.
export const readClient = createClient({
  ...baseConfig,
  useCdn: true,
  stega: false,
});

// Non-CDN client when freshest data is needed.
export const liveClient = createClient({
  ...baseConfig,
  useCdn: false,
  stega: false,
});

// Backward-compatible export for existing imports.
export const client = readClient;
