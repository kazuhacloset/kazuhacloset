"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const reviews = [
  {
    name: "KuroNeko",
    text: "The quality is insane. Kazuha Closet never disappoints.",
    position: "top-[24%] left-[58%]",
  },
  {
    name: "AnimeKing",
    text: "Finally a brand that understands anime culture perfectly.",
    position: "top-[54%] left-[52%]",
  },
];

const stats = [
  { value: "50K+", label: "Anime Fans Worldwide" },
  { value: "4.9★", label: "Verified Community Rating" },
  { value: "99%", label: "Premium Quality Satisfaction" },
];

export default function AnimeCommunitySection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#050505] text-white">
      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0">
        {/* IMAGE */}
        <motion.div
          initial={{ scale: 1.04 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease: "easeOut" }}
          className="absolute inset-0 scale-[0.96]"
          style={{
            backgroundImage: "url('/Community/animestreet.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "75% center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* CINEMATIC OVERLAY */}
        <div className="absolute inset-0 bg-black/55" />

        {/* LUXURY DARK GRADIENT */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg,#050505 3%,rgba(5,5,5,0.98) 15%,rgba(5,5,5,0.88) 30%,rgba(5,5,5,0.45) 54%,transparent 100%)",
          }}
        />

        {/* ATMOSPHERIC SHADOW */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 75% 40%, rgba(0,0,0,0.15), transparent 42%)",
          }}
        />

        {/* ORANGE BLOOM */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 72% 38%, rgba(255,98,0,0.20), transparent 42%)",
          }}
        />

        {/* CRIMSON BLOOM */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 82% 72%, rgba(225,29,72,0.12), transparent 34%)",
          }}
        />

        {/* AMBIENT LIGHTING */}
        <div className="absolute bottom-[-20%] right-[10%] w-[500px] h-[500px] bg-rose-600/10 blur-[160px] rounded-full" />

        <div className="absolute top-[-10%] left-[-10%] w-[540px] h-[540px] bg-orange-500/10 blur-[180px] rounded-full" />

        {/* SOFT LIGHT STREAK */}
        <motion.div
          animate={{
            opacity: [0.2, 0.45, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
          className="absolute top-0 left-[20%] w-[1px] h-full bg-gradient-to-b from-transparent via-orange-500/30 to-transparent"
        />

        {/* SECOND LIGHT STREAK */}
        <motion.div
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
          }}
          className="absolute top-0 right-[18%] w-[1px] h-full bg-gradient-to-b from-transparent via-rose-500/20 to-transparent"
        />

        {/* GRID */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,107,0,0.10) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,107,0,0.10) 1px, transparent 1px)
            `,
            backgroundSize: "72px 72px",
          }}
        />

        {/* PREMIUM NOISE */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-soft-light"
          style={{
            backgroundImage:
              "url('https://www.transparenttextures.com/patterns/asfalt-dark.png')",
          }}
        />

        {/* VIGNETTE */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.78), transparent 18%, transparent 78%, rgba(0,0,0,0.9))",
          }}
        />

        {/* PARTICLES */}
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              background:
                i % 2 === 0
                  ? "rgba(255,107,0,0.4)"
                  : "rgba(225,29,72,0.4)",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              filter: "blur(1px)",
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.15, 0.7, 0.15],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="relative z-10 max-w-[1700px] mx-auto min-h-[650px] flex items-center px-5 sm:px-8 md:px-12 lg:px-20">
        <div className="grid lg:grid-cols-2 w-full items-center gap-4">
          {/* ================= LEFT CONTENT ================= */}
          <motion.div
            initial={{ opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-[580px] py-20 sm:py-24 md:py-28"
          >
            {/* LABEL */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-10 bg-gradient-to-r from-orange-500 to-transparent" />

              <span className="uppercase tracking-[0.32em] text-[10px] sm:text-[11px] text-orange-400 font-semibold">
                Trusted By Anime Fans
              </span>
            </div>

            {/* HEADING */}
            <h1
              className="
                font-black
                uppercase
                tracking-[-0.05em]
                leading-[0.82]
                text-[52px]
                min-[390px]:text-[58px]
                sm:text-[68px]
                md:text-[82px]
                lg:text-[92px]
                xl:text-[98px]
              "
              style={{
                textShadow: "0 0 40px rgba(255,255,255,0.04)",
              }}
            >
              Anime
              <br />
              <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-500 bg-clip-text text-transparent">
                Community
              </span>
            </h1>

            {/* SUBTEXT */}
            <p
              className="
                mt-6
                text-zinc-400
                leading-relaxed
                text-[14px]
                sm:text-[15px]
                max-w-[500px]
              "
            >
              Join thousands of anime fans worldwide who trust Kazuha
              Closet for premium quality streetwear inspired by modern
              Japanese fashion culture.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mt-8">
              {/* PRIMARY */}
              <Link href="/allproducts">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="
                    group
                    relative
                    overflow-hidden
                    px-7
                    sm:px-9
                    py-3.5
                    uppercase
                    tracking-[0.22em]
                    text-[10px]
                    sm:text-xs
                    font-bold
                    rounded-full
                  "
                  style={{
                    background:
                      "linear-gradient(135deg,#FF6B00 0%,#FF7A1A 45%,#E85D04 100%)",
                    boxShadow:
                      "0 0 50px rgba(255,98,0,0.28), inset 0 1px 0 rgba(255,255,255,0.12)",
                  }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-white/10 to-transparent" />

                  <span className="relative z-10">
                    Explore Collection
                  </span>
                </motion.button>
              </Link>

              {/* SECONDARY */}
              <Link
                href="https://www.instagram.com/kazuha__closet/"
                target="_blank"
              >
                <motion.button
                  whileHover={{ y: -2 }}
                  className="
                    group
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.04]
                    backdrop-blur-2xl
                    px-7
                    py-3.5
                    uppercase
                    tracking-[0.22em]
                    text-[10px]
                    sm:text-xs
                    hover:border-orange-500/40
                    transition-all
                    duration-500
                    relative
                    overflow-hidden
                  "
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-orange-500/[0.08] to-rose-500/[0.08]" />

                  <span className="relative z-10">
                    Play Reel
                  </span>
                </motion.button>
              </Link>
            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-2 gap-y-5 gap-x-5 sm:gap-x-8 mt-11">
              {[
                "Premium Quality",
                "Worldwide Shipping",
                "Secure Payment",
                "24/7 Support",
              ].map((item) => (
                <div
                  key={item}
                  className="
                    flex
                    items-center
                    gap-2.5
                    text-zinc-500
                    uppercase
                    tracking-[0.16em]
                    text-[9px]
                    sm:text-[10px]
                  "
                >
                  <div className="relative">
                    <div className="w-2 h-2 bg-orange-500 rounded-full shrink-0 shadow-[0_0_14px_rgba(255,98,0,0.9)]" />

                    <div className="absolute inset-0 bg-orange-500 rounded-full blur-[6px] opacity-70" />
                  </div>

                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="hidden lg:block relative h-[560px]">
            {/* FRAME */}
            <div
              className="
                absolute
                right-[14%]
                top-[10%]
                w-[320px]
                h-[420px]
                border
                border-orange-500/15
              "
              style={{
                boxShadow:
                  "0 0 120px rgba(255,98,0,0.10), inset 0 0 50px rgba(255,98,0,0.03)",
              }}
            />

            {/* REVIEW CARDS */}
            {reviews.map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.4 + i * 0.2,
                }}
                whileHover={{
                  y: -8,
                }}
                className={`absolute ${review.position} w-[240px]`}
              >
                <div
                  className="
                    group
                    relative
                    overflow-hidden
                    backdrop-blur-3xl
                    bg-gradient-to-b
                    from-white/[0.10]
                    to-white/[0.03]
                    border
                    border-white/10
                    rounded-[28px]
                    p-5
                    transition-all
                    duration-700
                    hover:border-orange-500/30
                  "
                  style={{
                    boxShadow:
                      "0 20px 60px rgba(0,0,0,0.5), 0 0 60px rgba(255,98,0,0.08)",
                  }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 bg-gradient-to-br from-orange-500/[0.12] via-transparent to-rose-500/[0.05]" />

                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />

                  <div className="relative z-10 flex items-center gap-3 mb-4">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-orange-500 shadow-[0_0_35px_rgba(255,98,0,0.65)]" />

                      <div className="absolute inset-0 rounded-full bg-orange-500 blur-[14px] opacity-50" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        {review.name}
                      </p>

                      <p className="text-orange-400 text-xs tracking-[0.15em]">
                        ★★★★★
                      </p>
                    </div>
                  </div>

                  <p className="relative z-10 text-[13px] text-zinc-400 leading-relaxed">
                    &quot;{review.text}&quot;
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= MOBILE REVIEWS ================= */}
      <div className="relative z-20 lg:hidden px-5 sm:px-8 pb-10">
        <div className="grid sm:grid-cols-2 gap-4 max-w-[650px] mx-auto">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="
                relative
                overflow-hidden
                backdrop-blur-3xl
                bg-gradient-to-b
                from-white/[0.10]
                to-white/[0.03]
                border
                border-white/10
                rounded-[26px]
                p-5
                shadow-[0_10px_40px_rgba(0,0,0,0.45)]
              "
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.06] via-transparent to-transparent opacity-60" />

              <div className="relative z-10 flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-500 shadow-[0_0_30px_rgba(255,98,0,0.5)]" />

                <div>
                  <p className="text-sm font-semibold">
                    {review.name}
                  </p>

                  <p className="text-orange-400 text-xs">
                    ★★★★★
                  </p>
                </div>
              </div>

              <p className="relative z-10 text-[13px] text-zinc-400 leading-relaxed">
                &quot;{review.text}&quot;
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div
        className="
          relative
          z-20
          border-t
          border-orange-500/10
          bg-black/60
          backdrop-blur-3xl
        "
      >
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

        <div className="max-w-[1700px] mx-auto px-5 sm:px-8 md:px-12 lg:px-20 py-7 sm:py-9">
          <div
            className="
              grid
              grid-cols-2
              md:grid-cols-4
              gap-8
              items-center
            "
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="relative"
              >
                {i !== 0 && (
                  <div className="hidden md:block absolute -left-6 top-1/2 -translate-y-1/2 h-10 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                )}

                <h3
                  className="
                    text-orange-500
                    font-black
                    text-[34px]
                    sm:text-[42px]
                    md:text-[50px]
                    tracking-[-0.05em]
                  "
                  style={{
                    textShadow:
                      "0 0 30px rgba(255,98,0,0.18)",
                  }}
                >
                  {stat.value}
                </h3>

                <p
                  className="
                    text-zinc-500
                    uppercase
                    tracking-[0.2em]
                    text-[9px]
                    sm:text-[10px]
                    mt-2
                  "
                >
                  {stat.label}
                </p>
              </div>
            ))}

            {/* CTA */}
            <div className="flex md:justify-end">
              <Link
                href="https://wa.me/919336159782?text=Hey%20Kazuha%20Closet%20I%20want%20to%20know%20about%20your%20anime%20collection"
                target="_blank"
              >
                <motion.button
                  whileHover={{ x: 4 }}
                  className="
                    group
                    uppercase
                    tracking-[0.22em]
                    text-[10px]
                    sm:text-xs
                    text-orange-400
                    hover:text-orange-300
                    transition-all
                    duration-500
                    relative
                  "
                >
                  <span className="relative z-10">
                    Message On WhatsApp →
                  </span>

                  <div className="absolute bottom-[-6px] left-0 w-0 h-px bg-gradient-to-r from-orange-500 to-rose-500 group-hover:w-full transition-all duration-500" />
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}