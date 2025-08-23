// components/Footer.tsx

'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1b1b1d] text-gray-300 py-8 px-4 text-center border-t border-gray-700">
      {/* 🔗 Policy Links */}
      <div className="flex flex-wrap justify-center gap-8 mb-4">
        <Link href="/privacy-policy" className="hover:text-white transition-colors">
          Privacy Policy
        </Link>
        <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
          Terms & Conditions
        </Link>
        <Link href="/refund-policy" className="hover:text-white transition-colors">
          Refund Policy
        </Link>
        <Link href="/shipping-policy" className="hover:text-white transition-colors">
          Shipping Policy
        </Link>
      </div>

      {/* Copyright */}
      <p className="text-sm text-gray-400">
        © 2025 KazuhaCloset. All rights reserved.
      </p>
    </footer>
  );
}
