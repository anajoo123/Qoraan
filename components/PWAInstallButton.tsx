'use client';

import { useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';

export default function PWAInstallButton() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="mt-5 inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-amber-300/30 text-amber-100 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
      >
        <Download className="w-4 h-4 text-amber-300" />
        <span>تثبيت تطبيق «بسم الله» على الهاتف</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="mt-5 inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-amber-300/30 text-amber-100 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Share className="w-4 h-4 text-amber-300" />
          <span>تثبيت تطبيق «بسم الله» على الآيفون</span>
        </button>

        {showIOSGuide && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-5"
          >
            <div className="w-full max-w-sm rounded-2xl bg-stone-950 border border-amber-300/20 p-6 text-right shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <h2
                  id="ios-install-title"
                  className="text-base font-bold text-amber-50"
                >
                  تثبيت تطبيق «بسم الله»
                </h2>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label="إغلاق"
                  className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-amber-100/70 hover:text-amber-50 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm leading-relaxed text-amber-100/80 mb-5">
                ١. اضغط على زر <strong>المشاركة (Share)</strong> أسفل متصفح سفاري.
                <br />
                ٢. اختر <strong>إضافة إلى الشاشة الرئيسية (Add to Home Screen)</strong> ليُحفظ التطبيق باسم <strong>بسم الله</strong>.
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full min-h-[44px] rounded-xl bg-amber-400 text-stone-950 font-bold text-sm hover:bg-amber-300 transition-colors cursor-pointer"
              >
                تم
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}
