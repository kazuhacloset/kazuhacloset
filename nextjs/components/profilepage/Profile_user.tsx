"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getUser, updateUser } from "@/utils/api/userUtils";

interface User {
  first_name: string;
  last_name: string;
  email: string;
}

const ProfileSection = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [formData, setFormData] = useState<User>({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const user = await getUser();
        setUserData(user);
        setFormData(user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!token) return;
    try {
      await updateUser(formData);
      setUserData(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="relative min-h-screen px-4 py-6 sm:py-10 flex items-center justify-center overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/tanjiro.mp4" type="video/mp4" />
      </video>

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
          {/* Avatar */}
          <div className="flex items-center justify-center lg:w-[30%]">
            <motion.div
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full flex items-center justify-center font-extrabold text-4xl sm:text-5xl shadow-xl bg-gradient-to-br from-gray-900 via-gray-600 to-gray-300 text-white"
              style={{ textShadow: "0 0 6px rgba(255,255,255,0.4)" }}
            >
              {userData?.first_name?.[0]?.toUpperCase() || "?"}
            </motion.div>
          </div>

          {/* Vertical Divider - Hidden on mobile */}
          <div className="hidden lg:block w-px bg-white/30 mx-4" />

          {/* Profile Info */}
          <div className="lg:w-[70%] w-full space-y-4 sm:space-y-5 text-white">
            {[
              { label: "First Name", name: "first_name", type: "text" },
              { label: "Last Name", name: "last_name", type: "text" },
              { label: "Email", name: "email", type: "email" },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block text-sm mb-1 font-semibold text-white">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={formData[name as keyof User]}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  placeholder={`Enter your ${label.toLowerCase()}`}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md text-sm sm:text-base ${
                    isEditing
                      ? "bg-white/20 backdrop-blur-md border-yellow-400 focus:ring-yellow-400"
                      : "bg-white/10"
                  } text-white placeholder-white/70 outline-none border border-white/20 shadow-md transition-all`}
                />
              </div>
            ))}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-4 sm:pt-6">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="w-full sm:w-auto bg-green-400 hover:bg-green-500 text-black font-semibold px-6 py-2 sm:py-3 rounded-lg shadow-lg transition duration-300 text-sm sm:text-base"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData(userData as User);
                    }}
                    className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-black font-semibold px-6 py-2 sm:py-3 rounded-lg shadow-lg transition duration-300 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 sm:py-3 rounded-lg shadow-lg transition duration-300 text-sm sm:text-base"
                >
                  Edit Profile
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileSection;