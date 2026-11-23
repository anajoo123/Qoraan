import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية · بسم الله',
  description:
    'سياسة الخصوصية واستخدام ملفات تعريف الارتباط والإعلانات في تطبيق بسم الله للتلاوات والمشاهد القرآنية.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-[100dvh] bg-[#050608] text-amber-50 px-4 sm:px-8 py-10 sm:py-16">
      <div className="max-w-3xl mx-auto">
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
            <ShieldCheck className="w-4 h-4" />
            <span>الخصوصية والشفافية</span>
          </div>
          <h1 className="font-quran text-3xl sm:text-5xl font-bold text-amber-50">
            سياسة الخصوصية
          </h1>
          <p className="mt-2 text-xs text-amber-100/55">
            آخر تحديث: ٢٢ نوفمبر ٢٠٢٦
          </p>
        </header>

        <div className="space-y-6 text-sm sm:text-base text-amber-100/80 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-amber-200 mb-2">
              ١. احترام خصوصية الزوار
            </h2>
            <p>
              لا يطلب تطبيق «بسم الله» تسجيل حساب أو إدخال بيانات شخصية حساسة
              للاستماع إلى القرآن الكريم. يعتمد التطبيق على تشغيل التلاوات مباشرة
              مع توفير تجربة عرض سينمائية هادئة.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-amber-200 mb-2">
              ٢. الإعلانات وخدمة Google AdSense
            </h2>
            <p>
              يستخدم هذا الموقع خدمة الإعلانات التابعة لشركة Google (Google
              AdSense) لدعم استمرار تشغيل التطبيق وتطويره مجاناً. قد تستخدم شركة
              Google وشركاؤها ملفات تعريف الارتباط (مثل ملف DART) لعرض إعلانات
              تستند إلى زيارات المستخدمين لهذا الموقع أو مواقع أخرى على الإنترنت.
            </p>
            <p className="mt-2">
              لا يتم عرض أي إعلانات فوق نصوص الآيات القرآنية أو أثناء وضع الاستماع
              بملء الشاشة، حفاظاً على قدسية التلاوة وراحة المستخدم.
            </p>
            <p className="mt-2">
              يمكنك في أي وقت إدارة تفضيلات الإعلانات أو إيقاف الإعلانات المخصصة
              عبر صفحة إعدادات إعلانات Google على الرابط:{' '}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 underline underline-offset-4 hover:text-amber-200"
              >
                adssettings.google.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-amber-200 mb-2">
              ٣. التخزين المحلي (PWA Cache)
            </h2>
            <p>
              يستخدم التطبيق تقنية التخزين المؤقت للمتصفح (Service Worker) لحفظ
              ملفات الواجهة والتلاوات الصوتية الأساسية محلياً على جهازك، مما يسرّع
              التحميل ويقلل استهلاك باقة الإنترنت على الهاتف.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-amber-200 mb-2">
              ٤. ملفات السجل والروابط الخارجية
            </h2>
            <p>
              قد تتصل بعض التلاوات الصوتية بخوادم صوتية موثوقة (مثل MP3Quran أو
              Way2Quran) لبث التلاوة المختارة بجودة عالية، وتخضع تلك الطلبات
              لمعايير الأمان القياسية عبر بروتوكول HTTPS.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-amber-200 mb-2">
              ٥. التواصل والاستفسارات
            </h2>
            <p>
              لأي استفسار حول سياسة الخصوصية أو الإبلاغ عن أي مشكلة، يرجى مراسلتنا
              على البريد الإلكتروني:{' '}
              <a
                href="mailto:mryosif123@gmail.com"
                dir="ltr"
                className="text-amber-300 underline underline-offset-4 hover:text-amber-200"
              >
                mryosif123@gmail.com
              </a>
            </p>
          </section>
        </div>

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
              href="/contact"
              className="hover:text-amber-200 transition-colors"
            >
              تواصل معنا
            </Link>
          </div>
          <span>MRJOO World · اترك أثر طيب · لنا لقاء آخر</span>
        </footer>
      </div>
    </main>
  );
}
