import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Mail, MessageSquareHeart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'تواصل معنا · بسم الله',
  description:
    'التواصل مع فريق MRJOO World المشرف على تطبيق بسم الله للتلاوات والمشاهد القرآنية.',
};

export default function ContactPage() {
  return (
    <main className="min-h-[100dvh] bg-[#050608] text-amber-50 px-4 sm:px-8 py-10 sm:py-16">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl border border-amber-300/30 bg-amber-400/10 text-amber-200 hover:bg-amber-400/20 text-sm transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة إلى التطبيق</span>
          </Link>
          <span
            dir="ltr"
            className="text-xs font-semibold tracking-[0.25em] text-amber-300/75"
          >
            MRJOO World
          </span>
        </div>

        <header className="mb-8 border-b border-amber-200/10 pb-6">
          <div className="flex items-center gap-2 text-amber-300 text-xs sm:text-sm mb-2">
            <MessageSquareHeart className="w-4 h-4" />
            <span>يسعدنا تواصلكم واقتراحاتكم</span>
          </div>
          <h1 className="font-quran text-3xl sm:text-5xl font-bold text-amber-50">
            تواصل معنا
          </h1>
        </header>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 space-y-5">
          <p className="text-sm sm:text-base text-amber-100/80 leading-relaxed">
            إن كان لديكم اقتراح لإضافة قارئ أو سورة جديدة، أو ملاحظة فنية حول جودة
            البث أو العرض، يسعدنا استقبال رسائلكم والرد عليها في أقرب وقت.
          </p>

          <div className="rounded-xl border border-amber-300/20 bg-amber-400/[0.05] p-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-amber-300 shrink-0" />
              <div>
                <p className="text-xs text-amber-200/70">البريد الإلكتروني الرسمي</p>
                <a
                  href="mailto:mryosif123@gmail.com"
                  dir="ltr"
                  className="text-sm sm:text-base font-medium text-amber-100 hover:text-amber-300 transition-colors"
                >
                  mryosif123@gmail.com
                </a>
              </div>
            </div>
            <span dir="ltr" className="text-xs tracking-[0.2em] text-amber-300/75">
              MRJOO World
            </span>
          </div>
        </section>

        <footer className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-amber-100/60">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-amber-200 transition-colors">
              الرئيسية
            </Link>
            <Link
              href="/about"
              className="hover:text-amber-200 transition-colors"
            >
              عن التطبيق
            </Link>
            <Link
              href="/privacy"
              className="hover:text-amber-200 transition-colors"
            >
              سياسة الخصوصية
            </Link>
          </div>
          <span>اترك أثر طيب · لنا لقاء آخر</span>
        </footer>
      </div>
    </main>
  );
}
