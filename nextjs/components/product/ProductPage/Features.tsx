"use client";
import { Sparkles, Shirt, Scale3D, Ruler } from "lucide-react";

export default function Features() {
  const features = [
    { icon: Sparkles, text: "Durable Print", color: "text-purple-400" },
    { icon: Shirt, text: "Soft Cotton", color: "text-blue-400" },
    { icon: Scale3D, text: "Unisex Fit", color: "text-green-400" },
    { icon: Ruler, text: "180 GSM", color: "text-yellow-400" },
  ];

  return (
    <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
      {features.map(({ icon: Icon, text, color }, idx) => (
        <div
          key={idx}
          className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl flex flex-col items-center text-center"
        >
          <Icon className={`w-6 h-6 mb-2 ${color}`} />
          <p className="text-sm font-semibold">{text}</p>
        </div>
      ))}
    </div>
  );
}
