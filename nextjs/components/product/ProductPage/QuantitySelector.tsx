"use client";
import { Minus, Plus } from "lucide-react";

type Props = {
  quantity: number;
  setQuantity: (q: number) => void;
};

export default function QuantitySelector({ quantity, setQuantity }: Props) {
  return (
    <div>
      <h3 className="text-white font-semibold mb-2 text-sm">Quantity</h3>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="p-2 bg-black/40 rounded-l-xl border border-white/20"
        >
          <Minus />
        </button>
        <span className="px-4 text-sm">{quantity}</span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="p-2 bg-black/40 rounded-r-xl border border-white/20"
        >
          <Plus />
        </button>
      </div>
    </div>
  );
}
