"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/navbar/Navbar";
import toast from "react-hot-toast";

import { getProductDetails, addProducttoCart } from "@/utils/api/productUtils";

import ProductImages from "./ProductImages";
import ProductInfo from "./ProductInfo";
import DetailedDescription from "./DetailedDescription";

type ProductImage = {
  url: string;
  alt: string;
};

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
  images: ProductImage[];
};

export default function ProductPage() {
  const router = useRouter();
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [mainImage, setMainImage] = useState("");

  const isLoggedIn = () => {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("token");
    return token !== null && token.trim() !== "";
  };

  useEffect(() => {
    const fetchData = async () => {
      if (typeof window === "undefined") return;
      const productId = localStorage.getItem("productid");
      if (!productId) return;
      try {
        const data = await getProductDetails(productId);
        if (data) {
          setCurrentProduct(data);
          if (data.images?.length > 0) {
            const imgUrl = data.images[0].url.startsWith("/")
              ? data.images[0].url
              : `/${data.images[0].url}`;
            setMainImage(imgUrl);
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = async () => {
    if (!isLoggedIn()) return router.push("/login");
    if (!selectedSize) { toast.error("Select size first"); return; }
    if (!currentProduct) { toast.error("Product data missing"); return; }
    try {
      const payload = { product_id: currentProduct.id, quantity, size: selectedSize };
      await addProducttoCart(payload);
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add product.");
    }
  };

  const handleBuyNow = () => {
    if (!isLoggedIn()) return router.push("/login");
    if (!selectedSize) { toast.error("Select size first"); return; }
    if (!currentProduct) return;
    const productToBuy = { ...currentProduct, quantity, size: selectedSize };
    localStorage.setItem("checkoutItems", JSON.stringify([productToBuy]));
    router.push("/order-summary");
  };

  if (!currentProduct) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .pp-page {
          background-color: #050505;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          color: #F5F5F5;
        }

        .pp-bg-layer {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .pp-bg-layer::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 50% at 5% 0%, rgba(255,107,0,0.09) 0%, transparent 55%),
            radial-gradient(ellipse 55% 40% at 95% 85%, rgba(225,29,72,0.06) 0%, transparent 55%);
        }
        .pp-bg-layer::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(255,107,0,0.007) 2px, rgba(255,107,0,0.007) 4px
          );
        }

        .pp-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(130px);
          pointer-events: none;
          z-index: 0;
        }
        .pp-orb-1 {
          width: 460px; height: 460px;
          background: radial-gradient(circle, rgba(255,107,0,0.07) 0%, transparent 70%);
          top: -140px; left: -80px;
          animation: pp-drift 22s ease-in-out infinite alternate;
        }
        .pp-orb-2 {
          width: 380px; height: 380px;
          background: radial-gradient(circle, rgba(225,29,72,0.05) 0%, transparent 70%);
          bottom: 5%; right: -80px;
          animation: pp-drift 17s ease-in-out infinite alternate-reverse;
        }
        @keyframes pp-drift {
          0% { transform: translate(0,0) scale(1); }
          100% { transform: translate(25px,18px) scale(1.08); }
        }

        .pp-content {
          position: relative;
          z-index: 1;
        }

        .pp-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #FF6B00;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .pp-eyebrow::before {
          content: '';
          display: inline-block;
          width: 18px; height: 1px;
          background: #FF6B00;
        }

        .pp-fade-in {
          animation: pp-fade-up 0.6s ease both;
        }
        @keyframes pp-fade-up {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <main className="pp-page">
        <div className="pp-bg-layer" />
        <div className="pp-orb pp-orb-1" />
        <div className="pp-orb pp-orb-2" />

        <Navbar />

        <div className="pp-content pp-fade-in" style={{ paddingTop: 100, paddingBottom: 60, paddingLeft: 16, paddingRight: 16, maxWidth: 1280, margin: "0 auto" }}>

          {/* Breadcrumb */}
          <div className="pp-eyebrow" style={{ marginBottom: 28 }}>
            Kazuha Closet · {currentProduct.category} · {currentProduct.name}
          </div>

          {/* Main layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 40 }}
            className="lg-two-col">

            <ProductImages
              images={currentProduct.images}
              mainImage={mainImage}
              setMainImage={setMainImage}
              name={currentProduct.name}
            />

            <ProductInfo
              product={currentProduct}
              quantity={quantity}
              setQuantity={setQuantity}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              handleAddToCart={handleAddToCart}
              handleBuyNow={handleBuyNow}
            />
          </div>

          <DetailedDescription description={currentProduct.detailedDescription} />
        </div>

        <style>{`
          @media (min-width: 1024px) {
            .lg-two-col { grid-template-columns: 1fr 1fr !important; }
          }
        `}</style>
      </main>
    </>
  );
}