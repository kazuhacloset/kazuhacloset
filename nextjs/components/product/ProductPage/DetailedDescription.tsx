"use client";

type Props = {
  description: string;
};

export default function DetailedDescription({ description }: Props) {
  return (
    <>
      <style>{`
        .dd-wrap {
          margin-top: 48px;
          background: rgba(14,14,14,0.95);
          border: 1px solid rgba(255,107,0,0.12);
          border-radius: 20px;
          padding: 32px;
          backdrop-filter: blur(20px);
          box-shadow: 0 0 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,107,0,0.06);
          position: relative;
          overflow: hidden;
        }
        .dd-wrap::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(to right, #FF6B00, #E11D48, transparent);
        }
        .dd-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #FF6B00;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .dd-eyebrow::before {
          content: '';
          display: inline-block;
          width: 16px; height: 1px;
          background: #FF6B00;
        }
        .dd-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          color: #F5F5F5;
          letter-spacing: 0.06em;
          margin-bottom: 16px;
        }
        .dd-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #71717A;
          line-height: 1.8;
        }

        @media (max-width: 639px) {
          .dd-wrap { padding: 20px 16px; margin-top: 32px; }
        }
      `}</style>

      <div className="dd-wrap">
        <p className="dd-eyebrow">Product Details</p>
        <h2 className="dd-title">About This Piece</h2>
        <p className="dd-text">{description}</p>
      </div>
    </>
  );
}