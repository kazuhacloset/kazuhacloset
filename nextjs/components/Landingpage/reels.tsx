"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const reels = [
  { id: 1, url: "https://www.instagram.com/reel/DN-ER0cEXU7/" },
  { id: 2, url: "https://www.instagram.com/reel/CxYYYYYYY/" },
  { id: 3, url: "https://www.instagram.com/reel/CzZZZZZZZ/" },
];

export default function ReelsSection() {
  // duplicate twice for seamless infinite loop
  const loopReels = [...reels, ...reels];

  return (
    <>
      <style jsx>{`
        @keyframes scrollX {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .scrolling-strip {
          display: flex;
          width: calc(200%); /* two sets of reels */
          animation: scrollX 40s linear infinite;
        }
      `}</style>

      <section className="py-16 px-4 sm:px-10">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white text-4xl sm:text-5xl font-extrabold tracking-wide"
          >
            INSTAGRAM REELS
          </motion.h2>

          <div className="h-1 w-24 mx-auto my-3 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-full" />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-zinc-300 text-base sm:text-lg"
          >
            Watch the latest reels from Instagram
          </motion.p>
        </div>

        {/* Infinite Scrolling Container */}
        <div className="relative overflow-hidden">
          <div className="scrolling-strip gap-6">
            {loopReels.map((reel, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[275px] h-[500px] rounded-xl overflow-hidden shadow-xl border border-white/10 bg-zinc-900"
              >
                <iframe
                  src={`${reel.url}embed/`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mt-10"
        >
          <Link href="/reels">
            <button className="bg-white text-black font-semibold px-6 py-2 rounded-xl hover:bg-gray-300 transition-all">
              View All Reels
            </button>
          </Link>
        </motion.div>
      </section>
    </>
  );
}
