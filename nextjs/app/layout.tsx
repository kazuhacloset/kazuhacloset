'use client';

import './globals.css';
import 'aos/dist/aos.css';
import { Poppins } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Loader from '@/components/Loader';
import FloatingLauncher from '@/components/Landingpage/FloatingLauncher';
import Image from 'next/image';
import Footer from '@/components/Footer';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`bg-[#1b1b1d] ${poppins.className}`}>
        <main className="relative bg-gradient-to-bl from-black via-zinc-800 to-zinc-300 min-h-screen scroll-smooth overflow-x-hidden flex flex-col">
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="flex-grow">{children}</div>
              <FloatingLauncher />
              <Footer />
            </>
          )}
        </main>

        {/* 🔥 Toaster with Yellow Gradient Glow */}
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'custom-toast',
            duration: 3500,
            style: {
              background:
                'linear-gradient(to bottom left, #000000, #1c1c21ff, #7f7f7fff)',
              borderRadius: '8px',
              padding: '12px 18px',
              minWidth: '280px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',

              // 🌟 Yellow Gradient Text Glow
              color: 'transparent',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              backgroundImage:
                 'linear-gradient(90deg, #ca8a04, #eab308, #f59e0b)',
              textShadow:
                '0 0 4px rgba(202, 138, 4, 0.7), 0 0 8px rgba(234, 179, 8, 0.5)',
              fontWeight: 600,
            },
            success: {
              icon: (
                <Image
                  src="/pass.png"
                  alt="Success"
                  width={52}
                  height={52}
                  className="toast-avatar rounded-full object-cover"
                />
              ),
            },
            error: {
              icon: (
                <Image
                  src="/fail.png"
                  alt="Error"
                  width={52}
                  height={52}
                  className="toast-avatar rounded-full object-cover"
                />
              ),
            },
          }}
        />
      </body>
    </html>
  );
}
