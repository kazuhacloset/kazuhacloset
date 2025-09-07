// components/Footer.tsx

'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1b1b1d] text-gray-300 py-8 px-4 text-center border-t border-gray-700">
      {/* 🔗 Policy Links */}
      <div className="flex flex-wrap justify-center gap-8 mb-6">
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

      {/* 🌐 Social Media Links */}
      <div className="flex justify-center gap-6 mb-4">
        <Link href="https://www.facebook.com/profile.php?id=61573468100133" target="_blank" rel="noopener noreferrer">
          <Facebook className="w-5 h-5 hover:text-blue-500 transition-colors" />
        </Link>
        <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <Instagram className="w-5 h-5 hover:text-pink-500 transition-colors" />
        </Link>
        <Link href="https://x.com/Kazuha_Closet?t=iTKAm5siUQKB4qF84hknsg&s=09" target="_blank" rel="noopener noreferrer">
          <Twitter className="w-5 h-5 hover:text-sky-400 transition-colors" />
        </Link>
        <Link href="https://www.threads.com/@kazuha__closet" target="_blank" rel="noopener noreferrer">
          {/* Threads SVG icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 50 50"
            fill="currentColor"
            className="w-5 h-5 hover:text-white transition-colors"
          >
            <path d="M25 1C11.8 1 1 11.8 1 25s10.8 24 24 24 24-10.8 24-24S38.2 1 25 1zm0 44C13.4 45 3.9 35.6 3.9 24S13.4 3 25 3s21.1 9.4 21.1 21S36.6 45 25 45zm6.4-18.2c2.1.7 3.5 2.5 3.5 5.2 0 4.4-3.5 7.1-8.8 7.1-4.2 0-7.5-2-9.2-5.5l2.8-1.5c1.1 2.3 3.1 3.6 6.2 3.6 3.4 0 5.5-1.5 5.5-3.9 0-2.1-1.2-3.2-3.9-3.9l-2.7-.6c-4.4-1-6.6-3.2-6.6-6.9 0-4.2 3.3-7 8.3-7 3.8 0 6.7 1.6 8.3 4.7l-2.7 1.5c-1-1.9-2.7-2.9-5.6-2.9-3.1 0-5 1.5-5 3.8 0 2 1.1 3.1 3.9 3.8l2.5.6c4.9 1.2 7 3.3 7 7z" />
          </svg>
        </Link>
      </div>

      {/* Copyright */}
      <p className="text-sm text-gray-400">
        © 2025 KazuhaCloset. All rights reserved.
      </p>
    </footer>
  );
}
