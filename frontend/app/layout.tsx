import type { Metadata } from 'next';
import './globals.css';
import { TopUpProvider } from '@/context/TopUpContext';
import SupportDrawer from '@/components/SupportDrawer';

export const metadata: Metadata = {
  title: 'GameVerse • SEA #1 Game Top-Up Platform (Direct Recharge)',
  description:
    'Cambodia’s #1 trusted gaming top-up platform with instant 3-second delivery via Bakong KHQR. Mobile Legends, Roblox, Free Fire, PUBG Mobile, Genshin Impact and more.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts: Rajdhani, Barlow, Kantumruy Pro */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Barlow:wght@300;400;500;600;700&family=Kantumruy+Pro:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#030712] text-white antialiased flex flex-col justify-between selection:bg-[#00F2FE] selection:text-black">
        <TopUpProvider>
          {children}
          <SupportDrawer />
        </TopUpProvider>
      </body>
    </html>
  );
}
