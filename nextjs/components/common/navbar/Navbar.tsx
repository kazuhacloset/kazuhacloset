"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { Luckiest_Guy } from "next/font/google";
import dynamic from "next/dynamic";
import { getUser } from "@/utils/api/userUtils";
import ProtectedLink from "../ProtectedLink";
import { debounce } from "@/utils/debounce";

import ProfileMenu from "./ProfileMenu";
import MobileMenu from "./MobileMenu";

// Lucide Icons
import {
  Search,
  Package,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
} from "lucide-react";

// Lazy load SearchBar
const SearchBar = dynamic(() => import("../../Landingpage/search"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-8 bg-gray-700 animate-pulse rounded" />
  ),
});

interface User {
  first_name?: string;
  avatar?: string; // backend avatar
}

const luckiest = Luckiest_Guy({ subsets: ["latin"], weight: "400" });

// ✅ Helper: Normalize avatar path
const normalizeAvatarPath = (path?: string): string => {
  if (!path) return "/default-avatar.png"; // Default image in /public folder
  if (path.startsWith("http")) return path; // Full URL from backend (CDN, etc.)
  if (path.startsWith("//")) path = path.replace(/^\/+/, ""); // Remove double slashes
  if (path.startsWith("/")) return path; // Local public folder path
  return `${process.env.NEXT_PUBLIC_API_URL || ""}/${path}`; // Relative backend path
};

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);

  const firstLetter = userData?.first_name?.[0]?.toUpperCase() ?? null;
  const searchRef = useRef<HTMLDivElement>(null);

  // ✅ Always ensure avatar URL is clean
  const avatarUrl = normalizeAvatarPath(userData?.avatar);

  // Scroll effect (debounced)
  useEffect(() => {
    const handleScroll = debounce(() => {
      setScrolled(window.scrollY > 20);
    }, 100);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch user on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    (async () => {
      try {
        const user = await getUser();
        setUserData(user);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    })();
  }, []);

  // Close mobile search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setMobileSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Preload SearchBar for performance
  useEffect(() => {
    import("../../Landingpage/search");
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.clear();
    window.location.href = "/";
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 z-50 w-full px-4 sm:px-6 md:px-10 flex items-center justify-between transition-all duration-500 ${
        scrolled
          ? "py-2 backdrop-blur-md bg-black/80 shadow-md"
          : "py-4 backdrop-blur-lg bg-black/60 shadow-lg"
      }`}
    >
      {/* === Logo === */}
      <Link
        href="/"
        className="flex items-center space-x-3 sm:space-x-4 cursor-pointer"
      >
        <Image
          src="/logo.png"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-full sm:w-12 sm:h-12 w-8 h-8"
        />
        <div
          className={`text-sm sm:text-base font-semibold tracking-wide text-white ${luckiest.className} select-none`}
        >
          KAZUHA <br className="hidden sm:block" /> CLOSET
        </div>
      </Link>

      {/* === Desktop Search === */}
      <div className="hidden sm:flex items-center w-1/2 md:w-1/3">
        <SearchBar />
      </div>

      {/* === Mobile Right Icons === */}
      <div className="sm:hidden flex items-center space-x-4">
        <button
          onClick={() => setMobileSearchOpen((prev) => !prev)}
          aria-label="Search"
          className="text-white"
        >
          <Search size={20} />
        </button>
        <Link href="/wishlist" aria-label="Wishlist" className="text-white">
          <Heart size={20} />
        </Link>
        <Link href="/order-summary" aria-label="Orders" className="text-white">
          <Package size={20} />
        </Link>
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Menu"
          className="text-white"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* === Mobile Search === */}
      {mobileSearchOpen && (
        <div
          ref={searchRef}
          className="absolute top-full left-0 w-full px-4 py-2 bg-black/90 sm:hidden"
        >
          <SearchBar
            isMobile={true}
            onClose={() => setMobileSearchOpen(false)}
          />
        </div>
      )}

      {/* === Desktop Right Icons === */}
      <div className="hidden sm:flex items-center space-x-6 text-white">
        <ProtectedLink to="/cart" className="hover:text-yellow-400">
          <ShoppingCart size={20} />
        </ProtectedLink>
        <ProtectedLink to="/wishlist" className="hover:text-pink-400">
          <Heart size={20} />
        </ProtectedLink>
        <ProtectedLink to="/order-summary" className="hover:text-green-400">
          <Package size={20} />
        </ProtectedLink>

        {firstLetter ? (
          <ProfileMenu
            firstLetter={firstLetter}
            avatarUrl={avatarUrl}
            handleLogout={handleLogout}
          />
        ) : (
          <Link href="/login" className="hover:text-blue-400">
            <User size={20} />
          </Link>
        )}
      </div>

      {/* === Mobile Menu === */}
      {menuOpen && (
        <MobileMenu firstLetter={firstLetter} handleLogout={handleLogout} />
      )}
    </nav>
  );
}

export default Navbar;
