import { Metadata } from 'next';
import { Suspense } from 'react';
import LajmeClient from './LajmeClient';

export const metadata: Metadata = {
  title: 'Lajme',
  description: 'Lajmet e fundit nga Peja, Kosova dhe bota. Sport, Teknologji, Showbiz dhe më shumë.',
};

export default function LajmePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <LajmeClient />
    </Suspense>
  );
}
