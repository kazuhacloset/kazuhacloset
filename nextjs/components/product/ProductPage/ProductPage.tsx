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

  const isLoggedIn = () => !!localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
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
    if (!selectedSize) return toast.error("Select size first");
    if (!currentProduct) return toast.error("Product data missing");

    try {
      const payload = { product_id: currentProduct.id, quantity, size: selectedSize };
      await addProducttoCart(payload);
      toast.success("Product added to cart!");
    } catch {
      toast.error("Failed to add product.");
    }
  };

  const handleBuyNow = () => {
    if (!isLoggedIn()) return router.push("/login");
    if (!selectedSize) return toast.error("Select size first");
    if (!currentProduct) return;

    const productToBuy = { ...currentProduct, quantity, size: selectedSize };
    localStorage.setItem("checkoutItems", JSON.stringify([productToBuy]));
    router.push("/order-summary");
  };

  if (!currentProduct) return null;

  return (
    <main className="relative bg-gradient-to-bl from-black to-neutral-500 min-h-screen text-white">
      <Navbar />
      <div className="pt-[100px] pb-10 px-3 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
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
    </main>
  );
}
