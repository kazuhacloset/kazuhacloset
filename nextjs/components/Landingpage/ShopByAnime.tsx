"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const animeCollections = [
  {
    title: "NARUTO",
    category: "Naruto",
    subtitle: "Hidden Leaf Streetwear",
    products: "24 Products",
    image: "/Community/Naruto.jpg",
    glow: "from-orange-500/30",
  },
  {
    title: "JUJUTSU KAISEN",
    category: "Jujutsu Kaisen",
    subtitle: "Cursed Energy Collection",
    products: "18 Products",
    image: "/Community/Jujutsu.jpg",
    glow: "from-red-500/30",
  },
  {
    title: "ONE PIECE",
    category: "One Piece",
    subtitle: "Grand Line Collection",
    products: "31 Products",
    image: "/Community/Onepiece.jpg",
    glow: "from-orange-400/30",
  },
  {
    title: "DRAGON BALL",
    category: "Dragon Ball Z",
    subtitle: "Saiyan Battlewear",
    products: "16 Products",
    image: "/Community/Dragonball.png",
    glow: "from-yellow-500/30",
  },
  {
    title: "DEMON SLAYER",
    category: "Demon Slayer",
    subtitle: "Hashira Oversized Drop",
    products: "21 Products",
    image: "/Community/Demonslayer.jpg",
    glow: "from-red-600/30",
  },
];

export default function ShopByAnime() {
  return (
    <section className="relative overflow-hidden bg-[#050505] px-4 py-16 md:px-8 lg:px-12">

      {/* AMBIENT GLOW */}
      <div className="absolute left-[-10%] top-0 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[140px]" />

      <div className="absolute bottom-0 right-[-10%] h-[500px] w-[500px] rounded-full bg-red-500/10 blur-[140px]" />

      {/* GRID TEXTURE */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >

          {/* LABEL */}
          <div className="mb-5 flex items-center justify-center gap-3">

            <div className="h-px w-10 bg-gradient-to-r from-transparent to-orange-500" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-orange-500 sm:text-xs">
              Curated Anime Collections
            </span>

            <div className="h-px w-10 bg-gradient-to-l from-transparent to-orange-500" />
          </div>

          {/* TITLE */}
          <h2 className="text-[2.4rem] font-black uppercase leading-none tracking-[-0.05em] text-white sm:text-5xl md:text-6xl">
            Shop By
            <span className="block bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent">
              Anime
            </span>
          </h2>

          {/* SUBTITLE */}
          <p className="mx-auto mt-5 max-w-[700px] text-sm leading-relaxed text-zinc-400 sm:text-base">
            Explore premium oversized streetwear inspired by
            legendary anime worlds and cinematic aesthetics.
          </p>

          {/* DIVIDER */}
          <div className="mt-7 flex items-center justify-center gap-4">

            <div className="h-px w-14 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-orange-500 sm:text-xs">
              COLLECTIONS
            </span>

            <div className="h-px w-14 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
          </div>
        </motion.div>

        {/* TOP GRID */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

          {/* LARGE FEATURED CARD */}
          <Link
            href={`/allproducts?category=${animeCollections[0].category}`}
          >
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.35 }}
              className="group relative overflow-hidden border border-zinc-800 bg-[#090909]"
            >

              {/* IMAGE */}
              <div className="relative h-[520px] overflow-hidden">

                <Image
                  src={animeCollections[0].image}
                  alt={animeCollections[0].title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* GLOW */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,120,0,0.25),transparent_55%)]" />

                {/* CONTENT */}
                <div className="absolute bottom-0 left-0 p-7 md:p-10">

                  <span className="mb-3 inline-block border border-orange-500/30 bg-black/50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400 backdrop-blur-md">
                    {animeCollections[0].products}
                  </span>

                  <h3 className="text-4xl font-black uppercase leading-none tracking-tight text-white md:text-6xl">
                    {animeCollections[0].title}
                  </h3>

                  <p className="mt-3 text-sm uppercase tracking-[0.2em] text-zinc-300">
                    {animeCollections[0].subtitle}
                  </p>

                  <button className="group/btn mt-7 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.25em] text-orange-400">
                    Explore Collection

                    <ArrowRight
                      size={18}
                      className="transition duration-300 group-hover/btn:translate-x-1"
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* RIGHT SMALL GRID */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            {animeCollections.slice(1, 5).map((anime, index) => (
              <Link
                key={index}
                href={`/allproducts?category=${anime.category}`}
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="group relative overflow-hidden border border-zinc-800 bg-[#090909]"
                >

                  {/* IMAGE */}
                  <div className="relative h-[250px] overflow-hidden">

                    <Image
                      src={anime.image}
                      alt={anime.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-110"
                    />

                    {/* OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                    {/* GLOW */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,120,0,0.18),transparent_60%)] opacity-0 transition duration-500 group-hover:opacity-100" />

                    {/* CONTENT */}
                    <div className="absolute bottom-0 left-0 p-5">

                      <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400">
                        {anime.products}
                      </span>

                      <h3 className="text-xl font-black uppercase leading-none tracking-tight text-white">
                        {anime.title}
                      </h3>

                      <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                        {anime.subtitle}
                      </p>

                      <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-400">

                        Explore

                        <ArrowRight
                          size={14}
                          className="transition duration-300 group-hover:translate-x-1"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* BOTTOM STRIP */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
          className="group relative mt-5 overflow-hidden border border-zinc-800 bg-[#090909]"
        >

          <div className="relative flex flex-col items-center justify-between gap-6 p-8 md:flex-row md:p-10">

            {/* GLOW */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(255,120,0,0.14),transparent_40%)]" />

            {/* TEXT */}
            <div className="relative z-10">

              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-500">
                New Universe Drop
              </span>

              <h3 className="mt-3 text-3xl font-black uppercase tracking-tight text-white md:text-5xl">
                SOLO LEVELING
              </h3>

              <p className="mt-3 max-w-[500px] text-sm leading-relaxed text-zinc-400">
                Shadow monarch inspired oversized silhouettes
                crafted with cinematic Korean streetwear aesthetics.
              </p>
            </div>

            {/* BUTTON */}
            <Link href="/allproducts?category=Solo%20Leveling">
              <button className="relative z-10 flex items-center gap-3 border border-orange-500/30 bg-black/60 px-7 py-4 text-sm font-black uppercase tracking-[0.25em] text-white backdrop-blur-md transition duration-300 hover:border-orange-500 hover:bg-orange-500/10">

                Explore Collection

                <ArrowRight
                  size={18}
                  className="transition duration-300 group-hover:translate-x-1"
                />
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}