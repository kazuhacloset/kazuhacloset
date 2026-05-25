"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const products = [
  {
    id: "itachi",
    name: "ITACHI UCHIHA",
    subtitle: "OVERSIZED T-SHIRT",
    price: "₹399",
    image: "/Productimage/ITACHI/front.png",
    badge: "BEST SELLER",
    badgeColor: "bg-gradient-to-r from-[#ff7b00] to-[#ff4d00]",
  },
  {
    id: "goku",
    name: "GOKU",
    subtitle: "OVERSIZED T-SHIRT",
    price: "₹399",
    image: "/Productimage/GOKU/front.png",
    badge: "NEW DROP",
    badgeColor: "bg-gradient-to-r from-[#ff8a00] to-[#ff5e00]",
  },
  {
    id: "obito",
    name: "OBITO UCHIHA",
    subtitle: "OVERSIZED T-SHIRT",
    price: "₹399",
    image: "/Productimage/OBITO/front.png",
    badge: "BEST SELLER",
    badgeColor: "bg-gradient-to-r from-[#ff7b00] to-[#ff4d00]",
  },
];

export default function ProductShowcase() {
  return (
    <section className="relative w-full overflow-hidden bg-[#050505]">

      {/* CINEMATIC GLOBAL GLOW */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,110,0,0.06),transparent_55%)]" />

      {/* PREMIUM COLLECTION BAR */}
      <div
        className="
          relative z-20
          border-y border-orange-500/15
          bg-gradient-to-r
          from-[#120600]
          via-[#3a1200]
          to-[#120600]
          shadow-[0_0_45px_rgba(255,98,0,0.10)]
        "
      >

        {/* TOP LIGHT LINE */}
        <div className="absolute left-0 top-0 h-[1px] w-full bg-orange-400/15" />

        {/* BOTTOM LIGHT LINE */}
        <div className="absolute bottom-0 left-0 h-[1px] w-full bg-orange-400/10" />

        {/* CENTER ATMOSPHERIC GLOW */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,120,0,0.10),transparent_70%)]" />

        {/* CONTENT */}
        <div className="relative flex h-[62px] items-center justify-center">

          {/* LEFT LINE */}
          <div className="mr-4 h-[1px] w-8 bg-gradient-to-r from-transparent to-orange-500" />

          {/* TITLE */}
          <h2
            className="
              text-center
              text-[13px]
              font-black
              uppercase
              tracking-[0.35em]
              text-white
              drop-shadow-[0_0_12px_rgba(255,140,0,0.25)]

              sm:text-[15px]
              md:text-2xl
            "
          >
            PREMIUM COLLECTION
          </h2>

          {/* RIGHT LINE */}
          <div className="ml-4 h-[1px] w-8 bg-gradient-to-l from-transparent to-orange-500" />
        </div>
      </div>

      {/* PRODUCT SECTION */}
      <div className="relative bg-[#050505] px-3 py-5 md:px-8 lg:px-12">

        {/* LEFT GLOW */}
        <div className="absolute left-[-10%] top-0 h-[350px] w-[350px] rounded-full bg-orange-500/10 blur-[130px]" />

        {/* RIGHT GLOW */}
        <div className="absolute bottom-0 right-[-10%] h-[350px] w-[350px] rounded-full bg-[#ff6a00]/10 blur-[130px]" />

        {/* GRID */}
        <div
          className="
            relative z-10
            grid gap-3

            grid-cols-2
            sm:grid-cols-2

            md:grid-cols-4
          "
        >

          {/* PRODUCT CARDS */}
          {products.map((product, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.35 }}
              className="
                group overflow-hidden
                rounded-2xl
                border border-zinc-800
                bg-[#090909]

                transition-all duration-500

                hover:border-orange-500/40
                hover:shadow-[0_0_40px_rgba(255,120,0,0.10)]
              "
            >

              {/* IMAGE AREA */}
              <div
                className="
                  relative flex items-center justify-center overflow-hidden

                  bg-gradient-to-b
                  from-[#101010]
                  to-black

                  h-[170px]
                  p-3

                  sm:h-[210px]

                  md:h-[360px]
                  md:p-5
                "
              >

                {/* HOVER GLOW */}
                <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(255,120,0,0.16),transparent_70%)]" />

                {/* SHINE EFFECT */}
                <div className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition duration-700 group-hover:translate-x-[120%] group-hover:opacity-100" />

                {/* BADGE */}
                <div
                  className={`
                    absolute left-2 top-2 z-20
                    px-2 py-[4px]

                    text-[8px]
                    md:text-[10px]

                    font-bold uppercase
                    tracking-[0.15em]
                    text-white

                    rounded-sm
                    shadow-lg

                    ${product.badgeColor}
                  `}
                >
                  {product.badge}
                </div>

                {/* PRODUCT IMAGE */}
                <Image
                  src={product.image}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="
                    h-full w-full object-contain
                    transition duration-500
                    group-hover:scale-105
                  "
                />

                {/* BOTTOM FADE */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black to-transparent md:h-24" />
              </div>

              {/* CONTENT */}
              <div
                className="
                  space-y-1

                  px-2 pb-3 pt-2

                  sm:px-3

                  md:px-4 md:pb-5 md:pt-3
                "
              >

                {/* NAME */}
                <h3
                  className="
                    line-clamp-1

                    text-[11px]
                    sm:text-[12px]
                    md:text-sm

                    font-extrabold uppercase
                    tracking-[0.05em]

                    text-white
                  "
                >
                  {product.name}
                </h3>

                {/* SUBTITLE */}
                <p
                  className="
                    text-[8px]
                    sm:text-[9px]
                    md:text-[11px]

                    uppercase
                    tracking-[0.18em]

                    text-zinc-500
                  "
                >
                  {product.subtitle}
                </p>

                {/* PRICE */}
                <div className="pt-1 md:pt-2">
                  <span
                    className="
                      text-base
                      sm:text-lg
                      md:text-xl

                      font-black

                      bg-gradient-to-r
                      from-orange-300
                      to-orange-500

                      bg-clip-text
                      text-transparent
                    "
                  >
                    {product.price}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}

          {/* VIEW COLLECTION CARD */}
          <Link href="/allproducts">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="
                group relative

                flex cursor-pointer flex-col
                items-center justify-center
                overflow-hidden

                rounded-2xl
                border border-zinc-800
                bg-[#070707]

                min-h-[240px]
                md:min-h-[470px]

                transition-all duration-500

                hover:border-orange-500/40
                hover:shadow-[0_0_45px_rgba(255,120,0,0.14)]
              "
            >

              {/* GLOW */}
              <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(255,120,0,0.12),transparent_70%)]" />

              {/* LIGHT STREAK */}
              <div className="absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent" />

              {/* ICON */}
              <div
                className="
                  relative z-10

                  mb-4

                  flex h-9 w-9
                  md:h-11 md:w-11

                  items-center justify-center

                  rounded-full
                  border border-orange-500/40

                  text-orange-400

                  shadow-[0_0_18px_rgba(255,120,0,0.22)]
                "
              >
                ✦
              </div>

              {/* TEXT */}
              <h3
                className="
                  relative z-10

                  text-center
                  font-black uppercase
                  leading-tight
                  tracking-[0.08em]

                  text-white

                  text-lg
                  sm:text-xl
                  md:text-4xl
                "
              >
                View
                <br />
                Collection
              </h3>

              {/* LINE */}
              <div
                className="
                  relative z-10

                  my-4 md:my-8
                  h-[2px]

                  w-12 md:w-20

                  bg-gradient-to-r
                  from-orange-500
                  to-orange-300

                  transition-all duration-300

                  group-hover:w-16
                  md:group-hover:w-28
                "
              />

              {/* ARROW */}
              <ArrowRight
                size={28}
                className="
                  relative z-10
                  text-orange-400

                  transition duration-300
                  group-hover:translate-x-2
                "
              />
            </motion.div>
          </Link>
        </div>
      </div>
    </section>
  );
}