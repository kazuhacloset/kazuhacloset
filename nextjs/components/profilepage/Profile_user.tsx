"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getUser, updateUserAvatar } from "@/utils/api/userUtils";
import Image from 'next/image';


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
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ✅ fetch user from DB on mount
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const user = await getUser();
        setUserData(user);
        setSelectedAvatar(user.avatar || null);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, [token]);

  const avatarOptions = [
    "Birthdaycard/6.jpg",
    "Birthdaycard/1.jpg",
    "Birthdaycard/2.jpg",
    "Birthdaycard/3.jpg",
  ];

  // ✅ update avatar in DB + refresh user
  const handleAvatarClick = async (src: string) => {
    setSelectedAvatar(src); // instant UI update
    try {
      await updateUserAvatar(src); // send to backend
      const updatedUser = await getUser(); // fetch fresh data
      setUserData(updatedUser);
    } catch (error) {
      console.error("Failed to update avatar:", error);
    }
  };

  return (
    <div className="relative min-h-screen px-4 py-6 sm:py-10 flex items-center justify-center overflow-hidden">
      <Image
              src="/background.jpg"
              alt="Background"
              fill
              priority
              className="object-cover z-0"
            />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative z-10 w-full max-w-5xl mx-auto rounded-[20px] bg-white/10 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="text-center py-4 px-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-md">
            PROFILE SECTION
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row px-4 sm:px-6 pb-6 sm:pb-10 gap-6">
          {/* Avatar + Selection */}
          <div className="flex flex-col items-center justify-center lg:w-[30%] gap-4">
            {/* Main Avatar */}
            {selectedAvatar ? (
              <motion.img
                src={selectedAvatar}
                alt="User Avatar"
                initial={{ scale: 0.95, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full shadow-xl object-cover"
              />
            ) : (
              <motion.div
                initial={{ scale: 0.95, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full flex items-center justify-center 
                           font-extrabold text-4xl sm:text-5xl shadow-xl bg-gradient-to-br from-gray-900 via-gray-600 to-gray-300 
                           text-white"
                style={{ textShadow: "0 0 6px rgba(255,255,255,0.4)" }}
              >
                {userData?.first_name?.[0]?.toUpperCase() || "?"}
              </motion.div>
            )}

            {/* Avatar Selection Thumbnails */}
            <div className="flex gap-3 mt-2">
              {avatarOptions.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Avatar ${idx + 1}`}
                  className={`w-10 h-10 rounded-full border-2 ${
                    selectedAvatar === src
                      ? "border-yellow-400 scale-110"
                      : "border-transparent"
                  } transition-transform duration-300 hover:scale-110 cursor-pointer`}
                  onClick={() => handleAvatarClick(src)}
                />
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px bg-white/30 mx-4" />

          {/* Profile Info */}
          <div className="lg:w-[70%] w-full space-y-4 sm:space-y-5 text-white">
            <div>
              <label className="block text-sm mb-1 font-semibold text-white">
                First Name
              </label>
              <input
                type="text"
                value={userData?.first_name || ""}
                readOnly
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md text-sm sm:text-base bg-white/10 text-white placeholder-white/70 outline-none border border-white/20 shadow-md"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 font-semibold text-white">
                Last Name
              </label>
              <input
                type="text"
                value={userData?.last_name || ""}
                readOnly
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md text-sm sm:text-base bg-white/10 text-white placeholder-white/70 outline-none border border-white/20 shadow-md"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 font-semibold text-white">
                Email
              </label>
              <input
                type="email"
                value={userData?.email || ""}
                readOnly
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md text-sm sm:text-base bg-white/10 text-white placeholder-white/70 outline-none border border-white/20 shadow-md"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileSection;
