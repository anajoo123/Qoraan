'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-4557222726740441';

interface AdSenseBannerProps {
  slotId?: string;
  className?: string;
}

export default function AdSenseBanner({
  slotId = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID,
  className = '',
}: AdSenseBannerProps) {
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!slotId || pushedRef.current) return;
    pushedRef.current = true;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Ignore ad-blocker or unapproved-domain script errors gracefully
    }
  }, [slotId]);

  if (!slotId) {
    return null;
  }

  return (
    <aside
      aria-label="مساحة إعلانية"
      className={`w-full max-w-2xl mx-auto text-center ${className}`}
    >
      <p className="text-[10px] text-amber-100/35 mb-1.5 tracking-wide">
        إعلان داعم لاستمرار التطبيق
      </p>
      <div className="overflow-hidden rounded-xl border border-amber-200/10 bg-black/30 min-h-[60px] flex items-center justify-center">
        <ins
          className="adsbygoogle block w-full"
          style={{ display: 'block' }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
}
