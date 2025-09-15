// components/All_product.tsx
"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Grid, List, Heart, Star, Eye, SlidersHorizontal } from "lucide-react";
import Navbar from "../common/navbar/Navbar";
import Image from "next/image";
import { toggleWishlist, getWishlist } from "../../utils/api/userUtils";
import toast from "react-hot-toast";

export type Product = {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  type: "video" | "image";
  video: string;
  thumbnail?: string;
  description: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  isNew?: boolean;
  isSale?: boolean;
  tags: string[];
};

export const products: Product[] = [
  {
    id: "naruto-tee-001",
    name: "Naruto Tee",
    price: "₹599",
    originalPrice: "₹799",
    type: "image",
    video: "",
    thumbnail: "/Productimage/NARUTO/front.png",
    description: "High-quality Naruto-themed T-shirt with durable print and premium cotton fabric.",
    category: "Naruto",
    rating: 4.8,
    reviews: 156,
    inStock: true,
    isSale: true,
    tags: ["anime", "naruto", "cotton", "comfortable"],
  },
  {
    id: "giyu-tee-001",
    name: "Giyu Tee",
    price: "₹449",
    originalPrice: "₹649",
    type: "image",
    video: "",
    thumbnail: "/Productimage/GIYU/front.png",
    description: "Stylish Giyu Tomioka T-shirt",
    category: "Demon Slayer",
    rating: 4.9,
    reviews: 0,
    inStock: true,
    tags: ["anime", "Demon Slayer", "Giyu", "T-shirt"],
  },
  {
    id: "itachi-tee-001",
    name: "Itachi Tee",
    price: "₹429",
    originalPrice: "₹629",
    type: "image",
    video: "",
    thumbnail: "/Productimage/ITACHI/front.png",
    description: "Elegant Itachi Uchiha design tee",
    category: "Naruto",
    rating: 4.7,
    reviews: 0,
    inStock: true,
    tags: ["anime", "Naruto", "Itachi", "Uchiha"],
  },
  {
    id: "rengoku-tee-001",
    name: "Rengoku Tee",
    price: "₹459",
    originalPrice: "₹659",
    type: "image",
    video: "",
    thumbnail: "/Productimage/RENGOKU/front.png",
    description: "Fiery Rengoku Flame Hashira tee",
    category: "Demon Slayer",
    rating: 4.9,
    reviews: 0,
    inStock: true,
    tags: ["anime", "Demon Slayer", "Rengoku", "Flame Hashira"],
  },
  {
    id: "jiraiya-tee-001",
    name: "Jiraiya Tee",
    price: "₹419",
    originalPrice: "₹619",
    type: "image",
    video: "",
    thumbnail: "/Productimage/JIRAYA/front.png",
    description: "Legendary Sannin Jiraiya T-shirt",
    category: "Naruto",
    rating: 4.6,
    reviews: 0,
    inStock: true,
    tags: ["anime", "Naruto", "Jiraiya", "Sannin"],
  },
  {
    id: "goku-tee-001",
    name: "Goku Tee",
    price: "₹599",
    originalPrice: "₹899",
    type: "image",
    video: "",
    thumbnail: "/Productimage/GOKU/front.png",
    description: "Premium Dragon Ball Z Goku T-shirt made with soft cotton fabric and vibrant print quality.",
    category: "Dragon Ball Z",
    rating: 4.9,
    reviews: 182,
    inStock: true,
    isSale: true,
    tags: ["anime", "dragonball", "goku", "cotton", "comfortable"],
  },
  {
    id: "infinitycastle-tee-001",
    name: "Infinity Castle Tee",
    price: "₹649",
    originalPrice: "₹899",
    type: "image",
    video: "",
    thumbnail: "/Productimage/INFINITY CASTLE/front.png",
    description: "Exclusive Infinity Castle T-shirt inspired by Demon Slayer. Stylish, durable, and perfect for anime fans.",
    category: "Demon Slayer",
    rating: 4.7,
    reviews: 143,
    inStock: true,
    isSale: false,
    tags: ["anime", "demon slayer", "infinity castle", "cotton"],
  },
  {
    id: "toji-tee-001",
    name: "Toji Tee",
    price: "₹699",
    originalPrice: "₹999",
    type: "image",
    video: "",
    thumbnail: "/Productimage/TOJI/front.png",
    description: "Stylish Toji Fushiguro T-shirt featuring premium fabric and high-definition anime print.",
    category: "Jujutsu Kaisen",
    rating: 4.8,
    reviews: 167,
    inStock: true,
    isSale: true,
    tags: ["anime", "jujutsu kaisen", "toji", "cotton"],
  },
];

const categories = ["All", "Naruto", "One Piece", "Dragon Ball", "Jujutsu Kaisen"];
const sortOptions = [
  { value: "default", label: "Default" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "name", label: "Name A-Z" },
];

export const All_product = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(() => searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get("category") || "All");
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [imageErrors, setImageErrors] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState<string[]>([]);

  // Check if user is logged in and load wishlist
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      loadWishlist();
    }
  }, []);

  const loadWishlist = async () => {
    try {
      const response = await getWishlist();
      setWishlist(response.wishlist || []);
    } catch (error) {
      console.error("Error loading wishlist:", error);
    }
  };

  useEffect(() => {
    const urlCategory = searchParams.get("category");
    const urlSearch = searchParams.get("search");

    let newCategory = selectedCategory;
    let newSearchTerm = searchTerm;

    if (urlCategory !== null) {
      newCategory = urlCategory;
      newSearchTerm = "";
    } else if (urlSearch !== null) {
      newSearchTerm = urlSearch;
      newCategory = "All";
    } else {
      newCategory = "All";
      newSearchTerm = "";
    }

    if (newCategory !== selectedCategory) setSelectedCategory(newCategory);
    if (newSearchTerm !== searchTerm) setSearchTerm(newSearchTerm);
  }, [searchParams, selectedCategory, searchTerm]);

  const handleCategoryButtonClick = (category: string) => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("category", category);
    newUrl.searchParams.delete("search");
    router.push(newUrl.pathname + newUrl.search);

    setSelectedCategory(category);
    setSearchTerm("");
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = () => {
    const newUrl = new URL(window.location.href);
    if (searchTerm.trim() !== "") {
      newUrl.searchParams.set("search", encodeURIComponent(searchTerm.trim()));
      newUrl.searchParams.delete("category");
    } else {
      newUrl.searchParams.delete("search");
      newUrl.searchParams.set("category", "All");
    }
    router.push(newUrl.pathname + newUrl.search);
  };

  const navigateToProduct = (productId: string) => {
    localStorage.setItem("productid", productId);
    router.push(`/product_page/`);
  };

  const handleQuickView = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    navigateToProduct(productId);
  };

  const handleImageClick = (productId: string) => {
    navigateToProduct(productId);
  };

  const handleImageError = (productId: string) => {
    setImageErrors((prev) => [...prev, productId]);
  };

  const getImageSrc = (product: Product) => {
    if (imageErrors.includes(product.id)) {
      return `data:image/svg+xml,${encodeURIComponent(`
        <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="400" fill="#1a1a1a"/>
          <text x="200" y="180" text-anchor="middle" fill="#666" font-family="Arial" font-size="16">${product.name}</text>
          <text x="200" y="220" text-anchor="middle" fill="#999" font-family="Arial" font-size="14">Image Not Available</text>
        </svg>
      `)}`;
    }
    return product.thumbnail || "";
  };

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const price = parseInt(product.price.replace("₹", ""));
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => parseInt(a.price.replace("₹", "")) - parseInt(b.price.replace("₹", "")));
        break;
      case "price-high":
        filtered.sort((a, b) => parseInt(b.price.replace("₹", "")) - parseInt(a.price.replace("₹", "")));
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [searchTerm, selectedCategory, sortBy, priceRange]);

  const handleWishlistToggle = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    
    if (!isLoggedIn) {
      toast.error("Please login to use wishlist");
      return;
    }

    if (wishlistLoading.includes(productId)) {
      return; // Prevent multiple clicks
    }

    setWishlistLoading(prev => [...prev, productId]);

    try {
      console.log("Toggling wishlist for product:", productId);
      const response = await toggleWishlist(productId);
      console.log("Wishlist response:", response);
      
      if (response.message === "Added to wishlist") {
        setWishlist(prev => [...prev, productId]);
        toast.success("Added to wishlist!");
      } else {
        setWishlist(prev => prev.filter(id => id !== productId));
        toast.success("Removed from wishlist!");
      }
    } catch (error: unknown) {
      console.error("Wishlist error:", error);
      
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error updating wishlist. Please try again.");
      }
    } finally {
      setWishlistLoading(prev => prev.filter(id => id !== productId));
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(rating) ? "fill-white text-white" : "text-gray-400"}`} />
    ));
  };

  return (
    <main className="relative bg-gradient-to-bl from-[#000000] to-[#a3a3a3] min-h-screen scroll-smooth text-white">
      <Navbar />

      {/* Header Section */}
      <div className="pt-24 pb-8 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-white">
              PREMIUM ANIME COLLECTION
            </h1>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-2">
              Discover our exclusive range of high-quality anime T-shirts crafted for true fans
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-3 sm:p-6 mb-6 sm:mb-8 shadow-2xl shadow-white/10 hover:shadow-white/20 transition-all duration-500">
            <div className="flex flex-col gap-3 sm:gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearchSubmit();
                  }}
                  className="w-full pl-10 pr-4 py-2 sm:py-3 bg-black/60 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:border-white focus:bg-black/40 focus:shadow-lg focus:shadow-white/20 transition-all text-sm sm:text-base"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryButtonClick(category)}
                    className={`px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all duration-300 font-medium backdrop-blur-md text-xs sm:text-sm ${
                      selectedCategory === category
                        ? "bg-white/90 text-black shadow-lg shadow-white/30"
                        : "bg-black/50 hover:bg-black/30 text-white border border-white/30 hover:border-white/50 hover:shadow-md hover:shadow-white/20"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-black/60 backdrop-blur-md border border-white/30 rounded-xl px-2.5 py-2 sm:px-3 text-white focus:outline-none focus:border-white focus:bg-black/40 focus:shadow-lg focus:shadow-white/20 transition-all text-xs sm:text-sm flex-1 sm:flex-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-black text-white">
                      {option.label}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-2 bg-black/60 hover:bg-black/40 backdrop-blur-md border border-white/30 rounded-xl hover:border-white/50 hover:shadow-md hover:shadow-white/20 transition-all"
                  >
                    <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  <div className="flex bg-black/60 backdrop-blur-md rounded-xl p-1 border border-white/30">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 sm:p-2 rounded-lg transition-all ${
                        viewMode === "grid"
                          ? "bg-white/90 text-black shadow-md shadow-white/30"
                          : "text-white hover:bg-white/20"
                      }`}
                    >
                      <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 sm:p-2 rounded-lg transition-all ${
                        viewMode === "list"
                          ? "bg-white/90 text-black shadow-md shadow-white/30"
                          : "text-white hover:bg-white/20"
                      }`}
                    >
                      <List className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/20">
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-white mb-2 font-semibold text-sm sm:text-base">Price Range</label>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="flex-1 accent-white"
                      />
                      <span className="text-white bg-black/60 backdrop-blur-md px-2.5 py-1 sm:px-3 rounded-lg border border-white/30 shadow-md shadow-white/10 text-xs sm:text-sm">
                        ₹{priceRange[0]} - ₹{priceRange[1]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center mb-4 sm:mb-6 px-1">
            <p className="text-gray-400 text-sm sm:text-base">
              Showing {filteredAndSortedProducts.length} of {products.length} products
            </p>
          </div>

          {/* Products Grid/List */}
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6 lg:gap-8" : "space-y-4 sm:space-y-6"
            }
          >
            {filteredAndSortedProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleImageClick(product.id)}
                className={`group relative bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden hover:border-white/40 hover:bg-black/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-white/30 cursor-pointer ${
                  viewMode === "list" ? "flex gap-4 sm:gap-6 p-4 sm:p-8 max-w-full" : "p-2 sm:p-8 w-full"
                }`}
              >
                {/* Product Image */}
                <div
                  className={`relative overflow-hidden rounded-lg sm:rounded-xl bg-black/40 backdrop-blur-md border border-white/20 ${
                    viewMode === "list"
                      ? "w-24 h-24 sm:w-56 sm:h-56 flex-shrink-0"
                      : "w-full h-32 sm:h-48 lg:h-80 mb-2 sm:mb-4 lg:mb-6"
                  }`}
                >
                  <Image
                    src={getImageSrc(product)}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-contain bg-black transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={() => handleImageError(product.id)}
                    onLoad={() => setImageErrors((prev) => prev.filter((id) => id !== product.id))}
                  />

                  {/* Wishlist */}
                  <button
                    onClick={(e) => handleWishlistToggle(e, product.id)}
                    disabled={wishlistLoading.includes(product.id)}
                    className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 bg-black/70 backdrop-blur-md rounded-full hover:bg-black/50 border border-white/30 hover:border-white/50 hover:shadow-lg hover:shadow-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Heart
                      className={`w-3 h-3 sm:w-4 sm:h-4 ${
                        wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-300 hover:text-white"
                      } ${wishlistLoading.includes(product.id) ? "animate-pulse" : ""}`}
                    />
                  </button>
                </div>

                {/* Product Info */}
                <div className={viewMode === "list" ? "flex-1" : ""}>
                  <div className="mb-1.5 sm:mb-3">
                    <h3 className="text-xs sm:text-lg lg:text-xl font-bold text-white mb-0.5 sm:mb-1 group-hover:text-gray-300 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2 font-medium">{product.category}</p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                      <div className="flex">{renderStars(product.rating)}</div>
                      <span className="text-gray-400 text-xs">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-1 sm:gap-2 mb-1.5 sm:mb-3">
                      <span className="text-sm sm:text-lg lg:text-2xl font-bold text-white">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-gray-500 line-through text-xs sm:text-sm">{product.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  <p
                    className={`text-gray-300 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2 ${
                      viewMode === "grid" ? "hidden sm:block" : ""
                    }`}
                  >
                    {product.description}
                  </p>

                  {/* Only Quick View Button */}
                  <div className="w-full mt-2">
                    <button
                      onClick={(e) => handleQuickView(e, product.id)}
                      className="w-full py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-white/95 backdrop-blur-md text-black hover:bg-white hover:scale-105 shadow-lg shadow-white/30 hover:shadow-xl hover:shadow-white/40 text-sm sm:text-base"
                    >
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      Quick View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};
