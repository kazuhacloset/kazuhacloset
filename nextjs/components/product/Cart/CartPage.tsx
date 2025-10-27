"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/common/navbar/Navbar";
import { getUserCart, getProductDetails, removeFromCart } from "@/utils/api/productUtils";

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

type CartProduct = Product & CartItemData & { cartKey: string };

type BundleData = {
  subtotal: number;
  discount: number;
  total: number;
  bundleMessage: string;
};

export default function CartPage() {
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [bundleData, setBundleData] = useState<BundleData>({
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
          Object.entries(cart).map(async ([cartKey, cartItem]) => {
            const item = cartItem as CartItemData;
            const product = await getProductDetails(item.product_id);
            return { ...product, ...item, cartKey } as CartProduct;
          })
        );

        const products = cartItems
          .filter((res) => res.status === "fulfilled")
          .map((res) => (res as PromiseFulfilledResult<CartProduct>).value);

        setCartProducts(products);

        // ---------------- Offer Logic: Tiered Buy X Get Y Free ----------------
        const cleanPrice = (price: string) =>
          parseFloat(price.replace(/[^0-9.]/g, "")) || 0;

        const totalQuantity = products.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        const subtotal = products.reduce(
          (sum, item) => sum + cleanPrice(item.price) * item.quantity,
          0
        );

        let discount = 0;
        let total = subtotal;
        let bundleMessage = "";

        if (totalQuantity >= 3) {
          // Determine free tees count
          let freeCount = 0;
          if (totalQuantity >= 3 && totalQuantity <= 5) freeCount = 1;
          else if (totalQuantity >= 6 && totalQuantity <= 8) freeCount = 2;
          else if (totalQuantity >= 9 && totalQuantity <= 11) freeCount = 3;
          else if (totalQuantity >= 12 && totalQuantity <= 14) freeCount = 4;
          else if (totalQuantity >= 15) freeCount = Math.floor(totalQuantity / 3);

          // Create a full list of all tee prices (each quantity counted)
          const allPrices: number[] = [];
          products.forEach((item) => {
            const price = cleanPrice(item.price);
            for (let i = 0; i < item.quantity; i++) {
              allPrices.push(price);
            }
          });

          // Sort to find cheapest free tees
          allPrices.sort((a, b) => a - b);
          const freeItems = allPrices.slice(0, freeCount);
          discount = freeItems.reduce((sum, val) => sum + val, 0);
          total = subtotal - discount;

          bundleMessage = `🎉 Offer Applied: Buy ${totalQuantity} Get ${freeCount} Free — Total ₹${subtotal.toFixed(
            2
          )} - ₹${discount.toFixed(2)} = ₹${total.toFixed(2)} to Pay`;
        }

        setBundleData({ subtotal, discount, total, bundleMessage });
      } catch (error) {
        console.error("Failed to fetch cart products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  const handleRemoveItem = async (cartKey: string) => {
    setCartProducts((prev) => prev.filter((item) => item.cartKey !== cartKey));
    try {
      await removeFromCart(cartKey);
    } catch (error) {
      console.error("Failed to remove item from backend cart:", error);
    }
  };

  return (
    <main className="bg-black text-white min-h-screen px-4 py-6">
      <Navbar />
      <div className="max-w-5xl mx-auto w-full pt-16">
        {loading ? (
          <p className="text-center mt-20 text-gray-400">Loading your cart...</p>
        ) : cartProducts.length === 0 ? (
          <CartEmpty />
        ) : (
          <>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-10 text-center">
              Your Cart
            </h1>

            <div className="space-y-6">
              {cartProducts.map((item) => (
                <CartItem
                  key={item.cartKey}
                  item={item}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>

            {/* ✅ Offer message */}
            {bundleData.bundleMessage && (
              <p className="text-center text-green-400 mt-6 font-semibold animate-pulse text-lg sm:text-xl">
                {bundleData.bundleMessage}
              </p>
            )}

            {/* ✅ Pass total and bundleData to CartSummary */}
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
