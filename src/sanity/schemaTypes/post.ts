import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'post',
  title: 'Artikull',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titulli',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Hyrja / Resumeja',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'mainImage',
      title: 'Imazhi kryesor',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Teksti alternativ (alt)',
        }),
      ],
    }),
    defineField({
      name: 'content',
      title: 'Përmbajtja',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Teksti alternativ (alt)',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'category',
      title: 'Kategoria',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'author',
      title: 'Autori',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data e publikimit',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'featured',
      title: 'E spikatur (Featured)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'breaking',
      title: 'Lajm i fundit (Breaking News)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'tags',
      title: 'Etiketat',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection;
      return {
        ...selection,
        subtitle: author ? `nga ${author}` : '',
      };
    },
  },
});
