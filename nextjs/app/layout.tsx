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
        <main className="relative min-h-screen overflow-x-hidden">
          {loading ? (
            <Loader />
          ) : (
            <>
              {children}
              <FloatingLauncher />
            </>
          )}
        </main>

        {/* 🔥 Custom Toaster Styling with Avatar Icons */}
            <Toaster
              position="top-right"
              toastOptions={{
                className: 'custom-toast',
                duration: 3500,
                style: {
                  background: '#4a4a4a',
                  color: '#ffffff',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  minWidth: '280px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                },
                success: {
                  icon: (
                    <Image
                      src="/pass.png"
                      alt="Success"
                      width={40}
                      height={40}
                      className="toast-avatar rounded-full"
                    />
                  ),
                  style: {
                    background: '#4a4a4a',
                    color: '#ffffff',
                  }
                },
                error: {
                  icon: (
                    <Image
                      src="/fail.png"
                      alt="Error"
                      width={40}
                      height={40}
                      className="toast-avatar rounded-full"
                    />
                  ),
                  style: {
                    background: '#4a4a4a',
                    color: '#ffffff',
                  }
                },
              }}
            />
      </body>
    </html>
  );
}
