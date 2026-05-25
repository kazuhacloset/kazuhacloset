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
      parseInt(product.originalPrice)) * 100
  );

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={15}
        style={{
          fill: i < Math.floor(rating) ? "#FF6B00" : "none",
          color: i < Math.floor(rating) ? "#FF6B00" : "#2A2A2A",
        }}
      />
    ));

  return (
    <>
      <style>{`
        .pinfo-root {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .pinfo-category {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #FF6B00;
          opacity: 0.8;
        }

        .pinfo-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2rem, 5vw, 3.4rem);
          color: #F5F5F5;
          line-height: 1;
          letter-spacing: 0.04em;
        }

        .pinfo-stars {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .pinfo-rating-val {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 13px;
          color: #FF6B00;
        }

        .pinfo-price-row {
          display: flex;
          align-items: baseline;
          gap: 12px;
          flex-wrap: wrap;
        }
        .pinfo-price {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: clamp(1.6rem, 4vw, 2.2rem);
          color: #F5F5F5;
          letter-spacing: 0.02em;
        }
        .pinfo-orig {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          color: #3a3a3a;
          text-decoration: line-through;
        }
        .pinfo-discount {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 13px;
          color: #E11D48;
          background: rgba(225,29,72,0.12);
          border: 1px solid rgba(225,29,72,0.3);
          padding: 3px 10px;
          border-radius: 6px;
        }

        .pinfo-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #71717A;
          line-height: 1.7;
          border-left: 2px solid rgba(255,107,0,0.3);
          padding-left: 14px;
        }

        .pinfo-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
        }
      `}</style>

      <div className="pinfo-root">
        {/* Category */}
        <p className="pinfo-category">{product.category}</p>

        {/* Name */}
        <h1 className="pinfo-name">{product.name}</h1>

        {/* Stars */}
        <div className="pinfo-stars">
          <div style={{ display: "flex", gap: 3 }}>{renderStars(product.rating)}</div>
          <span className="pinfo-rating-val">{product.rating}</span>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#3a3a3a" }}>/ 5.0</span>
        </div>

        <div className="pinfo-divider" />

        {/* Price */}
        <div className="pinfo-price-row">
          <span className="pinfo-price">₹{product.price}</span>
          <span className="pinfo-orig">₹{product.originalPrice}</span>
          <span className="pinfo-discount">−{discountPercentage}% OFF</span>
        </div>

        {/* Description */}
        <p className="pinfo-desc">{product.description}</p>

        <div className="pinfo-divider" />

        {/* Size */}
        <SizeSelector selectedSize={selectedSize} setSelectedSize={setSelectedSize} />

        {/* Quantity */}
        <QuantitySelector quantity={quantity} setQuantity={setQuantity} />

        {/* Buttons */}
        <ActionButtons handleAddToCart={handleAddToCart} handleBuyNow={handleBuyNow} />

        {/* Tags */}
        <Tags tags={product.tags} />

        {/* Features */}
        <Features />
      </div>
    </>
  );
}