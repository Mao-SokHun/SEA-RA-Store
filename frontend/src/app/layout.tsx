import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'NEXUS Cyber-Vault | Elite Game Account Escrow Marketplace',
  description:
    'Trade elite gaming accounts with zero risk. AES-256-GCM zero-knowledge vault, 15-minute Redlock reservation guard, instant Bakong KHQR EMVCo payments, and 100% anti-recall SLA.',
  keywords: [
    'game accounts',
    'buy game account',
    'sell MLBB account',
    'Valorant radiant account',
    'PUBG Mobile mythic',
    'Genshin Impact whale',
    'gaming escrow',
    'KHQR payment',
    'ទិញគណនីហ្គេម',
    'លក់គណនី MLBB',
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
          href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&family=Kantumruy+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Kdam+Thmor+Pro&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-full flex flex-col bg-[#0b0e14] text-[#e1e2eb] selection:bg-[#d4af37] selection:text-[#0b0e14] font-kantumruy"
        suppressHydrationWarning
      >
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 pt-20">{children}</main>
            <Footer />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
