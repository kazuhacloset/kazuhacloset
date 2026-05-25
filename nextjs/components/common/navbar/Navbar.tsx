"use client";

import Link from "next/link";
import Image from "next/image";

import {
  ShoppingCart,
  Heart,
  Package,
  User,
  Menu,
  X,
} from "lucide-react";

import { useEffect, useState, useRef, useCallback } from "react";

import dynamic from "next/dynamic";

import { Luckiest_Guy } from "next/font/google";

import ProtectedLink from "../ProtectedLink";

import ProfileMenu from "./ProfileMenu";

import { getUser } from "@/utils/api/userUtils";

const SearchBar = dynamic(() => import("../../Landingpage/search"), {
  ssr: false,
});

const luckiest = Luckiest_Guy({
  subsets: ["latin"],
  weight: "400",
});

interface User {
  first_name?: string;
  avatar?: string;
}

const normalizeAvatarPath = (path?: string): string => {
  if (!path) return "/default-avatar.png";

  if (path.startsWith("http")) return path;

  if (path.startsWith("//")) path = path.replace(/^\/+/, "");

  if (path.startsWith("/")) return path;

  return `${process.env.NEXT_PUBLIC_API_URL || ""}/${path}`;
};

export default function Navbar() {
  const [userData, setUserData] = useState<User | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const firstLetter =
    userData?.first_name?.[0]?.toUpperCase() ?? null;

  const avatarUrl = normalizeAvatarPath(userData?.avatar);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    (async () => {
      try {
        const user = await getUser();

        setUserData(user);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.clear();

    window.location.href = "/";
  }, []);

  const navItems = [
    {
      name: "Home",
      id: "home",
    },
    {
      name: "Products",
      id: "products",
    },
    {
      name: "Anime",
      id: "shop-by-anime",
    },
    {
      name: "Reviews",
      id: "community",
    },
  ];

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-white/5 bg-black/70 backdrop-blur-2xl overflow-visible">
      {/* CINEMATIC BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-[10%] top-[-100px] w-[260px] h-[260px] bg-[#ff6b00]/15 blur-[120px]" />

        <div className="absolute right-[10%] top-[-100px] w-[240px] h-[240px] bg-[#E11D48]/10 blur-[120px]" />
      </div>

      {/* GRID */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 h-[78px] px-4 md:px-8 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          {/* MENU */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="group relative w-10 h-10 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl flex items-center justify-center text-white hover:border-[#ff6b00]/40 transition-all duration-300 overflow-hidden"
            >
              {/* BUTTON GLOW */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b00]/0 via-[#ff6b00]/10 to-[#E11D48]/0 opacity-0 group-hover:opacity-100 transition-all duration-500" />

              {menuOpen ? (
                <X
                  size={20}
                  className="relative z-10 group-hover:text-[#ff6b00] transition-all duration-300"
                />
              ) : (
                <Menu
                  size={20}
                  className="relative z-10 group-hover:text-[#ff6b00] transition-all duration-300"
                />
              )}
            </button>

            {/* DROPDOWN */}
            {menuOpen && (
              <div className="absolute top-14 left-0 w-52 rounded-2xl border border-white/10 bg-black/90 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.55)] overflow-hidden z-[9999]">
                {/* GLOW */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute -top-6 left-8 w-28 h-28 bg-[#ff6b00]/10 blur-3xl rounded-full" />
                </div>

                {/* HEADER */}
                <div className="relative px-4 py-3 border-b border-white/5">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#ff6b00]">
                    Menu
                  </p>
                </div>

                {/* ITEMS */}
                <ul className="relative p-2 space-y-1.5">
                  {navItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() =>
                          scrollToSection(item.id)
                        }
                        className="group flex items-center justify-between w-full rounded-xl px-3 py-3 text-left bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-[#ff6b00]/20 transition-all duration-300"
                      >
                        <span className="text-sm text-white/85 group-hover:text-[#ff6b00] transition-all duration-300">
                          {item.name}
                        </span>

                        <span className="text-white/30 group-hover:text-[#ff6b00] transition-all duration-300">
                          →
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[#ff6b00]/20 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-full" />

              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="relative z-10 object-contain"
              />
            </div>

            <div
              className={`leading-[0.9] text-white text-sm tracking-wide ${luckiest.className}`}
            >
              <span className="block">KAZUHA</span>

              <span className="block text-[#ff6b00]">
                CLOSET
              </span>
            </div>
          </Link>
        </div>

        {/* CENTER SEARCH */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-[260px] lg:w-[320px] overflow-visible">
          <div className="relative w-full group overflow-visible">
            {/* GLOW */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b00]/20 via-[#ff6b00]/10 to-[#E11D48]/20 blur-2xl opacity-70 group-hover:opacity-100 transition-all duration-500 rounded-full" />

            {/* BORDER */}
            <div className="absolute inset-0 rounded-full border border-[#ff6b00]/20 group-hover:border-[#ff6b00]/40 transition-all duration-500" />

            {/* SEARCH */}
            <div className="relative h-[50px] bg-black/70 backdrop-blur-2xl rounded-full flex items-center px-1 overflow-visible">
              <div className="flex-1 overflow-visible">
                <SearchBar />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-5 text-white">
          <ProtectedLink
            to="/cart"
            className="hover:text-[#ff6b00] transition-all duration-300 hover:scale-110"
          >
            <ShoppingCart size={21} />
          </ProtectedLink>

          <ProtectedLink
            to="/wishlist"
            className="hover:text-pink-400 transition-all duration-300 hover:scale-110"
          >
            <Heart size={21} />
          </ProtectedLink>

          <ProtectedLink
            to="/order-summary"
            className="hover:text-yellow-400 transition-all duration-300 hover:scale-110"
          >
            <Package size={21} />
          </ProtectedLink>

          {firstLetter ? (
            <ProfileMenu
              firstLetter={firstLetter}
              avatarUrl={avatarUrl}
              handleLogout={handleLogout}
            />
          ) : (
            <Link
              href="/login"
              className="hover:text-[#ff6b00] transition-all duration-300 hover:scale-110"
            >
              <User size={21} />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}