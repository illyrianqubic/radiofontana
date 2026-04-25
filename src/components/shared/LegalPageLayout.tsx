import Link from 'next/link';

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

type LegalPageLayoutProps = {
  title: string;
  summary: string;
  lastUpdated: string;
  sections: LegalSection[];
};

const LEGAL_LINKS = [
  { label: 'Kushtet', href: '/terms' },
  { label: 'Privatësia', href: '/privacy' },
  { label: 'GDPR', href: '/gdpr' },
  { label: 'Mohim Përgjegjësie', href: '/disclaimer' },
  { label: 'Cookies', href: '/cookies' },
];

export default function LegalPageLayout({ title, summary, lastUpdated, sections }: LegalPageLayoutProps) {
  return (
    <div className="site-container py-7 sm:py-10 2xl:py-12 page-shell">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white px-5 sm:px-7 lg:px-10 py-7 sm:py-9 lg:py-10 shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
        <div className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-[#e63946]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-slate-900/5 blur-3xl" />

        <div className="relative grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div className="xl:col-span-8">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#e63946]/20 bg-[#e63946]/5 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#c01f31] mb-4">
              Dokument Ligjor
            </p>
            <h1 className="text-[1.75rem] sm:text-4xl 2xl:text-[2.8rem] 3xl:text-[3.1rem] leading-tight font-extrabold text-slate-900 mb-4 break-words">
              {title}
            </h1>
            <p className="max-w-3xl text-slate-600 text-sm sm:text-lg 2xl:text-xl leading-relaxed break-words">{summary}</p>
            <p className="mt-4 text-sm font-semibold text-slate-500">Përditësuar më: {lastUpdated}</p>
          </div>

          <div className="xl:col-span-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400 mb-3">Radio Fontana</p>
            <div className="space-y-3 text-sm text-slate-700">
              <p>
                Selia: Istog, Kosovë
              </p>
              <p>
                Email:{' '}
                <a href="mailto:rtvfontana@gmail.com" className="font-semibold text-[#c01f31] hover:underline">
                  rtvfontana@gmail.com
                </a>
              </p>
              <p>
                Web:{' '}
                <a href="https://radiofontana.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#c01f31] hover:underline">
                  radiofontana.org
                </a>
              </p>
              <p>Aplikacioni Android: Google Play Store</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 space-y-4">
        {sections.map((section) => (
          <section
            key={section.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:p-7 shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
          >
            <h2 className="text-lg sm:text-2xl 2xl:text-[1.7rem] font-bold text-slate-900 mb-3 break-words">{section.title}</h2>

            {section.paragraphs && section.paragraphs.length > 0 ? (
              <div className="space-y-3 text-sm sm:text-base 2xl:text-lg leading-relaxed text-slate-700 break-words">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ) : null}

            {section.bullets && section.bullets.length > 0 ? (
              <ul className="mt-3 list-disc pl-5 space-y-1.5 text-sm sm:text-base 2xl:text-lg leading-relaxed text-slate-700">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-[#e63946]/20 bg-[#e63946]/5 p-5 sm:p-6">
        <h2 className="text-lg sm:text-xl 2xl:text-2xl font-bold text-slate-900 mb-3">Dokumente të lidhura</h2>
        <div className="flex flex-wrap gap-2.5">
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm 2xl:text-base font-semibold text-slate-700 hover:text-[#c01f31] hover:border-[#e63946]/40 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}