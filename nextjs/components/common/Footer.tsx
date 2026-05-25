// components/Footer.tsx

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Facebook, Instagram } from "lucide-react";

export default function Footer() {
  const links = [
    {
      name: "Privacy Policy",
      href: "/privacy-policy",
    },
    {
      name: "Terms & Conditions",
      href: "/terms-and-conditions",
    },
    {
      name: "Refund Policy",
      href: "/refund-policy",
    },
    {
      name: "Shipping Policy",
      href: "/shipping-policy",
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#050505] text-[#F5F5F5]">
      {/* ================= ATMOSPHERIC BACKGROUND ================= */}
      <div className="absolute inset-0">
        {/* DARK BASE GRADIENT */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #050505 0%, #0A0A0A 35%, #050505 100%)",
          }}
        />

        {/* ORANGE BLOOM */}
        <div className="absolute top-[-30%] left-[10%] w-[420px] h-[420px] bg-orange-500/8 blur-[140px] rounded-full" />

        {/* CRIMSON BLOOM */}
        <div className="absolute bottom-[-20%] right-[12%] w-[380px] h-[380px] bg-rose-500/8 blur-[140px] rounded-full" />

        {/* CINEMATIC SHADOW */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* GRID TEXTURE */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,107,0,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,107,0,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "72px 72px",
          }}
        />

        {/* TOP GLOW DIVIDER */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

        {/* SECONDARY DIVIDER GLOW */}
        <div className="absolute top-[1px] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-500/10 to-transparent" />

        {/* LIGHT STREAK */}
        <motion.div
          animate={{
            opacity: [0.12, 0.32, 0.12],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
          }}
          className="absolute left-[18%] top-0 w-px h-full bg-gradient-to-b from-transparent via-orange-500/20 to-transparent"
        />

        {/* NOISE TEXTURE */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-soft-light"
          style={{
            backgroundImage:
              "url('https://www.transparenttextures.com/patterns/asfalt-dark.png')",
          }}
        />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 max-w-[1700px] mx-auto px-5 sm:px-8 md:px-12 lg:px-20 py-12 sm:py-14">
        {/* BRAND STATEMENT */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <p
            className="
              text-[10px]
              sm:text-xs
              uppercase
              tracking-[0.34em]
              text-zinc-500
            "
          >
            Premium Anime Streetwear Inspired By Japanese Culture.
          </p>
        </motion.div>

        {/* POLICY LINKS */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 sm:gap-x-10 mb-10">
          {links.map((link, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -2 }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
            >
              <Link
                href={link.href}
                className="
                  group
                  relative
                  text-[11px]
                  sm:text-[12px]
                  uppercase
                  tracking-[0.18em]
                  text-zinc-500
                  hover:text-[#F5F5F5]
                  transition-all
                  duration-500
                "
              >
                <span className="relative z-10">
                  {link.name}
                </span>

                {/* UNDERLINE */}
                <span
                  className="
                    absolute
                    left-0
                    bottom-[-7px]
                    h-px
                    w-0
                    bg-gradient-to-r
                    from-orange-500
                    to-rose-500
                    transition-all
                    duration-500
                    group-hover:w-full
                  "
                />

                {/* GLOW */}
                <span
                  className="
                    absolute
                    inset-0
                    opacity-0
                    group-hover:opacity-100
                    blur-xl
                    transition-opacity
                    duration-500
                    bg-orange-500/10
                  "
                />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* SOCIALS */}
        <div className="flex justify-center items-center gap-5 sm:gap-6 mb-10">
          {/* FACEBOOK */}
          <motion.div
            whileHover={{
              y: -3,
              scale: 1.06,
            }}
            transition={{
              duration: 0.35,
              ease: "easeOut",
            }}
          >
            <Link
              href="https://www.facebook.com/profile.php?id=61573468100133"
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                relative
                flex
                items-center
                justify-center
                w-11
                h-11
                rounded-full
                border
                border-white/10
                bg-white/[0.03]
                backdrop-blur-xl
                overflow-hidden
                hover:border-orange-500/30
                transition-all
                duration-500
              "
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-orange-500/20 to-rose-500/10" />

              <div className="absolute inset-0 rounded-full blur-xl bg-orange-500/0 group-hover:bg-orange-500/20 transition-all duration-500" />

              <Facebook className="relative z-10 w-[17px] h-[17px] text-zinc-400 group-hover:text-white transition-colors duration-500" />
            </Link>
          </motion.div>

          {/* INSTAGRAM */}
          <motion.div
            whileHover={{
              y: -3,
              scale: 1.06,
            }}
            transition={{
              duration: 0.35,
              ease: "easeOut",
            }}
          >
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                relative
                flex
                items-center
                justify-center
                w-11
                h-11
                rounded-full
                border
                border-white/10
                bg-white/[0.03]
                backdrop-blur-xl
                overflow-hidden
                hover:border-orange-500/30
                transition-all
                duration-500
              "
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-orange-500/20 to-rose-500/10" />

              <div className="absolute inset-0 rounded-full blur-xl bg-orange-500/0 group-hover:bg-orange-500/20 transition-all duration-500" />

              <Instagram className="relative z-10 w-[17px] h-[17px] text-zinc-400 group-hover:text-white transition-colors duration-500" />
            </Link>
          </motion.div>

          {/* X */}
          <motion.div
            whileHover={{
              y: -3,
              scale: 1.06,
            }}
            transition={{
              duration: 0.35,
              ease: "easeOut",
            }}
          >
            <Link
              href="https://x.com/Kazuha_Closet?t=iTKAm5siUQKB4qF84hknsg&s=09"
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                relative
                flex
                items-center
                justify-center
                w-11
                h-11
                rounded-full
                border
                border-white/10
                bg-white/[0.03]
                backdrop-blur-xl
                overflow-hidden
                hover:border-orange-500/30
                transition-all
                duration-500
              "
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-orange-500/20 to-rose-500/10" />

              <div className="absolute inset-0 rounded-full blur-xl bg-orange-500/0 group-hover:bg-orange-500/20 transition-all duration-500" />

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1200 1227"
                fill="currentColor"
                className="relative z-10 w-[15px] h-[15px] text-zinc-400 group-hover:text-white transition-colors duration-500"
              >
                <path d="M714.2 519.8L1160 0H1055.5L667.7 
                450.9 356.1 0H0l463.2 681.6L0 
                1227h104.5l407.1-476.9L843.9 
                1227H1200L714.2 519.8zM566.1 
                685.6l-47.2-67.7L142.1 79h162.6l305.7 
                438.2 47.2 67.7 400.1 574.1H895.1L566.1 
                685.6z" />
              </svg>
            </Link>
          </motion.div>

          {/* THREADS */}
          <motion.div
            whileHover={{
              y: -3,
              scale: 1.06,
            }}
            transition={{
              duration: 0.35,
              ease: "easeOut",
            }}
          >
            <Link
              href="https://www.threads.com/@kazuha__closet"
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                relative
                flex
                items-center
                justify-center
                w-11
                h-11
                rounded-full
                border
                border-white/10
                bg-white/[0.03]
                backdrop-blur-xl
                overflow-hidden
                hover:border-orange-500/30
                transition-all
                duration-500
              "
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-orange-500/20 to-rose-500/10" />

              <div className="absolute inset-0 rounded-full blur-xl bg-orange-500/0 group-hover:bg-orange-500/20 transition-all duration-500" />

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 50 50"
                fill="currentColor"
                className="relative z-10 w-[16px] h-[16px] text-zinc-400 group-hover:text-white transition-colors duration-500"
              >
                <path d="M25 1C11.8 1 1 11.8 1 25s10.8 24 24 24 24-10.8 24-24S38.2 1 25 1zm0 44C13.4 45 3.9 35.6 3.9 24S13.4 3 25 3s21.1 9.4 21.1 21S36.6 45 25 45zm6.4-18.2c2.1.7 3.5 2.5 3.5 5.2 0 4.4-3.5 7.1-8.8 7.1-4.2 0-7.5-2-9.2-5.5l2.8-1.5c1.1 2.3 3.1 3.6 6.2 3.6 3.4 0 5.5-1.5 5.5-3.9 0-2.1-1.2-3.2-3.9-3.9l-2.7-.6c-4.4-1-6.6-3.2-6.6-6.9 0-4.2 3.3-7 8.3-7 3.8 0 6.7 1.6 8.3 4.7l-2.7 1.5c-1-1.9-2.7-2.9-5.6-2.9-3.1 0-5 1.5-5 3.8 0 2 1.1 3.1 3.9 3.8l2.5.6c4.9 1.2 7 3.3 7 7z" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* COPYRIGHT */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{
            duration: 1,
          }}
          className="text-center"
        >
          <p
            className="
              text-[11px]
              sm:text-xs
              text-zinc-600
              tracking-[0.14em]
            "
          >
            © 2025 KazuhaCloset. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}