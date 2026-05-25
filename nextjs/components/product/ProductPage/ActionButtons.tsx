"use client";
import { ShoppingCart, Zap } from "lucide-react";

type Props = {
  handleAddToCart: () => void;
  handleBuyNow: () => void;
};

export default function ActionButtons({ handleAddToCart, handleBuyNow }: Props) {
  return (
    <>
      <style>{`
        .ab-wrap {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }
        @media (min-width: 480px) {
          .ab-wrap { flex-direction: row; }
        }

        .ab-cart {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 20px;
          border-radius: 12px;
          border: 1px solid rgba(255,107,0,0.4);
          background: rgba(255,107,0,0.07);
          color: #FF6B00;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .ab-cart:hover {
          background: rgba(255,107,0,0.15);
          border-color: #FF6B00;
          box-shadow: 0 0 24px rgba(255,107,0,0.18);
          transform: translateY(-2px);
        }

        .ab-buy {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 20px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #FF6B00 0%, #E11D48 100%);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .ab-buy::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #FF8533 0%, #FF1F57 100%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .ab-buy:hover::before { opacity: 1; }
        .ab-buy:hover {
          box-shadow: 0 0 30px rgba(255,107,0,0.3), 0 6px 20px rgba(225,29,72,0.25);
          transform: translateY(-2px);
        }
        .ab-buy span, .ab-buy svg { position: relative; z-index: 1; }
      `}</style>

      <div className="ab-wrap">
        <button className="ab-cart" onClick={handleAddToCart}>
          <ShoppingCart size={16} />
          <span>Add to Cart</span>
        </button>
        <button className="ab-buy" onClick={handleBuyNow}>
          <Zap size={16} />
          <span>Buy Now</span>
        </button>
      </div>
    </>
  );
}