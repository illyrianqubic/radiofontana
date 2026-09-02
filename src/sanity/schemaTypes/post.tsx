import { defineArrayMember, defineField, defineType } from 'sanity';
import { Newspaper } from 'lucide-react';

export default defineType({
  name: 'post',
  title: 'Artikull',
  type: 'document',
  icon: () => <Newspaper size={18} />,
  fields: [
    defineField({
      name: 'title',
      title: 'Titulli',
      type: 'string',
      description: 'Titulli kryesor i artikullit — shkruaj tituj të qartë dhe tërheqëse.',
      placeholder: 'p.sh. Fontana sjell muzikën e re në Kosovë…',
      validation: (rule) => rule.required().max(160).error('Titulli duhet të jetë maksimum 160 karaktere.'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      description: 'Adresa e artikullit në faqe. Klikoni "Generate" për ta krijuar nga titulli.',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Hyrja / Resumeja',
      type: 'text',
      rows: 3,
      description: 'Shfaqet nën titull në listat e lajmeve dhe në rezultatet e Google.',
      placeholder: 'Një përmbledhje e shkurtër, 1–2 fjali…',
      validation: (rule) =>
        rule
          .required()
          .min(40)
          .max(300)
          .warning('Mbaj përshkrimin midis 40 dhe 300 karaktere për SEO më të mirë.'),
    }),
    defineField({
      name: 'mainImage',
      title: 'Imazhi kryesor',
      type: 'image',
      description: 'Fotoja kryesore — shfaqet në ballinë, lista dhe karta artikujsh. Klikoni për hotspot.',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Teksti i artikullit',
      type: 'array',
      description: 'Trupi i artikullit. Përdorni + për të shtuar foto brenda tekstit.',
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({ type: 'block' }),
        defineArrayMember({ type: 'image', options: { hotspot: true } }),
      ],
    }),
    defineField({
      name: 'category',
      title: 'Kategoria',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Zgjidhni një kategori (Aktualitet, Kronikë, Sport, …) — shfaqet si etiketë me ngjyrë.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Autori',
      type: 'reference',
      to: [{ type: 'author' }],
      description: 'Autori i artikullit — shfaqet si "nga {emri}".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data e publikimit',
      type: 'datetime',
      description: 'Kontrolloni datën/orën — artikujt renditen sipas kësaj date.',
      validation: (rule) => rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'featured',
      title: 'E spikatur (Featured)',
      type: 'boolean',
      description: 'Artikuj të spikatur shfaqen të mëdhenj në ballinë të faqes.',
      initialValue: false,
    }),
    defineField({
      name: 'breaking',
      title: 'Lajm i fundit (Breaking News)',
      type: 'boolean',
      description: 'Shfaq shiritin e kuq "Lajm i fundit" dhe njoftimet në faqe.',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: 'Data e publikimit (më të rejat)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Data e publikimit (më të vjetrat)',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
    {
      title: 'Titulli (A–Z)',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      category: 'category.title',
      media: 'mainImage',
      breaking: 'breaking',
      featured: 'featured',
      publishedAt: 'publishedAt',
    },
    prepare(selection) {
      const { author, category, breaking, featured, publishedAt } = selection;
      const flags = [
        breaking ? '🔴 Lajm i fundit' : null,
        featured ? '⭐ E spikatur' : null,
      ].filter(Boolean);
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString('sq-AL', { day: 'numeric', month: 'short', year: 'numeric' })
        : null;
      const bits = [category, author ? `nga ${author}` : null, date].filter(Boolean);
      return {
        ...selection,
        subtitle: [...flags, ...bits].join(' · '),
      };
    },
  },
});
