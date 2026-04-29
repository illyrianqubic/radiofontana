import type { MetadataRoute } from 'next';
import { readClient } from '@/sanity/client';

export const dynamic = 'force-static';

const SITE_URL = 'https://radiofontana.org';

// Hardcoded modification dates for static pages — bump only when the page
// content actually changes (audit P1-M4). Build time is *not* content time.
const STATIC_PAGE_MTIME = new Date('2026-04-29T00:00:00Z');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let articleEntries: MetadataRoute.Sitemap = [];
  let latestArticleUpdate: Date = STATIC_PAGE_MTIME;
  try {
    const articles = await readClient.fetch<
      Array<{ slug: string; publishedAt: string; _updatedAt: string }>
    >(
      `*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]
       | order(publishedAt desc) {
         "slug": slug.current,
         publishedAt,
         _updatedAt
       }`,
      {},
      { next: { revalidate: 300 } },
    );
    const list = Array.isArray(articles) ? articles : [];
    articleEntries = list.map((a) => ({
      // Trailing slash to match `trailingSlash: true` canonical (audit P1-M5).
      url: `${SITE_URL}/lajme/${a.slug}/`,
      lastModified: new Date(a._updatedAt ?? a.publishedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
    if (list.length > 0) {
      latestArticleUpdate = new Date(list[0]._updatedAt ?? list[0].publishedAt);
    }
  } catch {
    // Build without article entries on Sanity failure
  }

  // Home and listing reflect the most-recent article update, not the build time.
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,                  lastModified: latestArticleUpdate, changeFrequency: 'hourly',  priority: 1.0 },
    { url: `${SITE_URL}/lajme/`,            lastModified: latestArticleUpdate, changeFrequency: 'hourly',  priority: 0.9 },
    { url: `${SITE_URL}/live/`,             lastModified: STATIC_PAGE_MTIME,   changeFrequency: 'daily',   priority: 0.8 },
    { url: `${SITE_URL}/kontakt/`,          lastModified: STATIC_PAGE_MTIME,   changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/rreth-nesh/`,       lastModified: STATIC_PAGE_MTIME,   changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${SITE_URL}/privacy/`,          lastModified: STATIC_PAGE_MTIME,   changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${SITE_URL}/terms/`,            lastModified: STATIC_PAGE_MTIME,   changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${SITE_URL}/cookies/`,          lastModified: STATIC_PAGE_MTIME,   changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${SITE_URL}/gdpr/`,             lastModified: STATIC_PAGE_MTIME,   changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${SITE_URL}/disclaimer/`,       lastModified: STATIC_PAGE_MTIME,   changeFrequency: 'yearly',  priority: 0.2 },
  ];

  return [...staticPages, ...articleEntries];
}
