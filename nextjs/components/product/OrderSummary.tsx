"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/common/navbar/Navbar";
import {
  createOrder,
  verifyPayment,
  fetchOrderHistory,
  getUser,
} from "../../utils/api/userUtils";
import toast from "react-hot-toast";

interface User {
  first_name: string;
  last_name: string;
  email: string;
}

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

type Order = {
  razorpay_order_id: string;
  payment_status: string;
  verified_at: string;
  payment_id: string;
  amount: number;
  cart: {
    items: OrderItem[];
  };
};

export default function OrderSummary() {
  const [products, setProducts] = useState<OrderItem[]>([]);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const fetchedUser = await getUser();
        setUser(fetchedUser);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, [token]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const items = localStorage.getItem("checkoutItems");
        if (items) {
          const parsed: OrderItem[] = JSON.parse(items);
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
    loadOrderHistory();
  }, []);

  const loadOrderHistory = async () => {
    setLoadingHistory(true);
    try {
      const data: Order[] = await fetchOrderHistory();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch order history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const cleanPrice = (price: string) =>
    parseFloat(price.replace(/[^0-9.]/g, "")) || 0;

  const totalQuantity = products.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = products.reduce(
    (sum, item) => sum + cleanPrice(item.price) * item.quantity,
    0
  );

  let discount = 0;
  let total = subtotal;
  let bundleMessage = "";

  if (totalQuantity >= 3) {
    let freeCount = 0;

    if (totalQuantity >= 3 && totalQuantity <= 5) freeCount = 1;
    else if (totalQuantity >= 6 && totalQuantity <= 8) freeCount = 2;
    else if (totalQuantity >= 9 && totalQuantity <= 11) freeCount = 3;
    else if (totalQuantity >= 12 && totalQuantity <= 14) freeCount = 4;
    else freeCount = Math.floor(totalQuantity / 3);

    const allPrices: number[] = [];

    products.forEach((item) => {
      const price = cleanPrice(item.price);

      for (let i = 0; i < item.quantity; i++) {
        allPrices.push(price);
      }
    });

    allPrices.sort((a, b) => a - b);

    const freeItems = allPrices.slice(0, freeCount);

    discount = freeItems.reduce((sum, val) => sum + val, 0);

    total = subtotal - discount;

    bundleMessage = `🎉 Offer Applied: Buy ${totalQuantity} Get ${freeCount} Free`;
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) setPhone(value);
  };

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
      toast.error("Please enter your delivery address");
      return;
    }

    if (!phone.trim() || phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    const res = await loadRazorpay();

    if (!res) {
      toast.error("Failed to load Razorpay SDK.");
      return;
    }

    try {
      const orderData = await createOrder({
        amount: total,
        cart: { items: products },
        address,
        phone,
      });

      if (!orderData.id) {
        toast.error("Order creation failed!");
        return;
      }

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Kazuha Closet",
        description: "Order Payment",
        order_id: orderData.id,
        prefill: {
          name: user ? `${user.first_name} ${user.last_name}` : "Guest",
          email: user?.email || "customer@example.com",
          contact: phone,
        },
        notes: { address },

        theme: {
          color: "#FF6B00",
        },

        handler: async function (response: RazorpayResponse) {
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.status === "Payment verified") {
              localStorage.removeItem("checkoutItems");
              setProducts([]);
              await loadOrderHistory();
              toast.success("Payment successful! Order placed.");
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err) {
            console.error(err);
            toast.error("Error verifying payment.");
          }
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (resp: RazorpayErrorResponse) => {
        toast.error("Payment failed: " + resp.error.description);
      });

      rzp.open();
    } catch (error) {
      console.error("Error during payment:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <Navbar />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-[#F5F5F5]">
      {/* Cinematic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-[#FF6B00]/10 blur-[140px] rounded-full"></div>

        <div className="absolute bottom-0 right-[-10%] w-[500px] h-[500px] bg-[#E11D48]/10 blur-[140px] rounded-full"></div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,107,0,0.08),transparent_40%)]"></div>
      </div>

      <Navbar />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="uppercase tracking-[0.35em] text-[#FF6B00] text-xs mb-4">
            Kazuha Closet Checkout
          </p>

          <div className="w-40 h-[2px] bg-gradient-to-r from-transparent via-[#FF6B00] to-transparent mx-auto mt-8"></div>
        </div>

        {products.length > 0 && (
          <>
            {/* Address Form */}
            <div className="mb-10 grid gap-5">
              <div>
                <label className="block mb-3 text-sm tracking-wide text-zinc-400 uppercase">
                  Delivery Address
                </label>

                <input
                  type="text"
                  placeholder="Enter your delivery address"
                  className="w-full bg-[#111111]/80 border border-zinc-800 focus:border-[#FF6B00]/60 focus:ring-4 focus:ring-[#FF6B00]/10 rounded-2xl px-5 py-4 outline-none transition-all duration-300 text-white placeholder:text-zinc-500"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-3 text-sm tracking-wide text-zinc-400 uppercase">
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="Enter your 10-digit phone number"
                  className="w-full bg-[#111111]/80 border border-zinc-800 focus:border-[#FF6B00]/60 focus:ring-4 focus:ring-[#FF6B00]/10 rounded-2xl px-5 py-4 outline-none transition-all duration-300 text-white placeholder:text-zinc-500"
                  value={phone}
                  onChange={handlePhoneChange}
                  maxLength={10}
                />

                {phone && phone.length < 10 && (
                  <p className="text-red-400 text-sm mt-2">
                    Phone number must be 10 digits ({phone.length}/10)
                  </p>
                )}
              </div>
            </div>

            {/* Product Cards */}
            <div className="space-y-6">
              {products.map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-[#111111] to-[#18181B] p-4 sm:p-6 shadow-[0_0_40px_rgba(0,0,0,0.4)] hover:border-[#FF6B00]/40 transition-all duration-500"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-[#FF6B00]/5 to-[#E11D48]/5"></div>

                  <div className="relative flex flex-col sm:flex-row gap-5">
                    <div className="relative w-full sm:w-44 h-72 sm:h-44 overflow-hidden rounded-2xl border border-zinc-800">
                      <Image
                        src={
                          item.images[0]?.url?.startsWith("/")
                            ? item.images[0].url
                            : `/${item.images[0]?.url}` || "/fallback.jpg"
                        }
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">
                          {item.name}
                        </h2>

                        <p className="text-zinc-400 leading-relaxed mb-4">
                          {item.description}
                        </p>

                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
                            Qty: {item.quantity}
                          </span>

                          <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
                            Size: {item.size}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between">
                        <p className="text-zinc-400">
                          ₹{cleanPrice(item.price)} each
                        </p>

                        <p className="text-2xl font-black bg-gradient-to-r from-[#FF6B00] to-[#E11D48] bg-clip-text text-transparent">
                          ₹{cleanPrice(item.price) * item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-10 rounded-3xl border border-zinc-800 bg-[#111111]/90 backdrop-blur-xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.45)]">
              {bundleMessage && (
                <div className="mb-6 rounded-2xl border border-[#FF6B00]/20 bg-[#FF6B00]/10 p-4 text-center text-[#FFB067] font-semibold">
                  {bundleMessage}
                </div>
              )}

              <div className="space-y-5">
                <div className="flex justify-between text-zinc-300 text-lg">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-400 text-lg">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>

                <div className="flex justify-between items-center">
                  <h2 className="text-2xl sm:text-4xl font-black">
                    Final Total
                  </h2>

                  <span className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-[#FF6B00] to-[#E11D48] bg-clip-text text-transparent">
                    ₹{total}
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                disabled={!address.trim() || phone.length !== 10}
                className="w-full mt-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FF6B00] to-[#E11D48] py-4 text-lg font-bold uppercase tracking-wide transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(255,107,0,0.45)] disabled:opacity-50 disabled:hover:scale-100"
              >
                Proceed To Payment
              </button>
            </div>
          </>
        )}

        {/* Order History */}
        <div className="mt-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-zinc-800"></div>

            <h2 className="text-3xl font-black uppercase tracking-wider">
              Order History
            </h2>

            <div className="h-px flex-1 bg-zinc-800"></div>
          </div>

          {loadingHistory ? (
            <p className="text-zinc-500">Loading...</p>
          ) : orders.length === 0 ? (
            <div className="rounded-3xl border border-zinc-800 bg-[#111111]/70 p-10 text-center">
              <p className="text-zinc-400">
                No past orders found.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-[#111111] to-[#18181B] p-5 hover:border-[#FF6B00]/30 transition-all duration-500"
                >
                  <div className="flex gap-5">
                    {order.cart.items[0]?.images?.[0]?.url && (
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-zinc-800">
                        <Image
                          src={
                            order.cart.items[0].images[0].url.startsWith("/")
                              ? order.cart.items[0].images[0].url
                              : `/${order.cart.items[0].images[0].url}`
                          }
                          alt={order.cart.items[0].name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="flex-1">
                      <p className="text-[#FF6B00] font-semibold mb-2">
                        Payment ID: {order.payment_id}
                      </p>

                      {order.cart.items.map((item, i) => (
                        <p
                          key={i}
                          className="text-white font-medium mb-1"
                        >
                          {item.name}
                          {item.size && ` • Size ${item.size}`}
                          {item.quantity && ` • Qty ${item.quantity}`}
                        </p>
                      ))}

                      <div className="mt-4 flex flex-wrap gap-4 text-sm">
                        <span className="text-zinc-400">
                          {new Date(order.verified_at).toLocaleString()}
                        </span>

                        <span className="text-green-400 font-semibold">
                          ₹{order.amount}
                        </span>

                        <span className="text-zinc-300 uppercase tracking-wide">
                          {order.payment_status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {products.length === 0 && orders.length === 0 && (
          <div className="flex flex-col items-center text-center mt-24">
            <div className="relative">
              <div className="absolute inset-0 bg-[#FF6B00]/20 blur-3xl rounded-full"></div>

              <Image
                src="/videos/emptycart.gif"
                alt="Empty Cart"
                width={220}
                height={220}
                className="relative rounded-3xl"
              />
            </div>

            <h1 className="text-4xl font-black mt-10">
              No Orders Yet
            </h1>

            <p className="text-zinc-400 mt-4 max-w-md leading-relaxed">
              Your anime collection journey starts here.
              Explore premium drops from Kazuha Closet.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}