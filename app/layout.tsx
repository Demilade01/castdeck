import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MiniAppProvider from "@/components/mini-app-provider";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({ subsets: ["latin"] });

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
        className={`${inter.className} bg-transparent`}
        style={{
          overscrollBehavior: 'none',
          WebkitOverflowScrolling: 'touch',
          margin: 0,
          padding: 0,
        }}
      >
        <MiniAppProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </MiniAppProvider>
      </body>
    </html>
  );
}
