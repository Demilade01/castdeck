import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MiniAppProvider from "@/components/mini-app-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CastDeck",
  description: "Schedule and manage your Farcaster content",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-transparent`}
        style={{
          // Mini App specific styles
          overscrollBehavior: 'none',
          WebkitOverflowScrolling: 'touch',
          // Remove any default margins/padding
          margin: 0,
          padding: 0,
        }}
      >
        <MiniAppProvider>
          {/* Mini App Container */}
          <div className="min-h-screen bg-white dark:bg-black">
            {children}
          </div>
        </MiniAppProvider>
      </body>
    </html>
  );
}
