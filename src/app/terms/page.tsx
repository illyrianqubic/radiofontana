import type { Metadata } from 'next';
import LegalPageLayout, { type LegalSection } from '@/components/shared/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Kushtet e Shërbimit | Radio Fontana',
  description:
    'Kushtet e shërbimit të Radio Fontana për përdorimin e faqes radiofontana.org, aplikacionit Android dhe të gjitha shërbimeve dixhitale.',
  alternates: { canonical: 'https://radiofontana.org/terms' },
  robots: { index: true, follow: false },
};

const sections: LegalSection[] = [
  {
    title: '1. Pranimi i Kushteve',
    paragraphs: [
      'Duke hyrë ose përdorur faqen radiofontana.org, aplikacionin tonë Android në Google Play Store, dhe çdo shërbim të lidhur të Radio Fontana, ju pranoni këto Kushte të Shërbimit.',
      'Nëse nuk pajtoheni me këto kushte, ju lutemi të mos përdorni shërbimet tona.',
    ],
  },
  {
    title: '2. Shërbimet që Ofron Radio Fontana',
    paragraphs: [
      'Radio Fontana është media lokale me seli në Istog, Kosovë dhe ofron lajme, programe radiofonike live, materiale informuese dhe përmbajtje multimediale për publikun.',
    ],
    bullets: [
      'Portal informativ dhe lajme në internet.',
      'Transmetim audio live i radios.',
      'Aplikacion Android për qasje në përmbajtje dhe transmetim.',
    ],
  },
  {
    title: '3. Përdorimi i Përmbajtjes',
    paragraphs: [
      'Përmbajtja e publikuar në platformat tona lejohet vetëm për përdorim personal, informativ dhe jo-komercial, përveç rasteve kur jepet leje e shkruar nga Radio Fontana.',
    ],
    bullets: [
      'Ndalohet kopjimi, ripublikimi ose shpërndarja masive pa autorizim.',
      'Ndalohet përdorimi i automatizuar për nxjerrje sistematike të përmbajtjes (scraping) pa leje.',
      'Lejohet citimi i shkurtër me atribuim të qartë të burimit: Radio Fontana dhe lidhje drejt materialit origjinal.',
    ],
  },
  {
    title: '4. Pronësia Intelektuale',
    paragraphs: [
      'Të drejtat e autorit, markat, logot, dizajni, audio-materialet, tekstet, fotografitë dhe videot në këtë platformë janë pronë e Radio Fontana ose e partnerëve të licencuar.',
      'Çdo përdorim i paautorizuar i pronës intelektuale mund të rezultojë në masa ligjore sipas legjislacionit në fuqi.',
    ],
  },
  {
    title: '5. Sjellja e Përdoruesit',
    paragraphs: [
      'Gjatë përdorimit të shërbimeve tona, ju pranoni të mos ndërmerrni veprime që dëmtojnë funksionimin e platformës ose të drejtat e të tjerëve.',
    ],
    bullets: [
      'Të mos shpërndani përmbajtje të paligjshme, shpifëse, fyese ose diskriminuese.',
      'Të mos dërgoni spam, malware ose materiale që cenojnë sigurinë kibernetike.',
      'Të mos paraqiteni në mënyrë të rreme si përfaqësues i Radio Fontana.',
    ],
  },
  {
    title: '6. Materialet e Dërguara nga Përdoruesit',
    paragraphs: [
      'Nëse dërgoni lajme, fotografi, video ose materiale të tjera te Radio Fontana, ju konfirmoni se keni të drejtë për t’i dërguar ato dhe se materiali nuk cenon të drejtat e palëve të treta.',
      'Duke dërguar materiale, ju i jepni Radio Fontana të drejtën jo-ekskluzive për shqyrtim, redaktim dhe publikim, sipas standardeve editoriale.',
    ],
  },
  {
    title: '7. Lidhjet e Palëve të Treta',
    paragraphs: [
      'Faqja ose aplikacioni mund të përmbajë lidhje drejt faqeve të palëve të treta. Radio Fontana nuk mban përgjegjësi për përmbajtjen, politikat e privatësisë ose praktikat e këtyre faqeve.',
    ],
  },
  {
    title: '8. Kufizimi i Përgjegjësisë',
    paragraphs: [
      'Ne punojmë për saktësi dhe vazhdimësi të shërbimit, por nuk garantojmë që shërbimet do të jenë pa ndërprerje, pa gabime ose gjithmonë të disponueshme në çdo pajisje.',
      'Në masën e lejuar nga ligji, Radio Fontana nuk mban përgjegjësi për dëme indirekte ose humbje të shkaktuara nga përdorimi i platformës.',
    ],
  },
  {
    title: '9. Ligji i Zbatueshëm dhe Juridiksioni',
    paragraphs: [
      'Këto kushte rregullohen nga legjislacioni i Republikës së Kosovës. Çdo mosmarrëveshje i nënshtrohet juridiksionit të gjykatave kompetente në Kosovë.',
    ],
  },
  {
    title: '10. Ndryshimet dhe Kontakti',
    paragraphs: [
      'Radio Fontana mund t’i përditësojë këto kushte në çdo kohë. Versioni i publikuar në këtë faqe është versioni i vlefshëm.',
      'Për pyetje lidhur me këto kushte, na kontaktoni në rtvfontana@gmail.com.',
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Kushtet e Shërbimit"
      summary="Këto kushte përcaktojnë rregullat për përdorimin e përmbajtjes dhe shërbimeve të Radio Fontana në web dhe aplikacionin Android."
      lastUpdated="24 prill 2026"
      sections={sections}
    />
  );
}