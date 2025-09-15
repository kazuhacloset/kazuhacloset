"use client";

import Link from "next/link";
import { ShoppingCart, Package, User, LogOut, LogIn, Heart } from "lucide-react";
import ProtectedLink from "../ProtectedLink";

interface Props {
  firstLetter: string | null;
  handleLogout: () => void;
}

export default function MobileMenu({ firstLetter, handleLogout }: Props) {
  return (
    <div className="absolute top-full right-4 mt-2 w-52 bg-black/90 backdrop-blur-md rounded-xl shadow-xl p-4 flex flex-col space-y-4 text-white z-50">
      <ProtectedLink
        to="/cart"
        className="flex items-center gap-2 hover:text-yellow-400"
      >
        <ShoppingCart size={18} /> Cart
      </ProtectedLink>

      <ProtectedLink
        to="/order-summary"
        className="flex items-center gap-2 hover:text-green-400"
      >
        <Package size={18} /> Orders
      </ProtectedLink>

      <ProtectedLink
        to="/wishlist"
        className="flex items-center gap-2 hover:text-pink-400"
      >
        <Heart size={18} /> Wishlist
      </ProtectedLink>

      {firstLetter ? (
        <>
          <Link
            href="/profile"
            className="flex items-center gap-2 hover:text-yellow-400"
          >
            <User size={18} /> Profile
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 hover:text-red-400 text-left"
          >
            <LogOut size={18} /> Logout
          </button>
        </>
      ) : (
        <Link
          href="/login"
          className="flex items-center gap-2 hover:text-blue-400"
        >
          <LogIn size={18} /> Login
        </Link>
      )}
    </div>
  );
}
