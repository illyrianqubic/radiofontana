// Custom Next.js image loader for the Sanity image CDN.
//
// With `output: 'export'`, the built-in Next.js image optimizer does not run,
// so without a custom loader every <Image> ships the original asset (often
// multi-MB JPEG/PNG straight from cdn.sanity.io). This loader rewrites any
// Sanity image URL with width / format / quality params so the CDN serves a
// resized WebP, while passing through non-Sanity URLs (e.g. /logortvfontana.jpg
// from /public, or any other origin) untouched.
//
// Usage is wired via next.config.ts:
//   images.loader = 'custom'
//   images.loaderFile = './src/lib/sanityImageLoader.ts'
//
// See: https://nextjs.org/docs/app/api-reference/components/image#loaderfile

interface ImageLoaderArgs {
  src: string;
  width: number;
  quality?: number;
}

export default function sanityImageLoader({ src, width, quality }: ImageLoaderArgs): string {
  // Local public assets (e.g. /logortvfontana.jpg) — let the browser fetch
  // them directly. Same for relative paths during SSR.
  if (!src || src.startsWith('/')) {
    return src;
  }

  // Only rewrite Sanity CDN URLs. Anything else (Google Tag Manager pixel,
  // OG fallback image, etc.) is returned as-is.
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return src;
  }

  const isSanity = url.hostname === 'cdn.sanity.io' || url.hostname.endsWith('.sanity.io');
  if (!isSanity) {
    return src;
  }

  const q = Math.round(Math.max(1, Math.min(100, quality ?? 75)));
  const w = Math.round(Math.max(1, width));

  // Reset params we want to control deterministically. Keep any fit/crop the
  // caller may have already set (e.g. fit=crop with a focal point).
  url.searchParams.set('w', String(w));
  url.searchParams.set('q', String(q));
  url.searchParams.set('fm', 'webp');
  url.searchParams.set('auto', 'format');
  if (!url.searchParams.has('fit')) {
    url.searchParams.set('fit', 'max');
  }

  return url.toString();
}
