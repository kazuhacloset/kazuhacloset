"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getUser, updateUserAvatar } from "@/utils/api/userUtils";
import Image from "next/image";
import Navbar from "../common/navbar/Navbar";

const MotionImage = motion(Image);

interface User {
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
}

const ProfileSection = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  // ✅ Helper
  const getValidAvatarURL = (
    avatar?: string | null
  ): string | null => {
    if (!avatar) return null;

    if (
      avatar.startsWith("http") ||
      avatar.startsWith("/")
    )
      return avatar;

    return `${
      process.env.NEXT_PUBLIC_API_URL || ""
    }/${avatar}`;
  };

  // ✅ Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const user = await getUser();

        setUserData(user);
        setSelectedAvatar(
          getValidAvatarURL(user.avatar)
        );
      } catch (error) {
        console.error(
          "Failed to fetch user:",
          error
        );
      }
    };

    fetchUser();
  }, [token]);

  const avatarOptions = [
    "/Birthdaycard/6.jpg",
    "/Birthdaycard/1.jpg",
    "/Birthdaycard/2.jpg",
    "/Birthdaycard/3.jpg",
  ];

  // ✅ Update avatar
  const handleAvatarClick = async (src: string) => {
    const validSrc = getValidAvatarURL(src);

    setSelectedAvatar(validSrc);

    try {
      await updateUserAvatar(src);

      const updatedUser = await getUser();

      setUserData(updatedUser);
    } catch (error) {
      console.error(
        "Failed to update avatar:",
        error
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="relative min-h-screen overflow-hidden bg-[#050505] px-4 pt-28 pb-8 sm:pt-32 sm:pb-12 flex items-center justify-center">

        {/* Background Image */}
        <Image
          src="/background.jpg"
          alt="Background"
          fill
          priority
          className="object-cover opacity-10"
        />

        {/* Cinematic Layers */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,107,0,0.14),transparent_30%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(225,29,72,0.14),transparent_35%)]" />

        {/* Grid Texture */}
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Ambient Glow */}
        <div className="absolute top-[-120px] left-[-80px] w-[300px] h-[300px] rounded-full bg-[#FF6B00]/20 blur-[120px]" />
        <div className="absolute bottom-[-120px] right-[-80px] w-[320px] h-[320px] rounded-full bg-[#E11D48]/20 blur-[120px]" />

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-[15%] w-1 h-1 rounded-full bg-[#FF6B00]/40 animate-pulse" />
          <div className="absolute top-[65%] left-[75%] w-1 h-1 rounded-full bg-[#E11D48]/40 animate-pulse" />
          <div className="absolute top-[40%] left-[55%] w-1 h-1 rounded-full bg-white/20 animate-pulse" />
        </div>

        {/* Main Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
          }}
          className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-[0_25px_90px_rgba(0,0,0,0.75)]"
        >

          {/* Glow Border */}
          <div className="absolute inset-0 rounded-[36px] border border-[#FF6B00]/10 pointer-events-none" />

          {/* Top Glow Line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#FF6B00] to-transparent opacity-70" />

          {/* Header */}
          <div className="relative text-center px-6 pt-10 sm:pt-12 pb-8">

            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#FF6B00]/20 bg-[#111111]/70 backdrop-blur-xl mb-5">
              <div className="w-2 h-2 rounded-full bg-[#FF6B00]" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#A1A1AA]">
                Kazuha Identity
              </span>
            </div>

            <p className="mt-5 text-[#A1A1AA] text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Manage your Kazuha Closet identity and
              aesthetic.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Content */}
          <div className="flex flex-col lg:flex-row gap-8 px-5 sm:px-8 lg:px-10 py-8 sm:py-10">

            {/* LEFT SIDE */}
            <div className="flex flex-col items-center justify-center lg:w-[30%]">

              {/* Avatar Glow */}
              <div className="relative group">

                {/* Ambient Ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FF6B00]/30 to-[#E11D48]/30 blur-2xl opacity-70 scale-110" />

                {/* Avatar Border */}
                <div className="relative p-[3px] rounded-full bg-gradient-to-br from-[#FF6B00] to-[#E11D48] shadow-[0_0_35px_rgba(255,107,0,0.25)]">

                  {selectedAvatar &&
                  (selectedAvatar.startsWith("/") ||
                    selectedAvatar.startsWith(
                      "http"
                    )) ? (
                    <MotionImage
                      src={selectedAvatar}
                      alt="User Avatar"
                      width={180}
                      height={180}
                      initial={{
                        scale: 0.96,
                        opacity: 0.85,
                      }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                      }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      className="w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44 rounded-full object-cover bg-[#111111] transition-all duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <motion.div
                      initial={{
                        scale: 0.96,
                        opacity: 0.85,
                      }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                      }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      className="w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44 rounded-full bg-gradient-to-br from-[#18181B] via-[#2A2A2A] to-[#111111] flex items-center justify-center text-5xl sm:text-6xl font-black text-white shadow-inner"
                      style={{
                        textShadow:
                          "0 0 18px rgba(255,107,0,0.45)",
                      }}
                    >
                      {userData?.first_name?.[0]?.toUpperCase() ||
                        "?"}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Avatar Selection */}
              <div className="flex gap-4 mt-8 flex-wrap justify-center">
                {avatarOptions.map((src, idx) => (
                  <div
                    key={idx}
                    onClick={() =>
                      handleAvatarClick(src)
                    }
                    className={`relative p-[2px] rounded-full transition-all duration-500 cursor-pointer ${
                      selectedAvatar === src
                        ? "bg-gradient-to-br from-[#FF6B00] to-[#E11D48] scale-110 shadow-[0_0_25px_rgba(255,107,0,0.35)]"
                        : "bg-white/10 hover:bg-white/20 hover:scale-105"
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`Avatar ${idx + 1}`}
                      width={50}
                      height={50}
                      className="w-12 h-12 rounded-full object-cover bg-[#111111]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

            {/* RIGHT SIDE */}
            <div className="lg:w-[70%] w-full space-y-6">

              {/* FIRST NAME */}
              <div>
                <label className="block mb-3 text-xs uppercase tracking-[0.25em] text-[#A1A1AA]">
                  First Name
                </label>

                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#18181B]/70 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
                  <input
                    type="text"
                    value={userData?.first_name || ""}
                    readOnly
                    className="w-full bg-transparent px-5 py-4 text-white outline-none text-sm sm:text-base"
                  />

                  <div className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_top,rgba(255,107,0,0.08),transparent_60%)]" />
                </div>
              </div>

              {/* LAST NAME */}
              <div>
                <label className="block mb-3 text-xs uppercase tracking-[0.25em] text-[#A1A1AA]">
                  Last Name
                </label>

                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#18181B]/70 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
                  <input
                    type="text"
                    value={userData?.last_name || ""}
                    readOnly
                    className="w-full bg-transparent px-5 py-4 text-white outline-none text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="block mb-3 text-xs uppercase tracking-[0.25em] text-[#A1A1AA]">
                  Email Address
                </label>

                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#18181B]/70 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
                  <input
                    type="email"
                    value={userData?.email || ""}
                    readOnly
                    className="w-full bg-transparent px-5 py-4 text-white outline-none text-sm sm:text-base"
                  />
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ProfileSection;