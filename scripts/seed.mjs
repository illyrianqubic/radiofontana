/**
 * Sanity seed script — adds 6 categories + 1 author.
 * Usage: node scripts/seed.mjs
 *
 * Uses the Sanity CLI auth token stored in ~/.config/sanity/config.json
 * (same account that owns the project), so no extra API token needed.
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

// ── Read CLI auth token ──────────────────────────────────────────────────────
const configPath = join(homedir(), '.config', 'sanity', 'config.json');
const { authToken } = JSON.parse(readFileSync(configPath, 'utf8'));

const client = createClient({
  projectId: 'ksakxvtt',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: authToken,
  useCdn: false,
});

// ── Data ─────────────────────────────────────────────────────────────────────
const categories = [
  { title: 'Lajme',       slug: 'lajme',       color: 'bg-blue-600'   },
  { title: 'Sport',       slug: 'sport',       color: 'bg-green-600'  },
  { title: 'Teknologji',  slug: 'teknologji',  color: 'bg-purple-600' },
  { title: 'Showbiz',     slug: 'showbiz',     color: 'bg-pink-600'   },
  { title: 'Shëndetësi',  slug: 'shendetesi',  color: 'bg-red-600'    },
  { title: 'Nga Bota',    slug: 'nga-bota',    color: 'bg-yellow-600' },
];

const author = {
  name: 'Qeta Freskim',
  role: 'Redaktore',
  // bio as portable text block
  bio: [
    {
      _type: 'block',
      _key: 'bio-block',
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: 'bio-span', text: 'Redaktore në Radio Fontana', marks: [] }],
    },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────
async function upsertCategory(cat) {
  // Check if a category with this slug already exists
  const existing = await client.fetch(
    `*[_type == "category" && slug.current == $slug][0]._id`,
    { slug: cat.slug }
  );

  const doc = {
    _type: 'category',
    title: cat.title,
    slug: { _type: 'slug', current: cat.slug },
    color: cat.color,
  };

  if (existing) {
    console.log(`  ↻ Updating category "${cat.title}" (${existing})`);
    return client.patch(existing).set(doc).commit();
  } else {
    console.log(`  + Creating category "${cat.title}"`);
    return client.create(doc);
  }
}

async function upsertAuthor(a) {
  const existing = await client.fetch(
    `*[_type == "author" && name == $name][0]._id`,
    { name: a.name }
  );

  const doc = {
    _type: 'author',
    name: a.name,
    role: a.role,
    bio: a.bio,
  };

  if (existing) {
    console.log(`  ↻ Updating author "${a.name}" (${existing})`);
    return client.patch(existing).set(doc).commit();
  } else {
    console.log(`  + Creating author "${a.name}"`);
    return client.create(doc);
  }
}

// ── Run ───────────────────────────────────────────────────────────────────────
console.log('\nSeeding Sanity (project: ksakxvtt / dataset: production)\n');

console.log('Categories:');
for (const cat of categories) {
  await upsertCategory(cat);
}

console.log('\nAuthors:');
await upsertAuthor(author);

console.log('\n✓ Seeding complete.\n');
