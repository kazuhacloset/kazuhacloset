"use client";

type Props = {
  selectedSize: string;
  setSelectedSize: (s: string) => void;
};

const sizes = ["S", "M", "L", "XL", "XXL"];

export default function SizeSelector({ selectedSize, setSelectedSize }: Props) {
  return (
    <>
      <style>{`
        .ss-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #A1A1AA;
          margin-bottom: 10px;
        }
        .ss-wrap {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .ss-btn {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: #A1A1AA;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ss-btn:hover:not(.ss-active) {
          border-color: rgba(255,107,0,0.4);
          color: #FF6B00;
          background: rgba(255,107,0,0.06);
        }
        .ss-active {
          background: rgba(255,107,0,0.14);
          border-color: #FF6B00;
          color: #FF6B00;
          box-shadow: 0 0 14px rgba(255,107,0,0.2);
        }
      `}</style>

      <div>
        <p className="ss-label">Select Size</p>
        <div className="ss-wrap">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`ss-btn ${selectedSize === size ? "ss-active" : ""}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}