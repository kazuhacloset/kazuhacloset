"use client"; // if using Next.js 13+ App Router

import { useRouter } from "next/navigation"; 
import React from "react";

interface ProtectedLinkProps {
  to: string;         // route to navigate if logged in
  children: React.ReactNode;
  className?: string // content (icon, button, etc.)
}

const ProtectedLink: React.FC<ProtectedLinkProps> = ({ to, children,className}) => {
  const router = useRouter();

  const handleClick = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // redirect to login
      return;
    }

    router.push(to); // go to intended page
  };

  return (
    <div onClick={handleClick} className={className || "cursor-pointer"}>
      {children}
    </div>
  );
};

export default ProtectedLink;
