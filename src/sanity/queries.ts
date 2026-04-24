/** GROQ query that maps a Sanity post document to the Article type */
export const ARTICLES_QUERY = `
  *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))] | order(publishedAt desc) [0...$limit] {
    "id": _id,
    "slug": slug.current,
    title,
    excerpt,
    "readMinutes": select(
      length(coalesce(excerpt, "")) > 420 => 3,
      length(coalesce(excerpt, "")) > 220 => 2,
      1
    ),
    "category": coalesce(category->title, "Politikë"),
    "author": coalesce(author->name, "Radio Fontana"),
    publishedAt,
    "featured": coalesce(featured, false),
    "breaking": coalesce(breaking, false),
    "tags": coalesce(tags, etiketat, []),
    "imageUrl": coalesce(mainImage.asset->url, "/logortvfontana.jpg")
  }
`;

export const ARTICLE_SLUGS_QUERY = `
  *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))] {
    "slug": slug.current
  }
`;

export const ARTICLE_BY_SLUG_QUERY = `
  *[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    "id": _id,
    "slug": slug.current,
    title,
    excerpt,
    content,
    "category": coalesce(category->title, "Politikë"),
    "author": coalesce(author->name, "Radio Fontana"),
    publishedAt,
    "featured": coalesce(featured, false),
    "breaking": coalesce(breaking, false),
    "tags": coalesce(tags, etiketat, []),
    "imageUrl": coalesce(mainImage.asset->url, "/logortvfontana.jpg")
  }
`;
