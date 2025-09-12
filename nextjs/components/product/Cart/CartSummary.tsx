"use client";

import React from "react";

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
  onCheckout: () => void;
};

export default function CartSummary({ items, onCheckout }: Props) {
  const total = items.reduce(
    (acc, item) =>
      acc + parseFloat(item.price.replace(/[^0-9.]/g, "")) * item.quantity,
    0
  );

  return (
    <div className="bg-[#1e1e1e] mt-10 p-6 rounded-xl flex flex-col md:flex-row justify-between items-center shadow-inner">
      <h3 className="text-lg sm:text-2xl font-bold text-white mb-4 md:mb-0">
        Total: <span className="text-yellow-400">₹{total}</span>
      </h3>

      <button
        onClick={onCheckout}
        className="bg-yellow-400 text-black font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-yellow-500 transition text-xs sm:text-base"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
