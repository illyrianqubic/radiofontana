import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'author',
  title: 'Autori',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Emri',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Fotoja',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
  preview: {
    select: { title: 'name', media: 'image' },
  },
});
