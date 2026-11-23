import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Headphones, Sparkles } from 'lucide-react';
import AdSenseBanner from '@/components/AdSenseBanner';
import { RECITERS_CATALOG } from '@/data/reciters-catalog';

export const metadata: Metadata = {
  title: 'عن التطبيق وقصة سورة يوسف · بسم الله',
  description:
    'تعرف على فكرة تطبيق بسم الله، محطات قصة نبي الله يوسف عليه السلام، وأصوات القراء المختارين للتلاوات الخاشعة.',
};

const YUSUF_CHAPTERS = [
  {
    title: '١. رؤيا الكواكب والشمس والقمر',
    verses: 'الآيات ١ – ٦',
    summary:
      'استهلال السورة برؤيا يوسف عليه السلام في طفولته تحت سماء مرصّعة بأحد عشر كوكباً، وبشارة النبوة والاصطفاء الإلهي.',
  },
  {
    title: '٢. غيابت الجب والصبر الأول',
    verses: 'الآيات ٧ – ٢٠',
    summary:
      'محنة إلقاء يوسف في البئر، ولطف الله به وسط الظلمة حتى تلتقطه القافلة المسافرة إلى أرض مصر.',
  },
  {
    title: '٣. قصر العزيز وبداية الابتلاء',
    verses: 'الآيات ٢١ – ٣٢',
    summary:
      'تمكين الله ليوسف في بيت عزيز مصر، وثباته أمام الفتنة بالاعتصام بالله والعفة والنزاهة.',
  },
  {
    title: '٤. السجن والدعوة إلى التوحيد',
    verses: 'الآيات ٣٣ – ٤٢',
    summary:
      'اختيار السجن على المعصية، وتحويل ظلمة الزنزانة إلى منبر للدعوة إلى الله وتعبير الرؤى.',
  },
  {
    title: '٥. تأويل رؤيا السبع السمان والسبع العجاف',
    verses: 'الآيات ٤٣ – ٥٧',
    summary:
      'رؤيا الملك التي فتحت أبواب الفرج وإعلان البراءة، ثم تولي خزائن الأرض بالتخطيط والأمانة.',
  },
  {
    title: '٦. قدوم الإخوة وميزان العدل',
    verses: 'الآيات ٥٨ – ٨٦',
    summary:
      'توالي السنوات العجاف، ومجيء إخوة يوسف طلباً للميرة، وحكمة التدبير لإرجاع بنيامين واختبار القلوب.',
  },
  {
    title: '٧. لحظة التمكين ورفع البلاء',
    verses: 'الآيات ٨٧ – ١٠٠',
    summary:
      'انكشاف الحقيقة بقوله تعالى: أأنا يوسف وهذا أخي، والعفو الكريم، وارتداد بصر يعقوب بالقميص، واجتماع الشمل.',
  },
  {
    title: '٨. فجر التلاقي وخاتمة العبر',
    verses: 'الآيات ١٠١ – ١١١',
    summary:
      'مناجاة يوسف لربه بالشكر والثبات على الإسلام، وختام السورة بعبرة أولي الألباب وتأكيد صدق الوحي.',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-[100dvh] bg-[#050608] text-amber-50 px-4 sm:px-8 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl border border-amber-300/30 bg-amber-400/10 text-amber-200 hover:bg-amber-400/20 text-sm transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة إلى شاشة التلاوة</span>
          </Link>
          <span
            dir="ltr"
            className="text-xs font-semibold tracking-[0.25em] text-amber-300/75"
          >
            MRJOO World
          </span>
        </div>

        <header className="mb-10 border-b border-amber-200/10 pb-8">
          <p className="text-xs sm:text-sm text-amber-300/80 mb-2">
            عن التطبيق · رسالة وأثر
          </p>
          <h1 className="font-quran text-4xl sm:text-5xl font-bold text-amber-50 mb-4 leading-tight">
            تطبيق بسم الله للتلاوات والمشاهد القرآنية
          </h1>
          <p className="text-sm sm:text-base text-amber-100/80 leading-relaxed">
            صُمم تطبيق «بسم الله» ليكون رفيقاً هادئاً وخفيفاً على الهاتف، يجمع بين
            خشوع التلاوة القرآنية وصفاء المشاهد الطبيعية المتداخلة التي تواكب معاني
            الآيات وتساعد القلب على التدبر والسكينة، مع إتاحة التشغيل المحلي دون
            تعقيد أو أزرار مزعجة أثناء الاستماع.
          </p>
        </header>

        <section className="mb-12">
          <div className="flex items-center gap-2.5 mb-5">
            <BookOpen className="w-5 h-5 text-amber-300" />
            <h2 className="text-xl sm:text-2xl font-bold text-amber-100">
              محطات قصة سورة يوسف عليه السلام
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {YUSUF_CHAPTERS.map((chapter) => (
              <article
                key={chapter.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-bold text-amber-200 text-base">
                    {chapter.title}
                  </h3>
                  <span className="text-xs text-amber-300/70 shrink-0">
                    {chapter.verses}
                  </span>
                </div>
                <p className="text-sm text-amber-100/75 leading-relaxed">
                  {chapter.summary}
                </p>
              </article>
            ))}
          </div>
        </section>

        <AdSenseBanner className="my-10" />

        <section className="mb-12">
          <div className="flex items-center gap-2.5 mb-5">
            <Headphones className="w-5 h-5 text-amber-300" />
            <h2 className="text-xl sm:text-2xl font-bold text-amber-100">
              كوكبة القراء المختارين
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RECITERS_CATALOG.map((reciter) => (
              <article
                key={reciter.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <h3 className="font-bold text-amber-200 text-base mb-1">
                  {reciter.nameAr}
                </h3>
                <p className="text-xs sm:text-sm text-amber-100/70 leading-relaxed mb-2">
                  {reciter.descriptorAr}
                </p>
                <p className="text-xs text-amber-300/75">
                  السور المتوفرة: {reciter.tracks.map((t) => t.titleAr).join(' · ')}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-amber-300/15 bg-amber-400/[0.04] p-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <h2 className="text-lg font-bold text-amber-100">
              تجربة خفيفة للجميع
            </h2>
          </div>
          <p className="text-sm text-amber-100/80 leading-relaxed">
            يعمل التطبيق كتطبيق ويب تقدمي (PWA) يمكن تثبيته مباشرة على شاشة
            الهاتف ليعمل بسلاسة وخفة، مع حفظ التلاوات المحلية الأساسية للاستماع في
            أي وقت.
          </p>
        </section>

        <footer className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-amber-100/60">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-amber-200 transition-colors">
              الرئيسية
            </Link>
            <Link
              href="/privacy"
              className="hover:text-amber-200 transition-colors"
            >
              سياسة الخصوصية
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
