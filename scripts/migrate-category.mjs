import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const configPath = join(homedir(), '.config', 'sanity', 'config.json');
const { authToken } = JSON.parse(readFileSync(configPath, 'utf8'));

const client = createClient({
  projectId: 'ksakxvtt',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: authToken,
  useCdn: false,
});

const id = await client.fetch(
  `*[_type == "category" && slug.current == "lajme"][0]._id`
);

if (!id) {
  console.log('No category with slug "lajme" found — nothing to migrate.');
  process.exit(0);
}

console.log('Found category id:', id);

const result = await client
  .patch(id)
  .set({
    title: 'Politikë',
    slug: { _type: 'slug', current: 'politike' },
  })
  .commit();

console.log('Updated:', result.title, '/', result.slug.current);
