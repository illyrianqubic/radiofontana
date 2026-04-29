import { cache } from 'react';
import { readClient } from './client';
import { SITE_SETTINGS_QUERY } from './queries';

export interface SiteSettings {
  title?: string;
  description?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  radioStreamUrl?: string;
}

// Hardcoded fallbacks used when the Sanity document doesn't exist yet so the
// site never breaks. Editors can override any of these from the Studio
// (audit P3-L10).
export const SITE_SETTINGS_DEFAULTS: Required<Omit<SiteSettings, 'title' | 'description'>> = {
  facebookUrl: 'https://www.facebook.com/rtvfontanalive',
  instagramUrl: 'https://www.instagram.com/rtvfontana/',
  tiktokUrl: 'https://www.tiktok.com/@rtvfontanalive',
  youtubeUrl: 'https://www.youtube.com/@RTVFontana',
  radioStreamUrl: 'https://live.radiostreaming.al:8010/stream.mp3',
};

export const fetchSiteSettings = cache(async (): Promise<Required<SiteSettings>> => {
  let raw: SiteSettings | null = null;
  try {
    raw = await readClient.fetch<SiteSettings | null>(
      SITE_SETTINGS_QUERY,
      {},
      { next: { revalidate: 600 } },
    );
  } catch {
    raw = null;
  }
  return {
    title: raw?.title ?? 'Radio Fontana',
    description: raw?.description ?? '',
    facebookUrl:    raw?.facebookUrl    || SITE_SETTINGS_DEFAULTS.facebookUrl,
    instagramUrl:   raw?.instagramUrl   || SITE_SETTINGS_DEFAULTS.instagramUrl,
    tiktokUrl:      raw?.tiktokUrl      || SITE_SETTINGS_DEFAULTS.tiktokUrl,
    youtubeUrl:     raw?.youtubeUrl     || SITE_SETTINGS_DEFAULTS.youtubeUrl,
    radioStreamUrl: raw?.radioStreamUrl || SITE_SETTINGS_DEFAULTS.radioStreamUrl,
  };
});
