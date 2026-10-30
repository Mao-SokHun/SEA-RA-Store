import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TopUpFlowModal from '@/components/topup/TopUpFlowModal';
import OrderStatusModal from '@/components/topup/OrderStatusModal';

export const metadata: Metadata = {
  title: 'GameVerse • SEA RA Game Top-Up Platform',
  description:
    'Cambodia’s #1 trusted gaming top-up platform with instant 3-second delivery via Bakong KHQR. Mobile Legends, Roblox, Free Fire, PUBG Mobile, Genshin Impact and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="km">
      <body className="min-h-screen bg-[#070B17] text-white antialiased flex flex-col justify-between selection:bg-[#22D3EE] selection:text-black">
        {/* Ambient Top Cyber Glow */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-[#22D3EE]/8 via-[#3B82F6]/5 to-transparent blur-3xl pointer-events-none -z-10" />

        {/* Global Sticky Navbar */}
        <Navbar />

        {/* Main Page View */}
        <main className="flex-1 pt-20 pb-16">{children}</main>

        {/* Global Footer */}
        <Footer />

        {/* Interactive Top-Up Cockpit Modal & Order Status Timeline */}
        <TopUpFlowModal />
        <OrderStatusModal />
      </body>
    </html>
  );
}

