import type { Metadata, Viewport } from "next";
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

/**
 * public/ に置くファイル（今のあなたの構成でOK）
 * - public/icon-mofu.png
 * - public/apple-touch-icon.png
 */

export const metadata: Metadata = {
  title: {
    default: "みやむDiary",
    template: "%s | みやむDiary",
  },
  description: "モフと一緒に毎日の記録を楽しむライフログアプリ。",
  applicationName: "みやむDiary",

  icons: {
    icon: [{ url: "/icon-mofu.png", type: "image/png" }],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
