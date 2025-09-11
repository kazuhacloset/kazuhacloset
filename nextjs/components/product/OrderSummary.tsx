"use client";

import React, {  useEffect, useState } from "react";
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



// ---------------- Types ----------------
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




// ---------------- Component ----------------
export default function OrderSummary() {
  const [products, setProducts] = useState<OrderItem[]>([]);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [user, setUser] = useState<User | null>(null);

// FETCH USER DATA
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const fetcheduser = await getUser();
        setUser(fetcheduser)
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
    parseFloat(price.replace(/[^0-9.]/g, ""));

  const total = products.reduce(
    (sum, item) => sum + cleanPrice(item.price) * item.quantity,
    0
  );

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
        theme: { color: "#FBBF24" },
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
      <main className="bg-black text-white min-h-screen px-4 py-6">
        <Navbar />
        <div className="max-w-5xl mx-auto pt-16">Loading...</div>
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

        {products.length > 0 && (
          <>
            {/* Address & Phone inputs */}
            <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-300">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Enter your delivery address"
                  className="w-full p-3 rounded-lg bg-gray-200 text-black focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm sm:text-base"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-300">
                  Phone No.
                </label>
                <input
                  type="tel"
                  placeholder="Enter your 10-digit phone number"
                  className="w-full p-3 rounded-lg bg-gray-200 text-black focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm sm:text-base"
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

            {/* Current Order Items */}
            {products.map((item) => (
              <div
                key={item.id}
                className="bg-[#1e1e1e] rounded-xl mb-6 p-3 flex flex-row gap-3 shadow-lg"
              >
                <div className="w-28 h-28 sm:w-40 sm:h-40 flex-shrink-0">
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

                <div className="flex-1 space-y-1">
                  <h2 className="text-base sm:text-lg md:text-2xl font-semibold">
                    {item.name}
                  </h2>
                  <p className="hidden sm:block text-gray-400 text-sm italic truncate max-w-[240px]">
                    {item.description || "No description available."}
                  </p>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    Price: ₹{cleanPrice(item.price)}
                  </p>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    Size: {item.size}
                  </p>
                  <p className="text-white font-semibold text-sm sm:text-base">
                    Subtotal: ₹{cleanPrice(item.price) * item.quantity}
                  </p>
                </div>
              </div>
            ))}

            <div className="bg-[#1e1e1e] mt-6 p-4 rounded-xl flex justify-between items-center">
              <h3 className="text-lg sm:text-2xl font-bold">
                Total: <span className="text-yellow-400">₹{total}</span>
              </h3>
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={handleProceedToCheckout}
                disabled={!address.trim() || phone.length !== 10}
                className="bg-yellow-400 text-black font-bold px-8 py-3 rounded-xl hover:bg-yellow-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                Payment
              </button>
            </div>
          </>
        )}

        {/* Order History Section */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Order History</h2>

          {loadingHistory ? (
            <p className="text-gray-400">Loading...</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-500">No past orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order, idx) => (
                <div
                  key={idx}
                  className="bg-[#1e1e1e] rounded-xl p-4 shadow-md"
                >
                  <div className="flex gap-4">
                    {order.cart.items[0]?.images?.[0]?.url && (
                      <div className="w-16 h-16 flex-shrink-0">
                        <Image
                          src={
                            order.cart.items[0].images[0].url.startsWith("/")
                              ? order.cart.items[0].images[0].url
                              : `/${order.cart.items[0].images[0].url}`
                          }
                          alt={order.cart.items[0].name || "Product"}
                          width={64}
                          height={64}
                          className="rounded-lg object-cover w-full h-full"
                          onError={(e) => {
                            e.currentTarget.src = "/fallback.jpg";
                          }}
                        />
                      </div>
                    )}

                    <div className="flex-1">
                      <p className="text-yellow-400 font-semibold">
                        Payment ID: {order.payment_id}
                      </p>

                      {order.cart.items.length > 0 ? (
                        order.cart.items.map((item, i) => (
                          <p key={i} className="text-white font-medium">
                            {item.name || "Product"}
                            {item.size && ` (Size: ${item.size})`}
                            {item.quantity && `, Qty: ${item.quantity}`}
                          </p>
                        ))
                      ) : (
                        <p className="text-gray-400">
                          Order details not available
                        </p>
                      )}

                      <p className="text-gray-300">
                        Status: {order.payment_status}
                      </p>
                      <p className="text-gray-300">
                        Paid At: {new Date(order.verified_at).toLocaleString()}
                      </p>
                      <p className="text-green-400 font-semibold">
                        Total: ₹{order.amount}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {products.length === 0 && orders.length === 0 && (
          <div className="flex flex-col items-center text-center mt-16">
            <Image
              src="/videos/emptycart.gif"
              alt="Empty Cart"
              width={160}
              height={160}
              className="rounded-xl shadow-xl object-contain"
            />
            <h1 className="text-2xl font-bold mt-6">No Orders</h1>
            <p className="text-gray-400 text-base mt-2 max-w-sm">
              No current orders or order history found.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
