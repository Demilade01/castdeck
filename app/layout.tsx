import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MiniAppHeader from "@/components/mini-app-header";
import MiniAppFooter from "@/components/mini-app-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CastDeck - Farcaster Content Management",
  description: "Schedule and manage your Farcaster content with ease. Write drafts, schedule posts, and maintain your content flow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-black`}
      >
        <div className="min-h-screen flex flex-col">
          <MiniAppHeader />

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>

          <MiniAppFooter />
        </div>
      </body>
    </html>
  );
}
