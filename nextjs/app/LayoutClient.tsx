'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Loader from '@/components/Loader';
import FloatingLauncher from '@/components/Landingpage/FloatingLauncher';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Initial page load
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Show loader on route change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
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

      {/* 🔥 Toaster with Gradient Glow */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          className: 'custom-toast',
          style: {
            borderRadius: '8px',
            padding: '12px 18px',
            minWidth: '280px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 600,

            // 🌟 Gradient Glow Effect
            background: 'linear-gradient(to bottom left, #000000, #1c1c21, #7f7f7f)',
            color: 'transparent',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            backgroundImage: 'linear-gradient(90deg, #ca8a04, #eab308, #f59e0b)',
            textShadow:
              '0 0 4px rgba(202, 138, 4, 0.7), 0 0 8px rgba(234, 179, 8, 0.5)',
          },
          success: {
            icon: (
              <Image
                src="/pass.png"
                alt="Success"
                width={36}
                height={36}
                className="rounded-full object-cover"
              />
            ),
          },
          error: {
            icon: (
              <Image
                src="/fail.png"
                alt="Error"
                width={36}
                height={36}
                className="rounded-full object-cover"
              />
            ),
          },
        }}
      />
    </main>
  );
}
