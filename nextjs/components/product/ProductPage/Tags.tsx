"use client";

type Props = {
  tags: string[];
};

export default function Tags({ tags }: Props) {
  return (
    <>
      <style>{`
        .tags-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .tag-pill {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.06em;
          color: #71717A;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          padding: 5px 12px;
          border-radius: 999px;
          transition: all 0.2s;
          cursor: default;
        }
        .tag-pill:hover {
          border-color: rgba(255,107,0,0.3);
          color: #FF6B00;
          background: rgba(255,107,0,0.05);
        }
      `}</style>

      <div className="tags-wrap">
        {tags.map((tag, i) => (
          <span key={i} className="tag-pill">#{tag}</span>
        ))}
      </div>
    </>
  );
}