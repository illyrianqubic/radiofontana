import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Cilësimet e faqes',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Emri i faqes',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Përshkrimi i faqes (meta)',
      type: 'text',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook URL',
      type: 'url',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'tiktokUrl',
      title: 'TikTok URL',
      type: 'url',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
    }),
    defineField({
      name: 'radioStreamUrl',
      title: 'URL e streamit radio',
      type: 'url',
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: title ?? 'Cilësimet e faqes' };
    },
  },
});
