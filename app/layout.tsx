import type { Metadata } from "next";
import "./globals.css";
import { Web3Provider } from "./providers/Web3Provider";

export const metadata: Metadata = {
  title: "LIVE - Exclusive NFT Drop",
  description: "Claim your exclusive NFT from the LIVE collection. Free mint with embedded wallet - no browser extension required.",
  keywords: "NFT, Web3, Blockchain, Digital Art, Collectibles, Free Mint, Embedded Wallet, CDP, Base",
  authors: [{ name: "LIVE" }],
  creator: "LIVE",
  publisher: "LIVE",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "LIVE - Exclusive NFT Drop",
    description: "Claim your exclusive NFT from the LIVE collection. Free mint with embedded wallet - no browser extension required.",
    type: "website",
    siteName: "LIVE",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "LIVE - Exclusive NFT Drop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LIVE - Exclusive NFT Drop",
    description: "Claim your exclusive NFT from the LIVE collection. Free mint with embedded wallet - no browser extension required.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black antialiased">
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
