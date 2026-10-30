import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TOPUPVERSE - Top Up Game Platform",
  description: "The #1 Game Top Up Platform. Instant delivery, best prices for all your favorite games.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="km">
      <head>
        {/* ── Google Fonts ──
            • Rajdhani       → English headings (gaming / bold / condensed)
            • Barlow          → English body + UI (clean, modern)
            • Kantumruy Pro  → Khmer headings (clean, professional)
            • Noto Sans Khmer → Khmer body fallback (max glyph coverage)
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Barlow:wght@300;400;500;600;700;800;900&family=Kantumruy+Pro:wght@100;200;300;400;500;600;700&family=Noto+Sans+Khmer:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
