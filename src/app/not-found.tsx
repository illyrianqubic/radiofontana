import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-7xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-white mb-4">Faqja nuk u gjet</h2>
      <p className="text-gray-400 mb-8">
        Faqja që po kërkoni nuk ekziston ose është zhvendosur.
      </p>
      <Link
        href="/"
        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        Kthehu në Kryefaqe
      </Link>
    </div>
  );
}
