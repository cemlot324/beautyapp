import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { BasketProvider } from './context/BasketContext';
import { WishlistProvider } from './context/WishlistContext';
import WelcomePopup from './components/WelcomePopup';
import Chatbot from './components/Chatbot';
import PWARegistration from './components/PWARegistration';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: "Bloom | Vegan Skincare",
  description: "Vegan and Cruelty Free Skincare",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Bloom',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${poppins.className} bg-white text-black`}>
        <WishlistProvider>
          <BasketProvider>
            <PWARegistration />
            {children}
            <WelcomePopup />
            <Chatbot />
          </BasketProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
