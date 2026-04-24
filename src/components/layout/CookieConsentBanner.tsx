'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const COOKIE_CONSENT_KEY = 'rf_cookie_consent';

export default function CookieConsentBanner() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      let hasAccepted = false;

      try {
        const storedConsent = window.localStorage.getItem(COOKIE_CONSENT_KEY);
        hasAccepted = storedConsent === 'accepted';
      } catch {
        // Ignore localStorage access issues in restrictive environments.
      }

      setAccepted(hasAccepted);
      setReady(true);
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  const handleAccept = () => {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    } catch {
      // Ignore storage write issues; still hide banner for this session.
    }
    setAccepted(true);
  };

  if (pathname.startsWith('/studio')) {
    return null;
  }

  if (!ready || accepted) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-[104px] sm:bottom-[112px] z-[9998] px-3 sm:px-4">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white shadow-[0_18px_44px_rgba(15,23,42,0.16)] p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Ne përdorim cookies për të përmirësuar përvojën tuaj. Duke vazhduar, pranoni përdorimin e cookies.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 sm:flex-shrink-0">
            <button
              type="button"
              onClick={handleAccept}
              className="touch-target min-h-11 inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition-colors"
            >
              Pranoj
            </button>

            <Link
              href="/cookies"
              className="touch-target min-h-11 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              Më shumë info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}