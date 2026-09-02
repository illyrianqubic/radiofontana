import { defineField, defineType } from 'sanity';
import { SlidersHorizontal, Globe, Camera, Share2, PlayCircle, Music2 } from 'lucide-react';

export default defineType({
  name: 'siteSettings',
  title: 'Cilësimet e faqes',
  type: 'document',
  icon: () => <SlidersHorizontal size={18} />,
  fields: [
    defineField({
      name: 'title',
      title: 'Emri i faqes',
      type: 'string',
      description: 'Emri i faqes — shfaqet në titullin e faqes (tab) dhe SEO.',
      placeholder: 'p.sh. Radio Fontana',
    }),
    defineField({
      name: 'description',
      title: 'Përshkrimi i faqes (meta)',
      type: 'text',
      description: 'Përshkrimi meta — shfaqet në rezultatet e Google (rekomandohet ~160 karaktere).',
      rows: 3,
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook URL',
      type: 'url',
      icon: () => <Share2 size={16} color="#1877F2" />,
      placeholder: 'https://facebook.com/…',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      icon: () => <Camera size={16} color="#E1306C" />,
      placeholder: 'https://instagram.com/…',
    }),
    defineField({
      name: 'tiktokUrl',
      title: 'TikTok URL',
      type: 'url',
      icon: () => <Music2 size={16} color="#111827" />,
      placeholder: 'https://tiktok.com/@…',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      icon: () => <PlayCircle size={16} color="#FF0000" />,
      placeholder: 'https://youtube.com/…',
    }),
    defineField({
      name: 'radioStreamUrl',
      title: '🎙️ URL e streamit radio',
      type: 'url',
      icon: () => <Globe size={16} color="#DC2626" />,
      description: 'Lidhja e streamit audio që dëgjohet te luajtësi i radios në faqe.',
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: title ?? 'Cilësimet e faqes', subtitle: 'Konfigurim global i faqes' };
    },
  },
});
