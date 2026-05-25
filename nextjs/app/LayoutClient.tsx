'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import Loader from '@/components/common/Loader';
import Footer from '@/components/common/Footer';

import { Toaster } from 'react-hot-toast';
import { WishlistProvider } from '@/utils/WishlistContext';

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();

  // ROUTES WHERE FOOTER SHOULD BE HIDDEN
  const hideLayoutRoutes = ['/login', '/register'];

  const shouldHideLayout = hideLayoutRoutes.includes(pathname);

  // Initial page load
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  // Show loader on route change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <WishlistProvider>
      <main
        className="
          relative
          min-h-screen
          overflow-x-hidden
          scroll-smooth
          flex flex-col
          bg-[#050505]
        "
      >
        {/* GLOBAL CINEMATIC BACKGROUND */}
        <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden">
          {/* ORANGE GLOW */}
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#ff6b00]/10 blur-[140px]" />

          {/* RED GLOW */}
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#E11D48]/10 blur-[140px]" />

          {/* GRID */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          {/* RADIAL OVERLAY */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,107,0,0.08),transparent_40%)]" />
        </div>

        {loading ? (
          <Loader />
        ) : (
          <>
            {/* PAGE CONTENT */}
            <div className="relative z-10 flex-grow">
              {children}
            </div>

            {/* FOOTER */}
            {!shouldHideLayout && <Footer />}
          </>
        )}

        {/* TOASTER */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            className: 'custom-toast',
            style: {
              borderRadius: '14px',
              padding: '14px 18px',
              minWidth: '300px',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(18px)',
              background:
                'linear-gradient(135deg, rgba(10,10,10,0.96), rgba(25,25,25,0.92))',
              color: '#ffffff',
              boxShadow: '0 0 35px rgba(255,107,0,0.18)',
              fontWeight: 500,
            },
            success: {
              icon: (
                <img
                  src="/pass.png"
                  alt="Success"
                  width={38}
                  height={38}
                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                />
              ),
            },
            error: {
              icon: (
                <img
                  src="/fail.png"
                  alt="Error"
                  width={38}
                  height={38}
                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                />
              ),
            },
          }}
        />
      </main>
    </WishlistProvider>
  );
}