"use client";
import { Minus, Plus } from "lucide-react";

type Props = {
  quantity: number;
  setQuantity: (q: number) => void;
};

export default function QuantitySelector({ quantity, setQuantity }: Props) {
  return (
    <>
      <style>{`
        .qs-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #A1A1AA;
          margin-bottom: 10px;
        }
        .qs-wrap {
          display: flex;
          align-items: center;
          gap: 0;
          width: fit-content;
          background: rgba(10,10,10,0.9);
          border: 1px solid rgba(255,107,0,0.2);
          border-radius: 12px;
          overflow: hidden;
        }
        .qs-btn {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: #FF6B00;
          cursor: pointer;
          transition: background 0.2s;
        }
        .qs-btn:hover {
          background: rgba(255,107,0,0.1);
        }
        .qs-btn:disabled {
          color: #2A2A2A;
          cursor: not-allowed;
        }
        .qs-sep {
          width: 1px;
          height: 24px;
          background: rgba(255,107,0,0.15);
        }
        .qs-val {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 15px;
          color: #F5F5F5;
          min-width: 44px;
          text-align: center;
        }
      `}</style>

      <div>
        <p className="qs-label">Quantity</p>
        <div className="qs-wrap">
          <button
            className="qs-btn"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus size={15} />
          </button>
          <div className="qs-sep" />
          <span className="qs-val">{quantity}</span>
          <div className="qs-sep" />
          <button
            className="qs-btn"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus size={15} />
          </button>
        </div>
      </div>
    </>
  );
}