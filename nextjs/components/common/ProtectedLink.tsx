"use client";

import { useRouter } from "next/navigation"; 
import React from "react";

interface ProtectedLinkProps {
  to: string;          // route to navigate if logged in
  children: React.ReactNode;
  className?: string;  // optional custom styling
}

const ProtectedLink: React.FC<ProtectedLinkProps> = ({ to, children, className }) => {
  const router = useRouter();

  const handleClick = () => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");

    if (!token || token.trim() === "") {
      return router.push("/login"); // ✅ redirect to login
    }

    router.push(to); // ✅ proceed to intended route
  };

  return (
    <div onClick={handleClick} className={className || "cursor-pointer"}>
      {children}
    </div>
  );
};

export default ProtectedLink;
