import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Amiri, Tajawal } from 'next/font/google';
import './globals.css';

const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-4557222726740441';

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
  title: 'بسم الله · تلاوات ومشاهد قرآنية',
  description:
    'تطبيق خفيف للتلاوات القرآنية الخاشعة مع مشاهد واقعية متحركة تشرح الصدر.',
  other: {
    'google-adsense-account': ADSENSE_CLIENT,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'بسم الله',
  },
  icons: {
    icon: [
      { url: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: 'بسم الله · تلاوات ومشاهد قرآنية',
    description:
      'تطبيق خفيف للتلاوات القرآنية الخاشعة مع مشاهد واقعية متحركة تشرح الصدر.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'بسم الله · تلاوات ومشاهد قرآنية',
    description:
      'تطبيق خفيف للتلاوات القرآنية الخاشعة مع مشاهد واقعية متحركة تشرح الصدر.',
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
        className="min-h-[100dvh] bg-[#050608] text-amber-50 antialiased selection:bg-amber-500/30"
      >
        {children}
        <Script
          id="google-adsense"
          async
          strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
