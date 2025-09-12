"use client";

import Image from "next/image";

export default function CartEmpty() {
  return (
    <div className="flex flex-col items-center text-center mt-32">
      <Image
        src="/videos/emptycart.gif"
        alt="Empty Cart"
        width={160}
        height={160}
        className="rounded-xl shadow-xl w-40 h-40 object-contain"
      />
      <h1 className="text-2xl font-bold mt-6">Your Cart is Feeling Lonely</h1>
      <p className="text-gray-400 text-base mt-2 max-w-sm">
        Looks like you haven&apos;t added anything yet. Start shopping and let the magic begin!
      </p>
    </div>
  );
}
