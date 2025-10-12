"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface CartProduct {
  id: string;
  name: string;
  price: string;
  quantity: number;
  size: string;
  cartKey: string;
}

type Props = {
  items: CartProduct[];
  totalAmount: number;
  discount: number;
};

export default function CartSummary({ items, totalAmount, discount }: Props) {
  const router = useRouter();

  const handleCheckout = () => {
    if (items.length === 0) return;

    // ✅ Save checkout details for OrderSummary page
    localStorage.setItem("checkoutItems", JSON.stringify(items));
    localStorage.setItem(
      "checkoutSummary",
      JSON.stringify({ totalAmount, discount })
    );

    // ✅ Redirect to order summary
    router.push("/order-summary");
  };

  return (
    <div className="bg-[#1e1e1e] mt-10 p-6 rounded-xl flex flex-col md:flex-row justify-between items-center shadow-inner">
      <div className="text-center md:text-left mb-4 md:mb-0">
        <h3 className="text-lg sm:text-2xl font-bold text-white">
          Discount:{" "}
          <span className="text-green-400">₹{discount.toFixed(2)}</span>
        </h3>
        <h3 className="text-lg sm:text-2xl font-bold text-white mt-1">
          Total:{" "}
          <span className="text-yellow-400">₹{totalAmount.toFixed(2)}</span>
        </h3>
      </div>

      <button
        onClick={handleCheckout}
        disabled={items.length === 0}
        className="bg-yellow-400 text-black font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl 
                   hover:bg-yellow-500 active:scale-95 transition text-xs sm:text-base
                   disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        {items.length === 0 ? "Cart is Empty" : "Proceed to Checkout"}
      </button>
    </div>
  );
}
