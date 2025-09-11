"use client";
import { ShoppingCart, CreditCard } from "lucide-react";

type Props = {
  handleAddToCart: () => void;
  handleBuyNow: () => void;
};

export default function ActionButtons({ handleAddToCart, handleBuyNow }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <button
        onClick={handleAddToCart}
        className="w-full sm:w-1/2 bg-white text-black font-bold py-2 sm:py-3 rounded-xl hover:scale-105 transition-all shadow-md text-xs sm:text-sm"
      >
        <ShoppingCart className="w-4 h-4 inline mr-2" />
        Add to Cart
      </button>
      <button
        onClick={handleBuyNow}
        className="w-full sm:w-1/2 bg-purple-600 text-white font-bold py-2 sm:py-3 rounded-xl hover:scale-105 transition-all shadow-md text-xs sm:text-sm"
      >
        <CreditCard className="w-4 h-4 inline mr-2" />
        Buy Now
      </button>
    </div>
  );
}
