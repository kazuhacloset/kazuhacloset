import "./globals.css";
import "aos/dist/aos.css";

import { Poppins } from "next/font/google";
import LayoutClient from "./LayoutClient";

import type { Metadata } from "next";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kazuhacloset.com"),

  title: {
    default: "Kazuhacloset | Anime Streetwear",
    template: "%s | Kazuhacloset",
  },

  description:
    "Premium anime streetwear inspired by Tokyo underground culture. Explore oversized anime apparel, cinematic fashion aesthetics, and exclusive drops.",

  keywords: [
    "anime clothing",
    "anime streetwear",
    "Tokyo fashion",
    "oversized anime tshirts",
    "anime outfits",
    "Kazuhacloset",
    "anime apparel",
    "street fashion",
    "anime merch",
  ],

  alternates: {
    canonical: "https://www.kazuhacloset.com",
  },

  openGraph: {
    title: "Kazuhacloset | Anime Streetwear",

    description:
      "Premium anime streetwear inspired by Tokyo underground culture.",

    url: "https://www.kazuhacloset.com/",

    siteName: "Kazuhacloset",

    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Kazuhacloset Anime Streetwear Banner",
      },
    ],

    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Kazuhacloset | Anime Streetwear",

    description:
      "Explore premium anime streetwear and cinematic fashion aesthetics.",

    images: ["/opengraph-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* THEME COLOR */}
        <meta name="theme-color" content="#050505" />

        {/* SCHEMA */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",

              "@type": "Organization",

              name: "Kazuhacloset",

              url: "https://www.kazuhacloset.com",

              logo: "https://www.kazuhacloset.com/logo.png",
            }),
          }}
        />
      </head>

      <body
        className={`${poppins.className} bg-[#050505] text-white overflow-x-hidden antialiased`}
      >
        {/* GLOBAL ATMOSPHERIC BACKGROUND */}
        <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden">
          {/* LEFT ORANGE GLOW */}
          <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-[#ff6b00]/10 blur-[140px]" />

          {/* RIGHT RED GLOW */}
          <div className="absolute top-[20%] right-[-10%] w-[450px] h-[450px] bg-[#E11D48]/10 blur-[140px]" />

          {/* GRID */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",

              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}