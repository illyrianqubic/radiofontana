import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 page-shell">
      <div className="mb-8">
        <Image
          src="/logortvfontana.jpg"
          alt="Radio Fontana"
          width={100}
          height={100}
          className="rounded-full object-cover mx-auto shadow-lg"
          priority
        />
      </div>
      <h1 className="text-6xl sm:text-7xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-slate-900 mb-4">Faqja nuk u gjet</h2>
      <p className="text-slate-500 mb-8 max-w-sm">
        Faqja që po kërkoni nuk ekziston ose është zhvendosur.
      </p>
      <Link
        href="/"
        className="touch-target inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors min-h-11"
      >
        Kthehu në Kryefaqe
      </Link>
    </div>
  );
}
