// components/WishlistPage.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, Eye, Trash2 } from "lucide-react";
import Navbar from "../common/navbar/Navbar";
import Image from "next/image";
import { getWishlist, toggleWishlist } from "../../utils/api/userUtils";
import toast from "react-hot-toast";
import { products, Product } from "./All_product";

export const WishlistPage = () => {
  const router = useRouter();

  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingItems, setRemovingItems] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    loadWishlist();
  }, [router]);

  const loadWishlist = async () => {
    try {
      const response = await getWishlist();

      const wishlistIds = response.wishlist || [];

      const filteredProducts = products.filter((product) =>
        wishlistIds.includes(product.id)
      );

      setWishlistProducts(filteredProducts);
    } catch (error) {
      console.error("Error loading wishlist:", error);
      toast.error("Error loading wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    if (removingItems.includes(productId)) return;

    setRemovingItems((prev) => [...prev, productId]);

    try {
      await toggleWishlist(productId);

      setWishlistProducts((prev) =>
        prev.filter((product) => product.id !== productId)
      );

      toast.success("Removed from wishlist!");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Error removing from wishlist");
    } finally {
      setRemovingItems((prev) =>
        prev.filter((id) => id !== productId)
      );
    }
  };

  const navigateToProduct = (productId: string) => {
    localStorage.setItem("productid", productId);
    router.push(`/product_page/`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < Math.floor(rating)
            ? "text-[#FF6B00]"
            : "text-zinc-600"
        }`}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
        <Navbar />

        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,107,0,0.12),transparent_30%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(225,29,72,0.12),transparent_30%)]" />

        <div className="relative z-10 pt-28 flex items-center justify-center">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full border-2 border-[#FF6B00]/30 border-t-[#FF6B00] animate-spin mx-auto mb-6" />

            <h2 className="text-2xl font-bold tracking-wide mb-2">
              Loading Wishlist
            </h2>

            <p className="text-zinc-500 text-sm tracking-wide">
              Preparing your saved anime collection...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <Navbar />

      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,107,0,0.15),transparent_30%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(225,29,72,0.15),transparent_30%)]" />

      {/* Grid Texture */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:45px_45px]" />

      {/* Ambient Glow */}
      <div className="absolute top-[-120px] left-[-100px] w-[320px] h-[320px] bg-[#FF6B00]/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-120px] right-[-100px] w-[320px] h-[320px] bg-[#E11D48]/20 blur-[120px] rounded-full" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-1 h-1 rounded-full bg-[#FF6B00]/40 animate-pulse" />
        <div className="absolute top-[60%] left-[80%] w-1 h-1 rounded-full bg-[#E11D48]/40 animate-pulse" />
        <div className="absolute top-[35%] left-[65%] w-1 h-1 rounded-full bg-white/20 animate-pulse" />
      </div>

      <div className="relative z-10 pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#FF6B00]/20 bg-[#111111]/80 backdrop-blur-xl mb-5">
              <div className="w-2 h-2 rounded-full bg-[#FF6B00]" />
              <span className="text-xs tracking-[0.3em] uppercase text-[#A1A1AA]">
                Curated Collection
              </span>
            </div>

            <p className="text-zinc-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Your saved premium anime streetwear archive —
              curated for your next cinematic fit.
            </p>

            <div className="mt-6 text-[#A1A1AA] text-sm tracking-wide">
              {wishlistProducts.length} item
              {wishlistProducts.length !== 1 && "s"} saved
            </div>
          </div>

          {/* Empty State */}
          {wishlistProducts.length === 0 ? (
            <div className="relative overflow-hidden border border-white/10 bg-[#111111]/70 backdrop-blur-2xl rounded-[32px] py-20 px-6 text-center max-w-3xl mx-auto shadow-[0_20px_80px_rgba(0,0,0,0.7)]">

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,107,0,0.12),transparent_35%)]" />

              <div className="relative z-10">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#FF6B00]/20 to-[#E11D48]/20 border border-white/10 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(255,107,0,0.18)]">
                  <Heart className="w-10 h-10 text-[#FF6B00]" />
                </div>

                <h2 className="text-3xl sm:text-4xl font-black mb-4">
                  Your Wishlist Is Empty
                </h2>

                <p className="text-zinc-500 max-w-md mx-auto mb-10 leading-relaxed">
                  Save your favorite anime streetwear pieces and
                  build your premium collection archive.
                </p>

                <button
                  onClick={() => router.push("/allproducts")}
                  className="group relative overflow-hidden px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-[#E11D48] text-white font-semibold tracking-wide transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_35px_rgba(255,107,0,0.35)]"
                >
                  <span className="relative z-10">
                    Explore Collection
                  </span>

                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.15),transparent)] translate-x-[-100%] group-hover:translate-x-[100%]" />
                </button>
              </div>
            </div>
          ) : (
            /* Wishlist Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigateToProduct(product.id)}
                  className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#111111]/70 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:border-[#FF6B00]/40 hover:shadow-[0_25px_60px_rgba(0,0,0,0.7)] cursor-pointer"
                >
                  {/* Ambient Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_top,rgba(255,107,0,0.15),transparent_45%)]" />

                  {/* Product Image */}
                  <div className="relative overflow-hidden h-72 border-b border-white/5 bg-[#18181B]">
                    <Image
                      src={product.thumbnail || ""}
                      alt={product.name}
                      width={500}
                      height={500}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromWishlist(product.id);
                      }}
                      disabled={removingItems.includes(product.id)}
                      className="absolute top-4 right-4 w-11 h-11 rounded-full border border-red-500/30 bg-black/70 backdrop-blur-xl flex items-center justify-center transition-all duration-300 hover:bg-red-500/20 hover:border-red-500/60 hover:shadow-[0_0_20px_rgba(225,29,72,0.3)]"
                    >
                      {removingItems.includes(product.id) ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 text-red-400" />
                      )}
                    </button>

                    {/* Sale Badge */}
                    {product.isSale && (
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#E11D48] text-white text-xs font-bold tracking-wide shadow-lg">
                        SALE
                      </div>
                    )}
                  </div>

                  {/* Product Content */}
                  <div className="relative p-5">

                    {/* Category */}
                    <p className="text-xs uppercase tracking-[0.25em] text-[#A1A1AA] mb-3">
                      {product.category}
                    </p>

                    {/* Title */}
                    <h3 className="text-xl font-bold leading-snug mb-3 text-[#F5F5F5] transition-colors duration-300 group-hover:text-[#FF6B00]">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">
                        {renderStars(product.rating)}
                      </div>

                      <span className="text-xs text-zinc-500">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl font-black text-white">
                        {product.price}
                      </span>

                      {product.originalPrice && (
                        <span className="text-sm line-through text-zinc-600">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2 mb-6">
                      {product.description}
                    </p>

                    {/* View Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToProduct(product.id);
                      }}
                      className="group/button relative overflow-hidden w-full py-3 rounded-2xl border border-[#FF6B00]/20 bg-[#18181B] text-white font-semibold tracking-wide transition-all duration-500 hover:border-[#FF6B00]/50 hover:shadow-[0_0_30px_rgba(255,107,0,0.18)]"
                    >
                      <div className="relative z-10 flex items-center justify-center gap-2">
                        <Eye className="w-4 h-4" />
                        View Product
                      </div>

                      <div className="absolute inset-0 opacity-0 group-hover/button:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-[#FF6B00]/10 to-[#E11D48]/10" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};