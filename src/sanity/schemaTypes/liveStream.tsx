import { defineField, defineType } from 'sanity';
import { RadioTower } from 'lucide-react';

export default defineType({
  name: 'liveStream',
  title: 'Live Stream',
  type: 'document',
  icon: () => <RadioTower size={18} />,
  fields: [
    defineField({
      name: 'isLive',
      title: '🔴 Aktiv tani',
      type: 'boolean',
      initialValue: false,
      description: 'Aktivizoni për të shfaqur badgën LIVE në navbar dhe për të aktivizuar livestreamin.',
    }),
    defineField({
      name: 'title',
      title: 'Titulli i transmetimit',
      type: 'string',
      description: 'Shfaqet te dritarja e livestreamit.',
      placeholder: 'p.sh. Lajmet e orës 19:00',
    }),
    defineField({
      name: 'facebookUrl',
      title: '📺 Facebook Video URL',
      type: 'url',
      description: 'URL-ja e plotë e videos/streamit live nga Facebook.',
      placeholder: 'https://www.facebook.com/…',
    }),
    defineField({
      name: 'youtubeUrl',
      title: '▶️ YouTube URL',
      type: 'url',
      description: 'URL-ja e transmetimit nga YouTube (përdoret si rezervë).',
      placeholder: 'https://www.youtube.com/…',
    }),
    defineField({
      name: 'description',
      title: 'Përshkrimi',
      type: 'text',
      description: 'Teksti përshkrues i transmetimit.',
      rows: 2,
    }),
  ],
  preview: {
    select: { title: 'title', isLive: 'isLive' },
    prepare({ title, isLive }) {
      return {
        title: title ?? 'Live Stream',
        subtitle: isLive ? '🔴 Duke transmetuar LIVE' : '⏸ Offline',
        media: () => (
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isLive
                ? 'linear-gradient(135deg,#EF4444,#B91C1C)'
                : 'linear-gradient(135deg,#6B7280,#374151)',
              color: '#fff',
              fontSize: 14,
            }}
          >
            ●
          </div>
        ),
      };
    },
  },
});
