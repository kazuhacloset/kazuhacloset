"use client";
import { Sparkles, Shirt, Layers, Ruler } from "lucide-react";

const features = [
  { icon: Sparkles, text: "Durable Print",  accent: "#FF6B00" },
  { icon: Shirt,    text: "Soft Cotton",    accent: "#FF6B00" },
  { icon: Layers,   text: "Unisex Fit",     accent: "#E11D48" },
  { icon: Ruler,    text: "180 GSM",        accent: "#E11D48" },
];

export default function Features() {
  return (
    <>
      <style>{`
        .feat-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 4px;
        }
        @media (min-width: 480px) {
          .feat-grid { grid-template-columns: repeat(4, 1fr); }
        }
        .feat-card {
          background: rgba(14,14,14,0.9);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px;
          padding: 14px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-align: center;
          transition: border-color 0.25s, transform 0.25s;
        }
        .feat-card:hover {
          border-color: rgba(255,107,0,0.2);
          transform: translateY(-3px);
        }
        .feat-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .feat-text {
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          font-size: 11px;
          color: #A1A1AA;
          letter-spacing: 0.04em;
        }
      `}</style>

      <div className="feat-grid">
        {features.map(({ icon: Icon, text, accent }, idx) => (
          <div key={idx} className="feat-card">
            <div
              className="feat-icon-wrap"
              style={{ background: `${accent}14`, border: `1px solid ${accent}28` }}
            >
              <Icon size={16} style={{ color: accent }} />
            </div>
            <p className="feat-text">{text}</p>
          </div>
        ))}
      </div>
    </>
  );
}