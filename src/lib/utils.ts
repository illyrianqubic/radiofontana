export function formatAlbanianDate(dateString: string): string {
  const date = new Date(dateString);
  const months = [
    'Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor',
    'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor',
  ];
  const days = ['E Diel', 'E Hënë', 'E Martë', 'E Mërkurë', 'E Enjte', 'E Premte', 'E Shtunë'];
  // Use UTC components so the same string renders on the build server (UTC)
  // and the visitor's browser regardless of local timezone — eliminates
  // hydration mismatches caused by TZ drift.
  return `${days[date.getUTCDay()]}, ${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export function timeAgo(dateString: string): string {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();
  if (diffMs < 0) return 'tani';
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMins < 1) return 'tani';
  if (diffMins < 60) return `${diffMins} minuta më parë`;
  if (diffHours < 24) return `${diffHours} orë më parë`;
  if (diffDays === 1) return 'dje';
  if (diffDays < 7) return `${diffDays} ditë më parë`;
  if (diffWeeks < 5) return `${diffWeeks === 1 ? '1' : diffWeeks} javë më parë`;
  if (diffMonths < 12) return `${diffMonths === 1 ? '1' : diffMonths} muaj më parë`;
  return formatAlbanianDate(dateString);
}

/** Estimated reading time in minutes (avg 200 words/min).
 *  Accepts a plain string or a Portable Text block array. */
export function readTime(content: string | unknown[]): number {
  let text: string;
  if (typeof content === 'string') {
    text = content;
  } else if (Array.isArray(content)) {
    // Extract text from Portable Text blocks
    text = (content as Array<{ _type?: string; children?: Array<{ text?: string }> }>)
      .filter((b) => b._type === 'block')
      .flatMap((b) => (b.children ?? []).map((c) => c.text ?? ''))
      .join(' ');
  } else {
    return 1;
  }
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function optimizeImageUrl(
  imageUrl: string,
  width: number,
  height?: number,
  quality = 80,
): string {
  if (!imageUrl || imageUrl.startsWith('/')) {
    return imageUrl;
  }

  try {
    const url = new URL(imageUrl);
    if (!url.hostname.includes('sanity')) {
      return imageUrl;
    }

    url.searchParams.set('auto', 'format');
    url.searchParams.set('q', String(Math.round(quality)));
    url.searchParams.set('w', String(Math.round(width)));
    if (height) {
      url.searchParams.set('h', String(Math.round(height)));
      url.searchParams.set('fit', 'crop');
    }
    // Sharp-format hints: prefer avif then webp via Sanity's CDN
    url.searchParams.set('fm', 'webp');

    return url.toString();
  } catch {
    return imageUrl;
  }
}

