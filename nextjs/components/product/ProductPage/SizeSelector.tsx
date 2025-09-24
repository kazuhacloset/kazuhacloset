"use client";

type Props = {
  selectedSize: string;
  setSelectedSize: (s: string) => void;
};

export default function SizeSelector({ selectedSize, setSelectedSize }: Props) {
  return (
    <div>
      <h3 className="text-white font-semibold mb-2 text-sm">Select Size</h3>
      <div className="flex gap-2">
        {["S", "M", "L", "XL", "XXL"].map((size) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            className={`px-4 py-2 rounded-xl border transition text-xs sm:text-sm ${
              selectedSize === size
                ? "bg-white text-black font-bold"
                : "border-white/30 text-white hover:bg-white/10"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
