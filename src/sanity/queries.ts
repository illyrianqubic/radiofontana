/** GROQ query that maps a Sanity post document to the Article type */
export const ARTICLES_QUERY = `
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) [0...$limit] {
    "id": _id,
    "slug": slug.current,
    title,
    excerpt,
    content,
    "category": coalesce(category->title, "Lajme"),
    "author": coalesce(author->name, "Radio Fontana"),
    publishedAt,
    "featured": coalesce(featured, false),
    "breaking": coalesce(breaking, false),
    "tags": coalesce(tags, []),
    "imageUrl": coalesce(mainImage.asset->url, "/logortvfontana.jpg")
  }
`;

export const ARTICLE_SLUGS_QUERY = `
  *[_type == "post" && defined(slug.current)] {
    "slug": slug.current
  }
`;

export const ARTICLE_BY_SLUG_QUERY = `
  *[_type == "post" && slug.current == $slug][0] {
    "id": _id,
    "slug": slug.current,
    title,
    excerpt,
    content,
    "category": coalesce(category->title, "Lajme"),
    "author": coalesce(author->name, "Radio Fontana"),
    publishedAt,
    "featured": coalesce(featured, false),
    "breaking": coalesce(breaking, false),
    "tags": coalesce(tags, []),
    "imageUrl": coalesce(mainImage.asset->url, "/logortvfontana.jpg")
  }
`;

export const LIVESTREAM_QUERY = `
  *[_type == "liveStream"][0] {
    isLive,
    title,
    facebookUrl,
    youtubeUrl,
    description
  }
`;
