import type { Metadata } from 'next';
import LegalPageLayout, { type LegalSection } from '@/components/shared/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Të Drejtat GDPR | Radio Fontana',
  description:
    'Të drejtat tuaja sipas GDPR te Radio Fontana — qasja, korrigjimi, fërja dhe bartësia e të dhënave personale. Informacion i plotë.',
  alternates: { canonical: 'https://radiofontana.org/gdpr' },
  robots: { index: true, follow: false },
};

const sections: LegalSection[] = [
  {
    title: '1. Qëllimi i kësaj faqeje',
    paragraphs: [
      'Kjo faqe përmbledh të drejtat tuaja sipas Rregullores së Përgjithshme për Mbrojtjen e të Dhënave (GDPR) dhe mënyrën se si mund t’i ushtroni këto të drejta ndaj Radio Fontana.',
    ],
  },
  {
    title: '2. Kontrolluesi i të dhënave',
    paragraphs: [
      'Kontrollues i të dhënave për shërbimet në radiofontana.org dhe aplikacionin Android të Radio Fontana është Radio Fontana, me seli në Istog, Kosovë.',
      'Kontakt për kërkesa GDPR: rtvfontana@gmail.com.',
    ],
  },
  {
    title: '3. Të drejtat tuaja kryesore sipas GDPR',
    bullets: [
      'E drejta e informimit për mënyrën e përpunimit të të dhënave tuaja.',
      'E drejta e qasjes në të dhënat që mbajmë për ju.',
      'E drejta e korrigjimit të të dhënave të pasakta ose të paplota.',
      'E drejta e fshirjes së të dhënave, kur plotësohen kushtet ligjore.',
      'E drejta e kufizimit të përpunimit në rrethana të caktuara.',
      'E drejta e bartjes së të dhënave në format të strukturuar.',
      'E drejta e kundërshtimit të përpunimit të bazuar në interes legjitim.',
      'E drejta për të mos iu nënshtruar vendimmarrjes vetëm automatike, kur zbatohet.',
      'E drejta për të tërhequr pëlqimin në çdo kohë kur përpunimi bazohet në pëlqim.',
    ],
  },
  {
    title: '4. Si të paraqisni kërkesë GDPR',
    paragraphs: [
      'Për të ushtruar të drejtat tuaja, dërgoni kërkesë në rtvfontana@gmail.com me subjektin “Kërkesë GDPR”.',
    ],
    bullets: [
      'Përshkruani qartë të drejtën që dëshironi të ushtroni.',
      'Përfshini emrin tuaj dhe mënyrën e kontaktit.',
      'Na tregoni mënyrën e preferuar për përgjigje.',
    ],
  },
  {
    title: '5. Afati i përgjigjes',
    paragraphs: [
      'Ne synojmë të përgjigjemi brenda 30 ditëve kalendarike nga marrja e kërkesës së vlefshme. Në raste komplekse, afati mund të zgjatet sipas ligjit, dhe ju njoftoheni paraprakisht.',
    ],
  },
  {
    title: '6. Baza ligjore e përpunimit',
    bullets: [
      'Pëlqimi juaj për aktivitete specifike (p.sh. cookies jo thelbësore).',
      'Interesi legjitim për siguri, administrim teknik dhe përmirësim të shërbimit.',
      'Ekzekutimi i shërbimit kur ju na kontaktoni ose dërgoni materiale.',
      'Detyrime ligjore kur kërkohet nga organet kompetente.',
    ],
  },
  {
    title: '7. Transferimi dhe ruajtja e të dhënave',
    paragraphs: [
      'Të dhënat mund të përpunohen nga ofrues teknikë të besuar vetëm për qëllime operacionale dhe nën masa të përshtatshme kontraktuale të mbrojtjes së të dhënave.',
      'Të dhënat ruhen vetëm për periudhën e nevojshme për qëllimin përkatës ose sipas kërkesave ligjore.',
    ],
  },
  {
    title: '8. E drejta e ankesës',
    paragraphs: [
      'Nëse mendoni se përpunimi i të dhënave tuaja nuk është në përputhje me ligjin, ju keni të drejtë të paraqisni ankesë te autoriteti kompetent për mbrojtjen e të dhënave personale.',
    ],
  },
  {
    title: '9. Kontakt',
    paragraphs: [
      'Për çdo çështje lidhur me GDPR dhe privatësinë: rtvfontana@gmail.com.',
    ],
  },
];

export default function GdprPage() {
  return (
    <LegalPageLayout
      title="Të Drejtat GDPR"
      summary="Këtu gjeni të drejtat tuaja për mbrojtjen e të dhënave personale dhe mënyrën praktike për paraqitjen e kërkesave te Radio Fontana."
      lastUpdated="24 prill 2026"
      sections={sections}
    />
  );
}