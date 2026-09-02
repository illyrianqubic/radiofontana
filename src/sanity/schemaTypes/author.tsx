import { defineField, defineType } from 'sanity';
import { User } from 'lucide-react';

export default defineType({
  name: 'author',
  title: 'Autor',
  type: 'document',
  icon: () => <User size={18} />,
  fields: [
    defineField({
      name: 'name',
      title: 'Emri',
      type: 'string',
      description: 'Emri i plotë i autorit — shfaqet si "nga {emri}" në artikuj.',
      placeholder: 'p.sh. Egzon Mehmetaj',
      validation: (rule) => rule.required(),
      options: {
        list: [
          { title: 'Egzon Mehmetaj', value: 'egzon-mehmetaj' },
          { title: 'Endrit Mehmetaj', value: 'endrit-mehmetaj' },
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'role',
      title: 'Roli',
      type: 'string',
      description: 'p.sh. Gazetare, Redaktor, Kameraman',
      placeholder: 'p.sh. Gazetare',
    }),
    defineField({
      name: 'image',
      title: 'Fotoja',
      type: 'image',
      description: 'Foto portreti e autorit (preferohet foto këndore, rrathë në faqe).',
      options: { hotspot: true },
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      description: 'Biografia e shkurtër e autorit.',
      of: [{ type: 'block' }],
    }),
  ],
  preview: {
    select: { title: 'name', media: 'image', role: 'role' },
    prepare({ title, media, role }) {
      return { title, media, subtitle: role ?? '' };
    },
  },
});
