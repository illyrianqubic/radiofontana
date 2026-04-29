'use client';

import { useEffect, useState } from 'react';
import { formatAlbanianDate, timeAgo } from '@/lib/utils';

interface Props {
  dateString: string;
  /**
   * When `mode='relative'` (default) the component renders the absolute
   * Albanian date during SSR and the first client paint, then switches to a
   * relative "X orë më parë" string after mount. This avoids the React 19
   * hydration mismatch caused by `Date.now()` differing between build time
   * and the visitor's clock.
   *
   * When `mode='absolute'` it always renders `formatAlbanianDate`, but the
   * formatting is computed in UTC on both sides (see utils.ts) so it is
   * timezone-stable.
   */
  mode?: 'relative' | 'absolute';
  className?: string;
}

export default function TimeAgo({ dateString, mode = 'relative', className }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const text =
    mode === 'absolute' || !mounted
      ? formatAlbanianDate(dateString)
      : timeAgo(dateString);

  return (
    <span className={className} suppressHydrationWarning>
      {text}
    </span>
  );
}
