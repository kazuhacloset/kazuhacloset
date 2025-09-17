import './globals.css';
import 'aos/dist/aos.css';
import { Poppins } from 'next/font/google';
import LayoutClient from './LayoutClient';
import type { Metadata } from "next";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kazuhacloset.com"),
  title: "Kazuhacloset | Fashion & Lifestyle",
  description:
    "Discover trendy fashion, curated collections, and stylish outfits at Kazuhacloset. Elevate your wardrobe with us.",
  keywords: [
    "fashion",
    "clothing",
    "style",
    "trendy outfits",
    "Kazuhacloset",
    "wardrobe",
    "lifestyle",
  ],
  alternates: {
    canonical: "https://www.kazuhacloset.com",
  },
  openGraph: {
    title: "Kazuhacloset | Fashion & Lifestyle",
    description: "Trendy fashion and stylish outfits for every occasion.",
    url: "https://www.kazuhacloset.com/",
    siteName: "Kazuhacloset",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Kazuhacloset Fashion Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kazuhacloset | Fashion & Lifestyle",
    description: "Discover the latest fashion trends with Kazuhacloset.",
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "url": "https://www.kazuhacloset.com",
              "logo": "https://www.kazuhacloset.com/logo.png", // 👈 upload square version
              "name": "Kazuhacloset"
            }),
          }}
        />
      </head>
      <body className={`bg-[#1b1b1d] ${poppins.className}`}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
