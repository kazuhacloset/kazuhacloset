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

        // ---------------- Bundle Pricing Logic ----------------
        const cleanPrice = (price: string) =>
          parseFloat(price.replace(/[^0-9.]/g, "")) || 0;

        const totalQuantity = products.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = products.reduce(
          (sum, item) => sum + cleanPrice(item.price) * item.quantity,
          0
        );

        let discount = 0;
        let total = 0;
        let bundleMessage = "";

        if (totalQuantity === 2) {
          total = 699;
          bundleMessage = "🎉 Bundle Offer Applied: ₹699 for 2 Tees!";
        } else if (totalQuantity === 3) {
          total = 999;
          bundleMessage = "🎉 Bundle Offer Applied: ₹999 for 3 Tees!";
        } else {
          discount = subtotal > 500 ? 50 : 0;
          total = subtotal - discount;
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
    // Optimistic update
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

            {/* ✅ Bundle message */}
            {bundleData.bundleMessage && (
              <p className="text-center text-green-400 mt-6 font-medium animate-pulse">
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
