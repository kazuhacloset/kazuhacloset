"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/common/navbar/Navbar";
import { useRouter } from "next/navigation";
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

export default function CartPage() {
  const router = useRouter();
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setLoading(false);

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

        setCartProducts(
          cartItems
            .filter((res) => res.status === "fulfilled")
            .map((res) => (res as PromiseFulfilledResult<CartProduct>).value)
        );
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
      <div className="max-w-5xl mx-auto w-full">
        {loading ? (
          <p className="text-center mt-20 text-gray-400">Loading your cart...</p>
        ) : cartProducts.length === 0 ? (
          <CartEmpty />
        ) : (
          <>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-10 text-center">
              YOUR CART
            </h1>

            {cartProducts.map((item) => (
              <CartItem key={item.cartKey} item={item} onRemove={handleRemoveItem} />
            ))}

            <CartSummary 
                items={cartProducts} 
                onCheckout={() => router.push("/order-summary")} 
              />
          </>
        )}
      </div>
    </main>
  );
}
