import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'liveStream',
  title: 'Live Stream',
  type: 'document',
  fields: [
    defineField({
      name: 'isLive',
      title: 'Aktiv tani 🔴',
      type: 'boolean',
      initialValue: false,
      description: 'Aktivizoni për të shfaqur badgën LIVE në navbar dhe për të aktivizuar livestreamin.',
    }),
    defineField({
      name: 'title',
      title: 'Titulli i transmetimit',
      type: 'string',
      description: 'p.sh. Lajmet e orës 19:00',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook Video URL',
      type: 'url',
      description: 'URL-ja e plotë e videos/streamit live nga Facebook',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
    }),
    defineField({
      name: 'description',
      title: 'Përshkrimi',
      type: 'text',
    }),
  ],
  preview: {
    select: { title: 'title', isLive: 'isLive' },
    prepare({ title, isLive }) {
      return {
        title: title ?? 'Live Stream',
        subtitle: isLive ? '🔴 Duke transmetuar LIVE' : '⏸ Offline',
      };
    },
  },
});
