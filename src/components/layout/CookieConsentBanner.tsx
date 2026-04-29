'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const COOKIE_CONSENT_KEY = 'rf_cookie_consent';

type ConsentDecision = 'accepted' | 'rejected' | null;

type GtagFn = (...args: unknown[]) => void;

function updateGtagConsent(decision: 'accepted' | 'rejected') {
  try {
    const w = window as unknown as { gtag?: GtagFn; dataLayer?: unknown[] };
    if (typeof w.gtag !== 'function') {
      // Fallback: push directly to dataLayer if gtag bootstrap hasn't run yet
      w.dataLayer = w.dataLayer || [];
      w.gtag = ((...args: unknown[]) => {
        (w.dataLayer as unknown[]).push(args);
      }) as GtagFn;
    }
    const value = decision === 'accepted' ? 'granted' : 'denied';
    w.gtag('consent', 'update', {
      ad_storage: value,
      ad_user_data: value,
      ad_personalization: value,
      analytics_storage: value,
      functionality_storage: value,
      personalization_storage: value,
    });
  } catch {
    // ignore
  }
}

export default function CookieConsentBanner() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [decision, setDecision] = useState<ConsentDecision>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      let stored: ConsentDecision = null;

      try {
        const value = window.localStorage.getItem(COOKIE_CONSENT_KEY);
        if (value === 'accepted' || value === 'rejected') {
          stored = value;
        }
      } catch {
        // Ignore localStorage access issues in restrictive environments.
      }

      setDecision(stored);
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
    updateGtagConsent('accepted');
    setDecision('accepted');
  };

  const handleReject = () => {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
    } catch {
      // Ignore storage write issues; still hide banner for this session.
    }
    updateGtagConsent('rejected');
    setDecision('rejected');
  };

  if (pathname.startsWith('/studio')) {
    return null;
  }

  if (!ready || decision !== null) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[10050] px-3 sm:px-4 pb-[calc(env(safe-area-inset-bottom)+7rem)] sm:pb-[calc(env(safe-area-inset-bottom)+7.5rem)] pointer-events-none">
      <div className="mx-auto max-w-5xl rounded-2xl border border-slate-700/80 bg-[#0f172a] text-white shadow-[0_16px_42px_rgba(2,6,23,0.55)] p-4 sm:p-5 pointer-events-auto">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-5">
          <p className="text-sm sm:text-base text-slate-100 leading-relaxed md:max-w-3xl">
            Ne përdorim cookies për të përmirësuar përvojën tuaj. Mund të pranoni ose refuzoni cookies analitike. Cookies thelbësore përdoren gjithmonë për funksionim bazë.
          </p>

          <div className="flex w-full flex-col gap-2.5 md:w-auto md:flex-row md:items-center md:flex-shrink-0">
            <button
              type="button"
              onClick={handleAccept}
              className="touch-target min-h-11 w-full md:w-auto inline-flex items-center justify-center rounded-xl bg-[#dc2626] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#b91c1c] transition-colors"
            >
              Pranoj
            </button>

            <button
              type="button"
              onClick={handleReject}
              className="touch-target min-h-11 w-full md:w-auto inline-flex items-center justify-center rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-2.5 text-sm font-bold text-slate-100 hover:text-white hover:border-slate-500 hover:bg-slate-700/70 transition-colors"
            >
              Refuzo
            </button>

            <Link
              href="/cookies"
              className="touch-target min-h-11 w-full md:w-auto inline-flex items-center justify-center rounded-xl border border-slate-600 bg-slate-800/40 px-4 py-2.5 text-sm font-semibold text-slate-100 hover:text-white hover:border-slate-500 hover:bg-slate-700/70 transition-colors"
            >
              Më shumë info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}