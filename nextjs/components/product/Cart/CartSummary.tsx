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
};

export default function CartSummary({ items }: Props) {
  const router = useRouter();

  const total = items.reduce(
    (acc, item) =>
      acc + parseFloat(item.price.replace(/[^0-9.]/g, "")) * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (items.length === 0) return;

    // ✅ Save items to localStorage so OrderSummary can read them
    localStorage.setItem("checkoutItems", JSON.stringify(items));

    // ✅ Redirect to Order Summary page
    router.push("/order-summary");
  };

  return (
    <div className="bg-[#1e1e1e] mt-10 p-6 rounded-xl flex flex-col md:flex-row justify-between items-center shadow-inner">
      <h3 className="text-lg sm:text-2xl font-bold text-white mb-4 md:mb-0">
        Total: <span className="text-yellow-400">₹{total}</span>
      </h3>

      <button
        onClick={handleCheckout}
        className="bg-yellow-400 text-black font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-yellow-500 transition text-xs sm:text-base"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
