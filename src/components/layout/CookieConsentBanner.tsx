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
    <div className="fixed inset-x-0 bottom-0 z-[10050] px-3 sm:px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-5xl rounded-2xl border border-slate-700/80 bg-[#0f172a] text-white shadow-[0_16px_42px_rgba(2,6,23,0.55)] p-4 sm:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-5">
          <p className="text-sm sm:text-base text-slate-100 leading-relaxed md:max-w-3xl">
            Ne përdorim cookies për të përmirësuar përvojën tuaj. Duke vazhduar, pranoni përdorimin e cookies.
          </p>

          <div className="flex w-full flex-col gap-2.5 md:w-auto md:flex-row md:items-center md:flex-shrink-0">
            <button
              type="button"
              onClick={handleAccept}
              className="touch-target min-h-11 w-full md:w-auto inline-flex items-center justify-center rounded-xl bg-[#dc2626] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#b91c1c] transition-colors"
            >
              Pranoj
            </button>

            <Link
              href="/cookies"
              className="touch-target min-h-11 w-full md:w-auto inline-flex items-center justify-center rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-2.5 text-sm font-semibold text-slate-100 hover:text-white hover:border-slate-500 hover:bg-slate-700/70 transition-colors"
            >
              Më shumë info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}