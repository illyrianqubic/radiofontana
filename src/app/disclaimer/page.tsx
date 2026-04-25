import type { Metadata } from 'next';
import LegalPageLayout, { type LegalSection } from '@/components/shared/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Mohim Përgjegjësie | Radio Fontana',
  description:
    'Mohimi i përgjegjësisë ligjore për përmbajtjen, shërbimet dhe informacionet e publikuara nga Radio Fontana. Lexoni kushtet e detajuara.',
  alternates: { canonical: 'https://radiofontana.org/disclaimer' },
  robots: { index: true, follow: false },
};

const sections: LegalSection[] = [
  {
    title: '1. Qëllimi i informacionit',
    paragraphs: [
      'Përmbajtja e publikuar nga Radio Fontana ofrohet për qëllime informuese dhe mediale. Ne synojmë saktësi dhe përditësim të vazhdueshëm, por nuk garantojmë që çdo informacion do të jetë gjithmonë i plotë, pa gabime ose i përditësuar në çdo moment.',
    ],
  },
  {
    title: '2. Jo këshillë profesionale',
    paragraphs: [
      'Asnjë material në këtë faqe ose aplikacion nuk përbën këshillë ligjore, financiare, mjekësore apo profesionale. Për vendime të rëndësishme, konsultohuni me profesionistë të licencuar.',
    ],
  },
  {
    title: '3. Përmbajtja editoriale',
    paragraphs: [
      'Qëndrimet e shprehura në intervista, komente ose materiale të dërguara nga palë të treta i përkasin autorëve të tyre dhe jo domosdoshmërisht qëndrimit zyrtar të Radio Fontana.',
    ],
  },
  {
    title: '4. Lidhje dhe përmbajtje e palëve të treta',
    paragraphs: [
      'Platformat tona mund të përmbajnë lidhje të jashtme për lehtësi të përdoruesit. Radio Fontana nuk kontrollon dhe nuk mban përgjegjësi për përmbajtjen, sigurinë ose politikat e privatësisë së faqeve të palëve të treta.',
    ],
  },
  {
    title: '5. Disponueshmëria e shërbimit',
    paragraphs: [
      'Transmetimi live, faqja dhe aplikacioni mund të ndërpriten për mirëmbajtje, probleme teknike ose arsye jashtë kontrollit tonë. Ne nuk garantojmë funksionim të pandërprerë 24/7 në çdo rrethanë.',
    ],
  },
  {
    title: '6. Kufizimi i përgjegjësisë',
    paragraphs: [
      'Në masën e lejuar nga ligji, Radio Fontana nuk mban përgjegjësi për dëme direkte ose indirekte që mund të lindin nga përdorimi ose pamundësia e përdorimit të shërbimeve tona.',
    ],
  },
  {
    title: '7. Të drejtat e autorit',
    paragraphs: [
      'Përmbajtja e Radio Fontana mbrohet nga të drejtat e autorit dhe legjislacioni i pronës intelektuale. Përdorimi i paautorizuar i materialeve mund të sjellë pasoja ligjore.',
    ],
  },
  {
    title: '8. Ndryshimet në këtë mohim përgjegjësie',
    paragraphs: [
      'Ky dokument mund të përditësohet periodikisht. Versioni i publikuar në këtë faqe konsiderohet versioni aktual në fuqi.',
    ],
  },
  {
    title: '9. Kontakt',
    paragraphs: [
      'Për pyetje lidhur me këtë dokument: rtvfontana@gmail.com.',
    ],
  },
];

export default function DisclaimerPage() {
  return (
    <LegalPageLayout
      title="Mohim Përgjegjësie"
      summary="Ky dokument shpjegon kufijtë e përgjegjësisë së Radio Fontana për përmbajtjen, lidhjet e jashtme dhe funksionimin e shërbimeve digjitale."
      lastUpdated="24 prill 2026"
      sections={sections}
    />
  );
}