import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingChatWidget from '@/components/layout/FloatingChatWidget';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

export const metadata: Metadata = {
  title: 'NEXUS TOP-UP | សេវាកម្មបញ្ចូលលុយហ្គេមស្វ័យប្រវត្តិ 24/7 (Instant Game Top-Up)',
  description:
    'សេវាកម្មបញ្ចូលលុយហ្គេមស្វ័យប្រវត្តិតាម Bakong KHQR លឿនត្រឹម ៣ វិនាទី មិនបាច់ Login មិនបាច់បង្កើត Account។ គាំទ្រ Mobile Legends, Free Fire, PUBG Mobile, Roblox, Genshin Impact, Honor of Kings, Valorant, CODM, Wild Rift និង Blood Strike។',
  keywords: [
    'top up game',
    'game topup cambodia',
    'បញ្ចូលលុយហ្គេម',
    'បញ្ចូលពេជ្រ MLBB',
    'បញ្ចូល Robux',
    'បញ្ចូល UC PUBG',
    'Free Fire Diamonds',
    'Bakong KHQR Top Up',
    'Smile One Cambodia',
    'Mobile Legends Top Up',
    'CODM CP Top Up',
    'Wild Rift Wild Cores',
    'Blood Strike Gold',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Kantumruy+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-full flex flex-col bg-[#0b0e14] text-[#e1e2eb] selection:bg-[#d4af37] selection:text-[#0b0e14]"
        suppressHydrationWarning
      >
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 pt-20">{children}</main>
            <Footer />
            <MobileBottomNav />
            <FloatingChatWidget />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
