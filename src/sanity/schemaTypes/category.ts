import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'category',
  title: 'Kategoria',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Emri',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Përshkrimi',
      type: 'text',
    }),
    defineField({
      name: 'color',
      title: 'Ngjyra (Tailwind class)',
      type: 'string',
      description: 'p.sh. bg-blue-600, bg-green-600',
    }),
  ],
});
