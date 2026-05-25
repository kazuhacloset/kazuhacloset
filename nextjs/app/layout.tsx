'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

export default function FloatingLauncher() {
  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-3">

      {/* HOOK SHOWCASE CARD */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
          scale: 0.9,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.6,
        }}
        className="
          relative overflow-hidden

          rounded-2xl
          border border-white/10

          bg-black/70
          backdrop-blur-2xl

          px-5 py-4

          shadow-[0_0_40px_rgba(255,107,0,0.15)]

          max-w-[280px]
        "
      >
        {/* GLOW */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,107,0,0.18),transparent_70%)]" />

        {/* TOP LINE */}
        <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

        <div className="relative z-10">
          {/* LABEL */}
          <div className="flex items-center gap-2 mb-2">
            <Sparkles
              size={14}
              className="text-[#ff6b00]"
            />

            <p className="text-[10px] uppercase tracking-[0.25em] text-orange-400">
              New Anime Drop
            </p>
          </div>

          {/* TITLE */}
          <h3 className="text-white font-bold text-lg leading-tight">
            Premium Anime Streetwear
          </h3>

          {/* SUBTEXT */}
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            Explore oversized anime apparel inspired by Tokyo underground fashion culture.
          </p>

          {/* BUTTON */}
          <Link href="/allproducts">
            <motion.button
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="
                mt-4

                w-full

                rounded-xl

                bg-gradient-to-r
                from-[#ff6b00]
                to-[#E11D48]

                px-4 py-3

                text-xs
                font-semibold
                uppercase
                tracking-[0.2em]

                text-white

                shadow-[0_0_25px_rgba(255,107,0,0.35)]
              "
            >
              Shop Collection
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* FLOATING WHATSAPP BUTTON */}
      <Link
        href="https://wa.me/919336159782"
        target="_blank"
      >
        <motion.button
          whileHover={{
            scale: 1.08,
          }}
          whileTap={{
            scale: 0.95,
          }}
          className="
            group

            relative

            flex items-center justify-center

            w-16 h-16

            rounded-full

            bg-gradient-to-br
            from-[#ff6b00]
            to-[#E11D48]

            text-white

            shadow-[0_0_45px_rgba(255,107,0,0.45)]
          "
        >
          {/* PULSE */}
          <div className="absolute inset-0 rounded-full bg-orange-500/40 animate-ping" />

          <div className="relative z-10 flex items-center justify-center">
            <MessageCircle size={26} />
          </div>
        </motion.button>
      </Link>

      {/* MINI CART SHORTCUT */}
      <Link href="/allproducts">
        <motion.button
          whileHover={{
            scale: 1.05,
          }}
          className="
            flex items-center gap-2

            rounded-full

            border border-white/10

            bg-black/70
            backdrop-blur-xl

            px-4 py-3

            text-xs
            uppercase
            tracking-[0.18em]

            text-white

            hover:border-orange-500/40

            transition-all duration-500
          "
        >
          <ShoppingBag
            size={14}
            className="text-orange-400"
          />

          Explore
        </motion.button>
      </Link>
    </div>
  );
}