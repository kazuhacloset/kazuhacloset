import './globals.css';
import 'aos/dist/aos.css';
import { Poppins } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import LayoutClient from './LayoutClient';
import type { Metadata } from "next";


const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  display: 'swap',
});

// ✅ SEO metadata only works in server components
export const metadata: Metadata = {
  title: "Kazuhacloset | Fashion & Lifestyle",
  description: "Discover trendy fashion, curated collections, and stylish outfits at Kazuhacloset. Elevate your wardrobe with us.",
  keywords: ["fashion", "clothing", "style", "trendy outfits", "Kazuhacloset", "wardrobe", "lifestyle"],
  openGraph: {
    title: "Kazuhacloset | Fashion & Lifestyle",
    description: "Trendy fashion and stylish outfits for every occasion.",
    url: "https://www.kazuhacloset.com/",
    siteName: "Kazuhacloset",
    images: [
      {
        url: "/opengraph-image.png", // place your fashion banner here
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`bg-[#1b1b1d] ${poppins.className}`}>
        <LayoutClient>{children}</LayoutClient>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
