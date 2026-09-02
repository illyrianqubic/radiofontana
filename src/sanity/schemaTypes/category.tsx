import { defineField, defineType } from 'sanity';
import { FolderOpen } from 'lucide-react';

// Tailwind classes the website knows how to render as category badge colors.
const COLOR_OPTIONS = [
  { title: 'E kuqe ( Breaking )', value: 'bg-red-600' },
  { title: 'Blu', value: 'bg-blue-600' },
  { title: 'Jeshile', value: 'bg-green-600' },
  { title: 'Vjollcë', value: 'bg-purple-600' },
  { title: 'Rozë', value: 'bg-pink-600' },
  { title: 'E verdhë', value: 'bg-yellow-600' },
  { title: 'Indigo', value: 'bg-indigo-600' },
  { title: 'Blu-gjelbër (Teal)', value: 'bg-teal-600' },
  { title: 'Portokalli', value: 'bg-orange-600' },
  { title: 'Gri', value: 'bg-gray-600' },
];

export default defineType({
  name: 'category',
  title: 'Kategori',
  type: 'document',
  icon: () => <FolderOpen size={18} />,
  fields: [
    defineField({
      name: 'title',
      title: 'Emri',
      type: 'string',
      description: 'Emri i kategorisë siç shfaqet në faqe dhe aplikacion.',
      placeholder: 'p.sh. Sport',
      validation: (rule) => rule.required(),
      options: {
        list: [
          { title: 'Aktualitet', value: 'aktualitet' },
          { title: 'Kronikë', value: 'kronike' },
          { title: 'Sport', value: 'sport' },
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      description: 'Përdoret për filtrimin e lajmeve — gjeneroje nga emri.',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Përshkrimi',
      type: 'text',
      description: 'Përmbledhje e brendë — çfarë lloj lajmesh i përkasin kësaj kategorie.',
      rows: 2,
    }),
    defineField({
      name: 'color',
      title: 'Ngjyra e etiketës',
      type: 'string',
      description: 'Ngjyra e badgës së kategorisë në faqe dhe aplikacion.',
      options: {
        list: COLOR_OPTIONS,
        layout: 'dropdown',
      },
      initialValue: 'bg-gray-600',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'title', description: 'description', color: 'color' },
    prepare({ title, description, color }) {
      return {
        title,
        subtitle: description ?? color ?? '',
        media: () => (
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 6,
              background:
                color === 'bg-red-600'
                  ? '#DC2626'
                  : color === 'bg-blue-600'
                    ? '#2563EB'
                    : color === 'bg-green-600'
                      ? '#16A34A'
                      : color === 'bg-purple-600'
                        ? '#9333EA'
                        : color === 'bg-pink-600'
                          ? '#DB2777'
                          : color === 'bg-yellow-600'
                            ? '#CA8A04'
                            : color === 'bg-indigo-600'
                              ? '#4F46E5'
                              : color === 'bg-teal-600'
                                ? '#0D9488'
                                : color === 'bg-orange-600'
                                  ? '#EA580C'
                                  : color === 'bg-gray-600'
                                    ? '#4B5563'
                                    : 'linear-gradient(135deg,#EF4444,#B91C1C)',
            }}
          />
        ),
      };
    },
  },
});
