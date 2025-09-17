"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";

interface Props {
  firstLetter: string;
  avatarUrl?: string;
  handleLogout: () => void;
}

export default function ProfileMenu({ firstLetter, avatarUrl, handleLogout }: Props) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="w-9 h-9 rounded-full overflow-hidden border-2 border-yellow-400 flex items-center justify-center cursor-pointer"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="User Avatar" width={36} height={36} className="object-cover" />
        ) : (
          <span className="bg-yellow-400 text-black font-bold">{firstLetter}</span>
        )}
      </div>

      {open && (
        <div className="absolute top-12 right-0 w-44 bg-white text-black rounded-xl shadow-xl py-3">
          <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
