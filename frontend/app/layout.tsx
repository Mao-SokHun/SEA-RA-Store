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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
