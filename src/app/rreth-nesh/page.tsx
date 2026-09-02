import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Radio, MapPin, Phone, Mail, Clock, Wifi, Users, Mic2, Award, Heart } from 'lucide-react';

const SITE_URL = 'https://radiofontana.org';

export const metadata: Metadata = {
  title: 'Rreth Nesh | Radio Fontana 98.8 FM',
  description:
    'Mëso më shumë rreth Radio Fontana, stacioni i parë privat i transmetimit nga Istog, Kosovë. Historia jonë, misioni, ekipi dhe frekuenca 98.8 FM.',
  keywords: [
    'rreth radio fontana', 'historia radio fontana', 'rtv fontana istog',
    'radio 98.8 fm kosovë', 'radio shqip istog', 'media kosovë',
  ],
  alternates: { canonical: `${SITE_URL}/rreth-nesh` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/rreth-nesh`,
    title: 'Rreth Nesh | Radio Fontana 98.8 FM',
    description: 'Historia, misioni dhe ekipi i Radio Fontana, zëri i Istogut dhe Kosovës.',
    images: [{ url: `${SITE_URL}/logortvfontana.jpg`, width: 1200, height: 630, alt: 'Radio Fontana' }],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Kryefaqja', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Rreth Nesh', item: `${SITE_URL}/rreth-nesh` },
  ],
};

const stats = [
  { icon: Wifi, label: 'Frekuenca', value: '98.8 FM' },
  { icon: Clock, label: 'Transmetim', value: '24/7' },
  { icon: MapPin, label: 'Vendndodhja', value: 'Istog, Kosovë' },
  { icon: Users, label: 'Dëgjues', value: '50 000+' },
];

const values = [
  {
    icon: Mic2,
    title: 'Liri e Shprehjes',
    desc: 'Mbrojmë lirinë e shtypit dhe të drejtën e qytetarëve për informacion të paanshëm.',
  },
  {
    icon: Award,
    title: 'Profesionalizëm',
    desc: 'Gazetarët tanë ndjekin standardet etike dhe profesionale të gazetarisë bashkëkohore.',
  },
  {
    icon: Heart,
    title: 'Komuniteti',
    desc: 'Jemi krenarë të jemi zëri i komunitetit të Istogut, Pejës dhe gjithë Kosovës.',
  },
];

export default function RrethNeshPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-white min-h-screen page-shell">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(220,38,38,0.18),transparent_60%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(220,38,38,0.10),transparent_60%)]" />
          <div className="site-container relative py-16 md:py-20 lg:py-24 2xl:py-28">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
              <Link href="/" className="hover:text-white transition-colors">Kryefaqja</Link>
              <span className="text-slate-600">/</span>
              <span className="text-white font-medium">Rreth Nesh</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-red-400 mb-6">
                  <Radio className="w-3.5 h-3.5" />
                  Radio Fontana 98.8 FM
                </div>
                <h1 className="text-[2.2rem] md:text-[2.8rem] lg:text-[3.2rem] 2xl:text-[3.6rem] font-extrabold leading-tight mb-5 break-words">
                  Zëri i Istogut <br />
                  <span className="text-red-500">dhe Kosovës</span>
                </h1>
                <p className="text-slate-300 text-base md:text-lg 2xl:text-xl leading-relaxed max-w-xl">
                  Radio Fontana është stacioni kryesor privat i transmetimit radio-televiziv nga Istog, 
                  duke shërbyer komunitetin shqiptar me lajme, muzikë dhe program cilësor çdo ditë.
                </p>
              </div>
              <div className="flex justify-center md:justify-end">
                <div className="relative w-56 h-56 md:w-64 md:h-64 lg:w-72 lg:h-72">
                  <div className="absolute inset-0 rounded-full bg-red-600/20 blur-3xl scale-110" />
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/10 shadow-2xl bg-slate-800 flex items-center justify-center">
                    <Image
                      src="/logortvfontana.jpg"
                      alt="Radio Fontana Logo"
                      width={288}
                      height={288}
                      className="object-cover w-full h-full"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 md:mt-16">
              {stats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 text-center">
                  <Icon className="w-6 h-6 text-red-400 mx-auto mb-2" />
                  <p className="text-2xl md:text-3xl font-extrabold text-white mb-1">{value}</p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Historia */}
        <section className="site-container py-14 md:py-18 lg:py-20 2xl:py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-red-600 rounded-full" />
              <h2 className="text-[1.6rem] md:text-[2rem] lg:text-[2.3rem] font-extrabold text-slate-900">
                Historia Jonë
              </h2>
            </div>
            <div className="space-y-5 text-slate-700 text-base md:text-lg 2xl:text-xl leading-relaxed">
              <p>
                Radio Fontana u themelua në Istog me misionin e qartë: t&apos;i ofrojë komunitetit shqiptar
                informacion të besueshëm, program cilësor dhe zë autentik. Stacioni nisi transmetimin
                në frekuencën <strong className="text-slate-900">98.8 FM</strong> dhe shpejt u bë burim
                kryesor i lajmeve dhe argëtimit për banorët e Istogut dhe rajonit të Pejës.
              </p>
              <p>
                Me kalimin e viteve, Radio Fontana ka zgjeruar shtrirjen e saj duke mbuluar eventet
                kryesore lokale, rajonale dhe kombëtare. Redaksia jonë ndjek ngjarjet me profesionalizëm
                dhe objektivitet, duke mbajtur gjithmonë në qendër interesin e publikut.
              </p>
              <p>
                Sot, Radio Fontana transmeton <strong className="text-slate-900">24 orë në ditë, 7 ditë 
                në javë</strong>, si në frekuencën FM ashtu edhe online përmes platformës dixhitale,
                duke arritur dëgjues jo vetëm në Kosovë por kudo në botë ku jetojnë shqiptarë.
              </p>
            </div>
          </div>
        </section>

        {/* Misioni */}
        <section className="bg-slate-50/60 border-y border-slate-100">
          <div className="site-container py-14 md:py-18 lg:py-20 2xl:py-24">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-red-600 rounded-full" />
              <h2 className="text-[1.6rem] md:text-[2rem] lg:text-[2.3rem] font-extrabold text-slate-900">
                Misioni dhe Vlerat Tona
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 md:p-7 shadow-[0_8px_24px_rgba(15,23,42,0.07)]"
                >
                  <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-2">{title}</h3>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Programi */}
        <section className="site-container py-14 md:py-18 lg:py-20 2xl:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-red-600 rounded-full" />
                <h2 className="text-[1.6rem] md:text-[2rem] lg:text-[2.3rem] font-extrabold text-slate-900">
                  Programi
                </h2>
              </div>
              <div className="space-y-4 text-slate-700 text-base md:text-lg leading-relaxed">
                <p>
                  Programi i Radio Fontana përfshin një gamë të gjerë formatesh: nga buletinet e lajmeve
                  çdo orë, debatet politike, rubrikat sportive dhe muzikën shqiptare dhe ndërkombëtare.
                </p>
                <p>
                  Gjatë ditës, audienca gëzon emisionet e mëngjesit, magazinat informative dhe programet
                  kulturore. Natën, muzika dhe talk-showet mbajnë shoqëri dëgjuesve tanë besnikë.
                </p>
              </div>

              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-3">
                <h3 className="font-extrabold text-slate-900 text-base">Orari i Transmetimit</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex flex-col">
                    <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">Studio Live</span>
                    <span className="font-bold text-slate-900">E Hënë – E Premte</span>
                    <span className="text-red-600 font-semibold">08:00 – 20:00</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">Transmetim Auto</span>
                    <span className="font-bold text-slate-900">Gjatë gjithë ditës</span>
                    <span className="text-red-600 font-semibold">24/7</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Kontakti */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-red-600 rounded-full" />
                <h2 className="text-[1.6rem] md:text-[2rem] lg:text-[2.3rem] font-extrabold text-slate-900">
                  Na Gjeni
                </h2>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-7 shadow-[0_8px_24px_rgba(15,23,42,0.07)] space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 mb-0.5">Adresa</p>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Rruga &ldquo;Ibrahim Rugova&rdquo; Nr. 56<br />
                      Istog, Pejë - 50250<br />
                      Kosovë
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 mb-0.5">Telefoni</p>
                    <a href="tel:+38344150027" className="text-sm text-slate-600 hover:text-red-600 transition-colors block">
                      +383 44 150 027
                    </a>
                    <a href="tel:+38344141294" className="text-sm text-slate-600 hover:text-red-600 transition-colors block">
                      +383 44 141 294
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 mb-0.5">Email</p>
                    <a
                      href="mailto:rtvfontana@gmail.com"
                      className="text-sm text-red-600 hover:underline font-medium"
                    >
                      rtvfontana@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Radio className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 mb-0.5">Frekuenca</p>
                    <p className="text-sm text-slate-600">98.8 FM, Istog dhe rajoni</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/kontakt"
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
                  >
                    Na Kontaktoni
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA — Live Radio */}
        <section className="bg-slate-900 text-white">
          <div className="site-container py-12 md:py-14 2xl:py-16 text-center">
            <Radio className="w-10 h-10 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-3">
              Dëgjo Radio Fontana Live
            </h2>
            <p className="text-slate-400 text-base md:text-lg mb-7 max-w-lg mx-auto">
              Programin tonë mund ta ndiqni drejtpërsëdrejti online, çdo kohë dhe kudo.
            </p>
            <Link
              href="/live"
              className="inline-flex items-center gap-2.5 bg-red-600 hover:bg-red-700 text-white font-bold px-7 py-3.5 rounded-xl text-base transition-colors shadow-lg"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
              </span>
              Dëgjo Tani
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
