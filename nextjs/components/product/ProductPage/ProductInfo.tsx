"use client";
import { Star } from "lucide-react";
import SizeSelector from "./SizeSelector";
import QuantitySelector from "./QuantitySelector";
import ActionButtons from "./ActionButtons";
import Tags from "./Tags";
import Features from "./Features";

type Product = {
  id: string;
  name: string;
  price: string;
  originalPrice: string;
  description: string;
  category: string;
  rating: number;
  tags: string[];
};

type Props = {
  product: Product;
  quantity: number;
  setQuantity: (q: number) => void;
  selectedSize: string;
  setSelectedSize: (s: string) => void;
  handleAddToCart: () => void;
  handleBuyNow: () => void;
};

export default function ProductInfo({
  product,
  quantity,
  setQuantity,
  selectedSize,
  setSelectedSize,
  handleAddToCart,
  handleBuyNow,
}: Props) {
  const discountPercentage = Math.round(
    ((parseInt(product.originalPrice) - parseInt(product.price)) /
      parseInt(product.originalPrice)) *
      100
  );

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-white text-white" : "text-gray-400"}`}
      />
    ));

  return (
    <div className="space-y-5 text-sm sm:text-base">
      <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold">{product.name}</h1>
      <p className="text-gray-400 text-xs sm:text-sm">{product.category}</p>

      <div className="flex items-center gap-2">
        <div className="flex">{renderStars(product.rating)}</div>
        <span className="text-white font-semibold text-xs sm:text-sm">{product.rating}</span>
      </div>

      {/* Price Section */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xl sm:text-3xl font-bold text-white">₹{product.price}</span>
        <span className="text-sm sm:text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
        <span className="text-green-400 font-semibold text-xs sm:text-base">{discountPercentage}% OFF</span>
      </div>

      <p className="text-gray-300 text-xs sm:text-base">{product.description}</p>

      <SizeSelector selectedSize={selectedSize} setSelectedSize={setSelectedSize} />
      <QuantitySelector quantity={quantity} setQuantity={setQuantity} />

      <ActionButtons handleAddToCart={handleAddToCart} handleBuyNow={handleBuyNow} />

      <Tags tags={product.tags} />
      <Features />
    </div>
  );
}
