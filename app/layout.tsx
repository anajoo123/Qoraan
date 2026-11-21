import type { Metadata, Viewport } from 'next';
import { Amiri, Tajawal } from 'next/font/google';
import './globals.css';

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
});

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  variable: '--font-tajawal',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'سورة يوسف · القارئ عبدالرحمن مسعد',
  description:
    'شاشة عرض سينمائية لمناظر واقعية تحكي قصة سيدنا يوسف عليه السلام مع تلاوة خاشعة بصوت القارئ عبدالرحمن مسعد وكتابة الآيات تلقائياً أثناء القراءة.',
  openGraph: {
    title: 'سورة يوسف · القارئ عبدالرحمن مسعد',
    description:
      'شاشة عرض سينمائية لمناظر واقعية تحكي قصة سيدنا يوسف عليه السلام مع تلاوة خاشعة بصوت القارئ عبدالرحمن مسعد.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'سورة يوسف · القارئ عبدالرحمن مسعد',
    description:
      'شاشة عرض سينمائية لمناظر واقعية تحكي قصة سيدنا يوسف عليه السلام مع تلاوة خاشعة بصوت القارئ عبدالرحمن مسعد.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#050608',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${amiri.variable} ${tajawal.variable} dark`}
    >
      <body
        suppressHydrationWarning
        className="bg-[#050608] text-amber-50 antialiased selection:bg-amber-500/30 overflow-hidden"
      >
        {children}
      </body>
    </html>
  );
}
