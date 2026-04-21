import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Radio Fontana - Lajmet e Fundit nga Peja dhe Kosova',
  description:
    'Lajmet e fundit, analizat dhe raportimet ekskluzive nga Radio Fontana, stacioni kryesor i informacionit në Pejë.',
};

export default function HomePage() {
  return <HomeClient />;
}
