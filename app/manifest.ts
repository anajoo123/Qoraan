import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'بسم الله',
    short_name: 'بسم الله',
    description:
      'تطبيق خفيف للتلاوات القرآنية الخاشعة مع مشاهد واقعية متحركة تشرح الصدر.',
    start_url: '/',
    scope: '/',
    dir: 'rtl',
    lang: 'ar',
    display: 'standalone',
    orientation: 'any',
    background_color: '#050608',
    theme_color: '#050608',
    icons: [
      {
        src: '/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
