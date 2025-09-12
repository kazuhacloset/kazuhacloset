"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  item: {
    id: string;
    name: string;
    price: string;
    size: string;
    quantity: number;
    images: { url: string; alt: string }[];
    cartKey: string;
  };
  onRemove: (cartKey: string) => void;
};

const cleanPrice = (price: string) => parseFloat(price.replace(/[^0-9.]/g, ""));

export default function CartItem({ item, onRemove }: Props) {
  const router = useRouter();

  // ✅ Ensure valid image path
  const getImageSrc = () => {
    if (item.images && item.images[0]?.url) {
      const url = item.images[0].url.trim();
      if (url.startsWith("http")) return url; // full external URL
      return `/${url.replace(/^\/+/, "")}`; // ensure local path starts with /
    }
    return "/placeholder.png"; // fallback
  };

  return (
    <div className="bg-[#1e1e1e] rounded-xl mb-6 p-3 flex flex-row items-start gap-3 shadow-lg">
      {/* Image */}
      <div className="flex-shrink-0 w-28 h-28 sm:w-40 sm:h-40 md:w-52 md:h-52">
        <Image
          src={getImageSrc()}
          alt={item.name || "Product Image"}
          width={208}
          height={208}
          className="rounded-lg object-cover w-full h-full"
        />
      </div>

      {/* Details */}
      <div className="flex-1 space-y-1">
        <h2 className="text-base sm:text-lg md:text-2xl font-semibold">
          {item.name}
        </h2>
        <p className="text-gray-300 text-sm">
          Price: ₹{cleanPrice(item.price)}
        </p>
        <p className="text-gray-300 text-sm">Quantity: {item.quantity}</p>
        <p className="text-gray-300 text-sm">Size: {item.size}</p>
        <p className="text-white font-semibold">
          Subtotal: ₹{cleanPrice(item.price) * item.quantity}
        </p>

        {/* Buttons */}
        <div className="mt-2 flex gap-2 flex-wrap">
          <button
            onClick={() => {
              localStorage.setItem("checkoutItems", JSON.stringify([item]));
              router.push("/order-summary");
            }}
            className="bg-white text-black text-xs sm:text-sm font-semibold px-3 py-1 rounded hover:bg-gray-200"
          >
            Buy Now
          </button>
          <button
            onClick={() => onRemove(item.cartKey)}
            className="bg-red-600 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded hover:bg-red-700"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
