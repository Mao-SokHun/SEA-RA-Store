import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://sea-ra-prestige.vercel.app'),
  title: {
    default: 'SEA RA PRESTIGE - បញ្ចូលលុយហ្គេម ០% សេវា តាមរយៈ Bakong KHQR',
    template: '%s • SEA RA PRESTIGE',
  },
  description:
    'បញ្ចូលពេជ្រ Mobile Legends, Roblox Robux, Free Fire, PUBG Mobile, Genshin Impact និង 15+ ហ្គេមល្បីៗភ្លាមៗក្នុងរយៈពេល < 3 វិនាទី តាមរយៈ Bakong KHQR ០% ថ្លៃសេវា។ មិនបាច់ប្រើ Password!',
  keywords: [
    'SEA RA PRESTIGE',
    'បញ្ចូលលុយហ្គេម',
    'Bakong KHQR',
    'Mobile Legends Diamonds Cambodia',
    'Robux Cambodia',
    'Free Fire Diamonds',
    'PUBG UC Cambodia',
    'Smile One Cambodia',
    'Top Up Game Cambodia',
  ],
  authors: [{ name: 'SEA RA PRESTIGE' }],
  openGraph: {
    title: 'SEA RA PRESTIGE - បញ្ចូលលុយហ្គេម ០% សេវា តាមរយៈ Bakong KHQR',
    description:
      'បញ្ចូលពេជ្រ និងកាក់ហ្គេមស្វ័យប្រវត្តិតាម Bakong KHQR ០% សេវា មិនបាច់ Password ពេជ្រចូលគណនីក្នុងរយៈពេល < 3 វិនាទី!',
    url: 'https://sea-ra-prestige.vercel.app',
    siteName: 'SEA RA PRESTIGE',
    images: [
      {
        url: '/logo.png',
        width: 1024,
        height: 1024,
        alt: 'SEA RA PRESTIGE Official Gaming Reload Logo',
      },
    ],
    locale: 'km_KH',
    type: 'website',
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEA RA PRESTIGE - បញ្ចូលលុយហ្គេម ០% សេវា តាមរយៈ Bakong KHQR',
    description:
      'បញ្ចូលពេជ្រ និងកាក់ហ្គេមស្វ័យប្រវត្តិតាម Bakong KHQR ០% សេវា មិនបាច់ Password ពេជ្រចូលគណនីក្នុងរយៈពេល < 3 វិនាទី!',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="km" className="overflow-x-hidden max-w-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;800;900&family=Oxanium:wght@700;800&family=Kantumruy+Pro:ital,wght@0,300..700;1,300..700&family=Koulen&family=Battambang:wght@400;700;900&family=Plus+Jakarta+Sans:ital,wght@0,400..800;1,400..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen text-white antialiased flex flex-col justify-between selection:bg-[#E5B55E] selection:text-black leading-relaxed overflow-x-hidden w-full max-w-full">
        <AppProvider>
          {/* Global Sticky Luxury Navbar */}
          <Navbar />

          {/* Main Application Container */}
          <main className="flex-1 w-full max-w-full overflow-x-hidden">{children}</main>

          {/* Global Luxury Footer */}
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
