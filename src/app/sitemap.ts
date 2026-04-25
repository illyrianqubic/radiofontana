import type { MetadataRoute } from 'next';
import { readClient } from '@/sanity/client';

export const dynamic = 'force-static';

const SITE_URL = 'https://radiofontana.org';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL,                    lastModified: now, changeFrequency: 'hourly',  priority: 1.0 },
    { url: `${SITE_URL}/lajme`,         lastModified: now, changeFrequency: 'hourly',  priority: 0.9 },
    { url: `${SITE_URL}/live`,          lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${SITE_URL}/kontakt`,       lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/privacy`,       lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${SITE_URL}/terms`,         lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${SITE_URL}/cookies`,       lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${SITE_URL}/gdpr`,          lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${SITE_URL}/disclaimer`,    lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
  ];

  let articleEntries: MetadataRoute.Sitemap = [];
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
    articleEntries = (Array.isArray(articles) ? articles : []).map((a) => ({
      url: `${SITE_URL}/lajme/${a.slug}`,
      lastModified: new Date(a._updatedAt ?? a.publishedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch {
    // Build without article entries on Sanity failure
  }

  return [...staticPages, ...articleEntries];
}
