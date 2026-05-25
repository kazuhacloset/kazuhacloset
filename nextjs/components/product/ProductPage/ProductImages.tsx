"use client";
import Image from "next/image";

type Props = {
  images: { url: string; alt: string }[];
  mainImage: string;
  setMainImage: (img: string) => void;
  name: string;
};

export default function ProductImages({ images, mainImage, setMainImage, name }: Props) {
  return (
    <>
      <style>{`
        .pi-main-wrap {
          width: 100%;
          aspect-ratio: 1 / 1;
          max-height: 520px;
          background: #0a0a0a;
          border: 1px solid rgba(255,107,0,0.15);
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 0 0 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,107,0,0.08);
        }
        .pi-main-wrap::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,107,0,0.04) 0%, transparent 60%);
          pointer-events: none;
          z-index: 1;
        }
        .pi-main-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94);
          position: relative;
          z-index: 2;
        }
        .pi-main-wrap:hover .pi-main-img {
          transform: scale(1.04);
        }

        .pi-thumbs {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 16px;
          justify-content: flex-start;
        }
        .pi-thumb-btn {
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
          transition: all 0.25s ease;
          position: relative;
          width: 90px;
          height: 110px;
          background: #0a0a0a;
          cursor: pointer;
          flex-shrink: 0;
        }
        .pi-thumb-btn.active {
          border-color: #FF6B00;
          box-shadow: 0 0 14px rgba(255,107,0,0.25);
          transform: scale(1.05);
        }
        .pi-thumb-btn:not(.active):hover {
          border-color: rgba(255,107,0,0.4);
          transform: scale(1.03);
        }
        .pi-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .pi-thumb-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255,107,0,0.08);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .pi-thumb-btn.active .pi-thumb-overlay {
          opacity: 1;
        }

        @media (max-width: 639px) {
          .pi-thumb-btn { width: 70px; height: 86px; }
          .pi-main-wrap { max-height: 340px; }
        }
      `}</style>

      <div>
        {/* Main image */}
        <div className="pi-main-wrap">
          <Image
            src={mainImage}
            alt={name}
            width={600}
            height={600}
            className="pi-main-img"
            priority
          />
        </div>

        {/* Thumbnails */}
        <div className="pi-thumbs">
          {images.map((img, idx) => {
            const imgUrl = img.url.startsWith("/") ? img.url : `/${img.url}`;
            const isActive = mainImage === imgUrl;
            return (
              <button
                key={idx}
                onClick={() => setMainImage(imgUrl)}
                className={`pi-thumb-btn ${isActive ? "active" : ""}`}
              >
                <Image
                  src={imgUrl}
                  alt={img.alt || `View ${idx + 1}`}
                  width={180}
                  height={220}
                  className="pi-thumb-img"
                />
                <div className="pi-thumb-overlay" />
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}