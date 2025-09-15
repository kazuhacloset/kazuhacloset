// contexts/WishlistContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getWishlist, toggleWishlist } from '../utils/api/userUtils';
import toast from 'react-hot-toast';

interface WishlistContextType {
  wishlist: string[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlistItem: (productId: string) => Promise<void>;
  loadWishlist: () => Promise<void>;
  wishlistCount: number;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const loadWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      const response = await getWishlist();
      setWishlist(response.wishlist || []);
    } catch (error) {
      console.error("Error loading wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlistItem = async (productId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to use wishlist");
      return;
    }

    try {
      const response = await toggleWishlist(productId);
      
      if (response.message === "Added to wishlist") {
        setWishlist(prev => [...prev, productId]);
        toast.success("Added to wishlist!");
      } else {
        setWishlist(prev => prev.filter(id => id !== productId));
        toast.success("Removed from wishlist!");
      }
    } catch (error: any) {
      console.error("Wishlist error:", error);
      
      // More specific error handling
      if (error.response?.status === 401) {
        toast.error("Please login to use wishlist");
        localStorage.removeItem("token"); // Clear invalid token
      } else if (error.response?.status === 404) {
        toast.error("User not found. Please login again.");
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Error updating wishlist. Please try again.");
      }
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.includes(productId);
  };

  // Load wishlist on mount if user is logged in
  useEffect(() => {
    loadWishlist();
  }, []);

  const value: WishlistContextType = {
    wishlist,
    isInWishlist,
    toggleWishlistItem,
    loadWishlist,
    wishlistCount: wishlist.length,
    loading,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};