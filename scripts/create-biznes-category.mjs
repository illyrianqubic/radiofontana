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

const existing = await client.fetch(
  `*[_type == "category" && slug.current == "biznes"][0]._id`
);

if (existing) {
  console.log('Category "Biznes" already exists:', existing);
  process.exit(0);
}

const result = await client.create({
  _type: 'category',
  title: 'Biznes',
  slug: { _type: 'slug', current: 'biznes' },
  color: 'bg-amber-600',
});

console.log('Created category:', result.title, '/', result.slug.current, '—', result._id);
