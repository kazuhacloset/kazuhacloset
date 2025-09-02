'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Loader from '@/components/Loader';
import FloatingLauncher from '@/components/Landingpage/FloatingLauncher';
import Footer from '@/components/Footer';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
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
  );
}
