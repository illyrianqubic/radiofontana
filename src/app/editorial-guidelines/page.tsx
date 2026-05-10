import type { Metadata } from 'next';
import LegalPageLayout, { type LegalSection } from '@/components/shared/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Udhëzimet Editoriale | RTV Fontana',
  description:
    'Udhëzimet editoriale të RTV Fontana për pavarësinë editoriale, saktësinë, verifikimin, burimet, korrigjimet, etikën dhe ankesat.',
  alternates: { canonical: 'https://radiofontana.org/editorial-guidelines' },
  robots: { index: true, follow: true },
};

const sections: LegalSection[] = [
  {
    title: '1. Pavarësia editoriale',
    paragraphs: [
      'Vendimet editoriale merren në mënyrë të pavarur nga redaksia dhe bazohen në rëndësinë publike, saktësinë dhe vlerën informative të materialit.',
      'RTV Fontana nuk lejon që interesa politike, komerciale, personale apo presione të jashtme të diktojnë përmbajtjen editoriale.',
    ],
  },
  {
    title: '2. Saktësia dhe verifikimi',
    paragraphs: [
      'Çdo lajm publikohet vetëm pasi informacioni të jetë kontrolluar me kujdes dhe, kur është e mundur, të jetë verifikuar nga më shumë se një burim i besueshëm.',
      'Titujt, fotografitë, citimet dhe konteksti duhet të pasqyrojnë saktë përmbajtjen e lajmit. Informacionet e pakonfirmuara trajtohen me kujdes dhe identifikohen qartë si të tilla.',
    ],
  },
  {
    title: '3. Drejtësia dhe balanca',
    paragraphs: [
      'RTV Fontana synon të raportojë në mënyrë të drejtë, të paanshme dhe të balancuar.',
      'Në çështjet ku ka palë të përfshira ose pretendime kundërshtuese, redaksia kërkon që palëve relevante t’u jepet mundësi e arsyeshme për përgjigje. Gjuha editoriale duhet të jetë profesionale, e matur dhe pa paragjykime.',
    ],
  },
  {
    title: '4. Burimet dhe atribuimi',
    paragraphs: [
      'Burimet e informacionit identifikohen qartë kur kjo është e mundur dhe e përshtatshme.',
      'Citimet, të dhënat, fotografitë, videot dhe materialet e marra nga institucione, agjenci, media të tjera ose persona të tretë atribuohen në mënyrë korrekte. Burimet anonime përdoren vetëm kur informacioni ka rëndësi publike dhe kur mbrojtja e identitetit është e arsyeshme.',
    ],
  },
  {
    title: '5. Politika e korrigjimeve',
    paragraphs: [
      'Kur identifikohet një gabim faktik, RTV Fontana e korrigjon sa më shpejt dhe në mënyrë transparente.',
      'Korrigjimet duhet të jenë të qarta dhe proporcionale me natyrën e gabimit. Kur është e nevojshme, artikulli përditësohet me shënim që sqaron ndryshimin.',
    ],
  },
  {
    title: '6. Privatësia dhe etika',
    paragraphs: [
      'RTV Fontana respekton privatësinë, dinjitetin dhe sigurinë e individëve.',
      'Redaksia shmang publikimin e të dhënave personale, imazheve të ndjeshme ose detajeve identifikuese kur ato nuk janë të domosdoshme për interesin publik. Kujdes i veçantë tregohet në raportimet që përfshijnë fëmijë, viktima, persona të cenueshëm dhe raste tragjike.',
    ],
  },
  {
    title: '7. Konflikti i interesit',
    paragraphs: [
      'Gazetarët, redaktorët dhe bashkëpunëtorët duhet të shmangin situatat që mund të ndikojnë, ose të perceptohen se ndikojnë, në paanshmërinë e raportimit.',
      'Çdo konflikt i mundshëm interesi duhet t’i bëhet i ditur redaksisë dhe të menaxhohet në mënyrë transparente.',
    ],
  },
  {
    title: '8. Ankesat dhe kontakti',
    paragraphs: [
      'Lexuesit, dëgjuesit dhe palët e përmendura në raportimet tona mund të paraqesin ankesa, kërkesa për korrigjim ose sqarime editoriale duke kontaktuar redaksinë në: rtvfontana@gmail.com.',
    ],
  },
];

export default function EditorialGuidelinesPage() {
  return (
    <LegalPageLayout
      title="Udhëzimet Editoriale"
      summary="Këto udhëzime përcaktojnë parimet që udhëheqin punën editoriale të RTV Fontana në mbledhjen, verifikimin, publikimin dhe korrigjimin e lajmeve."
      lastUpdated="10 maj 2026"
      sections={sections}
    />
  );
}
