import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gitmece | Algorithm-First Decision Authority",
  description: "Duygusal kararlar yerine matematiksel gerçekler. Gitmece, seyahat planlarınızı 50+ parametre ile analiz eder, riskleri hesaplar ve size dürüst gerçeği söyler.",
  keywords: ["seyahat planlama", "tatil analizi", "yapay zeka seyahat", "risk analizi", "gitmece"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
