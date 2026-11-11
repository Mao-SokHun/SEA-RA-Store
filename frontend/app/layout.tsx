import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TopUpModal from '@/components/TopUpModal';
import TrackOrderModal from '@/components/TrackOrderModal';

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
      <body className="min-h-screen bg-[#070A14] text-white antialiased flex flex-col justify-between selection:bg-[#E5B55E] selection:text-black">
        <AppProvider>
          {/* Global Sticky Luxury Navbar */}
          <Navbar />

          {/* Main Application Container */}
          <main className="flex-1 pt-20">{children}</main>

          {/* Global Luxury Footer */}
          <Footer />

          {/* Interactive Global Modals */}
          <TopUpModal />
          <TrackOrderModal />
        </AppProvider>
      </body>
    </html>
  );
}
