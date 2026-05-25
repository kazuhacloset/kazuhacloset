"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/common/navbar/Navbar";

import {
  getUserCart,
  getProductDetails,
  removeFromCart,
} from "@/utils/api/productUtils";

import CartItem from "./CartItem";
import CartEmpty from "./CartEmpty";
import CartSummary from "./CartSummary";

type Product = {
  id: string;
  name: string;
  price: string;
  description: string;
  images: { url: string; alt: string }[];
};

type CartItemData = {
  product_id: string;
  size: string;
  quantity: number;
};

type CartProduct = Product &
  CartItemData & {
    cartKey: string;
  };

type BundleData = {
  subtotal: number;
  discount: number;
  total: number;
  bundleMessage: string;
};

export default function CartPage() {
  const [cartProducts, setCartProducts] = useState<
    CartProduct[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [bundleData, setBundleData] =
    useState<BundleData>({
      subtotal: 0,
      discount: 0,
      total: 0,
      bundleMessage: "",
    });

  useEffect(() => {
    const fetchCartData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const cartData = await getUserCart();

        const cart = cartData.cart || {};

        const cartItems = await Promise.allSettled(
          Object.entries(cart).map(
            async ([cartKey, cartItem]) => {
              const item = cartItem as CartItemData;

              const product =
                await getProductDetails(
                  item.product_id
                );

              return {
                ...product,
                ...item,
                cartKey,
              } as CartProduct;
            }
          )
        );

        const products = cartItems
          .filter(
            (res) => res.status === "fulfilled"
          )
          .map(
            (res) =>
              (
                res as PromiseFulfilledResult<CartProduct>
              ).value
          );

        setCartProducts(products);

        // ---------------- OFFER LOGIC ----------------

        const cleanPrice = (price: string) =>
          parseFloat(
            price.replace(/[^0-9.]/g, "")
          ) || 0;

        const totalQuantity = products.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        const subtotal = products.reduce(
          (sum, item) =>
            sum +
            cleanPrice(item.price) *
              item.quantity,
          0
        );

        let discount = 0;

        let total = subtotal;

        let bundleMessage = "";

        if (totalQuantity >= 3) {
          let freeCount = 0;

          if (
            totalQuantity >= 3 &&
            totalQuantity <= 5
          )
            freeCount = 1;
          else if (
            totalQuantity >= 6 &&
            totalQuantity <= 8
          )
            freeCount = 2;
          else if (
            totalQuantity >= 9 &&
            totalQuantity <= 11
          )
            freeCount = 3;
          else if (
            totalQuantity >= 12 &&
            totalQuantity <= 14
          )
            freeCount = 4;
          else if (totalQuantity >= 15)
            freeCount = Math.floor(
              totalQuantity / 3
            );

          const allPrices: number[] = [];

          products.forEach((item) => {
            const price = cleanPrice(
              item.price
            );

            for (
              let i = 0;
              i < item.quantity;
              i++
            ) {
              allPrices.push(price);
            }
          });

          allPrices.sort((a, b) => a - b);

          const freeItems = allPrices.slice(
            0,
            freeCount
          );

          discount = freeItems.reduce(
            (sum, val) => sum + val,
            0
          );

          total = subtotal - discount;

          bundleMessage = `🎉 Offer Applied: Buy ${totalQuantity} Get ${freeCount} Free — Total ₹${subtotal.toFixed(
            2
          )} - ₹${discount.toFixed(
            2
          )} = ₹${total.toFixed(
            2
          )} to Pay`;
        }

        setBundleData({
          subtotal,
          discount,
          total,
          bundleMessage,
        });
      } catch (error) {
        console.error(
          "Failed to fetch cart products:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  const handleRemoveItem = async (
    cartKey: string
  ) => {
    setCartProducts((prev) =>
      prev.filter(
        (item) => item.cartKey !== cartKey
      )
    );

    try {
      await removeFromCart(cartKey);
    } catch (error) {
      console.error(
        "Failed to remove item from backend cart:",
        error
      );
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">

      <Navbar />

      {/* CINEMATIC BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        {/* ORANGE GLOW */}
        <div className="absolute top-[-140px] left-[-100px] w-[380px] h-[380px] rounded-full bg-[#FF6B00]/20 blur-[140px]" />

        {/* CRIMSON GLOW */}
        <div className="absolute bottom-[-140px] right-[-120px] w-[420px] h-[420px] rounded-full bg-[#E11D48]/20 blur-[150px]" />

        {/* CENTER LIGHT */}
        <div className="absolute top-[20%] left-[40%] w-[300px] h-[300px] rounded-full bg-white/[0.03] blur-[120px]" />

        {/* GRID */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:50px_50px]" />

        {/* FLOATING PARTICLES */}
        <div className="absolute top-[20%] left-[10%] w-1 h-1 bg-[#FF6B00]/50 rounded-full animate-pulse" />
        <div className="absolute top-[65%] left-[80%] w-1 h-1 bg-[#E11D48]/50 rounded-full animate-pulse" />
        <div className="absolute top-[35%] left-[55%] w-1 h-1 bg-white/20 rounded-full animate-pulse" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-16">

        {/* HEADER */}
        {!loading && cartProducts.length > 0 && (
          <div className="text-center mb-14">

            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#FF6B00]/20 bg-[#111111]/70 backdrop-blur-xl mb-6">
              <div className="w-2 h-2 rounded-full bg-[#FF6B00]" />

              <span className="text-[10px] uppercase tracking-[0.3em] text-[#A1A1AA]">
                Luxury Checkout
              </span>
            </div>

            <p className="mt-5 text-[#A1A1AA] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Curate your ultimate anime
              streetwear collection.
            </p>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="flex flex-col items-center justify-center pt-28">

            <div className="w-14 h-14 rounded-full border-2 border-[#FF6B00]/20 border-t-[#FF6B00] animate-spin mb-6" />

            <h2 className="text-2xl font-bold mb-2">
              Loading Cart
            </h2>

            <p className="text-[#A1A1AA]">
              Preparing your cinematic
              shopping experience...
            </p>
          </div>
        ) : cartProducts.length === 0 ? (
          <CartEmpty />
        ) : (
          <>
            {/* CART ITEMS */}
            <div className="space-y-8">
              {cartProducts.map((item) => (
                <CartItem
                  key={item.cartKey}
                  item={item}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>

            {/* OFFER MESSAGE */}
            {bundleData.bundleMessage && (
              <div className="relative mt-10 overflow-hidden rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.06] backdrop-blur-2xl shadow-[0_0_40px_rgba(16,185,129,0.08)] p-6">

                {/* GLOW */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_60%)]" />

                <div className="relative z-10 flex flex-col items-center text-center">

                  <div className="mb-3 px-4 py-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 text-[10px] uppercase tracking-[0.3em] text-emerald-300">
                    Reward Unlocked
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-emerald-300 mb-3">
                    Bundle Offer Applied
                  </h3>

                  <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed">
                    {bundleData.bundleMessage}
                  </p>
                </div>
              </div>
            )}

            {/* SUMMARY */}
            <CartSummary
              items={cartProducts}
              totalAmount={bundleData.total}
              discount={bundleData.discount}
            />
          </>
        )}
      </div>
    </main>
  );
}