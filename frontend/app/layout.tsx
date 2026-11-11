import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'SEA RA Prestige • Official In-Game Top-Up Gateway',
  description:
    'Cambodia’s premier authorized game reload portal. Instant 3-second delivery for Mobile Legends, Roblox, Free Fire, PUBG Mobile, Genshin Impact with Bakong KHQR 0% fee.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="km">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;800;900&family=Oxanium:wght@700;800&family=Kantumruy+Pro:ital,wght@0,300..700;1,300..700&family=Koulen&family=Battambang:wght@400;700;900&family=Plus+Jakarta+Sans:ital,wght@0,400..800;1,400..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen text-white antialiased flex flex-col justify-between selection:bg-[#E5B55E] selection:text-black leading-relaxed">
        <AppProvider>
          {/* Global Sticky Luxury Navbar */}
          <Navbar />

          {/* Main Application Container */}
          <main className="flex-1">{children}</main>

          {/* Global Luxury Footer */}
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
