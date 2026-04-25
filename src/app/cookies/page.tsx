import type { Metadata } from 'next';
import LegalPageLayout, { type LegalSection } from '@/components/shared/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Politika e Cookies | Radio Fontana',
  description:
    'Politika e cookies e Radio Fontana — llojet e cookies, si i përdorim, cookies analitike dhe si t\'i kontrolloni nga shfletuesi juaj.',
  alternates: { canonical: 'https://radiofontana.org/cookies' },
  robots: { index: true, follow: false },
};

const sections: LegalSection[] = [
  {
    title: '1. Çfarë janë cookies',
    paragraphs: [
      'Cookies janë skedarë të vegjël teksti që ruhen në pajisjen tuaj kur vizitoni një faqe interneti. Ato ndihmojnë funksionimin e faqes, ruajtjen e preferencave dhe analizimin e përdorimit.',
    ],
  },
  {
    title: '2. Pse përdorim cookies',
    bullets: [
      'Për funksionim teknik dhe siguri të platformës.',
      'Për ruajtjen e preferencave të përdoruesit.',
      'Për matje analitike të trafikut dhe përmirësim të përmbajtjes.',
      'Për optimizim të performancës së faqes dhe aplikacionit.',
    ],
  },
  {
    title: '3. Llojet e cookies që mund të përdoren',
    bullets: [
      'Cookies thelbësore: të domosdoshme për funksionimin bazë të faqes.',
      'Cookies funksionale: ruajnë zgjedhjet dhe preferencat tuaja.',
      'Cookies analitike: mbledhin të dhëna statistikore agregate për përdorimin.',
      'Cookies të palëve të treta: mund të vendosen nga shërbime si mjetet analitike.',
    ],
  },
  {
    title: '4. Analytics dhe cookies të performancës',
    paragraphs: [
      'Ne mund të përdorim cookies analitike për të kuptuar cilat përmbajtje janë më të dobishme për audiencën. Kjo na ndihmon të përmirësojmë cilësinë e lajmeve dhe funksionimin teknik të shërbimeve.',
      'Të dhënat analitike përdoren kryesisht në formë statistikore dhe jo për profilizim invaziv të përdoruesve individualë.',
    ],
  },
  {
    title: '5. Kohëzgjatja e cookies',
    bullets: [
      'Cookies sesioni: fshihen kur mbyllni shfletuesin.',
      'Cookies të qëndrueshme: ruhen për një periudhë të caktuar ose derisa t’i fshini manualisht.',
    ],
  },
  {
    title: '6. Si t’i kontrolloni cookies',
    paragraphs: [
      'Ju mund të menaxhoni, bllokoni ose fshini cookies nga cilësimet e shfletuesit tuaj. Çaktivizimi i disa cookies mund të ndikojë në funksionalitetin e faqes.',
    ],
    bullets: [
      'Kontrolloni cilësimet e privatësisë në shfletuesin tuaj (Chrome, Firefox, Safari, Edge).',
      'Fshini cookies ekzistuese periodikisht nëse dëshironi më shumë kontroll.',
      'Përdorni opsionet e kufizimit të gjurmimit kur ato ofrohen nga shfletuesi.',
    ],
  },
  {
    title: '7. Të drejtat tuaja',
    paragraphs: [
      'Për çdo përpunim të të dhënave personale që lidhet me cookies, ju gëzoni të drejtat sipas GDPR, përfshirë qasjen, korrigjimin, fshirjen, kundërshtimin dhe tërheqjen e pëlqimit kur aplikohet.',
    ],
  },
  {
    title: '8. Ndryshimet në këtë politikë',
    paragraphs: [
      'Ne mund ta përditësojmë këtë politikë për të reflektuar ndryshime ligjore ose teknike. Data e përditësimit tregon versionin më të fundit.',
    ],
  },
  {
    title: '9. Kontakt',
    paragraphs: [
      'Për pyetje mbi përdorimin e cookies: rtvfontana@gmail.com.',
    ],
  },
];

export default function CookiesPage() {
  return (
    <LegalPageLayout
      title="Politika e Cookies"
      summary="Këtu shpjegojmë si përdorim cookies, përfshirë cookies analitike, dhe si mund t’i menaxhoni ato në pajisjen tuaj."
      lastUpdated="24 prill 2026"
      sections={sections}
    />
  );
}