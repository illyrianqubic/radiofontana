import type { Metadata } from 'next';
import LegalPageLayout, { type LegalSection } from '@/components/shared/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Politika e Privatësisë',
  description:
    'Politika e privatësisë e Radio Fontana që shpjegon mbledhjen e të dhënave, cookies, analytics dhe të drejtat e përdoruesve sipas GDPR.',
};

const sections: LegalSection[] = [
  {
    title: '1. Kush jemi ne',
    paragraphs: [
      'Radio Fontana është media lokale me seli në Istog, Kosovë. Kjo politikë zbatohet për faqen radiofontana.org, aplikacionin tonë Android në Google Play Store dhe shërbimet përkatëse.',
      'Për çdo pyetje rreth privatësisë mund të na kontaktoni në rtvfontana@gmail.com.',
    ],
  },
  {
    title: '2. Të dhënat personale',
    paragraphs: [
      'Ne nuk mbledhim të dhëna personale. Faqja jonë dhe aplikacioni nuk kërkojnë regjistrim ose hyrje me llogari.',
    ],
  },
  {
    title: '3. Qëllimet dhe baza ligjore e përpunimit',
    bullets: [
      'Ekzekutimi i shërbimit (p.sh. përgjigje ndaj kontakteve dhe kërkesave editoriale).',
      'Interesi legjitim për siguri, administrim teknik dhe përmirësim të përmbajtjes.',
      'Pëlqimi, kur kërkohet për cookies jo thelbësore ose komunikime specifike.',
      'Detyrimet ligjore në rast kërkesash nga autoritetet kompetente.',
    ],
  },
  {
    title: '4. Cookies dhe teknologji të ngjashme',
    paragraphs: [
      'Ne përdorim cookies dhe teknologji të ngjashme për funksionim të faqes, ruajtje të preferencave dhe analizë të përdorimit.',
      'Për detaje të plota, shikoni faqen tonë të dedikuar për Cookies.',
    ],
    bullets: [
      'Cookies thelbësore: të nevojshme për funksionim bazë të platformës.',
      'Cookies analitike: ndihmojnë të kuptojmë përdorimin e faqes dhe aplikacionit.',
      'Cookies funksionale: ruajnë preferencat e përdoruesit.',
    ],
  },
  {
    title: '5. Analytics',
    paragraphs: [
      'Ne mund të përdorim mjete analitike për statistika të përgjithshme të trafikut dhe performancës së përmbajtjes. Këto të dhëna përdoren për përmirësime editoriale dhe teknike.',
      'Kur është e aplikueshme, përpiqemi të minimizojmë identifikimin personal dhe të përdorim konfigurime që mbrojnë privatësinë.',
    ],
  },
  {
    title: '6. Ndarja e të dhënave',
    paragraphs: [
      'Ne nuk i shesim të dhënat personale. Të dhënat mund të ndahen vetëm kur është e nevojshme për funksionim të shërbimit ose sipas ligjit.',
    ],
    bullets: [
      'Me ofrues teknikë (hosting, analitikë, siguri) nën detyrime kontraktuale të konfidencialitetit.',
      'Me autoritete publike kur kërkohet me ligj.',
    ],
  },
  {
    title: '7. Ruajtja e të dhënave',
    paragraphs: [
      'Të dhënat ruhen vetëm për aq kohë sa nevojitet për qëllimin për të cilin janë mbledhur, ose sipas afateve ligjore të zbatueshme.',
    ],
  },
  {
    title: '8. Të drejtat tuaja sipas GDPR',
    paragraphs: [
      'Ju keni të drejta të qarta për të kontrolluar të dhënat tuaja personale.',
    ],
    bullets: [
      'E drejta e qasjes në të dhënat tuaja.',
      'E drejta e korrigjimit të të dhënave të pasakta.',
      'E drejta e fshirjes (e drejta për t’u harruar), kur zbatohet.',
      'E drejta e kufizimit të përpunimit.',
      'E drejta e bartjes së të dhënave.',
      'E drejta e kundërshtimit ndaj përpunimit në bazë të interesit legjitim.',
      'E drejta për të tërhequr pëlqimin në çdo kohë, pa efekt retroaktiv.',
      'E drejta për ankesë te autoriteti kompetent për mbrojtjen e të dhënave.',
    ],
  },
  {
    title: '9. Siguria e të dhënave',
    paragraphs: [
      'Ne zbatojmë masa organizative dhe teknike të arsyeshme për mbrojtjen e të dhënave kundër humbjes, qasjes së paautorizuar ose keqpërdorimit.',
    ],
  },
  {
    title: '10. Privatësia e fëmijëve',
    paragraphs: [
      'Shërbimet tona nuk synojnë mbledhje të qëllimshme të të dhënave nga fëmijët pa pëlqimin e prindit ose kujdestarit ligjor, kur kërkohet nga ligji.',
    ],
  },
  {
    title: '11. Ndryshimet e politikës',
    paragraphs: [
      'Ne mund ta përditësojmë këtë politikë periodikisht. Data e përditësimit tregon versionin më të fundit në fuqi.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Politika e Privatësisë"
      summary="Kjo politikë shpjegon si mbledhim, përdorim dhe mbrojmë të dhënat personale, përfshirë cookies, analytics dhe të drejtat tuaja sipas GDPR."
      lastUpdated="24 prill 2026"
      sections={sections}
    />
  );
}