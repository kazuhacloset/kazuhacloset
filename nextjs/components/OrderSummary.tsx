"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/Landingpage/Navbar";
import Image from "next/image";
import { createOrder } from "../utils/api/userUtils"; // ✅ API function
// ❌ REMOVE this: import type { RazorpayOptions, RazorpayResponse } from "razorpay";

type Product = {
  id: string;
  name: string;
  price: string;
  originalPrice: string;
  description: string;
  detailedDescription: string;
  category: string;
  rating: number;
  tags: string[];
  sizes: string[];
  features: string[];
  specifications: { [key: string]: string };
  images: { url: string; alt: string }[];
};

type OrderItem = Product & {
  quantity: number;
  size: string;
};

export default function OrderSummary() {
  const [products, setProducts] = useState<OrderItem[]>([]);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const items = localStorage.getItem("checkoutItems");
        if (items) {
          const parsed = JSON.parse(items);
          setProducts(parsed);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error loading checkout items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const cleanPrice = (price: string) =>
    parseFloat(price.replace(/[^0-9.]/g, ""));

  const total = products.reduce(
    (sum, item) => sum + cleanPrice(item.price) * item.quantity,
    0
  );

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  // ✅ Load Razorpay script dynamically
  const loadRazorpay = () => {
    return new Promise<boolean>((resolve) => {
      if (document.getElementById("razorpay-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleProceedToCheckout = async () => {
    if (!address.trim()) {
      alert("Please enter your delivery address");
      return;
    }

    if (!phone.trim()) {
      alert("Please enter your phone number");
      return;
    }

    if (phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    // ✅ Load Razorpay SDK
    const res = await loadRazorpay();
    if (!res) {
      alert("Failed to load Razorpay SDK.");
      return;
    }

    try {
      // ✅ Create order in backend
      const orderData = await createOrder({
        amount: total,
        cart: { items: products },
        address,
        phone,
      });

      if (!orderData.id) {
        alert("Order creation failed!");
        return;
      }

      // ✅ Use global Razorpay types from types/razorpay.d.ts
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string, // ✅ must be in .env
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Your Store Name",
        description: "Order Payment",
        order_id: orderData.id,
        prefill: {
          name: "Customer",
          email: "customer@example.com",
          contact: phone,
        },
        notes: {
          address: address,
        },
        theme: {
          color: "#FBBF24",
        },
        handler: function (response: RazorpayResponse) {
          console.log("Payment successful:", response);
          alert("Payment Successful!");
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error during payment:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  if (loading) {
    return (
      <main className="bg-black text-white min-h-screen px-4 py-6">
        <Navbar />
      </main>
    );
  }

  return (
    <main className="bg-black text-white min-h-screen px-4 py-6">
      <Navbar />

      <div className="max-w-5xl mx-auto w-full pt-16">
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
            Order Summary
          </h1>
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mx-auto rounded-full"></div>
        </div>

        {/* Address and Phone Inputs */}
        <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-300">
              Address
            </label>
            <input
              type="text"
              placeholder="Enter your delivery address"
              className="w-full p-3 sm:p-4 rounded-lg bg-gray-200 text-black placeholder-gray-500 border-0 focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm sm:text-base"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-300">
              Phone No.
            </label>
            <input
              type="tel"
              placeholder="Enter your 10-digit phone number"
              className="w-full p-3 sm:p-4 rounded-lg bg-gray-200 text-black placeholder-gray-500 border-0 focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm sm:text-base"
              value={phone}
              onChange={handlePhoneChange}
              maxLength={10}
            />
            {phone && phone.length < 10 && (
              <p className="text-red-400 text-xs mt-1">
                Phone number must be 10 digits ({phone.length}/10)
              </p>
            )}
          </div>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center text-center mt-16">
            <div className="w-40 h-40">
              <Image
                src="/videos/emptycart.gif"
                alt="Empty Cart"
                width={160}
                height={160}
                className="rounded-xl shadow-xl w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold mt-6">No Items in Order</h1>
            <p className="text-gray-400 text-base mt-2 max-w-sm">
              Looks like there are no items to checkout. Go back to your cart!
            </p>
          </div>
        ) : (
          <>
            {/* Product Cards */}
            {products.map((item) => (
              <div
                key={item.id}
                className="bg-[#1e1e1e] rounded-xl mb-6 p-3 flex flex-row items-start gap-3 shadow-lg"
              >
                {/* Image */}
                <div className="flex-shrink-0 w-28 h-28 sm:w-40 sm:h-40 md:w-52 md:h-52 flex justify-center items-center">
                  <Image
                    src={
                      item.images[0]?.url?.startsWith("/")
                        ? item.images[0].url
                        : `/${item.images[0]?.url}` || "/fallback.jpg"
                    }
                    alt={item.name}
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

                  <p className="hidden sm:block text-gray-400 text-sm italic truncate max-w-[240px]">
                    {item.description || "No description available."}
                  </p>

                  <p className="text-gray-300 text-xs sm:text-sm md:text-base">
                    Price: ₹{cleanPrice(item.price)}
                  </p>
                  <p className="text-gray-300 text-xs sm:text-sm md:text-base">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-gray-300 text-xs sm:text-sm md:text-base">
                    Size: {item.size}
                  </p>
                  <p className="text-white font-semibold text-sm sm:text-base">
                    Subtotal: ₹{cleanPrice(item.price) * item.quantity}
                  </p>
                </div>
              </div>
            ))}

            {/* Total and Proceed to Checkout */}
            <div className="bg-[#1e1e1e] mt-6 sm:mt-10 p-4 sm:p-6 rounded-xl flex flex-col md:flex-row justify-between items-center shadow-inner">
              <h3 className="text-base sm:text-lg md:text-2xl font-bold text-white mb-2 md:mb-0">
                Total: <span className="text-yellow-400">₹{total}</span>
              </h3>
            </div>

            {/* Payment Button */}
            <div className="flex justify-center mt-6 sm:mt-8 mb-6 sm:mb-8">
              <button
                onClick={handleProceedToCheckout}
                disabled={!address.trim() || phone.length !== 10}
                className="bg-yellow-400 text-black font-bold px-6 sm:px-8 md:px-12 py-2.5 sm:py-3 md:py-4 rounded-xl hover:bg-yellow-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition text-sm sm:text-base md:text-lg w-full max-w-xs sm:max-w-none sm:w-auto"
              >
                Payment
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
