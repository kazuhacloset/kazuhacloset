// components/WishlistPage.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, Eye, Trash2 } from "lucide-react";
import Navbar from "../common/navbar/Navbar";
import Image from "next/image";
import { getWishlist, toggleWishlist } from "../../utils/api/userUtils";
import toast from "react-hot-toast";
import { products, Product } from "./All_product"; // Import products array

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

      // Filter products that are in wishlist
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
      setRemovingItems((prev) => prev.filter((id) => id !== productId));
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
          i < Math.floor(rating) ? "text-yellow-400" : "text-gray-400"
        }`}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <main className="relative bg-gradient-to-bl from-[#000000] to-[#a3a3a3] min-h-screen text-white">
        <Navbar />
        <div className="pt-24 pb-8 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-gray-400">Loading your wishlist...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative bg-gradient-to-bl from-[#000000] to-[#a3a3a3] min-h-screen text-white">
      <Navbar />

      <div className="pt-24 pb-8 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white">
              My Wishlist
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              {wishlistProducts.length} items saved for later
            </p>
          </div>

          {/* Empty Wishlist */}
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Your wishlist is empty
              </h3>
              <p className="text-gray-400 mb-8">
                Save products you love by clicking the heart icon
              </p>
              <button
                onClick={() => router.push("/allproducts")}
                className="bg-white text-black px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            /* Wishlist Items */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigateToProduct(product.id)}
                  className="group relative bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden hover:border-white/40 hover:bg-black/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-white/30 cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="relative w-full h-64 bg-black/40 backdrop-blur-md border-b border-white/20">
                    <Image
                      src={product.thumbnail || ""}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-contain bg-black transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Remove from Wishlist */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromWishlist(product.id);
                      }}
                      disabled={removingItems.includes(product.id)}
                      className="absolute top-3 right-3 p-2 bg-red-500/80 backdrop-blur-md rounded-full hover:bg-red-500 border border-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {removingItems.includes(product.id) ? (
                        <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <Trash2 className="w-4 h-4 text-white" />
                      )}
                    </button>

                    {/* Sale Badge */}
                    {product.isSale && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                        SALE
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-gray-300 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2 font-medium">
                        {product.category}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">{renderStars(product.rating)}</div>
                        <span className="text-gray-400 text-xs">
                          {product.rating} ({product.reviews} reviews)
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl font-bold text-white">
                          {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-gray-500 line-through text-sm">
                            {product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Only View Button */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToProduct(product.id);
                        }}
                        className="flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/30 hover:border-white/50"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </div>
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
