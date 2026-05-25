"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

import {
  ArrowRight,
  Zap,
  Package,
  Truck,
  Sparkles,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";

const useParticles = (count: number) => {
  const [particles] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.4 + 0.05,
      duration: Math.random() * 10 + 8,
      delay: Math.random() * 6,
      color:
        Math.random() > 0.7
          ? "#FF6B00"
          : Math.random() > 0.5
          ? "#E11D48"
          : "#ffffff",
    }))
  );

  return particles;
};

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const particles = useParticles(45);

  const [mounted, setMounted] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, {
    stiffness: 50,
    damping: 20,
  });

  const springY = useSpring(mouseY, {
    stiffness: 50,
    damping: 20,
  });

  const rotateY = useTransform(springX, [-400, 400], [-8, 8]);
  const rotateX = useTransform(springY, [-400, 400], [5, -5]);

  const shiftX = useTransform(springX, [-400, 400], [-10, 10]);
  const shiftY = useTransform(springY, [-400, 400], [-10, 10]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      mouseX.set(e.clientX - rect.left - rect.width / 2);
      mouseY.set(e.clientY - rect.top - rect.height / 2);
    },
    [mouseX, mouseY]
  );

  useEffect(() => {
    setMounted(true);

    const container = containerRef.current;

    if (!container) return;

    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 40,
    },

    visible: (i: number) => ({
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.8,
        delay: i * 0.08,
      },
    }),
  };

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-[#050505] mt-[95px] mx-3 md:mx-5 rounded-[10px]"
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@300;400;500;600;700&display=swap");

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }

          100% {
            background-position: 200% center;
          }
        }

        .shimmer-btn {
          background: linear-gradient(
            135deg,
            #ff6b00 0%,
            #ff3366 50%,
            #ff6b00 100%
          );

          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes pulseGlow {
          0% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.5;
          }
        }
      `}</style>

      {/* MAIN BACKGROUND */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 40%, rgba(255,107,0,0.18), transparent 35%)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 80% 40%, rgba(255,80,0,0.20), transparent 28%)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.98))",
          }}
        />
      </div>

      {/* GRID */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "55px 55px",
        }}
      />

      {/* TOKYO GHOST TEXT */}
      <div className="absolute top-[18%] left-[22%] text-[180px] font-black text-white/[0.03] tracking-[0.2em] select-none pointer-events-none">
        TOKYO
      </div>

      {/* WATERMARK */}
      <div className="absolute right-[34%] top-[40%] text-[120px] font-black text-white/[0.03] rotate-[-20deg] pointer-events-none">
        限定
      </div>

      {/* VERTICAL JAPANESE TEXT */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3">
        <div className="w-[1px] h-28 bg-gradient-to-b from-transparent via-[#ff6b00] to-transparent" />

        <p className="text-white/30 text-xs tracking-[0.5em] writing-mode-vertical">
          東京ストリート
        </p>

        <div className="w-[1px] h-28 bg-gradient-to-b from-transparent via-[#ff6b00] to-transparent" />
      </div>

      {/* FLOATING KANJI */}
      <div className="absolute top-[22%] left-[47%] text-white/[0.12] text-4xl font-bold rotate-[-15deg]">
        漫画
      </div>

      <div className="absolute bottom-[25%] left-[42%] text-white/[0.08] text-5xl font-bold rotate-[12deg]">
        街
      </div>

      {/* SPEED LINES */}
      <div className="absolute left-[43%] top-[30%] rotate-[-20deg] opacity-20">
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent mb-3" />
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#ff6b00] to-transparent mb-3" />
        <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent" />
      </div>

      {/* PARTICLES */}
      {mounted &&
        particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              opacity: p.opacity,
            }}
            animate={{
              y: [0, -(Math.random() * 30 + 10), 0],
              opacity: [p.opacity, p.opacity * 2, p.opacity],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
          />
        ))}

      {/* SPARKLES */}
      <Sparkles
        className="absolute top-[25%] right-[35%] text-[#ff6b00]/50"
        size={18}
      />

      <Sparkles
        className="absolute bottom-[30%] left-[45%] text-white/30"
        size={14}
      />

      {/* CONTENT */}
      <div className="relative z-10 px-5 md:px-10 lg:px-14 py-10">
        <div className="grid lg:grid-cols-2 items-center gap-2 min-h-[500px]">
          {/* LEFT */}
          <div className="space-y-5 max-w-[540px] relative">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-3"
            >
              <div className="w-8 h-[1px] bg-[#FF6B00]" />

              <span className="uppercase tracking-[0.3em] text-[#FF6B00] text-[10px]">
                Limited Anime Collection
              </span>
            </motion.div>

            <motion.div
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="leading-[0.82] ml-1 relative"
            >
              <h1
                className="text-[4.5rem] sm:text-[5.5rem] lg:text-[7rem] font-bold text-[#ff6b00] relative z-10"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                }}
              >
                ANIME STREET
              </h1>

              <h1
                className="text-[3.8rem] sm:text-[4.5rem] lg:text-[5.8rem] font-bold text-transparent"
                style={{
                  WebkitTextStroke: "1px rgba(255,255,255,0.15)",
                  fontFamily: "'Bebas Neue', sans-serif",
                }}
              >
                WEAR
              </h1>
            </motion.div>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="max-w-md text-zinc-400 text-sm md:text-[15px] leading-relaxed"
            >
              Premium oversized anime apparel inspired by Tokyo underground
              streetwear culture. Designed for anime fans who love cinematic
              fashion aesthetics.
            </motion.p>

            {/* BUTTONS */}
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-3"
            >
              <Link href="/allproducts">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  className="shimmer-btn px-6 py-3 rounded-lg text-white uppercase tracking-[0.18em] text-[11px] font-semibold flex items-center gap-2 shadow-[0_0_40px_rgba(255,107,0,0.3)]"
                >
                  Shop Now
                  <ArrowRight size={14} />
                </motion.button>
              </Link>

              <motion.button
                whileHover={{
                  scale: 1.03,
                }}
                whileTap={{
                  scale: 0.96,
                }}
                className="border border-white/10 bg-white/[0.03] backdrop-blur-xl px-5 py-3 rounded-lg text-white/80 uppercase tracking-[0.16em] text-[11px]"
              >
                Explore Drop
              </motion.button>
            </motion.div>

            {/* FEATURES */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-2"
            >
              {[
                {
                  icon: <Zap size={12} />,
                  label: "Premium Cotton",
                },

                {
                  icon: <Package size={12} />,
                  label: "Oversized Fit",
                },

                {
                  icon: <Truck size={12} />,
                  label: "Fast Delivery",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 border border-white/10 bg-white/[0.03] backdrop-blur-xl px-3 py-2 rounded-lg"
                >
                  <span className="text-[#ff6b00]">{item.icon}</span>

                  <span className="text-[10px] uppercase tracking-[0.1em] text-zinc-300">
                    {item.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT */}
          <div className="relative flex items-center justify-center min-h-[420px]">
            {/* GLOW */}
            <div className="absolute w-[380px] h-[380px] rounded-full bg-[#ff6b00]/30 blur-[120px] animate-pulse" />

            <div className="absolute w-[260px] h-[260px] rounded-full bg-[#E11D48]/20 blur-[120px]" />

            {/* SHADOW */}
            <div className="absolute bottom-10 w-[250px] h-[40px] bg-black/70 blur-2xl rounded-full" />

            {/* PRODUCT */}
            <motion.div
              style={{
                rotateY,
                rotateX,
                x: shiftX,
                y: shiftY,
                transformPerspective: 1400,
                transformStyle: "preserve-3d",
              }}
              className="relative z-10"
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* MOTION LINES */}
              <div className="absolute -left-16 top-1/2 opacity-30">
                <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#ff6b00] to-transparent mb-3" />
                <div className="w-14 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent" />
              </div>

              <Image
                src="/back.png"
                alt="Naruto Tshirt"
                width={550}
                height={550}
                priority
                className="w-full max-w-[340px] md:max-w-[400px] object-contain drop-shadow-[0_25px_100px_rgba(0,0,0,0.9)]"
              />

              {/* BADGE */}
              <motion.div
                className="absolute top-5 right-0 bg-gradient-to-r from-[#ff6b00] to-[#E11D48] px-4 py-2 rounded-lg text-white uppercase tracking-[0.22em] text-[8px]"
                animate={{
                  y: [0, -4, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                }}
              >
                New Drop
              </motion.div>

              {/* PRICE */}
              <motion.div
                className="absolute bottom-2 -left-4 bg-black/70 backdrop-blur-xl border border-white/10 px-4 py-3 rounded-xl"
                animate={{
                  y: [0, -4, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              >
                <p className="text-[8px] uppercase tracking-[0.22em] text-zinc-500">
                  Starting At
                </p>

                <h2
                  className="text-3xl text-white"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                  }}
                >
                  ₹399
                </h2>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}