// components/All_product.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Grid,
  List,
  Heart,
  Star,
  Eye,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";

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
    price: "₹399",
    originalPrice: "₹499",
    type: "image",
    video: "",
    thumbnail: "/Productimage/NARUTO/back.png",
    description: "High-quality Naruto-themed T-shirt with durable print and premium cotton fabric.",
    category: "Naruto",
    rating: 4.8,
    reviews: 158,
    inStock: true,
    isSale: true,
    tags: ["anime", "naruto", "cotton", "comfortable"],
  },
  {
    id: "giyu-tee-001",
    name: "Giyu Tee",
    price: "₹399",
    originalPrice: "₹499",
    type: "image",
    video: "",
    thumbnail: "/Productimage/GIYU/back.png",
    description: "Stylish Giyu Tomioka T-shirt",
    category: "Demon Slayer",
    rating: 4.9,
    reviews: 108,
    inStock: true,
    tags: ["anime", "Demon Slayer", "Giyu", "T-shirt"],
  },
  {
    id: "zenitsu-tee-001",
    name: "Zenitsu Agatsuma Tee",
    price: "₹399",
    originalPrice: "₹499",
    type: "image",
    video: "",
    thumbnail: "/Productimage/ZENITSU/back.png",
    description: "Stylish Zenitsu Agatsuma T-shirt made with premium cotton fabric and high-quality anime print inspired by Demon Slayer.",
    category: "Demon Slayer",
    rating: 4.8,
    reviews: 142,
    inStock: true,
    isSale: true,
    tags: ["anime", "demon slayer", "zenitsu", "cotton", "unisex"],
  },
  {
    id: "shinobu-tee-001",
    name: "Shinobu Kocho Tee",
    price: "₹399",
    originalPrice: "₹499",
    type: "image",
    video: "",
    thumbnail: "/Productimage/SHINOBU/back.png",
    description: "Elegant Shinobu Kocho T-shirt crafted with premium cotton fabric and detailed high-quality print.",
    category: "Demon Slayer",
    rating: 4.8,
    reviews: 132,
    inStock: true,
    isSale: true,
    tags: ["anime", "demon slayer", "shinobu", "kocho", "cotton"],
  },
  {
    id: "itachi-tee-001",
    name: "Itachi Tee",
    price: "₹399",
    originalPrice: "₹499",
    type: "image",
    video: "",
    thumbnail: "/Productimage/ITACHI/front.png",
    description: "Elegant Itachi Uchiha design tee",
    category: "Naruto",
    rating: 4.7,
    reviews: 111,
    inStock: true,
    tags: ["anime", "Naruto", "Itachi", "Uchiha"],
  },
  {
    id: "rengoku-tee-001",
    name: "Rengoku Tee",
    price: "₹399",
    originalPrice: "₹499",
    type: "image",
    video: "",
    thumbnail: "/Productimage/RENGOKU/back.png",
    description: "Fiery Rengoku Flame Hashira tee",
    category: "Demon Slayer",
    rating: 4.9,
    reviews: 102,
    inStock: true,
    tags: ["anime", "Demon Slayer", "Rengoku", "Flame Hashira"],
  },
  {
    id: "jiraiya-tee-001",
    name: "Jiraiya Tee",
    price: "₹399",
    originalPrice: "₹499",
    type: "image",
    video: "",
    thumbnail: "/Productimage/JIRAYA/front.png",
    description: "Legendary Sannin Jiraiya T-shirt",
    category: "Naruto",
    rating: 4.6,
    reviews: 25,
    inStock: true,
    tags: ["anime", "Naruto", "Jiraiya", "Sannin"],
  },
  {
    id: "goku-tee-001",
    name: "Goku Tee",
    price: "₹399",
    originalPrice: "₹499",
    type: "image",
    video: "",
    thumbnail: "/Productimage/GOKU/back.png",
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
    price: "₹399",
    originalPrice: "₹499",
    type: "image",
    video: "",
    thumbnail: "/Productimage/INFINITY CASTLE/back.png",
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
    price: "₹399",
    originalPrice: "₹499",
    type: "image",
    video: "",
    thumbnail: "/Productimage/TOJI/back.png",
    description: "Stylish Toji Fushiguro T-shirt featuring premium fabric and high-definition anime print.",
    category: "Jujutsu Kaisen",
    rating: 4.8,
    reviews: 167,
    inStock: true,
    isSale: true,
    tags: ["anime", "jujutsu kaisen", "toji", "cotton"],
  },
  {
    id: "baki-tee-001",
    name: "Baki Tee",
    price: "₹399",
    originalPrice: "₹499",
    type: "image",
    video: "",
    thumbnail: "/Productimage/BAKIS/back.png",
    description: "Bold Baki Hanma T-shirt crafted with premium cotton fabric and high-quality anime print.",
    category: "Baki",
    rating: 4.8,
    reviews: 177,
    inStock: true,
    isSale: true,
    tags: ["anime", "baki", "hanma", "cotton"],
  },
  {
    id: "hxh-tee-001",
    name: "Hunter x Hunter Tee",
    price: "₹399",
    originalPrice: "₹499",
    type: "image",
    video: "",
    thumbnail: "/Productimage/HUNTER_X_HUNTER/back.png",
    description: "Premium Hunter x Hunter T-shirt with high-quality fabric and detailed anime print featuring iconic characters.",
    category: "Hunter x Hunter",
    rating: 4.8,
    reviews: 157,
    inStock: true,
    isSale: true,
    tags: ["anime", "hunter x hunter", "gon", "killua", "cotton"],
  },
  {
    id: "hashira-tee-001",
    name: "Hashira Tee",
    price: "₹399",
    originalPrice: "₹499",
    type: "image",
    video: "",
    thumbnail: "/Productimage/HASHIRAS/back.png",
    description: "Hashira T-shirt featuring the elite Demon Slayer corps members. Premium cotton with striking anime print.",
    category: "Demon Slayer",
    rating: 4.8,
    reviews: 167,
    inStock: true,
    isSale: true,
    tags: ["anime", "demon slayer", "hashira", "cotton"],
  },
  {
    id: "sungjinwoo-tee-001",
    name: "Sung Jin-Woo Tee",
    price: "₹399",
    originalPrice: "₹499",
    type: "image",
    video: "",
    thumbnail: "/Productimage/SUNGJIN/back.png",
    description: "Solo Leveling inspired Sung Jin-Woo T-shirt. Premium cotton tee featuring the Shadow Monarch's dark, powerful design.",
    category: "Solo Leveling",
    rating: 4.9,
    reviews: 182,
    inStock: true,
    isSale: true,
    tags: ["anime", "solo leveling", "sung jin woo", "cotton"],
  },
  {
    id: "obito-tee-001",
    name: "Obito Uchiha Tee",
    price: "₹399",
    originalPrice: "₹499",
    type: "image",
    video: "",
    thumbnail: "/Productimage/OBITO/back.png",
    description: "Obito Uchiha inspired T-shirt featuring premium cotton fabric and high-quality Uchiha clan design.",
    category: "Naruto",
    rating: 4.8,
    reviews: 149,
    inStock: true,
    isSale: true,
    tags: ["anime", "naruto", "obito", "uchiha", "cotton"],
  },
  {
    id: "gojo-tee-001",
    name: "Gojo Satoru Tee",
    price: "₹399",
    originalPrice: "₹499",
    type: "image",
    video: "",
    thumbnail: "/Productimage/GOJO/back.png",
    description: "Jujutsu Kaisen themed Gojo Satoru T-shirt with sleek design and durable, soft cotton fabric.",
    category: "Jujutsu Kaisen",
    rating: 4.9,
    reviews: 173,
    inStock: true,
    isSale: true,
    tags: ["anime", "jujutsu kaisen", "gojo", "satoru", "cotton"],
  },
  {
    id: "goku2-tee-001",
    name: "Goku 2 Tee",
    price: "₹399",
    originalPrice: "₹499",
    type: "image",
    video: "",
    thumbnail: "/Productimage/GOKU2/back.png",
    description: "Goku 2.0 edition T-shirt featuring dynamic Dragon Ball Z artwork and ultra-soft cotton feel.",
    category: "Dragon Ball Z",
    rating: 4.9,
    reviews: 165,
    inStock: true,
    isSale: true,
    tags: ["anime", "dragon ball z", "goku", "cotton", "super saiyan"],
  },
  {
    id: "levi-tee-001",
    name: "Levi Tee",
    price: "₹399",
    originalPrice: "₹499",
    type: "image",
    video: "",
    thumbnail: "/Productimage/LEVI/back.png",
    description: "Attack on Titan inspired Levi Ackerman T-shirt. Sharp design, strong fabric, perfect for every AOT fan.",
    category: "Attack on Titan",
    rating: 4.9,
    reviews: 192,
    inStock: true,
    isSale: true,
    tags: ["anime", "attack on titan", "levi", "cotton"],
  },
  {
    id: "itachi2-tee-001",
    name: "Itachi 2 Tee",
    price: "₹399",
    originalPrice: "₹499",
    type: "image",
    video: "",
    thumbnail: "/Productimage/ITACHI2/front.png",
    description: "Itachi Uchiha 2.0 edition T-shirt inspired by Naruto. Minimal design with bold Uchiha clan vibes.",
    category: "Naruto",
    rating: 4.8,
    reviews: 158,
    inStock: true,
    isSale: true,
    tags: ["anime", "naruto", "itachi", "uchiha", "cotton"],
  },
];

// ✅ FIX: categories match exact product.category strings
const categories = [
  "All",
  "Naruto",
  "Demon Slayer",
  "Dragon Ball Z",
  "Jujutsu Kaisen",
  "Attack on Titan",
  "Solo Leveling",
  "Hunter x Hunter",
  "Baki",
];

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

  const handleSearchSubmit = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    const queryString = params.toString();
    const url = queryString ? `?${queryString}` : "";
    router.push(`${window.location.pathname}${url}`, { scroll: false });
  };

  const handleCategoryButtonClick = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (category !== "All") params.set("category", category);
    const queryString = params.toString();
    const url = queryString ? `?${queryString}` : "";
    router.push(`${window.location.pathname}${url}`, { scroll: false });
  };

  const checkLoginAndNavigate = (productId: string) => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    localStorage.setItem("productid", productId);
    router.push(`/product_page/`);
  };

  const handleWishlistToggle = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    if (wishlistLoading.includes(productId)) return;
    setWishlistLoading((prev) => [...prev, productId]);
    try {
      const response = await toggleWishlist(productId);
      if (response.message === "Added to wishlist") {
        setWishlist((prev) => [...prev, productId]);
        toast.success("Added to wishlist!");
      } else {
        setWishlist((prev) => prev.filter((id) => id !== productId));
        toast.success("Removed from wishlist!");
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      toast.error("Error updating wishlist. Please try again.");
    } finally {
      setWishlistLoading((prev) => prev.filter((id) => id !== productId));
    }
  };

  const handleImageError = (productId: string) => {
    setImageErrors((prev) => [...prev, productId]);
  };

  const getImageSrc = (product: Product) => {
    if (imageErrors.includes(product.id)) {
      return `data:image/svg+xml,${encodeURIComponent(`
        <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="400" fill="#111111"/>
          <text x="200" y="180" text-anchor="middle" fill="#3a3a3a" font-family="Arial" font-size="16">${product.name}</text>
          <text x="200" y="220" text-anchor="middle" fill="#2a2a2a" font-family="Arial" font-size="14">Image Not Available</text>
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-[#FF6B00] text-[#FF6B00]" : "text-[#2A2A2A]"}`}
      />
    ));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .kc-page {
          background-color: #050505;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        .kc-bg-layer {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .kc-bg-layer::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 50% at 10% 0%, rgba(255,107,0,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 90% 80%, rgba(225,29,72,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 100% 80% at 50% 50%, rgba(0,0,0,0.9) 0%, transparent 100%);
        }
        .kc-bg-layer::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255,107,0,0.008) 2px,
              rgba(255,107,0,0.008) 4px
            );
        }

        .kc-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
          animation: kc-orb-drift 20s ease-in-out infinite alternate;
        }
        .kc-orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(255,107,0,0.08) 0%, transparent 70%);
          top: -150px; left: -100px;
          animation-duration: 25s;
        }
        .kc-orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(225,29,72,0.06) 0%, transparent 70%);
          bottom: 10%; right: -100px;
          animation-duration: 18s;
          animation-direction: alternate-reverse;
        }
        @keyframes kc-orb-drift {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, 20px) scale(1.1); }
        }

        .kc-content {
          position: relative;
          z-index: 1;
        }

        .font-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.05em; }
        .font-heading { font-family: 'Syne', sans-serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }

        /* Section eyebrow */
        .kc-section-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #FF6B00;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .kc-section-eyebrow::before {
          content: '';
          display: inline-block;
          width: 20px;
          height: 1px;
          background: #FF6B00;
        }

        /* Filter panel */
        .kc-filter-panel {
          background: rgba(17,17,17,0.95);
          border: 1px solid rgba(255,107,0,0.15);
          border-radius: 16px;
          padding: 20px 24px;
          backdrop-filter: blur(20px);
          box-shadow: 0 0 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,107,0,0.08);
        }

        /* Search input */
        .kc-search-input {
          width: 100%;
          background: rgba(10,10,10,0.9);
          border: 1px solid rgba(255,107,0,0.2);
          border-radius: 10px;
          color: #F5F5F5;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          padding: 12px 16px 12px 44px;
          outline: none;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .kc-search-input::placeholder { color: #3a3a3a; }
        .kc-search-input:focus {
          border-color: #FF6B00;
          box-shadow: 0 0 0 1px rgba(255,107,0,0.2), 0 0 20px rgba(255,107,0,0.08);
        }

        /* Category pills */
        .kc-cat-pill {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 7px 16px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: #A1A1AA;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .kc-cat-pill:hover {
          border-color: rgba(255,107,0,0.4);
          color: #FF6B00;
          background: rgba(255,107,0,0.06);
        }
        .kc-cat-pill.active {
          background: rgba(255,107,0,0.12);
          border-color: #FF6B00;
          color: #FF6B00;
          box-shadow: 0 0 12px rgba(255,107,0,0.15);
        }

        /* Select */
        .kc-select {
          background: rgba(10,10,10,0.9);
          border: 1px solid rgba(255,107,0,0.2);
          border-radius: 8px;
          color: #A1A1AA;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          padding: 9px 34px 9px 14px;
          outline: none;
          cursor: pointer;
          transition: border-color 0.25s;
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23FF6B00' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
        }
        .kc-select:focus { border-color: #FF6B00; }
        .kc-select option { background: #111111; color: #F5F5F5; }

        /* Icon button */
        .kc-icon-btn {
          padding: 9px;
          background: rgba(10,10,10,0.9);
          border: 1px solid rgba(255,107,0,0.2);
          border-radius: 8px;
          color: #A1A1AA;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex; align-items: center; justify-content: center;
        }
        .kc-icon-btn:hover {
          border-color: rgba(255,107,0,0.5);
          color: #FF6B00;
          background: rgba(255,107,0,0.06);
        }
        .kc-icon-btn.active {
          background: rgba(255,107,0,0.1);
          border-color: #FF6B00;
          color: #FF6B00;
        }

        /* View toggle */
        .kc-view-toggle {
          display: flex;
          background: rgba(10,10,10,0.9);
          border: 1px solid rgba(255,107,0,0.2);
          border-radius: 8px;
          padding: 3px;
        }
        .kc-view-btn {
          padding: 6px 10px;
          border-radius: 5px;
          border: none;
          background: transparent;
          color: #3a3a3a;
          cursor: pointer;
          transition: all 0.2s;
          display: flex; align-items: center; justify-content: center;
        }
        .kc-view-btn.active {
          background: rgba(255,107,0,0.15);
          color: #FF6B00;
        }

        /* Product Cards */
        .kc-card {
          background: #0e0e0e;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          position: relative;
          transition: transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94), border-color 0.3s, box-shadow 0.4s;
          animation: kc-fade-up 0.5s ease both;
        }
        .kc-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,107,0,0.03) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.4s;
          pointer-events: none;
          z-index: 1;
        }
        .kc-card:hover {
          transform: translateY(-6px) scale(1.01);
          border-color: rgba(255,107,0,0.25);
          box-shadow:
            0 20px 60px rgba(0,0,0,0.7),
            0 0 30px rgba(255,107,0,0.08),
            inset 0 1px 0 rgba(255,107,0,0.1);
        }
        .kc-card:hover::before { opacity: 1; }

        /* Card image wrapper */
        .kc-img-wrap {
          position: relative;
          background: #0a0a0a;
          overflow: hidden;
        }
        .kc-img-wrap::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 60px;
          background: linear-gradient(to top, #0e0e0e, transparent);
          pointer-events: none;
          z-index: 2;
        }
        .kc-card-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94);
          display: block;
        }
        .kc-card:hover .kc-card-img { transform: scale(1.07); }

        /* Wishlist btn */
        .kc-wish-btn {
          position: absolute;
          top: 10px; right: 10px;
          z-index: 10;
          width: 34px; height: 34px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(5,5,5,0.85);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .kc-wish-btn:hover {
          border-color: rgba(225,29,72,0.5);
          background: rgba(225,29,72,0.1);
          transform: scale(1.1);
          box-shadow: 0 0 14px rgba(225,29,72,0.2);
        }
        .kc-wish-btn.wishlisted {
          border-color: rgba(225,29,72,0.6);
          background: rgba(225,29,72,0.12);
        }
        .kc-wish-btn.loading { opacity: 0.5; }

        /* Badges */
        .kc-badge {
          position: absolute;
          top: 10px; left: 10px;
          z-index: 10;
          font-family: 'Syne', sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 8px;
          border-radius: 4px;
        }
        .kc-badge-sale {
          background: rgba(225,29,72,0.2);
          border: 1px solid rgba(225,29,72,0.4);
          color: #E11D48;
        }
        .kc-badge-new {
          background: rgba(255,107,0,0.15);
          border: 1px solid rgba(255,107,0,0.35);
          color: #FF6B00;
        }

        /* Card body */
        .kc-card-body { padding: 14px 16px 16px; }

        .kc-product-name {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 15px;
          color: #F5F5F5;
          line-height: 1.2;
          margin-bottom: 3px;
          transition: color 0.2s;
        }
        .kc-card:hover .kc-product-name { color: #ffffff; }

        .kc-category-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #FF6B00;
          opacity: 0.7;
          margin-bottom: 8px;
        }

        .kc-stars { display: flex; gap: 2px; }

        .kc-rating-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 10px;
        }
        .kc-rating-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          color: #3a3a3a;
        }

        /* Price */
        .kc-price-row { display: flex; align-items: baseline; gap: 8px; margin-bottom: 12px; }
        .kc-price {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 22px;
          color: #F5F5F5;
          letter-spacing: 0.02em;
        }
        .kc-price-orig {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #2A2A2A;
          text-decoration: line-through;
        }
        .kc-discount-pct {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          color: #E11D48;
          font-weight: 500;
        }

        /* Quick view button */
        .kc-quick-btn {
          width: 100%;
          padding: 11px 0;
          border-radius: 8px;
          border: 1px solid rgba(255,107,0,0.3);
          background: rgba(255,107,0,0.06);
          color: #FF6B00;
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.3s ease;
        }
        .kc-quick-btn:hover {
          background: rgba(255,107,0,0.14);
          border-color: rgba(255,107,0,0.6);
          color: #FF8533;
          box-shadow: 0 0 20px rgba(255,107,0,0.12);
          transform: translateY(-1px);
        }

        /* Divider */
        .kc-divider {
          height: 1px;
          background: rgba(255,255,255,0.04);
          margin: 10px 0 12px;
        }

        /* List card */
        .kc-card-list {
          display: flex;
          gap: 20px;
          align-items: stretch;
          padding: 20px;
        }
        .kc-card-list .kc-img-wrap {
          width: 140px;
          min-width: 140px;
          height: 140px;
          border-radius: 10px;
        }
        .kc-card-list .kc-img-wrap::after { display: none; }

        .kc-product-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #3a3a3a;
          line-height: 1.5;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Results */
        .kc-results-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding: 0 2px;
        }
        .kc-results-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #3a3a3a;
          letter-spacing: 0.03em;
        }
        .kc-results-count {
          color: #FF6B00;
          font-weight: 600;
        }

        /* Price range slider */
        .kc-range {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 2px;
          background: linear-gradient(to right, #FF6B00 var(--val, 100%), rgba(255,255,255,0.08) var(--val, 100%));
          outline: none;
          border-radius: 2px;
        }
        .kc-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: #FF6B00;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(255,107,0,0.4);
        }

        /* Advanced filter */
        .kc-adv-filters {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(255,107,0,0.1);
        }

        /* Fade up animation */
        @keyframes kc-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── Responsive grid ── */
        @media (max-width: 639px) {
          .kc-products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .kc-product-name { font-size: 12px; }
          .kc-price { font-size: 15px; }
          .kc-price-orig { font-size: 11px; }
          .kc-discount-pct { font-size: 10px; }
          .kc-card-body { padding: 8px 10px 10px; }
          .kc-quick-btn { font-size: 10px; padding: 8px 0; gap: 4px; letter-spacing: 0.04em; }
          .kc-wish-btn { width: 28px; height: 28px; top: 6px; right: 6px; }
          .kc-badge { font-size: 8px; padding: 3px 6px; }
          .kc-category-label { font-size: 9px; margin-bottom: 4px; }
          .kc-rating-row { margin-bottom: 6px; }
          .kc-rating-text { font-size: 9px; }
          .kc-price-row { margin-bottom: 8px; gap: 5px; }
          .kc-divider { margin: 6px 0 8px; }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .kc-products-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (min-width: 1024px) {
          .kc-products-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
      `}</style>

      <main className="kc-page">
        {/* Background layers */}
        <div className="kc-bg-layer" />
        <div className="kc-orb kc-orb-1" />
        <div className="kc-orb kc-orb-2" />

        <Navbar />

        <div className="kc-content pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

            {/* ── PREMIUM HEADER (from doc 2) ── */}
            <div style={{ marginBottom: "40px" }}>
              <div className="kc-section-eyebrow">Kazuha Closet · SS25 Drop</div>
              <h1
                className="font-display"
                style={{
                  fontSize: "clamp(2.4rem, 6vw, 5rem)",
                  color: "#F5F5F5",
                  lineHeight: 1,
                  marginBottom: "14px",
                  letterSpacing: "0.04em",
                }}
              >
                THE COLLECTION
              </h1>
              <p
                className="font-body"
                style={{
                  color: "#3a3a3a",
                  fontSize: "clamp(13px, 1.4vw, 15px)",
                  maxWidth: "500px",
                  lineHeight: 1.6,
                }}
              >
                Premium anime streetwear, crafted for those who live the culture.
                Every piece, a statement.
              </p>
            </div>

            {/* ── Filter Panel ── */}
            <div className="kc-filter-panel" style={{ marginBottom: "28px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

                {/* Search */}
                <div style={{ position: "relative" }}>
                  <Search
                    style={{
                      position: "absolute", left: "14px", top: "50%",
                      transform: "translateY(-50%)",
                      color: "#3a3a3a", width: "16px", height: "16px",
                    }}
                  />
                  <input
                    type="text"
                    className="kc-search-input"
                    placeholder="Search the collection..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSearchSubmit(); }}
                  />
                </div>

                {/* Category pills */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`kc-cat-pill ${selectedCategory === category ? "active" : ""}`}
                      onClick={() => handleCategoryButtonClick(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Controls row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                  <select
                    className="kc-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button
                      className={`kc-icon-btn ${showFilters ? "active" : ""}`}
                      onClick={() => setShowFilters(!showFilters)}
                      title="Advanced filters"
                    >
                      <SlidersHorizontal size={16} />
                    </button>
                    <div className="kc-view-toggle">
                      <button
                        className={`kc-view-btn ${viewMode === "grid" ? "active" : ""}`}
                        onClick={() => setViewMode("grid")}
                        title="Grid view"
                      >
                        <Grid size={15} />
                      </button>
                      <button
                        className={`kc-view-btn ${viewMode === "list" ? "active" : ""}`}
                        onClick={() => setViewMode("list")}
                        title="List view"
                      >
                        <List size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced filters */}
              {showFilters && (
                <div className="kc-adv-filters">
                  <label
                    className="font-body"
                    style={{ display: "block", color: "#A1A1AA", fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}
                  >
                    Price Range
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[1]}
                      className="kc-range"
                      style={{ "--val": `${(priceRange[1] / 1000) * 100}%` } as React.CSSProperties}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    />
                    <span
                      className="font-body"
                      style={{
                        background: "rgba(255,107,0,0.08)",
                        border: "1px solid rgba(255,107,0,0.2)",
                        borderRadius: "6px",
                        padding: "5px 10px",
                        color: "#FF6B00",
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                        minWidth: "110px",
                        textAlign: "center",
                      }}
                    >
                      ₹{priceRange[0]} – ₹{priceRange[1]}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* ── Results bar ── */}
            <div className="kc-results-bar">
              <p className="kc-results-text font-body">
                <span className="kc-results-count">{filteredAndSortedProducts.length}</span>
                {" "}of {products.length} pieces
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "24px", height: "1px", background: "rgba(255,107,0,0.3)" }} />
                <span className="font-body" style={{ fontSize: "11px", letterSpacing: "0.1em", color: "#2A2A2A", textTransform: "uppercase" }}>
                  {selectedCategory === "All" ? "All Drops" : selectedCategory}
                </span>
              </div>
            </div>

            {/* ── Products Grid / List ── */}
            <div
              className={viewMode === "grid" ? "kc-products-grid" : ""}
              style={
                viewMode === "grid"
                  ? { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }
                  : { display: "flex", flexDirection: "column", gap: "16px" }
              }
            >
              {filteredAndSortedProducts.map((product, idx) => {
                const discountPct = product.originalPrice
                  ? Math.round((1 - parseInt(product.price.replace("₹", "")) / parseInt(product.originalPrice.replace("₹", ""))) * 100)
                  : null;

                if (viewMode === "list") {
                  return (
                    <div
                      key={product.id}
                      className="kc-card"
                      style={{ animationDelay: `${idx * 0.04}s` }}
                      onClick={() => checkLoginAndNavigate(product.id)}
                    >
                      <div className="kc-card-list">
                        {/* Image */}
                        <div style={{ width: 140, minWidth: 140, height: 140, borderRadius: 10, position: "relative", background: "#0a0a0a", overflow: "hidden" }}>
                          <Image
                            src={getImageSrc(product)}
                            alt={product.name}
                            width={280}
                            height={280}
                            className="kc-card-img"
                            style={{ objectFit: "contain" }}
                            loading="lazy"
                            onError={() => handleImageError(product.id)}
                          />
                          {product.isSale && <span className="kc-badge kc-badge-sale">Sale</span>}
                          {product.isNew && (
                            <span className="kc-badge kc-badge-new" style={{ top: product.isSale ? 34 : 10 }}>New</span>
                          )}
                        </div>

                        {/* Body */}
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                          <div>
                            <p className="kc-category-label font-body">{product.category}</p>
                            <h3 className="kc-product-name">{product.name}</h3>
                            <div className="kc-rating-row">
                              <div className="kc-stars">{renderStars(product.rating)}</div>
                              <span className="kc-rating-text">{product.rating} ({product.reviews})</span>
                            </div>
                            <p className="kc-product-desc">{product.description}</p>
                          </div>
                          <div>
                            <div className="kc-price-row">
                              <span className="kc-price">{product.price}</span>
                              {product.originalPrice && <span className="kc-price-orig">{product.originalPrice}</span>}
                              {discountPct && <span className="kc-discount-pct">−{discountPct}%</span>}
                            </div>
                            <button
                              className="kc-quick-btn"
                              style={{ maxWidth: 180 }}
                              onClick={(e) => { e.stopPropagation(); checkLoginAndNavigate(product.id); }}
                            >
                              <Eye size={13} />
                              Quick View
                              <ChevronRight size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Wishlist */}
                        <button
                          className={`kc-wish-btn ${wishlist.includes(product.id) ? "wishlisted" : ""} ${wishlistLoading.includes(product.id) ? "loading" : ""}`}
                          style={{ position: "relative", top: "unset", right: "unset", alignSelf: "flex-start", flexShrink: 0 }}
                          onClick={(e) => handleWishlistToggle(e, product.id)}
                          disabled={wishlistLoading.includes(product.id)}
                        >
                          <Heart
                            size={14}
                            style={{
                              fill: wishlist.includes(product.id) ? "#E11D48" : "none",
                              color: wishlist.includes(product.id) ? "#E11D48" : "#3a3a3a",
                              transition: "all 0.3s",
                            }}
                          />
                        </button>
                      </div>
                    </div>
                  );
                }

                // Grid card
                return (
                  <div
                    key={product.id}
                    className="kc-card"
                    style={{ animationDelay: `${idx * 0.04}s` }}
                    onClick={() => checkLoginAndNavigate(product.id)}
                  >
                    {/* Image Area */}
                    <div className="kc-img-wrap" style={{ height: "clamp(140px, 45vw, 320px)", position: "relative" }}>
                      <Image
                        src={getImageSrc(product)}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="kc-card-img"
                        loading="lazy"
                        onError={() => handleImageError(product.id)}
                      />

                      {/* Badges */}
                      {product.isSale && <span className="kc-badge kc-badge-sale">Sale</span>}
                      {product.isNew && (
                        <span className="kc-badge kc-badge-new" style={{ top: product.isSale ? 34 : 10 }}>New</span>
                      )}

                      {/* Wishlist */}
                      <button
                        className={`kc-wish-btn ${wishlist.includes(product.id) ? "wishlisted" : ""} ${wishlistLoading.includes(product.id) ? "loading" : ""}`}
                        onClick={(e) => handleWishlistToggle(e, product.id)}
                        disabled={wishlistLoading.includes(product.id)}
                      >
                        <Heart
                          size={13}
                          style={{
                            fill: wishlist.includes(product.id) ? "#E11D48" : "none",
                            color: wishlist.includes(product.id) ? "#E11D48" : "#3a3a3a",
                            transition: "all 0.3s",
                          }}
                        />
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="kc-card-body">
                      <p className="kc-category-label font-body">{product.category}</p>
                      <h3 className="kc-product-name">{product.name}</h3>

                      <div className="kc-rating-row">
                        <div className="kc-stars">{renderStars(product.rating)}</div>
                        <span className="kc-rating-text">{product.rating} ({product.reviews})</span>
                      </div>

                      <div className="kc-divider" />

                      <div className="kc-price-row">
                        <span className="kc-price">{product.price}</span>
                        {product.originalPrice && <span className="kc-price-orig">{product.originalPrice}</span>}
                        {discountPct && <span className="kc-discount-pct">−{discountPct}%</span>}
                      </div>

                      <button
                        className="kc-quick-btn"
                        onClick={(e) => { e.stopPropagation(); checkLoginAndNavigate(product.id); }}
                      >
                        <Eye size={13} />
                        Quick View
                        <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty state */}
            {filteredAndSortedProducts.length === 0 && (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <p className="font-display" style={{ fontSize: "3rem", color: "#1a1a1a", marginBottom: "12px" }}>
                  NO RESULTS
                </p>
                <p className="font-body" style={{ color: "#2A2A2A", fontSize: "14px" }}>
                  Try a different search or category
                </p>
              </div>
            )}

          </div>
        </div>
      </main>
    </>
  );
};